import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LabelList  } from 'recharts';

import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  

const IAQ_Widget: React.FunctionComponent<{}> = () => {  

    const statusData = [
        {  
          airtype: 'O2', 
          value: 83.68,
          reading: 'Mg/m3' 
        },
        {  
            airtype: 'NO2', 
            value: 0.36,
            reading: 'Mg/m3' 
        },
        {  
            airtype: 'SO2', 
            value: 9.59,
            reading: 'Mg/m3' 
        },
        {  
            airtype: 'CO', 
            value: 142.90,
            reading: 'Mg/m3' 
        },
        {  
            airtype: 'PM10', 
            value: 29.75,
            reading: 'Mg/m3' 
        },
        {  
            airtype: 'PM2.5', 
            value: 21.47,
            reading: 'Mg/m3' 
        },
         
      ];

      const statusElements = statusData.map((item, index) => ( 
        <div className={`${item.airtype} status`} key={index}>
          <p>{item.airtype}</p>
          <h2>{item.value}</h2>
          <span>{item.reading}</span>
        </div>
      ));

  
      
      interface SemiCircleProgressBarProps {
        percentage: number;
      }

    
const SemiCircleProgressBar: React.FC<SemiCircleProgressBarProps> = ({ percentage }) => {
    const [offset, setOffset] = useState(0);
  
    useEffect(() => {
      const progress = percentage;
      const offsetValue = (progress / 100) * 180; // 180 for a semi-circle
      setOffset(offsetValue);
    }, [percentage]);
  
    return (
      <div className="semi-circle-progress-bar">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path
            className="background"
            d="M50 10 A40 40 0 0 1 50 90"
            fill="none"
            stroke="#ccc"
            strokeWidth="8"
          />
          <path
            className="progress-bar"
            d="M50 10 A40 40 0 0 1 50 90"
            fill="none"
            stroke="#007bff"
            strokeWidth="8"
            strokeDasharray="180"
            strokeDashoffset={offset}
          />
        </svg>
        <div className="percentage">{percentage}%</div>
        <div className="value">Humidity</div>
      </div>
    );
  };

  
const SemiCircleProgressBar1: React.FC<SemiCircleProgressBarProps> = ({ percentage }) => {
    const [offset, setOffset] = useState(0);
  
    useEffect(() => {
      const progress = percentage;
      const offsetValue = (progress / 100) * 180; // 180 for a semi-circle
      setOffset(offsetValue);
    }, [percentage]);
  
    return (
      <div className="semi-circle-progress-bar">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path
            className="background"
            d="M50 10 A40 40 0 0 1 50 90"
            fill="none"
            stroke="#ccc"
            strokeWidth="8"
          />
          <path
            className="progress-bar"
            d="M50 10 A40 40 0 0 1 50 90"
            fill="none"
            stroke="#007bff"
            strokeWidth="8"
            strokeDasharray="180"
            strokeDashoffset={offset}
          />
        </svg>
        <div className="percentage">{percentage}&deg;C</div>
        <div className="value">Temperature</div>
      </div>
    );
  };
     
    return ( 

         <WidgetWrapper className="smart-city_box iaq-box lft-widget-box">  

            <TitleBar title="AQI" icon='https://static.iviva.com/images/Udhayimages/wind-sign.png'></TitleBar> 

            <div className="smart-city-content">   

                    <div className='status-content'>

                    <div className='air-quality-status-overall'>
                        <div className='air-quality-status-box'>
                            <p>Air Quality Will be</p>
                            <h5>Good</h5>
                        </div>

                <div className='air-progress-bars'>

                    <SemiCircleProgressBar1 percentage={50} />

                    <SemiCircleProgressBar percentage={50} />

                </div> 

                    </div> 
                        
                        {statusElements}
                        
                  </div> 
  
            </div>

        </WidgetWrapper> 
    )
}; 
  

export default IAQ_Widget;
