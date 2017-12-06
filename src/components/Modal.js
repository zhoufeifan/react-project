import './Modal.css';
import React from 'react';
import classNames from 'classnames';

class Modal extends React.Component {
    state = {
        show: false
    }
    
    constructor(props) {
        super(props);
        this.handleKey();
    }

    handleKey = () => {
        document.addEventListener('keydown', e => {
            if (this.state.show && !this.props.noClose) {
                const key = e.keyCode;
                // esc
                if (key === 27) {
                    this.close();
                    this.props.onClose && this.props.onClose();
                }
            }
        });
    }

    handleClose = e => {
        e.stopPropagation();
        this.close();
        this.props.onClose && this.props.onClose(e);
    }

    handleStopPropagation = e => {
        e.stopPropagation();
    }

    show = () => {
        this.setState({
            show: true
        });
    }

    close = () => {
        this.setState({
            show: false
        });
    }

    render() {
        if (this.state.show) {
            return(
                <div className={classNames('modal-ui', this.props.className)}>
                  <div className="modal-container" onClick={this.handleStopPropagation}>
                      {this.props.noClose ? '' : <span className="modal-close" onClick={this.handleClose}/>}
                      {this.props.content}
                  </div>
                </div>
            );
        } else {
            return null;
        }
    }
}
export default Modal;