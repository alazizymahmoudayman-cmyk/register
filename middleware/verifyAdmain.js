const verifyAdmin = (req, res, next) => {
    // لو الـ role مش Admin يرفض الطلب
    if (req.role !== 'Admin') {
        return res.status(403).json({ message: 'صلاحيات أدمن فقط!' });
    }
    next(); // لو أدمن يخليه يكمل للدالة اللي بعدها
};

module.exports = verifyAdmin;