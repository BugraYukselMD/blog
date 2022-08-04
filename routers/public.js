const express = require('express');
const router = express.Router();
controller = require('../controllers/public');
const locals = require('../middlewares/locals');

// for -get functions
router.get('/', locals, controller.getIndex);
router.get('/about', locals, controller.getAbout);
router.get('/contact', locals, controller.getContact);
router.get('/blog/:urlExt', locals, controller.getBlog);
router.get('/linktree', locals, controller.getLinkTree);

// for -post functions
router.post('/list-by-category', locals, controller.postList);
router.post('/load-more/:blogslength', locals, controller.postLoadMore);

module.exports = router;