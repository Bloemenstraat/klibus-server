const mongoose = require('mongoose');
require('dotenv').config();

let conn;
let gfs;

function initDB () {
    mongoose.connect(process.env.DB_ADDRESS_REMOTE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    conn = mongoose.connection;

    conn.on('open', () => {
        gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'images'
        });
    });
}

function getDB () {
    return conn;
}

function getGFS () {
    return gfs;
}


module.exports = {initDB, getDB, getGFS};
    

