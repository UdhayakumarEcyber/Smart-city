import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,LabelList  } from 'recharts';

import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
 

const Waste_CollectionVehicle: React.FunctionComponent<{}> = () => {  

    return ( 

         <WidgetWrapper className="smart-city_box waste-collection-vehicle lft-widget-box">  

            <TitleBar title="Waste Collection vehicle" icon='https://static.iviva.com/images/Udhayimages/garbage-truck.png'></TitleBar> 

            <div className="smart-city-content">  

                <div className='status-content'>
                        <div className='status attention-status'>
                            <div className='vahicle-icon co2-icon'></div>
                            <p>Carbon Footprint</p>
                            <h2>1,236.0</h2>
                            <span>mgCO2</span>
                        </div>
                        <div className='status fuel-consumption-status'>
                            <div className='vahicle-icon fuel-consumption-icon'></div>
                            <p>Fuel Consumption</p>
                            <h2>1,500</h2>
                            <span>Gallons</span>
                        </div>
                        <div className='status s-consumption-status'>
                            <div className='vahicle-icon s-consumption-icon'></div>
                            <p>$ Consumption</p>
                            <h2>80,730</h2>
                            <span>Saudi Riyal</span>
                        </div>
                </div>
  
            </div>

        </WidgetWrapper> 
    )
};  
  

export default Waste_CollectionVehicle;
