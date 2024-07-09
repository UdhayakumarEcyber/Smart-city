 
import React, { useEffect, useState } from 'react';
import { WidgetWrapper } from "uxp/components";
import { IContextProvider } from '../uxp';

interface IPoiSummary {
  uxpContext: IContextProvider;
  index: string;
  buildinginfo: IbuildingAsset;
  selectedAsset: ISelectedAsset;
  page: string;
}

interface ISelectedAsset {
  objectType: any;
  id: string;
  lat?: number;
  long?: number;
}

interface IbuildingAsset {
  objectType: any;
  buildingId: string;
}

import POI_Description from './poi_description';  

const Poi: React.FunctionComponent<IPoiSummary> = ({ page, index, buildinginfo, selectedAsset, ...props }) => {
  const { uxpContext } = props;
  const [poi_Summary, setPoi_Summary] = useState<any>(null);
  const [showShortDescription, setShowShortDescription] = useState(false);
  const [showBriefDescription, setShowBriefDescription] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<Record<string, any>[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedBuildingDetails, setSelectedBuildingDetails] = useState<any>(null); // Hold details for Uk_Description

  useEffect(() => {
    getNearbyLocations();
  }, [selectedAsset?.lat, selectedAsset?.long]);

  const getNearbyLocations = () => {
    if (!selectedAsset?.lat || !selectedAsset?.long) return;

    uxpContext
      .executeAction(
        'DigitalTwin',
        'Get Near Location',
        {
          latitude: selectedAsset.lat,
          longitude: selectedAsset.long,
          categories: (window as any).SelectedPlaceCateogories || [],
          radius: 2000,
        },
        { json: true }
      )
      .then((res: Record<string, any>[]) => {
        setNearbyLocations(res);
      })
      .catch((error) => {
        console.error("Error fetching nearby locations", error);
      });
  };

  const getPoiSummaryData = (buildingId: string) => {
    uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
      .then((res: any) => {
        setSelectedBuildingDetails(res);
      }).catch((e: any) => {
        console.error("Error fetching building info", e);
      });
  };

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
  };

  const toggleShortDescription = () => {
    setShowShortDescription(!showShortDescription);
    if (showBriefDescription) {
      setShowBriefDescription(false);
    }
  };

  const toggleBriefDescription = () => {
    setShowBriefDescription(!showBriefDescription);
    if (showShortDescription) {
      setShowShortDescription(false);
    }
  };

  return (
    <WidgetWrapper className="smart-city_box poi-box">
      <div className="smart-city-content">
        <div className="nearby-locations">
          <h4>Nearby Locations (within 1000 meters)</h4>
          {nearbyLocations.filter(location => location.calcDistance <= 1000).map((location, index) => (
            <div key={index} className="nearby-location">
              <h5>{location.deviceName}</h5>
              <p>Category: {location.buildCategory}</p>
              <p>City: {location.cityId}</p>
              <p>Municipality: {location.muncipalityName}</p>
              <p>Zone: {location.zoneId}</p>
              <p>Distance: {location.calcDistance.toFixed(2)} meters</p>
              <button onClick={() => handleSelectBuilding(location.index)}>View Details</button>
            </div>
          ))}
        </div>

        {/* Render Uk_Description when a building is selected */}
        {selectedBuildingDetails && (
          <POI_Description
            buildingDetails={selectedBuildingDetails}
            showShortDescription={showShortDescription}
            showBriefDescription={showBriefDescription}
            toggleShortDescription={toggleShortDescription}
            toggleBriefDescription={toggleBriefDescription}
          />
        )}
      </div>
    </WidgetWrapper>
  );
};

export default Poi;


























// import React, { useEffect, useState } from 'react';
// import { WidgetWrapper } from "uxp/components";
// import { IContextProvider } from '../uxp';

// interface IPoiSummary {
//   uxpContext: IContextProvider;
//   index: string;
//   buildinginfo: IbuildingAsset;
//   selectedAsset: ISelectedAsset;
// }

// interface ISelectedAsset {
//   objectType: any;
//   id: string;
//   lat?: number;
//   long?: number;
// }

// interface IbuildingAsset {
//   objectType: any;
//   buildingId: string;
// }

// const Poi: React.FunctionComponent<IPoiSummary> = ({ index, buildinginfo, selectedAsset, ...props }) => {
//   const { uxpContext } = props;
//   const [poi_Summary, setPoi_Summary] = useState<any>(null);
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);
//   const [nearbyLocations, setNearbyLocations] = useState<Record<string, any>[]>([]);
//   const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

//   const lat = selectedAsset?.lat;
//   const long = selectedAsset?.long;

//   const getNearbyLocations = () => {
//     uxpContext
//       .executeAction(
//         'DigitalTwin',
//         'Get Near Location',
//         {
//           latitude: lat,
//           longitude: long,
//           categories: (window as any).SelectedPlaceCateogories || [],
//           radius: 2000,
//         },
//         { json: true }
//       )
//       .then((res: Record<string, any>[]) => {
//         setNearbyLocations(res);
//       })
//       .catch((error) => {
//         console.error("Error fetching nearby locations", error);
//       });
//   };

//   const getPoiSummaryData = (buildingId: string) => {
//     props.uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
//       .then((res: any) => {
//         setPoi_Summary(res);
//       }).catch((e: any) => {
//         console.error("Error fetching building info", e);
//       });
//   };

//   useEffect(() => {
//     getNearbyLocations();
//   }, [lat, long]);

//   useEffect(() => {
//     if (selectedBuildingId) {
//       getPoiSummaryData(selectedBuildingId);
//     }
//   }, [selectedBuildingId]);

//   const handleClickShort = () => {
//     setShowShortDescription(!showShortDescription);
//   };

//   const handleClickBrief = () => {
//     setShowBriefDescription(!showBriefDescription);
//   };

//   const handleSelectBuilding = (buildingId: string) => {
//     setSelectedBuildingId(buildingId);
//   };

//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">
//         <div className="poi-clk">
//           <a href="#" onClick={handleClickShort}>Click me</a>
//         </div>

//         {showShortDescription && (
//           <div className="poi-sec-short">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3>
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                       <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
//                       <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
//                     </>
//                   ) : (
//                     <p>{poi_Summary?.locInfo?.address}</p>
//                   )}
//                 </div>
//                 <div className="widget-icon">
//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                       <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
//                       <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
//                     </>
//                   ) : (
//                     <></>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showBriefDescription && (
//           <div className="poi-sec-brief">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3>
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
//                   <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="nearby-locations">
//           <h4>Nearby Locations (within 1000 meters)</h4>
//           {nearbyLocations.filter(location => location.calcDistance <= 1000).map((location, index) => (
//             <div key={index} className="nearby-location">
//               <h5>{location.deviceName}</h5>
//               <p>Category: {location.buildCategory}</p>
//               <p>City: {location.cityId}</p>
//               <p>Municipality: {location.muncipalityName}</p>
//               <p>Zone: {location.zoneId}</p>
//               <p>Distance: {location.calcDistance.toFixed(2)} meters</p>
//               <button onClick={() => handleSelectBuilding(location.index)}>View Details</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Poi;















// import React, { useEffect, useState } from 'react';
// import { WidgetWrapper } from "uxp/components";
// import { IContextProvider } from '../uxp';

// interface IPoiSummary {
//   uxpContext: IContextProvider;
//   index: string;
//  // buildinginfo: IbuildingAsset;
//   selectedAsset: ISelectedAsset;
// }

// interface ISelectedAsset {
//   objectType: any;
//   id: string;
//   lat?: number;
//   long?: number;
// }

// // interface IbuildingAsset {
// //   objectType: any;
// //   buildingId: string;
// // }

// const Poi: React.FunctionComponent<IPoiSummary> = ({ index, selectedAsset, ...props }) => {
//   const { uxpContext } = props;
//   const [poi_Summary, setPoi_Summary] = useState<any>(null);
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);
//   const [nearbyLocations, setNearbyLocations] = useState<Record<string, any>[]>([]);

//   const lat = selectedAsset?.lat;
//   const long = selectedAsset?.long;

//   const getNearbyLocations = () => {
//     uxpContext
//       .executeAction(
//         'DigitalTwin',
//         'Get Near Location',
//         {
//           latitude: lat,
//           longitude: long,
//           categories: (window as any).SelectedPlaceCateogories || [],
//           radius: 2000,
//         },
//         { json: true }
//       )
//       .then((res: Record<string, any>[]) => {
//         setNearbyLocations(res);
//       })
//       .catch((error) => {
//         console.error("Error fetching nearby locations", error);
//       });
//   };

//   const buildingId = "204-BLD";

//   const getPoiSummaryData = () => {
//     props.uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
//       .then((res: any) => {
//         setPoi_Summary(res);
//       }).catch((e: any) => {
//         console.error("Error fetching building info", e);
//       });
//   };

//   useEffect(() => {
//     getPoiSummaryData();
//   }, [ buildingId]);

//   useEffect(() => {
//     getNearbyLocations();
//   }, [lat, long]);

//   const handleClickShort = () => {
//     setShowShortDescription(!showShortDescription);
//   };

//   const handleClickBrief = () => {
//     setShowBriefDescription(!showBriefDescription);
//   };

//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">

//       <div className="nearby-locations">
//           <h4>Nearby Locations (within 1000 meters)</h4>
//           {nearbyLocations.filter(location => location.calcDistance <= 1000).map((location, index) => (
//             <div key={index} className="nearby-location">
//               <h5>{location.deviceName}</h5>
//               <p>Category: {location.buildCategory}</p>
//               <p>City: {location.cityId}</p>
//               <p>Municipality: {location.muncipalityName}</p>
//               <p>Zone: {location.zoneId}</p>
//               <p>Distance: {location.calcDistance.toFixed(2)} meters</p>
//             </div>
//           ))}
//         </div>

//         <div className="poi-clk">
//           <a href="#" onClick={handleClickShort}>Click me</a>
//         </div>

//         {showShortDescription && (
//           <div className="poi-sec-short">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3>
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                       <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
//                       <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
//                     </>
//                   ) : (
//                     <p>{poi_Summary?.locInfo?.address}</p>
//                   )}
//                 </div>
//                 <div className="widget-icon">
//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                       <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
//                       <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
//                     </>
//                   ) : (
//                     <></>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showBriefDescription && (
//           <div className="poi-sec-brief">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3>
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
//                   <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}



//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Poi;























// import React, { useEffect, useState } from 'react';
// import { FormField, Select, WidgetWrapper } from "uxp/components";
// import { IContextProvider } from '../uxp';  

// interface IPoiSummary {
//   uxpContext: IContextProvider;
//   index: string;
//   buildinginfo: IbuildingAsset; 
//   selectedAsset: ISelectedAsset;
// } 

// interface ISelectedAsset { 
//  objectType: any;
//   id: string;
//   lat?: number;
//   long?: number;
// }

// interface IbuildingAsset {
//   objectType: any;
//   buildingId: string; 
// }

// const Poi: React.FunctionComponent<IPoiSummary> = ({ index, buildinginfo, selectedAsset, ...props }) => {
//   const { uxpContext } = props;
//   let [selected, setSelected] = useState<string | null>();
//   const [poi_Summary, setPoi_Summary] = useState<any>(null);
//   const [poi_Build_types, setPoi_Build_types] = useState<string[]>([]);
//   const [getGeoJson, setGetGeoJson] = useState<string[]>([]);
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);

//      const lat = selectedAsset?.lat;
//     const long = selectedAsset?.long; 

//     // const lat = 24.46;
//     // const long = 39.59; 

//     useEffect(() => {
//       uxpContext
//           .executeAction(
//               'DigitalTwin',
//               'Get Near Location',
//               {
//                   latitude: lat,
//                   longitude: long,
//                   categories: (window as any).SelectedPlaceCateogories || [],
//                   radius: 2000,
                  
//               },
//               { json: true } 
              
//           )
//           .then((res: Record<string, any>[]) => {})
//           .catch((error) => {});
//   }, []);  
 
//   //const buildingId = 'buildinginfo';
 
//   const buildingId = '15-BLD';

  
//   const getPoiSummaryData = () => {
//     console.log("getBuildingInfo");

//     props.uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
//       .then((res: any) => {
//         console.log("Response From API is", res, typeof res);
//         setPoi_Summary(res);
//       }).catch((e: any) => {
//         console.error("Error fetching building info", e);
//       });
//   }

//   useEffect(() => {
//     getPoiSummaryData();
//   }, [buildingId]); 


//   const handleClickShort = () => {
//     setShowShortDescription(!showShortDescription);
//   };

//   const handleClickBrief = () => {
//     setShowBriefDescription(!showBriefDescription);
//   };

   
//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">  

//         {/* <span onClick={handleIconClick}>&#9733;</span>  */} 

//         <div className="poi-clk">
//           <a href="#" onClick={handleClickShort}>Click me</a>
//         </div>
        

// {showShortDescription && (
//           <div className="poi-sec-short">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3>
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                       <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
//                       <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
//                     </>
//                   ) : (
//                     <p>{poi_Summary?.locInfo?.addres}</p>
//                   )}
//                 </div>
//                 <div className="widget-icon"> 

//                   {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                     <>
//                      <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
//                       <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
//                     </>
//                   ) : (
//                      <></>
//                   )}

//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showBriefDescription && (
//           <div className="poi-sec-brief">
//             <div className="widget-container">
//               <div className="widget-content">
//                 <div className="widget-image">
//                   <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
//                 </div>
//                 <div className="widget-description">
//                   <h3>{poi_Summary?.deviceName}</h3> 
//                   <h5>{poi_Summary?.buildCategory}</h5>
//                   <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
//                   <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )} 
          
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Poi;

 





// import React, { useEffect, useState } from 'react';
// import { FormField, Select, WidgetWrapper } from "uxp/components";
// import { IContextProvider } from '../uxp';  

// interface IPoiSummary {
//   uxpContext: IContextProvider;
//   index: string;
//   buildinginfo: IbuildingAsset; 
//   selectedAsset: ISelectedAsset;
// }

// type poiIcons = '';

// interface ISelectedAsset { 
//  objectType: any;
//   id: string;
//   lat?: number;
//   long?: number;
// }

// interface IbuildingAsset {
//   objectType: any;
//   buildingId: string; 
// }

// const Poi: React.FunctionComponent<IPoiSummary> = ({ index, buildinginfo, selectedAsset, ...props }) => {
//   const { uxpContext } = props;
//   let [selected, setSelected] = useState<string | null>();
//   const [poi_Summary, setPoi_Summary] = useState<any>(null);
//   const [poi_Build_types, setPoi_Build_types] = useState<string[]>([]);
//   const [getGeoJson, setGetGeoJson] = useState<string[]>([]);
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);

//     const lat = selectedAsset?.lat;
//     const long = selectedAsset?.long;


//     useEffect(() => {
//       uxpContext
//           .executeAction(
//               'DigitalTwin',
//               'Get Near Location',
//               {
//                   latitude: lat,
//                   longitude: long,
//                   categories: (window as any).SelectedPlaceCateogories || [],
//                   radius: 2000,
//               },
//               { json: true }
//           )
//           .then((res: Record<string, any>[]) => {})
//           .catch((error) => {});
//   }, []);



//   // const lat = 24.46;
//   // const long = 39.59;

//   // console.log('Selected Asset:', selectedAsset);
//   // console.log('Latitude:', lat);
//   // console.log('Longitude:', long);

//     const buildingId = 'buildinginfo';

//    // const buildingId = '15-BLD'; 

//   const getPoiBuildingType = () => {
//     console.log("getBuildingInfo");

//     uxpContext.executeAction("DigitalTwin", "Get Building types", {}, { json: true })
//       .then((res: string[]) => {
//         console.log("Response From API is", res, typeof res);
//         setPoi_Build_types(res);
//       }).catch((e: any) => {
//         console.error("Error fetching building info", e);
//       });
//   }

//   useEffect(() => {
//     getPoiBuildingType();
//   }, []); 

//   const handleIconClick = () => {
//     if (lat && long) {
//       uxpContext.executeAction("DigitalTwin", "Get Building types", { lat, long }, { json: true })
//         .then((res: string[]) => {
//           console.log("Response From API with lat/long:", res, typeof res);
//           setPoi_Build_types(res);
//         }).catch((e: any) => {
//           console.error("Error fetching building info with lat/long", e);
//         });
//     }
//   }

//   const options = poi_Build_types.map((type: string, index: number) => ({
//     label: type,
//     value: `op-${index + 1}`
//   }));


// const category="";
// const radius = 250;



//   const getGetGeoJson = () => {
//     console.log("getBuildingInfo");

//     uxpContext.executeAction("DigitalTwin", "Get Geo Json", {lat, long,category, radius }, { json: true })
//       .then((res: string[]) => { 
//         setGetGeoJson(res);
//       }).catch((e: any) => {
//         console.error("Error fetching building info", e);
//       });
//   }

//   useEffect(() => {
//     getGetGeoJson();
//   }, []); 


  

//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">
       
//         {/* <div className="chart-top">
//           <FormField inline className="showcase-input">
//             <Select
//               selected={selected}
//               options={options}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" Select Building Type"
//             />
//           </FormField>
//         </div>   */}
        

//         <span onClick={handleIconClick}>&#9733;</span> 

          
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Poi;

 









 