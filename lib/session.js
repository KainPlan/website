const ip = require('./ip'),
      db = require('./db'),
      chalk = require('chalk'),
      crypto = require('crypto');
const conf = require('./session.json');

exports.KainSession = class {
    constructor(ip, token, uname) {
        this.ip = ip;
        this.token = token;
        this.uname = uname;
    }
};

function cleanupd() {
    console.log(chalk` [${new Date().toISOString()} | {bold.underline.hex('#2EFFEA') DB}]: Cleaning timed-out sessions ... `);
    db.del_outtimed_sessions(conf.timeout);
}
setInterval(cleanupd, conf.check_interval*1000*60);

exports.new = function (addr, uname, cb) {
    let s = new exports.KainSession(addr, crypto.randomBytes(8).toString('hex'), uname);
    db.add_session(s, err => {
        if (err && err.msg === 'duplicate-session-error') {
            exports.new(addr, uname, cb);
        } else {
            cb(err, s);
        }
    });
};

exports.exists = function (addr, token, cb) {
    db.exists(`
        SELECT *
        FROM sessions
        WHERE ip = ?
              AND token = ?`, [addr, token], (err, exists) => {
        cb(err, exists);
    });
}

exports.get = function (addr, token, cb) {
    db.get_session(addr, token, (err, s) => {
        if (err) cb(err, null);
        else if (!s) cb(err, undefined);
        else cb(err, new exports.KainSession(s.ip, s.token, s.uname));
    });
};

exports.use = function (s, cb=()=>{}) {
    db.use_session(s.ip, s.token, err => {
        cb(err);
    });
};

exports.verify_request = function (req, res, cb, err_hndlr=()=>{}) {
    if (!req.cookies['token']) {
        cb(new Error('missing cookie'), null);
    } else {
        exports.get(req.connection.remoteAddress, req.cookies['token'], (err, s) => {
            if (err) {
                err_hndlr(err, res);
                cb(new Error('error 500'), null);
            } else if (!s) {
                res.cookie('token', '', {
                    maxAge: new Date(0),
                });
                cb(new Error('no session found!'), null);
            } else {
                let se = new exports.KainSession(s.ip, s.token, s.uname);
                exports.use(se);
                cb(null, se);
            }
        });
    }
};