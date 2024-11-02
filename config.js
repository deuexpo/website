import bytes from 'bytes';
// import crypto from 'crypto';
import os from 'os';
import path from 'path';
import utils from '#root/modules/utils.js';
import {fileURLToPath} from 'url';

const root = path.dirname(fileURLToPath(import.meta.url)); // How to fix "__dirname is not defined in ES module scope: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/

const config = {
  httpServer: {
    limit: '64mb', // Maximum the size of POST request, prevent error: "request entity too large"
    port: process.env.HTTP_SERVER_PORT,
  },
  mongoose: {
    uri: process.env.MONGODB_URL,
    options: {
      autoIndex: false, // Disabled in production since index creation can cause a significant performance impact
    },
  },
  root,
  sitename: process.env.SITENAME,
};

export default utils.deepFreeze(config);
