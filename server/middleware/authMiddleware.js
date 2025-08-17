const jwt = require('jsonwebtoken');

function protect(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ')
		? authHeader.substring(7)
		: null;

	if (!token) {
		return res.status(401).json({ message: 'Not authorized, token missing' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id };
		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Not authorized, token invalid' });
	}
}

module.exports = { protect };


