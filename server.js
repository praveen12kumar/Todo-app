import express from "express";
import connectDB from "./backend/data/db.js";
import {config} from "dotenv";
import userRouter from "./backend/routes/userRoutes.js";
import taskRouter from "./backend/routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./backend/middlewares/error.js";
import cors from "cors";

const app = express();
config()

const PORT = process.env.PORT || 3000;

connectDB();

// middleware
app.use(express.json());
// cookie parser 
app.use(cookieParser());
// using Routes
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:['GET', 'POST', 'DELETE', 'PUT'],
    Credential:true
}));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send("Welcome")
});

// using error middleware
app.use(errorMiddleware);


app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT} in ${process.env.NODE_ENV} Mode`);
});