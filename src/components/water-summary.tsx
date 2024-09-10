import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LabelList  } from 'recharts';

import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
 

const Water_SummaryWidget: React.FunctionComponent<{}> = () => {  

    const statusData = [
        {
          iconClass: 'co2-icon',
          title: 'Water Consumption',
          value: '29',
          change: '+40%',
          statusClass: 'red',
          value_status: 'mgd'
        },
        {
          iconClass: 'fuel-consumption-icon',
          title: 'Population',
          value: '9,492',
          change: '+25%',
          statusClass: 'red',
          value_status: ''
        },
        {
          iconClass: 's-consumption-icon',
          title: 'Water Troubles Monthly',
          value: '38',
          change: '-15%',
          statusClass: 'green',
          value_status: ''
        },
      ];

      const statusElements = statusData.map((item, index) => (
        <div className={`status ${item.iconClass}-status`} key={index}>
          <div className={`vehicle-icon ${item.iconClass}`}></div>
          <p>{item.title}</p>
          <h2>{item.value} <span>{item.value_status}</span></h2>
          <span className={item.statusClass}>{item.change}</span>
        </div>
      ));
     
    return ( 

         <WidgetWrapper className="smart-city_box water_summary-box lft-widget-box">  

        <TitleBar title="Water Summary" icon='https://static.iviva.com/images/Udhayimages/water-summary.png'></TitleBar> 

            <div className="smart-city-content">  
                    <div className='status-content'>{statusElements}</div>  
            </div>

        </WidgetWrapper> 
    )
}; 
 

export default Water_SummaryWidget;
