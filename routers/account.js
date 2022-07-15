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
router.post('/blog/:urlExt', locals, isAdmin, controller.postComment);
router.post('/blog/:urlExt/:messageid', locals, isAdmin, controller.postReply);
router.post('/delete-comment/:commentid', locals, isAdmin, controller.postDeleteComment);
router.post('/delete-reply/:replyid', locals, isAdmin, controller.postDeleteReply);
router.post('/login', locals, controller.postLogin);
router.post('/favourites/:blogid', locals, isAdmin, controller.postAddFavourites);
router.post('/delete-fav/:blogid', locals, isAdmin, controller.postDeleteFavourite);
router.post('/profile/:userExt', locals, isAdmin, controller.postEditProfile);
router.post('/register', locals, isAdmin, controller.postRegister);
router.post('/reset-password', locals, isAdmin, controller.postReset);
router.post('/reset-password/:token', locals, isAdmin, controller.postNewPassword);

module.exports = router;