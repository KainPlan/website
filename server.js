const express = require('express'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    bcrypt = require('bcrypt'),
    cookieParser = require('cookie-parser'),
    chalk = require('chalk'),
    winston = require('winston'),
    fs = require('fs'),
    cv = require('compare-versions'),
    handlebars = require('handlebars');
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

function err_msg(res, code, opts = { err: undefined, msg: undefined }) {
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
        logger.error({
            message: opts.err,
            code: 500,
        });
    }

    res.status(code);
    res.send(`{"msg": "${opts.msg ? opts.msg : code_dict[code]}"}`);
}

function e500(err, res) {
    err_msg(res, 500, { err: err });
}

app.get('/api/map/:m_name', (req, res) => {
    sess.verify_request(req, res, err => {
        if (err) {
            if (err.message !== 'error 500') {
                err_msg(res, 401);
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            let f_path = path.join(__dirname, path.normalize(`res/maps/${req.params.m_name}.map.json`)
                .replace(/^(\.\.(\/|\\|$))+/, ''));

            if (fs.existsSync(f_path)) {
                fs.readFile(f_path, (err, data) => {
                    if (err) {
                        e500(err, res);
                    } else {
                        res.send(`{"success": true, "map": ${data}}`);
                    }
                });
            } else {
                err_msg(res, 404);
            }
        }
    }, e500);
});

app.get('/api/version/:m_name', (req, res) => {
    sess.verify_request(req, res, err => {
        if (err) {
            if (err.message !== 'error 500') {
                err_msg(res, 401);
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            let f_path = path.join(__dirname, path.normalize(`res/maps/${req.params.m_name}.map.json`)
                .replace(/^(\.\.(\/|\\|$))+/, ''));

            if (fs.existsSync(f_path)) {
                fs.readFile(f_path, (err, data) => {
                    if (err) {
                        e500(err, res);
                    } else {
                        res.send(`{"success": true, "version": "${JSON.parse(data.toString()).version}"}`);
                    }
                });
            } else {
                err_msg(res, 404);
            }
        }
    }, e500);
});

function valid_map(map) {
    // let m_keys = ['version', 'nodes', 'beacons', 'width', 'height', 'background', 'current_floor'],
    //     b_keys = ['srcs', 'objs'];

    // Object.keys(map).forEach(k => {
    //     m_keys.splice(m_keys.indexOf(k), 1);
    // });
    // if (map.background) {
    //     Object.keys(map.background).forEach(k => {
    //         b_keys.splice(b_keys.indexOf(k), 1);
    //     });
    // }

    // return m_keys.length === 0 && b_keys.length === 0;
    return true;
}

function write_map(m_name, map, res) {
    let m_path = path.join(__dirname, path.normalize(`res/maps/${m_name}.map.json`)
        .replace(/^(\.\.(\/|\\|$))+/, ''));

    fs.writeFile(m_path, JSON.stringify(map), err => {
        if (err) {
            e500(err, res);
        } else {
            res.send(`{"success": true}`);
        }
    });
}

app.put('/api/map/:m_name', (req, res) => {
    sess.get(req.connection.remoteAddress, req.cookies['token'], (err, s) => {
        if (err) {
            e500(err, res);
        } else if (!s) {
            err_msg(res, 401);
        } else {
            sess.use(s);
            db.get_user(s.uname, (err, user) => {
                if (err || !user) {
                    e500(err, res);
                } else {
                    db.get_priv(user.priv, (err, p) => {
                        if (err || !p) {
                            e500(err, res);
                        } else if (!p.admin) {
                            err_msg(res, 403);
                        } else {
                            if (!req.body.map) {
                                err_msg(res, 400, { msg: 'Missing map!' });
                            } else if (!req.params.m_name) {
                                err_msg(res, 400, { msg: 'Missing map name!' });
                            } else {
                                let m_path = path.join(__dirname, path.normalize(`res/maps/${req.params.m_name}.map.json`)
                                    .replace(/^(\.\.(\/|\\|$))+/, ''));
                
                                if (!valid_map(req.body.map)) {
                                    err_msg(res, 400, { msg: 'Invalid map!' });
                                } else {
                                    if (fs.existsSync(m_path)) {
                                        fs.readFile(m_path, (err, data) => {
                                            if (err) {
                                                e500(err, res);
                                            } else {
                                                let prev_map = JSON.parse(data);
                                                if (cv(prev_map.version, req.body.map.version) >= 0) {
                                                    err_msg(res, 400, { msg: 'Version can\'t be older than existent one!' });
                                                } else {
                                                    write_map(req.params.m_name, req.body.map, res);
                                                }
                                            }
                                        });
                                    } else {
                                        write_map(req.params.m_name, req.body.map, res);
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
    });
});

app.get('/api/maps/', (req, res) => {
    sess.verify_request(req, res, err => {
        if (err) {
            if (err.message !== 'error 500') {
                err_msg(res, 401);
            }
        } else {
            fs.readdir(path.join(__dirname, 'res/maps/'), (err, files) => {
                if (err) {
                    e500(err, res);
                } else {
                    let maps = files.filter(f => f.match(/^[\w\W]*.map.json$/))
                        .map(f => {
                            return {
                                name: f.replace(/.map.json$/, ''), 
                                timestamp: fs.statSync(path.join(__dirname, 'res/maps', f)).mtimeMs
                            }
                        });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        success: true,
                        maps: maps,
                    }));
                }
            });
        }
    }, e500);
});

app.post('/api/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    sess.verify_request(req, res, err => {
        if (!err) {
            err_msg(res, 400, { msg: 'Already logged in!' });
        } else if (err.message !== 'error 500') {
            if (!req.body.uname || !req.body.pwd || req.body.uname.length === 0 || req.body.pwd.length === 0) {
                err_msg(res, 400, { msg: 'No username/password!' });
            } else {
                db.get_user(req.body.uname, (err, user) => {
                    if (err) {
                        e500(err, res);
                    } else if (!user) {
                        err_msg(res, 400, { msg: 'User doesn\'t exist!' });
                    } else {
                        bcrypt.compare(req.body.pwd, user.pwd, (err, same) => {
                            if (err) {
                                e500(err, res);
                            } else {
                                if (same) {
                                    sess.new(req.connection.remoteAddress, user.uname, (err, s) => {
                                        if (err) {
                                            e500(err, res);
                                        } else {
                                            res.cookie('token', s.token);
                                            res.send('{"success": true, "msg": "Welcome back!"}');
                                        }
                                    });
                                } else {
                                    err_msg(res, 400, { msg: 'Wrong password!' });
                                }
                            }
                        });
                    }
                });
            }
        }
    }, e500);
});

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get(['/map', '/map.html'], (req, res) => {
    fs.readFile(path.join(__dirname, 'public/map.html'), (err, data) => {
        if (err) {
            e500(err, res);
        } else {
            let temp = handlebars.compile(data.toString());
            sess.get(req.connection.remoteAddress, req.cookies['token'], (err, s) => {
                if (err) {
                    e500(err, res);
                } else if (!s) {
                    res.send(temp({
                        uname: '',
                    }));
                } else {
                    sess.use(s);
                    db.get_user(s.uname, (err, u) => {
                        if (err) {
                            e500(err, res);
                        } else {
                            res.send(temp({
                                uname: u.uname,
                            }));
                        }
                    });
                } 
            });
        }
    });
});

app.get(['/login', '/login.html'], (req, res) => {
    sess.verify_request(req, res, err => {
        if (!err) {
            res.redirect('/');
        } else {
            res.sendFile(path.join(__dirname, 'public/login.html'));
        }
    }, e500);
});

app.get(['/map-creator', '/map-creator.html'], (req, res) => {
    fs.readFile(path.join(__dirname, 'public/map-creator.html'), (err, data) => {
        if (err) {
            e500(err, res);
        } else {
            let temp = handlebars.compile(data.toString());
            sess.get(req.connection.remoteAddress, req.cookies['token'], (err, s) => {
                if (err) {
                    e500(err, res);
                } else if (!s) {
                    res.redirect('/login');
                } else {
                    sess.use(s);
                    db.get_user(s.uname, (err, u) => {
                        if (err) {
                            e500(err, res);
                        } else {
                            db.get_priv(u.priv, (err, p) => {
                                if (err) {
                                    e500(err, res);
                                } else {
                                    res.send(temp({
                                        is_admin: p.admin,
                                    }));
                                }
                            });
                        }
                    });
                } 
            });
        }
    });
});

app.use('/', express.static('public/'));

app.use('/', (req, res, next) => {
    res.redirect('/404.html');
});

http_server.listen(conf.port, conf.hostname, () => console.log(
    chalk` [${new Date().toISOString()} | {bold.underline.hex('#FFA92E') WEB-SERVER}]: Available on:` +
    chalk` {hex('#FFDFB9') http://${conf.hostname}:${conf.port}} ... `
));