const log = require('./log');

exports.err_msg = function (res, code, opts = { err: undefined, msg: undefined }) {
  let code_dict = {
    400: 'Bad request!',
    401: 'Unauthorized access!',
    402: 'Payment required!',
    403: 'Forbidden!',
    404: 'Resource not found!',
    405: 'Method not allowed!',
    406: 'Not acceptable!',
    407: 'Proxy Authentication Required!',
    408: 'Request Timeout!',
    409: 'Conflict!',
    410: 'Gone!',
    418: 'I\'m a teapot!',
    500: 'Internal server error!',
  };

  if (code === 500 && opts.err) {
    log.logger.error({
      message: opts.err,
      code: 500,
    });
  }

  res.status(code)
     .send(`{"msg": "${opts.msg ? opts.msg : code_dict[code]}"}`);
};

exports.e500 = function (err, res) {
  exports.err_msg(res, 500, { err: err, });
};