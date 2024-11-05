const asyncHandler = require('express-async-handler');

const getAllUsers = asyncHandler(async (req, res) => {
    console.log('ttetet');
    res.status(200).json({message: 'Hello World'});
});

module.exports = {
    getAllUsers,
};
