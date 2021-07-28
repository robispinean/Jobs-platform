import express from 'express';
import logger from 'morgan';
import path from 'path';
import util from './util/general-util.mjs';
import authRouter from './routes/authRoutes.mjs';
import postRoutes from './routes/postRoutes.mjs';
import { notFound, errorHandler } from './middleware/errorMiddleware.mjs';

const app = express();

const dirpath = util.getCurrentDirectoryFromURL(import.meta.url);

app.set('views', path.join(dirpath, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(dirpath, 'public')));

app.use(logger('dev'));

app.use('/api/auth', authRouter);

app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
