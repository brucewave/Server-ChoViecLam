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

const getMeInfor = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('Người dùng không tồn tại');
    }

    res.status(200).json({
        message: 'Thông tin người dùng',
        data: user,
    });
});



module.exports = {
    getAllUsers,
    getMeInfor,
};
