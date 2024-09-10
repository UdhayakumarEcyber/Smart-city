import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
 

const Water_ConsumptionWidget: React.FunctionComponent<{}> = () => {  

    
    const water_consumption_data1 = [
        {
          name: 'Jan', 
          consumption: 1950,
          amt: 2400,
        },
        {
          name: 'Feb', 
          consumption: 6500,
          amt: 2210,
        },
        {
          name: 'Mar', 
          consumption: 5800,
          amt: 2290,
        },
        {
          name: 'Apr', 
          consumption: 3908,
          amt: 2000,
        },
        {
          name: 'May', 
          consumption: 1680,
          amt: 2181,
        },
        {
          name: 'Jun', 
          consumption: 3800,
          amt: 2500,
        },
        {
          name: 'Jul', 
          consumption: 2350,
          amt: 2100,
        }, 
        {
          name: 'Aug', 
          consumption: 3908,
          amt: 2000,
        },
        {
          name: 'Sep', 
          consumption: 1680,
          amt: 2181,
        },
        {
          name: 'Oct', 
          consumption: 3800,
          amt: 2500,
        },
        {
          name: 'Nov', 
          consumption: 2350,
          amt: 2100,
        },
        {
          name: 'Dec', 
          consumption: 2417,
          amt: 2181,
        }
      ];

      const water_consumption_data2 = [
        {
          name: 'Week 1', 
          consumption: 8000,
          amt: 2400,
        },
        {
          name: 'Week 2', 
          consumption: 1398,
          amt: 2210,
        },
        {
          name: 'Week 3', 
          consumption: 1680,
          amt: 2290,
        },
        {
          name: 'Week 4', 
          consumption: 3908,
          amt: 2000,
        } 
      ];
    
      const water_consumption_data3 = [
        {
          name: 'Sun', 
          consumption: 7540,
          amt: 2400,
        },
        {
          name: 'Mon', 
          consumption: 6300,
          amt: 2210,
        },
        {
          name: 'Tue', 
          consumption: 4596,
          amt: 2290,
        },
        {
          name: 'Wed', 
          consumption: 3580,
          amt: 2000,
        },
        {
          name: 'Thu', 
          consumption: 4800,
          amt: 2181,
        },
        {
          name: 'Fri', 
          consumption: 5020,
          amt: 2500,
        },
        {
          name: 'Sat', 
          consumption: 6500,
          amt: 2100,
        },
      ];


      const [toggleFilterValue, setToggleFilterValue] = React.useState<string>("day");  

      const handleFilterChange = (value:any) => {
          console.log("Selected Filter Value:", value);
          setToggleFilterValue(value);
      };  
   
  
      const filterToDataMap: Record<string, Array<{ name: string;  consumption: number; amt: number; }>> = {
          month: water_consumption_data1,
          week: water_consumption_data2,
          day: water_consumption_data3, 
      };
       
      const water_consumption_data = filterToDataMap[toggleFilterValue] || water_consumption_data1;

      
        return ( 
    
             <WidgetWrapper className="smart-city_box water_consumption-box lft-widget-box">  
    
                <TitleBar title="Water Consumption" icon='https://static.iviva.com/images/Udhayimages/waterdrop.png'></TitleBar> 
    
                <div className="smart-city-content">  

                  <div  className='chart-top'>

                    <div className="sub_title_bar">Total kW</div>  

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
    
                    <div className='status-content'> 
                     

                      <ResponsiveContainer> 
                          <AreaChart
                            width={500}
                            height={350}
                            data={water_consumption_data}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#1a6f60cf" strokeDasharray="1 1" /> 

                            <XAxis dataKey="name" fill='#ffffff'/>
                            <YAxis yAxisId="left" fill='#ffffff'/>  
                            <Tooltip /> 
                            <Legend />
                                    <Area
                                      type="monotone"
                                      dataKey="consumption"
                                      name="Consumption"
                                      stackId="1"
                                      stroke="#001912"
                                      fill="url(#gradient1)"
                                      yAxisId="left"
                                    /> 
                            <defs>
                            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="10%" stopColor="#01a4ef" stopOpacity={0.8} />
                              <stop offset="90%" stopColor="#0e2c33" stopOpacity={0.9} />
                            </linearGradient>
                                    
                                    </defs>
                          </AreaChart>    

                         </ResponsiveContainer>
     
                             
                    </div>
      
                </div>
    
            </WidgetWrapper> 
        )
    }; 
     

export default Water_ConsumptionWidget;
