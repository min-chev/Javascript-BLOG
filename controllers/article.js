const User = require("./../models/User");
const Article = require("./../models/Article");


module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
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
            req.user.articles.push();
            req.user.save(err => {
                if(err){
                    res.redirect('/', {error: err.message });
                }else{
                    res.redirect('/')
                }
            })
        })

    },
    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            res.render('article/details', article)
        })
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/edit', article);
        })
    },

    editPost: (req, res) => {
        let id = req.params.id;

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

            Article.update({_id: id}, {$set: {title: articleArgs.title, content: articleArgs.content}}).then(updateStatus => {
                res.redirect(`/article/details/${id}`)
            })


        }
    },


    deleteGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/delete', article);
        })
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Article.findOneAndRemove({_id:id}).populate('author').then(article=> {
            let author = article.author;

            //index of the article's id in author's articles
            let index = author.articles.indexOf(article.id);

            if(index<0){
                let errorMsg = 'Article was not found for that author!';
                res.render('article/delete', {error: errorMsg});
            }else {
                //remove 1 element after index(inclusive)
                author.articles.splice(index, 1);
                author.save().then(user => {
                    res.redirect('/');
                })
            }
        })
    }
};

