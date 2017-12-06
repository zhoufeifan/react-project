import classNames from 'classnames';
import React from 'react';
import './UserInput.css'

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {
            showOption: false
        };
    }

    componentDidMount() {
        const {optionList} = this.props;
        if(optionList && optionList.length>0){
            this.props.onSelect(optionList[0]);
        }
    }

    getInnerInputRef() {
        return this.refs.input;
    }

    toggleOption(flag) {
        this.setState({showOption: flag});
    }

    renderOptionList(optionList) {
        return (<div className={classNames('user-input-select-list opr-list', this.state.showOption ? '' : 'hidden')}>
            <ul className="select-list-ul">
                {optionList.map(item => {
                    return (<li key={item} className="select-item" onClick={() => {
                        this.props.onSelect && this.props.onSelect(item);
                    }}>{item}</li>);
                })}
            </ul>
        </div>);
    }

    render() {
        const {icon, className, nativeProps = {}, optionList} = this.props;
        return (
            <div className={classNames('user-input-container', className || '')}>
                {icon && <div className="icon-container"><img src={icon}/></div> }

                <div className="input-container">
                    <input {...nativeProps} className="user-input"
                           onClick={()=>{
                               this.toggleOption(true);
                           }}
                           onBlur={()=>{
                               setTimeout(()=> {
                                   this.toggleOption(false);
                               },200);
                           }}
                           ref="input"/>
                    {optionList && optionList.length ?
                        <img className="select-down-icon" src={require('imagesDir/select-down.png')}
                             onClick={()=>{
                                 setTimeout(()=>{
                                     this.toggleOption(true);
                                 },100);
                                 this.refs.input.focus();
                             }}/> : ''}

                    {
                        optionList && optionList.length ? this.renderOptionList(optionList):''
                    }
                </div>
            </div>
        );
    }
}

export default UserInput;