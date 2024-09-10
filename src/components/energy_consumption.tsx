 


















import React, { useState, useEffect } from 'react';
import { WidgetWrapper, TitleBar, ToggleFilter } from "uxp/components";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IContextProvider } from '../uxp';

interface EnergyConsumptionData {
  "Power Consumption"?: { month?: string, week?: string, Day?: string, value: number }[];
  "Burning Hours"?: { month?: string, week?: string, Day?: string, value: number }[];
}

interface IWidgetProps {
  instanceId?: string;
  uxpContext?: IContextProvider;
}

const EnergyConsumption: React.FunctionComponent<IWidgetProps> = (props) => {
  const [energyConsumptionData, setEnergyConsumptionData] = useState<EnergyConsumptionData>({});
  const [toggleFilterValue, setToggleFilterValue] = useState<"day" | "week" | "month">("day");
  const [filter, setFilter] = useState<'Day' | 'Week' | 'Month'>('Day');

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

  const staticData = {
    month: {
      "Power Consumption": [
        { "month": "Jan", "value": 3461381.6500000004 },
        { "month": "Feb", "value": 2975839.92 },
        { "month": "Mar", "value": 2627233.3300000005 },
        { "month": "Apr", "value": 2339151.96 },
        { "month": "May", "value": 2502024.7900000005 },
        { "month": "Jun", "value": 2676857.69 },
        { "month": "Jul", "value": 881246.5900000001 }
      ],
      "Burning Hours": [
        { "month": "Jan", "value": 24664212.43 },
        { "month": "Feb", "value": 19771750.77 },
        { "month": "Mar", "value": 18562873.82 },
        { "month": "Apr", "value": 16832931.409999996 },
        { "month": "May", "value": 18263306.800000004 },
        { "month": "Jun", "value": 19503726.179999996 },
        { "month": "Jul", "value": 6452146.63 }
      ]
    },
    week: {
      "Burning Hours": [
        { "week": "Week1", "value": 572464 },
        { "week": "Week2", "value": 702070 },
        { "week": "Week3", "value": 720070 }
      ],
      "Power Consumption": [
        { "week": "Week1", "value": 73191 },
        { "week": "Week2", "value": 98204 },
        { "week": "Week3", "value": 98004 }
      ]
    },
    day: {
      "Burning Hours": [
        { "Day": "Sun", "value": 534042.61 },
        { "Day": "Mon", "value": 797117.05 },
        { "Day": "Tue", "value": 794914.45 },
        { "Day": "Wed", "value": 873147.88 },
        { "Day": "Thu", "value": 590071.54 }
      ],
      "Power Consumption": [
        { "Day": "Sun", "value": 906275.37 },
        { "Day": "Mon", "value": 112155.16 },
        { "Day": "Tue", "value": 111707.84 },
        { "Day": "Wed", "value": 112212.67 },
        { "Day": "Thu", "value": 112327.01 }
      ]
    }
  };

  useEffect(() => {
    setEnergyConsumptionData(staticData[toggleFilterValue]);
  }, [toggleFilterValue]);

  const transformData = (rawData: EnergyConsumptionData, filterType: "day" | "week" | "month") => {
    let filteredData: { name: string; powerConsumption: number; burningHours: number }[] = [];

    const powerConsumptionData: any[] = rawData["Power Consumption"] || [];
    const burningHoursData: any[] = rawData["Burning Hours"] || [];

    if (filterType === "day") {
      const daysInWeekAbbr: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      filteredData = daysInWeekAbbr.map((abbr, index) => {
        const powerEntry = powerConsumptionData.find(entry => entry.Day === abbr);
        const burningEntry = burningHoursData.find(entry => entry.Day === abbr);

        return {
          name: abbr,
          powerConsumption: powerEntry ? powerEntry.value : 0,
          burningHours: burningEntry ? burningEntry.value : 0
        };
      });
    } else if (filterType === "week") {
      const WeekNamesFull: string[] = ["Week1", "Week2", "Week3", "Week4"];

      filteredData = WeekNamesFull.map(weekName => {
        const powerEntry = powerConsumptionData.find(entry => entry.week === weekName);
        const burningEntry = burningHoursData.find(entry => entry.week === weekName);

        return {
          name: weekName,
          powerConsumption: powerEntry ? powerEntry.value : 0,
          burningHours: burningEntry ? burningEntry.value : 0
        };
      });
    } 

    // else if (filterType === "month") {
    //   const monthNamesabbr: string[] = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

    //   filteredData = monthNamesabbr.map((abbr, index) => {
    //     const powerEntry = powerConsumptionData.find(entry => entry.month === monthNamesabbr[index]);
    //     const burningEntry = burningHoursData.find(entry => entry.month === monthNamesabbr[index]);

    //     return {
    //       name: abbr,
    //       powerConsumption: powerEntry ? powerEntry.value : 0,
    //       burningHours: burningEntry ? burningEntry.value : 0
    //     };
    //   });
    // }

    else if (filterType === "month") {
      const monthNamesFull: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
      filteredData = monthNamesFull.map((monthName, index) => {
        const powerEntry = powerConsumptionData.find(entry => entry.month === monthName);
        const burningEntry = burningHoursData.find(entry => entry.month === monthName);
    
        return {
          name: monthName,
          powerConsumption: powerEntry? powerEntry.value : 0,
          burningHours: burningEntry? burningEntry.value : 0
        };
      });
    }


    return filteredData;
  };

  const transformedData = transformData(energyConsumptionData, toggleFilterValue);

  const transformedChartData = transformedData.map((item) => ({
    ...item,
    powerConsumption: item.powerConsumption / 1000,
    burningHours: item.burningHours / 1000,
  }));

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





 