const Blog = require('../models/blog');

module.exports.getIndex = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    var listCount = 1;
    req.session.listCount = listCount;
    Blog.find()
        .then(blogs=>{
            blogs = blogs.reverse().slice(0,listCount)
            res.render('public/index',{
                title: "Blog Akışı",
                path:'/',
                listCount: listCount,
                blogs:blogs,
                errorMessage: errorMessage
            });
        })
        .catch(err=>console.log(err))
}

module.exports.postIndex = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    
    var listCount = req.session.listCount + 1;
    req.session.listCount = listCount;

    Blog.find()
        .then(blogs=>{
            blogs = blogs.reverse().slice(0, listCount)
            if (listCount >= blogs.length){
                listCount = blogs.length;
                res.locals.isFull = true;
            }
            else{
                res.locals.isFull = false;
            }
            res.render('public/index',{
                title: "Blog Akışı",
                path:'/',
                listCount: listCount,
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