/* Seed 15 job posts and 5 feed posts */
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');

const skillsPool = [
	'React','TypeScript','Node.js','Express','MongoDB','PostgreSQL','Redis','GraphQL','Docker','Kubernetes','AWS','GCP','Tailwind','Redux','Next.js','Solidity','Solana','Rust','Python','Django','FastAPI','TensorFlow','PyTorch','Jest','Cypress'
];

const locations = [
	'Bengaluru, India','Hyderabad, India','Delhi, India','Mumbai, India','Chennai, India',
	'Austin, USA','San Francisco, USA','New York, USA','Toronto, Canada','London, UK',
	'Berlin, Germany','Paris, France','Singapore','Sydney, Australia','Tokyo, Japan'
];

function pick(arr, n) {
	const copy = [...arr];
	const out = [];
	for (let i = 0; i < n && copy.length; i++) {
		out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
	}
	return out;
}

async function run() {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected');

	// Ensure a seed user exists
	let user = await User.findOne({ email: 'seed@devlink.app' });
	if (!user) {
		const hash = await bcrypt.hash('SeedPass123!', 10);
		user = await User.create({ name: 'Seed User', email: 'seed@devlink.app', password: hash });
	}

	// Clear previous seed posts
	await Post.deleteMany({ 'user': user._id });

	const posts = [];
	for (let i = 0; i < 15; i++) {
		const s = pick(skillsPool, 3 + Math.floor(Math.random() * 3));
		posts.push({
			user: user._id,
			type: 'job',
			title: `Hiring ${s[0]} Engineer (${i+1})`,
			description: `We are looking for a ${s.join(', ')} developer to build scalable applications and services.`,
			skills: s,
			budget: 1000 + Math.floor(Math.random() * 4000),
			location: locations[i % locations.length],
			tags: ['remote','full-time','product'].slice(0, 1 + Math.floor(Math.random()*3))
		});
	}
	for (let i = 0; i < 5; i++) {
		const s = pick(skillsPool, 2 + Math.floor(Math.random() * 3));
		posts.push({
			user: user._id,
			type: 'feed',
			title: `Dev update ${i+1}`,
			description: `Shipped features around ${s.join(', ')} with focus on DX and performance.`,
			skills: s,
			location: locations[(i+5) % locations.length],
			tags: ['announcement','release'].slice(0, 1 + Math.floor(Math.random()*2))
		});
	}

	await Post.insertMany(posts);
	console.log('Seeded posts:', posts.length);
	await mongoose.disconnect();
	console.log('Done');
}

run().catch((e) => { console.error(e); process.exit(1); });



