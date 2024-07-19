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
     selectedAsset: ISelectedAsset; 
}

interface ISelectedAsset { 
    objectType: any;
     id: string;
     lat?: number;
     long?: number;
   }

const IOT_Filter: React.FunctionComponent<IWidgetProps> = ({selectedAsset, ...props}) => {
    const { uxpContext } = props;

    const [hideAll, setHideAll] = useState(true);
    const [assetName, setAssetName] = useState<string[]>([]);
    const [assetGroup, setAssetGroup] = useState<string[]>([]);
    const [assetState, setAssetState] = useState<string[]>([]);
    const [assetEffect, setAssetEffect] = useState<string[]>([]);
    const [assetLocation, setAssetLocation] = useState<string[]>([]);

    // useEffect(() => {
    //     uxpContext.eventHandler?.(
    //         EventsEnum.SummaryGroupFilter,
    //         {
    //             HideAll: hideAll,
    //             AssetName: assetGroup,
    //             AssetGroup: assetName,
    //             AssetState: assetState,
    //             AssetEffect: assetEffect,
    //             AssetLocation: assetLocation
    //         }
    //     );

    //     checkArrays();
    // }, [
    //     hideAll,
    //     assetName,
    //     assetGroup,
    //     assetState,
    //     assetEffect,
    //     assetLocation
    // ]);

    useEffect(() => {
        uxpContext.eventHandler?.(EventsEnum.SummaryGroupFilter, {
            HideAll: hideAll,
            AssetName: assetGroup,
            AssetGroup: assetName,
            AssetState: assetState,
            AssetEffect: assetEffect,
            AssetLocation: assetLocation,
        });
        (window as any).SelectedPlaceCateogories = groupedOptions
            .find((opt) => opt.value === 'Place')
            .subCategories.map((opt) => opt.value)
            .filter((places) => assetGroup.includes(places));
        checkArrays();
    }, [hideAll, assetName, assetGroup, assetState, assetEffect, assetLocation]);


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
            // console.log("District", res.map((value: any) => ({ label: value.name, value: value.name })));
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
                // console.log("Response From API is", res, typeof res);

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
        setSelectedOptions(newValue);
         setAssetGroup(newValue.map(option => option.value));

        // console.log("Category", [...assetGroup, newValue] );
        //setAssetName(newValue.map(option => option.value));
        checkArrays();
    };
    console.log("Categories", assetGroup);

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

    const checkArrays = () => {
        if (
            assetName.length === 0 &&
            assetGroup.length === 0 &&
            assetState.length === 0 &&
            assetEffect.length === 0 &&
            assetLocation.length === 0
        ) {
            setHideAll(true);
        } else {
            setHideAll(false);
        }
    };



    const lat = selectedAsset?.lat;
    const long = selectedAsset?.long;

    
 



    return (
        <WidgetWrapper className="smart-city_box iot_filter-detail-box">
            <div className="smart-city-content">
                <div className="iot-filter">
                    <div className="iot-filter-top chart-top">
                        <FormField inline className="showcase-input">
                            <div className="select-filter">  
                                <MultiSelect 
                                    placeholder="Asset Name"
                                    options={assetCategoryGroupData} 
                                    onChange={(value: any) => {
                                          setAssetName(value);
                                       // setAssetGroup(value);
                                        checkArrays();
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
                                        setAssetState(value);
                                        checkArrays();
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
                                        setAssetEffect(value);
                                        checkArrays();
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
                                        setAssetLocation(value);
                                        checkArrays();
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

//     const [hideAll, setHideAll] = useState(true);
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
//                 AssetName: assetGroup,
//                 AssetGroup: assetName,
//                 AssetState: assetState,
//                 AssetEffect: assetEffect,
//                 AssetLocation: assetLocation
//             }
//         );

//         checkArrays();
//     }, [
//         hideAll,
//         assetName,
//         assetGroup,
//         assetState,
//         assetEffect,
//         assetLocation
//     ]);

//     const assetCategoryGroupData = [
//         { value: 'IOT', label: 'IOT' },
//         { value: 'Place', label: 'Place' }
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
//             // console.log("District", res.map((value: any) => ({ label: value.name, value: value.name })));
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
//                 // console.log("Response From API is", res, typeof res);

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
//         setSelectedOptions(newValue);
//          setAssetGroup(newValue.map(option => option.value));
//         //setAssetName(newValue.map(option => option.value));
//         checkArrays();
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

//     const checkArrays = () => {
//         if (
//             assetName.length === 0 &&
//             assetGroup.length === 0 &&
//             assetState.length === 0 &&
//             assetEffect.length === 0 &&
//             assetLocation.length === 0
//         ) {
//             setHideAll(true);
//         } else {
//             setHideAll(false);
//         }
//     };

//     return (
//         <WidgetWrapper className="smart-city_box iot_filter-detail-box">
//             <div className="smart-city-content">
//                 <div className="iot-filter">
//                     <div className="iot-filter-top chart-top">
//                         <FormField inline className="showcase-input">
//                             <div className="select-filter">  
//                                 <MultiSelect 
//                                     placeholder="Asset Name"
//                                     options={assetCategoryGroupData} 
//                                     onChange={(value: any) => {
//                                           setAssetName(value);
//                                        // setAssetGroup(value);
//                                         checkArrays();
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
//                                         setAssetState(value);
//                                         checkArrays();
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
//                                         setAssetEffect(value);
//                                         checkArrays();
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
//                                         setAssetLocation(value);
//                                         checkArrays();
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
