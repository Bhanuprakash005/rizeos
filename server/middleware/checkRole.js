function checkRole(requiredRole) {
	return function (req, res, next) {
		const role = req.user?.role;
		if (!role) return res.status(401).json({ message: 'Not authorized' });
		if (role !== requiredRole) return res.status(403).json({ message: 'Forbidden: insufficient role' });
		return next();
	}
}

module.exports = { checkRole };



