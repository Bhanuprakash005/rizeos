const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDatabase();

// Health check
app.get('/', (req, res) => {
	res.json({ status: 'DevLink API running' });
});

// Routes
try {
	app.use('/api/auth', require('./routes/auth'));
	app.use('/api/profiles', require('./routes/profiles'));
	app.use('/api/posts', require('./routes/posts'));
	app.use('/api/ai', require('./routes/ai'));
	app.use('/api/payments', require('./routes/payments'));
} catch (err) {
	// Routes may not exist during initial scaffold
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


