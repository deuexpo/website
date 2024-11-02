import HttpError from '#root/modules/http-error/index.js';
import config from '#root/config.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import loggerMiddleware from '#root/modules/logger-middleware.js';
import routes from '#root/routes/index.js';
import sendErrorMiddleware from '#root/modules/send-error-middleware/index.js';

const app = express();

// app.set('trust proxy', true); // How to User’s get IP address in Express JS: https://stackfame.com/get-ip-address-node
app.set('trust proxy', 'loopback, linklocal, uniquelocal'); // Express behind proxies: http://expressjs.com/en/guide/behind-proxies.html

app.use(sendErrorMiddleware); // Should be placed before other app.use to handle errors in all middlewares
app.use(helmet({contentSecurityPolicy: false})); // contentSecurityPolicy forces to request content via HTTPS
app.use(loggerMiddleware({enable: (process.env.NODE_ENV === 'development')}));

app.use(express.json({limit: config.httpServer.limit}));
app.use(express.urlencoded({limit: config.httpServer.limit, extended: false}));

app.use(cookieParser());
app.use(fileUpload());

routes(app);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.sendError(new HttpError(404)); // Catch 404 (page not found)
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.sendError(err); // Error handler
});

export default app;
