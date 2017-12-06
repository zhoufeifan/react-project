import axios from 'axios';
import toast from 'components/Toast';

const qs = require('qs');

axios.defaults.timeout = 60 * 1000;
axios.defaults.withCredentials = true;

let requestUrlMap = {
    activate: `syt_v2_activate`,//激活
    loginIn: `syt_v2_login`,//登录
    loginOut: `syt_v2_logout`,//退出登录
    statPrint: `syt_v2_stat_print`,//获取汇总信息
    activityDiscount: `syt_v2_activity_discount`,//获取平台补贴金额
    orderPayList: `syt_v2_orderpay_list`,//交易列表
    checkUserPwd: `syt_v2_check_user_pwd`,//密码校验
    orderPayRefund: `syt_v2_orderpay_refund`,//退款
    orderPayReverse: `syt_v2_orderpay_reverse`,//订单撤销
    shopOwnerList: "common_shopowner_list_by_store_id",//获取门店店长代码
    orderPayRefundAmount: `syt_v2_orderpay_refund_amount`,//获取可退款金额
    orderPayDetail: `syt_v2_orderpay_detail`,//订单详情
    updateOrderPayRemark: `syt_v2_update_orderpay_remark`,//修改交易备注
    getRefundToken: "csrf_token",//获取退款token
    refreshToken: `syt_v2_refresh_token`,//刷新token
    couponDiscount: `syt_v2_coupon_discount`,//优惠卷信息
    activityList: `syt_v2_activity_list`,//活动列表
    orderPay: `syt_v2_orderpay`,//支付
    updateOperationPwd: `syt_v2_update_operation_pwd`,///修改操作密码
    updateLoginPwd: `syt_v2_update_login_pwd`,//修改登录密码
    memberInfo: `syt_v2_member_info`,//会员信息查询
    memberUpdate: `syt_v2_member_update`,//会员信息更新
    getTagGoodsList: `syt_v2_tag_goods_list`,//商品列表
    memberCardInfo: `syt_v2_member_card_info`,//会员卡详情
    memberCardUpdate: `syt_v2_update_member_card`,//会员开更新
    memberCardTopUp: `syt_v2_member_card_recharge`,//会员卡充值
    memberCardPaymentInfo: 'syt_v3_member_card_payment_info',//会员卡支付详情
    rechargeList: `syt_v2_recharge_list`,//充值送列表
    savePcClientInfo: `syt_v2_save_log`,//保存设备信息
    checkUpdate: `version_check_update`,//检查版本更新
    checkHash: 'version_check_hash'//校验当前下载的文件是否合法
};

//通过domain和command得到请求的url
function getRequestUrl(command) {
    return window.dataInfo.apiDomain + "/gateway.htm?command=" + command;
}

//刷新refreshToken
function tokenRefresh() {
    let refreshData = {
        "userId": window.userInfo.userId,
        "refreshToken": window.userInfo.token.refreshToken
    };
    let ajaxOption = {
        command: requestUrlMap.refreshToken,
        data: refreshData,
        shouldRefreshToken: false
    };

    return request(ajaxOption, false).then(function (data) {
        window.userInfo.token = data;
    }, function () {
        toast.warning("登录身份过期请重新登录", function () {
            window.globalMethod.loginOut();
        });
    }).catch(error => {
        console.log(error.response);
        toast.warning("登录身份过期请重新登录", function () {
            window.globalMethod.loginOut();
        });
    });
}


/**
 * ajax请求
 * @param {Object} option 选项
 * @param {Boolean} isLoading 是否显示等待界面
 * @param {Object} option.data 提交参数
 * @param {Object} option.command 请求的command
 * @param {Object} option.config 额外配置项
 * @param {Boolean} config.origin 是否需要直接返回response, 后台接口返回格式与默认不同的情况下使用
 * @param {Boolean} config.error 是否需要error, 默认为true
 * @param {...} {...config} ajax请求的默认设置, 具体请参考axios
 * @returns {Promise}
 */
function request(option, isLoading = true,) {
    let {url, data, config = {}, command, shouldRefreshToken = true, contentType = ""} = option;
    if (contentType) {
        axios.defaults.headers.post['Content-Type'] = contentType;
    } else {
        data = qs.stringify(data);
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (data instanceof FormData) {
        config.contentType = false; // 上传文件时必要参数
        config.processData = false; // 上传文件时必要参数
    }
    config.method = 'post';
    // 用qs序列化之后, 后台才可以取到
    // https://segmentfault.com/q/1010000007607111
    config = {
        url: url || getRequestUrl(command),
        headers: {
            'X-App-Info': `${window.dataInfo.appInfo}/${window.globalMethod.getClientVersion()}`,
            'X-PC-Web-Info': window.dataInfo.webVersion,
            'OEM': window.dataInfo.oemKey
        },
        data,
        isLoading,
        ...config,
    };
    //重新loading
    if (isLoading) {
        toast.showLoading();
    }
    return new Promise((resolve, reject) => {
        axios(config).then(response => {
            config.isLoading && toast.hideLoading();
            if (config.origin) {
                return resolve(response);
            }
            response = response.data;

            if (!response || !response.result) {
                config.error === false || toast.warning('网络请求错误');
                reject({errorMsg: "网络请求错误"});
                return;
            }

            const result = response.result;
            if (!result.success) {
                if (result.errorCode == "-1" && shouldRefreshToken) {
                    tokenRefresh().then(() => {
                        return request(option, isLoading).then((data) => {
                            resolve(data);
                        });
                    }, (error) => {
                        reject({errorMsg: error});
                    });
                    return;
                }
                config.error === false || toast.warning(result.errorMsg);
                reject({errorMsg: result.errorMsg, errorCode: result.errorCode});
                return;
            }

            resolve(response.data);
        }).catch((error) => {
            //todo 判断错误类型
            config.isLoading && toast.hideLoading();
            config.error === false || toast.warning(error);
            reject({errorMsg: error.message});
        });
    });
}


export {request, requestUrlMap};
