const express = require('express');
const router = express.Router();
controller = require('../controllers/account');
const locals = require('../middlewares/locals');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isnotAuthenticated = require('../middlewares/isnotAuthenticated');

// for -get functions
router.get('/logout', locals, controller.getLogout);
router.get('/login', locals,isnotAuthenticated, controller.getLogin);
router.get('/register', locals, isnotAuthenticated, controller.getRegister);
router.get('/favourites/:userExt', locals, isAuthenticated, controller.getFavourites);
router.get('/profile/:userExt', locals, isAuthenticated, controller.getProfile);
router.get('/reset-password', locals, isAuthenticated, controller.getReset);
router.get('/reset-password/:token', locals, isAuthenticated, controller.getNewPassword);

// for -post functions
router.post('/blog/:urlExt', locals, isAuthenticated, controller.postComment);
router.post('/blog/:urlExt/:messageid', locals, isAuthenticated, controller.postReply);
router.post('/delete-comment/:commentid', locals, isAuthenticated, controller.postDeleteComment);
router.post('/delete-reply/:replyid', locals, isAuthenticated,  controller.postDeleteReply);
router.post('/login', locals, controller.postLogin);
router.post('/favourites/:blogid', locals, isAuthenticated, controller.postAddFavourites);
router.post('/delete-fav/:blogid', locals, isAuthenticated, controller.postDeleteFavourite);
router.post('/profile/:userExt', locals, isAuthenticated, controller.postEditProfile);
router.post('/register', locals, controller.postRegister);
router.post('/reset-password', locals, controller.postReset);
router.post('/reset-password/:token', locals, controller.postNewPassword);

module.exports = router;