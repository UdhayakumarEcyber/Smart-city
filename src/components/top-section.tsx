
import React, { useEffect, useState } from 'react';
import { WidgetWrapper } from 'uxp/components';
import { IContextProvider } from '../uxp';
import { EventsEnum } from '../index';

interface INavmode {
  uxpContext: IContextProvider;
  page?: string;
  currentPage?: string;
}

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

interface ITab {
  id: string;
  label: string;
  className: string;
}

const TopNavTabs: React.FunctionComponent<INavmode> = (props) => {
  const { uxpContext, page, currentPage } = props;
  const [activeTab, setActiveTab] = useState('Streetlight');

  useEffect(() => {
    if (page) setActiveTab(page);
  }, [page]);

  const tabs: Record<string, ITab> = {
    Waste: { label: 'Waste', className: 'waste', id: 'waste' },
    Streetlight: { label: 'Streetlight', className: 'streetlight', id: 'streetlight' },
    // CCTV: { label: 'CCTV', className: 'cctv', id: 'cctv' },
    Water: { label: 'Water', className: 'water', id: 'water' },
    Pollution: { label: 'Pollution', className: 'pollution', id: 'pollution' },
    Fire: { label: 'Fire', className: 'fire', id: 'fire' },
    POI: { label: 'POI', className: 'poi', id: 'poi' },
  };

  const handleTabClick = (label: string) => {
    setActiveTab(label);
    uxpContext.eventHandler?.(EventsEnum.Navigation, { page: label.toLowerCase() });
  };

  return (
    <WidgetWrapper className="smart-city_box">
      <div className="top-nav-tabs">
        <ul id="navList">
          {Object.values(tabs).map((tab) => (
            // <li
            //   key={tab.id}
            //   onClick={() => handleTabClick(tab.label)}
            //   className={`nav-link ${tab.className} ${tab.label === activeTab ? 'active' : ''}`}
            // >
            //   <a href="javascript:void(0);">
            //     <span></span>
            //     <label>{tab.label}</label>
            //   </a>
            // </li> 

            <li
              key={tab.id}
              onClick={() => handleTabClick(tab.label)}
              className={`nav-link ${tab.className} ${tab.label.toLowerCase() === activeTab.toLowerCase() ? 'active' : ''}`}
            >
              <a href="javascript:void(0);">
                <span></span>
                <label>{tab.label}</label>
              </a>
            </li>  

          ))}
        </ul>
      </div>
    </WidgetWrapper>
  );
};

export default TopNavTabs;
















// import React, { useEffect, useMemo, useState } from 'react';
// import { WidgetWrapper } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';
// interface INavmode {
//   uxpContext: IContextProvider;
//   page?:string,
//   objectId?:string,
//   currentPage?:string,
// }

// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

// interface ITab {
//  id:string,
//  label: string,
//  className: string
// }
// const TopNavTabs: React.FunctionComponent<INavmode> = (props) => {
//   const { uxpContext, page, currentPage } = props;
//   const [activeTab, setActiveTab] = useState('Streetlight');

//   const tabs: Record<string, ITab> = useMemo(() => ({
//       Waste: { label: 'Waste', className: 'waste', id: 'waste' },
//       Streetlight: { label: 'Streetlight', className: 'streetlight', id: 'streetlight' },
//       CCTV: { label: 'CCTV', className: 'cctv', id: 'cctv' },
//       Water: { label: 'Water', className: 'water', id: 'water' },
//       Pollution: { label: 'Pollution', className: 'pollution', id: 'pollution' },
//       Fire: { label: 'Fire', className: 'fire', id: 'fire' },
//   }), []);

//   useEffect(() => {
//       if (page) setActiveTab(page);
//   }, [page]);

//   const handleTabClick = (label: string) => {
//       setActiveTab(label);
//       uxpContext.eventHandler?.(EventsEnum.Navigation, { page: label.toLowerCase() });
//   };

//   return ( 

//     <WidgetWrapper className="smart-city_box">
//       <div className="top-nav-tabs">
//         <ul id="navList">
//           { Object.values(tabs).map((tab) => ( 

//             <li
//                   key={tab.id}
//                   onClick={() => handleTabClick(tab.label)} className={`nav-link ${tab.className} ${tab.label === activeTab ? ' active' : ''}`}
//               >

//               <a href="javascript:void(0);">
//                 <span></span>
//                 <label>{tab.label}</label>
//               </a>
//             </li> 
            
//           ))}
//         </ul>

         
//       </div>
      
//     </WidgetWrapper>


//   );
// };

// export default TopNavTabs;
 