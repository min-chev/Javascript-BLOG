const mongoose = require('mongoose');
const Article = require('./../models/Article');
const Category = require('./../models/Category');
const User = require('./../models/User');
const Tag = require('./../models/Tag');




module.exports = {
    index: (req, res) => {
        Category.find({}).then(categories => {
            res.render('home/index', {categories: categories})
        })
    },
    listCategoryArticles: (req, res) => {
        let id = req.params.id;

        Category.findById(id).populate('articles').then(category => {
            User.populate(category.articles, {path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }
                Tag.populate(category.articles, {path: 'tags'}, (err) => {
                    if(err){
                        console.log(err.message);
                    }
                });
                res.render('home/article', {articles: category.articles})

            })
        })
    },
    contact: (req, res) => {
        res.render('contact')
    }
};