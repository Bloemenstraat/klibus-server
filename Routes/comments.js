const express = require('express');
const Posts = require('../Schemas/posts');
const Users = require('../Schemas/users');
const Comments = require('../Schemas/comments');
const auth = require('../Middleware/auth');


CommentRouter = express.Router();

CommentRouter.post('/', auth, async (req, res) => {
    const user = await Users.findOne({'_id': req.user._id});
    const username =  user.username;

    const newComment = new Comments({
        parentId: req.body.parentId,
        author: username,
        content: req.body.content,
        date: Date()
    });

    const data = await newComment.save();

    //Increment the number of comments in the Posts database
    const post = await Posts.findOne({'_id': req.body.parentId});
    post.numComments++;
    await post.save();

    res.status(200).send(data);
});

//Get one posts comments
CommentRouter.get('/', async (req, res) => {
    const comments = await Comments.find({'parentId': req.header('parentId')}).lean();
    
    res.status(200).send(comments);
});

//Get a user's comments
CommentRouter.get('/user', auth, async (req, res) => {
    const user = await Users.findOne({'_id': req.user._id});
    const comments = await Comments.find({'author': user.username}).lean();

    res.status(200).send(comments);    
});

//Delete a comment
// TODO: check that only a user can elete his own comment
CommentRouter.delete('/:id', async (req, res) => {
    const {deletedCount} = await Comments.deleteOne({'_id': req.params.id});
    if (deletedCount === 0)
        res.status(404).send('Raté');

    res.status(200).send('Great Success!');
});

module.exports = CommentRouter;