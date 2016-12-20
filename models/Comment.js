const mongoose = require('mongoose');
const User = require("./../models/User");



let commentsSchema = mongoose.Schema({
    name: {type: String, required: true, unique: false},
    content: {type: String, required: true, unique: false},
    article : {type: mongoose.Schema.Types.ObjectId, ref:'Article'},


});


const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;