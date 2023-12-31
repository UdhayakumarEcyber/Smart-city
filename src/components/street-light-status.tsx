import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import StreetLightStatusChart from './lightStatusChart'; 


interface IWidgetProps { 
    instanceId?: string,
} 
 
const Street_Light__Status_Widget: React.FunctionComponent<IWidgetProps> = () => {   

    const completionPercentage = 75;   

    // const streetLightData  = [ 
    //     {
    //         id: '1',
    //         name: 'Attention', 
    //         value: 135 
    //     },
    //     {
    //         id: '2',
    //         name: 'Pending', 
    //         value: 56 
    //     },
    //     {
    //         id: '3',
    //         name: 'Resloved', 
    //         value: 245 
    //     }
    // ];  

    const streetLightData  = [ 
        {
            id: '1',
            name: 'Open', 
            clname: 'Attention', 
            unit : '',
            value: 135 
        },
        {
            id: '2',
            name: 'TAT', 
            clname: 'Pending', 
            unit : 'mints',
            value: 56 
        },
        {
            id: '3',
            name: 'Closed', 
            clname: 'Resloved', 
            unit : '',
            value: 245 
        }
    ];  


    const maintenance_Permits_Data  = [ 
        {
            id: '1',
            name: 'Installed lamps', 
            clname: 'chart-issue', 
            value: 234 
        },
        {
            id: '2',
            name: 'Working lamps', 
            clname: 'chart-pending', 
            value: 13 
        } 
    ];  
    
      



    return ( 

         <WidgetWrapper className="smart-city_box waste-bin-box">  

            <TitleBar title="Street Light Alerts" icon='https://static.iviva.com/images/Udhayimages/traffic-light.png'></TitleBar> 

            <div className="smart-city-content">  

                <div className='status-content'>

                    {streetLightData.map((item) => ( 
                        <div  key={item.id} className={`status ${item.clname}`}>
                            <h3>{item.value} <span>{item.unit}</span></h3>
                            <p>{item.name}</p>
                        </div> 
                    ))}

                </div>

                <div className="technician_chart">  
                
                <div className='sub_title_bar'>Installed vs Working lamps</div>  

                    <div className="progress-bar-container"><div className="progress-bar" style={{ width: `${completionPercentage}%`}}></div></div> 
   
                    <div className='chart-sec'>

                        
                    {maintenance_Permits_Data.map((item) => ( 
                        <div  key={item.id} className={item.clname}>
                            <h3>{item.value}</h3>
                            <p>{item.name}</p>
                        </div> 
                    ))} 
                        {/* <div className='chart-issue'><h3>234</h3><p>Installed lamps </p></div>
                        <div className='chart-pending'><h3>13</h3><p>Working lamps </p></div> */}
                    </div> 
                </div>   

                <div className="smart-city-content">  
                    <StreetLightStatusChart />  
                </div>
            </div>

        </WidgetWrapper> 
    )
}; 

  

export default Street_Light__Status_Widget;
