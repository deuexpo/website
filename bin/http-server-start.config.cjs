/* eslint-disable camelcase */
const path = require('path');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'http-server-start',
      script: path.join(__dirname, 'http-server-start.js'),
      node_args: '-r dotenv/config',
      env: {
        NODE_PATH: path.join(__dirname, '..'),
      },
      time: true,
    },
  ],
};
