const ip = require('./ip'),
      db = require('./db'),
      chalk = require('chalk');
const conf = require('./session.json');

exports.KainSession = class {
    constructor(ip, uname) {
        this.ip = ip;
        this.uname = uname;
    }

    get_ip() {
        return ip.int_str(this.ip);
    }

    get_token() {
        return new Buffer(this.uname).toString('base64');
    }
};

function cleanupd() {
    console.log(chalk` [${new Date().toISOString()} | {bold.underline.hex('#2EFFEA') DB}]: Cleaning timed-out sessions ... `);
    db.del_outtimed_sessions(conf.timeout);
}
setInterval(cleanupd, conf.timeout*1000*60);

exports.new = function (addr, uname, cb) {
    let s = new exports.KainSession(ip.str_int(addr), uname);
    db.add_session(s, err => {
        cb(err, s);
    });
};

exports.exists = function (addr, token, cb) {
    db.exists(`
        SELECT *
        FROM sessions
        WHERE ip = ?
              AND uname = ?`, [ip.str_int(addr), new Buffer(token, 'base64').toString('ascii')], (err, exists) => {
        cb(err, exists);
    });
}

exports.get = function (addr, token, cb) {
    db.get_session(ip.str_int(addr), new Buffer(token, 'base64').toString('ascii'), (err, s) => {
        if (err) cb(err, null);
        else if (!s) cb(err, undefined);
        else cb(err, new exports.KainSession(s.ip, s.uname));
    });
};

exports.get_w_uname = function (addr, uname, cb) {
    db.get_session(ip.str_int(addr), uname, (err, s) => {
        if (err) cb(err, null);
        else if (!s) cb(err, undefined);
        else cb(err, new exports.KainSession(s.ip, s.uname));
    });
};

exports.use = function (addr, token, cb=()=>{}) {
    db.use_session(ip.str_int(addr), new Buffer(token, 'base64').toString('ascii'), err => {
        cb(err);
    });
};