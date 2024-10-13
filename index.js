const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const app = express();
const connectDB = require("./src/config/connectDb");
const errorMiddleHandle = require("./src/middlewares/errorMiddleware");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/auth", authRouter);

connectDB();

app.use(errorMiddleHandle);

app.listen(PORT, (err) => {
    if(err){
        console.log(err)
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});

