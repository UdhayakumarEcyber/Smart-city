import React, { useState, useEffect } from 'react';
import { WidgetWrapper, TitleBar, FormField, MultiSelect } from "uxp/components";
import { IContextProvider } from '../uxp';
import { AutoSizer } from 'react-virtualized';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId: string,
    locationkey: string
}

interface ISliderProps {
    cameras: string[];
}

const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
    let { uxpContext, locationkey } = props;

    const initialLocationOptions = [
        { label: "Al Haram Al Sharif", value: "op-1" },
        { label: "First Ring Road", value: "op-2" },
        { label: "An Naqa Dist", value: "op-3" },
        { label: "Al Mankhah Dist", value: "op-4" },
        { label: "Badhaah Dist", value: "op-5" },
        { label: "Bani Khidrah Dist", value: "op-6" },
    ];

    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
    const [cameraOptions, setCameraOptions] = useState<{ label: string, value: string }[]>([]);
    const [filteredCameras, setFilteredCameras] = useState<{ label: string, value: string }[]>([]);

    const locationToCamerasMap: { [key: string]: string[] } = {
        "op-1": [
            "sunell IPS56/30CDR/ZSD12/21 (10.11.1.156) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.151) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.153) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.154) - Camera 1"
        ],
        "op-2": [
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.155) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.157) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.158) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.159) - Camera 1",
            "Sunell IPS57/30CDR/ZSD12/23 (10.11.1.160) - Camera 1"
        ],
        "op-3": [
            "Avigilon 4.0C-H5A-BO1-IR (10.11.1.118) - Camera 1",
            "Avigilon 4.0C-H5A-BO1-IR (10.11.1.131) - Camera 1",
            "Avigilon 4.0C-H5A-BO1-IR (10.11.1.132) - Camera 1",
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.106) - Camera 1",
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.110) - Camera 1"
        ],
        "op-4": [
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.111) - Camera 1",
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.121) - Camera 1",
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.125) - Camera 1",
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.133) - Camera 1"
        ],
        "op-5": [
            "Avigilon 8.0C-H5A-BO1-IR (10.11.1.134) - Camera 1",
            "Geovision GV-FD3400 (10.0.32.12) - Camera 1",
            "Geovision GV-MFD320 (10.0.32.13) - Camera 1",
            "Geovision GV-MFD320 (10.0.32.14) - Camera 1"
        ],
        "op-6": [
            "Arecont Single Camera (10.11.1.30) - Camera 1",
            "Arecont Single Camera (10.11.1.22) - Camera 2",
            "Arecont Single Camera (10.11.1.23) - Camera 3",
            "Arecont Single Camera (10.11.1.24) - Camera 4",
            "Arecont Single Camera (10.11.1.26) - Camera 6",
            "Arecont Single Camera (10.11.1.27) - Camera 7",
            "Arecont Single Camera (10.11.1.28) - Camera 8",
            "Arecont Single Camera (10.11.1.29) - Camera 9"
        ]
    };

    async function getIncidentData() {
        let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });

        const transformedData = data.cameras.map((camera: string) => ({
            label: camera,
            value: camera
        }));
        setCameraOptions(transformedData);
        setFilteredCameras(transformedData);
        setSelectedCameras(data.cameras); // Select all cameras initially
    }

    useEffect(() => {
        getIncidentData();
    }, []);

    const handleLocationChange = (selected: string[]) => {
        setSelectedLocation(selected);

        if (selected.length === 0) {
            setFilteredCameras(cameraOptions);
        } else {
            const selectedCameraNames = selected.flatMap(loc => locationToCamerasMap[loc]);
            setFilteredCameras(cameraOptions.filter(camera => selectedCameraNames.includes(camera.value)));
        }
    };

    const handleCameraChange = (selected: string[]) => {
        setSelectedCameras(selected);
    };

    const Slider: React.FC<ISliderProps> = ({ cameras }) => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const slidesToShow = 9;
        const totalSlides = Math.ceil(cameras.length / slidesToShow);

        const showSlide = (index: number) => {
            if (index >= totalSlides) {
                setCurrentSlide(0);
            } else if (index < 0) {
                setCurrentSlide(totalSlides - 1);
            } else {
                setCurrentSlide(index);
            }
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        const handleForwardClick = () => {
            if (currentSlide === totalSlides - 1) {
                handleForwardEndClick();
            } else {
                nextSlide();
            }
        };

        const handleBackwardClick = () => {
            if (currentSlide === 0) {
                handleBackwardEndClick();
            } else {
                prevSlide();
            }
        };

        const handleForwardEndClick = () => {
            console.log("Reached the end of the forward slides");
            setCurrentSlide(0);
        };

        const handleBackwardEndClick = () => {
            console.log("Reached the end of the backward slides");
            setCurrentSlide(totalSlides - 1);
        };

        return (
            <div className="cctv-slider">
                <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                        <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
                            {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => (
                                <div className="child8PAXAuto" key={index}>
                                    <AutoSizer className='iframe-resize'>
                                        {({ height, width }) => {
                                            let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + camera;
                                            return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
                                        }}
                                    </AutoSizer>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
                <button className="next" onClick={handleForwardClick}>&#8250;</button>
                <button className="prev-end" onClick={handleForwardEndClick}>&#171;</button>
                <button className="next-end" onClick={handleBackwardEndClick}>&#187;</button>
            </div>
        );
    };

    return (
        <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
            <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
                <div className="top_tabs" style={{ width: '60%' }}>
                    <FormField> 
                        <MultiSelect
                            selected={selectedLocation}
                            options={initialLocationOptions}
                            onChange={handleLocationChange}
                            placeholder='Select Location'
                        />
               
                        <MultiSelect
                            selected={selectedCameras}
                            options={filteredCameras}
                            onChange={handleCameraChange}
                            placeholder='Select Camera'
                        />
                    </FormField>
                </div>
            </TitleBar>
            <div className="smart-city-content">
                {selectedCameras.length > 0 && <Slider cameras={selectedCameras} />}
            </div>
            <style>
                {`
                .action-section {
                    display: inline-block;
                    width: 40%;
                }
                .showcase-input {
                    width: 100% !important;
                    padding: 0;
                }
                .smart-city_box .uxp-form-select {
                    width: 46%;
                    min-width: 46%;
                }
                .cctv-slider {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                }
                .cctv-slides {
                    display: flex;
                    transition: transform 0.5s ease-in-out;
                    height: 94vh;
                }
                .cctv-slide {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    box-sizing: border-box;
                    width: 100%;
                    flex: 0 0 100%;
                }
                .cctv-slide .child8PAXAuto {
                    flex: 0 0 29%;
                    margin: 0.5em;
                    box-sizing: border-box;
                }
                .prev, .next, .prev-end, .next-end {
                    position: absolute;
                    top: 45%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 2em;
                    padding: 10px;
                    cursor: pointer;
                    border-radius: 50%;
                    user-select: none;
                }
                .prev, .next{ 
                    padding: 8px 17px 10px 17px; 
                }
                .prev-end, .next-end { 
                    padding: 9px 17px 11px 17px; 
                } 
                .prev {
                     left: 3%;
                } 
                .next {
                    right: 3%;
                }  
                .prev-end {
                   left: 0.7em;
                } 
                .next-end {
                   right: 0.7em;
                }

                .parent8PAXAuto {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }

                .child8PAXAuto {
                    width: 100%;
                    height: 100%;
                }

                .iframe-resize {
                    width: 100%;
                    height: 100%;
                }
                `}
            </style>
        </WidgetWrapper>
    );
}

export default IncidentManagement;


















  // import React, { useState, useEffect } from 'react'; 
// import {
//     WidgetWrapper,
//     TitleBar,
//     FormField,
//     MultiSelect,
// } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// interface ISliderProps {
//     cameras: string[];
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     // Initial location options
//     const initialLocationOptions = [
//         { label: "Al Haram Al Sharif", value: "op-1" },
//         { label: "First Ring Road", value: "op-2" },
//         { label: "An Naqa Dist", value: "op-3" },
//         { label: "Al Mankhah Dist", value: "op-4" },
//         { label: "Badhaah Dist", value: "op-5" },
//         { label: "Bani Khidrah Dist", value: "op-6" },
//     ];

//     // State for selected location and cameras
//     const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
//     const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
//     const [cameraOptions, setCameraOptions] = useState<{ label: string, value: string }[]>([]);
//     const [filteredCameras, setFilteredCameras] = useState<{ label: string, value: string }[]>([]);

//     // Fetch camera data from the API
//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });

//         // Transform the camera data into options
//         const transformedData = data.cameras.map((camera: string) => ({
//             label: camera,
//             value: camera // Use camera as the value for better identification
//         }));
//         setCameraOptions(transformedData);
//         setFilteredCameras(transformedData); // Show all cameras initially
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []);

//     // Handle location change
//     const handleLocationChange = (selected: string[]) => {
//         setSelectedLocation(selected);

//         // Example filtering logic, update based on your specific mapping
//         const locationToCamerasMap: { [key: string]: number[] } = {
//             "op-1": [0, 1, 2, 3],
//             "op-2": [4, 5, 6, 7, 8],
//             "op-3": [9, 10, 11, 12, 13],
//             "op-4": [14, 15, 16, 17],
//             "op-5": [18, 19, 20, 21],
//             "op-6": [22, 23, 24, 25, 26, 27, 28, 29],

 
            
//         };

//         if (selected.length === 0) {
//             setFilteredCameras(cameraOptions); // Show all cameras if no location is selected
//         } else {
//             const selectedCameraIndices = selected.flatMap(loc => locationToCamerasMap[loc]);
//             setFilteredCameras(cameraOptions.filter((_, index) => selectedCameraIndices.includes(index)));
//         }
//     };

//     // Handle camera change
//     const handleCameraChange = (selected: string[]) => {
//         setSelectedCameras(selected);
//     };

//     // Slider component
//     const Slider: React.FC<ISliderProps> = ({ cameras }) => {
//         const [currentSlide, setCurrentSlide] = useState(0);
//         const slidesToShow = 9;
//         const totalSlides = Math.ceil(cameras.length / slidesToShow);

//         const showSlide = (index: number) => {
//             if (index >= totalSlides) {
//                 setCurrentSlide(0);
//             } else if (index < 0) {
//                 setCurrentSlide(totalSlides - 1);
//             } else {
//                 setCurrentSlide(index);
//             }
//         };

//         const nextSlide = () => {
//             showSlide(currentSlide + 1);
//         };

//         const prevSlide = () => {
//             showSlide(currentSlide - 1);
//         };

//         const handleForwardClick = () => {
//             if (currentSlide === totalSlides - 1) {
//                 handleForwardEndClick();
//             } else {
//                 nextSlide();
//             }
//         };

//         const handleBackwardClick = () => {
//             if (currentSlide === 0) {
//                 handleBackwardEndClick();
//             } else {
//                 prevSlide();
//             }
//         };

//         const handleForwardEndClick = () => {
//             console.log("Reached the end of the forward slides");
//             setCurrentSlide(0);
//         };

//         const handleBackwardEndClick = () => {
//             console.log("Reached the end of the backward slides");
//             setCurrentSlide(totalSlides - 1);
//         };

//         return (
//             <div className="cctv-slider">
//                 <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//                     {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                         <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
//                             {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => (
//                                 <div className="child8PAXAuto" key={index}>
//                                     <AutoSizer className='iframe-resize'>
//                                         {({ height, width }) => {
//                                             let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + camera;
//                                             return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                         }}
//                                     </AutoSizer>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
//                 <button className="next" onClick={handleForwardClick}>&#8250;</button>
//                 <button className="prev-end" onClick={handleBackwardEndClick}>&#171;</button>
//                 <button className="next-end" onClick={handleForwardEndClick}>&#187;</button>
//             </div>
//         );
//     };

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
//                 <div className="top_tabs" style={{ width: '60%' }}>
//                     <FormField> 
//                         <MultiSelect
//                             selected={selectedLocation}
//                             options={initialLocationOptions}
//                             onChange={handleLocationChange}
//                         />
               
//                         <MultiSelect
//                             selected={selectedCameras}
//                             options={filteredCameras}
//                             onChange={handleCameraChange}
//                         />
//                     </FormField>
//                 </div>
//             </TitleBar>
//             <div className="smart-city-content">
//                 {selectedCameras.length > 0 && <Slider cameras={selectedCameras} />}
//             </div>
//             <style>
//                 {`
//                 .action-section {
//                     display: inline-block;
//                     width: 40%;
//                 }
//                 .showcase-input {
//                     width: 100% !important;
//                     padding: 0;
//                 }
//                 .smart-city_box .uxp-form-select {
//                     width: 46%;
//                     min-width: 46%;
//                 }
//                 .cctv-slider {
//                     position: relative;
//                     width: 100%;
//                     overflow: hidden;
//                 }
//                 .cctv-slides {
//                     display: flex;
//                     transition: transform 0.5s ease-in-out;
//                     height: 94vh;
//                 }
//                 .cctv-slide {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: space-around;
//                     box-sizing: border-box;
//                     width: 100%;
//                     flex: 0 0 100%;
//                 }
//                 .cctv-slide .child8PAXAuto {
//                     flex: 0 0 29%;
//                     margin: 0.5em;
//                     box-sizing: border-box;
//                 }
//                 .prev, .next, .prev-end, .next-end {
//                     position: absolute;
//                     top: 45%;
//                     transform: translateY(-50%);
//                     background-color: rgba(0, 0, 0, 0.5);
//                     border: none;
//                     color: white;
//                     font-size: 2em;
//                     padding: 10px;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     user-select: none;
//                 }
//                 .prev, .next{ 
//                     padding: 8px 17px 10px 17px; 
//                 }
//                 .prev-end, .next-end { 
//                     padding: 9px 17px 11px 17px; 
//                 } 
//                 .prev {
//                      left: 3%;
//                 } 
//                 .next {
//                     right: 3%;
//                 }  
//                 .prev-end {
//                    left: 0.7em;
//                 } 
//                 .next-end {
//                    right: 0.7em;
//                 }

//                 .parent8PAXAuto {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                 }
//                 `}
//             </style>
//         </WidgetWrapper>
//     );
// }

// export default IncidentManagement;















// import React, { useState, useEffect } from 'react'; 

// import {
//     WidgetWrapper,
//     TitleBar,
//     FormField,
//     MultiSelect,  // Import MultiSelect instead of Select
// } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// interface ISliderProps {
//     cameras: string[];
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     let [selected, setSelected] = useState<string[]>([]);  // MultiSelect requires an array of selected values
//     let [alertType, setAlertType] = useState<string[]>([]); // Same for alertType

//     const [cameras, setCamerasData] = useState<string[]>([]);
//     const [cameraOptions, setCameraOptions] = useState<{ label: string, value: string }[]>([]);

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });
//         setCamerasData(data.cameras); 

//         // Transform the camera data into options
//         const transformedData = data.cameras.map((camera: any, index: number) => ({
//             label: camera,
//             value: `op-${index + 1}`
//         }));
//         setCameraOptions(transformedData);
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []);

//     const Slider: React.FC<ISliderProps> = ({ cameras }) => {
//         const [currentSlide, setCurrentSlide] = useState(0);
//         const slidesToShow = 9;
//         const totalSlides = Math.ceil(cameras.length / slidesToShow);

//         const showSlide = (index: number) => {
//             if (index >= totalSlides) {
//                 setCurrentSlide(0);
//             } else if (index < 0) {
//                 setCurrentSlide(totalSlides - 1);
//             } else {
//                 setCurrentSlide(index);
//             }
//         };

//         const nextSlide = () => {
//             showSlide(currentSlide + 1);
//         };

//         const prevSlide = () => {
//             showSlide(currentSlide - 1);
//         };

//         const handleForwardClick = () => {
//             if (currentSlide === totalSlides - 1) {
//                 handleForwardEndClick();
//             } else {
//                 nextSlide();
//             }
//         };

//         const handleBackwardClick = () => {
//             if (currentSlide === 0) {
//                 handleBackwardEndClick();
//             } else {
//                 prevSlide();
//             }
//         };

//         const handleForwardEndClick = () => {
//             console.log("Reached the end of the forward slides");
//             setCurrentSlide(0);
//         };

//         const handleBackwardEndClick = () => {
//             console.log("Reached the end of the backward slides");
//             setCurrentSlide(totalSlides - 1);
//         };

//         return (
//             <div className="cctv-slider">
//                 <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//                     {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                         <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
//                             {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => (
//                                 <div className="child8PAXAuto" key={index}>
//                                     <AutoSizer className='iframe-resize'>
//                                         {({ height, width }) => {
//                                             let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + camera;
//                                             return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                         }}
//                                     </AutoSizer>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
//                 <button className="next" onClick={handleForwardClick}>&#8250;</button>
//                 <button className="prev-end" onClick={handleForwardEndClick}>&#171;</button>
//                 <button className="next-end" onClick={handleBackwardEndClick}>&#187;</button>
//             </div>
//         );
//     };

 

      

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
//                 <div className="top_tabs" style={{ width: '55%' }}>
//                    <FormField inline className="showcase-input">
                       
//                          <MultiSelect
//                             selected={selected}
//                             options={[
//                                 { label: "Al Haram Al Sharif", value: "op-1" },
//                                 { label: "First Ring Road", value: "op-2" },
//                                 { label: "An Naqa Dist", value: "op-3" },
//                                 { label: "Al Mankhah Dist", value: "op-4" },
//                                 { label: "Badhaah Dist", value: "op-5" },
//                                 { label: "Bani Khidrah Dist", value: "op-6" },
//                             ]}
//                             onChange={(value) => { setSelected(value) }}
//                             placeholder="Select Location"
//                             isValid={!!selected}
//                             hideClearButton  
//                             hideDoneButton
//                         />  
 


//                         <MultiSelect
//                             selected={alertType}
//                             options={cameraOptions}
//                             onChange={(value) => { setAlertType(value) }}
//                             placeholder="Select Camera"
//                             isValid={!!alertType}
//                             hideClearButton  
//                             hideDoneButton
//                         />
//                     </FormField>  

//                 </div>
//             </TitleBar>
//             <div className="smart-city-content">
//                 {cameras.length > 0 && <Slider cameras={cameras} />}
//             </div>
//             <style>
//                 {`
//                 .action-section {
//                     display: inline-block;
//                     width: 40%;
//                 }
//                 .showcase-input {
//                     width: 100% !important;
//                     padding: 0;
//                 }
//                 .smart-city_box .uxp-form-select {
//                     width: 46%;
//                     min-width: 46%;
//                 }
//                 .cctv-slider {
//                     position: relative;
//                     width: 100%;
//                     overflow: hidden;
//                 }
//                 .cctv-slides {
//                     display: flex;
//                     transition: transform 0.5s ease-in-out;
//                     height: 94vh;
//                 }
//                 .cctv-slide {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: space-around;
//                     box-sizing: border-box;
//                     width: 100%;
//                     flex: 0 0 100%;
//                 }
//                 .cctv-slide .child8PAXAuto {
//                     flex: 0 0 29%;
//                     margin: 0.5em;
//                     box-sizing: border-box;
//                 }
//                 .prev, .next, .prev-end, .next-end {
//                     position: absolute;
//                     top: 45%;
//                     transform: translateY(-50%);
//                     background-color: rgba(0, 0, 0, 0.5);
//                     border: none;
//                     color: white;
//                     font-size: 2em;
//                     padding: 10px;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     user-select: none;
//                 }
//                 .prev, .next{ 
//                     padding: 8px 17px 10px 17px; 
//                 }
//                 .prev-end, .next-end { 
//                     padding: 9px 17px 11px 17px; 
//                 } 
//                 .prev {
//                      left: 3%;
//                 } 
//                 .next {
//                     right: 3%;
//                 }  
//                 .prev-end {
//                    left: 0.7em;
//                 } 
//                 .next-end {
//                    right: 0.7em;
//                 }

//                 .parent8PAXAuto {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100%;
//                 }

//                 .child8PAXAuto {
//                     width: 100%;
//                     height: 100%;
//                 }

//                 .iframe-resize {
//                     width: 100%;
//                     height: 100%;
//                 }
//                 `}
//             </style>
//         </WidgetWrapper>
//     );
// };

// export default IncidentManagement;















// import React, { useState, useEffect } from 'react'; 

// import {
//     WidgetWrapper,
//     TitleBar,
//     FormField,
//     Select,
//   } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// interface ISliderProps {
//     cameras: string[];
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     let [selected, setSelected] = useState<string | null>("op-1");
//     let [alertType, setAlertType] = useState<string | null>("op-1");

//     const [cameras, setCamerasData] = useState<string[]>([]);
//     const [cameraOptions, setCameraOptions] = useState<{ label: string, value: string }[]>([]);

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });
//         setCamerasData(data.cameras); 

//         // Transform the camera data into options
//         const transformedData = data.cameras.map((camera: any, index: number) => ({
//             label: camera,
//             value: `op-${index + 1}`
//         }));
//         setCameraOptions(transformedData);
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []);

//     const Slider: React.FC<ISliderProps> = ({ cameras }) => {
//         const [currentSlide, setCurrentSlide] = useState(0);
//         const slidesToShow = 9;
//         const totalSlides = Math.ceil(cameras.length / slidesToShow);

//         const showSlide = (index: number) => {
//             if (index >= totalSlides) {
//                 setCurrentSlide(0);
//             } else if (index < 0) {
//                 setCurrentSlide(totalSlides - 1);
//             } else {
//                 setCurrentSlide(index);
//             }
//         };

//         const nextSlide = () => {
//             showSlide(currentSlide + 1);
//         };

//         const prevSlide = () => {
//             showSlide(currentSlide - 1);
//         };

//         const handleForwardClick = () => {
//             if (currentSlide === totalSlides - 1) {
//                 handleForwardEndClick();
//             } else {
//                 nextSlide();
//             }
//         };

//         const handleBackwardClick = () => {
//             if (currentSlide === 0) {
//                 handleBackwardEndClick();
//             } else {
//                 prevSlide();
//             }
//         };

//         const handleForwardEndClick = () => {
//             console.log("Reached the end of the forward slides");
//             setCurrentSlide(0);
//         };

//         const handleBackwardEndClick = () => {
//             console.log("Reached the end of the backward slides");
//             setCurrentSlide(totalSlides - 1);
//         };

//         return (
//             <div className="cctv-slider">
//                 <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//                     {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                         <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
//                             {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => (
//                                 <div className="child8PAXAuto" key={index}>
//                                     <AutoSizer className='iframe-resize'>
//                                         {({ height, width }) => {
//                                             let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + camera;
//                                             return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                         }}
//                                     </AutoSizer>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
//                 <button className="next" onClick={handleForwardClick}>&#8250;</button>
//                 <button className="prev-end" onClick={handleForwardEndClick}>&#171;</button>
//                 <button className="next-end" onClick={handleBackwardEndClick}>&#187;</button>
//             </div>
//         );
//     };

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
//                 <div className="top_tabs" style={{ width: '40%' }}>
//                    <FormField inline className="showcase-input">
//                         <Select
//                             selected={selected}
//                             options={[
//                                 { label: "Al Haram Al Sharif", value: "op-1" },
//                                 { label: "First Ring Road", value: "op-2" },
//                                 { label: "An Naqa Dist", value: "op-3" },
//                                 { label: "Al Mankhah Dist", value: "op-4" },
//                                 { label: "Badhaah Dist", value: "op-5" },
//                                 { label: "Bani Khidrah Dist", value: "op-6" },
//                             ]}
//                             onChange={(value) => { setSelected(value) }}
//                             placeholder=" -- select --"
//                         />

//                         <Select
//                             selected={alertType}
//                             options={cameraOptions}
//                             onChange={(value) => { setAlertType(value) }}
//                             placeholder=" -- select --"
//                         />
//                     </FormField>  

//                 </div>
//             </TitleBar>
//             <div className="smart-city-content">
//                 {cameras.length > 0 && <Slider cameras={cameras} />}
//             </div>
//             <style>
//                 {`
//                 .action-section {
//                     display: inline-block;
//                     width: 40%;
//                 }
//                 .showcase-input {
//                     width: 100% !important;
//                     padding: 0;
//                 }
//                 .smart-city_box .uxp-form-select {
//                     width: 46%;
//                     min-width: 46%;
//                 }
//                 .cctv-slider {
//                     position: relative;
//                     width: 100%;
//                     overflow: hidden;
//                 }
//                 .cctv-slides {
//                     display: flex;
//                     transition: transform 0.5s ease-in-out;
//                     height: 94vh;
//                 }
//                 .cctv-slide {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: space-around;
//                     box-sizing: border-box;
//                     width: 100%;
//                     flex: 0 0 100%;
//                 }
//                 .cctv-slide .child8PAXAuto {
//                     flex: 0 0 29%;
//                     margin: 0.5em;
//                     box-sizing: border-box;
//                 }
//                 .prev, .next, .prev-end, .next-end {
//                     position: absolute;
//                     top: 45%;
//                     transform: translateY(-50%);
//                     background-color: rgba(0, 0, 0, 0.5);
//                     border: none;
//                     color: white;
//                     font-size: 2em;
//                     padding: 10px;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     user-select: none;
//                 }
//                 .prev, .next{ 
//                     padding: 8px 17px 10px 17px; 
//                 }
//                 .prev-end, .next-end { 
//                     padding: 9px 17px 11px 17px; 
//                 } 
//                 .prev {
//                      left: 3%;
//                 } 
//                 .next {
//                     right: 3%;
//                 }  
//                 .prev-end {
//                    left: 0.7em;
//                 } 
//                 .next-end {
//                    right: 0.7em;
//                 }

//                 .parent8PAXAuto {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100%;
//                 }

//                 .child8PAXAuto {
//                     width: 100%;
//                     height: 100%;
//                 }

//                 .iframe-resize {
//                     width: 100%;
//                     height: 100%;
//                 }
//                 `}
//             </style>
//         </WidgetWrapper>
//     );
// };

// export default IncidentManagement;

























// import React, { useState, useEffect } from 'react'; 

// import {
//     WidgetWrapper,
//     SearchBox,
//     TitleBar,
//     FormField,
//     Label,
//     Select,
//     DatePicker,
//     ToggleFilter,
//   } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// interface ISliderProps {
//     cameras: string[];
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [inputValue, setInputValue] = React.useState<string | null>("Work Order");
//     let [inputValue1, setInputValue1] = React.useState<string | null>("Location"); 

//     const [cameras, setCamerasData] = useState<string[]>([]);

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });
//         setCamerasData(data.cameras); 
//         console.log('Hello', data);
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []); 

//     const Slider: React.FC<ISliderProps> = ({ cameras }) => {
//         const [currentSlide, setCurrentSlide] = useState(0);
        

//         const [isForwardEnd, setIsForwardEnd] = useState(false);
//         const [isBackwardEnd, setIsBackwardEnd] = useState(false);

//         const slidesToShow = 9;
//         const totalSlides = Math.ceil(cameras.length / slidesToShow);

//         const showSlide = (index: number) => {
//             if (index >= totalSlides) {
//                 setCurrentSlide(0);
//                 setIsForwardEnd(true);
//                 setIsBackwardEnd(false);
//             } else if (index < 0) {
//                 setCurrentSlide(totalSlides - 1);
//                 setIsBackwardEnd(true);
//                 setIsForwardEnd(false);
//             } else {
//                 setCurrentSlide(index);
//                 setIsForwardEnd(false);
//                 setIsBackwardEnd(false);
//             }
//         };

//         const nextSlide = () => {
//             showSlide(currentSlide + 1);
//         };

//         const prevSlide = () => {
//             showSlide(currentSlide - 1);
//         };

//         const handleForwardClick = () => {
//             if (currentSlide === totalSlides - 1) {
//                 handleForwardEndClick();
//             } else {
//                 nextSlide();
//             }
//         };

//         const handleBackwardClick = () => {
//             if (currentSlide === 0) {
//                 handleBackwardEndClick();
//             } else {
//                 prevSlide();
//             }
//         };

//         const handleForwardEndClick = () => {
//             console.log("Reached the end of the forward slides");
//             setIsForwardEnd(true);
//             setCurrentSlide(0);
//         };

//         const handleBackwardEndClick = () => {
//             console.log("Reached the end of the backward slides");
//             setIsBackwardEnd(true);
//             setCurrentSlide(totalSlides - 1);
//         };

//         return (
//             <div className="cctv-slider">
//                 <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//                     {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                         <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
//                             {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => {
//                                 // Extract the camera ID (IP address) using regex
//                                 //   const cameraIDMatch = camera.match(/\(([^)]+)\)/);
//                                 //   const cameraID = cameraIDMatch ? cameraIDMatch[1] : '';
//                                 return (
//                                     <div className="child8PAXAuto" key={index}>
//                                         <AutoSizer className='iframe-resize'>
//                                             {({ height, width }) => {
//                                                 let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + camera;
//                                                 return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                             }}
//                                         </AutoSizer>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
//                 <button className="next" onClick={handleForwardClick}>&#8250;</button>
//                 <button className="prev-end" onClick={handleForwardEndClick}>&#171;</button>
//                 <button className="next-end" onClick={handleBackwardEndClick}>&#187;</button>
//             </div>
//         );
//     };

    
   

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
                    
//             <div className="top_tabs" style={{width:'40%'}}>
                
//                 <FormField inline className="showcase-input" > 
//                     <Select
//                         selected={selected}
//                         options={[
//                             { label: "Al Haram Al Sharif", value: "op-1" },
//                             { label: "First Ring Road", value: "op-2" },
//                             { label: "An Naqa Dist", value: "op-3" },
//                             { label: "Al Mankhah Dist", value: "op-4" },
//                             { label: "Badhaah Dist", value: "op-5" },
//                             { label: "Bani Khidrah Dist", value: "op-6" },
//                         ]}
//                         onChange={(value) => { setSelected(value) }}
//                         placeholder=" -- select --"
//                     />

//                         <Select
//                             selected={alertType}
//                             options={cameraOptions}
//                             onChange={(value) => { setAlertType(value) }}
//                             placeholder=" -- select --"
//                         />
                      
//                 </FormField>
//           </div>  

//             </TitleBar>
//             <div className="smart-city-content">
//                 {cameras.length > 0 && <Slider cameras={cameras} />}
//             </div>
//             <style>
//                 {`
//                 .action-section {
//                     display: inline-block;
//                     width: 40%;
//                 }
//                 .showcase-input {
//                         width: 100% !important;
//                         padding:0;
//                     }
//                    .smart-city_box .uxp-form-select { 
//                         width: 46%;
//                         min-width: 46%;
//                     }
                        
//                 .cctv-slider {
//                     position: relative;
//                     width: 100%;
//                     overflow: hidden; 
//                 }

//                 .cctv-slides {
//                     display: flex;
//                     transition: transform 0.5s ease-in-out;
//                     height: 94vh;
//                 }

//                 .cctv-slide {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: space-around;
//                     box-sizing: border-box;
//                     width: 100%;
//                     flex: 0 0 100%;
//                 }

//                 .cctv-slide .child8PAXAuto {
//                     flex: 0 0 29%; /* 3 slides per row */
//                     margin: 0.5em;
//                     box-sizing: border-box;
//                 }

//                 .prev, .next, .prev-end, .next-end {
//                     position: absolute;
//                     top: 45%;
//                     transform: translateY(-50%);
//                     background-color: rgba(0, 0, 0, 0.5);
//                     border: none;
//                     color: white;
//                     font-size: 2em;
//                     padding: 10px;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     user-select: none;
//                 }
//                 .prev, .next{ 
//                     padding: 8px 17px 10px 17px; 
//                 }
//                 .prev-end, .next-end { 
//                     padding: 9px 17px 11px 17px; 
//                 } 
//                 .prev {
//                      left: 3%;
//                 } 
//                 .next {
//                     right: 3%;
//                 }  
//                 .prev-end {
//                    left: 0.7em;
//                 } 
//                 .next-end {
//                    right: 0.7em;
//                 }

//                 .parent8PAXAuto {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100%;
//                 }

//                 .child8PAXAuto {
//                     width: 100%;
//                     height: 100%;
//                 }

//                 .iframe-resize {
//                     width: 100%;
//                     height: 100%;
//                 }
//                 `}
//             </style>
//         </WidgetWrapper>
//     )
// };

// export default IncidentManagement;





























// import React, { useState, useEffect } from 'react'; 

// import {
//     WidgetWrapper,
//     SearchBox,
//     TitleBar,
//     FormField,
//     Label,
//     Select,
//     DatePicker,
//     ToggleFilter,
//   } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// interface ISliderProps {
//     cameras: string[];
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [inputValue, setInputValue] = React.useState<string | null>("Work Order");
//     let [inputValue1, setInputValue1] = React.useState<string | null>("Location"); 

//     const [cameras, setCamerasData] = useState<string[]>([]);

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });
//         setCamerasData(data.cameras); 
//         console.log('Hello', data);
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []); 

//     const Slider: React.FC<ISliderProps> = ({ cameras }) => {
//         const [currentSlide, setCurrentSlide] = useState(0);
        

//         const [isForwardEnd, setIsForwardEnd] = useState(false);
//         const [isBackwardEnd, setIsBackwardEnd] = useState(false);

//         const slidesToShow = 9;
//         const totalSlides = Math.ceil(cameras.length / slidesToShow);

//         const showSlide = (index: number) => {
//             if (index >= totalSlides) {
//                 setCurrentSlide(0);
//                 setIsForwardEnd(true);
//                 setIsBackwardEnd(false);
//             } else if (index < 0) {
//                 setCurrentSlide(totalSlides - 1);
//                 setIsBackwardEnd(true);
//                 setIsForwardEnd(false);
//             } else {
//                 setCurrentSlide(index);
//                 setIsForwardEnd(false);
//                 setIsBackwardEnd(false);
//             }
//         };

//         const nextSlide = () => {
//             showSlide(currentSlide + 1);
//         };

//         const prevSlide = () => {
//             showSlide(currentSlide - 1);
//         };

//         const handleForwardClick = () => {
//             if (currentSlide === totalSlides - 1) {
//                 handleForwardEndClick();
//             } else {
//                 nextSlide();
//             }
//         };

//         const handleBackwardClick = () => {
//             if (currentSlide === 0) {
//                 handleBackwardEndClick();
//             } else {
//                 prevSlide();
//             }
//         };

//         const handleForwardEndClick = () => {
//             console.log("Reached the end of the forward slides");
//             setIsForwardEnd(true);
//             setCurrentSlide(0);
//         };

//         const handleBackwardEndClick = () => {
//             console.log("Reached the end of the backward slides");
//             setIsBackwardEnd(true);
//             setCurrentSlide(totalSlides - 1);
//         };

//         return (
//             <div className="cctv-slider">
//                 <div className="cctv-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
//                     {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//                         <div className="cctv-slide parent8PAXAuto" key={slideIndex}>
//                             {cameras.slice(slideIndex * slidesToShow, (slideIndex + 1) * slidesToShow).map((camera, index) => {
//                                 // Extract the camera ID (IP address) using regex
//                                   const cameraIDMatch = camera.match(/\(([^)]+)\)/);
//                                   const cameraID = cameraIDMatch ? cameraIDMatch[1] : '';
//                                 return (
//                                     <div className="child8PAXAuto" key={index}>
//                                         <AutoSizer className='iframe-resize'>
//                                             {({ height, width }) => {
//                                                 let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + cameraID;
//                                                 return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                             }}
//                                         </AutoSizer>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ))}
//                 </div>
//                 <button className="prev" onClick={handleBackwardClick}>&#8249;</button>
//                 <button className="next" onClick={handleForwardClick}>&#8250;</button>
//                 <button className="prev-end" onClick={handleForwardEndClick}>&#171;</button>
//                 <button className="next-end" onClick={handleBackwardEndClick}>&#187;</button>
//             </div>
//         );
//     };

    
   

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'>
                    
//             <div className="top_tabs" style={{width:'40%'}}>
                
//                 <FormField inline className="showcase-input" > 
//                     <Select
//                         selected={selected}
//                         options={[
//                             { label: "Al Haram Al Sharif", value: "op-1" },
//                             { label: "First Ring Road", value: "op-2" },
//                             { label: "An Naqa Dist", value: "op-3" },
//                             { label: "Al Mankhah Dist", value: "op-4" },
//                             { label: "Badhaah Dist", value: "op-5" },
//                             { label: "Bani Khidrah Dist", value: "op-6" },
//                         ]}
//                         onChange={(value) => { setSelected(value) }}
//                         placeholder=" -- select --"
//                     />

//                     <Select
//                         selected={selected}
//                         options={[
//                             { label: "Alert Type", value: "op-1" },
//                             { label: "Alert Type 1", value: "op-2" },
//                             { label: "Alert Type 2", value: "op-3" },
//                         ]}
//                         onChange={(value) => { setSelected(value) }}
//                         placeholder=" -- select --"
//                     />  
                      
//                 </FormField>
//           </div>  

//             </TitleBar>
//             <div className="smart-city-content">
//                 {cameras.length > 0 && <Slider cameras={cameras} />}
//             </div>
//             <style>
//                 {`
//                 .action-section {
//                     display: inline-block;
//                     width: 40%;
//                 }
//                 .showcase-input {
//                         width: 100% !important;
//                         padding:0;
//                     }
//                    .smart-city_box .uxp-form-select { 
//                         width: 46%;
//                         min-width: 46%;
//                     }
                        
//                 .cctv-slider {
//                     position: relative;
//                     width: 100%;
//                     overflow: hidden; 
//                 }

//                 .cctv-slides {
//                     display: flex;
//                     transition: transform 0.5s ease-in-out;
//                     height: 94vh;
//                 }

//                 .cctv-slide {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: space-around;
//                     box-sizing: border-box;
//                     width: 100%;
//                     flex: 0 0 100%;
//                 }

//                 .cctv-slide .child8PAXAuto {
//                     flex: 0 0 29%; /* 3 slides per row */
//                     margin: 0.5em;
//                     box-sizing: border-box;
//                 }

//                 .prev, .next, .prev-end, .next-end {
//                     position: absolute;
//                     top: 45%;
//                     transform: translateY(-50%);
//                     background-color: rgba(0, 0, 0, 0.5);
//                     border: none;
//                     color: white;
//                     font-size: 2em;
//                     padding: 10px;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     user-select: none;
//                 }
//                 .prev, .next{ 
//                     padding: 8px 17px 10px 17px; 
//                 }
//                 .prev-end, .next-end { 
//                     padding: 9px 17px 11px 17px; 
//                 } 
//                 .prev {
//                      left: 3%;
//                 } 
//                 .next {
//                     right: 3%;
//                 }  
//                 .prev-end {
//                    left: 0.7em;
//                 } 
//                 .next-end {
//                    right: 0.7em;
//                 }

//                 .parent8PAXAuto {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100%;
//                 }

//                 .child8PAXAuto {
//                     width: 100%;
//                     height: 100%;
//                 }

//                 .iframe-resize {
//                     width: 100%;
//                     height: 100%;
//                 }
//                 `}
//             </style>
//         </WidgetWrapper>
//     )
// };

// export default IncidentManagement;










 



// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, TitleBar } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { AutoSizer } from 'react-virtualized';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// }

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props: any) => {
//     let { uxpContext, locationkey } = props;

//     const [cameras, setCamerasData] = useState<any>([]);

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("DigitalTwin", "Get Cameras", {}, { json: true });
//         setCamerasData(data.cameras); // Directly use the 'cameras' property
//         console.log('Hello', data);
//     }

//     useEffect(() => {
//         getIncidentData();
//     }, []); 

//     return (
//         <WidgetWrapper className="smart-city_box building_layout-box incident-manage-box">
//             <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'></TitleBar>
//             <div className="smart-city-content">


//                  <div className="parent8PAXAuto">
//                     {cameras.length > 0 && cameras.map((camera: string, index: number) => {
//                         // Extract the camera ID (IP address) using regex
//                         const cameraIDMatch = camera.match(/\(([^)]+)\)/);
//                         const cameraID = cameraIDMatch ? cameraIDMatch[1] : '';

//                         return (
//                             <div className="child8PAXAuto" key={index}>
//                                 <AutoSizer className='iframe-resize'>
//                                     {({ height, width }) => {
//                                         let url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=' + cameraID;

//                                         return <iframe id="liveIframe" src={url} width={width} height={height}></iframe>
//                                     }}
//                                 </AutoSizer>
//                             </div>
//                         )
//                     })}
//                 </div>   


//             </div>
//         </WidgetWrapper>
//     )
// };

// export default IncidentManagement;








 


     
// import React, { useState, useEffect, useRef } from 'react';  
// import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
// import { IContextProvider } from '../uxp';  
// import { AutoSizer } from 'react-virtualized';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string  
// } 

// const IncidentManagement: React.FunctionComponent<IWidgetProps> = (props:any) => {
//     let { uxpContext,locationkey } = props;  

//     const [cameras, setcamerasData] = React.useState<any>([])  

//     async function getIncidentData() {
//         let data = await uxpContext.executeAction("IncidentDashboard2", "GetCamerasForLocation", { LocationKey: locationkey}, { json: true })
//          setcamerasData(JSON.parse(data)) 
//        // setcamerasData(data);  
//         console.log('Hello', data); 
//     }

//     React.useEffect(() => {
//         getIncidentData()
//     }, [])  

//     return (   

//      <WidgetWrapper className="smart-city_box building_layout-box  incident-manage-box">
//       <TitleBar title="Incident Management" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png'></TitleBar>  
//         <div className="smart-city-content">  
         
//             <div className="parent8PAXAuto">    

//                 { cameras.length > 0 && cameras.map((c: any, k: any) => {  
//                     return (   
//                         <div className="child8PAXAuto">
//                             <AutoSizer className='iframe-resize'>
//                                 {({ height, width }) => {     
//                                     let url;  

//                                    // url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=93&camlist='+c?.CamID+'|'+c?.AssetID; 

//                                      // url = 'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=@nvrassetkey&camlist=@cameraid'
                                 
//                                     //  url =  https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist=Avigilon%204.0C-H5A-BO1-IR%20(10.11.1.118)%20-%20Camera%201

//                                     url =  'https://mda.digitaltwin.iviva.cloud/Milestone/cctvgrid/index.html?isweblet=1&nvrassetkey=91&camlist='+c?.CamID;
                                      

//                                   return <iframe id="liveIframe" src={url}  width={width} height={height}></iframe>  
//                                 }}
//                             </AutoSizer>   
//                         </div> 
//                     )
//                 })}    
         
//             </div>    
//           </div> 
//         </WidgetWrapper>  
//     )
// }; 

//  export default IncidentManagement;
