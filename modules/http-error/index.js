import messages from './messages.js';

class HttpError extends Error {
  constructor(code, message) {
    super(message || messages[code]);
    this.code = code; // HTTP error status code. Example: 404
    this.name = this.constructor.name; // Saving class name in the property of our custom error.
    Error.captureStackTrace(this, this.constructor); // Capturing stack trace, excluding constructor call from it.
  }
}

export default HttpError;
