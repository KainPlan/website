const error = require('./error');

exports.restrict = function (req, res, next) {
  if (req.session.uname) {
    next();
  } else {
    error.err_msg(res, 403);
  }
};