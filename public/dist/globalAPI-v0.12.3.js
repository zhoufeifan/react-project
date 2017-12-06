/*
 * 封装nodeWebkit_v0.12.3的方法
 * */
"use strict";

let floatWindow = null;//定义悬浮窗变量
window.clientWindow = "show";

let path = null;
let gui = null;
let win = null;
try {
    //引入node模块
    path = require('path');
    //引入nw模块
    gui = require('nw.gui');
} catch (e) {
    console.warn('非nw环境运行！');
}

win = gui && gui.Window.get();

win && win.on('close', function () {
    if (floatWindow) floatWindow.close(true);
    if (win) win.close(true);
});

window.globalMethod = {

    clipboard: function (text) {
        var clipboard = gui.Clipboard.get();
        clipboard.set(text, 'text');
    },

    windowReload: function () {
        // window.location.reload();
    },

    showDevTools: function () {
        win.showDevTools();
    },

    toggleFloatWindow: function () {
        if (window.clientWindow === "show") {
            window.clientWindow = "hide";
            try {
                showFloatWindow();

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
        gui.App.clearCache();
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

        let shortcut = new gui.Shortcut(setting);
        // 注册桌面全局的快捷键
        gui.App.registerGlobalHotKey(shortcut);
        if (option.callback) option.callback();
    },

    changeShortcutKey: function (option) {
        let oldShortcut = new gui.Shortcut({key: option.oldKey});
        //取消之前快捷键的注册
        gui.App.unregisterGlobalHotKey(oldShortcut);
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
        let newShortcut = new gui.Shortcut(setting);
        // 注册桌面全局的快捷键
        gui.App.registerGlobalHotKey(newShortcut);
        if (option.callback) option.callback();
    },

    unbindShortcutKey: function (key, callback) {
        let shortcut = new gui.Shortcut({key: key});
        //取消事件的注册
        gui.App.unregisterGlobalHotKey(shortcut);
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
        gui.Shell.openItem(path.resolve("locales/cb.exe"));
    },

    getPrinterList: function () {
        let printerList = [];
        let iPrinterCount = 0;
        try {
            iPrinterCount = window.LODOP.GET_PRINTER_COUNT();
            for (let i = 0; i < iPrinterCount; i++) {
                printerList.push({value: "", text: window.LODOP.GET_PRINTER_NAME(i)});
            }
        }
        catch (e) {
            console.log(e);
            console.log('打印插件加载失败');
            printerList = [];
        }

        // return pList;
        localStorage.setItem("printersInfo", JSON.stringify(printerList));

    },

    printOrders: function (printData) {
        window.LODOP.PRINT_INIT("caibaopay");
        let printName = printData.printName;
        if (printName) {
            window.LODOP.SET_PRINTER_INDEX(printName);
        }
        let orderStatus = printData.orderStatus;//获得交易状态
        let merchart = printData.merchantName;
        let shop = printData.storeName;
        if (printData.subStoreName != "")
            shop = shop + '(' + printData.subStoreName + ')';
        let oprLabel = "收 银 员：";
        let opr = printData.operatorCode;
        if (opr == "qrcode") {
            opr = "二维码";
        }
        else if (printData.operatorName != "") {
            opr = opr + '(' + printData.operatorName + ')';
        }
        let channel = "付款渠道：" + printData.paymentChannel;

        let consumeMoney = "";
        let reciveMoeny = "";
        let time = "";
        if (orderStatus == "5") {
            oprLabel = "退 款 员：";
            consumeMoney = printData.orderReceiveAmount;
            reciveMoeny = "-" + printData.refundAmount;
            time = "退款时间：" + printData.refundTime;
        }
        else {
            consumeMoney = printData.totalAmount;
            reciveMoeny = printData.receiveAmount;
            time = "交易时间：" + printData.tradeTime;
        }

        let mark = "请妥善保管小票 欢迎下次光临";
        let lineLeft = 0;//线的左边距
        let lineRight = 50;//线的右边距
        let lineDis = 5;//定义分割线上下的间距
        let textDis = 4;//定义文字上下的间距
        let dwp = 5;//定义打印文字离纸上边框的间距
        window.LODOP.SET_PRINT_PAGESIZE(3, "60mm", "0mm", "");
        window.LODOP.SET_PRINT_STYLE("FontSize", "10");
        window.LODOP.SET_PRINT_STYLE("Alignment", "2");
        if (merchart.length > 15) {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", merchart.substring(0, 13));
            dwp += textDis + 1;
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", merchart.substring(13, merchart.length));
        } else {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", merchart);
        }
        dwp += textDis + 1;
        if (shop.length > 13) {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", shop.substring(0, 13));
            dwp += textDis + 1;
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", shop.substring(13, shop.length));
        } else {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", shop);
        }
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        if (printData.isRepair) {
            window.LODOP.SET_PRINT_STYLE("FontSize", "6");
            dwp += textDis;
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", "补打印");
            window.LODOP.SET_PRINT_STYLE("FontSize", "8");
        }

        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
        window.LODOP.SET_PRINT_STYLE("FontSize", "8");
        dwp += lineDis - 2;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "交易状态：" + printData.tradeStatus);
        dwp += textDis;
        if (orderStatus != "5") {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", channel);
            dwp += textDis;
        }
        if (opr.length < 16) {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", oprLabel + opr);
        }
        else {
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", oprLabel);
            dwp += textDis;
            window.LODOP.SET_PRINT_STYLE("Alignment", "2");
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", opr);
            window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        }
        dwp += textDis;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", time);
        dwp += textDis;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "打印时间：" + printData.printTime);
        dwp += textDis;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "交易编号：");
        dwp += textDis;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", printData.orderNo);
        dwp += textDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
        dwp += lineDis - 2;
        if (orderStatus != "5") {
            //打印商品详情
            let goodsDetails = printData.goodsDetail;
            if (goodsDetails.length > 0) {
                window.LODOP.SET_PRINT_STYLE("Alignment", "1");
                window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "商品*数量");
                window.LODOP.SET_PRINT_STYLE("Alignment", "3");
                window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", "金额");
                // dwp-=textDis;
                for (let i = 0; i < goodsDetails.length; i++) {
                    dwp += textDis;
                    window.LODOP.SET_PRINT_STYLE("Alignment", "1");
                    let title = goodsDetails[i].goodsName.replace(/(.{2})./,'$1') + "*" + goodsDetails[i].goodsNum;
                    window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", title);
                    window.LODOP.SET_PRINT_STYLE("Alignment", "3");
                    window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", goodsDetails[i].totalPrice);
                }
                dwp += lineDis;
                window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
                dwp += lineDis - 2;
            }
            //打印商品折扣信息
            let discounts = printData.discounts;
            if (discounts.length > 0) {
                dwp -= textDis;
                for (let i = 0; i < discounts.length; i++) {
                    dwp += textDis;
                    window.LODOP.SET_PRINT_STYLE("Alignment", "1");
                    let discountName = discounts[i].discountName;
                    window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", discountName);
                    window.LODOP.SET_PRINT_STYLE("Alignment", "3");
                    window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", "-" + discounts[i].discountAmount);
                }
                dwp += lineDis;
                window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
                dwp += lineDis - 2;
            }
        }
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");

        let smallLabel = "消费总金额";
        let largeLable = "实收金额";
        if (orderStatus == "5") {
            smallLabel = "收款金额";
            largeLable = "退款金额";
        }
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", smallLabel);
        window.LODOP.SET_PRINT_STYLE("Alignment", "3");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", consumeMoney);
        dwp += textDis;
        if (orderStatus != "5") {
            window.LODOP.SET_PRINT_STYLE("Alignment", "1");
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "商家优惠");
            window.LODOP.SET_PRINT_STYLE("Alignment", "3");
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", "-" + printData.discountAmount);
            dwp += textDis;
        }
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        window.LODOP.SET_PRINT_STYLE("FontSize", "14");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", largeLable);
        window.LODOP.SET_PRINT_STYLE("Alignment", "3");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "48mm", "0mm", reciveMoeny);
        dwp += lineDis + 2;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
        window.LODOP.SET_PRINT_STYLE("FontSize", "8");
        dwp += textDis - 1;
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "签名栏：");
        dwp += lineDis + 2;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 2, 1);
        window.LODOP.SET_PRINT_STYLE("Alignment", "2");
        dwp += 4;
        console.log(printData);
        if(printData.orderNoPrint){
            window.LODOP.SET_PRINT_STYLE("FontSize", "6");
            window.LODOP.ADD_PRINT_BARCODE(dwp+"mm","1mm",220,62,"EAN128A",printData.orderNoPrint);
            dwp += 16 + textDis - 1;
        }
        window.LODOP.SET_PRINT_STYLE("FontSize", "8");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "10mm", mark);

        // window.LODOP.PREVIEW();
        window.LODOP.PRINT();
    },

    printAllOrders: function (printData) {
        window.LODOP.PRINT_INIT("caibaopay");
        let printName = printData.printName;
        if (printName) {
            window.LODOP.SET_PRINTER_INDEX(printName);
        }
        window.LODOP.SET_PRINT_PAGESIZE(3, "60mm", "0mm", "");
        let mark = "请妥善保管小票 欢迎下次使用";
        let lineLeft = 0;//线的左边距
        let lineRight = 50;//线的右边距
        let lineDis = 5;//定义分割线上下的间距
        let textDis = 4;//定义文字上下的间距
        let dwp = 5;//定义打印文字离纸上边框的间距
        window.LODOP.SET_PRINT_STYLE("FontSize", "10");
        window.LODOP.SET_PRINT_STYLE("Alignment", "2");
        let title = "汇总单据";
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "0mm", title);
        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 0, 1);
        window.LODOP.SET_PRINT_STYLE("FontSize", "8");
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        let merchantName = "商户：" + printData.merchantName;
        dwp += textDis;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", merchantName);
        dwp += textDis;
        let storeName = "门店：" + printData.storeName;
        if (printData.subStoreName != "") {
            storeName = storeName + '(' + printData.subStoreName + ')';
        }
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", storeName);
        dwp += textDis;
        let operator = "";
        if (printData.isAdmin == "1") {
            operator = "店长：" + printData.operatorCode + '(' + printData.operatorName + ')';
        }
        else {
            operator = "收银员：" + printData.operatorCode + '(' + printData.operatorName + ')';
        }
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", operator);
        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 0, 1);
        dwp += lineDis - 2;
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        let pStartTime = "开始时间：" + printData.paymentBeginTime;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", pStartTime);
        dwp += textDis;
        let pEndTime = "结束时间：" + printData.paymentEndTime;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", pEndTime);
        dwp += textDis;
        let printTime = "打印时间：" + printData.printTime;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", printTime);
        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 0, 1);
        dwp += lineDis - 2;
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "渠道");
        window.LODOP.SET_PRINT_STYLE("Alignment", "3");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", "收/退款");
        dwp += textDis - 2;
        let channelList = printData.channelList;
        if (channelList.length) {
            channelList.forEach(function (item) {
                dwp += textDis;
                window.LODOP.SET_PRINT_STYLE("Alignment", "1");
                window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", item.channelName);

                window.LODOP.SET_PRINT_STYLE("Alignment", "3");
                window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", item.receiveAmount + "(" + item.orderNum + "笔)");

                dwp += textDis;
                window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", "-" + item.refundAmount + "(" + item.refundNum + "笔)");
            });
        }

        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 0, 1);

        dwp += lineDis - 2;
        window.LODOP.SET_PRINT_STYLE("Alignment", "1");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "交易汇总");
        window.LODOP.SET_PRINT_STYLE("Alignment", "3");
        let sumReceive = printData.tradeSumReceive + "(" + printData.orderTotalNum + "笔)";
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", sumReceive);
        dwp += textDis;
        let sumRefund = "-" + printData.tradeSumRefund + "(" + printData.refundTotalNum + "笔)";
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", sumRefund);

        if (printData.vipOrderTotalNum > 0 || printData.vipRefundTotalNum > 0) {
            dwp += lineDis - 2;
            window.LODOP.SET_PRINT_STYLE("Alignment", "1");
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "60mm", "0mm", "会员卡汇总");
            window.LODOP.SET_PRINT_STYLE("Alignment", "3");
            let vipReceive = printData.vipSumReceive + "(" + printData.vipOrderTotalNum + "笔)";
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", vipReceive);
            dwp += textDis;
            let vipRefund = "-" + printData.vipSumRefund + "(" + printData.vipRefundTotalNum + "笔)";
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", vipRefund);
        }


        dwp += lineDis;
        window.LODOP.ADD_PRINT_LINE(dwp + "mm", lineLeft + "mm", dwp + "mm", lineRight + "mm", 0, 1);
        dwp += lineDis - 2;
        window.LODOP.SET_PRINT_STYLE("Alignment", "3");
        let tradeSum = "交易合计：" + printData.tradeTotalAmount + "(" +
            (Number(printData.orderTotalNum) + Number(printData.refundTotalNum)) + "笔)";
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", tradeSum);

        if (printData.vipOrderTotalNum > 0 || printData.vipRefundTotalNum > 0) {
            dwp += textDis;
            let vipSum = "会员卡合计：" + printData.vipTotalAmount + "(" + (Number(printData.vipOrderTotalNum) + Number(printData.vipRefundTotalNum)) + "笔)";
            window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "45mm", "0mm", vipSum);
        }

        dwp += lineDis;
        window.LODOP.SET_PRINT_STYLE("Alignment", "2");
        window.LODOP.ADD_PRINT_TEXT(dwp + "mm", "0mm", "50mm", "10mm", mark);
        // window.LODOP.PREVIEW();
        window.LODOP.PRINT();
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
    getClientVersion: function () {
        return "3.1.0";
    },
    isNewVersion() {
        //是否是新版的nw
        return false;
    }
};

//显示悬浮窗
function showFloatWindow() {
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    let width = 220;
    let height = 80;
    let options = {
        toolbar: false,
        resizable: false,
        fullscreen: false,
        id: 'minWindow',
        min_width: width,
        min_height: height,
        max_width: width,
        max_height: height,
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
        let positionX = floatWindow.x, positionY = floatWindow.y;
        positionX = positionX > 0 ? positionX : 10;
        positionY = positionY > 0 ? positionY : 10;
        positionX = positionX < (screenWidth - 200) ? positionX : screenWidth - 200;
        positionY = positionY < (screenHeight - 100) ? positionY : screenHeight - 100;
        floatWindow.moveTo(positionX, positionY);
        floatWindow.show(true);
        win.hide();
    } else {
        if (window.dataInfo.oemKey !== "caibao") (new Image()).src = window.dataInfo.loginLogoUrl;
        floatWindow = gui.Window.open(window.dataInfo.floatWindowUrl, options);
        console.log(floatWindow);
        if (floatWindow) {
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
                positionX = positionX < (screenWidth - 200) ? positionX : screenWidth - 200;
                positionY = positionY < (screenHeight - 100) ? positionY : screenHeight - 100;
                floatWindow.moveTo(positionX, positionY);
            } else {
                floatWindow.moveTo(screenWidth - 300, 100);
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
            win.hide();
        }
    }
}


