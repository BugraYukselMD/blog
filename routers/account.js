const express = require('express');
const router = express.Router();
controller = require('../controllers/account');
const locals = require('../middlewares/locals');
const isAdmin = require('../middlewares/isAdmin');

// for -get functions
router.get('/logout', locals, controller.getLogout);
router.get('/login', locals, controller.getLogin);
router.get('/register', locals, controller.getRegister);
router.get('/favourites/:userExt', locals, isAdmin, controller.getFavourites);
router.get('/profile/:userExt', locals, isAdmin, controller.getProfile);
router.get('/reset-password', locals, controller.getReset);
router.get('/reset-password/:token', locals, isAdmin, controller.getNewPassword);

// for -post functions
router.post('/blog/:urlExt', locals, controller.postComment);
router.post('/blog/:urlExt/:messageid', locals, controller.postReply);
router.post('/delete-comment/:commentid', locals, controller.postDeleteComment);
router.post('/delete-reply/:replyid', locals,  controller.postDeleteReply);
router.post('/login', locals, controller.postLogin);
router.post('/favourites/:blogid', locals, isAdmin, controller.postAddFavourites);
router.post('/delete-fav/:blogid', locals, isAdmin, controller.postDeleteFavourite);
router.post('/profile/:userExt', locals, isAdmin, controller.postEditProfile);
router.post('/register', locals, controller.postRegister);
router.post('/reset-password', locals, controller.postReset);
router.post('/reset-password/:token', locals, controller.postNewPassword);

module.exports = router;