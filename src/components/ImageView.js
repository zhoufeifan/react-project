import React from 'react';
import './ImageView.css'

class ImageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageLoaded: false,
        }
    }

    componentDidMount() {
        let image = new Image();
        image.src = this.props.src;
        image.onload = () => {
            this.setState({isImageLoaded: true});
        };
    }

    render() {
        const {src, alt = "", className = "", onClick, onDoubleClick} = this.props;
        return (
            <div className={className ? `image-view-container ${className}` : "image-view-container"}>
                {this.state.isImageLoaded ?
                    <img className="content-img" src={src} alt={alt} onClick={onClick} onDoubleClick={onDoubleClick}/> :
                    <img alt="加载中" className="loading-img rotate" src={require('imagesDir/loading.png')}/>}
            </div>
        );
    }
}

export default ImageView;

