  



import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 


const StreetLightWorkOrder: React.FunctionComponent<{}> = () => {   

  let [selected, setSelected] = React.useState<string | null>("op-1");
  let [inputValue, setInputValue] = React.useState<string | null>("Work Order");
  let [inputValue1, setInputValue1] = React.useState<string | null>("Location");

 
  const [workOrders, setWorkOrders] = useState([]);
  const apiUrl = 'https://ccc-demo.raseel.city/lucy/workorder/v1/cwos?fields=CWOKey,CWOID,RequesterObjectType,RequesterObjectKey,RequesterObjectID,LocationKey,SiteLocationFullName,CreatedDateTime,ProblemType';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: 'SC:mcr:52cc6fe4f2fdf340'
          }
        });
        const data = await response.json();
        setWorkOrders(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
   

  const streetLightData  = [ 
    {
        id: '1',
        name: 'Attention', 
        value: 12 
    },
    {
        id: '2',
        name: 'Pending', 
        value: 2 
    },
    {
        id: '3',
        name: 'Resloved', 
        value: 12 
    }
];  

  
 
  
      return ( 
  
         
         <WidgetWrapper className="smart-city_box order_summary-box"> 
  
          <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/traffic-light.png'></TitleBar>
  

          <div className='smart-city_box waste-bin-box '>
            <div className="smart-city-content" style={{height:'80px'}}>  
          
                  <div className='status-content'>

                      {streetLightData.map((item) => ( 
                          <div  key={item.id} className={`status ${item.name}`}>
                              <h3>{item.value}</h3>
                              <p>{item.name}</p>
                          </div> 
                      ))}

                  </div>
              </div>
          </div>

          
          <div className="smart-city-content"  style={{height:'215px', borderBottom:'1px solid'}}>

              <div className="chart-top">
                
                  <FormField inline className="showcase-input" >

                        <SearchBox
                            value={inputValue}
                            onChange={(newValue) => { setInputValue(newValue) }}
                            position="left"
                            placeholder=''
                        /> 


                        <SearchBox
                            value={inputValue1}
                            onChange={(newValue) => { setInputValue1(newValue) }}
                            position="left"
                            placeholder=''
                        /> 
                                    
                      <Select
                          selected={selected}
                          options={[
                              { label: "All Alert", value: "op-1" },
                              { label: "All Alert 1", value: "op-2" },
                              { label: "All Alert 2", value: "op-3" },
                          ]}
                          onChange={(value) => { setSelected(value) }}
                          placeholder=" -- select --"
                      />

                      <Select
                          selected={selected}
                          options={[
                              { label: "Alert Type", value: "op-1" },
                              { label: "Alert Type 1", value: "op-2" },
                              { label: "Alert Type 2", value: "op-3" },
                          ]}
                          onChange={(value) => { setSelected(value) }}
                          placeholder=" -- select --"
                      />  
                        
                  </FormField>
            </div>


                <div className='work_order-content'>

                    <table>
                        <thead>
                        <tr>
                            <th style={{width:'30%'}}>CWOID</th>
                            <th style={{width:'20%'}}>Site Location</th>
                            <th style={{width:'30%'}}>Created Date</th>
                            <th style={{width:'20%'}}>Problem Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {workOrders.map((workOrder, index) => (
                            <tr key={index}>
                            <td style={{width:'30%'}}>{workOrder.CWOID}</td>
                            <td style={{width:'20%'}}>{workOrder.SiteLocationFullName}</td>
                            <td style={{width:'30%'}}>{workOrder.CreatedDateTime}</td>
                            <td style={{width:'20%'}}>{workOrder.ProblemType}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                 </div> 
          </div> 

          </WidgetWrapper>  
  
      )
  };
 

export default StreetLightWorkOrder;



















// import React, { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 


// const StreetLightWorkOrder: React.FunctionComponent<{}> = () => {   

//   let [selected, setSelected] = React.useState<string | null>("op-1");
//   let [inputValue, setInputValue] = React.useState<string | null>("Work Order");
//   let [inputValue1, setInputValue1] = React.useState<string | null>("Location");

 

//   var order_Summarydata = [ 
//       {
//           "id": "1", 
//           "work_Order": 'Wo-123456789',
//           "location": "Al Haram Dist", 
//           "alert_Time":"2023-01-11 07:56:46", 
//           'status': 'attention', 
//           "alert_Type" : "Faulty" 
//       },
//       {
//           "id": "2",
//           "work_Order": 'Wo-123456789',
//           "location": "Al Haram Dist", 
//           "alert_Time":"2023-01-11 07:56:46",
//           "status" : "attention",
//           "alert_Type" : "Faulty" 
//       },
//       {
//           "id": "3",
//           "work_Order": 'Wo-123456789',
//           "location": "Al Haram Dist", 
//           "alert_Time":"2023-01-11 07:56:46",
//           "status" : "attention",
//           "alert_Type" : "Offline" 
//       },
//       {
//           "id": "4", 
//           "work_Order": 'Wo-123456789',
//           "location": "Al Haram Dist", 
//           "alert_Time":"2023-01-11 07:56:46",
//           "status" : "pending",
//           "alert_Type" : "Offline" 
//       } ,
//       {
//           "id": "5", 
//           "work_Order": 'Wo-123456789',
//           "location": "Al Haram Dist", 
//           "alert_Time":"2023-01-11 07:56:46",
//           "status" : "pending",
//           "alert_Type" : "Working" 
//       }  
//   ];
   

//   const streetLightData  = [ 
//     {
//         id: '1',
//         name: 'Attention', 
//         value: 12 
//     },
//     {
//         id: '2',
//         name: 'Pending', 
//         value: 2 
//     },
//     {
//         id: '3',
//         name: 'Resloved', 
//         value: 12 
//     }
// ];  

  
//   const getDataItems = (max: number, pageToken: string) => {
//       let last = 0
  
//       if (pageToken !== null) last = parseInt(pageToken);
  
//       let p = new Promise<{ items: Array<any>, pageToken: string }>((resolve, reject) => {
//           let data = order_Summarydata.filter((item: any, key: number) => (key > last && key <= last + max));
//           let response = { items: data, pageToken: (last + data.length).toString() }
//           resolve(response);
//       })
  
//       return p;
//   }
  
//       return ( 
  
         
//          <WidgetWrapper className="smart-city_box order_summary-box"> 
  
//           <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/traffic-light.png'></TitleBar>
  

//           <div className='smart-city_box waste-bin-box '>
//             <div className="smart-city-content" style={{height:'80px'}}>  
          
//                   <div className='status-content'>

//                       {streetLightData.map((item) => ( 
//                           <div  key={item.id} className={`status ${item.name}`}>
//                               <h3>{item.value}</h3>
//                               <p>{item.name}</p>
//                           </div> 
//                       ))}

//                   </div>
//               </div>
//           </div>

          
//           <div className="smart-city-content"  style={{height:'215px', borderBottom:'1px solid'}}>

//               <div className="chart-top">
                
//                   <FormField inline className="showcase-input" >

//                         <SearchBox
//                             value={inputValue}
//                             onChange={(newValue) => { setInputValue(newValue) }}
//                             position="left"
//                             placeholder=''
//                         /> 


//                         <SearchBox
//                             value={inputValue1}
//                             onChange={(newValue) => { setInputValue1(newValue) }}
//                             position="left"
//                             placeholder=''
//                         /> 
                                    
//                       <Select
//                           selected={selected}
//                           options={[
//                               { label: "All Alert", value: "op-1" },
//                               { label: "All Alert 1", value: "op-2" },
//                               { label: "All Alert 2", value: "op-3" },
//                           ]}
//                           onChange={(value) => { setSelected(value) }}
//                           placeholder=" -- select --"
//                       />

//                       <Select
//                           selected={selected}
//                           options={[
//                               { label: "Alert Type", value: "op-1" },
//                               { label: "Alert Type 1", value: "op-2" },
//                               { label: "Alert Type 2", value: "op-3" },
//                           ]}
//                           onChange={(value) => { setSelected(value) }}
//                           placeholder=" -- select --"
//                       />  
                        
//                   </FormField>
//             </div>


//               <DataTable
//                   data={(max, last) => getDataItems(max, last)}
//                   pageSize={10}
//                   columns={[
//                       {
//                           title: "Work Order",
//                           width: "20%",
//                           renderColumn: (item) => <ItemCard
//                               item={item}
//                               subTitleField="work_Order"
//                               className="data-table-item"
//                           />
//                       },
//                       {
//                           title: "Location",
//                           width: "25%",
//                           renderColumn: (item) => <ItemCard
//                               item={item}
//                               subTitleField="location"
//                               className="data-table-item"
//                           />
//                       },
//                       {
//                           title: "Alert Time",
//                           width: "25%",
//                           renderColumn: (item) => <ItemCard
//                               item={item}
//                               subTitleField="alert_Time"
//                               className="data-table-item"
//                           />
//                       },
//                       {
//                           title: "Alert Type",
//                           width: "20%",
//                           renderColumn: (item) => <ItemCard
//                               item={item}
//                               subTitleField="alert_Type"
//                               className="data-table-item"
//                           />
//                       },
//                       {
//                           title: " ",
//                           width: "10%",
//                           renderColumn: (item) => <ItemCard
//                               item={item}
//                               subTitleField=""
//                               className={`data-table-item ${item.status}`}
//                           />

                           
//                       }
//                   ]}
//               /> 
//           </div> 

//           </WidgetWrapper>  
  
//       )
//   };
  

// export default StreetLightWorkOrder;
