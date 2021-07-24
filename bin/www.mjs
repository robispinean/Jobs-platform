import debug from 'debug';
import http from 'http';
import mongoose from 'mongoose';

import app from '../app.mjs';

const { PORT, DEBUG } = process.env;
const { DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

const server = http.createServer(app);

const log = debug(DEBUG);

mongoose.connect(
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.lonsy.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
).then(() => {
  server.listen(PORT);
  log('Connected to database');
}).catch((err) => { log(err); });

server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
  log(`Listening on ${bind}`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
