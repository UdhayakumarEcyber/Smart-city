import React, { useState } from 'react';
import { WidgetWrapper } from 'uxp/components';
import { IContextProvider } from '../uxp';
import { EventsEnum } from '../index';
interface IMapChangeMode {
  uxpContext: IContextProvider;
}
interface ITab {
 id:string,
 label: string,
 className: string
}
const TopNavTabs: React.FunctionComponent<IMapChangeMode> = (props) => {
  const { uxpContext } = props;
  const [activeTab, setActiveTab] = useState('Streetlight');
 const tabs: { [key: string]: ITab } = {

      Waste: { label: 'Waste', className: 'waste', id: 'waste' },
      Streetlight:  { label: 'Streetlight', className: 'streetlight', id: 'streetlight' },
      CCTV: { label: 'CCTV', className: 'cctv', id: 'cctv' }, 
      Water: { label: 'Water', className: 'water', id: 'water' },
      Pollution: { label: 'Pollution', className: 'pollution', id: 'pollution' },
      Fire: { label: 'Fire', className: 'fire', id: 'fire' }, 

      // { label: 'Waste', className: 'waste', id: 'waste' },
      // { label: 'Streetlight', className: 'streetlight', id: 'streetlight' },
      // { label: 'CCTV', className: 'cctv', id: 'cctv' },
      // { label: 'Water', className: 'water', id: 'water' },
      // { label: 'Pollution', className: 'pollution', id: 'pollution' },
      // { label: 'Fire', className: 'fire', id: 'fire' },

    };
  const handleTabClick = (label: string) => {
    setActiveTab(label)
    const page = tabs[label];
    if (page) {
      uxpContext.eventHandler?.(EventsEnum.Navigation, { page: page.id });
    }
  };
  return (
    <WidgetWrapper className="smart-city_box">
      <div className="top-nav-tabs">
        <ul id="navList">
          { Object.values(tabs).map((tab) => (
            <li
              key={tab.id}
              className={`nav-link ${tab.className} ${activeTab === tab.label ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.label)}
            >
              <a href="javascript:void(0);" onClick={(e) => e.preventDefault()}>
                <span></span>
                <label>{tab.label}</label>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div id="messageBox"></div>
    </WidgetWrapper>
  );
};
export default TopNavTabs; 






// import React, { useState } from 'react';
// import { WidgetWrapper } from 'uxp/components';

// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';
 

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
// }

// const TopNavTabs: React.FunctionComponent<IMapChangeMode> = (props) => {
//   const { uxpContext } = props;
//   const [activeTab, setActiveTab] = useState('Streetlight');

//   const handleTabClick = (label: string) => {
//     setActiveTab(label); 
 
//     const pageMapping: { [key: string]: string } = {
//       Waste: 'waste',
//       Streetlight: 'map',
//       Cctv: 'cctv',
//       Water: 'water',
//       Pollution: 'pollution',
//       Fire: 'fire',
//     };

//     const page = pageMapping[label];

//     if (page) {
//       uxpContext.eventHandler?.(EventsEnum.Navigation, { page });
//       console.log('PageName', page)
//     }
//   };

//   function sendMessage(message: string) {
//     alert(message);
//   }

//   const tabs = [
//     // { label: 'Waste', className: 'waste', id: 'waste' },
//     { label: 'Streetlight', className: 'streetlight', id: 'streetlight' },
//     { label: 'CCTV', className: 'cctv', id: 'cctv' },
//     // { label: 'Water', className: 'water', id: 'water' },
//     // { label: 'Pollution', className: 'pollution', id: 'pollution' },
//     // { label: 'Fire', className: 'fire', id: 'fire' },
//   ];

//   return (
//     <WidgetWrapper className="smart-city_box">
//       <div className="top-nav-tabs">
//         <ul id="navList">
//           {tabs.map((tab) => (
//             <li
//               key={tab.id}
//               className={`nav-link ${tab.className} ${activeTab === tab.label ? 'active' : ''}`}
//               onClick={() => handleTabClick(tab.label)}
//             >
//               <a href="javascript:void(0);" onClick={(e) => e.preventDefault()}>
//                 <span></span>
//                 <label>{tab.label}</label>
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div id="messageBox"></div>
//     </WidgetWrapper>
//   );
// };

// export default TopNavTabs;




