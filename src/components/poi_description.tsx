 
import React from 'react';

interface IBuildingDetails {
  deviceName: string;
  buildCategory: string;
  shortArabicDescription: string;
  shortEnglishDescription: string;
  longArabicDescription: string;
  longEnglishDescription: string;
}

interface IProps {
  buildingDetails: IBuildingDetails | null;
  showShortDescription: boolean;
  showBriefDescription: boolean;
  toggleShortDescription: () => void;
  toggleBriefDescription: () => void;
}

const POI_Description: React.FunctionComponent<IProps> = ({
  buildingDetails,
  showShortDescription,
  showBriefDescription,
  toggleShortDescription,
  toggleBriefDescription,
}) => {
  if (!buildingDetails) {
    return null;
  }

  return (
    <div className="poi-description">
      <h3>{buildingDetails.deviceName}</h3>
      <h5>{buildingDetails.buildCategory}</h5>

      {/* Short Description */}
      {showShortDescription && (
        <div className="description">
          <p>{buildingDetails.shortArabicDescription}</p>
          <p>{buildingDetails.shortEnglishDescription}</p>
          {buildingDetails.shortEnglishDescription && (
            <div className="widget-icon">
              {/* <span className="location-icon"><a target='_blank' href={buildingDetails.url}></a></span> */}
              <span className="more-icon" onClick={toggleBriefDescription}>&#65310;</span>
            </div>
          )}
        </div>
      )}

      {/* Brief Description */}
      {showBriefDescription && (
        <div className="description">
          <p>{buildingDetails.longArabicDescription}</p>
          <p>{buildingDetails.longEnglishDescription}</p>
        </div>
      )}

      {/* Toggle Buttons */}
      {(buildingDetails.shortEnglishDescription || buildingDetails.longEnglishDescription) && (
        <div className="toggle-buttons">
          {buildingDetails.shortEnglishDescription && (
            <button onClick={toggleShortDescription}>
              {showShortDescription ? "Hide Short Description" : "Show Short Description"}
            </button>
          )}
          {buildingDetails.longEnglishDescription && (
            <button onClick={toggleBriefDescription}>
              {showBriefDescription ? "Hide Brief Description" : "Show Brief Description"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default POI_Description;
