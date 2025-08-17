const express = require('express');
const router = express.Router();
const { getProfileByUserId, getMyProfile, upsertMyProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Order matters: define static routes before dynamic
router.get('/me', protect, getMyProfile);
router.put('/me', protect, upsertMyProfile);
router.get('/:userId', getProfileByUserId);

module.exports = router;


