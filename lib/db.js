const mysql = require('mysql');
const conf = require('./db.json'),
    pool = mysql.createPool({
        host: conf.host,
        user: conf.user,
        password: conf.pass,
        database: conf.db
    });

exports.get_conn = function (cb) {
    pool.getConnection((err, con) => {
        cb(err, con);
    });
};

exports.get_user = function (uname, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err, null);
        else {
            con.query(`
                SELECT *
                FROM users
                WHERE uname = ?`, [uname], (err, result, fields) => {
                con.release();
                if (err) cb(err, null);
                else cb(err, result[0]);
            });
        }
    });
};

exports.exists = function (query, params, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err, null);
        else {
            con.query(query, params, (err, result, fields) => {
                con.release();
                if (err) cb(err, null);
                else cb(err, result.length > 0);
            });
        }
    });
};

exports.add_session = function (s, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`INSERT INTO sessions (ip, uname) VALUES (?, ?)`, [s.ip, s.uname], (err, result) => {
                cb(err);
            });
        }
    });
};

exports.get_priv = function (pid, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err, null);
        else {
            con.query(`
                SELECT *
                FROM privs
                WHERE id = ?`, [pid], (err, result, fields) => {
                con.release();
                if (err) cb(err, null);
                else cb(err, result[0]);
            });
        }
    });
};

exports.remove_session = function (iaddr, uname, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                DELETE FROM sessions
                WHERE ip = ?
                    AND uname = ?`, [iaddr, uname], (err, result) => {
                con.release();
                cb(err);
            });
        }
    });
};

exports.get_session = function (iaddr, uname, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err, null);
        else {
            con.query(`
                SELECT ip, uname, DATE_FORMAT(TIMEDIFF(NOW(), timestamp), '%i') "min"
                FROM sessions
                WHERE ip = ?
                    AND uname = ?`, [iaddr, uname], (err, result, fields) => {
                con.release();
                if (err) { 
                    cb(err, null);
                } else if(result[0]) {
                    if (result[0].min >= 5) {
                        exports.remove_session(iaddr, uname, (err) => {
                            cb(err, null);
                        });
                    } else {
                        cb(err, result[0]);
                    }
                } else {
                    cb(err, result[0]);
                }
            });
        }
    });
};

exports.use_session = function (iaddr, uname, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                UPDATE sessions
                SET timestamp = NOW()
                WHERE ip = ?
                    AND uname = ?`, [iaddr, uname], (err, result) => {
                cb(err);
            });
        }
    });
};

exports.del_outtimed_sessions = function (timeout, cb=()=>{}) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                DELETE FROM sessions
                WHERE DATE_FORMAT(TIMEDIFF(NOW(), timestamp), '%i') >= ?`, [timeout], (err, result) => {
                cb(err);
            });
        }
    });
}