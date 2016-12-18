const Article = require('./../models/Article');
const Tag = require('./../models/Tag');

module.exports = {
    listArticlesByTag: (req, res) => {
        let name = req.params.name;

        Tag.findOne({name: name}).then(tag => {
            Article.find({tags: tag.id}).populate('author tags').then(articles => {
                res.render('tag/details', {articles: articles, tag: tag});
            })
        })
    }
};