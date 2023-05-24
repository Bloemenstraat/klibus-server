const express = require('express');
const Posts = require('../Schemas/posts');
const Users = require('../Schemas/users')
const auth = require('../Middleware/auth');
const imgUpload = require('../Middleware/imgUpload');
const { GridFsStorage } = require('multer-gridfs-storage');
const {getGFS} = require('../db');

PostRouter = express.Router();

//Get all the annoucements
PostRouter.get('/', async (req, res) => {    
    let data = await Posts.find().lean();
    let displayData = [];

    for(var i = 0; i < data.length; i++) {
        ['content', 'author'].forEach((element)=> {
            delete data[i][element];
        });
    }
    
    res.status(200).json(data.reverse());
});

//Get a single annoucement for display in the front end
PostRouter.get('/:id', async (req, res) => {
    
    let data = await Posts.findOne({"_id": req.params.id}).lean();
    console.log(data)

    if (data == null)
        res.status(404).send(`No element with id ${req.params.id}`);
    else 
        res.status(200).send(data);
});

//Get a single image
PostRouter.get('/images/:filename', async (req, res) => {
    const gfs = getGFS();
    let image = await gfs.find({filename: req.params.filename});
    
    image.toArray((err, files) => {
        if (!err)
            gfs.openDownloadStreamByName(files[0].filename).pipe(res);
    });
});

//Post a new annoucement 
PostRouter.post('/', [imgUpload, auth], async (req, res) => {
    const user = await Users.findOne({"_id": req.user._id});
    const newPost = new Posts({
        title: req.body.title,
        author: user.username,
        image: req.file.filename,
        animal: req.body.animal,
        breed: req.body.breed,
        category: req.body.category,
        description: req.body.description,
        numComments: 0,
        date: Date()
    });
    const data = await newPost.save();
    res.send(data);
});

// Remove an annoucement
PostRouter.delete('/:id', async (req, res) => {
    const {deletedCount} = await Posts.deleteOne({'_id': req.params.id});
    
    if (deletedCount == 0)
        return res.status(404).send('Pas trouvé, pas effacé');
    
    return res.status(200).send('Sucesss');

});

//TODO: 
//- Get a certain number of annoucements at one time
//- Add comments
// - Remove/update comments and annoucements

module.exports = PostRouter;   