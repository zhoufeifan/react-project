import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css';

const LinkItem = (item)=>{
    return(
        <li className="title">
            <Link to={item.pathName}>{item.title}</Link>
        </li>
    )
};

class NavBar extends React.Component{
    constructor(props) {
        super(props);
    }

    getPathList = (pathList)=>{
        return (
            pathList.map((item,index)=>(
                <li className="title" key={index}>
                    <Link to={item.pathName}>{item.title}</Link>
                </li>
            ))
        )
    };


    render(){
        return (
            <nav className="new-nav-bar">
                <ol>
                    {this.getPathList(this.props.navBarItem.navList)}
                    <li>{this.props.navBarItem.pageName}</li>
                </ol>
            </nav>
        );
    }
}
export default NavBar;