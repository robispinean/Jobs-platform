import debug from 'debug';
import dotenv from 'dotenv';
import http from 'http';

import app from '../app.mjs';

dotenv.config();

const { PORT } = process.env;

const server = http.createServer(app);

const log = debug('backend:server');

server.listen(PORT);

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
