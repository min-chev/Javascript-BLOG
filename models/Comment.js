const mongoose = require('mongoose');
const User = require("./../models/User");



let commentsSchema = mongoose.Schema({
    content: {type: String, required: true, unique: false},
    author : {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    article : {type: mongoose.Schema.Types.ObjectId, ref:'Article'},


});


const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;