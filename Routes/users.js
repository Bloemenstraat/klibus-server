const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Schemas/users');
const Posts = require('../Schemas/posts');
const auth = require('../Middleware/auth');

const UserRouter = express.Router();

//Simple registration
UserRouter.post('/register', async (req, res) => {
    const user = await User.findOne({'username': req.body.username});

    if (user != null)
        return res.status(409).send('Username already exists.')

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    let data = await newUser.save();
    res.status(200).send(data);
});

//Simple Login
UserRouter.post('/login', async (req, res) => {
    const user = await User.findOne({'username': req.body.username});

    if (user == null)
        return res.status(401).send('Wrong username')

    //comparer mot de passe
    if (user.password != req.body.password) 
        return res.status(401).send('Wrong password')

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.status(200).header('auth-token', token).send(user);

});

//Get user's posts
//TODO: Check if token exists
UserRouter.get('/posts/:author?', async (req, res) => {
    let author = req.params.author;
    if (author == null) {
        const token = req.header('auth-token');
        const user = jwt.verify(token, process.env.JWT_SECRET);
        author = await User.findOne({'_id': user._id});
        author = author.username;
    }

    let authorPosts = await Posts.find({'author': author}).exec();
    res.status(200).send(authorPosts);

});


//TODO:
//- Improve validation using Joi
//- Check if a user already exists


module.exports = UserRouter;