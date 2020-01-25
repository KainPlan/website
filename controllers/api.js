const error = require('../utils/error');
const io = require('../utils/map-io');
const path = require('path');
const fs = require('fs');

exports.get_default_map = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  fs.readFile(path.resolve(__dirname, '..', 'res/maps/conf.json'), (err, data) => {
    if (err) return error.e500(err, res);
    let m_conf = JSON.parse(data);
    let cu_path = io.get_map_path(m_conf.current_map);
    if (!fs.existsSync(cu_path)) return error.e500(err, res);
    req.params = { m_name: m_conf.current_map };
    return exports.get_map(req, res);
  });
};

exports.get_map = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  io.read_map(req.params.m_name, (err, data) => {
    if (err) {
      if (err.message === '404') return error.err_msg(res, 404);
      return error.e500(err, res);
    }
    res.send(`{"success": true, "map": ${data.toString()}}`);
  });
};

exports.get_version = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  io.read_map(req.params.m_name, (err, data) => {
    if (err) {
      if (err.message === '404') return error.err_msg(res, 404);
      return error.e500(err, res);
    }
    res.send(JSON.stringify({
      success: true,
      version: JSON.parse(data).version,
    }));
  });
};

exports.put_map = function (req, res) {
  
};