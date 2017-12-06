import React from 'react';
import ReactDOM from 'react-dom';
import Router from './routers.js';
window.errorStauts = {
    "timeout": "连接服务器超时",
    "error": "网络错误",
    "abort": "请求中断",
    "parsererror": "服务器数据异常",
    "systemError": "系统异常,请尝试重启软件重试",
    "printError": "打印机加载失败请重新登录重试"
};
window.refreshToken = localStorage.getItem("refreshToken");
document.oncontextmenu = function () { // Use document as opposed to window for IE8 compatibility
    return !!window.dataInfo.apiDomain.match('ci|daily|pre');
};
ReactDOM.render(<Router/>, document.getElementById('root'));
