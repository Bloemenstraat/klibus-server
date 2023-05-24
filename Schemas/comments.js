const mongoose = require('mongoose'); 

const commentSchema = new mongoose.Schema({
    parentId: mongoose.Types.ObjectId,
    author: String,
    content: String,
    date: Date
});

module.exports = mongoose.model('Comments', commentSchema, 'comments');