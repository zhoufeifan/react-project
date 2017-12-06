import"./Toast.css";
const Toast = {
    _ele: null,
    _msg: null,
    _icon: null,
    timeout: null,
    _loading: null,
    status:{
        success: 'success',
        waring: 'waring',
    },
    ele() {
        if (!this._ele) {
            const ele = window.document.createElement('div');
            ele.className = "toast-container";
            ele.innerHTML = `<div class="toast-icon"></div><p class="toast-text"></p>`;
            window.document.body.appendChild(ele);
            this._ele = ele;
            this._msg = ele.querySelector('.toast-text');
            this._icon = ele.querySelector('.toast-icon');
        }
        return this._ele;
    },
    loading(){
        if (!this._loading) {
            this._loading = document.body.querySelector('#mainCover');
        }
        return this._loading;
    },
    show(option) {
        /**
         *
         * @param option
         * @ text: 文字
         * @ cb: 消失的回掉
         * @ time: 出现时间
         */
        if(option.status){
            this.ele().className = 'toast new-toast-icon-container';
            this._icon.className = `toast-icon ${this.status[option.status]}`;
        }else {
            this.ele().className = 'toast new-toast-text-container';
            this._icon.className = 'toast-icon';
        }

        this._msg.innerText = option.text || option;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.hide();
            option.cb && option.cb();
        }, option.time ? option.time * 1000 : 2000);

    },
    hide() {
        this.ele().className = 'toast hidden';
    },
    showLoading() {
        this.loading().style.display = 'block';
    },
    hideLoading() {
        this.loading().style.display = 'none';
    },
    warning(text,cb) {
        this.show({status:'waring',text,cb});
    },
    success(text,cb) {
        this.show({status:'success',text,cb});
    }
};

export default Toast;



