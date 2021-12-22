const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

});

const Post = mongoose.Model("Post", postSchema)

module.exports = Post;