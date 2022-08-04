const Blog = require('../models/blog');
const Link = require('../models/link');
const Category = require('../models/category');
const mongoose = require('mongoose');

const LIST_LENGTH = 10
const LIST_INCREASE = 5

module.exports.getIndex = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    var length = req.session.length;
    delete req.session.length

    const action = req.query.category;
    res.locals.isFull = true

    if(action==="All" || action===undefined || action==="NotFound"){
        Category.find()
        .then(categories=>{
            Blog.find()
                .then(blogs=>{
                    if(length){

                        if(length >= blogs.length){
                            res.locals.isFull = true
                        }
                        else{
                            res.locals.isFull = false
                        }

                        if (length > blogs.length){
                            length = blogs.length
                        }
                        
                        blogs = blogs.slice(-length);
                    }
                    else{
                        blogs = blogs.slice(-LIST_LENGTH)
                    }
                    
                    res.render('public/index',{
                        title: "Blog Akışı",
                        path:'/',
                        blogs:blogs,
                        categories: categories,
                        action:action,
                        errorMessage: errorMessage
                    });
                }) 
        })
        .catch(err=>console.log(err))
    }
    else{
        const blgs =  req.session.blogs;
        const cats =  req.session.categories;
        res.render('public/index',{
            title: "Blog Akışı",
            path:'/',
            blogs:blgs,
            categories: cats,
            action:action,
            errorMessage: errorMessage
        });
        delete req.session.blogs;
        delete req.session.categories;
    }

   
}

module.exports.getAbout = (req,res,next)=>{
    res.render('public/get-about',{
        title: "Hakkımda",
        path:'/about'
    });
}

module.exports.getContact = (req,res,next)=>{
    res.redirect("/linktree");
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

module.exports.getLinkTree = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    Link.find()
    .then(links=>{
        res.render('public/get-linktree',{
        title: "Beni Takip Edin!",
        links:links,
        errorMessage: errorMessage
        });
    })
    .catch(err=>console.log(err));          
}

module.exports.postList = (req,res,next)=>{
    delete req.session.errorMessage;
    
    var categoryid = req.body.category;

    if(categoryid==="all"){
        var action = "All"
        res.redirect(`/?action=${action}`)
    }
    else{
        const _categoryid = mongoose.Types.ObjectId(categoryid)
        Blog.find({categories:[{_id: _categoryid}]})
        .then(blogs=>{
            if(blogs.length===0){
                var action = "NotFound"
                req.session.errorMessage = "<p>Aradığınız kategoride yazı bulunamadı!</p>"
                res.redirect(`/?category=${action}`)
            }
            else{
                Category.find()
                .then(categories=>{
                    var category = categories.findIndex(cat=>{
                        return cat._id.toString()===categoryid
                    })
                    
                    req.session.selectedid = categories[category]._id;
                    req.session.categories = categories;
                    req.session.blogs = blogs;
                    var action = categories[category].categoryName
                    res.redirect(`/?category=${action}`);
                })
            }           
        })       
    }
}   

module.exports.postLoadMore = (req,res,next)=>{
    var length = req.params.blogslength;

    length = parseInt(length) + LIST_INCREASE;

    req.session.length = length
    res.redirect("/") 
}