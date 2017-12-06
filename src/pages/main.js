/*
 * 登录模块
 * */
"use strict";
import './main.css';
import React from 'react';
import {request, requestUrlMap} from 'utils/request';
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="login-container" id="loginContainer">
                嘿，你好啊,这是我的首页
            </div>
        );
    }
}

export default Login;

