module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    if (!req.session.user.isAdmin) {
        return res.redirect('/');
    }
    next();
}