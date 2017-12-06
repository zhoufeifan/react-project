import React from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import RouteList from './routerList';
import PagesStore from 'store/PageStore';
const store = new PagesStore();
const Routes = () =>(
    <Router>
        <Provider store={store}>
            <RouteList/>
        </Provider>
    </Router>
);



export default Routes;
