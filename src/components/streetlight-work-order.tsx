import React, { useState, useEffect } from 'react';
import { FormField, SearchBox, Select, WidgetWrapper, TitleBar } from "uxp/components";
import { IContextProvider } from '../uxp';
import { EventsEnum } from '../index';

interface IWidgetProps {
  uxpContext: IContextProvider;
  workOrderAsset: IWorkOrderAsset
}

interface IWorkOrderAsset {
  longitude?: number;
  latitude?: number;
  viewAngle?: number;
  altitude?: number;
}

interface IWorkOrder {
  _id: string;
  PriorityID: string;
  CWOID: string;
  SiteLocationFullName: string;
  CreatedDateTime: string;
  ProblemType: string;
  CWOKey: string;
  Description: string;
}

const StreetLightWorkOrder: React.FunctionComponent<IWidgetProps> = ({ workOrderAsset, ...props }) => {
  let { uxpContext } = props;
  let [selected, setSelected] = useState<string | null>("StreetLight");
  let [selected1, setSelected1] = useState<string | null>(null);
  let [inputValue, setInputValue] = useState<string>("");
  let [inputValue1, setInputValue1] = useState<string>("");
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
  const last = 500;

  function getWorkOrders() {
    props.uxpContext
      .executeAction("DigitalTwin", "Get Work Orders", { last: last }, { json: true })
      .then((res: any) => {
        console.log("Response From Get Work Orders API is", res, typeof res);
        setWorkOrders(res.results); // Assuming res.results contains the array of work orders
      })
      .catch((e: any) => {
        console.error("Error fetching Work Order data:", e);
      });
  }

  useEffect(() => {
    getWorkOrders();
  }, []);

  const streetLightData = [
    {
      id: '1',
      name: 'High',
      name1: 'Attention',
      value: workOrders.filter(order => order.PriorityID === 'Urgent').length
    },
    {
      id: '2',
      name: 'Medium',
      name1: 'Pending',
      value: workOrders.filter(order => order.PriorityID === 'Normal').length
    },
    {
      id: '3',
      name: 'Low',
      name1: 'Resolved',
      value: workOrders.filter(order => order.PriorityID === 'Low').length
    }
  ];

  const [poleData, setPoleData] = useState<IWorkOrderAsset | null>(null);

  useEffect(() => {
    workOrders.forEach(workOrder => {
      const regex = /Pole\s+(.*?)\s+has\s+a\s+total/;
      const match = workOrder.Description.match(regex);
      const word = match ? match[1] : null;
      if (word) {
        getPoleData(word);
      }
    });
  }, [workOrders]);

  useEffect(() => {
    var lat = poleData?.latitude;
    var long = poleData?.longitude;
    console.log("To Check Lat and Long", lat, long);
  }, [poleData]);

  function getPoleData(poleName: any) {
    props.uxpContext
      .executeAction("DigitalTwin", "GetAssetByPoleName", { poleName }, { json: true })
      .then((res: any) => {
        setPoleData(res);
      })
      .catch((e: any) => {
        console.error("Error fetching Pole data:", e);
      });
  }

  var lat = poleData?.latitude;
  var long = poleData?.longitude;
  var viewAngle = 0;
  var altitude = 75;

  console.log("To Check Lat and Long", lat, long)

  const handleResultClick = () => {
    props.uxpContext.eventHandler?.(
      EventsEnum.DistrictJump,
      {
        longitude: long,
        latitude: lat,
        viewAngle: viewAngle,
        altitude: altitude
      }
    );
  };

  const problemTypeColors: { [key: string]: string } = {
    'Main Fail': 'rgb(106, 186, 53)',
    'AC Voltage': 'rgb(99, 245, 227)',
    'Power Factor': 'rgb(25, 157, 142)',
    'Load Fail': 'rgb(25, 190, 92)',
    'Lux Sensor Blocked': '#619482',
    'Partial Failure': 'rgb(179, 238, 142)',
    'Lamp Flickering': 'rgb(99, 245, 227)'
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const streetLightDataprobtype = [
    {
      id: '1',
      name: 'StreetLight',
      value: ["AC Voltage", "Load Fail", "Lux Sensor Blocked", "Main Fail","Partial Failure","Power Factor","Lamp Flickering"]
    },
    {
      id: '2',
      name: 'CCTV',
      value: ["Intermittent", "Motion Detection Alarm", "Object Removal Detection", "Tamper Detection","System OFF", "Line Crossing Alarm", "Video Loss Alarm", "Intrusion Detection", "Smoke/Fire Detection"]
    }
  ];

  const handleSelectedChange = (value: string) => {
    setSelected(value);
    setSelected1(null);  
  };

  const getSecondSelectOptions = () => {
    if (!selected) return [];

    const selectedItem = streetLightDataprobtype.find(item => item.name === selected);
    return selectedItem ? selectedItem.value.map(val => ({ label: val, value: val })) : [];
  };

  const filteredWorkOrders = workOrders.filter(order =>
    order.CWOID.toLowerCase().includes(inputValue.toLowerCase()) &&
    order.SiteLocationFullName.toLowerCase().includes(inputValue1.toLowerCase()) &&
    (selected1 === null || order.ProblemType === selected1)
  );

  const totalPages = Math.ceil(filteredWorkOrders.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredWorkOrders.length);
  const paginatedWorkOrders = filteredWorkOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <WidgetWrapper className="smart-city_box order_summary-box">
      <TitleBar title="Street Light Work Order Priority" icon='https://static.iviva.com/images/Udhayimages/work-list.png'></TitleBar>
      <div className='smart-city_box waste-bin-box '>
        <div className="smart-city-content" style={{ height: '60px' }}>
          <div className='status-content'>
            {streetLightData.map((item) => (
              <div key={item.id} className={`status ${item?.name1}`}>
                <h3>{item?.value}</h3>
                <p>{item?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/work-order.png'></TitleBar>
      <div className="smart-city-content smart-city-work-order-content" style={{ height: '350px' }}>
        <div className="chart-top">
          <FormField inline className="showcase-input">
            <SearchBox
              value={inputValue}
              onChange={(newValue) => { setInputValue(newValue) }}
              position="left"
              placeholder='Search by CWO ID'
            />
            <SearchBox
              value={inputValue1}
              onChange={(newValue) => { setInputValue1(newValue) }}
              position="left"
              placeholder='Location'
            /> 

            <Select
              selected={selected}
              options={streetLightDataprobtype.map(item => ({ label: item.name, value: item.name }))}
              onChange={(value) => handleSelectedChange(value)}
              placeholder=" -- select --"
            />
            <Select
              selected={selected1}
              options={getSecondSelectOptions()}
              onChange={(value) => setSelected1(value)}
              placeholder=" -- select --" 
            />
          </FormField>
        </div>

        <div className='work_order-content street-light_work_order-content' style={{ height: "300px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>CWO ID</th>
                <th style={{ width: '15%' }}>Site Location</th>
                <th style={{ width: '30%' }}>Created Date</th>
                <th style={{ width: '20%' }}>Problem Type</th>
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedWorkOrders.map((workOrder, index) => (
                <tr key={index}>
                  <td style={{ width: '28%' }}><a onClick={() => handleResultClick()}>{workOrder?.CWOID}</a></td>
                  <td style={{ width: '15%' }}><a onClick={() => handleResultClick()}>{workOrder?.SiteLocationFullName}</a></td>
                  <td style={{ width: '30%' }}><a onClick={() => handleResultClick()}>{workOrder?.CreatedDateTime}</a></td>
                  <td style={{ width: '20%', color: problemTypeColors[workOrder.ProblemType] || 'inherit' }}><a onClick={() => handleResultClick()}>{workOrder?.ProblemType}</a></td>
                  <td style={{ width: '7%' }}><a className='cwo_key' target="_blank" href={`https://ccc-demo.raseel.city/Apps/ivivaFacility/wo-details?key=${workOrder?.CWOKey}`}></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          &#8249;
        </button>
        {Array.from(Array(totalPages).keys()).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page + 1)}
            className={currentPage === page + 1 ? 'active' : ''}
          >
            {page + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &#8250;
        </button>
      </div>
    </WidgetWrapper>
  )
};

export default StreetLightWorkOrder;



















// import React, { useState, useEffect } from 'react';
// import { FormField, SearchBox, Select, WidgetWrapper, TitleBar } from "uxp/components";
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';

// interface IWidgetProps {
//   uxpContext: IContextProvider;
//   workOrderAsset: IWorkOrderAsset
// }

// interface IWorkOrderAsset {
//   longitude?: number;
//   latitude?: number;
//   viewAngle?: number;
//   altitude?: number;
// }

// interface IWorkOrder {
//   _id: string;
//   PriorityID: string;
//   CWOID: string;
//   SiteLocationFullName: string;
//   CreatedDateTime: string;
//   ProblemType: string;
//   CWOKey: string;
//   Description: string;
// }

// const StreetLightWorkOrder: React.FunctionComponent<IWidgetProps> = ({ workOrderAsset, ...props }) => {
//   let { uxpContext } = props;
//   let [selected, setSelected] = useState<string | null>("op-1");
//   let [selected1, setSelected1] = useState<string | null>("op-1");
//   let [inputValue, setInputValue] = useState<string | null>("Work Order");
//   let [inputValue1, setInputValue1] = useState<string | null>("Location");
//   const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
//   const last = 500;

//   function getWorkOrders() {
//     props.uxpContext
//       .executeAction("DigitalTwin", "Get Work Orders", { last: last }, { json: true })
//       .then((res: any) => {
//         console.log("Response From Get Work Orders API is", res, typeof res);
//         setWorkOrders(res.results); // Assuming res.results contains the array of work orders
//       })
//       .catch((e: any) => {
//         console.error("Error fetching Work Order data:", e);
//       });
//   }

//   useEffect(() => {
//     getWorkOrders();
//   }, []);

//   const streetLightData = [
//     {
//       id: '1',
//       name: 'High',
//       name1: 'Attention',
//       value: workOrders.filter(order => order.PriorityID === 'Urgent').length
//     },
//     {
//       id: '2',
//       name: 'Medium',
//       name1: 'Pending',
//       value: workOrders.filter(order => order.PriorityID === 'Normal').length
//     },
//     {
//       id: '3',
//       name: 'Low',
//       name1: 'Resolved',
//       value: workOrders.filter(order => order.PriorityID === 'Low').length
//     }
//   ];

//   const [poleData, setPoleData] = useState<IWorkOrderAsset | null>(null);

//   useEffect(() => {
//     workOrders.forEach(workOrder => {
//       const regex = /Pole\s+(.*?)\s+has\s+a\s+total/;
//       const match = workOrder.Description.match(regex);
//       const word = match ? match[1] : null;
//       if (word) {
//         getPoleData(word);
//       }
//     });
//   }, [workOrders]);

//   useEffect(() => {
//     var lat = poleData?.latitude;
//     var long = poleData?.longitude;
//     console.log("To Check Lat and Long", lat, long);
//   }, [poleData]);

//   function getPoleData(poleName: any) {
//     props.uxpContext
//       .executeAction("DigitalTwin", "GetAssetByPoleName", { poleName }, { json: true })
//       .then((res: any) => {
//         setPoleData(res);
//       })
//       .catch((e: any) => {
//         console.error("Error fetching Pole data:", e);
//       });
//   }

//   var lat = poleData?.latitude;
//   var long = poleData?.longitude;
//   var viewAngle = 0;
//   var altitude = 75;

//   console.log("To Check Lat and Long", lat, long)

//   const handleResultClick = () => {
//     props.uxpContext.eventHandler?.(
//       EventsEnum.DistrictJump,
//       {
//         longitude: long,
//         latitude: lat,
//         viewAngle: viewAngle,
//         altitude: altitude
//       }
//     );
//   };

//   const problemTypeColors: { [key: string]: string } = {
//     'Main Fail': 'rgb(106, 186, 53)',
//     'AC Voltage': 'rgb(99, 245, 227)',
//     'Power Factor': 'rgb(25, 157, 142)',
//     'Load Fail': 'rgb(25, 190, 92)',
//     'Lux Sensor Blocked': '#619482',
//     'Partial Failure': 'rgb(179, 238, 142)',
//     'Lamp Flickering': 'rgb(99, 245, 227)'
//   };

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // Calculate total pages
//   const totalPages = Math.ceil(workOrders.length / pageSize);

//   // Paginate the data
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, workOrders.length);
//   const paginatedWorkOrders = workOrders.slice(startIndex, endIndex);

//   // Function to handle page change
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Function to handle "Previous" button click
//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Function to handle "Next" button click
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   function getDataItems(max: number, last: string): Promise<{ items: any[]; pageToken: string; }> {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <WidgetWrapper className="smart-city_box order_summary-box">
//       <TitleBar title="Street Light Work Order Priority" icon='https://static.iviva.com/images/Udhayimages/work-list.png'></TitleBar>
//       <div className='smart-city_box waste-bin-box '>
//         <div className="smart-city-content" style={{ height: '60px' }}>
//           <div className='status-content'>
//             {streetLightData.map((item) => (
//               <div key={item.id} className={`status ${item?.name1}`}>
//                 <h3>{item?.value}</h3>
//                 <p>{item?.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/work-order.png'></TitleBar>
//       <div className="smart-city-content smart-city-work-order-content" style={{ height: '350px' }}>
//         <div className="chart-top">
//           <FormField inline className="showcase-input">
//             <SearchBox
//               value={inputValue}
//               onChange={(newValue) => { setInputValue(newValue) }}
//               position="left"
//               placeholder=''
//             />
//             <SearchBox
//               value={inputValue1}
//               onChange={(newValue) => { setInputValue1(newValue) }}
//               position="left"
//               placeholder=''
//             />
//             <Select
//               selected={selected}
//               options={[
//                 { label: "All Alert", value: "op-1" },
//                 { label: "All Alert 1", value: "op-2" },
//                 { label: "All Alert 2", value: "op-3" },
//               ]}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" -- select --"
//             />
//             <Select
//               selected={selected1}
//               options={[
//                 { label: "Alert Type", value: "op-1" },
//                 { label: "Alert Type 1", value: "op-2" },
//                 { label: "Alert Type 2", value: "op-3" },
//               ]}
//               onChange={(value) => { setSelected1(value) }}
//               placeholder=" -- select --"
//             />
//           </FormField>
//         </div>

//         <div className='work_order-content street-light_work_order-content' style={{height:"300px"}}>

         
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ width: '28%' }}>CWO ID</th>
//                 <th style={{ width: '15%' }}>Site Location</th>
//                 <th style={{ width: '30%' }}>Created Date</th>
//                 <th style={{ width: '20%' }}>Problem Type</th>
//                 <th style={{ width: '10%' }}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedWorkOrders.map((workOrder, index) => (
//                 <tr key={index}>
//                   <td style={{ width: '28%' }}><a onClick={() => handleResultClick()}>{workOrder?.CWOID}</a></td>
//                   <td style={{ width: '15%' }}><a onClick={() => handleResultClick()}>{workOrder?.SiteLocationFullName}</a></td>
//                   <td style={{ width: '30%' }}><a onClick={() => handleResultClick()}>{workOrder?.CreatedDateTime}</a></td>
//                   <td style={{ width: '20%', color: problemTypeColors[workOrder.ProblemType] || 'inherit' }}><a onClick={() => handleResultClick()}>{workOrder?.ProblemType}</a></td>
//                   <td style={{ width: '7%' }}><a className='cwo_key' target="_blank" href={`https://ccc-demo.raseel.city/Apps/ivivaFacility/wo-details?key=${workOrder?.CWOKey}`}></a></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         </div>
//           <div className="pagination">
//             <button onClick={handlePreviousPage} disabled={currentPage === 1}>
//               &#8249;
//             </button>
//             {Array.from(Array(totalPages).keys()).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page + 1)}
//                 className={currentPage === page + 1 ? 'active' : ''}
//               >
//                 {page + 1}
//               </button>
//             ))}
//             <button onClick={handleNextPage} disabled={currentPage === totalPages}>
//               &#8250;
//             </button>
//           </div>
       
      
//     </WidgetWrapper>
//   )
// };

// export default StreetLightWorkOrder;





















// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';

// interface IWidgetProps {
//   uxpContext: IContextProvider;
//   workOrderAsset: IWorkOrderAsset
// }

// interface IWorkOrderAsset {
//   longitude?: number;
//   latitude?: number;
//   viewAngle?: number;
//   altitude?: number;
// }

// interface IWorkOrder {
//   _id: string;
//   PriorityID: string;
//   CWOID: string;
//   SiteLocationFullName: string;
//   CreatedDateTime: string;
//   ProblemType: string;
//   CWOKey: string;
//   Description: string;
// }

// const StreetLightWorkOrder: React.FunctionComponent<IWidgetProps> = ({ workOrderAsset, ...props }) => {
//   let { uxpContext } = props;
//   let [selected, setSelected] = useState<string | null>("op-1");
//   let [inputValue, setInputValue] = useState<string | null>("Work Order");
//   let [inputValue1, setInputValue1] = useState<string | null>("Location");
//   const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
//   const last = 500;

//   function getWorkOrders() {
//     props.uxpContext
//       .executeAction("DigitalTwin", "Get Work Orders", { last: last }, { json: true })
//       .then((res: any) => {
//         console.log("Response From Get Work Orders API is", res, typeof res);
//         setWorkOrders(res.results); // Assuming res.results contains the array of work orders
//       })
//       .catch((e: any) => {
//         console.error("Error fetching Work Order data:", e);
//       });
//   }

//   useEffect(() => {
//     getWorkOrders();
//   }, []);

//   const streetLightData = [
//     {
//       id: '1',
//       name: 'High',
//       name1: 'Attention',
//       value: workOrders.filter(order => order.PriorityID === 'Urgent').length
//     },
//     {
//       id: '2',
//       name: 'Medium',
//       name1: 'Pending',
//       value: workOrders.filter(order => order.PriorityID === 'Normal').length
//     },
//     {
//       id: '3',
//       name: 'Low',
//       name1: 'Resolved',
//       value: workOrders.filter(order => order.PriorityID === 'Low').length
//     }
//   ];

//   const [poleData, setPoleData] = useState<IWorkOrderAsset | null>(null);

//   useEffect(() => {
//     workOrders.forEach(workOrder => {
//       const regex = /Pole\s+(.*?)\s+has\s+a\s+total/;
//       const match = workOrder.Description.match(regex);
//       const word = match ? match[1] : null;
//       if (word) {
//         getPoleData(word);
//       }
//     });
//   }, [workOrders]);

//   useEffect(() => {
//     var lat = poleData?.latitude;
//     var long = poleData?.longitude;
//     console.log("To Check Lat and Long", lat, long);
//   }, [poleData]);

//   function getPoleData(poleName: any) {
//     props.uxpContext
//       .executeAction("DigitalTwin", "GetAssetByPoleName", { poleName }, { json: true })
//       .then((res: any) => {
//         setPoleData(res);
//       })
//       .catch((e: any) => {
//         console.error("Error fetching Pole data:", e);
//       });
//   }

//   var lat = poleData?.latitude;
//   var long = poleData?.longitude;
//   var viewAngle = 0;
//   var altitude = 75;

//   console.log("To Check Lat and Long", lat, long)

//   const handleResultClick = () => {
//     props.uxpContext.eventHandler?.(
//       EventsEnum.DistrictJump,
//       {
//         longitude: long,
//         latitude: lat,
//         viewAngle: viewAngle,
//         altitude: altitude
//       }
//     );
//   };

//   const problemTypeColors: { [key: string]: string } = {
//     'Main Fail': 'rgb(106, 186, 53)',
//     'AC Voltage': 'rgb(99, 245, 227)',
//     'Power Factor': 'rgb(25, 157, 142)',
//     'Load Fail': 'rgb(25, 190, 92)',
//     'Lux Sensor Blocked': '#619482',
//     'Partial Failure': 'rgb(179, 238, 142)',
//     'Lamp Flickering': 'rgb(99, 245, 227)'
//   }; 


//  // Pagination state
//  const [currentPage, setCurrentPage] = useState(1);
//  const pageSize = 10;

//  // Calculate total pages
//  const totalPages = Math.ceil(workOrders.length / pageSize);

//  // Paginate the data
//  const startIndex = (currentPage - 1) * pageSize;
//  const endIndex = Math.min(startIndex + pageSize, workOrders.length);
//  const paginatedWorkOrders = workOrders.slice(startIndex, endIndex);

//  // Function to handle page change
//  const handlePageChange = (page: number) => {
//      setCurrentPage(page);
//  };

//  // Function to handle "Previous" button click
//  const handlePreviousPage = () => {
//      if (currentPage > 1) {
//          setCurrentPage(currentPage - 1);
//      }
//  };

//  // Function to handle "Next" button click
//  const handleNextPage = () => {
//      if (currentPage < totalPages) {
//          setCurrentPage(currentPage + 1);
//      }
//  }; 

//   function getDataItems(max: number, last: string): Promise<{ items: any[]; pageToken: string; }> {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <WidgetWrapper className="smart-city_box order_summary-box"> 
     
//       <TitleBar title="Street Light Work Order Priority" icon='https://static.iviva.com/images/Udhayimages/work-list.png'></TitleBar>
     
//       <div className='smart-city_box waste-bin-box '>
//         <div className="smart-city-content" style={{ height: '80px' }}>
//           <div className='status-content'>
//             {streetLightData.map((item) => (
//               <div key={item.id} className={`status ${item?.name1}`}>
//                 <h3>{item?.value}</h3>
//                 <p>{item?.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/work-order.png'></TitleBar>
    
    
//       <div className="smart-city-content"  style={{height:'350px'}}>
       
//         <div className="chart-top">
//           <FormField inline className="showcase-input">
//             <SearchBox
//               value={inputValue}
//               onChange={(newValue) => { setInputValue(newValue) }}
//               position="left"
//               placeholder=''
//             />
//             <SearchBox
//               value={inputValue1}
//               onChange={(newValue) => { setInputValue1(newValue) }}
//               position="left"
//               placeholder=''
//             />
//             <Select
//               selected={selected}
//               options={[
//                 { label: "All Alert", value: "op-1" },
//                 { label: "All Alert 1", value: "op-2" },
//                 { label: "All Alert 2", value: "op-3" },
//               ]}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" -- select --"
//             />
//             <Select
//               selected={selected}
//               options={[
//                 { label: "Alert Type", value: "op-1" },
//                 { label: "Alert Type 1", value: "op-2" },
//                 { label: "Alert Type 2", value: "op-3" },
//               ]}
//               onChange={(value) => { setSelected(value) }}
//               placeholder=" -- select --"
//             />
//           </FormField>
//         </div> 

//           {/* <div className='work_order-content street-light_work_order-content'>
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ width: '28%' }}>CWO ID</th>
//                 <th style={{ width: '15%' }}>Site Location</th>
//                 <th style={{ width: '30%' }}>Created Date</th>
//                 <th style={{ width: '20%' }}>Problem Type</th>
//                 <th style={{ width: '10%' }}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {workOrders.map((workOrder, index) => (
//                 <tr key={index}>
//                   <td style={{ width: '28%' }}><a onClick={() => handleResultClick()}>{workOrder?.CWOID}</a></td>
//                   <td style={{ width: '15%' }}><a onClick={() => handleResultClick()}>{workOrder?.SiteLocationFullName}</a></td>
//                   <td style={{ width: '30%' }}><a onClick={() => handleResultClick()}>{workOrder?.CreatedDateTime}</a></td>
//                   <td style={{ width: '20%', color: problemTypeColors[workOrder.ProblemType] || 'inherit' }}><a onClick={() => handleResultClick()}>{workOrder?.ProblemType}</a></td>
//                   <td style={{ width: '7%' }}><a className='cwo_key' target="_blank" href={`https://ccc-demo.raseel.city/Apps/ivivaFacility/wo-details?key=${workOrder?.CWOKey}`}></a></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>      */}

 
//           <div className='work_order-content street-light_work_order-content'>
//             <table>
//                 <thead>
//                     <tr>
//                         <th style={{ width: '28%' }}>CWO ID</th>
//                         <th style={{ width: '15%' }}>Site Location</th>
//                         <th style={{ width: '30%' }}>Created Date</th>
//                         <th style={{ width: '20%' }}>Problem Type</th>
//                         <th style={{ width: '10%' }}></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {paginatedWorkOrders.map((workOrder, index) => (
//                         <tr key={index}>
//                             <td style={{ width: '28%' }}><a onClick={() => handleResultClick()}>{workOrder?.CWOID}</a></td>
//                             <td style={{ width: '15%' }}><a onClick={() => handleResultClick()}>{workOrder?.SiteLocationFullName}</a></td>
//                             <td style={{ width: '30%' }}><a onClick={() => handleResultClick()}>{workOrder?.CreatedDateTime}</a></td>
//                             <td style={{ width: '20%', color: problemTypeColors[workOrder.ProblemType] || 'inherit' }}><a onClick={() => handleResultClick()}>{workOrder?.ProblemType}</a></td>
//                             <td style={{ width: '7%' }}><a className='cwo_key' target="_blank" href={`https://ccc-demo.raseel.city/Apps/ivivaFacility/wo-details?key=${workOrder?.CWOKey}`}></a></td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table> 
//         </div>    
  
//          <div className="pagination">
//             <button onClick={handlePreviousPage} disabled={currentPage === 1}>
//               &#8249;
//             </button>
//             {Array.from(Array(totalPages).keys()).map((page) => (
//                 <button key={page} onClick={() => handlePageChange(page + 1)}>
//                     {page + 1}
//                 </button>
//             ))}
//             <button onClick={handleNextPage} disabled={currentPage === totalPages}>
//                 &#8250;
//             </button>
//         </div>   
//       </div>
      
//     </WidgetWrapper>
//   )
// };

// export default StreetLightWorkOrder;




















// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
// import { IContextProvider } from '../uxp';
// import { EventsEnum } from '../index';

// interface IWidgetProps {
//   uxpContext: IContextProvider;  
//   workOrderAsset:IWorkOrderAsset
// } 

// interface IWorkOrderAsset {
//   // name: string;
//   longitude?: number;
//   latitude?: number;
//   viewAngle?: number;
//   altitude?: number;
// }  

// const StreetLightWorkOrder: React.FunctionComponent<IWidgetProps> = ({ workOrderAsset, ...props }) => {
//  // const StreetLightWorkOrder: React.FunctionComponent<IWidgetProps> = (props) => { 
  

//  let { uxpContext} = props;  

//   let [selected, setSelected] = React.useState<string | null>("op-1");
//   let [inputValue, setInputValue] = React.useState<string | null>("Work Order");
//   let [inputValue1, setInputValue1] = React.useState<string | null>("Location");

 
//   const [workOrders, setWorkOrders] = useState([]); 

//   const last = 500;

//   function getWorkOrders() { 
//     props.uxpContext
//       .executeAction("DigitalTwin", "Get Work Orders", {last: last}, { json: true })
//       .then((res: any) => {
//         console.log("Response From Get Work Orders API is", res, typeof res);
//         setWorkOrders(res);
//        // setLoading(false);  
//       })
//       .catch((e: any) => {
//         console.error("Error fetching Work Order data:", e);
//        // setLoading(false);  
//       });
//   }  
  
//   React.useEffect(() => {
//     getWorkOrders();
//   }, []); 

 

// const streetLightData = [
//     {
//       id: '1',
//       name: 'High',
//       name1:'Attention',
//       value: workOrders.filter(order => order.PriorityID === 'Urgent').length
//     },
//     {
//       id: '2',
//       name: 'Medium',
//       name1:'Pending',
//       value: workOrders.filter(order => order.PriorityID === 'Normal').length
//     },
//     {
//       id: '3',
//       name: 'Low',
//       name1:'Resloved',
//       value: workOrders.filter(order => order.PriorityID === 'Low').length
//     }
//   ];  
    
// const [poleData, setPoleData] = useState(null);

// React.useEffect(() => {
//   workOrders.forEach(workOrder => {
//     const regex = /Pole\s+(.*?)\s+has\s+a\s+total/;
//     const match = workOrder.Description.match(regex);
  
//     const word = match ? match[1] : null;
//     console.log(word);
 
//     if (word) {
//       getPoleData(word);
//     }  
//   });
// }, [workOrders]); 

// React.useEffect(() => {
//   var lat = poleData?.latitude;
//   var long = poleData?.longitude; 
//   console.log("To Check Lat and Long", lat, long);
// }, [poleData]);

// function getPoleData(poleName: any) { 
//   props.uxpContext
//     .executeAction("DigitalTwin", "GetAssetByPoleName", { poleName }, { json: true })
//     .then((res: any) => {
//       setPoleData(res);  
//     })
//     .catch((e: any) => {
//       console.error("Error fetching Pole data:", e); 
//     });
// }

 
//   // console.log("my pole lat", lat);
//   // console.log("my pole lat",long); 

//   var lat = poleData?.latitude;
//   var long = poleData?.longitude; 
//     var viewAngle= 0; 
//     var altitude = 75;


//   console.log("To Check Lat and Long",lat, long )
  
//   const handleResultClick = () => { 

//     props.uxpContext.eventHandler?.(
//       EventsEnum.DistrictJump, 
//         {  
//           longitude: long,
//           latitude: lat,
//           viewAngle : viewAngle,
//           altitude:altitude
//         }
//       ); 
      
//     console.log("Hi Hello",long, lat)
//   }; 
 

   
//   const problemTypeColors: { [key: string]: string } = {
//     'Main Fail': 'rgb(106, 186, 53)',
//     'AC Voltage': 'rgb(99, 245, 227)',
//     'Power Factor': 'rgb(25, 157, 142)',
//     'Load Fail': 'rgb(25, 190, 92)',
//     'Lux Sensor Blocked': '#619482',
//     'Partial Failure': 'rgb(179, 238, 142',
//     'Lamp Flickering': 'rgb(99, 245, 227)'
//   };
 
 
//       return (  
         
//          <WidgetWrapper className="smart-city_box order_summary-box"> 
  
//           <TitleBar title="Street Light Work Order Priority" icon='https://static.iviva.com/images/Udhayimages/work-list.png'></TitleBar>
  

//           <div className='smart-city_box waste-bin-box '>
//             <div className="smart-city-content" style={{height:'80px'}}>  
          
//                   <div className='status-content'> 

//                          {streetLightData.map((item) => ( 
//                           <div  key={item.id} className={`status ${item?.name1}`}>
//                               <h3>{item?.value}</h3>
//                               <p>{item?.name}</p>
//                           </div> 
//                       ))}  

//                   </div>
//               </div>
//           </div>

//           <TitleBar title="Street Light Work Order" icon='https://static.iviva.com/images/Udhayimages/work-order.png'></TitleBar>
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


//                 <div className='work_order-content'>

//                     <table>
//                         <thead>
//                         <tr>
//                             <th style={{width:'28%'}}>CWO ID</th>
//                             <th style={{width:'15%'}}>Site Location</th>
//                             <th style={{width:'30%'}}>Created Date</th>
//                             <th style={{width:'20%'}}>Problem Type</th>
//                             <th style={{width:'10%'}}></th>
//                         </tr>
//                         </thead>
//                         <tbody> 
//                         {workOrders.map((workOrder, index) => (
//                             <tr key={index}>
//                                 <td style={{width:'28%'}}><a onClick={() => handleResultClick()}>{workOrder?.CWOID}</a></td>
//                                 <td style={{width:'15%'}}><a onClick={() => handleResultClick()}>{workOrder?.SiteLocationFullName}</a></td>
//                                 <td style={{width:'30%'}}><a onClick={() => handleResultClick()}>{workOrder?.CreatedDateTime}</a></td>
//                                 {/* <td style={{width:'20%'}}>{workOrder.ProblemType}</td> */}
//                                 <td style={{width:'20%', color: problemTypeColors[workOrder.ProblemType] || 'inherit'}}><a onClick={() => handleResultClick()}>{workOrder?.ProblemType}</a></td>
//                                 <td style={{width:'7%'}}><a className='cwo_key' target="_blank" href={`https://ccc-demo.raseel.city/Apps/ivivaFacility/wo-details?key=${workOrder?.CWOKey}`}></a></td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>

//                  </div> 
//           </div> 

//           </WidgetWrapper>  
  
//       )
//   };
 

// export default StreetLightWorkOrder;
 
 


 