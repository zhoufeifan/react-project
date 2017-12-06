/*
* 封装nodeWebkit的方法
* */
"use strict";

const NW = window.nw;
if(NW){
    const http = require('http');
    const fs = require('fs');
    const unzip = require("unzip2");
    const crypto = require('crypto');
    const {version, packageInfo={}} = require('./package.json');
    const win = NW.Window.get();
    let floatWindow = null;//定义悬浮窗变量
    win.on('close', function () {
        if (floatWindow) floatWindow.close(true);
        if (win) win.close(true);
    });
    window.dataInfo = Object.assign(packageInfo,window.dataInfo);
//设置悬浮窗快捷键
    window.clientWindow = "show";

    window.downloadRequest = null;
    window.downloadError = false;
    const download = function (url, dest, onProgress, finished) {
        let file = fs.createWriteStream(dest);
        window.downloadRequest = http.get(url, (res) => {
            window.downloadError = false;
            res.pipe(file);
            file.on('finish', () => {
                console.log("file close");
                file.close(() => {
                    !window.downloadError && finished && finished();
                });
            });
            const {statusCode} = res;
            const contentType = res.headers['content-type'];
            const contentLength = res.headers['content-length'];
            let currentValue = 0;
            let error;
            if (statusCode !== 200) {
                error = new Error('请求失败。\n' +
                    `状态码: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                // 消耗响应数据以释放内存
                res.resume();
                return;
            }
            res.on('data', (chunk) => {
                currentValue += chunk.length;
                onProgress(currentValue, contentLength);
            });
            res.on('end', () => {
                console.log('finished download');
            });
        }).on('error', (err) => {
            window.downloadError = true;
            finished && finished(err.message);
            //下载失败则删除临时的文件
            fs.unlink(dest, () => {
                console.log('delete failed zip')
            });
        }).on('abort', () => {
            finished && finished("更新中断");
            window.downloadError = true;
            fs.unlink(dest, () => {
                console.log('delete abort zip')
            });
        });
    };

    window.globalMethod = {
        clipboard: function (text) {
            var clipboard = NW.Clipboard.get();
            clipboard.set(text, 'text');
        },

        windowReload: function () {
            win.reload();
        },

        showDevTools: function () {
            win.showDevTools();
        },

        toggleFloatWindow: function () {
            if (window.clientWindow === "show") {
                window.clientWindow = "hide";
                try {
                    showFloatWindow(floatWindow,win);

                } catch (e) {
                    console.log(e);
                    console.log('运行环境错误');
                    throw e;
                }
            } else {
                window.clientWindow = "show";
                floatWindow.hidden();
            }
        },

        minimizeWindow: function () {
            win.setShowInTaskbar(true);
            win.minimize();
        },

        closeWindow: function () {
            NW.App.clearCache();
            win.close();
        },

        bindShortcutKey: function (option) {
            let setting = {
                key: option.key,
                active: function () {
                    console.log("Global desktop keyboard shortcut: " + this.key + " active.");
                    if (option.func) {
                        option.func();
                    }
                },
                failed: function (msg) {
                    console.log(msg);
                    throw "error";
                }
            };

            let shortcut = new NW.Shortcut(setting);
            // 注册桌面全局的快捷键
            NW.App.registerGlobalHotKey(shortcut);
            if (option.callback) option.callback();
        },

        changeShortcutKey: function (option) {
            let oldShortcut = new NW.Shortcut({key: option.oldKey});
            //取消之前快捷键的注册
            NW.App.unregisterGlobalHotKey(oldShortcut);
            let setting = {
                key: option.newKey,
                active: function () {
                    console.log("Global desktop keyboard shortcut: " + this.key + " active.");
                    if (option.func) {
                        option.func();
                    }
                },
                failed: function (msg) {
                    console.log(msg);
                    throw "error";
                }
            };
            let newShortcut = new NW.Shortcut(setting);
            // 注册桌面全局的快捷键
            NW.App.registerGlobalHotKey(newShortcut);
            if (option.callback) option.callback();
        },

        unbindShortcutKey: function (key, callback) {
            let shortcut = new NW.Shortcut({key: key});
            //取消事件的注册
            NW.App.unregisterGlobalHotKey(shortcut);
            if (callback) callback();
            console.log('unbind');
        },

        loginIn: function () {

        },

        loginOut: function () {
            if (floatWindow) {
                floatWindow.close();
                localStorage.setItem("positionX", floatWindow.x);
                localStorage.setItem("positionY", floatWindow.y);
                floatWindow = null;
            }
            if (localStorage.getItem("floatWindowKey")) {
                this.unbindShortcutKey(localStorage.getItem("floatWindowKey"));
            }
            if (localStorage.getItem("shiftWorkKey")) {
                this.unbindShortcutKey(localStorage.getItem("shiftWorkKey"));
            }
        },

        openPrinter: function () {

        },

        getPrinterList: function () {
            win.getPrinters(function (prints) {
                let printerList = [];
                prints.map(item => printerList.push({value: item.deviceName, text: item.printerName}));
                localStorage.setItem("printersInfo", JSON.stringify(printerList));
            })
        },

        printOrders: function (printData) {
            localStorage.setItem('printData', JSON.stringify(printData));
            let options = {
                resizable: false,
                id: 'printOrderWindow',
                min_width: 320,
                min_height: 600,
                max_width: 320,
                max_height: 600,
                kiosk: false,
                frame: false,
                transparent: true,
                width: 320,
                height: 600,
            };

            return new Promise(resolve => {
                NW.Window.open("./print-order.html", options, function (_win) {
                    _win.setMinimumSize(320, 600);
                    _win.resizeTo(320, 600);
                    _win.moveTo(-500, -600);
                    setTimeout(() => {
                        _win.close();
                        resolve();
                    }, 3000);
                });
            });
        },

        printAllOrders(printData) {
            localStorage.setItem('printData', JSON.stringify(printData));
            let options = {
                resizable: false,
                id: 'printAllWindow',
                min_width: 320,
                min_height: 600,
                max_width: 320,
                max_height: 600,
                kiosk: false,
                frame: false,
                transparent: true,
                width: 320,
                height: 600,
            };
            NW.Window.open("./print-all.html", options, function (_win) {
                _win.setMinimumSize(320, 600);
                _win.resizeTo(320, 600);
                _win.moveTo(-500, -500);
                setTimeout(() => {
                    _win.close();
                }, 3000);
            });
            // window.frames[1].postMessage(printData,'*');
        },

        initApplication: function () {
            window.globalMethod.getPrinterList();
        },

        getComputerInfo: function () {
            return {width: window.screen.width, height: window.screen.height};
        },

        getFloatWindow: function () {
            return floatWindow;
        },

        setAlwaysOnTop: function (top) {
            win.setAlwaysOnTop(top);
        },

        downloadFile: (option) => {
            let {url, dest, onProgress = null, downloadFinished = null} = option;
            download(url, dest, onProgress, function (error) {
                if (error) {
                    console.log(error);
                    downloadFinished(error);
                    return;
                }
                downloadFinished();
            });
        },

        readFileHash: (cb) => {
            fs.access('build.zip', function (error) {
                if (error) {
                    cb({success: false, errorMsg: '解压失败：文件不存在'});
                    return;
                }
                //读取一个Buffer
                let buffer = fs.readFileSync('./build.zip');
                let fsHash = crypto.createHash('md5');

                fsHash.update(buffer);
                let md5 = fsHash.digest('hex');
                console.log("文件的MD5是：%s", md5);

                cb({success: true, md5});
            });
        },

        unzipFile: (unzipFinished) => {
            fs.createReadStream('build.zip').pipe(
                unzip.Extract({path: './'}).on('error', () => {
                    unzipFinished('解压失败：系统异常');
                }).on('finish', () => {
                    console.log('unzip success');
                    fs.unlink('build.zip', () => {
                        console.log('delete zip')
                    });
                    unzipFinished();
                })
            );
        },

        getClientVersion: ()=> {
            return version;
        },

        isNewVersion:()=>{
            //是否是新版的NW
            return true;
        }
    };
}else {
    console.log('非NW环境运行');
}
function showFloatWindow(floatWindow,win) {
    let screeNWidth = window.screen.width;
    let screenHeight = window.screen.height;

    let width = 220;
    let height = 80;
    let options = {
        resizable: false,
        id: 'miNWindow',
        min_width: width,
        min_height: height,
        max_width: width,
        max_height: height,
        fullscreen: false,
        always_on_top: true,
        icon: "logo.png",
        kiosk: false,
        frame: false,
        transparent: true,
        width: width,
        height: height,
        focus: true
    };
    if (floatWindow) {
        floatWindow.show(true);
        win.hide();
    } else {
        NW.Window.open(window.dataInfo.floatWindowUrl, options, function (_win) {
            floatWindow = _win;
            floatWindow.setMinimumSize(width, height);
            floatWindow.resizeTo(width, height);
            floatWindow.setAlwaysOnTop(true);
            let positionX = localStorage.getItem("positionX");
            let positionY = localStorage.getItem("positionY");
            if (positionX && positionY) {
                positionX = Number(positionX);
                positionY = Number(positionY);

                positionX = positionX > 0 ? positionX : 10;
                positionY = positionY > 0 ? positionY : 10;
                positionX = positionX < (screeNWidth - 200) ? positionX : screeNWidth - 200;
                positionY = positionY < (screenHeight - 100) ? positionY : screenHeight - 100;
                floatWindow.moveTo(positionX, positionY);
            } else {
                floatWindow.moveTo(screeNWidth - 300, 100);
            }
            floatWindow.hidden = function () {
                window.clientWindow = "show";
                floatWindow.hide();
                win.show(true);
            };
            floatWindow.closeParent = function () {
                //如果在悬浮窗状态即主窗体是隐藏状态时，关闭悬浮窗后将主窗体也关闭
                if (window.clientWindow == "hide") {
                    win.close();
                }
            };
            floatWindow.setShowInTaskbar(false);
        });
        win.hide();
    }
}

