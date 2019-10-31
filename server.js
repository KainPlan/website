const express = require('express'),
      path = require('path'),
      http = require('http'),
      https = require('https'),
      bcrypt = require('bcrypt'),
      cookieParser = require('cookie-parser'),
      chalk = require('chalk'),
      winston = require('winston');
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

app.get('/api/map/:version?', (req, res) => {
    let mconf = require('./res/maps/conf.json');
    if (!req.params.version) {
        req.params.version = mconf.current_version;
    }
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, path.normalize(`res/maps/${req.params.version}.json`).replace(/^(\.\.(\/|\\|$))+/, '')));
});

app.post('/api/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.body.uname || !req.body.pwd || req.body.uname.length === 0 || req.body.pwd.length === 0) {
        res.status(400);
        res.send('{"msg": "No username / password!"}');
    } else {
        db.get_user(req.body.uname, (err, user) => {
            if (err) {
                logger.error({
                    message: err,
                    code: 500,
                });
                res.status(500);
                res.send('{"msg": "Internal server error!"}');
            } else if (!user) {
                res.status(400);
                res.send('{"msg": "User doesn\'t exist!"}');
            } else {
                bcrypt.compare(req.body.pwd, user.pwd, (err, same) => {
                    if (err) {
                        logger.error({
                            message: err,
                            code: 500,
                        });
                        res.sendStatus(500);
                        res.send('{"msg": "Internal server error!"}');
                    } else {
                        if (same) {
                            sess.get_w_uname(req.connection.remoteAddress, user.uname, (err, s) => {
                                if (err) {
                                    logger.error({
                                        message: err,
                                        code: 500,
                                    });
                                    res.status(500);
                                    res.send('{"msg": "Internal server error!"}');
                                } else if (!s) {
                                    sess.new(req.connection.remoteAddress, user.uname, (err, s) => {
                                        if (err) {
                                            logger.error({
                                                message: err,
                                                code: 500,
                                            });
                                            res.status(500);
                                            res.send('{"msg": "Internal server error!"}');
                                        } else {
                                            res.cookie('token', s.get_token());
                                            res.send('{"msg": "Welcome back!"}');
                                        }
                                    });     
                                } else {
                                    sess.use(req.connection.remoteAddress, s.get_token());
                                    res.cookie('token', s.get_token());
                                    res.send('{"msg": "Welcome back!"}');
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
});

app.use('/', (req, res, next) => {
    res.redirect('/404.html');
});

http_server.listen(conf.port, conf.hostname, () => console.log(
    chalk` [${new Date().toISOString()} | {bold.underline.hex('#FFA92E') WEB-SERVER}]: Available on:` + 
    chalk` {hex('#FFDFB9') http://${conf.hostname}:${conf.port}} ... `
));