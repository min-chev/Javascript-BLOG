const User = require("./../models/User");
const Article = require("./../models/Article");
const Category = require("./../models/Category");
const Comment = require("./../models/Comment");
const initializeTags = require("./../models/Tag").initializeTags;
const mongoose = require('mongoose');






module.exports = {
    createGet: (req, res) => {

        if (!req.isAuthenticated()) {
            let returnUrl = '/article/create';
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }
        Category.find({}).then(categories => {
            res.render('article/create', {categories: categories});
        });

    },
    createPost: (req, res) => {
        let articleArgs = req.body;


        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You have to be logged in to create articles!'
        } else if (!articleArgs.title) {
            errorMsg = 'Invalid title!';
        } else if (!articleArgs.content) {
            errorMsg = 'Invalid content!'
        }

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        articleArgs.tags = [];
        articleArgs.views = 0;
        Article.create(articleArgs).then(article => {

            let tagNames = articleArgs.tagNames.split(/\s+|,/).filter(tag => {
                return tag
            });
            initializeTags(tagNames, article.id);

            article.prepareInsert();
            res.redirect('/')

        })


    },
    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            Article.findOneAndUpdate({_id: id}, {views: article.views + 1}).populate('author tags comments').then(article => {


                let CommentsExist = false;

                if (article.comments.length >0) {
                    CommentsExist = true;
                }


                if (!req.user) {

                    res.render('article/details', {
                        article: article,
                        isUserAuthorized: false,
                        CommentsExist: CommentsExist
                    });
                    return;
                }


                req.user.isInRole('Admin').then(isAdmin => {
                    let isUserAuthorized = isAdmin || req.user.isAuthor(article);


                    res.render('article/details', {
                        article: article,
                        isUserAuthorized: isUserAuthorized,
                        CommentsExist: CommentsExist
                    });

                })

            });
        })
    },

    editGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');

        }
        Article.findById(id).populate('tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }
            });
            Category.find({}).then(categories => {
                article.categories = categories;

                article.tagNames = article.tags.map(tag => {
                    return tag.name
                });

                res.render('article/edit', article);

            });
        })

    },

    editPost: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        let articleArgs = req.body;

        let errorMsg = '';
        if (!articleArgs.title){
            errorMsg = 'Article title cannot be empty!';
        } else if (!articleArgs.content) {
            errorMsg = 'Article content cannot be empty!'
        }

        if(errorMsg) {
            res.render('article/edit', {error: errorMsg})
        } else {
            Article.findById(id).populate('category tags').then(article => {
                if(article.category.id !== articleArgs.category){
                    article.category.articles.remove(article.id);
                    article.category.save();
                }
                article.category = articleArgs.category;
                article.title = articleArgs.title;
                article.content = articleArgs.content;



                let newTagNames = articleArgs.tags.split(/\s+|,/).filter(tag => {return tag});

                let oldTags = article.tags.filter(tag => {
                    return newTagNames.indexOf(tag.name) === -1;
                });

                for(let tag of oldTags){
                    tag.deleteArticle(article.id);
                    article.deleteTag(tag.id);
                }

                initializeTags(newTagNames, article.id);

                Category.findById(article.category).then(category => {
                    if (category.articles.indexOf(article.id) === -1) {
                        category.articles.push(article.id);
                        category.save();
                    }
                    article.save();
                    res.redirect(`/article/details/${id}`)
                })


            });
        }
    },


    deleteGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }
        Article.findById(id).populate('category tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }
            });
            article.tagNames = article.tags.map(tag => {
                return tag.name
            });
            res.render('article/delete', article);
        })
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }


        Article.findOneAndRemove({_id: id}).populate('author').then(article => {

            article.prepareDelete();
            res.redirect('/');
        });
    },


    commentGet: (req, res) => {
        let id = req.params.id;


        Article.findById(id).then(article => {
            res.render('article/comment', article);
        });


    },

    commentPost: (req, res) => {
        let id = req.params.id;

        let commentArgs = req.body;

        let errorMsg = '';

        if (!commentArgs.name) {
            errorMsg = 'Invalid name!'
        } else if (!commentArgs.content) {
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render(`article/comment/${id}`, {error: errorMsg});
            return;
        }




        commentArgs.article = id;

        Comment.create(commentArgs).then(comment => {

            let Article = mongoose.model('Article');
            Article.findById(commentArgs.article).then(article => {
                article.comments.push(comment.id);
                article.save();
            });
            res.redirect(`/article/details/${id}`);

        })


    }
};

