const express = require('express');
const userController = require('../Controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const user = require('../models/user');
const router = express.Router();


router.post('/send-otp',userController.sendOtp);

router.post('/verify-otp',userController.verifyOtp);

router.post('/logout',authMiddleware.authenticateToken,userController.logout);

router.get('/user-name', authMiddleware.authenticateToken ,userController.getUserName);

module.exports = router;