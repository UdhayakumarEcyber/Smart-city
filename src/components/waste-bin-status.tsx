import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LabelList  } from 'recharts';

import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  

const Waste_bin_StatusWidget: React.FunctionComponent<{}> = () => {   

    const completionPercentage = 75;   
    const completionPercentage1 = 25;   

    const wasteBinData  = [ 
        {
            id: '1',
            name: 'Attention', 
            value: 68 
        },
        {
            id: '2',
            name: 'Pending', 
            value: 36 
        },
        {
            id: '3',
            name: 'Resloved', 
            value: 79 
        }
    ];  

    return ( 

         <WidgetWrapper className="smart-city_box waste-bin-box lft-widget-box">  

            <TitleBar title="Waste Bin Status" icon='https://static.iviva.com/images/Udhayimages/waste-bin.png'></TitleBar> 

            <div className="smart-city-content">  

                <div className='status-content'> 
                        {wasteBinData.map((item) => ( 
                            <div  key={item.id} className={`status ${item.name}`}>
                                <h3>{item.value}</h3>
                                <p>{item.name}</p>
                            </div> 
                        ))} 
                </div> 

                <div className="technician_chart">   
 
                    <div className="progress-bar-container">
                        <div className="progress-bar installedLamps" style={{ width: `${completionPercentage}%`}}></div>
                        <div className="progress-bar working-lamps"  style={{ width: `${completionPercentage1}%`}}></div> 
                   </div>  
                         
                    <div className='chart-sec'>
                        <div className='chart-issue'><h3>147</h3><p>Issued</p></div>
                        <div className='chart-pending'><h3>36</h3><p>Pending</p></div>
                    </div>
                </div>  
            </div>

        </WidgetWrapper> 
    )
}; 
  

export default Waste_bin_StatusWidget;
