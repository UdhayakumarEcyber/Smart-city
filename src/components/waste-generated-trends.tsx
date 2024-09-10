import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LabelList  } from 'recharts';

import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
 import OrderSummary from './order-summary';
// import Maintenance_Work_Order_Summary from './maintenance-work-order-summary';

const Waste_Generated_Trend: React.FunctionComponent<{}> = () => {  


    const summarydata1 = [
        {
            name: 'Jan', Aug_duration_meeting: 502, Total_hours_booked: 658, Total_hours_accupied: 362, amt: 365,
        },
        {
            name: 'Feb', Aug_duration_meeting: 156, Total_hours_booked: 320, Total_hours_accupied: 11, amt: 654,
        },
        {
            name: 'Mar', Aug_duration_meeting: 235, Total_hours_booked: 124, Total_hours_accupied: 19, amt: 365,
        },
        {
            name: 'Apr', Aug_duration_meeting: 163, Total_hours_booked: 215, Total_hours_accupied: 236, amt: 654,
        },
        {
            name: 'May', Aug_duration_meeting: 169, Total_hours_booked: 322, Total_hours_accupied: 125, amt: 221,
        },
        {
            name: 'Jun', Aug_duration_meeting: 321, Total_hours_booked: 516, Total_hours_accupied: 302, amt: 625,
        },
        {
            name: 'Jul', Aug_duration_meeting: 312, Total_hours_booked: 421, Total_hours_accupied: 124, amt: 325,
        },
         {
            name: 'Aug', Aug_duration_meeting: 235, Total_hours_booked: 124, Total_hours_accupied: 19, amt: 365,
        } 
    ];

    
    const summarydata2 = [ 

        {
            name: 'Week1', Aug_duration_meeting: 502, Total_hours_booked: 658, Total_hours_accupied: 365, amt: 365,
        },
        {
            name: 'Week2', Aug_duration_meeting: 250, Total_hours_booked: 320, Total_hours_accupied: 256, amt: 654,
        },
        {
            name: 'Week 3', Aug_duration_meeting: 125, Total_hours_booked: 252, Total_hours_accupied: 165, amt: 654,
        },
        {
            name: 'Week 4', Aug_duration_meeting: 152, Total_hours_booked: 653, Total_hours_accupied: 156, amt: 654,
        } 
    ];

    
    const summarydata3 = [ 

        {
            name: 'Sun', Aug_duration_meeting: 325, Total_hours_booked: 658, Total_hours_accupied: 362, amt: 365,
        },
        {
            name: 'Mon', Aug_duration_meeting: 257, Total_hours_booked: 320, Total_hours_accupied: 136, amt: 152,
        },
        {
            name: 'Tue', Aug_duration_meeting: 124, Total_hours_booked: 580, Total_hours_accupied: 139, amt: 625,
        },
        {
            name: 'Wed', Aug_duration_meeting: 632, Total_hours_booked: 362, Total_hours_accupied: 165, amt: 652,
        },
        {
            name: 'Thu', Aug_duration_meeting: 254, Total_hours_booked: 425, Total_hours_accupied: 125, amt: 165,
        },
        {
            name: 'Fri', Aug_duration_meeting: 125, Total_hours_booked: 516, Total_hours_accupied: 302, amt: 320,
        },
        {
            name: 'Sat', Aug_duration_meeting: 312, Total_hours_booked: 421, Total_hours_accupied: 124, amt: 852,
        } 
    ];
   

    const [toggleFilterValue, setToggleFilterValue] = React.useState<string>("day");  

    const handleFilterChange = (value:any) => {
        console.log("Selected Filter Value:", value);
        setToggleFilterValue(value);
    };  
 

    const filterToDataMap: Record<string, Array<{ name: string; Aug_duration_meeting: number; Total_hours_booked: number; Total_hours_accupied: number; }>> = {
        month: summarydata1,
        week: summarydata2,
        day: summarydata3, 
    };
     
    const selectedData = filterToDataMap[toggleFilterValue] || summarydata1;

    const [toggleFilterValueday, setToggleFilterValueday] = React.useState<string>("1");  

    const handleFilterChangeday = (value:any) => { 
        setToggleFilterValueday(value);
    };  
  
    return (   

        <WidgetWrapper className="smart-city_box energy_consumption-box lft-widget-box"> 
          
            
            <TitleBar title="Waste Generated Trends" icon='https://static.iviva.com/images/Udhayimages/garbage-white.png'>
                
             <div className='top_tabs'>
                <ToggleFilter  
                      options={[
                          { label: "2023", value: "1" },
                          { label: "2024", value: "2" } 
                      ]}
                      value={toggleFilterValueday}
                      onChange={handleFilterChangeday}
                  /> 
               </div>
                
                </TitleBar>  


        <div className="smart-city-content">  

            <div className="technician_chart">   
           
           <div  className='chart-top'>

           <div className="sub_title_bar">Total Waste (Tons)</div>  

                <ToggleFilter 
                    options={[
                        { label: "7D", value: "day" },
                        { label: "1M", value: "week" }, 
                        { label: "1Y", value: "month" },
                    ]}
                    value={toggleFilterValue}
                    onChange={handleFilterChange}
                />
            </div>

            <ResponsiveContainer >  
                    <BarChart
                        // width={500}
                        // height={180}
                        data={selectedData}
                        margin={{
                            top: 2, right: 0, left: 0, bottom: 2,
                        }}>
                         <CartesianGrid stroke="#1a6f60cf" strokeDasharray="1 1" />
                        <XAxis dataKey="name" />
                        <YAxis orientation="left" />
                        <Tooltip />
                        <Bar barSize={20} dataKey="Aug_duration_meeting" fill="#025639" />
                        <Bar barSize={25} dataKey="Total_hours_booked" fill="#0c7652" />
                        <Bar barSize={25} dataKey="Total_hours_accupied" fill="#0c2e23" />
                    </BarChart> 

            </ResponsiveContainer> 

            </div>  
        </div>

    </WidgetWrapper> 
        
    )
};  

export default Waste_Generated_Trend; 