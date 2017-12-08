import React from 'react';
import './DisplayContainer.css';
class DisplayContainer extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }

    render() {
        return (
            <div className="display-container">
                <p className="display-container-name">{this.props.title}</p>
                <hr/>
                <div className="display-container-content">{this.props.children}</div>
            </div>
        );
    }
}

export default DisplayContainer;

