import express from 'express';

import signUpRouter from './routes/signUpRouter';
import loginRouter from './routes/loginRouter';

const app = express();

app.use('/signUp', signUpRouter);
app.use('/login', loginRouter);

app.listen(3000, () => {
    console.log("server is running");
});
