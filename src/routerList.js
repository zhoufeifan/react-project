import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Main from 'pages/main';


@inject("store")
@withRouter
@observer
class RouteList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Route exact path="/" component={Main}/>
            </div>
        );
    }
}

export default RouteList;