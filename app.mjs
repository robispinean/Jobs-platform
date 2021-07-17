import express from 'express';
import logger from 'morgan';
import path from 'path';

import util from './util/general-utils.mjs';

const app = express();

const dirpath = util.getCurrentDirectoryFromURL(import.meta.url);

app.set('views', path.join(dirpath, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(dirpath, 'public')));

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Express',
  });
});

export default app;
