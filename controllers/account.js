const User = require('../models/user');
const Login = require('../models/login');
const Blog = require('../models/blog');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require("fs");

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
        user: 'onlygreyhat@gmail.com',
        pass: 'mkukyuxoxipmpadg'
    }
});

module.exports.getLogout = (req,res,next)=>{
    return req.session.destroy(err => {
        res.redirect('/');
    })
}

module.exports.getFavourites = (req,res,next)=>{
    const favourites = req.session.user.favourites;
    const action = req.session.action;
    delete req.session.action;

    Blog.find({_id: {
        $in: favourites
    }})
    .then(blogs=>{
        res.render('account/get-favourites',{
            title: "Favorilerim",
            path:'/favourites',
            blogs: blogs,
            action: action
        });
    })
}

module.exports.getProfile = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    var user = req.session.user;
    const path = `/uploads/${user.imageUrl}`
    if (fs.existsSync(path)){
        user.imageUrl = 'default.png'  
    }

    res.render('account/get-profile', {
        path: '/profile',
        title: 'Profilim',
        errorMessage: errorMessage
    });
}

module.exports.getLogin = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/get-login', {
        path: '/login',
        title: 'Giriş Yap',
        errorMessage: errorMessage
    });
}

module.exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    const loginModel = new Login({email: email, password: password});

    loginModel.validate()
    .then(()=>{
        User.findOne({email: email})
        .then(user=>{
            if(!user){
                req.session.save(function(err){
                    req.session.errorMessage = 'Mail adresi kayıtlı değil!';
                    return res.redirect('/login');
                });
            }
            else{
                bcrypt.compare(password, user.password)
                .then(isSuccess=>{
                    if(isSuccess){
                        req.session.user = user;
                        req.session.isAuthenticated = true;
                        req.session.favourites = user.favourites;
 
                        return req.session.save(function(err){
                            var url = req.session.redirectTo || '/';
                            delete req.session.redirectTo;
                            return res.redirect(url);
                        });
                    };
                    req.session.errorMessage = 'Mail adresi veya şifreyi hatalı girdiniz!';
                    req.session.save(function(err){
                        req.session.redirect('/login');
                    });
                }).catch(err=>{
                console.log(err);
            });
            } 
        })
        .catch(err=>{
            console.log(err);
        });
    })
    .catch(err=>{
        if(err.name == 'ValidationError'){
            let message = '';
            for(field in err.errors){
                message += err.errors[field].message + '<br>';
            }
            res.render('account/get-login', {
                path: '/login',
                title: 'Giriş Yap',
                errorMessage: message
            });
        } else {
            next(err);
        }
    });
}

module.exports.getRegister = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/get-register', {
        path: '/register',
        title: 'Üye Ol',
        errorMessage: errorMessage
    });
}

module.exports.postRegister = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const image = req.file;
    const urlExt = name.toLowerCase().replace(' ', '-');

    User.findOne({$or:[{email: email}, {name:name}]})
    .then(user => {
        if(user){
            if(user.name == name && user.email == email) {
                req.session.errorMessage = 'Bu kullanıcı sistemde mevcut!';
                req.session.save(function(err) {
                    console.log(err);
                    return res.redirect('/register');
                });
            }else if(user.email == email) {
                req.session.errorMessage = 'Bu mail adresi alınmış!';
                req.session.save(function(err) {
                    console.log(err);
                    return res.redirect('/register');
                });
            }else if(user.name == name) {
                req.session.errorMessage = 'Bu kullanıcı adı alınmış!';
                req.session.save(function(err) {
                    console.log(err);
                    return res.redirect('/register');
                });
            }
        }
        return bcrypt.hash(password, 10);
    })
    .then (hashedPassword => {
        const newUser = new User({
            name: name,
            email: email,
            urlExt: urlExt,
            imageUrl: image?image.filename:undefined,
            password: hashedPassword,
        });
        return newUser.save();
    })
    .then(() => {
        res.redirect('/login')

        var mailOptions = {
            from: "onlygreyhat@gmail.com",
            to: email,
            subject: 'Hesap Aktivasyonu',
            html: '<h1>Hesabınız başarılı bir şekilde oluşturuldu!</h1>'
          };

        transporter.sendMail(mailOptions);      
    })
    .catch(err => {
        if(err.name == 'ValidationError'){
            let message = '';
            for(field in err.errors){
                message += err.errors[field].message + '<br>';
            }

            res.render('account/get-register', {
                path: '/register',
                title: 'Üye Ol',
                errorMessage: message
            });
        } else {
            next(err);
        }
    });
}

module.exports.getReset = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    return res.render('account/get-reset', {
        path: '/reset-password',
        title: 'Şifre Yenile',
        errorMessage: errorMessage
    });
}

module.exports.postReset = (req,res,next)=>{

    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset-password');
        }

        const token = buffer.toString('hex');

        User.findOne({email: email})
            .then(user=>{
                if(!user){
                    req.session.errorMessage = 'Bu mail adresi ile bir kayıt bulunamamıştır!';
                    req.session.save(function(err) {
                        console.log(err);
                    })
                    return res.redirect('/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                
                return user.save();
            })
            .then(result=>{
                
                res.redirect('/');
                var mailOptions = {
                    from: "onlygreyhat@gmail.com",
                    to: email,
                    subject: 'Şifre Yenileme',
                    html: `
                        <p>Parolanızı yenilemek için aşağıdaki linke tıklayınız<p>
                        <p>
                            <a href="http://localhost:3000/reset-password/${token}> 
                            Reset Password
                            </a>
                        </p>
                        `
                  };
        
                transporter.sendMail(mailOptions);
            })
            .catch(err=>{
                next(err);
            })
         })   
}

module.exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;

    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    User.findOne({
            resetToken: token, 
            resetTokenExpiration:{
                $gt: Date.now()
            }    
        })
        .then(user=>{
        
            return res.render('account/get-newPassword', {
                path: '/new-password',
                title: 'Yeni Şifre Oluştur',
                errorMessage: errorMessage,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err=>{
            console.log(err);
        }) 
}

module.exports.postNewPassword = (req,res,next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let _user;

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration:{
            $gt: Date.now()
        },
        _id: userId    
    })
    .then(user=>{
        _user = user;
        return bcrypt.hash(newPassword, 10);
    })
    .then(hashedPassword=>{
        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;
        _user.save();
    })
    .then(()=>{
        res.redirect('/login');
    })
    .catch(err=>{
        next(err);
    })
}

module.exports.postComment = (req,res,next)=>{
    const urlExt = req.params.urlExt;
    const message = req.body.comment;
    const user = {name: req.session.user.name, email: req.session.user.email};
    
    Blog.findOne({urlExt: urlExt})
    .then(blog=>{
        blog.addComment(message, user);
    })
    .then(() => {
        res.redirect(`/blog/${urlExt}`);
    })
    .catch(err=>console.log(err));
}

module.exports.postReply = (req,res,next)=>{
    const urlExt = req.params.urlExt;
    const messageid = req.params.messageid;
    const reply = req.body.reply;
    const user = {name: req.session.user.name, email: req.session.user.email};
    
    Blog.findOne({urlExt:urlExt})
    .then(blog => {
        blog.addReply(messageid, reply, user);
    })
    .then(() => {
        res.redirect(`/blog/${urlExt}`);
    })
    .catch(err=>console.log(err));

}

module.exports.postDeleteComment = (req,res,next)=>{
    const commentid = req.params.commentid;

    Blog.findOne({comment:{_id:commentid}})
    .then((blog)=>{
        blog.deleteComment(commentid)
        .then(()=>{
            res.redirect(`/blog/${blog.urlExt}`);
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })

}

module.exports.postDeleteReply = (req,res,next)=>{
    const replyid = req.params.replyid;

    Blog.findOne({comment:{replies:{_id:replyid}}})
    .then((blog)=>{
        blog.deleteReply(replyid)
        .then(()=>{
            res.redirect(`/blog/${blog.urlExt}`);
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
}

module.exports.postAddFavourites = (req,res,next)=>{
    const blogid = req.params.blogid;
    const user = req.session.user;
   
    const arrayFav = user.favourites.map(favourite=>{
        return favourite.toString() == blogid
    })

    if(arrayFav.includes(true)){

        var errorMessage = 'Blog zaten favorilerinizde mevcut!'
        req.session.errorMessage = errorMessage
        res.redirect(`/`);
    }
    else{
        User.findOne({_id: user._id})
    .then((user)=>{
        user.addFavourites(blogid)
        req.session.user = user;
        req.session.favourites = user.favourites;
        res.redirect(`/favourites/${user.urlExt}`)
    })
    }  
}

module.exports.postDeleteFavourite = (req,res,next)=>{
    const blogid = req.params.blogid;
    const user = req.session.user;

    User.findOne({_id: user._id})
    .then(user=>{
        user.deleteFavourite(blogid);
        req.session.user = user;
        req.session.favourites = user.favourites;
        req.session.action = 'deleted';
        res.redirect(`/favourites/${user.urlExt}`)
    })

}

module.exports.postEditProfile = (req,res,next)=>{
    const user = req.session.user;
    const name = req.body.name;
    const image = req.file?req.file:user.imageUrl;
    const oldImg = user.imageUrl;

    User.updateOne({_id: user._id}, {
        $set: {
            name: name,
            urlExt: name.toLowerCase().replace(' ', '-'),
            imageUrl: image.filename
        }
    })

    .then(()=>{
        return User.findOne({_id: user._id});
    })
    .then(updatedUser=>{
        req.session.user = updatedUser;
        req.session.favourites = updatedUser.favourites;
        res.redirect(`/profile/${updatedUser.urlExt}`)
    })
    .then(()=>{
        if (image) {
            if(oldImg == 'default.png'){
                return;
            }
            else{
                fs.unlink('public/uploads/' + oldImg, err => {
                if (err) {
                    console.log(err);
                }
                });
            } 
        }
    })
    .catch(err => {
        console.log(err);
    })
}
