import React from 'react';
import ReactDOM from 'react-dom';

import './Button.css';
class Button extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    componentDidMount(){
        this.buttonContainer = ReactDOM.findDOMNode(this);
    }
    render() {
        const {type,text,disabled} = this.props;
        return (
            <div className="button-container" onClick={()=>{
                let coverElement = document.createElement('span');
                coverElement.className = "btn-cover";
                this.buttonContainer.appendChild(coverElement);
                new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        coverElement.className = "btn-cover show";
                        resolve(2);
                    },50);
                }).then((a)=>{
                    return new Promise((resolve,reject)=>{
                        setTimeout(()=>{
                            coverElement.style.opacity='0';
                            resolve(1);
                        },300);
                    });
                }).then((a)=>{
                    this.buttonContainer.removeChild(coverElement);
                });

            }}>
                <button className={`btn-${type}`} disabled={disabled?"disabled":""}>{text}</button>
            </div>
        );
    }
}

export default Button;

