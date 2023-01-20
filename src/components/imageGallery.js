import React from "react";
import { Carousel } from 'react-responsive-carousel';
import {GatsbyImage} from 'gatsby-plugin-image'
import "react-responsive-carousel/lib/styles/carousel.min.css";

class ImageGalleryComponent extends React.Component {
    render() {
        return (
            <div>
                <Carousel interval="500" transitionTime="500" showArrows={true} infiniteLoop={true} showStatus={false}>
                {this.props.images ? this.props.images.map(image => {
                  return (
                    <div style={{display: "flex", alignItems: "center"}}>
                      <img src={image.gatsbyImageData.images.fallback.src} />
                    </div>
                  )
                })
                  :
                  <div>
                  </div>
                }
                </Carousel>
            </div>
        )
    };
}

export default ImageGalleryComponent;
