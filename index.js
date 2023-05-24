const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const PostRouter = require('./Routes/posts.js');
const UserRouter = require('./Routes/users.js');
const CommentRouter = require('./Routes/comments.js');
const Posts = require('./Schemas/posts.js');
const {initDB, getDB, getGFS} = require('./db.js');

dotenv.config();

const corsOptions = {
    exposedHeaders: 'auth-token',
};

initDB();
const conn = getDB();

conn.on('open', () => {
    console.log('Connected to DB!');
    
    const app = express();
    const PORT = process.env.PORT || 6000; 

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use('/api/posts', PostRouter);
    app.use('/api/users', UserRouter);
    app.use('/api/comments', CommentRouter);

    app.listen(PORT, () => {
        console.log(`Connected to server in port ${PORT}!`);
    });
});

/*
mongoose.connect(process.env.DB_ADDRESS, () => {
    
    
});
*/