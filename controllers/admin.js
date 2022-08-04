const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Link = require('../models/link');
const Category = require('../models/category');
const fs = require("fs");
const category = require('../models/category');


module.exports.getBlogs = (req,res,next)=>{
    Blog.find()
        .then(blogs=>{
            res.render('admin/blogs',{
                title: "Bloglarım",
                path:'/adminblogs',
                blogs: blogs,
                action: req.query.action
            });
        })
        .catch(err=>console.log(err))
}

module.exports.getAddBlog = (req,res,next)=>{
    
    Category.find()
    .then(categories=>{
        res.render('admin/add-blog', {
        title: "Blog Ekle",
        path:'/add-blog',
        categories:categories
        
    });
    })   
}

module.exports.getEditBlog = (req,res,next)=>{
    const urlExt = req.params.urlExt;

    Category.find()
    .then(categories=>{
        Blog.findOne({urlExt: urlExt})
        .populate('categories')
            .then(blog=>{
                
                categories.map(category=>{
                    if(blog.categories.includes(category)){
                        console.log("here")
                    }
                })

                res.render('admin/edit-blog',{
                    title: "Düzenle",
                    path:'/editblog',
                    blog: blog,
                    categories:categories
                });
            })
    })
    .catch(err=>console.log(err))
}

module.exports.getCategory= (req,res,next)=>{
    Category.find()
    .then(categories=>{
        res.render('admin/category', {
            title: "Kategorileri Düzenle",
            path:'/category',
            categories: categories
        });
    })
}

module.exports.postAddCategory = (req,res,next)=>{
    const categoryName = req.body.categoryName;

    const category = new Category({
        _id: mongoose.Types.ObjectId(),
        categoryName: categoryName
    });
    category.save()
        .then(()=>{
            res.redirect('/admin/category');
        })
        .catch(err=> console.log(err));
}

module.exports.postDeleteCategory = (req,res,next)=>{
    console.log("here")
    const categoryid = req.params.categoryid;

    Category.findByIdAndRemove({_id:categoryid})
    .then(()=>{
        res.redirect('/admin/category');    
    })
    .catch(err=> console.log(err))
}

module.exports.postAddBlog = (req,res,next)=>{
    const title = req.body.title;
    const readMin = req.body.readMin
    const body = req.body.editor;
    const urlExt = title.toLowerCase().replace(' ', "-");
    var categories = req.body.category;
    const image = req.file;

    console.log(image)    
    if(typeof(category)===String){
        categories = categories.map(category=>{
            return mongoose.Types.ObjectId(category)
        })
    }
    else{
        categories = categories
    }

    const blog = new Blog({
        _id: mongoose.Types.ObjectId(),
        title: title,
        readMin: readMin,
        coverImg: image?image.filename:undefined,
        categories: categories,
        body: body,
        urlExt:urlExt
    });
    blog.save()
        .then(()=>{
            res.redirect('/admin/blogs');
        })
        .catch(err=> console.log(err));
}

module.exports.postEditBlog = (req,res,next)=>{
    const urlExt = req.params.urlExt;
    const title = req.body.title;
    const readMin = req.body.readMin;
    const body = req.body.editor;
    const newurlExt = title.toLowerCase().replace(" ", "-");
    var categories = req.body.category;
    const image = req.file;
    console.log(image) 
    if(typeof(category)===String){
        categories = categories.map(category=>{
            return mongoose.Types.ObjectId(category)
        })
    }
    else{
        categories = categories
    }

    if (image) {
        Blog.findOne({urlExt: urlExt})
        .then(blog=>{
            const oldImg = blog.coverImg;
            
            if(oldImg){
                fs.unlink('public/uploads/' + oldImg, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }            
        }) 
    }  

    Blog.updateOne({urlExt: urlExt}, {
        $set: {
            title: title,
            readMin: readMin,
            coverImg: image?image.filename:undefined,
            body: body,
            urlExt:newurlExt,
            categories:categories
        }
    })
    .then(() => {
        res.redirect("/admin/blogs?action=updated");
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports.postDeleteBlog = (req,res,next)=>{
    const blogid = req.body.blogid;

    Blog.deleteOne({_id: blogid})
        .then(()=>{
            res.redirect('/admin/blogs?action=deleted')
        })
        .catch(err=>console.log(err))
}

module.exports.postAddLink = (req,res,next)=>{
    const linkName = req.body.linkName;
    const linkUrl = req.body.linkUrl;
    const image = req.file;

    const link = new Link({
        _id: mongoose.Types.ObjectId(),
        linkName: linkName,
        linkUrl: linkUrl,
        linkImage: image?image.filename:undefined
    });
    link.save()
        .then(()=>{
            res.redirect('/linktree');
        })
        .catch(err=> console.log(err));

}

module.exports.postDeleteLink = (req,res,next)=>{
    const linkid = req.params.linkid;
   
    Link.findByIdAndRemove({_id:linkid})
    .then((link)=>{
        
        fs.unlink('public/uploads/' + link.linkImage, err => {
            if (err) {
                console.log(err);
            }
            });
       
        res.redirect('/linktree');    
    })
    .catch(err=> console.log(err))

    
}
