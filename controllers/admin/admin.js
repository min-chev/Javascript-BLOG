const userController = require('./user');
const categoryController = require('./category');
const tagsController = require('./tags');



module.exports = {
    user: userController,
    category: categoryController,
    tags: tagsController,

};