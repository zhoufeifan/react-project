const {version} = require('../package.json');
var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
//读取一个Buffer

var buffer = fs.readFileSync('./dist/build.zip');
var fsHash = crypto.createHash('md5');

fsHash.update(buffer);
var md5 = fsHash.digest('hex');
console.log("文件的MD5是：%s", md5);


const environmentUrlMap = {
    'daily': 'http://openapi.daily.heyean.com/gateway.htm?command=version_save_hash',
    'pre': 'http://pcsyt.pre.caibaopay.com/gateway.htm?command=version_save_hash',
    'online': 'http://pcsyt.caibaopay.com/gateway.htm?command=version_save_hash',
};
const appTypeMap = {
    'daily': 'CaibaoPay PC Daily',
    'pre': 'CaibaoPay PC Pre',
    'online': 'CaibaoPay PC',
};
let environment = process.argv[2];
console.log(environmentUrlMap[environment]);
request.post({
    url: environmentUrlMap[environment],
    form: {
        version,
        versionHash: md5,
        updateType: 'manual',
        appType: appTypeMap[environment],
    }
}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        console.log(body) // 打印google首页
    } else {
        console.log(error, response, body);
    }
});
