/** @format */
const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routers/authRouter');
const userRouter = require('./src/routers/userRouter');
const verifyToken = require('./src/middlewares/verifyMiddleware');
const connectDB = require('./src/configs/connectDb');
const errorMiddleHandle = require('./src/middlewares/errorMiddleware');
const uploadRouter = require('./src/controllers/uploadRouter');
const jobRouter = require('./src/routers/jobRouter');
const app = express();
require('dotenv').config();

// const userRouter = require('./src/routers/userRouter');
// const eventRouter = require('./src/routers/eventRouter');
// const verifyToken = require('./src/middlewares/verifyMiddleware');


app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use('/auth', authRouter);

app.use('/users', verifyToken, userRouter);
app.use('/jobs', jobRouter);
// app.use('/users', verifyToken, userRouter);
// app.use('/events', verifyToken, eventRouter);
// app.use('/upload', uploadRouter);
app.use('/upload', uploadRouter);
connectDB();

app.use(errorMiddleHandle);
app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`Server starting at http://localhost:${PORT}`);
});
