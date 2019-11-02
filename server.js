const express = require('express'),
      path = require('path'),
      http = require('http'),
      https = require('https'),
      bcrypt = require('bcrypt'),
      cookieParser = require('cookie-parser'),
      chalk = require('chalk'),
      winston = require('winston'),
      fs = require('fs');
const ip = require('./lib/ip'),
      sess = require('./lib/session'),
      db = require('./lib/db');
const app = express(),
      conf = require('./conf.json'),
      http_server = http.createServer(app),
      logger = winston.createLogger({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
          ),
          transports: [
              new winston.transports.File({
                  filename: 'server.log',
                  level: 'error',
                }),
          ],
      });

app.use(express.json());
app.use(cookieParser());
app.use('/', express.static('public/'));

function json_500(err, res) {
    logger.error({
        message: err,
        code: 500,
    });
    res.status(500);
    res.send('{"msg": "Internal server error!"}');
}

app.get('/api/map/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    fs.readFile(path.join(__dirname, 'res/maps/conf.json'), (err, data) => {
        if (err) {
            json_500(err, res);
        } else {
            let m_conf = JSON.parse(data),
                cu_path = path.join(__dirname, `res/maps/${m_conf.current_version}.map.json`);
            if (fs.existsSync(cu_path)) {
                fs.readFile(cu_path, (err, data) => {
                    if (err) {
                        json_500(err, res);
                    } else {
                        res.send(`{"success": true, "map": ${data}}`)
                    }
                });
            } else {
                json_500(err, res);
            }
        }
    });
});

app.get('/api/map/:version?', (req, res) => {
    sess.verify_request(req, res, err => {
        if (err) {
            if (err.message !== 'error 500') {
                res.status(401);
                res.send('{"msg": "Unidentified access!"}');
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            let f_path = path.join(__dirname, path.normalize(`res/maps/${req.params.version}.map.json`)
                             .replace(/^(\.\.(\/|\\|$))+/, ''));

            if (fs.existsSync(f_path)) {
                fs.readFile(f_path, (err, data) => {
                    if (err) {
                        json_500(err, res);
                    } else {
                        res.send(`{"success": true, "map": ${data}}`);
                    }
                });
            } else {
                res.status(404);
                res.send('{"msg": "Map not found!"}');
            }
        }
    }, json_500);
});

app.get('/api/maps/', (req, res) => {
    sess.verify_request(req, res, err => {
        if (err) {
            if (err.message !== 'error 500') {
                res.status(401);
                res.send('{"msg": "Unidentified access!"}');
            }
        } else {
            fs.readdir(path.join(__dirname, 'res/maps/'), (err, files) => {
                if (err) {
                    json_500(err, res);
                } else {
                    let maps = files.filter(f => f.match(/^[\w\W]*.map.json$/))
                                    .map(f => f.replace(/.map.json$/, ''));
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        success: true,
                        maps: maps,
                    }));
                }
            });
        }
    }, json_500);
});

app.post('/api/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    sess.verify_request(req, res, err => {
        if (!err) {
            res.status(400);
            res.send('{"msg": "Already logged in!"}');
        } else if (err.message !== 'error 500') {
            if (!req.body.uname || !req.body.pwd || req.body.uname.length === 0 || req.body.pwd.length === 0) {
                res.status(400);
                res.send('{"msg": "No username / password!"}');
            } else {
                db.get_user(req.body.uname, (err, user) => {
                    if (err) {
                        json_500(err, res);
                    } else if (!user) {
                        res.status(400);
                        res.send('{"msg": "User doesn\'t exist!"}');
                    } else {
                        bcrypt.compare(req.body.pwd, user.pwd, (err, same) => {
                            if (err) {
                                json_500(err, res);
                            } else {
                                if (same) {
                                    sess.new(req.connection.remoteAddress, user.uname, (err, s) => {
                                        if (err) {
                                            json_500(err, res);
                                        } else {
                                            res.cookie('token', s.token);
                                            res.send('{"success": true, "msg": "Welcome back!"}');
                                        }
                                    });    
                                } else {
                                    res.status(400);
                                    res.send('{"msg": "Wrong password!"}');
                                }
                            }
                        });
                    }
                });
            }
        }
    }, json_500);
});

app.use('/', (req, res, next) => {
    res.redirect('/404.html');
});

http_server.listen(conf.port, conf.hostname, () => console.log(
    chalk` [${new Date().toISOString()} | {bold.underline.hex('#FFA92E') WEB-SERVER}]: Available on:` + 
    chalk` {hex('#FFDFB9') http://${conf.hostname}:${conf.port}} ... `
));