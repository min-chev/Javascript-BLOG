
const Comment = require('mongoose').model('Comment');



module.exports = {
    all: (req, res) => {
        Comment.find({}).then(comments => {
            res.render('admin/comments/all', {comments: comments})
        })
    },
    editGet: (req, res) => {
        let id = req.params.id;

        Comment.findById(id).then(comment => {
            res.render('admin/comments/edit', {comment: comment})
        })

    },

    editPost: (req, res) => {
        let id = req.params.id;

        let editArgs = req.body;

        if(!editArgs.content){
            let errorMsg = 'Comment name cannot be null!';
            Comment.findById(id).then(comment => {
                res.render('admin/comments/edit', {comment: comment, error: errorMsg})
            })

        }else{
            Comment.findOneAndUpdate({_id:id}, {content: editArgs.content}).then(comment => {
                res.redirect('/admin/comments/all')

            })
        }

    },
    deleteGet: (req, res) => {
        let id = req.params.id;

        Comment.findById(id).then(comment => {
            res.render('admin/comments/delete', {comment: comment})
        })

    },
    deletePost: (req, res) => {
        let id = req.params.id;

        Comment.findOneAndRemove({_id: id}).then(comment => {
            res.redirect('/admin/comments/all')
        })

    },

};