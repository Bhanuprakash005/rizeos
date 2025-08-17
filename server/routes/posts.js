const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);

module.exports = router;


