  

import React, { useState, useEffect } from "react";
import { WidgetWrapper, TitleBar, ToggleFilter } from "uxp/components";
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ComposedChart, Line } from "recharts";

interface ExpenditureItem {
  month?: string;
  week?: string;
  Day?: string;
  value: number;
}

interface EnergyConsumptionData {
  month?: ExpenditureItem[];
  week?: ExpenditureItem[];
  day?: ExpenditureItem[];
}

const Street_Light__Status_Widget: React.FunctionComponent = () => {
  const hierarchy = "منطقة المدينة";

  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(2);
  };

  const [energyConsumptionData, setEnergyConsumptionData] =
    useState<EnergyConsumptionData>({});

  const staticData: EnergyConsumptionData = {
    month: [
      { month: "Jan", value: 3461381.65 },
      { month: "Feb", value: 2975839.92 },
      { month: "Mar", value: 2627233.33 },
      { month: "Apr", value: 2339151.96 },
      { month: "May", value: 2502024.79 },
      { month: "Jun", value: 2676857.69 },
      { month: "Jul", value: 881246.59 },
    ],
    week: [
      { week: "Week1", value: 572464 },
      { week: "Week2", value: 702070 },
      { week: "Week3", value: 720070 },
    ],
    day: [
      { Day: "Sun", value: 534042.61 },
      { Day: "Mon", value: 797117.05 },
      { Day: "Tue", value: 794914.45 },
      { Day: "Wed", value: 873147.88 },
      { Day: "Thu", value: 590071.54 },
    ],
  };

  useEffect(() => {
    setEnergyConsumptionData(staticData);
  }, []);

  const [toggleFilterValue, setToggleFilterValue] = useState<"day" | "week" | "month">("day");
  const [filter, setFilter] = useState<"Day" | "Week" | "Month">("Day");

  const handleFilterChange = (value: "day" | "week" | "month") => {
    setToggleFilterValue(value);
    setFilter(value === "day" ? "Day" : value === "week" ? "Week" : "Month");
  };

  const transformData = (
    rawData: EnergyConsumptionData,
    filterType: "day" | "week" | "month"
  ) => {
    let filteredData: { name: string; powerConsumption: number; averageValue?: number }[] = [];
  
    const expenditureData =
      filterType === "day"
        ? rawData.day
        : filterType === "week"
        ? rawData.week
        : rawData.month;
  
    if (!expenditureData) return filteredData;
  
    if (filterType === "day") {
      const daysInWeekFull = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
      ];
      const daysInWeekAbbr = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
      ];
  
      let pastValue = 0;
      filteredData = daysInWeekAbbr.map((abbr, index) => {
        const fullDayName = daysInWeekFull[index];
        const powerEntry = expenditureData.find(
          (entry) => entry.Day === fullDayName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue;
  
        return {
          name: abbr,
          powerConsumption: currentValue,
          averageValue: rollingAverage / 1000,
        };
      });
    } else if (filterType === "week") {
      const WeekNamesFull = ["Week1", "Week2", "Week3", "Week4"];
      let pastValue = 0;
  
      filteredData = WeekNamesFull.map((weekName) => {
        const powerEntry = expenditureData.find(
          (entry) => entry.week === weekName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue;
  
        return {
          name: weekName,
          powerConsumption: currentValue,
          averageValue: rollingAverage / 1000,
        };
      });
    } else if (filterType === "month") {
      const monthNamesFull = [
        "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const monthNamesAbbr = [
        "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      let pastValue = 0;
  
      filteredData = monthNamesAbbr.map((abbr, index) => {
        const fullMonthName = monthNamesFull[index];
        const powerEntry = expenditureData.find(
          (entry) => entry.month === fullMonthName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue;
  
        return {
          name: abbr,
          powerConsumption: currentValue,
          averageValue: rollingAverage / 1000,
        };
      });
    }
  
    return filteredData;
  };
  
  const transformedData1 = transformData(energyConsumptionData, "month");
  const transformedData2 = transformData(energyConsumptionData, "week");
  const transformedData3 = transformData(energyConsumptionData, "day");

  const filterToDataMap: { [key: string]: { name: string; powerConsumption: number; averageValue?: number }[] } = {
    month: transformedData1,
    week: transformedData2,
    day: transformedData3,
  };

  const selectedData = filterToDataMap[toggleFilterValue] || transformedData1;

  const transformedChartData = selectedData.map((item) => ({
    ...item,
    powerConsumption: item.powerConsumption / 1000,
  }));

  const colorArray = ["#005745"];

  return (
    <WidgetWrapper className="smart-city_box waste-bin-box streetlight_status-box">
      <TitleBar
        title="Street Light Alerts"
        icon="https://static.iviva.com/images/Udhayimages/streetlight-alert.png"
      ></TitleBar>

      <div className="smart-city-content">
        
           <div className="status-content">
            <div className="status Attention">
              <h3> 
                  172
                <span></span>
              </h3>
              <p>High</p>
            </div>

            <div className="status Pending">
              <h3> 
                  68
                <span></span>
              </h3>
              <p>Medium</p>
            </div>

            <div className="status Resloved">
              <h3> 
                  27
                <span></span>
              </h3>
              <p>Low</p>
            </div>
          </div>
         

        <div className="technician_chart">
          <div className="sub_title_bar">Installed vs Working lamps</div>

          <div className="progress-bar-container">
            <>
              <div
                className="progress-bar installedLamps"
                style={{
                  width: "55%",
                }}
              ></div>

              <div
                className="progress-bar working-lamps"
                style={{
                  width:"45%",
                }}
              ></div>
            </>
          </div>

          <div className="chart-sec">
            <div className="chart-issue">
              <h3>82341</h3>
              <p>Installed lamps</p>
            </div>

            <div className="chart-pending">
              <h3>70000</h3>
              <p>Working lamps</p>
            </div>
          </div>
        </div>

        <div className="smart-city-content smart-city-status-content" style={{ width: "100%" }}>
          <WidgetWrapper className="smart-city_box energy_consumption-box expenditure-box">
            <TitleBar
              icon="https://static.iviva.com/images/Udhayimages/expenditure.png"
              title="Energy Consumption Expenditure"
            />
            <div className="smart-city-content">
              <div className="technician_chart">
                <div style={{ display: "inline-flex", width: "100%" }}>
                  <div className="chart-top" style={{ width: '40%', marginTop: "0em", display: "inline-block" }}>
                    <div className="sub_title_bar">SAR &#40; x 1000 &#41;</div>
                  </div>
                  <div className="chart-top" style={{ width: '60%', marginTop: "0em", display: "inline-block", textAlign: "right" }}>
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
                </div>

                <div className="status-expenditure-chart" style={{ width: "100%", height: "150px" }}>
                  <ResponsiveContainer>
                    <ComposedChart
                      data={transformedChartData}
                      margin={{
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 30,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid stroke="#1a6f60cf" strokeDasharray="1 1" />
                      <Tooltip formatter={(value: any) => `${value}`} />
                      <Legend />

                      {colorArray.map((color, index) => (
                        <Bar
                          key={`bar-${index}`}
                          barSize={20}
                          dataKey="powerConsumption"
                          name="Expenditure"
                          fill={`url(#color${index})`}
                        />
                      ))}

                      <Line
                        name="Average"
                        type="monotone"
                        dataKey="averageValue"
                        stroke="#62c607"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                      <defs>
                        {colorArray.map((color, index) => (
                          <linearGradient
                            key={`gradient-${index}`}
                            id={`color${index}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="15%" stopColor={"#009b79"} />
                            <stop
                              offset="85%"
                              stopColor={"#005745"}
                              stopOpacity={0.9}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </WidgetWrapper>
          {transformedChartData[0]?.averageValue ? (
            <div className="averagevalue-container">
              Average value:{" "}
              {Math.round(
                transformedChartData[0].averageValue * 1000
              ).toLocaleString("en-US")}{" "}
              SAR
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default Street_Light__Status_Widget;














 