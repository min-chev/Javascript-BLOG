const Category = require('mongoose').model('Category');
const Tag = require('mongoose').model('Tag');


module.exports = {
    all: (req, res) => {
        Tag.find({}).then(tags => {
            res.render('admin/tags/all', {tags: tags})
        })
    },
    editGet: (req, res) => {
        let id = req.params.id;

        Tag.findById(id).then(tag => {
            res.render('admin/tags/edit', {tag: tag})
        })

    },

    editPost: (req, res) => {
        let id = req.params.id;

        let editArgs = req.body;

        if(!editArgs.name){
            let errorMsg = 'Tag name cannot be null!';
            Tag.findById(id).then(tag => {
                res.render('admin/tags/edit', {tag: tag, error: errorMsg})
            })

        }else{
            Tag.findOneAndUpdate({_id:id}, {name: editArgs.name}).then(tag => {
                res.redirect('/admin/tags/all')

            })
        }

    },
    deleteGet: (req, res) => {
        let id = req.params.id;

        Tag.findById(id).then(tag => {
            res.render('admin/tags/delete', {tag: tag})
        })

    },
    deletePost: (req, res) => {
        let id = req.params.id;

        Tag.findOneAndRemove({_id: id}).then(tag => {
             res.redirect('/admin/tags/all')
        })

    },

};