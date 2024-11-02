#!/usr/bin/env node
/* eslint-disable strict */

'use strict';

import config from '#root/config.js';
import http from 'http';
import mongooseClient from '#root/modules/mongoose-client.js';
import server from '#root/services/http-server.js';

const {port} = config.httpServer;

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function main() {
  try {
    await mongooseClient.connect();
    server.set('port', port);
    const httpServer = http.createServer(server);
    httpServer.on('error', onError);
    httpServer.on('listening', async () => {
      const addr = httpServer.address();
      console.info(`Listening on port ${addr.port}`);
    });
    httpServer.listen(port);
  } catch (err) {
    await mongooseClient.disconnect();
    console.error(err);
    process.exit(1);
  }
}

main().catch(console.error);
