const Profile = require('../models/Profile');
const User = require('../models/User');

// GET /api/profiles/:userId
async function getProfileByUserId(req, res) {
	try {
		const { userId } = req.params;
		const profile = await Profile.findOne({ user: userId }).populate('user', 'name email');
		if (!profile) return res.status(404).json({ message: 'Profile not found' });
		return res.json(profile);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// GET /api/profiles/me
async function getMyProfile(req, res) {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
		if (!profile) return res.json({ user: await User.findById(req.user.id).select('name email'), bio: '', skills: [], linkedIn: '', walletAddress: '', location: '', organisationName: '', organisationWebsite: '' });
		return res.json(profile);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

// PUT /api/profiles/me
async function upsertMyProfile(req, res) {
	try {
		const { bio, linkedIn, skills, walletAddress, location, organisationName, organisationWebsite } = req.body;
		const update = { bio, linkedIn, skills, walletAddress, location };
		// Only recruiters may set organization fields
		if (req.user?.role === 'recruiter') {
			update.organisationName = organisationName;
			update.organisationWebsite = organisationWebsite;
		}
		const options = { new: true, upsert: true, setDefaultsOnInsert: true };
		const profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: { user: req.user.id, ...update } }, options).populate('user', 'name email');
		return res.json(profile);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error: error.message });
	}
}

module.exports = { getProfileByUserId, getMyProfile, upsertMyProfile };


