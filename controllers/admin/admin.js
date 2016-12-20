const userController = require('./user');
const categoryController = require('./category');
const tagsController = require('./tags');
const commentsController = require('./comments');




module.exports = {
    user: userController,
    category: categoryController,
    tags: tagsController,
    comments: commentsController,

};