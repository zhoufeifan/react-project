/**
 *封装 跟支付相关的工具类
 */

//将以分为单位的金额转化为以元为单位的金额，并以字符串的方式返回
function parseCentToYuan(_value) {
    _value = _value || 0;
    let symbol = "";
    if (Number(_value) < 0) {
        symbol = "-";
        _value *= -1;
    }
    try {
        let value = _value.toString();
        let length = value.length;
        if (length == 1) {
            return symbol+"0.0" + value;
        }
        else if (length == 2)
            return symbol+"0." + value;
        else {
            let array = value.split('');
            array.splice(length - 2, 0, ".");
            return symbol + array.join('');
        }
    } catch (e) {
        console.error(e);
        return "0.00";
    }
}

//将以元为单位的数字金额转化为以分为单位的数字，并以字符串的方式返回
function parseYuanToCent(value) {
    if (value === "0" || !value) return "0";
    return (value * 100).toFixed(0);
}

//将一个单位为元的金额进行格式化，如 20 => 20.00, 0.1 => 0.10
function amountFormat(value) {
    if (!value) return "0.00";
    return parseCentToYuan(parseYuanToCent(value));
}


module.exports = {
    parseYuanToCent,
    parseCentToYuan,
    amountFormat,
};
