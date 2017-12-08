import './main.css';
import React from 'react';
import UserInput from 'components/UserInput';
import {inject, observer} from "mobx-react";
import DisplayContainer from 'components/DisplayContainer';
import DisplayItem from 'components/DisplayItem';
import Button from "../components/Button";

@inject("store")
@observer
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="main-page-container">
                <DisplayContainer title="输入框">
                    <DisplayItem title="普通输入框"><UserInput/></DisplayItem>
                    <DisplayItem title="带图标的输入框">
                        <UserInput icon={require('imagesDir/user-icon.png')}/>
                    </DisplayItem>
                    <DisplayItem title="下拉列表的输入框">
                        <UserInput icon={require('imagesDir/user-icon.png')} optionList={["百度","腾讯","阿里"]}/>
                    </DisplayItem>
                </DisplayContainer>
                <DisplayContainer title="按钮">
                    <DisplayItem title="强功能按钮"><Button type="important" text="你好啊"/></DisplayItem>
                    <DisplayItem title="弱功能按钮"><Button type="default" text="你好啊"/></DisplayItem>
                    <DisplayItem title="不可用按钮"><Button type="important" disabled={true} text="你好啊"/></DisplayItem>
                </DisplayContainer>
            </div>
        );
    }
}

export default Main;

