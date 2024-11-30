const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');
const JobModel = require('../models/jobModel');

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

const getEventsFollowed = asyncHandler(async (req, res) => {
    const { uid } = req.query;

	if (uid) {
		const jobs = await JobModel.find({ followers: { $all: uid } });

		const ids = [];
		console.log(ids);
		jobs.forEach((job) => ids.push(job.id));

		res.status(200).json({
			message: 'Các công việc đã theo dõi',
			data: ids,
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing uid');
	}

});

const getFollowings = asyncHandler(async (req, res) => {
	const { uid } = req.query;

	if (uid) {
		const user = await UserModel.findById(uid);

		res.status(200).json({
			message: '',
			data: user.following,
		});
	} else {
		res.sendStatus(404);
		throw new Error('can not find uid');
	}
});

const updateProfile = asyncHandler(async (req, res) => {
	const body = req.body;
	const { uid } = req.query;

	if (uid && body) {
		await UserModel.findByIdAndUpdate(uid, body);

		res.status(200).json({
			message: 'Update profile successfully!!',
			data: [],
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing data');
	}
});

const getProfile = asyncHandler(async (req, res) => {
	const { uid } = req.query;

	// const accesstoken = await getAccessToken();
	// console.log(accesstoken);

	if (uid) {
		const profile = await UserModel.findOne({ _id: uid });

		res.status(200).json({
			message: 'Lấy Dữ Liệu Thành Công',
			data: {
				uid: profile._id,
				createdAt: profile.createdAt,
				updatedAt: profile.updatedAt,
				name: profile.name ?? '',
				givenName: profile.givenName ?? '',
				familyName: profile.familyName ?? '',
				email: profile.email ?? '',
				photoUrl: profile.photoUrl ?? '',
				bio: profile.bio ?? '',
				following: profile.following ?? [],
				interests: profile.interests ?? [],
			},
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing uid');
	}
});

module.exports = {
    getAllUsers,
    getMeInfor,
    getEventsFollowed,
    getProfile,
	getFollowings,
	updateProfile
};
