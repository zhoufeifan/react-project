/*
* 封装nodeWebkit的方法
* */
"use strict";


//设置悬浮窗快捷键
let floatWindow = null;//定义悬浮窗变量
window.clientWindow = "show";

window.SerialPort = null;

window.downloadRequest = null;

const download = function (url, dest, onProgress, finished) {

};

window.globalMethod = {
    windowReload: function () {
    },

    showDevTools: function () {
    },

    toggleFloatWindow: function () {

    },

    minimizeWindow: function () {

    },

    closeWindow: function () {

    },

    bindShortcutKey: function (option) {

    },

    changeShortcutKey: function (option) {

    },

    unbindShortcutKey: function (key, callback) {

    },

    loginIn: function () {
    },

    loginOut: function () {

    },

    openPrinter: function () {

    },

    getPrinterList: function () {

    },

    printOrders: function (printData) {

        // window.frames[0].postMessage(printData,'*');
    },

    printAllOrders: function (printData){

        // window.frames[1].postMessage(printData,'*');
    },

    initApplication: function () {
        // window.globalMethod.getPrinterList();
    },

    getComputerInfo: function () {
        return {};
    },

    getFloatWindow: function () {
        return null;
    },

    setAlwaysOnTop: function (top) {
    },

    updateAssests: function () {

    }

};

function showFloatWindow() {

}