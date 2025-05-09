import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/index.js';
import { userRouter, categoryRouter, courseRouter, enrollmentRouter, reviewRouter } from './routes/index.js';
import { logger } from './utils/logger/logger.js';

config();

const app = express();
const PORT = +process.env.PORT

app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use('/auth', userRouter);
app.use('/category', categoryRouter);
app.use('/course', courseRouter);
app.use('/enrollment', enrollmentRouter);
app.use('/review', reviewRouter);

process.on('uncaughtException', (err) => {
    if (err) console.log(`Uncaught exception: ${err}`);
    process.exit(1);
});

process.on('unhandledRejection', (reasion, promise) => {
    console.log(`Unhandled rejection: ${reasion}`);
});

app.use((err, req, res, next) => {
    if (err) {
        return res
            .status(500)
            .json({ error: err.message || 'Internal server error' });
    } else {
        return next();
    }
});

app.listen(PORT, logger.info(`Server running on port ${PORT}`));
