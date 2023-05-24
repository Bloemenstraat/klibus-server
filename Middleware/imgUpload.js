const multer = require('multer');
const dotenv = require('dotenv');
const {GridFsStorage} = require('multer-gridfs-storage');

dotenv.config();

const url = process.env.DB_ADDRESS;
const storage = new GridFsStorage({
    url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const fileinfo = {
                bucketName: 'images'
            }
            resolve(fileinfo);
        })
    }
});

const imgUpload = multer({storage});

module.exports = imgUpload.single('image');