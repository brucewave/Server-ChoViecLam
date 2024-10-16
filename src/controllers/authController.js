const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const UserModel = require('../models/userModel');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	auth: {
		user: process.env.USERNAME_EMAIL,
		pass: process.env.PASSWORD_EMAIL,
	},
});

const getJsonWebToken = async (email, id) => {

	const payload = {
		email,
		id,
	};

	const token = jwt.sign(
		payload, 
		process.env.SECRET_KEY, 
		{expiresIn: '7d'}
	);

	return token;
}


const handleSendMail = async (val) => {
	try {
		await transporter.sendMail(val);

		return 'OK';
	} catch (error) {
		return error;
	}
};

const verification = asyncHandle(async (req, res) => {
	const { email } = req.body;

	const verificationCode = Math.round(1000 + Math.random() * 9000);

	try {
		const data = {
			from: `"Support ChoViecLam Appplication" <${process.env.USERNAME_EMAIL}>`,
			to: email,
			subject: 'Mã Xác Nhận OPT Chợ Việc Làm',
			text: 'Mã xác nhận của bạn là:',
			html: `<h1>${verificationCode}</h1>`,
		};

		await handleSendMail(data);

		res.status(200).json({
			message: 'Gửi mã xác nhận thành công',
			data: {
				code: verificationCode,
			},
		});
	} catch (error) {
		res.status(401);
		throw new Error('Không thể gửi email');
	}
});


const register = asyncHandle(async (req, res) => {
	const {email, fullname, password} = req.body;

	const existingUser = await userModel.findOne({email});

	if (existingUser) {
		res.status(401);
		throw new Error('Tài khoản đã tồn tại');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	
	const newUser = new UserModel({
		email,
		fullname: fullname ?? '', 
		password: hashedPassword});

	await newUser.save();

	res.status(200).json({
		message: 'Tạo thành công!',
		data:{
			email: newUser.email,
			id: newUser.id,
			accesstoken: await getJsonWebToken(email, newUser.id),
		},
	});
});	

const login = asyncHandle(async (req, res) => {
	const {email, password} = req.body;

	const existingUser = await userModel.findOne({email});

	if (!existingUser) {
		res.status(403).json({
			message: 'Tài khoản không tồn tại',
		});
		throw new Error('Tài khoản không tồn tại');
	}
	
	const isMatchPassword = await bcrypt.compare(password, existingUser.password);

	if(!isMatchPassword){
		res.status(401);
		throw new Error('Email hoặc mật khẩu không đúng');
	}

	res.status(200).json({
		message: 'Đăng nhập thành công',
		data: {
			email: existingUser.email,
			id: existingUser.id,
			accesstoken: await getJsonWebToken(email, existingUser.id),
		},
	});
});

const forgotPassword = asyncHandle(async (req, res) => {
	const {email} = req.body;

	const randomPassword = Math.round(1000 + Math.random() * 999000);
	
	const data = {
		from: `"Support ChoViecLam Appplication" <${process.env.USERNAME_EMAIL}>`,
		to: email,
		subject: 'ChoViecLam - Mật Khẩu Mới',
		text: 'Mật khẩu mới của bạn là:',
		html: `<h1>${randomPassword}</h1>`,
	};


	const user = await userModel.findOne({email});
	if(user){
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(`${randomPassword}`, salt);
		await userModel.findByIdAndUpdate(user._id, {
			password: hashedPassword,
			isChangePassword: true,
		});
		await handleSendMail(data).then(()=>{
			res.status(200).json({
				message: 'Gửi mật khẩu mới thành công',
				data: []
			});
		}).catch((error)=>{
			res.status(401);
			throw new Error('Không thể gửi email');
		});
	}else{
		res.status(401);
		throw new Error('Tài khoản không tồn tại');
	}

});

module.exports = {
	register,
	login,
	verification,
	forgotPassword,
};
