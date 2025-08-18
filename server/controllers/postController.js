const Post = require('../models/Post');

// POST /api/posts
async function createPost(req, res) {
	try {
		const { type, title, description, skills, budget, transactionSignature, location, tags, companyName, companyWebsite, requirements } = req.body;
		if (!description || !type) {
			return res.status(400).json({ message: 'Type and description are required' });
		}
		// Enforce recruiter-only for job posts
		if (type === 'job' && req.user?.role !== 'recruiter') {
			return res.status(403).json({ message: 'Only recruiters can create job posts' });
		}
		const post = await Post.create({
			user: req.user.id,
			type,
			title,
			description,
			skills: Array.isArray(skills) ? skills : [],
			budget,
			transactionSignature,
			location,
			tags: Array.isArray(tags) ? tags : [],
			companyName,
			companyWebsite,
			requirements: Array.isArray(requirements) ? requirements : []
		});
		return res.status(201).json(post);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// GET /api/posts
async function getPosts(req, res) {
	try {
		const { skill, location, tags } = req.query;
		const filter = {};
		if (skill) filter.skills = { $in: Array.isArray(skill) ? skill : [skill] };
		if (location) filter.location = new RegExp(String(location), 'i');
		if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean) };
		const posts = await Post.find(filter)
			.populate('user', 'name email')
			.sort({ createdAt: -1 });
		return res.json(posts);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// GET /api/posts/:id
async function getPostById(req, res) {
	try {
		const post = await Post.findById(req.params.id).populate('user', 'name email');
		if (!post) return res.status(404).json({ message: 'Post not found' });
		return res.json(post);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports = { createPost, getPosts, getPostById };


