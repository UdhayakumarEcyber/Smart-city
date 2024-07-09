import React, { useState } from 'react';
import { WidgetWrapper } from 'uxp/components';
import { IContextProvider } from '../uxp'; 

interface IMapChangeMode {
  uxpContext: IContextProvider;
}
interface ITab {
 
}
const PowerByWidget: React.FunctionComponent<IMapChangeMode> = (props) => {
  const { uxpContext } = props;
  
  return (
    <WidgetWrapper className="smart-city_box power-by-box"> 

        <div className='header-content'> 
                <div className='power-by-cont'> 
                 <p><sub>Powered By</sub></p><div className='raseel_logo'></div> 
              </div>
              
        </div> 

    </WidgetWrapper> 
  );
};
export default PowerByWidget; 