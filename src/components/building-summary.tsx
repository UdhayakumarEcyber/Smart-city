
// import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
import { IContextProvider } from '../uxp';


interface IBuildingSummary {
  uxpContext: IContextProvider;
  page: string;
  selectedAsset: ISelectedAsset;
  // districtName: string 
}

interface ISelectedAsset {
  objectType: any;
  id: string;
  lat?: number;
  long?: number;
}


const BuildingSummary: React.FunctionComponent<IBuildingSummary> = ({ page, selectedAsset, ...props }) => {

  const [building_Summary, setBuilding_Summary] = useState(null);

   const lat = selectedAsset?.long;
   const long = selectedAsset?.lat;

  // const long = 39.6131591796875;
  // const lat = 24.4643611907959;

  console.log('Selected Asset are', selectedAsset);
  console.log('latitude are', lat);
  console.log('Longitude are', long);

  // console.log('Details are',{selectedAsset,lat,long});

  function getBuildingSummaryData() { 
    console.log("getBulingInfo") 
    if (!lat && !long) {
      console.log("Lat or long is undefined.");
    } else {
      console.log("WE are calling building info API");
      props.uxpContext.executeAction("DigitalTwin", "GetBuildingInfo", { lat: lat, long: long }, { json: true })
        .then((res: any) => {
          console.log("Response From API is", res, typeof res);
          setBuilding_Summary(res["Building Details"]);
        }).catch((e: any) => {
          // console.log("hi", e);
        });
    } 
  }
 


  React.useEffect(() => {
    getBuildingSummaryData();
  }, [lat, long])

  console.log('buildingCode Body', building_Summary?.body|| "N/A")

  return (

    <WidgetWrapper className="smart-city_box building_summary-box">

      <TitleBar title="Building Summary" icon='https://static.iviva.com/images/Udhayimages/mda-building-images/layout.png'></TitleBar>

      <div className="smart-city-content" style={{ height: '350px' }}>

        <div className='building-details'>
          <div className='building-top'>

            <div className="building-pict"
              style={{
                  backgroundImage: `url(${building_Summary?.header?.buildingImage || 'https://static.iviva.com/images/Udhayimages/buildings-summary-pict.png'})`,
                // backgroundImage: `url("https://static.iviva.com/images/Udhayimages/buildings-summary-pict.png")`
              }} />


            <div className='building-header'>
              <div className='building-title'>{building_Summary?.header?.buildingName   ==="null"? "N/A" : building_Summary?.header?.buildingName }</div>
              <div className='building-nav'>
                <ul> 
                 
                  <li>
                    <a target="_blank" href='https://ccc-demo.raseel.city/Apps/IncidentManagement/dashboard'>
                      <div className='building-nav-icon'><img src="https://static.iviva.com/images/Udhayimages/incident-icon.png" /></div>
                      <div className='building-nav-title'>Report Incident</div>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href='https://ccc-demo.raseel.city/Apps/ivivaFacility/wsp-workorders'>
                      <div className='building-nav-icon'><img src="https://static.iviva.com/images/Udhayimages/facility-management.png" /></div>
                      <div className='building-nav-title'>Facility Issue</div>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href='https://ccc-demo.raseel.city/Apps/ContractManagement/dashboard'>
                      <div className='building-nav-icon'><img src="https://static.iviva.com/images/Udhayimages/agenda.png" /></div>
                      <div className='building-nav-title'>Leasing info</div>
                    </a>
                  </li>
                </ul>

              </div>
            </div>
          </div>
          <div className='building-info-box'>

            <ul>
              <li className='building-code'><label>Building Code : </label><span> {building_Summary?.body?.buildingCode ==="null"? "N/A" : building_Summary?.body?.buildingCode }</span></li>
              <li className='building-name'><label>Building Name : </label><span> {building_Summary?.body?.buildingName ==="null"? "N/A" : building_Summary?.body?.buildingName}</span></li>
              <li className='street-number'><label>Street Number : </label><span> {building_Summary?.body?.streetNumber ==="null"? "N/A" : building_Summary?.body?.streetNumber}</span></li>
              <li className='street-name'><label>Street Name : </label><span>{building_Summary?.body?.streetName  ==="null"? "N/A" : building_Summary?.body?.streetName}</span></li>
              <li className='city'><label>City : </label><span>{building_Summary?.body?.city  ==="null"? "N/A" : building_Summary?.body?.city}</span></li>
            </ul>


          </div>
 

          <div className='building-bot'>
            <div className='g_map-link' ><a href={building_Summary?.url} target="_blank">More : Gmap Link</a></div>

          </div>

        </div>

      </div>

    </WidgetWrapper>
  )
};


export default BuildingSummary;




