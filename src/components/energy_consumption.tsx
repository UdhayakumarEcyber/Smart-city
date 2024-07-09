
import React, { useState, useEffect } from 'react';
import { WidgetWrapper, TitleBar, ToggleFilter } from "uxp/components";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IContextProvider } from '../uxp';

interface EnergyConsumptionData {
  "Power Consumption"?: {
    [key: string]: { [key: string]: number }[]
  };
  "Burning Hours"?: {
    [key: string]: { [key: string]: number }[]
  };
}

interface IWidgetProps {
  instanceId?: string;
  uxpContext?: IContextProvider;
}

const EnergyConsumption: React.FunctionComponent<IWidgetProps> = (props) => {
  const [energyConsumptionData, setEnergyConsumptionData] = React.useState<EnergyConsumptionData>({});
  const [toggleFilterValue, setToggleFilterValue] = useState<"day" | "week" | "month">("day");
  const [filter, setFilter] = useState<'Day' | 'Week' | 'Month'>('Day');

  const currentDate = new Date();
  currentDate.setDate(0);

 
  const hierarchy = 'منطقة المدينة';
 

  const handleFilterChange = (value: "day" | "week" | "month") => {
    console.log("Selected Filter Value:", value);
    setToggleFilterValue(value);
    if (value === 'day') {
      setFilter('Day');
    } else if (value === 'week') {
      setFilter('Week');
    } else if (value === 'month') {
      setFilter('Month');
    }
  };


  React.useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    let start, end = new Date().toISOString();

    if (toggleFilterValue === "day") {
      let today = new Date();
      var dayOfWeek = today.getUTCDay();
      var diff = today.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0);
      var lastSunday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), diff - 1)).toISOString();

      start = `${lastSunday.substring(0, 10)}T18:30:00.000Z`;
    }

    if (toggleFilterValue === 'week') {
      let today = new Date();
      let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      start = firstDayOfMonth.toISOString().substring(0, 10) + "T18:30:00.000Z";
    }

    if (toggleFilterValue === "month") {
      var today = new Date();
      start = new Date(today.getFullYear(), 0, 1).toISOString();
    }

    try {
      const res = await props.uxpContext.executeAction("TataStreetLightAPI", "GetSyncDataNew", { hierarchy, start: start, end: end, filter }, { json: true });
      setEnergyConsumptionData(res);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };



  const transformData = (rawData: EnergyConsumptionData, filterType: "day" | "week" | "month") => {
    let filteredData: { name: string; powerConsumption: number; burningHours: number }[] = [];

    const powerConsumptionData: (any[] | { [key: string]: { [key: string]: number; }[]; }) = rawData["Power Consumption"] || [];
    const burningHoursData: (any[] | { [key: string]: { [key: string]: number; }[]; }) = rawData["Burning Hours"] || [];


    if (filterType === "day") {
      const daysInWeekFull: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daysInWeekAbbr: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


      filteredData = daysInWeekAbbr.map((abbr, index) => {
        const fullDayName = daysInWeekFull[index];

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + index - 1);
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'short' });
        // const year = currentDate.getFullYear(); 
        const year = currentDate.toLocaleString('default', { year: '2-digit' });
        const dateString = `${day}/${month}/${year}`;

        const powerEntry = (powerConsumptionData as any[]).find((entry: { day: string; }) => entry.day === fullDayName);
        const burningEntry = (burningHoursData as any[]).find((entry: { day: string; }) => entry.day === fullDayName);

        const fullDateString = currentDate.toLocaleDateString(); // Full date string for tooltip


        return {
          name: abbr,
          // name: dateString,
          fullDate: fullDateString,
          powerConsumption: powerEntry ? powerEntry.value : 0,
          burningHours: burningEntry ? burningEntry.value : 0,

        };
      });



    }

    else if (filterType === "week") {
      const WeekNamesFull: string[] = ["Week1", "Week2", "Week3", "Week4"];

      filteredData = WeekNamesFull.map(weekName => {
        const powerEntry = (powerConsumptionData as any[]).find((entry: { week: string; }) => entry.week === weekName);
        const burningEntry = (burningHoursData as any[]).find((entry: { week: string; }) => entry.week === weekName);
        const powerValue = powerEntry ? powerEntry.value : 0;
        const burningValue = burningEntry ? burningEntry.value : 0;

        return {
          name: weekName,
          powerConsumption: powerValue,
          burningHours: burningValue,
        };
      });
    }

    else if (filterType === "month") {

      const startDate = new Date('2024-02-01T00:00:00').toISOString();
      const monthNamesFull: string[] = ["February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthNamesabbr: string[] = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      filteredData = monthNamesabbr.map((abbr, index) => {
        const fullMonthName = monthNamesFull[index];

        const powerEntry = (powerConsumptionData as any[]).find((entry: { month: string; }) => entry.month === fullMonthName);
        const burningEntry = (burningHoursData as any[]).find((entry: { month: string; }) => entry.month === fullMonthName);
        const powerValue = powerEntry ? powerEntry.value : 0;
        const burningValue = burningEntry ? burningEntry.value : 0;

        return {
          name: abbr,
          powerConsumption: powerValue,
          burningHours: burningValue,
        };
      });
    }
    return filteredData;
  };

  const transformedData1 = transformData(energyConsumptionData, 'month');
  const transformedData2 = transformData(energyConsumptionData, 'week'); // Corrected from 'Week' to 'week'
  const transformedData3 = transformData(energyConsumptionData, 'day');

  const filterToDataMap: { [key: string]: any[] } = {
    month: transformedData1,
    week: transformedData2,
    day: transformedData3,
  };

  const selectedData = filterToDataMap[toggleFilterValue] || transformedData1;

  const transformedChartData = selectedData.map((item) => ({
    ...item,
    powerConsumption: item.powerConsumption / 1000,
    burningHours: item.burningHours / 1000,
  }));


  console.log("Filter is", toggleFilterValue);


  return (
    <WidgetWrapper className="smart-city_box energy_consumption-box lft-widget-box">
      <TitleBar icon='https://static.iviva.com/images/Udhayimages/energy.png' title="Streetlight Energy Consumption"> </TitleBar>
      <div className="smart-city-content">
        
        <div className="technician_chart">
          <div className='chart-top'>

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

          <div className='chart-top' style={{ marginTop: "0.5em" }}>
            <div className="sub_title_bar">Total MWh</div>
            <div className="sub_title_bar hrs">Hours</div>
          </div>

          <ResponsiveContainer>

            <AreaChart
              data={transformedChartData}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid stroke="#1a6f60cf" strokeDasharray="1 1" />

              <XAxis dataKey="name" />
              <YAxis yAxisId="left" /> 
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${(value)}`} />


              <Tooltip
                formatter={(value: any, name: any, props: any) => {
                  if (name === "Burning Hours") {
                    return [`${value} hours`, name];
                  } else {
                    return [`${value} MWh`, name];
                  }
                }}
                labelFormatter={(label: string) => {
                  if (toggleFilterValue === 'day') {
                    const dayIndexMap: { [key: string]: number } = {
                      "Sun": 0,
                      "Mon": 1,
                      "Tue": 2,
                      "Wed": 3,
                      "Thu": 4,
                      "Fri": 5,
                      "Sat": 6
                    };
                    const dayIndex = dayIndexMap[label];
                    const currentDate = new Date();
                    const currentDay = currentDate.getDay();
                    const startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - currentDay);
                    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + dayIndex);
                    const day = targetDate.getDate();
                    const month = targetDate.getMonth() + 1;
                    const year = targetDate.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;
                    return `Date: ${formattedDate}`;
                  } else {
                    return `Date: ${label}`;
                  }
                }}
              />


              <Legend />
              <Area
                type="monotone"
                dataKey="powerConsumption"
                name="Power Consumption (MWh)"
                stackId="1"
                stroke="#001912"
                fill="url(#gradient1)"
                yAxisId="left"
              />
              <Area
                type="monotone"
                dataKey="burningHours"
                name="Burning Hours"
                stackId="1"
                stroke="#79dccc"
                fill="url(#gradient2)"
                yAxisId="right"
              />
              <Area
                type="monotone"
                dataKey="hours"
                stackId="0"
                fill="url(#gradient3)"
                yAxisId="right"
                style={{ display: "none" }}
                legendType="none"
              />
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#01a4ef" stopOpacity={0.8} />
                  <stop offset="90%" stopColor="#013335" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#009b79"  />
                  <stop offset="90%" stopColor="#065846"  />
                </linearGradient>
              </defs>
            </AreaChart>

          </ResponsiveContainer>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default EnergyConsumption;