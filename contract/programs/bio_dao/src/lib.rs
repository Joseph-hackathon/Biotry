use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y");

// Constants
const MAX_USERNAME_LEN: usize = 32;
const MAX_BIO_LEN:      usize = 200;
const MAX_TITLE_LEN:    usize = 200;
const MAX_CONTENT_URI_LEN: usize = 256; 

#[program]
pub mod bio_dao {
    use super::*;

    /// Initialize the global DAO configuration
    pub fn initialize_dao(ctx: Context<InitializeDao>, name: String) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.name = name;
        config.member_count = 0;
        config.proposal_count = 0;
        config.bump = ctx.bumps.config;
        msg!("BioDAO initialized: {}", config.name);
        Ok(())
    }

    /// Register a new member and create their profile
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        bio: String,
    ) -> Result<()> {
        require!(username.len() <= MAX_USERNAME_LEN, BioError::UsernameTooLong);
        require!(bio.len() <= MAX_BIO_LEN, BioError::BioTooLong);

        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.owner.key();
        profile.username = username;
        profile.bio = bio;
        profile.reputation = 0;
        profile.joined_at = Clock::get()?.unix_timestamp;
        profile.bump = ctx.bumps.profile;

        let config = &mut ctx.accounts.config;
        config.member_count += 1;

        msg!("Profile created for: {}", profile.username);
        Ok(())
    }

    /// Submit a research proposal for funding or review
    pub fn submit_proposal(
        ctx: Context<SubmitProposal>,
        title: String,
        content_uri: String,
        funding_goal: u64,
    ) -> Result<()> {
        require!(title.len() <= MAX_TITLE_LEN, BioError::TitleTooLong);
        require!(content_uri.len() <= MAX_CONTENT_URI_LEN, BioError::UriTooLong);

        let proposal = &mut ctx.accounts.proposal;
        let config = &mut ctx.accounts.config;

        proposal.id = config.proposal_count;
        proposal.author = ctx.accounts.author.key();
        proposal.title = title;
        proposal.content_uri = content_uri;
        proposal.funding_goal = funding_goal;
        proposal.amount_raised = 0;
        proposal.amount_claimed = 0;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.status = ProposalStatus::Active;
        proposal.created_at = Clock::get()?.unix_timestamp;
        proposal.bump = ctx.bumps.proposal;

        // Initialize 3-stage milestones: 30% / 40% / 30%
        proposal.milestones = [
            Milestone { proof_uri: "".to_string(), percentage: 30, is_claimed: false },
            Milestone { proof_uri: "".to_string(), percentage: 40, is_claimed: false },
            Milestone { proof_uri: "".to_string(), percentage: 30, is_claimed: false },
        ];

        config.proposal_count += 1;

        msg!("Proposal #{} submitted: {}", proposal.id, proposal.title);
        Ok(())
    }

    /// Submit proof of work for a specific milestone
    pub fn submit_milestone_proof(
        ctx: Context<UpdateMilestone>,
        milestone_index: u8,
        proof_uri: String
    ) -> Result<()> {
        require!(milestone_index < 3, BioError::InvalidMilestoneIndex);
        require!(proof_uri.len() <= MAX_CONTENT_URI_LEN, BioError::UriTooLong);

        let proposal = &mut ctx.accounts.proposal;
        require!(ctx.accounts.author.key() == proposal.author, BioError::Unauthorized);

        proposal.milestones[milestone_index as usize].proof_uri = proof_uri;
        msg!("Proof uploaded for milestone #{} of proposal #{}", milestone_index, proposal.id);
        Ok(())
    }

    /// Claim funds for a completed milestone (split disbursement)
    pub fn claim_milestone_funds(
        ctx: Context<UpdateMilestone>,
        milestone_index: u8
    ) -> Result<()> {
        require!(milestone_index < 3, BioError::InvalidMilestoneIndex);
        
        let proposal = &mut ctx.accounts.proposal;
        let author = &ctx.accounts.author;

        require!(author.key() == proposal.author, BioError::Unauthorized);
        
        let milestone = &mut proposal.milestones[milestone_index as usize];
        require!(!milestone.is_claimed, BioError::AlreadyClaimed);
        require!(!milestone.proof_uri.is_empty(), BioError::ProofRequired);
        
        // Safety: Only allow claims once funding is successfully completed (e.g. 100% reached)
        // For hackathon flexibility, we check if amount_raised >= funding_goal
        require!(proposal.amount_raised >= proposal.funding_goal, BioError::FundingIncomplete);

        let claim_amount = proposal.amount_raised
            .checked_mul(milestone.percentage as u64)
            .unwrap()
            .checked_div(100)
            .unwrap();

        milestone.is_claimed = true;
        proposal.amount_claimed += claim_amount;

        // Note: Real SOL transfer would involve a vault PDA or direct transfer if funds are on PDA
        // Here we simulate the state update. In full implementation, we'd use invoke(transfer)
        msg!("Claimed {} lamports for milestone #{}", claim_amount, milestone_index);

        Ok(())
    }

    /// Vote on a research proposal
    pub fn vote_on_proposal(ctx: Context<VoteOnProposal>, approve: bool) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_record = &mut ctx.accounts.vote_record;
        let member_profile = &ctx.accounts.member_profile;

        require!(proposal.status == ProposalStatus::Active, BioError::ProposalNotActive);

        vote_record.voter = ctx.accounts.voter.key();
        vote_record.proposal_id = proposal.id;
        vote_record.approve = approve;
        vote_record.weight = 1 + (member_profile.reputation / 100); // Base vote + reputation bonus
        vote_record.bump = ctx.bumps.vote_record;

        if approve {
            proposal.votes_for += vote_record.weight;
        } else {
            proposal.votes_against += vote_record.weight;
        }

        msg!("Vote cast on proposal #{}: {}", proposal.id, if approve { "Approve" } else { "Reject" });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDao<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 32 + 8 + 8 + 1,
        seeds = [b"dao_config"],
        bump
    )]
    pub config: Account<'info, DaoConfig>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + MAX_USERNAME_LEN + 4 + MAX_BIO_LEN + 8 + 8 + 1,
        seeds = [b"member_profile", owner.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, MemberProfile>,
    #[account(
        mut,
        seeds = [b"dao_config"],
        bump = config.bump
    )]
    pub config: Account<'info, DaoConfig>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitProposal<'info> {
    #[account(
        init,
        payer = author,
        // Expanded space for 3 milestones
        space = 8 + 8 + 32 + 4 + MAX_TITLE_LEN + 4 + MAX_CONTENT_URI_LEN + 8 + 8 + 8 + 8 + 8 + 1 + 8 + 1 + (3 * (4 + MAX_CONTENT_URI_LEN + 1 + 1)),
        seeds = [b"proposal", config.proposal_count.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, ResearchProposal>,
    #[account(
        mut,
        seeds = [b"dao_config"],
        bump = config.bump
    )]
    pub config: Account<'info, DaoConfig>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMilestone<'info> {
    #[account(mut, seeds = [b"proposal", proposal.id.to_le_bytes().as_ref()], bump = proposal.bump)]
    pub proposal: Account<'info, ResearchProposal>,
    #[account(mut)]
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct VoteOnProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, ResearchProposal>,
    #[account(
        init,
        payer = voter,
        space = 8 + 32 + 8 + 1 + 8 + 1,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    #[account(
        seeds = [b"member_profile", voter.key().as_ref()],
        bump = member_profile.bump
    )]
    pub member_profile: Account<'info, MemberProfile>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DaoConfig {
    pub authority: Pubkey,
    pub name: String,
    pub member_count: u64,
    pub proposal_count: u64,
    pub bump: u8,
}

#[account]
pub struct MemberProfile {
    pub owner: Pubkey,
    pub username: String,
    pub bio: String,
    pub reputation: u64,
    pub joined_at: i64,
    pub bump: u8,
}

#[account]
pub struct ResearchProposal {
    pub id: u64,
    pub author: Pubkey,
    pub title: String,
    pub content_uri: String,
    pub funding_goal: u64,
    pub amount_raised: u64,
    pub amount_claimed: u64,
    pub votes_for: u64,
    pub votes_against: u64,
    pub status: ProposalStatus,
    pub created_at: i64,
    pub milestones: [Milestone; 3],
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub struct Milestone {
    pub proof_uri: String,
    pub percentage: u8,
    pub is_claimed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Funded,
    Rejected,
    Completed,
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub proposal_id: u64,
    pub approve: bool,
    pub weight: u64,
    pub bump: u8,
}

#[error_code]
pub enum BioError {
    #[msg("Username is too long")]
    UsernameTooLong,
    #[msg("Bio is too long")]
    BioTooLong,
    #[msg("Title is too long")]
    TitleTooLong,
    #[msg("URI is too long")]
    UriTooLong,
    #[msg("Proposal is not in active state")]
    ProposalNotActive,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid milestone index")]
    InvalidMilestoneIndex,
    #[msg("Milestone already claimed")]
    AlreadyClaimed,
    #[msg("Proof of work is required before claiming")]
    ProofRequired,
    #[msg("Funding goal has not been reached")]
    FundingIncomplete,
}
