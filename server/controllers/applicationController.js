const JobApplication = require('../models/JobApplication');
const Post = require('../models/Post');

// POST /api/applications
async function createApplication(req, res) {
	try {
		const { jobId } = req.body || {};
		if (!jobId) return res.status(400).json({ message: 'jobId is required' });
		const job = await Post.findById(jobId);
		if (!job) return res.status(404).json({ message: 'Job not found' });
		if (job.type !== 'job') return res.status(400).json({ message: 'Cannot apply to non-job posts' });
		// Prevent duplicate applications
		const existing = await JobApplication.findOne({ job: jobId, applicant: req.user.id });
		if (existing) return res.status(400).json({ message: 'Already applied' });
		const app = await JobApplication.create({ job: jobId, applicant: req.user.id });
		return res.status(201).json(app);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// GET /api/applications/mine (seeker)
async function getMyApplications(req, res) {
	try {
		const apps = await JobApplication.find({ applicant: req.user.id })
			.populate({ path: 'job', select: 'title companyName location skills user type' });
		return res.json(apps);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// GET /api/applications/job/:jobId (recruiter, must own job)
async function getApplicationsForJob(req, res) {
	try {
		const { jobId } = req.params;
		const job = await Post.findById(jobId);
		if (!job) return res.status(404).json({ message: 'Job not found' });
		if (String(job.user) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
		const apps = await JobApplication.find({ job: jobId })
			.populate({ path: 'applicant', select: 'name email role' });
		return res.json(apps);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports = { createApplication, getMyApplications, getApplicationsForJob };



