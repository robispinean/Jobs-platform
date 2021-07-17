import http from 'http';

import app from '../app.mjs';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT);
