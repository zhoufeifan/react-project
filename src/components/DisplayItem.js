import React from 'react';
import './DisplayItem.css';
class DisplayItem extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }

    render() {
        return (
            <div className="display-item-container">
                {this.props.title}
                <div className="display-item-content">{this.props.children}</div>
            </div>
        );
    }
}

export default DisplayItem;

