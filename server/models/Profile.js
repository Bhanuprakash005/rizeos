const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		bio: { type: String, default: '' },
		linkedIn: { type: String, default: '' },
		skills: { type: [String], default: [] },
		walletAddress: { type: String, unique: true, sparse: true },
		location: { type: String, default: '' },
		organisationName: { type: String, default: '' },
		organisationWebsite: { type: String, default: '' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);


