const mysql = require('mysql');
const conf = require('./db.json'),
    sess_conf = require('./session.json'),
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
    exports.get_session(s.addr, s.token, (err, sess) => {
        if (err) {
            cb(new Error(err));
        } else if (!err && sess) {
            cb(new Error('duplicate-session-error'));
        } else {
            exports.get_conn((err, con) => {
                if (err) cb(err);
                else {
                    con.query(`INSERT INTO sessions (ip, token, uname) VALUES (?, ?, ?)`, 
                        [s.ip, s.token, s.uname], 
                        (err, result) => {
                            con.release();
                            cb(err);
                        });
                }
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

exports.remove_session = function (addr, token, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                DELETE FROM sessions
                WHERE ip = ?
                    AND token = ?`, [addr, token], (err, result) => {
                con.release();
                cb(err);
            });
        }
    });
};

exports.get_session = function (addr, token, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err, null);
        else {
            con.query(`
                SELECT ip, token, uname, TIMESTAMPDIFF(MINUTE, timestamp, NOW()) "min"
                FROM sessions
                WHERE ip = ?
                    AND token = ?`, [addr, token], (err, result, fields) => {
                con.release();
                if (err) { 
                    cb(err, null);
                } else if(result[0]) {
                    if (result[0].min >= sess_conf.timeout) {
                        exports.remove_session(addr, token, (err) => {
                            cb(err, null);
                        });
                    } else {
                        cb(err, result[0]);
                    }
                } else {
                    cb(err, undefined);
                }
            });
        }
    });
};

exports.use_session = function (addr, token, cb) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                UPDATE sessions
                SET timestamp = NOW()
                WHERE ip = ?
                    AND token = ?`, [addr, token], (err, result) => {
                con.release();
                cb(err);
            });
        }
    });
};

exports.del_outtimed_sessions = function (timeout=sess_conf.timeout, cb=()=>{}) {
    exports.get_conn((err, con) => {
        if (err) cb(err);
        else {
            con.query(`
                DELETE FROM sessions
                WHERE TIMESTAMPDIFF(MINUTE, timestamp, NOW()) >= ?`, [timeout], (err, result) => {
                con.release();
                cb(err);
            });
        }
    });
}