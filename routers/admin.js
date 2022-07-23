const express = require('express');
const router = express.Router();
controller = require('../controllers/admin');
const isAdmin = require('../middlewares/isAdmin');
const locals = require('../middlewares/locals');

// for -get functions
router.get('/add-blog', locals, isAdmin, controller.getAddBlog);
router.get('/blogs', locals, isAdmin, controller.getBlogs);
router.get('/edit-blog/:urlExt', locals, isAdmin, controller.getEditBlog);

// for -post functions
router.post('/add-blog', locals, isAdmin, controller.postAddBlog);
router.post('/edit-blog/:urlExt', locals, isAdmin, controller.postEditBlog);
router.post('/delete-blog', locals, isAdmin, controller.postDeleteBlog);
router.post('/linktree', locals, isAdmin, controller.postAddLink);
router.post('/delete-link/:linkid', locals, isAdmin, controller.postDeleteLink);

module.exports = router;