import React, { useEffect, useState } from 'react';
import { FormField, Select, WidgetWrapper } from "uxp/components";
import { IContextProvider } from '../uxp';  

interface IPoiSummary {
  uxpContext: IContextProvider;
  index: string;
  buildinginfo: IbuildingAsset; 
  selectedAsset: ISelectedAsset;
}

type poiIcons = '';

interface ISelectedAsset {
  objectType: poiIcons;
 // objectType: any;
  id: string;
  lat?: number;
  long?: number;
}

interface IbuildingAsset {
  objectType: any;
  buildingId: string; 
}

const Poi: React.FunctionComponent<IPoiSummary> = ({ index, buildinginfo, selectedAsset, ...props }) => {
  const { uxpContext } = props;
  let [selected, setSelected] = useState<string | null>();
  const [poi_Summary, setPoi_Summary] = useState<any>(null);
  const [poi_Build_types, setPoi_Build_types] = useState<string[]>([]);
  const [showShortDescription, setShowShortDescription] = useState(false);
  const [showBriefDescription, setShowBriefDescription] = useState(false);

  const lat = selectedAsset?.lat;
  const long = selectedAsset?.long;

  // const lat = 24.46;
  // const long = 39.59;

  console.log('Selected Asset:', selectedAsset);
  console.log('Latitude:', lat);
  console.log('Longitude:', long);

    const buildingId = 'buildinginfo';

   // const buildingId = '15-BLD';

  const handleClickShort = () => {
    setShowShortDescription(!showShortDescription);
  };

  const handleClickBrief = () => {
    setShowBriefDescription(!showBriefDescription);
  };

  const getPoiBuildingType = () => {
    console.log("getBuildingInfo");

    uxpContext.executeAction("DigitalTwin", "Get Building types", {}, { json: true })
      .then((res: string[]) => {
        console.log("Response From API is", res, typeof res);
        setPoi_Build_types(res);
      }).catch((e: any) => {
        console.error("Error fetching building info", e);
      });
  }

  useEffect(() => {
    getPoiBuildingType();
  }, []);

  const getPoiSummaryData = () => {
    console.log("getBuildingInfo");

    uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
      .then((res: any) => {
        console.log("Response From API is", res, typeof res);
        setPoi_Summary(res);
      }).catch((e: any) => {
        console.error("Error fetching building info", e);
      });
  }

  useEffect(() => {
    getPoiSummaryData();
  }, [buildingId]);

  const handleIconClick = () => {
    if (lat && long) {
      uxpContext.executeAction("DigitalTwin", "Get Building types", { lat, long }, { json: true })
        .then((res: string[]) => {
          console.log("Response From API with lat/long:", res, typeof res);
          setPoi_Build_types(res);
        }).catch((e: any) => {
          console.error("Error fetching building info with lat/long", e);
        });
    }
  }

  const options = poi_Build_types.map((type: string, index: number) => ({
    label: type,
    value: `op-${index + 1}`
  }));

  return (
    <WidgetWrapper className="smart-city_box poi-box">
      <div className="smart-city-content">
        <div className="chart-top">
          <FormField inline className="showcase-input">
            <Select
              selected={selected}
              options={options}
              onChange={(value) => { setSelected(value) }}
              placeholder=" Select Building Type"
            />
          </FormField>
        </div>
        <div className="poi-clk">
          <a href="#" onClick={handleClickShort}>Click me</a>
        </div>

        <span onClick={handleIconClick}>&#9733;</span>

        <span onClick={handleIconClick}>&#7738;</span>

        {showShortDescription && (
          <div className="poi-sec-short">
            <div className="widget-container">
              <div className="widget-content">
                <div className="widget-image">
                  <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
                </div>
                <div className="widget-description">
                  <h3>{poi_Summary?.deviceName}</h3>
                  <h5>{poi_Summary?.buildCategory}</h5>
                  {poi_Summary?.locInfo?.shortEnglishDiscription ? (
                    <>
                      <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
                      <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
                    </>
                  ) : (
                    <p>{poi_Summary?.locInfo?.address}</p>
                  )}
                </div>
                <div className="widget-icon">
                  {poi_Summary?.locInfo?.shortEnglishDiscription ? (
                    <>
                      <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
                      <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
                    </>
                  ) : (
                    <></>
                  )}
                
                </div>
              </div>
            </div>
          </div>
        )}

        {showBriefDescription && (
          <div className="poi-sec-brief">
            <div className="widget-container">
              <div className="widget-content">
                <div className="widget-image">
                  <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
                </div>
                <div className="widget-description">
                  <h3>{poi_Summary?.deviceName}</h3>
                  <h5>{poi_Summary?.buildCategory}</h5>
                  <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
                  <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export default Poi;


















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
//   objectType: poiIcons;
//  // objectType: any;
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
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);

//   const lat = selectedAsset?.lat;
//   const long = selectedAsset?.long;

//   // const lat = 24.46;
//   // const long = 39.59;

//   console.log('Selected Asset:', selectedAsset);
//   console.log('Latitude:', lat);
//   console.log('Longitude:', long);

//     const buildingId = 'buildinginfo';

//    // const buildingId = '15-BLD';

//   const handleClickShort = () => {
//     setShowShortDescription(!showShortDescription);
//   };

//   const handleClickBrief = () => {
//     setShowBriefDescription(!showBriefDescription);
//   };

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

//   const getPoiSummaryData = () => {
//     console.log("getBuildingInfo");

//     uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
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

//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">
//         <div className="chart-top">
//           <FormField inline className="showcase-input">
//             <Select
//               selected={selected}
//               options={options}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" Select Building Type"
//             />
//           </FormField>
//         </div>
//         <div className="poi-clk">
//           <a href="#" onClick={handleClickShort}>Click me</a>
//         </div>

//         <span onClick={handleIconClick}>&#9733;</span>

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
//                       <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
//                       <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
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
//                   <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
//                   <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
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
// import { FormField, Select, WidgetWrapper, TitleBar } from "uxp/components";
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
//   let [selected, setSelected] = useState<string | null>();
//   const [poi_Summary, setPoi_Summary] = useState(null);
//   const [poi_Build_types, setPoi_Build_types] = useState<string[]>([]);
//   const [showShortDescription, setShowShortDescription] = useState(false);
//   const [showBriefDescription, setShowBriefDescription] = useState(false);

//   const lat = selectedAsset?.long;
//   const long = selectedAsset?.lat;


//   console.log('Selected Asset are', selectedAsset);
//   console.log('latitude are', lat);
//   console.log('Longitude are', long);

//    const buildingId = 'buildinginfo';
 
//   //const buildingId = '15-BLD';

//   const handleClickShort = () => {
//     setShowShortDescription(!showShortDescription);
//   };

//   const handleClickBrief = () => {
//     setShowBriefDescription(!showBriefDescription);
//   };


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


//   const options = poi_Build_types.map((type: string, index: number) => ({
//     label: type,
//     value: `op-${index + 1}`
//   }));
  

//   return (
//     <WidgetWrapper className="smart-city_box poi-box">
//       <div className="smart-city-content">


//       <div className="chart-top">
//           <FormField inline className="showcase-input"> 
//             {/* <Select
//               selected={selected}
//               options={[
//                 { label: "All Alert", value: "op-1" },
//                 { label: "All Alert 1", value: "op-2" },
//                 { label: "All Alert 2", value: "op-3" },
//               ]}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" -- select --"
//             /> */}

 
//             <Select
//               selected={selected}
//               options={options}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" Select Building Type"
//             /> 
//             </FormField>
//         </div>



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
//                       <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
//                       <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
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
//                   <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
//                   <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
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
// function getPoiummaryData() {
//   throw new Error('Function not implemented.');
// }






































import React, { useEffect, useState } from 'react';
import { WidgetWrapper } from 'uxp/components';
import { IContextProvider } from '../uxp'; 
 

interface IPoiSummary {
  uxpContext: IContextProvider;
  index: string;
  buildinginfo: IbuildingAsset; 
}

interface IbuildingAsset {
  objectType: any;
  buildingId: string; 
}


const Poi: React.FunctionComponent<IPoiSummary> = ({ index, buildinginfo, ...props }) => {
  const { uxpContext } = props;
  const [poi_Summary, setPoi_Summary] = useState(null);
  const [showShortDescription, setShowShortDescription] = useState(false);
  const [showBriefDescription, setShowBriefDescription] = useState(false);

  //const buildingId = 'buildinginfo';
 
  const buildingId = '15-BLD';

  const handleClickShort = () => {
    setShowShortDescription(!showShortDescription);
  };

  const handleClickBrief = () => {
    setShowBriefDescription(!showBriefDescription);
  };

  const getPoiSummaryData = () => {
    console.log("getBuildingInfo");

    props.uxpContext.executeAction("DigitalTwin", "Get Poi Building", { buildingId: buildingId }, { json: true })
      .then((res: any) => {
        console.log("Response From API is", res, typeof res);
        setPoi_Summary(res);
      }).catch((e: any) => {
        console.error("Error fetching building info", e);
      });
  }

  useEffect(() => {
    getPoiSummaryData();
  }, [buildingId]); 

  return (
    <WidgetWrapper className="smart-city_box poi-box">
      <div className="smart-city-content">
        <div className="poi-clk">
          <a href="#" onClick={handleClickShort}>Click me</a>
        </div>

       

{showShortDescription && (
          <div className="poi-sec-short">
            <div className="widget-container">
              <div className="widget-content">
                <div className="widget-image">
                  <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
                </div>
                <div className="widget-description">
                  <h3>{poi_Summary?.deviceName}</h3>
                  <h5>{poi_Summary?.buildCategory}</h5>
                  {poi_Summary?.locInfo?.shortEnglishDiscription ? (
                    <>
                      <p>{poi_Summary?.locInfo?.shortEnglishDiscription}</p>
                      <p>{poi_Summary?.locInfo?.shortArabicDescription}</p>
                    </>
                  ) : (
                    <p>{poi_Summary?.locInfo?.addres}</p>
                  )}
                </div>
                <div className="widget-icon"> 

                  {poi_Summary?.locInfo?.shortEnglishDiscription ? (
                    <>
                     <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
                      <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
                    </>
                  ) : (
                     <></>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {showBriefDescription && (
          <div className="poi-sec-brief">
            <div className="widget-container">
              <div className="widget-content">
                <div className="widget-image">
                  <img src={poi_Summary?.locInfo?.imageUrl} alt="POI" />
                </div>
                <div className="widget-description">
                  <h3>{poi_Summary?.deviceName}</h3> 
                  <h5>{poi_Summary?.buildCategory}</h5>
                  <p>{poi_Summary?.locInfo?.longEnglishDiscription}</p>
                  <p>{poi_Summary?.locInfo?.longArabicDiscription}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export default Poi;
function getPoiummaryData() {
  throw new Error('Function not implemented.');
}

