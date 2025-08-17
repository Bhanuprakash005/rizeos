const express = require('express');
const router = express.Router();
const { extractSkills, normalizeLocation, areLocationsNear } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/extract-skills', protect, extractSkills);
router.post('/normalize-location', protect, normalizeLocation);
router.post('/near', protect, areLocationsNear);

module.exports = router;


