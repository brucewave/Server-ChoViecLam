const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/multer');

router.post('/uploadImage', upload.single('image'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (error, result) {
        if (error) {
            res.status(500).json({ message: 'Upload image failed', error: error });
        } else {
            res.status(200).json({ message: 'Upload image successfully', data: result });
        }
    });
});

module.exports = router;
