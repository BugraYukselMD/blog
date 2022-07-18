const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getIndex = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    Blog.find()
        .then(blogs=>{
            res.render('public/index',{
                title: "Blog Akışı",
                path:'/',
                blogs:blogs,
                errorMessage: errorMessage
            });
        })
        .catch(err=>console.log(err))
}

module.exports.getAbout = (req,res,next)=>{
    res.render('public/get-about',{
        title: "Hakkımda",
        path:'/about'
    });
}

module.exports.getContact = (req,res,next)=>{
    res.render('public/get-contact',{
        title: "İletişim",
        path:'/contact'
    });
}

module.exports.getBlog = (req,res,next)=>{
    Blog.findOne({urlExt: req.params.urlExt})
    .populate('comments.user')
    .populate('comments.replies.user')

    .then(blog=>{ 
        var inFav = false;
        if(req.session.favourites){
            req.session.favourites.map(fav=>{
                if (blog._id.toString()==fav._id.toString()){
                inFav = true;
            }
        })}
        
        res.locals.inFav = inFav;

        res.render('public/get-blog',{
            title: blog.title,
            blog: blog
            });
        })
    .catch(err=>console.log(err));
}