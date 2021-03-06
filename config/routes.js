const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin');
const tagController = require('./../controllers/tag');





module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/category/:id', homeController.listCategoryArticles);

    app.get('/contact', homeController.contact);


    app.get('/user/register', userController.registerGet);

    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);

    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logOut);

    app.get('/user/details/:id', userController.details);

    app.get('/article/create', articleController.createGet);

    app.post('/article/create', articleController.createPost);

    app.get('/article/details/:id', articleController.details);

    app.get('/article/edit/:id', articleController.editGet);

    app.post('/article/edit/:id', articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);

    app.post('/article/delete/:id', articleController.deletePost);

    app.get('/article/comment/:id', articleController.commentGet);

    app.post('/article/comment/:id', articleController.commentPost);



    app.use((req, res, next) => {
        if(req.isAuthenticated()){
            req.user.isInRole('Admin').then(isAdmin => {
                if(isAdmin){
                    next();
                }else{
                    res.redirect('/')
                }

            })
        }
        else {
            res.redirect('/user/login')
        }
    });
    app.get('/admin/user/all', adminController.user.all);

    app.get('/admin/user/edit/:id', adminController.user.editGet);

    app.post('/admin/user/edit/:id', adminController.user.editPost);


    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/category/all', adminController.category.all);

    app.get('/admin/category/create', adminController.category.createGet);
    app.post('/admin/category/create', adminController.category.createPost);

    app.get('/admin/category/edit/:id', adminController.category.editGet);
    app.post('/admin/category/edit/:id', adminController.category.editPost);

    app.get('/admin/category/delete/:id', adminController.category.deleteGet);
    app.post('/admin/category/delete/:id', adminController.category.deletePost);

    app.get('/tag/:name', tagController.listArticlesByTag);

    app.get('/admin/tags/all', adminController.tags.all);

    app.get('/admin/tags/edit/:id', adminController.tags.editGet);
    app.post('/admin/tags/edit/:id', adminController.tags.editPost);

    app.get('/admin/tags/delete/:id', adminController.tags.deleteGet);
    app.post('/admin/tags/delete/:id', adminController.tags.deletePost);

    app.get('/admin/comments/all', adminController.comments.all);

    app.get('/admin/comments/edit/:id', adminController.comments.editGet);
    app.post('/admin/comments/edit/:id', adminController.comments.editPost);

    app.get('/admin/comments/delete/:id', adminController.comments.deleteGet);
    app.post('/admin/comments/delete/:id', adminController.comments.deletePost);




};