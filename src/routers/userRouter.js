const Router = require('express');
const {getAllUsers, getMeInfor, getEventsFollowed, getProfile, getFollowings,updateProfile} = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/me', getMeInfor);
userRouter.get('/getJobsFollowed', getEventsFollowed);
userRouter.get('/getProfile', getProfile)
userRouter.get('/getFollowers', getFollowings)
userRouter.put('/updateProfile', updateProfile)


module.exports = userRouter;
