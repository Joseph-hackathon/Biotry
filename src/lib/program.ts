/**
 * Biotry Solana Program — Frontend Client SDK
 *
 * Usage: import { BiotryProgram } from './lib/program';
 *
 * Setup (after anchor deploy):
 *   1. Replace PROGRAM_ID with the deployed program ID.
 *   2. Copy target/idl/biotry.json → src/lib/biotry_idl.json
 */

import {
    Connection,
    PublicKey,
    SystemProgram,
    clusterApiUrl,
} from '@solana/web3.js';
import { AnchorProvider, Program, BN, web3, Idl } from '@coral-xyz/anchor';
import { useWallets } from '@privy-io/react-auth'; // or @solana/wallet-adapter-react

// ─── Replace after `anchor deploy` ──────────────────────────────
// ─── Replace after `anchor deploy` ──────────────────────────────
export const PROGRAM_ID = new PublicKey('2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y');

// export const connection = new Connection(
//     clusterApiUrl('devnet'),
//     { commitment: 'confirmed' }
// );

// ─── PDA Helpers ────────────────────────────────────────────────
export const findDaoConfigPDA = (): [PublicKey, number] =>
    PublicKey.findProgramAddressSync([Buffer.from('dao_config')], PROGRAM_ID);

export const findMemberProfilePDA = (owner: PublicKey): [PublicKey, number] =>
    PublicKey.findProgramAddressSync(
        [Buffer.from('member_profile'), owner.toBuffer()],
        PROGRAM_ID
    );

export const findProposalPDA = (proposalCount: number): [PublicKey, number] => {
    const countBN = new BN(proposalCount);
    const countBuffer = countBN.toArrayLike(Buffer as any, 'le', 8);
    return PublicKey.findProgramAddressSync(
        [Buffer.from('proposal'), countBuffer],
        PROGRAM_ID
    );
};

export const findVoteRecordPDA = (proposal: PublicKey, voter: PublicKey): [PublicKey, number] =>
    PublicKey.findProgramAddressSync(
        [Buffer.from('vote'), proposal.toBuffer(), voter.toBuffer()],
        PROGRAM_ID
    );

// ─── Program Factory ────────────────────────────────────────────
/**
 * Build an Anchor Program instance from a Privy-connected wallet.
 */
export const buildBioDAOProgram = (walletProvider: any, idl: Idl, connection: Connection): Program => {
    const provider = new AnchorProvider(connection, walletProvider, {
        commitment: 'confirmed',
    });
    return new Program(idl, provider);
};

// ─── Instruction Helpers ────────────────────────────────────────

/** Initialize the DAO */
export const initializeDao = async (program: Program, name: string, authority: PublicKey) => {
    const [configPDA] = findDaoConfigPDA();
    const tx = await (program.methods as any)
        .initializeDao(name)
        .accounts({
            config: configPDA,
            authority,
            systemProgram: SystemProgram.programId,
        })
        .rpc();
    return { tx, configPDA };
};

/** Create a member profile */
export const createProfile = async (
    program: Program,
    params: { owner: PublicKey; username: string; bio: string }
) => {
    const [profilePDA] = findMemberProfilePDA(params.owner);
    const [configPDA] = findDaoConfigPDA();

    const tx = await (program.methods as any)
        .createProfile(params.username, params.bio)
        .accounts({
            profile: profilePDA,
            config: configPDA,
            owner: params.owner,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx, profilePDA };
};

/** Submit a new research proposal */
export const submitProposal = async (
    program: Program,
    params: {
        author: PublicKey;
        title: string;
        contentUri: string;
        fundingGoal: number;
        proposalCount?: number; // Optional now, will fetch if missing
    }
) => {
    const [configPDA] = findDaoConfigPDA();

    // Fetch current count from DAO config if not provided
    let currentCount = params.proposalCount;
    if (currentCount === undefined) {
        try {
            const configAccount = await (program.account as any).daoConfig.fetch(configPDA);
            currentCount = configAccount.proposalCount.toNumber();
        } catch (e) {
            console.error('Failed to fetch DAO config:', e);
            throw new Error('DAO has not been initialized. Please initialize the DAO before submitting research.');
        }
    }

    const [proposalPDA] = findProposalPDA(currentCount!);

    const tx = await (program.methods as any)
        .submitProposal(
            params.title,
            params.contentUri,
            new BN(params.fundingGoal)
        )
        .accounts({
            proposal: proposalPDA,
            config: configPDA,
            author: params.author,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx, proposalPDA };
};

/** Vote on a proposal */
export const voteOnProposal = async (
    program: Program,
    params: {
        voter: PublicKey;
        proposalPDA: PublicKey;
        approve: boolean;
    }
) => {
    const [voteRecordPDA] = findVoteRecordPDA(params.proposalPDA, params.voter);
    const [profilePDA] = findMemberProfilePDA(params.voter);

    const tx = await (program.methods as any)
        .voteOnProposal(params.approve)
        .accounts({
            proposal: params.proposalPDA,
            voteRecord: voteRecordPDA,
            memberProfile: profilePDA,
            voter: params.voter,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    return { tx, voteRecordPDA };
};

/** Fetch a member profile */
export const fetchMemberProfile = async (program: Program, owner: PublicKey) => {
    const [profilePDA] = findMemberProfilePDA(owner);
    try {
        const profile = await (program.account as any).memberProfile.fetch(profilePDA);
        return profile;
    } catch (e) {
        return null;
    }
};

/** Check if a member profile is initialized */
export const isProfileInitialized = async (program: Program, owner: PublicKey) => {
    const [profilePDA] = findMemberProfilePDA(owner);
    try {
        const accountInfo = await program.provider.connection.getAccountInfo(profilePDA);
        return accountInfo !== null;
    } catch (e) {
        return false;
    }
};
