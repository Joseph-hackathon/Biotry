import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Biotry database...');

  // --- HUBS ---
  const hubs = [
    { id: '1', name: 'Bioinformatics', icon: 'Binary', count: 124 },
    { id: '2', name: 'Genomics', icon: 'Microscope', count: 85 },
    { id: '3', name: 'AI Safety', icon: 'ShieldCheck', count: 62 },
    { id: '4', name: 'Neuroscience', icon: 'Activity', count: 45 },
    { id: '5', name: 'Infrastructure', icon: 'Server', count: 38 }
  ];

  for (const hub of hubs) {
    await prisma.hub.upsert({
      where: { name: hub.name },
      update: { icon: hub.icon, count: hub.count },
      create: { name: hub.name, icon: hub.icon, count: hub.count }
    });
  }

  // --- EDITORS ---
  const editors = [
    { id: '1', name: 'Ruslan Rust, PhD', role: 'Senior Editor', institution: 'University of Southern California', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ruslan' },
    { id: '2', name: 'Attila Karsi, PhD', role: 'Senior Editor', institution: 'Mississippi State University', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Attila' },
    { id: '3', name: 'Selda Yildiz, PhD', role: 'Associate Editor', institution: 'Oregon Health & Science University', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Selda' },
    { id: '4', name: 'Scott Nelson, PhD', role: 'Associate Editor', institution: 'Iowa State University', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Scott' },
    { id: '5', name: 'Qingyu Luo, MD, PhD', role: 'Associate Editor', institution: 'Harvard University', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Qingyu' }
  ];

  for (const editor of editors) {
    await prisma.editor.upsert({
      where: { id: editor.id },
      update: editor,
      create: editor
    });
  }

  // --- TOP CONTRIBUTORS ---
  const contributors = [
    { id: '1', name: 'vitalik.eth', points: 4200, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=vitalik' },
    { id: '2', name: 'dr_bio', points: 3850, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dr_bio' },
    { id: '3', name: 'research_ninja', points: 3100, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ninja' },
    { id: '4', name: 'quant_scie', points: 2900, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=quant' }
  ];

  for (const con of contributors) {
    await prisma.leaderboardEntry.upsert({
      where: { name: con.name },
      update: { points: con.points, avatar: con.avatar },
      create: { name: con.name, points: con.points, avatar: con.avatar }
    });
  }

  // --- POSTS ---
  const posts = [
    {
      id: '1',
      author: 'vitalik.eth',
      researchField: 'Bioinformatics',
      type: 'Research',
      title: 'Verifiable Research Graphs: Solving the Peer Review Crisis with ZK-Proofs',
      doi: '10.1038/s41586-024-07153-x',
      abstract: 'Peer review is currently opaque and centralized. We propose a decentralized graph where every citation and review is cryptographically linked to the author\'s expertise weight.',
      content: 'The current scientific publishing model faces a severe trust crisis. By introducing on-chain expertise weights and quadratic funding via Bio Protocol, we can ensure that high-impact research is funded directly by the community.',
      upvotes: 42000,
      commentCount: 124,
      topics: ['ZK-Proofs', 'Peer Review', 'Social Graph'],
      license: 'CC-BY',
      status: 'Published'
    },
    {
        id: '2',
        author: 'ox_critic',
        researchField: 'Genomics',
        type: 'Critique',
        title: 'Critique: Flaws in the "Open Source Genomics" Methodology on Solana',
        doi: '10.1101/2024.02.14.579124',
        abstract: 'Our analysis reveals significant data sampling bias in the recent "Q3 Funding Wave" proposal.',
        content: 'While the Bio Foundation\'s latest funding wave is ambitious, the underlying data layer for the genomics pool has significant latency issues.',
        upvotes: 8500,
        commentCount: 56,
        topics: ['Genomics', 'Open Source', 'Solana'],
        license: 'Apache-2.0',
        status: 'In-Review'
    }
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: { ...post, timestamp: BigInt(Date.now()) },
      create: { ...post, timestamp: BigInt(Date.now()) }
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
