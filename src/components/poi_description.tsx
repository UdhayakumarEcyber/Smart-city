import React, { useEffect, useState } from 'react';

interface IBuildingDetails {
    buildingDetails: {
        locInfo: {
            shortArabicDescription: string;
            shortEnglishDiscription: string;
            longArabicDiscription: string;
            longEnglishDiscription: string;
            imageUrl: string;
            addres: string;
            url: string;
        };
        deviceName: string;
        buildCategory: string;
    };
}

const POI_Description: React.FunctionComponent<IBuildingDetails> = ({ buildingDetails }) => {
    const {
        shortArabicDescription,
        shortEnglishDiscription,
        imageUrl,
        addres,
        url,
        longArabicDiscription,
        longEnglishDiscription
    } = buildingDetails.locInfo;
    const { deviceName, buildCategory } = buildingDetails;

    const [showLongDescription, setShowLongDescription] = useState(false);

    useEffect(() => {
        console.log('Building Details:', buildingDetails);
    }, [buildingDetails]);

    const handleClickBrief = () => {
        setShowLongDescription(!showLongDescription);
    };

    return (
        <div className="poi-sec-short">
            <div className="widget-container">
                <div className="widget-content">
                    <div className="widget-image">
                        <img src={imageUrl} alt="POI" />
                    </div>

                    <div className="widget-description">
                        <h3>{deviceName}</h3>
                        <h5>{buildCategory}</h5>

                        {!showLongDescription ? (
                            <div className="short-description">
                                {shortEnglishDiscription ? (
                                    <>
                                        <p>{shortArabicDescription}</p>
                                        <p>{shortEnglishDiscription}</p>
                                    </>
                                ) : (
                                    <p>{addres}</p>
                                )}
                            </div>
                        ) : (
                            <div className="long-description">
                                <p>{longArabicDiscription}</p>
                                <p>{longEnglishDiscription}</p>
                            </div>
                        )}
                    </div>

                    <div className="widget-icon">
                        <>
                            <span className="location-icon">
                                <a target="_blank" href={url} rel="noopener noreferrer"></a>
                            </span>
                            <span className={`more-icon ${showLongDescription ? 'expanded' : 'collapsed'}`}
                                onClick={handleClickBrief}
                            >
                                {showLongDescription }
                            </span>
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POI_Description;










// import React from 'react';

// interface IBuildingDetails {
//     buildingDetails: {
//         locInfo: {
//             shortArabicDescription: string;
//             shortEnglishDiscription: string;
//             longArabicDiscription: string;
//             longEnglishDiscription: string;
//             imageUrl: string;
//             addres:string;
//             buildCategory:string;
//             deviceName:string;
//         };
//     };
// }

// const POI_Description: React.FunctionComponent<IBuildingDetails> = ({ buildingDetails }) => {
//     const { shortArabicDescription, shortEnglishDiscription, longArabicDiscription, longEnglishDiscription, imageUrl, addres, deviceName, buildCategory } = buildingDetails.locInfo;

//     return (
//         // <div className="poi-description"> 
//         //     <div>
//         //         <img src={imageUrl} alt="Building" />
//         //     </div>
//         //     <div>
//         //         <h5>Short Arabic Description:</h5>
//         //         <p>{shortArabicDescription}</p>
//         //         <h5>Short English Description:</h5>
//         //         <p>{shortEnglishDiscription}</p>
//         //         <h5>Long Arabic Description:</h5>
//         //         <p>{longArabicDiscription}</p>
//         //         <h5>Long English Description:</h5>
//         //         <p>{longEnglishDiscription}</p>
//         //     </div>
//         // </div>

//                 <div className="poi-sec-short">
//                     <div className="widget-container">
//                     <div className="widget-content">
//                         <div className="widget-image">
//                         <img src={imageUrl} alt="POI" />
//                         </div>
//                         <div className="widget-description">
//                          <h3>{deviceName}</h3>
//                         <h5>{buildCategory}</h5> 
//                         {shortEnglishDiscription ? (
//                             <>
//                             <p>{shortArabicDescription}</p>
//                             <p>{shortEnglishDiscription}</p>
//                             </>
//                         ) : (
//                             <p>{addres}</p>
//                         )}
//                         </div>

//                          <div className="widget-icon"> 

//                         {poi_Summary?.locInfo?.shortEnglishDiscription ? (
//                             <>
//                             <span className="location-icon"><a target='_blank' href={poi_Summary?.locInfo?.url}></a></span>
//                             <span className="more-icon" onClick={handleClickBrief}>&#65310;</span>
//                             </>
//                         ) : (
//                             <></>
//                         )}

//                         </div> 


//                     </div>
//                     </div>
//       </div>


//     );
// };

// export default POI_Description;





// import React from 'react';

// interface IBuildingDetails {
//   deviceName: string;
//   buildCategory: string;
//   shortArabicDescription: string;
//   shortEnglishDescription: string;
//   longArabicDescription: string;
//   longEnglishDescription: string;
// }

// interface IProps {
//   buildingDetails: IBuildingDetails | null;
//   showShortDescription: boolean;
//   showBriefDescription: boolean;
//   toggleShortDescription: () => void;
//   toggleBriefDescription: () => void;
// }

// const POI_Description: React.FunctionComponent<IProps> = ({
//   buildingDetails,
//   showShortDescription,
//   showBriefDescription,
//   toggleShortDescription,
//   toggleBriefDescription,
// }) => {
//   if (!buildingDetails) {
//     return null;
//   }

//   return (
//     <div className="poi-description">
//       <h3>{buildingDetails.deviceName}</h3>
//       <h5>{buildingDetails.buildCategory}</h5>

//       {/* Short Description */}
//       {showShortDescription && (
//         <div className="description">
//           <p>{buildingDetails.shortArabicDescription}</p>
//           <p>{buildingDetails.shortEnglishDescription}</p>
//           {buildingDetails.shortEnglishDescription && (
//             <div className="widget-icon">
//               {/* <span className="location-icon"><a target='_blank' href={buildingDetails.url}></a></span> */}
//               <span className="more-icon" onClick={toggleBriefDescription}>&#65310;</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Brief Description */}
//       {showBriefDescription && (
//         <div className="description">
//           <p>{buildingDetails.longArabicDescription}</p>
//           <p>{buildingDetails.longEnglishDescription}</p>
//         </div>
//       )}

//       {/* Toggle Buttons */}
//       {(buildingDetails.shortEnglishDescription || buildingDetails.longEnglishDescription) && (
//         <div className="toggle-buttons">
//           {buildingDetails.shortEnglishDescription && (
//             <button onClick={toggleShortDescription}>
//               {showShortDescription ? "Hide Short Description" : "Show Short Description"}
//             </button>
//           )}
//           {buildingDetails.longEnglishDescription && (
//             <button onClick={toggleBriefDescription}>
//               {showBriefDescription ? "Hide Brief Description" : "Show Brief Description"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default POI_Description;
