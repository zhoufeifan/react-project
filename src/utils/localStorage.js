/*
 控制本地存储的方法
 */

// storage 枚举key AutoPrint 、ClientID、autoPrint 命名首字母大写是历史原因
let storageMap = {
  "oprList": "oprList",//收银员列表
  "merchantCode": "ClientID",//商户号
  "merchantName": "ShowName",//商户名称
  "refreshToken": "refreshToken",
  "offLineAccount": "OffLineAccount",//现金记账开关
  "webVersion": "WebVersion",//web版本号
  "clientVersion":"clientVersion",//采宝壳子的版本
  "autoPrint": "AutoPrint",//是否自动打印
  "printNum": "printNum",//打印联数
  "printer": "Printer",//打印机名称
  "floatWindowKey": "floatWindowKey",//悬浮窗的快捷键
  "startIndex": "start_index",//首次打开的tab项
  "shiftWorkKey": "shiftKey",//交接班的快捷键
  "lookUpReportKey": "lookUpReportKey",//查看报表的快捷键
  "amountComName": "amountComName",//读取金额的串口名称
  "systemVersion": "systemVersion",//系统的版本号
  "serialportData": "serialportData",//串口的数据,
  "onlySucOrder": "onlySucOrder",//只查看成功订单的开关
  "windowOnTop": "windowOnTop",//窗口是否置顶
  "printersInfo": "printersInfo",//打印机列表以逗号方式隔开
  "oemKey": "oemKey",//oemkey
  "oemIconUrl": "oemIconUrl",//oemLogo地址
};

function saveLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getLocalStorage(key) {
  return localStorage.getItem(key);
}

function removeLocalStorageByKey(key) {
  localStorage.removeItem(key);
}

function removeLocalAllStorage() {
  localStorage.clear();
}

module.exports = {
    saveLocalStorage: saveLocalStorage,
    getLocalStorage: getLocalStorage,
    removeLocalStorageByKey: removeLocalStorageByKey,
    removeLocalAllStorage: removeLocalAllStorage,
    storageMap
};
