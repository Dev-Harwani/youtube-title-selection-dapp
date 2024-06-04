import express from 'express';
import userRouter from "./routes/user"
import workerRouter from "./routes/worker"

const app = express();

app.use(express.json());

app.use("/user",userRouter);
app.use("/worker",workerRouter);

app.listen(3000)