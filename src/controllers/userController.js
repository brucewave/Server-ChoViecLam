const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});

    
    const data = [];
    users.forEach((user) => {
        data.push({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    });

    res.status(200).json({
        message: 'Get all users successfully',
        data,
    });
});

module.exports = {
    getAllUsers,
};
