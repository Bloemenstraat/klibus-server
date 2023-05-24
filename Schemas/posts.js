const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    animal: String,
    breed: String,
    category: String,
    description: String,
    numComments: Number,
    date: Date
});

postSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('Posts', postSchema, 'posts')