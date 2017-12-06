/*
* 封装日期操作函数的js
* */
"use strict";
//计算天数差的函数，通用
function dateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式或2016-12-18 12:12:12
    sDate1=sDate1.substring(0,10);
    sDate2=sDate2.substring(0,10);
    let  aDate,  oDate1,  oDate2,  iDays ;
    aDate  =  sDate1.split("-") ;
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);    //转换为12-18-2006格式
    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) ;
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    //把相差的毫秒数转换为天数
    return  iDays
}
//日期格式化函数
function getFormatDate(date,type) {
    if(!date || date == "0") return "";
    if (!(date instanceof Date)) {
        date = new Date(Number(date));
    }
    let seperator1 = "-";
    let seperator2 = ":";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    let currentData = year + seperator1 + month + seperator1 + strDate;
    let currentTime = hours + seperator2 + minutes + seperator2 + seconds;
    switch (type) {
        case "datetime":
            return (currentData + " " + currentTime);
        case "date":
            return currentData;
        case "time":
            return currentTime;
        default:
            return (currentData + " " + currentTime);
    }
}

module.exports = {
    dateDiff: dateDiff,
    getFormatDate: getFormatDate
};
