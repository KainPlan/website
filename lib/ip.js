exports.str_int = function (str) {
    let res = 0,
        parts = str.split('.');
    if (parts.length != 4)
        return null;
    for (let i = 0; i < 4; i++) {
        res += +parts[i] * 2 ** (32 - 8 * (i+1));
    }
    return res;
};

exports.int_str = function (int) {
    let res = [];
    if (int >= 2 ** 32 || int < 0)
        return null;
    for (let i = 0; i < 4; i++) {
        res.push(Math.trunc(int / 2 ** (32 - 8 * (i+1))));
        int %= 2 ** (32 - 8 * (i+1));
    }
    return res.join('.');
};