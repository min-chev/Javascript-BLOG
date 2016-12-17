const User = require("./../models/User");
const Article = require("./../models/Article");
const Category = require("./../models/Category");



module.exports = {
    createGet: (req, res) => {

        if(!req.isAuthenticated()) {
            let returnUrl = '/article/create';
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }
        Category.find({}).then(categories => {
            res.render('article/create', {categories:categories});
        });

    },
    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = '';

        if(!req.isAuthenticated()){
            errorMsg = 'You have to be logged in to create articles!'
        }else if(!articleArgs.title){
            errorMsg = 'Invalid title!';
        }else if(!articleArgs.content){
            errorMsg = 'Invalid content!'
        }

        if(errorMsg){
            res.render('article/create', { error: errorMsg} );
            return;
        }

        articleArgs.author = req.user.id;
        Article.create(articleArgs).then(article => {
            article.prepareInsert();
            res.redirect('/')

        })


    },
    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            if(!req.user) {
                res.render('article/details',{article: article, isUserAuthorized: false});
                return;
            }


            req.user.isInRole('Admin').then(isAdmin => {
                let isUserAuthorized = isAdmin||req.user.isAuthor(article);
                res.render('article/details',{article: article, isUserAuthorized: isUserAuthorized});

            })
        });


    },

    editGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()) {
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }
        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }
            });
            Category.find({}).then(categories => {
                article.categories = categories;
                res.render('article/edit', article);

            });
        })

    },

    editPost: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()) {
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }

        let articleArgs = req.body;

        let errorMsg = '';

        if(!articleArgs.title){
            errorMsg = 'Invalid title!';
        }else if(!articleArgs.content){
            errorMsg = 'Invalid content!';
        }

        if(errorMsg){
            res.render('article/edit', {error:errorMsg})
        }else{

            Article.findById(id).populate('category').then(article => {
                if(!article.category.id !== articleArgs.category){
                    article.category.articles.remove(article.id);
                    article.category.save();
                }

                article.category = articleArgs.category;
                article.title = articleArgs.title;
                article.content = articleArgs.content;

                article.save((err) => {
                    if(err){
                        console.log(err.message);
                    }

                    Category.findById(article.category).then(category => {
                        if(category.articles.indexOf(article.id) !== -1){
                            category.articles.push(article.id);
                            category.save();
                        }

                        res.redirect(`article/details/${id}`)
                    })





                })
            })

        }
    },


    deleteGet: (req, res) => {
        let id = req.params.id;

        if(!req.isAuthenticated()) {
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');


        }
        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if(!isAdmin&&!req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }
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
    }
};

