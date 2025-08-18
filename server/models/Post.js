const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		type: { type: String, enum: ['job', 'feed'], required: true },
		title: { type: String, default: '' },
		description: { type: String, required: true },
		skills: { type: [String], default: [] },
		budget: { type: Number },
		transactionSignature: { type: String },
		location: { type: String, default: '' },
		tags: { type: [String], default: [] },
		companyName: { type: String, default: '' },
		companyWebsite: { type: String, default: '' },
		requirements: { type: [String], default: [] }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);


