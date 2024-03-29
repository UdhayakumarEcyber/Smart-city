import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
  
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
   
const CCTVOverviewWidget: React.FunctionComponent<{}> = () => {   

    const cctvData = [
        {  
          id: 1, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District1.jpeg', 
          selectOptions: ['Al Haram District, Cam 100', 'Al Haram District, Cam 101', 'Al Haram District, Cam 102'],
          selectedOption: 'Al Haram District, Cam 102', 
        }, 
        {  
          id: 2, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-1.gif', 
          selectOptions: ['Al Masjid An Nabawi, Cam 34', 'Al Masjid An Nabawi, Cam 35', 'Al Masjid An Nabawi, Cam 36'],
          selectedOption: 'Al Masjid An Nabawi, Cam 34', 
        },
        {  
          id: 3, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District3.jpg', 
          selectOptions: ['Al Haram District, Cam 20', 'Al Haram District, Cam 21', 'Al Haram District, Cam 22'],
          selectedOption: 'Al Haram District, Cam 20', 
        },
        {  
          id: 4, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District4.jpg',
          selectOptions: ['Al Haram District, Cam 15', 'Al Haram District, Cam 16', 'Al Haram District, Cam 17'],
          selectedOption: 'Al Haram District, Cam 15',  
        },
        {  
          id: 5, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-2.gif', 
          selectOptions: ['Al Haram District, Cam 46', 'Al Haram District, Cam 47', 'Al Haram District, Cam 48'],
          selectedOption: 'Al Haram District, Cam 46', 
        },
        {  
          id: 6, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-7.gif',
          selectOptions: ['Al Masjid An Nabawi, Cam 26', 'Al Masjid An Nabawi, Cam 27', 'Al Masjid An Nabawi, Cam 27'],
          selectedOption: 'Al Masjid An Nabawi, Cam 26', 
        },
        {  
          id: 7, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-3.gif', 
          selectOptions: ['Al Haram District, Cam 20', 'Al Haram District, Cam 21', 'Al Haram District, Cam 22'],
          selectedOption: 'Al Haram District, Cam 20', 
        },
        {  
          id: 8, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District3.jpg', 
          selectOptions: ['Al Haram District, Cam 57', 'Al Haram District, Cam 58', 'Al Haram District, Cam 59'],
          selectedOption: 'Al Haram District, Cam 57', 
        },
        {  
          id: 9,  
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-4.gif', 
          selectOptions: ['Al Masjid An Nabawi, Cam 5', 'Al Masjid An Nabawi, Cam 6', 'Al Masjid An Nabawi, Cam 7'],
          selectedOption: 'Al Masjid An Nabawi, Cam 5', 
        },
        {  
          id: 10, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/al_haram-bg.jpg', 
          selectOptions: ['Al Haram District, Cam 74', 'Al Haram District, Cam 75', 'Al Haram District, Cam 76'],
          selectedOption: 'Al Haram District, Cam 74', 
        },
        {  
          id: 11, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District1.jpeg',
          selectOptions: ['Al Masjid An Nabawi, Cam 26', 'Al Masjid An Nabawi, Cam 27', 'Al Masjid An Nabawi, Cam 27'],
          selectedOption: 'Al Masjid An Nabawi, Cam 26', 
        },
        {  
          id: 12, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-5.gif', 
          selectOptions: ['Al Haram District, Cam 20', 'Al Haram District, Cam 21', 'Al Haram District, Cam 22'],
          selectedOption: 'Al Haram District, Cam 20', 
        },
        {  
          id: 13, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/Al-Haram-District3.jpg', 
          selectOptions: ['Al Haram District, Cam 57', 'Al Haram District, Cam 58', 'Al Haram District, Cam 59'],
          selectedOption: 'Al Haram District, Cam 57', 
        },
        {  
          id: 14,  
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/city-6.gif', 
          selectOptions: ['Al Masjid An Nabawi, Cam 5', 'Al Masjid An Nabawi, Cam 6', 'Al Masjid An Nabawi, Cam 7'],
          selectedOption: 'Al Masjid An Nabawi, Cam 5', 
        },
        {  
          id: 15, 
          cctv_pict: 'https://static.iviva.com/images/Udhayimages/al_haram-bg.jpg', 
          selectOptions: ['Al Haram District, Cam 74', 'Al Haram District, Cam 75', 'Al Haram District, Cam 76'],
          selectedOption: 'Al Haram District, Cam 74', 
        }       
      ];

      const [data, setData] = useState(cctvData);

      const handleSelectChange = (itemId: number, newValue: string) => { 
        setData((prevData) =>
          prevData.map((item) =>
            item.id === itemId ? { ...item, selectedOption: newValue } : item
          )
        );
      };  

      const [toggleFilterValue, setToggleFilterValue] = React.useState<string>("day");  

        const handleFilterChange = (value:any) => { 
            setToggleFilterValue(value);
        };  

  
return ( 

    <WidgetWrapper className="smart-city_box cctv-overview-box">  

       <TitleBar title="CCTV" icon='https://static.iviva.com/images/Udhayimages/security-camera.png'>
        
            <ToggleFilter  
                  options={[
                      { label: "OVERVIEW", value: "day" },
                      { label: "VIRTUAL PATROL", value: "week" } 
                  ]}
                  value={toggleFilterValue}
                  onChange={handleFilterChange}
              />  
    
            </TitleBar> 

       <div className="smart-city-content">   

               <div className='status-content'>  

                   {data.map((item) => (
                  <div className='cctv-list' key={item.id}>
                     
                    <select
                      value={item.selectedOption}
                      onChange={(e) => handleSelectChange(item.id, e.target.value)}
                    >
                      {item.selectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <div className='cctv-pict'>
                         <img src={item.cctv_pict} alt='CCTV Picture' />
                    </div>

                  </div>
                ))} 
                   
          </div> 

       </div>

   </WidgetWrapper> 
)
}; 

export default CCTVOverviewWidget;