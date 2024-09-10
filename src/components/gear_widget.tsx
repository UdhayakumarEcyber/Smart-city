 
 

import React, { useState, useEffect, useRef } from "react";
import { WidgetWrapper, TitleBar , DropDownButton, Modal, FormField, Select, SearchBox , Button, Tooltip} from "uxp/components";
import { IContextProvider } from "../uxp";
import { ResponsivePie } from "@nivo/pie";
import { EventsEnum } from "../index";

 
interface IgearDetails {
    uxpContext: IContextProvider;
    sgDensity?: number;
  } 

const Gear_Widget: React.FunctionComponent<IgearDetails> = (props:any) => {
    const [ShowSGModal, setshowSGModal] = useState(false); 
    const [ShowRadiusModal, setshowRadiusModal] = useState(false);  

    // Start SG Density Controller //

  const { uxpContext, sgDensity } = props;
    
  const [currentHour, setCurrentHour] = useState(12);  
  const [value, setValue] = useState(sgDensity || 100);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const initialHour = now.getHours() + now.getMinutes() / 60;
    setCurrentHour(initialHour); 
  }, []);

  const changeFormatTime = (value: number) => {
    const hours = Math.floor(value) % 24;
    const formattedHours = String(hours).padStart(2, "0");
    const minutes = Math.round((value % 1) * 60);
    const formattedMinutes = String(minutes).padStart(2, "0"); 
    return `${formattedHours}:${formattedMinutes}`;
  };
  
  const calculateGradientPercentage = () => {
    const min = 50;
    const max = 100;
    const percentage = ((value - min) / (max - min)) * 100; 
    return percentage;
  }; 

  const handleSliderChange = (e: any) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue); 
    uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, {
        percentage: newValue,
    });
    inputRef.current?.blur();
    console.log("Event Triggered: ", EventsEnum.SetSGGridDensity, { percentage: newValue });
};
 
  // End SG Density Controller // 

  // Start Refresh Controller // 
  const handleRefresh = () => {
    uxpContext.eventHandler?.(EventsEnum.UpdateIOTAssetData, {});
  }; 
  // End Refresh Controller  //  

    // Start Radius Controller // 

    //let [selected, setSelected] = useState<string | null>("StreetLight");
    let [selected, setSelected] = useState<string | null>(null);
    let [selected1, setSelected1] = useState<string | null>(null);
    let [inputValue, setInputValue] = useState<number | null>(null);


  const streetLightDataprobtype = [
    {
      id: '1',
      name: 'Region',
      value: ["Mosque","Prayer Room"]
    },
    {
      id: '2',
      name: 'Transportation',
      value: ["Bus stop", "Metro", "Railway Stn.", "Taxi Stand","Airport", "Car Rental"]
    },
    {
      id: '3',
      name: 'Public Services',
      value: ["Hospital", "Police Stn.", "Fire dept.", "Ambulance","Clinic","Pharmacy","Muncipal Ofc.","Immigration Office", "Charity"]
    },
    {
      id: '4',
      name: 'Food & Beverage',
      value: ["Restaurant","Coffee Shop", "Grocery"]
    },
    {
      id: '5',
      name: 'Accommodation',
      value: ["Hotel","Camp Site"]
    },
    {
      id: '6',
      name: 'Financial Services',
      value: ["ATM","Bank", "Money exch."]
    },
    {
      id: '7',
      name: 'Retail & Markets',
      value: ["Market","Shopping Mall"]
    },
    {
      id: '8',
      name: 'Emergency Services',
      value: ["SOS", "Help Desk", "Tamper Detection","Call Box", "Flood Alert", "Fire"]
    },
    {
      id: '9',
      name: 'Utility & Infrastructure',
      value: ["Elec. Meter", "Gas Meter", "Water Meter","EV Charging","Pump","Rcyl.Plant"]
    },
    {
      id: '10',
      name: 'Environmental Monitoring',
      value: ["Sound Sensor", "Traffic Camera","AQI Sensor"]
    },
    {
      id: '11',
      name: 'Leisure & Recreation',
      value: ["Parks", "Tourist Spot","Hiking trail"]
    },
    {
      id: '12',
      name: 'Miscellaneous',
      value: ["Parking Area", "Public Toilet", "Public WiFi", "Crowd","Drone", "Embassy", "Laundry", "Barber Shop", "Farm", "University", "Dump Truck", "Waste Bin", "Auto.Workshop", "Factory", "Speed Radar"]
    },
    {
      id: '13',
      name: 'Pilgrimage and Cultural Sites',
      value: ["Histr. Mosque", "Museum", "Histr.Place", "Exhibition"]
    }
  ]; 

  
  const handleSelectedChange = (value: string) => {
    setSelected(value);
    setSelected1(null);  
  };

  const getSecondSelectOptions = () => {
    if (!selected) return [];

    const selectedItem = streetLightDataprobtype.find(item => item.name === selected);
    return selectedItem ? selectedItem.value.map(val => ({ label: val, value: val })) : [];
  };  

  const handleRadiusValue = (newValue:any) => {  
    const numberValue = Number(newValue);
    if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 2000 || newValue === '') {
      setInputValue(newValue === '' ? null : numberValue);
    } 
  };

  // End Radius Controller  //

    return (

        <div className="gear_section">  
                <div className="gear-cont">
                    <DropDownButton className="gear-dropdown"
                        content={() => <div className="gear-dropdown-cont">  
                            <ul>
                                {/* <li className="sg-icon"><a title="SG Controll" onClick={() => setshowSGModal(true)}></a></li> */}

                                <li className="sg-icon">  
                                    <Tooltip content={() => <span className="tooltip-cont">Density Control</span>} position="left"> 
                                        <a className="btn showcase" onClick={() => setshowSGModal(true)}></a> 
                                    </Tooltip>
                                </li>

                                <li className="radius-icon"> 
                                    <Tooltip content={() => <span className="tooltip-cont">POI Radius</span>} position="left"> 
                                        <a className="btn showcase" onClick={() => setshowRadiusModal(true)}></a> 
                                    </Tooltip>
                                </li>
{/* 
                                <li className="refresh-icon">  
                                    <Tooltip content={() => <span className="tooltip-cont">Json</span>} position="left"> 
                                        <a className="btn showcase" onClick={handleRefresh}></a> 
                                    </Tooltip>
                                </li> */}

                                <li className="refresh-icon">  
                                    <Tooltip content={() => <span className="tooltip-cont">Asset Refresh</span>} position="left"> 
                                        <a className="btn showcase" onClick={handleRefresh}></a> 
                                    </Tooltip>
                                </li>

                                {/* <li className="radius-icon"><a title="Radius Controll" onClick={() => setshowRadiusModal(true)}></a></li>
                                <li className="refresh-icon"><a title="Refresh" onClick={handleRefresh}></a></li> */}
                            </ul>
                        </div>}
                          position="left"
                       // showOnHover
                    > 
                        <span className="gear-icon btn showcase"></span>  
                    </DropDownButton> 
               </div>  
 

               <Modal className='sg-popup'
                    show={ShowSGModal} title='SG Density Controller'
                    onOpen={() => { }}
                    onClose={() => setshowSGModal(false)}
                > 

                <WidgetWrapper className="smart-city_box sg_density-box"> 
                    <div className="sg_density-widget" style={{height:"70px"}}>
                        <div className="timer-slider" style={{ flexDirection: "row" }}>
                        <div className="minus" style={{ width: "20px", color: "white", fontSize: "20px", fontWeight: "900", position: "absolute", left: "0px", top: "67px" }}>-</div>
                        <input
                            ref={inputRef}
                            type="range"
                            className="timer-range"
                            min={50}
                            max={100}
                            step={10}
                            list="steplist"
                            value={value}
                            onChange={handleSliderChange}
                            style={{
                            background: `linear-gradient(to right, rgb(9 230 152) 0%, #023d28 ${calculateGradientPercentage()}%, #fff ${calculateGradientPercentage()}%, #ddd 100%)`,
                            }}
                        />
                        <div className="plus" style={{ width: "20px", color: "white", fontSize: "18px", fontWeight: "900", position: "absolute", right: "0px", top: "67px" }}>+</div>
                        </div>
                        <div className="slider-ticks">
                        {[50, 60, 70, 80, 90, 100].map(i => (
                            <span key={i}>{i}%</span>
                        ))}
                        </div>
                    </div>
                    </WidgetWrapper> 
                     
                </Modal>


                <Modal className='radius-popup'
                    show={ShowRadiusModal} title='Radius Controller'
                    onOpen={() => { }}
                    onClose={() => setshowRadiusModal(false)}
                >  
                <div className="radius-box">  
                        
                    <FormField inline className="showcase-input"> 
                        <Select
                          selected={selected}
                          options={streetLightDataprobtype.map(item => ({ label: item.name, value: item.name }))}
                          onChange={(value) => handleSelectedChange(value)}
                          placeholder=" Region "
                        />
                       
                        <Select
                          selected={selected1}
                          options={getSecondSelectOptions()}
                          onChange={(value) => setSelected1(value)}
                          placeholder=" Places "  
                        />  
                        
                        <SearchBox
                              value={inputValue !== null ? inputValue.toString() : ''}
                              onChange={handleRadiusValue}
                              position="left"
                              placeholder="Radius"
                            /> 

                        <Button className='refresh-btn' title="Submit" onClick={() => {}} >Submit</Button>

                      </FormField>  
                    </div>  
                </Modal> 
        </div>  
    );
};

export default Gear_Widget;
 





















 
 

// import React, { useState, useEffect, useRef } from "react";
// import { WidgetWrapper, TitleBar , DropDownButton, Modal, FormField, Select, SearchBox , Button, Tooltip} from "uxp/components";
// import { IContextProvider } from "../uxp";
// import { ResponsivePie } from "@nivo/pie";
// import { EventsEnum } from "../index";

 
// interface IgearDetails {
//     uxpContext: IContextProvider;
//     sgDensity?: number;
//   } 

// const Gear_Widget: React.FunctionComponent<IgearDetails> = (props:any) => {
//     const [ShowSGModal, setshowSGModal] = useState(false); 
//     const [ShowRadiusModal, setshowRadiusModal] = useState(false);  

//     // Start SG Density Controller //

//   const { uxpContext, sgDensity } = props;
    
//   const [currentHour, setCurrentHour] = useState(12);  
//   const [value, setValue] = useState(sgDensity || 100);

//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const now = new Date();
//     const initialHour = now.getHours() + now.getMinutes() / 60;
//     setCurrentHour(initialHour); 
//   }, []);

//   const changeFormatTime = (value: number) => {
//     const hours = Math.floor(value) % 24;
//     const formattedHours = String(hours).padStart(2, "0");
//     const minutes = Math.round((value % 1) * 60);
//     const formattedMinutes = String(minutes).padStart(2, "0"); 
//     return `${formattedHours}:${formattedMinutes}`;
//   };
  
//   const calculateGradientPercentage = () => {
//     const min = 50;
//     const max = 100;
//     const percentage = ((value - min) / (max - min)) * 100; 
//     return percentage;
//   }; 

//   const handleSliderChange = (e: any) => {
//     const newValue = parseInt(e.target.value);
//     setValue(newValue); 
//     uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, {
//         percentage: newValue,
//     });
//     inputRef.current?.blur();
//     console.log("Event Triggered: ", EventsEnum.SetSGGridDensity, { percentage: newValue });
// };
 
//   // End SG Density Controller // 

//   // Start Refresh Controller // 
//   const handleRefresh = () => {
//     uxpContext.eventHandler?.(EventsEnum.UpdateIOTAssetData, {});
//   }; 
//   // End Refresh Controller  //  

//     // Start Radius Controller // 

//     //let [selected, setSelected] = useState<string | null>("StreetLight");
//     let [selected, setSelected] = useState<string | null>(null);
//     let [selected1, setSelected1] = useState<string | null>(null);
//     let [inputValue, setInputValue] = useState<number | null>(null);


//   const streetLightDataprobtype = [
//     {
//       id: '1',
//       name: 'Region',
//       value: ["Mosque","Prayer Room"]
//     },
//     {
//       id: '2',
//       name: 'Transportation',
//       value: ["Bus stop", "Metro", "Railway Stn.", "Taxi Stand","Airport", "Car Rental"]
//     },
//     {
//       id: '3',
//       name: 'Public Services',
//       value: ["Hospital", "Police Stn.", "Fire dept.", "Ambulance","Clinic","Pharmacy","Muncipal Ofc.","Immigration Office", "Charity"]
//     },
//     {
//       id: '4',
//       name: 'Food & Beverage',
//       value: ["Restaurant","Coffee Shop", "Grocery"]
//     },
//     {
//       id: '5',
//       name: 'Accommodation',
//       value: ["Hotel","Camp Site"]
//     },
//     {
//       id: '6',
//       name: 'Financial Services',
//       value: ["ATM","Bank", "Money exch."]
//     },
//     {
//       id: '7',
//       name: 'Retail & Markets',
//       value: ["Market","Shopping Mall"]
//     },
//     {
//       id: '8',
//       name: 'Emergency Services',
//       value: ["SOS", "Help Desk", "Tamper Detection","Call Box", "Flood Alert", "Fire"]
//     },
//     {
//       id: '9',
//       name: 'Utility & Infrastructure',
//       value: ["Elec. Meter", "Gas Meter", "Water Meter","EV Charging","Pump","Rcyl.Plant"]
//     },
//     {
//       id: '10',
//       name: 'Environmental Monitoring',
//       value: ["Sound Sensor", "Traffic Camera","AQI Sensor"]
//     },
//     {
//       id: '11',
//       name: 'Leisure & Recreation',
//       value: ["Parks", "Tourist Spot","Hiking trail"]
//     },
//     {
//       id: '12',
//       name: 'Miscellaneous',
//       value: ["Parking Area", "Public Toilet", "Public WiFi", "Crowd","Drone", "Embassy", "Laundry", "Barber Shop", "Farm", "University", "Dump Truck", "Waste Bin", "Auto.Workshop", "Factory", "Speed Radar"]
//     },
//     {
//       id: '13',
//       name: 'Pilgrimage and Cultural Sites',
//       value: ["Histr. Mosque", "Museum", "Histr.Place", "Exhibition"]
//     }
//   ]; 

  
//   const handleSelectedChange = (value: string) => {
//     setSelected(value);
//     setSelected1(null);  
//   };

//   const getSecondSelectOptions = () => {
//     if (!selected) return [];

//     const selectedItem = streetLightDataprobtype.find(item => item.name === selected);
//     return selectedItem ? selectedItem.value.map(val => ({ label: val, value: val })) : [];
//   };  

//   const handleRadiusValue = (newValue:any) => {  
//     const numberValue = Number(newValue);
//     if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 2000 || newValue === '') {
//       setInputValue(newValue === '' ? null : numberValue);
//     } 
//   };

//   // End Radius Controller  //

//     return (

//         <div className="gear_section">  
//                 <div className="gear-cont">
//                     <DropDownButton className="gear-dropdown"
//                         content={() => <div className="gear-dropdown-cont">  
//                             <ul>
//                                 {/* <li className="sg-icon"><a title="SG Controll" onClick={() => setshowSGModal(true)}></a></li> */}

//                                 <li className="sg-icon">  
//                                     <Tooltip content={() => <span className="tooltip-cont">SG Control</span>} position="left"> 
//                                         <a className="btn showcase" onClick={() => setshowSGModal(true)}></a> 
//                                     </Tooltip>
//                                 </li>

//                                 <li className="radius-icon"> 
//                                     <Tooltip content={() => <span className="tooltip-cont">Radius Control</span>} position="left"> 
//                                         <a className="btn showcase" onClick={() => setshowRadiusModal(true)}></a> 
//                                     </Tooltip>
//                                 </li>

//                                 <li className="refresh-icon">  
//                                     <Tooltip content={() => <span className="tooltip-cont">Refresh</span>} position="left"> 
//                                         <a className="btn showcase" onClick={handleRefresh}></a> 
//                                     </Tooltip>
//                                 </li>

//                                 {/* <li className="radius-icon"><a title="Radius Controll" onClick={() => setshowRadiusModal(true)}></a></li>
//                                 <li className="refresh-icon"><a title="Refresh" onClick={handleRefresh}></a></li> */}
//                             </ul>
//                         </div>}
//                           position="left"
//                        // showOnHover
//                     > 
//                         <span className="gear-icon btn showcase"></span>  
//                     </DropDownButton> 
//                </div>  
 

//                <Modal className='sg-popup'
//                     show={ShowSGModal} title='SG Density Controller'
//                     onOpen={() => { }}
//                     onClose={() => setshowSGModal(false)}
//                 > 

//                 <WidgetWrapper className="smart-city_box sg_density-box"> 
//                     <div className="sg_density-widget" style={{height:"70px"}}>
//                         <div className="timer-slider" style={{ flexDirection: "row" }}>
//                         <div className="minus" style={{ width: "20px", color: "white", fontSize: "20px", fontWeight: "900", position: "absolute", left: "0px", top: "67px" }}>-</div>
//                         <input
//                             ref={inputRef}
//                             type="range"
//                             className="timer-range"
//                             min={50}
//                             max={100}
//                             step={10}
//                             list="steplist"
//                             value={value}
//                             onChange={handleSliderChange}
//                             style={{
//                             background: `linear-gradient(to right, rgb(9 230 152) 0%, #023d28 ${calculateGradientPercentage()}%, #fff ${calculateGradientPercentage()}%, #ddd 100%)`,
//                             }}
//                         />
//                         <div className="plus" style={{ width: "20px", color: "white", fontSize: "18px", fontWeight: "900", position: "absolute", right: "0px", top: "67px" }}>+</div>
//                         </div>
//                         <div className="slider-ticks">
//                         {[50, 60, 70, 80, 90, 100].map(i => (
//                             <span key={i}>{i}%</span>
//                         ))}
//                         </div>
//                     </div>
//                     </WidgetWrapper> 
                     
//                 </Modal>


//                 <Modal className='radius-popup'
//                     show={ShowRadiusModal} title='Radius Controller'
//                     onOpen={() => { }}
//                     onClose={() => setshowRadiusModal(false)}
//                 >  
//                 <div className="radius-box">  
                        
//                     <FormField inline className="showcase-input"> 
//                         <Select
//                           selected={selected}
//                           options={streetLightDataprobtype.map(item => ({ label: item.name, value: item.name }))}
//                           onChange={(value) => handleSelectedChange(value)}
//                           placeholder=" Region "
//                         />
                       
//                         <Select
//                           selected={selected1}
//                           options={getSecondSelectOptions()}
//                           onChange={(value) => setSelected1(value)}
//                           placeholder=" Places "  
//                         />  
                        
//                         <SearchBox
//                               value={inputValue !== null ? inputValue.toString() : ''}
//                               onChange={handleRadiusValue}
//                               position="left"
//                               placeholder="Radius"
//                             /> 

//                         <Button className='refresh-btn' title="Submit" onClick={() => {}} >Submit</Button>

//                       </FormField>  
//                     </div>  
//                 </Modal> 
//         </div>  
//     );
// };

// export default Gear_Widget;
 