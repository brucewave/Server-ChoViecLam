const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

    const getJsonWebToken = async(id, email) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
    return token;
}

const register = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        res.status(401);
        throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        fullname,
        email,
        password: hashedPassword
    });

    await newUser.save();

    // Await the token generation
    const accesstoken = await getJsonWebToken(newUser._id, newUser.email);

    res.status(200).json({
        message: 'User created successfully',
        data: {
            ...newUser.toObject(),
            accesstoken
        }
    });
});


module.exports = {
    register,
};
