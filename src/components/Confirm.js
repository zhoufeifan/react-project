import Modal from './Modal';
import React from 'react';
import './Confirm.css';


class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            okText: "确定",
            onOK: null,
            cancelText: "取消",
            onCancel: null
        };
    }

    show = (params) => {
        this.setState(params, () => {
            this.refs.modal.show();
        });
    };

    close = () => {
        this.refs.modal.close();
        this.state.onCancel && this.state.onCancel();
    };

    renderConfirm() {
        const {title, content,onOK,okText,cancelText} = this.state;
        return (
            <div className="confirm-container">
                <p className="title">{title}</p>
                <div className="info">
                    <p className="content" dangerouslySetInnerHTML={{__html: content}}/>
                </div>
                <div className="button">
                    <button type="button" className="cancel" onClick={this.close}>{cancelText}</button>
                    <button type="button" className="ok" ref="okBtn" autoFocus={true} onClick={()=>{
                        onOK && onOK();
                        this.refs.modal.close();
                    }}>{okText}</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Modal className="confirm-modal" ref="modal" content={this.renderConfirm()}/>
        );
    }
}
export default ConfirmModal;