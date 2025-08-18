/*
 Seed 10 job posts with varied skills. Top 3 are strong matches to the sample profile
 (React, TypeScript, Next.js, Redux, Tailwind, Jest, Cypress, GitHub Actions, AWS).
 Run: npm run db:seed:jobs
*/
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }
  console.log('Connecting to MongoDB...');
  const conn = await mongoose.connect(uri);
  console.log('Connected:', conn.connection.name);

  const User = require('../models/User');
  const Post = require('../models/Post');
  const Profile = require('../models/Profile');

  // Find or create a system recruiter user (ensure role)
  let recruiter = await User.findOne({ email: 'recruiter@devlink.io' });
  if (!recruiter) {
    recruiter = await User.create({ name: 'Recruiter', email: 'recruiter@devlink.io', password: 'seeded-hash', role: 'recruiter' });
  } else if (recruiter.role !== 'recruiter') {
    recruiter.role = 'recruiter';
    await recruiter.save();
  }
  // Ensure recruiter profile has org fields for completeness
  await Profile.findOneAndUpdate(
    { user: recruiter._id },
    { $set: { user: recruiter._id, organisationName: 'DevLink Hiring', organisationWebsite: 'https://devlink.example.com' } },
    { upsert: true }
  );

  // Remove existing seeded jobs (optional)
  await Post.deleteMany({ type: 'job' });

  const jobs = [
    // Strong matches (3): heavy overlap with profile
    {
      title: 'Senior Frontend Engineer (React/TypeScript)',
      companyName: 'PixelForge',
      companyWebsite: 'https://pixelforge.example.com',
      location: 'Bengaluru, India',
      skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Tailwind', 'Jest', 'Cypress', 'GitHub Actions', 'AWS'],
      requirements: [
        '5+ years with React and TypeScript',
        'Next.js, Redux, and Tailwind in production',
        'Testing with Jest and Cypress',
        'CI/CD with GitHub Actions',
        'Experience deploying to AWS',
      ],
      tags: ['frontend', 'web', 'react'],
      budget: 0,
      description: 'Lead frontend initiatives building design-system driven apps with React, TS, Next.js, Redux, Tailwind. Ensure quality via Jest/Cypress and ship via GitHub Actions on AWS.',
    },
    {
      title: 'UI Engineer - Next.js Performance',
      companyName: 'Skyline Labs',
      companyWebsite: 'https://skyline.example.com',
      location: 'Hyderabad, India',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Jest', 'Cypress'],
      requirements: ['Next.js App Router', 'Advanced performance tooling', 'Strong testing fundamentals'],
      tags: ['frontend', 'nextjs'],
      budget: 0,
      description: 'Own performance and DX across a modern Next.js stack with React/TS, Tailwind, and robust tests.',
    },
    {
      title: 'React Engineer - Design Systems',
      companyName: 'Northstar',
      companyWebsite: 'https://northstar.example.com',
      location: 'Remote',
      skills: ['React', 'TypeScript', 'Redux', 'Tailwind', 'GitHub Actions'],
      requirements: ['Design system experience', 'State management expertise', 'CI/CD familiarity'],
      tags: ['frontend', 'design-system'],
      budget: 0,
      description: 'Contribute to a design-system centric product using React/TS, Redux, Tailwind with CI via GitHub Actions.',
    },

    // Other jobs (7): fewer or no overlaps
    {
      title: 'Backend Engineer (Node.js/Express)',
      companyName: 'DataRiver',
      companyWebsite: 'https://datariver.example.com',
      location: 'Pune, India',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      requirements: ['REST APIs', 'MongoDB indexes', 'Caching with Redis'],
      tags: ['backend'],
      budget: 0,
      description: 'Build and scale REST APIs with Node.js, Express and MongoDB.',
    },
    {
      title: 'DevOps Engineer (AWS/Kubernetes)',
      companyName: 'CloudNest',
      companyWebsite: 'https://cloudnest.example.com',
      location: 'Chennai, India',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      requirements: ['EKS/ECS', 'IaC with Terraform', 'Observability'],
      tags: ['devops'],
      budget: 0,
      description: 'Own cloud infra with AWS, Kubernetes, Terraform and modern observability.',
    },
    {
      title: 'Data Scientist (Python/ML)',
      companyName: 'InsightWorks',
      companyWebsite: 'https://insightworks.example.com',
      location: 'Mumbai, India',
      skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow'],
      requirements: ['Feature engineering', 'Model training and evaluation'],
      tags: ['data', 'ml'],
      budget: 0,
      description: 'End-to-end ML workflows using Python stack.',
    },
    {
      title: 'Mobile Developer (iOS/Swift)',
      companyName: 'Mobinova',
      companyWebsite: 'https://mobinova.example.com',
      location: 'Delhi, India',
      skills: ['Swift', 'iOS'],
      requirements: ['UIKit/SwiftUI', 'App Store releases'],
      tags: ['mobile'],
      budget: 0,
      description: 'Build delightful native iOS experiences.',
    },
    {
      title: 'Blockchain Engineer (Solana)',
      companyName: 'ChainCraft',
      companyWebsite: 'https://chaincraft.example.com',
      location: 'Remote',
      skills: ['Solana', 'Anchor', 'Rust'],
      requirements: ['On-chain programs', 'Security reviews'],
      tags: ['web3', 'solana'],
      budget: 0,
      description: 'Design and implement Solana programs with Anchor.',
    },
    {
      title: 'QA Automation Engineer',
      companyName: 'QualityHub',
      companyWebsite: 'https://qualityhub.example.com',
      location: 'Kolkata, India',
      skills: ['Playwright', 'Cypress', 'Jest'],
      requirements: ['E2E automation', 'Test strategies'],
      tags: ['qa'],
      budget: 0,
      description: 'Develop robust E2E test suites; maintain CI quality gates.',
    },
    {
      title: 'Full-Stack Developer (Node/React)',
      companyName: 'StackEdge',
      companyWebsite: 'https://stackedge.example.com',
      location: 'Remote',
      skills: ['Node.js', 'React', 'PostgreSQL'],
      requirements: ['CRUD apps', 'Auth', 'Basic DevOps'],
      tags: ['fullstack'],
      budget: 0,
      description: 'Ship full-stack features with Node.js and React.',
    },
    {
      title: 'Rust Systems Engineer',
      companyName: 'CoreBits',
      companyWebsite: 'https://corebits.example.com',
      location: 'Remote',
      skills: ['Rust', 'Tokio'],
      requirements: ['Async systems', 'Performance tuning'],
      tags: ['systems'],
      budget: 0,
      description: 'Build high-performance systems in Rust.',
    },
  ];

  await Post.insertMany(
    jobs.map((j) => ({
      user: recruiter._id,
      type: 'job',
      title: j.title,
      description: j.description,
      skills: j.skills,
      budget: j.budget,
      location: j.location,
      tags: j.tags,
      companyName: j.companyName,
      companyWebsite: j.companyWebsite,
      requirements: j.requirements,
    }))
  );

  console.log('Seeded jobs:', jobs.length);

  // Seed seekers with profiles to be eligible candidates
  const seekerDefs = [
    {
      name: 'Alice Dev', email: 'alice@devlink.io', location: 'Bengaluru, India',
      skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Tailwind', 'Jest']
    },
    {
      name: 'Bob UI', email: 'bob@devlink.io', location: 'Hyderabad, India',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind']
    },
    {
      name: 'Charlie FE', email: 'charlie@devlink.io', location: 'Remote',
      skills: ['React', 'Redux', 'Tailwind', 'GitHub Actions']
    },
    {
      name: 'Daisy QA', email: 'daisy@devlink.io', location: 'Kolkata, India',
      skills: ['Cypress', 'Jest', 'Playwright']
    },
    {
      name: 'Evan Fullstack', email: 'evan@devlink.io', location: 'Remote',
      skills: ['Node.js', 'React', 'PostgreSQL']
    },
  ];

  for (const s of seekerDefs) {
    let u = await User.findOne({ email: s.email });
    if (!u) {
      u = await User.create({ name: s.name, email: s.email, password: 'seeded-hash', role: 'seeker' });
    } else if (u.role !== 'seeker') {
      u.role = 'seeker';
      await u.save();
    }
    await Profile.findOneAndUpdate(
      { user: u._id },
      { $set: { user: u._id, bio: `${s.name} – Frontend developer`, linkedIn: '', skills: s.skills, location: s.location } },
      { upsert: true }
    );
  }

  console.log('Seeded seekers with profiles:', seekerDefs.length);
  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(async (err) => {
  console.error('Seeding failed:', err?.message || err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


