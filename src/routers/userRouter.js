const Router = require('express');
const {getAllUsers, getMeInfor} = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/me', getMeInfor);


module.exports = userRouter;
