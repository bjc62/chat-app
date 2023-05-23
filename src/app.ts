import express from 'express';

import signUpRouter from './routes/signUpRouter';
import loginRouter from './routes/userRouter';
import { AppDataSource } from "./connection/dataSource"

(async function () {
    await AppDataSource.initialize();

    const app = express();
    app.use('/signUp', signUpRouter);
    app.use('/user', loginRouter);

    app.listen(3000, () => {
        console.log("server is running");
    });
})();
