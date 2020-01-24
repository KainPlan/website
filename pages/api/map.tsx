export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  fs.readFile(path.join(__dirname, 'res/maps/conf.json'), (err, data) => {
      if (err) {
          e500(err, res);
      } else {
          let m_conf = JSON.parse(data),
              cu_path = path.join(__dirname, `res/maps/${m_conf.current_map}.map.json`);
          if (fs.existsSync(cu_path)) {
              fs.readFile(cu_path, (err, data) => {
                  if (err) {
                      e500(err, res);
                  } else {
                      res.send(`{"success": true, "map": ${data}}`)
                  }
              });
          } else {
              e500(err, res);
          }
      }
  });
};