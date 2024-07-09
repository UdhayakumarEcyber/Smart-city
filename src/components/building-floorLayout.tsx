 
import React, { useState } from 'react';
import { WidgetWrapper, TitleBar } from "uxp/components";

const FloorLayout: React.FunctionComponent<{}> = () => {
  const [slideIndex, setSlideIndex] = useState(1);

  const imageSources = [
    'https://static.iviva.com/images/Udhayimages/mda-building-images/layout-1.png',
    'https://static.iviva.com/images/Udhayimages/mda-building-images/layout-2.png',
    'https://static.iviva.com/images/Udhayimages/mda-building-images/layout-3.png',
    'https://static.iviva.com/images/Udhayimages/mda-building-images/layout-4.png'
  ];

  const plusSlides = (n: number) => {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex + n;
      if (newIndex > imageSources.length) {
        newIndex = 1;
      } else if (newIndex < 1) {
        newIndex = imageSources.length;
      }
      return newIndex;
    });
  };

  return (
    <WidgetWrapper className="smart-city_box building_layout-box">
       <TitleBar title="Floor Layout" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/layout.png'></TitleBar>  
    
      <div className="smart-city-content">
        <div className="slideshow-container">
          <div className={`myslides${slideIndex}`}>
            <img src={imageSources[slideIndex - 1]} style={{ width: '100%' }} alt={`Slide ${slideIndex}`} />
          </div>
          <button className="slider-btn prev" onClick={() => plusSlides(-1)}>
            &#10094;
          </button>
          <button className="slider-btn next" onClick={() => plusSlides(1)}>
            &#10095;
          </button>
        </div>
 
        <div className='build-bhk-boxes'>
            <div className='bhk-box one_bhk'>1 BHK</div>
            <div className='bhk-box two_bhk'>2 BHK</div>
            <div className='bhk-box mep'>MEP</div>
        </div>

      </div>
    </WidgetWrapper>
  );
};

export default FloorLayout;
