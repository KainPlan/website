const fs = require('fs');
const path = require('path');

exports.get_map_path = function (m_name) {
  return path.resolve(__dirname, '..', 
                      path.normalize(`res/maps/${m_name}.map.json`)
             .replace(/^(\.\.(\/|\\|$))+/, ''));
};

exports.read_map = function (m_name, cb) {
  let f_path = exports.get_map_path(m_name);
  if (!fs.existsSync(f_path)) return cb(null, new Error('404'));
  fs.readFile(f_path, cb);
};

exports.write_map = function (m_name, map, cb) {
  let f_path = exports.get_map_path(m_name);
  fs.writeFile(f_path, JSON.stringify(map), cb);
};