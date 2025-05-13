const express = require('express');
const { createUser, logIn, logout, getUsersWithTaskCounts, getUserById, updateUser, forgotPassword } = require('../Controllers/authController');
const { verifyToken, isAdminz } = require('../Utitz/verifyToken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const userRouter = express.Router();
const storage = multer.memoryStorage();

const upload = multer({storage:storage});

userRouter.post('/register', createUser);
userRouter.post('/login', logIn);
userRouter.get('/logout', logout);
userRouter.get('/allUsers', verifyToken, isAdminz, getUsersWithTaskCounts);
userRouter.get('/user/:id', verifyToken, isAdminz, getUserById);
userRouter.post('/update-user', verifyToken, updateUser);
userRouter.post('/reset-password', forgotPassword);
userRouter.get('/user-pass', verifyToken, (req, res) => {
  res.status(200).send({
      ok: true
  });
});

userRouter.get('/admin-pass', verifyToken, isAdminz, (req, res) => {
  res.status(200).send({
      ok: true
  });
});

userRouter.post('/uploadProfilePhoto', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const fileBuffer = req.file.buffer;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        upload_preset: 'work-wise',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 800, height: 800, crop: 'fill', gravity: 'auto' }
        ]
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(fileBuffer);
    });

    // Just return the Cloudinary upload result
    res.status(200).json({
      secure_url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Upload to Cloudinary failed');
  }
});

 

module.exports = userRouter;