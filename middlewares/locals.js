const Blog = require("../models/blog");

module.exports = (req, res, next) => {

    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.session.user;
    res.locals.isAuthenticated = req.session ? req.session.isAuthenticated : false;
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;
    next();
}