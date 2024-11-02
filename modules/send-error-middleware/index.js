import HttpError from '#root/modules/http-error/index.js';
import httpMessages from '#root/modules/http-error/messages.js';

function sendErrorMiddleware(req, res, next) {
  res.sendError = (error) => {
    try {
      if (error instanceof HttpError) {
        const err = {
          code: error.code || 500,
          message: error.message || httpMessages[500],
          stack: (process.env.NODE_ENV === 'development') ? error.stack : '',
        };
        res.status(err.code);
        if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
          res.json(err);
        } else {
          res.send(`<h1>${err.code}</h1><h2>${err.message}</h2><pre>${err.stack}</pre>`);
        }
      } else {
        const message = (process.env.NODE_ENV === 'development') ? error.message : '';
        res.sendError(new HttpError(500, message));
      }
    } catch (err) {
      console.error(err);
    } finally {
      error.url = req.originalUrl; // eslint-disable-line no-param-reassign
      if (error && error.code !== 404) {
        console.error(error);
      }
    }
  };
  next();
}

export default sendErrorMiddleware;
