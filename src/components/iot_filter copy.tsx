import React, { useState, useEffect } from 'react';
import { WidgetWrapper, MultiSelect, FormField } from 'uxp/components';
import { IContextProvider } from '../uxp';
import { EventsEnum } from '../index';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId: string,
    locationkey: string,
    appMode: string;
}

const IOT_Filter: React.FunctionComponent<IWidgetProps> = (props) => {
    const { uxpContext } = props;

    const [hideAll, setHideAll] = useState(false);
    const [assetName, setAssetName] = useState<string[]>([]);
    const [assetGroup, setAssetGroup] = useState<string[]>([]);
    const [assetState, setAssetState] = useState<string[]>([]);
    const [assetEffect, setAssetEffect] = useState<string[]>([]);
    const [assetLocation, setAssetLocation] = useState<string[]>([]);

    useEffect(() => {
        uxpContext.eventHandler?.(
            EventsEnum.SummaryGroupFilter,
            {
                HideAll: hideAll,
                AssetName: assetName,
                AssetGroup: assetGroup,
                AssetState: assetState,
                AssetEffect: assetEffect,
                AssetLocation: assetLocation
            }
        );
    }, [
        hideAll,
        assetName,
        assetGroup,
        assetState,
        assetEffect,
        assetLocation
    ]);
 

    const assetCategoryGroupData = [
        { value: 'IOT', label: 'IOT' },
        { value: 'Place', label: 'Place' }
    ];

    const staticMainCategories = [
        {
            "label": "IOT",
            "value": "IOT",
            "type": "main",
            "subCategories": [
                {
                    "label": "Streetlight",
                    "value": "Streetlight",
                    "type": "sub"
                },
                {
                    "label": "CCTV",
                    "value": "CCTV",
                    "type": "sub"
                }
            ]
        },
        {
            "label": "Place",
            "value": "Place",
            "type": "main",
            "subCategories": []
        }
    ];

    const assetStateData = [
        { value: 'Normal', label: 'Normal' },
        { value: 'Warning', label: 'Warning' },
        { value: 'Alert', label: 'Alert' }
    ];

    const assetEffectData = [
        { value: 'Steady', label: 'Steady' },
        { value: 'Glow', label: 'Glow' },
        { value: 'Blink', label: 'Blink' }
    ];

    const [assetLocationData, setAssetLocationData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        props.uxpContext.executeAction("E3D", "GetDistrictDetails", {}, { json: true }).then((res: any) => {
            console.log("District", res.map((value: any) => ({ label: value.name, value: value.name })));
            setAssetLocationData(res.map((value: any) => ({ label: value.name, value: value.name })));
        }).catch((e: any) => {
            console.error("Error fetching district details", e);
        });
    }

    const [groupedOptions, setGroupedOptions] = useState(staticMainCategories);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ label: string, value: string }>>([]);

    const getPoiBuildingType = () => {
        console.log("getBuildingInfo");

        uxpContext.executeAction("DigitalTwin", "Get Building types", {}, { json: true })
            .then((res) => {
                console.log("Response From API is", res, typeof res);

                const fetchedSubCategories = res.map((subCategory: any) => ({
                    label: subCategory,
                    value: subCategory,
                    type: "sub"
                }));

                const updatedOptions = groupedOptions.map(option => {
                    if (option.value === "Place") {
                        return {
                            ...option,
                            subCategories: fetchedSubCategories
                        };
                    }
                    return option;
                });

                setGroupedOptions(updatedOptions);
            }).catch((e) => {
                console.error("Error fetching building info", e);
            });
    };

    useEffect(() => {
        getPoiBuildingType();
    }, []);

    const handleChange = (newValue: MultiValue<{ label: string, value: string }>, actionMeta: ActionMeta<any>) => {
        setHideAll(true);
        setSelectedOptions(newValue);
         // setAssetGroup(newValue.map(option => option.value));
          setAssetName(newValue.map(option => option.value));
    };

    const formatGroupLabel = (data: any) => (
        <div>
            <span>{data.label}</span>
            <span style={{ fontSize: 'small', color: '#aaa' }}>
                ({data.options.length})
            </span>
        </div>
    );

    const filteredOptions = groupedOptions.map(mainCategory => ({
        label: mainCategory.label,
        options: mainCategory.subCategories.filter(subCategory =>
            !selectedOptions.some(selected => selected.value === subCategory.value)
        ).map(subCategory => ({
            label: subCategory.label,
            value: subCategory.value,
            type: subCategory.type
        }))
    }));

    return (
        <WidgetWrapper className="smart-city_box iot_filter-detail-box">
            <div className="smart-city-content" style={{ width: 'auto', overflow: "none" }}>
                <div className="iot-filter">
                    <div className="iot-filter-top chart-top">
                        <FormField inline className="showcase-input">

                            <div className="select-filter">  
                                <MultiSelect 
                                    placeholder="Asset Name"
                                    options={assetCategoryGroupData} 
                                    onChange={(value: any) => {
                                        setHideAll(true);
                                        setAssetGroup(value);
                                    }} 
                                    selected={assetName}
                                    isValid={!!assetName}
                                    hideClearButton  
                                    hideDoneButton 
                                />
                            </div>
                            <div className="select-filter">
                                <div className='uxp-form-select multi-select'> 

                                    <Select
                                        placeholder="Category"
                                        options={filteredOptions}
                                        value={selectedOptions}
                                        onChange={handleChange}
                                        isMulti
                                        formatGroupLabel={formatGroupLabel}
                                        classNamePrefix="custom-select"
                                    />

                                </div>
                            </div>
                            <div className='select-filter'>
                                <MultiSelect
                                    placeholder="Asset State"
                                    options={assetStateData}
                                    onChange={(value: any) => {
                                        setHideAll(true);
                                        setAssetState(value);
                                        uxpContext.eventHandler?.(
                                            EventsEnum.SetOperationalDataMode,
                                            { mode: 'State' }
                                        );
                                    }}
                                    selected={assetState}
                                    isValid={!!assetState}
                                    hideDoneButton={hideAll}
                                />
                            </div>
                            <div className='select-filter'>
                                <MultiSelect
                                    placeholder="Asset Effect"
                                    options={assetEffectData}
                                    onChange={(value: any) => {
                                        setHideAll(true);
                                        setAssetEffect(value);
                                    }}
                                    selected={assetEffect}
                                    isValid={!!assetEffect}
                                    hideDoneButton={hideAll}
                                />
                            </div>
                            <div className='select-filter'>
                                <MultiSelect
                                    placeholder="Asset Location"
                                    options={assetLocationData}
                                    onChange={(value: any) => {
                                        setHideAll(true);
                                        setAssetLocation(value);
                                    }}
                                    selected={assetLocation}
                                    isValid={!!assetLocation}
                                    hideDoneButton={hideAll}
                                />
                            </div>
                        </FormField>
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default IOT_Filter;











// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, MultiSelect, FormField } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';
// import Select, { MultiValue, ActionMeta } from 'react-select';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string,
//     appMode: string;
// }

// const IOT_Filter: React.FunctionComponent<IWidgetProps> = (props) => {
//     const { uxpContext } = props;

//     const [hideAll, setHideAll] = useState(false);
//     const [assetName, setAssetName] = useState<string[]>([]);
//     const [assetGroup, setAssetGroup] = useState<string[]>([]);
//     const [assetState, setAssetState] = useState<string[]>([]);
//     const [assetEffect, setAssetEffect] = useState<string[]>([]);
//     const [assetLocation, setAssetLocation] = useState<string[]>([]);

//     useEffect(() => {
//         uxpContext.eventHandler?.(
//             EventsEnum.SummaryGroupFilter,
//             {
//                 HideAll: hideAll,
//                 AssetName: assetName,
//                 AssetGroup: assetGroup,
//                 AssetState: assetState,
//                 AssetEffect: assetEffect,
//                 AssetLocation: assetLocation
//             }
//         );
//     }, [
//         hideAll,
//         assetName,
//         assetGroup,
//         assetState,
//         assetEffect,
//         assetLocation
//     ]);

//         const assetCategoryData = [
//         { value: 'Streetlight', label: 'Streetlight' },
//         { value: 'CCTV', label: 'CCTV' }
//     ];

//     const staticMainCategories = [
//         {
//             "label": "IOT",
//             "value": "IOT",
//             "type": "main",
//             "subCategories": [
//                 {
//                     "label": "Streetlight",
//                     "value": "Streetlight",
//                     "type": "sub"
//                 },
//                 {
//                     "label": "CCTV",
//                     "value": "CCTV",
//                     "type": "sub"
//                 }
//             ]
//         },
//         {
//             "label": "Place",
//             "value": "Place",
//             "type": "main",
//             "subCategories": []
//         }
//     ];

//     const assetStateData = [
//         { value: 'Normal', label: 'Normal' },
//         { value: 'Warning', label: 'Warning' },
//         { value: 'Alert', label: 'Alert' }
//     ];

//     const assetEffectData = [
//         { value: 'Steady', label: 'Steady' },
//         { value: 'Glow', label: 'Glow' },
//         { value: 'Blink', label: 'Blink' }
//     ];

//     const [assetLocationData, setAssetLocationData] = useState([]);

//     useEffect(() => {
//         getData();
//     }, []);

//     function getData() {
//         props.uxpContext.executeAction("E3D", "GetDistrictDetails", {}, { json: true }).then((res: any) => {
//             console.log("District", res.map((value: any) => ({ label: value.name, value: value.name })));
//             setAssetLocationData(res.map((value: any) => ({ label: value.name, value: value.name })));
//         }).catch((e: any) => {
//             console.error("Error fetching district details", e);
//         });
//     }

//     const [groupedOptions, setGroupedOptions] = useState(staticMainCategories);
//     const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ label: string, value: string }>>([]);

//     const getPoiBuildingType = () => {
//         console.log("getBuildingInfo");

//         uxpContext.executeAction("DigitalTwin", "Get Building types", {}, { json: true })
//             .then((res) => {
//                 console.log("Response From API is", res, typeof res);

//                 const fetchedSubCategories = res.map((subCategory: any) => ({
//                     label: subCategory,
//                     value: subCategory,
//                     type: "sub"
//                 }));

//                 const updatedOptions = groupedOptions.map(option => {
//                     if (option.value === "Place") {
//                         return {
//                             ...option,
//                             subCategories: fetchedSubCategories
//                         };
//                     }
//                     return option;
//                 });

//                 setGroupedOptions(updatedOptions);
//             }).catch((e) => {
//                 console.error("Error fetching building info", e);
//             });
//     };

//     useEffect(() => {
//         getPoiBuildingType();
//     }, []);

//     const handleChange = (newValue: MultiValue<{ label: string, value: string }>, actionMeta: ActionMeta<any>) => {
//         setHideAll(true);
//         setSelectedOptions(newValue);
//           setAssetGroup(newValue.map(option => option.value));
//         // setAssetName(newValue.map(option => option.value));
//     };

//     const formatGroupLabel = (data: any) => (
//         <div>
//             <span>{data.label}</span>
//             <span style={{ fontSize: 'small', color: '#aaa' }}>
//                 ({data.options.length})
//             </span>
//         </div>
//     );

//     const filteredOptions = groupedOptions.map(mainCategory => ({
//         label: mainCategory.label,
//         options: mainCategory.subCategories.filter(subCategory =>
//             !selectedOptions.some(selected => selected.value === subCategory.value)
//         ).map(subCategory => ({
//             label: subCategory.label,
//             value: subCategory.value,
//             type: subCategory.type
//         }))
//     }));

//     return (
//         <WidgetWrapper className="smart-city_box iot_filter-detail-box">
//             <div className="smart-city-content" style={{ width: 'auto', overflow: "none" }}>
//                 <div className="iot-filter">
//                     <div className="iot-filter-top chart-top">
//                         <FormField inline className="showcase-input">

//                             <div className="select-filter">  
//                                 <MultiSelect 
//                                     placeholder="Asset Name"
//                                     options={assetCategoryData} 
//                                     onChange={(value: any) => {
//                                         setHideAll(true);
//                                         setAssetName(value);
//                                     }} 
//                                     selected={assetName}
//                                     isValid={!!assetName}
//                                     hideClearButton  
//                                     hideDoneButton 
//                                 />
//                             </div>
//                             <div className="select-filter">
//                                 <div className='uxp-form-select multi-select'> 

//                                     <Select
//                                         placeholder="Category"
//                                         options={filteredOptions}
//                                         value={selectedOptions}
//                                         onChange={handleChange}
//                                         isMulti
//                                         formatGroupLabel={formatGroupLabel}
//                                         classNamePrefix="custom-select"
//                                     />

//                                 </div>
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset State"
//                                     options={assetStateData}
//                                     onChange={(value: any) => {
//                                         setHideAll(true);
//                                         setAssetState(value);
//                                         uxpContext.eventHandler?.(
//                                             EventsEnum.SetOperationalDataMode,
//                                             { mode: 'State' }
//                                         );
//                                     }}
//                                     selected={assetState}
//                                     isValid={!!assetState}
//                                     hideDoneButton={hideAll}
//                                 />
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset Effect"
//                                     options={assetEffectData}
//                                     onChange={(value: any) => {
//                                         setHideAll(true);
//                                         setAssetEffect(value);
//                                     }}
//                                     selected={assetEffect}
//                                     isValid={!!assetEffect}
//                                     hideDoneButton={hideAll}
//                                 />
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset Location"
//                                     options={assetLocationData}
//                                     onChange={(value: any) => {
//                                         setHideAll(true);
//                                         setAssetLocation(value);
//                                     }}
//                                     selected={assetLocation}
//                                     isValid={!!assetLocation}
//                                     hideDoneButton={hideAll}
//                                 />
//                             </div>
//                         </FormField>
//                     </div>
//                 </div>
//             </div>
//         </WidgetWrapper>
//     );
// };

// export default IOT_Filter;



















function setHideAll(arg0: boolean) {
    throw new Error('Function not implemented.');
}



// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, MultiSelect, FormField } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';
// import Select, { MultiValue, ActionMeta } from 'react-select';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string,
//     appMode: string;
// }

// const IOT_Filter: React.FunctionComponent<IWidgetProps> = (props) => {
//     const { uxpContext } = props;

//     // const [hideAll, setHideAll] = useState(false);
//     // const [assetName, setAssetName] = useState(['Streetlight']);
//     // const [assetGroup, setAssetGroup] = useState([]);
//     // const [assetState, setAssetState] = useState(['Normal']);
//     // const [assetEffect, setAssetEffect] = useState(['Steady']);
//     // const [assetLocation, setAssetLocation] = useState(['Ad Dar Dist']);
   
   
//     const [hideAll, setHideAll] = useState(false);
//     const [assetName, setAssetName] = useState();
//     const [assetGroup, setAssetGroup] = useState();
//     const [assetState, setAssetState] = useState();
//     const [assetEffect, setAssetEffect] = useState();
//     const [assetLocation, setAssetLocation] = useState();

//     useEffect(() => {
//         uxpContext.eventHandler?.(
//             EventsEnum.SummaryGroupFilter,
//             {
//                 AssetName: assetName,
//                 AssetGroup: assetGroup,
//                 AssetState: assetState,
//                 AssetEffect: assetEffect,
//                 AssetLocation: assetLocation
//             }
//         );
//     }, [
//         assetName,
//         assetGroup,
//         assetState,
//         assetEffect,
//         assetLocation
//     ]);

//     const staticMainCategories = [
//         {
//             "label": "IOT",
//             "value": "IOT",
//             "type": "main",
//             "subCategories": [
//                 {
//                     "label": "Streetlight",
//                     "value": "Streetlight",
//                     "type": "sub"
//                 },
//                 {
//                     "label": "CCTV",
//                     "value": "CCTV",
//                     "type": "sub"
//                 }
//             ]
//         },
//         {
//             "label": "Places",
//             "value": "Places",
//             "type": "main",
//             "subCategories": []
//         }
//     ];

//     const assetStateData = [
//         { value: 'Normal', label: 'Normal' },
//         { value: 'Warning', label: 'Warning' },
//         { value: 'Alert', label: 'Alert' }
//     ];

//     const assetEffectData = [
//         { value: 'Steady', label: 'Steady' },
//         { value: 'Glow', label: 'Glow' },
//         { value: 'Blink', label: 'Blink' }
//     ];

//     const [assetLocationData, setAssetLocationData] = useState([]);

//     useEffect(() => {
//         getData();
//     }, []);

//     function getData() {
//         props.uxpContext.executeAction("E3D", "GetDistrictDetails", {}, { json: true }).then((res: any) => {
//             console.log("District", res.map((value: any) => ({ label: value.name, value: value.name })));
//             setAssetLocationData(res.map((value: any) => ({ label: value.name, value: value.name })));
//         }).catch((e: any) => {
//             console.error("Error fetching district details", e);
//         });
//     }

//     const [groupedOptions, setGroupedOptions] = useState(staticMainCategories);
//     const [selectedOptions, setSelectedOptions] = useState<MultiValue<{ label: string, value: string }>>([]);

//     const getPoiBuildingType = () => {
//         console.log("getBuildingInfo");

//         uxpContext.executeAction("DigitalTwin", "Get Building types", {}, { json: true })
//             .then((res) => {
//                 console.log("Response From API is", res, typeof res);

//                 const fetchedSubCategories = res.map((subCategory: any) => ({
//                     label: subCategory,
//                     value: subCategory,
//                     type: "sub"
//                 }));

//                 const updatedOptions = groupedOptions.map(option => {
//                     if (option.value === "Places") {
//                         return {
//                             ...option,
//                             subCategories: fetchedSubCategories
//                         };
//                     }
//                     return option;
//                 });

//                 setGroupedOptions(updatedOptions);
//             }).catch((e) => {
//                 console.error("Error fetching building info", e);
//             });
//     };

//     useEffect(() => {
//         getPoiBuildingType();
//     }, []);

//     const handleChange = (newValue: MultiValue<{ label: string, value: string }>, actionMeta: ActionMeta<any>) => {
//         setSelectedOptions(newValue);
//        // setAssetGroup(newValue.map(option => option.value));
//     };

//     const formatGroupLabel = (data: any) => (
//         <div>
//             <span>{data.label}</span>
//             <span style={{ fontSize: 'small', color: '#aaa' }}>
//                 ({data.options.length})
//             </span>
//         </div>
//     );

//     const filteredOptions = groupedOptions.map(mainCategory => ({
//         label: mainCategory.label,
//         options: mainCategory.subCategories.filter(subCategory =>
//             !selectedOptions.some(selected => selected.value === subCategory.value)
//         ).map(subCategory => ({
//             label: subCategory.label,
//             value: subCategory.value,
//             type: subCategory.type
//         }))
//     }));

//     return (
//         <WidgetWrapper className="smart-city_box iot_filter-detail-box">
//             <div className="smart-city-content" style={{ width: 'auto', overflow: "none" }}>
//                 <div className="iot-filter">
//                     <div className="iot-filter-top chart-top">
//                         <FormField inline className="showcase-input">
//                             <div className="select-filter">
//                                 <div className='uxp-form-select multi-select'>
//                                     <Select
//                                         placeholder="Category"
//                                         options={filteredOptions}
//                                         value={selectedOptions}
//                                         onChange={handleChange}
//                                         isMulti
//                                         formatGroupLabel={formatGroupLabel}
//                                     />
//                                 </div>
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset State"
//                                     options={assetStateData}
//                                     onChange={(value: any) => {
//                                         setAssetState(value);
//                                         uxpContext.eventHandler?.(
//                                             EventsEnum.SetOperationalDataMode,
//                                             { mode: 'State' }
//                                         );
//                                     }}
//                                     selected={assetState}
//                                     isValid={!!assetState}
//                                     hideDoneButton
//                                 />
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset Effect"
//                                     options={assetEffectData}
//                                     onChange={(value: any) => setAssetEffect(value)}
//                                     selected={assetEffect}
//                                     isValid={!!assetEffect}
//                                     hideDoneButton
//                                 />
//                             </div>
//                             <div className='select-filter'>
//                                 <MultiSelect
//                                     placeholder="Asset Location"
//                                     options={assetLocationData}
//                                     onChange={(value: any) => setAssetLocation(value)}
//                                     selected={assetLocation}
//                                     isValid={!!assetLocation}
//                                     hideDoneButton
//                                 />
//                             </div>
//                         </FormField>
//                     </div>
//                 </div>
//             </div>
//         </WidgetWrapper>
//     );
// };

// export default IOT_Filter;












// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, MultiSelect, FormField } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string,
//     appMode: string;
// } 

// const IOT_Filter: React.FunctionComponent<IWidgetProps> = (props) => {
//     const { uxpContext, appMode } = props; 

//     // const [assetCategory, setAssetCategory] = useState(['Streetlight']);
//     // const [assetState, setAssetState] = useState(['Normal']);
//     // const [assetEffect, setAssetEffect] = useState(['Steady']);
//     // const [assetLocation, setAssetLocation] = useState(['Ad Dar Dist']);


//     // { 
//     //     HideAll: false,
//     //     AssetName: [‘Streetlight’],
//     //     AssetState: [‘Normal’],
//     //     AssetEffect: [‘Steady’],
//     //     AssetLocation: [‘الحرم الشريف’],
//     // }

//     const [hideAll, setHideAll] = useState(false);
//     const [assetName, setAssetName] = useState(['Streetlight']);
//     const [assetState, setAssetState] = useState(['Normal']);
//     const [assetEffect, setAssetEffect] = useState(['Steady']);
//     const [assetLocation, setAssetLocation] = useState(['Ad Dar Dist']);

//     useEffect(() => {
//         uxpContext.eventHandler?.(
//             EventsEnum.SummaryGroupFilter, 
//                 { 
//                     AssetName: assetName, 
//                     AssetState: assetState, 
//                     AssetEffect: assetEffect,
//                     AssetLocation: assetLocation
//                 }
//             ); 
//     }, [
//         assetName,
//         assetState,
//         assetEffect,
//         assetLocation
//     ]);

//     const assetCategoryData = [
//         { value: 'Streetlight', label: 'Streetlight' },
//         { value: 'CCTV', label: 'CCTV' }
//     ];
    
//     const assetStateData = [
//         { value: 'Normal', label: 'Normal' },
//         { value: 'Warning', label: 'Warning' },
//         { value: 'Alert', label: 'Alert' }
//     ];
    
//     const assetEffectData = [
//         { value: 'Steady', label: 'Steady' },
//         { value: 'Glow', label: 'Glow' },
//         { value: 'Blink', label: 'Blink' }
//     ]; 
    
//     const [assetLocationData, setAssetLocationData] = useState([]); 
        
//     useEffect(() => {
//         getData();
//     }, []);

//     function getData() {  
//         props.uxpContext.executeAction("E3D","GetDistrictDetails",{},{json:true}).then((res: any)=>{ 
//             console.log("District",res.map( (value:any) => ({label:value.name, value:value.name})));
//             setAssetLocationData(res.map( (value:any) => ({label:value.name, value:value.name})));
//         }).catch((e: any)=>{
            
//         }); 
//     }  

//     return (    
//         <WidgetWrapper className="smart-city_box iot_filter-detail-box">
//             <div className="smart-city-content" style={{width:'auto', overflow:"none"}}>
//                 <div className="iot-filter">
//                     <div className="iot-filter-top chart-top">
//                         <FormField inline className="showcase-input">
//                             <div className="select-filter">  
//                                 <MultiSelect 
//                                     placeholder="Asset Category"
//                                     options={assetCategoryData}
//                                     onChange={(value: any) => setAssetName(value)}
//                                     selected={assetName}
//                                     isValid={!!assetName}
//                                     hideClearButton  
//                                     hideDoneButton 
//                                 />
//                             </div>
//                             <div className='select-filter'>  
//                                 <MultiSelect
//                                     placeholder="Asset State"
//                                     options={assetStateData}
//                                     onChange={(value: any) => {
//                                         setAssetState(value);
//                                         uxpContext.eventHandler?.(
//                                             EventsEnum.SetOperationalDataMode, 
//                                             { mode: 'State' }
//                                         );
//                                     }}
//                                     selected={assetState}
//                                     isValid={!!assetState}
//                                     hideDoneButton
//                                 />  
//                             </div>
//                             <div className='select-filter'>   
//                                 <MultiSelect    
//                                     placeholder="Asset Effect"
//                                     options={assetEffectData}
//                                     onChange={(value: any) => setAssetEffect(value)}
//                                     selected={assetEffect}
//                                     isValid={!!assetEffect}
//                                     hideDoneButton
//                                 /> 
//                             </div>
//                             <div className='select-filter'>  
//                                 <MultiSelect
//                                     placeholder="Asset Location"
//                                     options={assetLocationData}
//                                     onChange={(value: any) => setAssetLocation(value)}
//                                     selected={assetLocation}
//                                     isValid={!!assetLocation}
//                                     hideDoneButton
//                                 /> 
//                             </div> 
//                         </FormField>
//                     </div>
//                 </div> 
//             </div>  
//         </WidgetWrapper> 
//     )
// }; 

// export default IOT_Filter;











// import React, { useState, useEffect } from 'react';
// import { WidgetWrapper, MultiSelect, FormField } from 'uxp/components';
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId: string,
//     locationkey: string,
//     appMode: string;
// } 

// const IOT_Filter: React.FunctionComponent<IWidgetProps> = (props) => {
//     const { uxpContext, appMode } = props; 

//     // const [assetCategory, setAssetCategory] = useState(['Streetlight']);
//     // const [assetState, setAssetState] = useState(['Normal']);
//     // const [assetEffect, setAssetEffect] = useState(['Steady']);
//     // const [assetLocation, setAssetLocation] = useState(['Ad Dar Dist']);

//     const [assetCategory, setAssetCategory] = useState(['']);
//     const [assetState, setAssetState] = useState(['']);
//     const [assetEffect, setAssetEffect] = useState(['']);
//     const [assetLocation, setAssetLocation] = useState(['']);

//     useEffect(() => {
//         uxpContext.eventHandler?.(
//             EventsEnum.SummaryGroupFilter, 
//                 { 
//                     AssetCategory: assetCategory, 
//                     AssetState: assetState, 
//                     AssetEffect: assetEffect,
//                     AssetLocation: assetLocation
//                 }
//             ); 
//     }, [
//         assetCategory,
//         assetState,
//         assetEffect,
//         assetLocation
//     ]);

//     const assetCategoryData = [
//         { value: 'Streetlight', label: 'Streetlight' },
//         { value: 'CCTV', label: 'CCTV' }
//     ];
    
//     const assetStateData = [
//         { value: 'Normal', label: 'Normal' },
//         { value: 'Warning', label: 'Warning' },
//         { value: 'Alert', label: 'Alert' }
//     ];
    
//     const assetEffectData = [
//         { value: 'Steady', label: 'Steady' },
//         { value: 'Glow', label: 'Glow' },
//         { value: 'Blink', label: 'Blink' }
//     ]; 
    
//     const [assetLocationData, setAssetLocationData] = useState([]); 
        
//     useEffect(() => {
//         getData();
//     }, []);

//     function getData() {  
//         props.uxpContext.executeAction("E3D","GetDistrictDetails",{},{json:true}).then((res: any)=>{ 
//             console.log("District",res.map( (value:any) => ({label:value.name, value:value.name})));
//             setAssetLocationData(res.map( (value:any) => ({label:value.name, value:value.name})));
//         }).catch((e: any)=>{
            
//         }); 
//     }  

//     return (    
//         <WidgetWrapper className="smart-city_box iot_filter-detail-box">
//             <div className="smart-city-content" style={{width:'auto', overflow:"none"}}>
//                 <div className="iot-filter">
//                     <div className="iot-filter-top chart-top">
//                         <FormField inline className="showcase-input">
//                             <div className="select-filter">  
//                                 <MultiSelect 
//                                     placeholder="Asset Category"
//                                     options={assetCategoryData}
//                                     onChange={(value: any) => setAssetCategory(value)}
//                                     selected={assetCategory}
//                                     isValid={!!assetCategory}
//                                     hideClearButton  
//                                     hideDoneButton 
//                                 />
//                             </div>
//                             <div className='select-filter'>  
//                                 <MultiSelect
//                                     placeholder="Asset State"
//                                     options={assetStateData}
//                                     onChange={(value: any) => setAssetState(value)}
//                                     selected={assetState}
//                                     isValid={!!assetState}
//                                     hideDoneButton
//                                 />  
//                             </div>
//                             <div className='select-filter'>   
//                                 <MultiSelect    
//                                     placeholder="Asset Effect"
//                                     options={assetEffectData}
//                                     onChange={(value: any) => setAssetEffect(value)}
//                                     selected={assetEffect}
//                                     isValid={!!assetEffect}
//                                     hideDoneButton
//                                 /> 
//                             </div>
//                             <div className='select-filter'>  
//                                 <MultiSelect
//                                     placeholder="Asset Location"
//                                     options={assetLocationData}
//                                     onChange={(value: any) => setAssetLocation(value)}
//                                     selected={assetLocation}
//                                     isValid={!!assetLocation}
//                                     hideDoneButton
//                                 /> 
//                             </div> 
//                         </FormField>
//                     </div>
//                 </div> 
//             </div>  
//         </WidgetWrapper> 
//     )
// }; 

// export default IOT_Filter;




 