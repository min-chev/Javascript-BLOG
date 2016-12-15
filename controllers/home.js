const mongoose = require('mongoose');
const Article = require('./../models/Article');

module.exports = {
  index: (req,res) => {
Article.find({}).limit(6).populate('author').then(articles => {
    res.render('home/index', {articles:articles});
})

  }
};