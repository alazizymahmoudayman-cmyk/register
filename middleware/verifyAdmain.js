const verifyAdmin = (req, res, next) => {
    if (req.role !== 'Admin') {
        return res.status(403).json({ message: 'صلاحيات أدمن فقط!' });
    }
    next();
};

module.exports = verifyAdmin;