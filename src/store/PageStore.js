import {observable, computed, action, useStrict} from "mobx";

useStrict(true);
const navItemMap = {
    "vipPay": "cashier",
    "orderDetail": "report",
    "vipEdit": "vip"
};
export default class UserInfo {
    @observable userInfo = null;
    @observable activeItem = "";
    @observable reportDetail = {};
    // @computed
    // get getUserInfo() {
    //     return this.userInfo;
    // }

    @action
    updateUserInfo(data) {
        this.userInfo = data;
    }

    @action
    updateActiveItem(item) {
        this.activeItem = navItemMap[item] || item;
    }

    @action
    updateReportDetail(data) {
        this.reportDetail = data;
    }
}
