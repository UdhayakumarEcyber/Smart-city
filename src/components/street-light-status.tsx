import React, { useState, useEffect } from "react";
import { WidgetWrapper, TitleBar, ToggleFilter } from "uxp/components";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { IContextProvider } from "../uxp";
import StreetLightStatusChart from "./lightStatusChart";
import { ComposedChart, Line } from "recharts";

// import EnergyConsumption from './energy_consumption';

interface IWidgetProps {
  instanceId?: string;
  uxpContext?: IContextProvider;

  ilmAlerts?: {
    "AC Voltage"?: string;
    "Load Fail"?: string;
    "Lux Sensor Blocked"?: string;
    "Main Fail"?: string;
    "Partial Failure"?: string;
    "Power Factor"?: string;
  };
}

interface EnergyConsumptionData {
  Expenditure?: {
    [key: string]: { [key: string]: number }[];
  };
}

const Street_Light__Status_Widget: React.FunctionComponent<IWidgetProps> = (
  props
) => {
  const [health, setHealth] = useState(null);
  const [lampdata, setLampData] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const hierarchy = "منطقة المدينة";

  function getHealthData() {
    props.uxpContext
      .executeAction(
        "TataStreetLightAPI",
        "Alert Summary",
        { hierarchy: hierarchy },
        { json: true }
      )
      .then((res: any) => {
        console.log("Response From API is", res, typeof res);
        setHealth(res);
        setLoading(false);
      })
      .catch((e: any) => {
        console.error("Error fetching health data:", e);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    getHealthData();
  }, []);

  function getsetLampData() {
    props.uxpContext
      .executeAction(
        "TataStreetLightAPI",
        "Installed vs Working Lamps (ILM)/Devices (GLM)",
        {},
        { json: true }
      )
      .then((res: any) => {
        console.log("Response From lampdata API is", res, typeof res);
        setLampData(res);
        setLoading(false);
      })
      .catch((e: any) => {
        console.error("Error fetching health data:", e);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    getsetLampData();
  }, []);

  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(2);
  };

  const [energyConsumptionData, setEnergyConsumptionData] =
    React.useState<EnergyConsumptionData>({});
  const [toggleFilterValue, setToggleFilterValue] = useState<
    "day" | "week" | "month"
  >("day");
  const [filter, setFilter] = useState<"Day" | "Week" | "Month">("Day");

  const currentDate = new Date();
  currentDate.setDate(0);

  const startDate = currentDate.toISOString();
  const endDate = new Date().toISOString();

  const handleFilterChange = (value: "day" | "week" | "month") => {
    console.log("Selected Filter Value:", value);
    setToggleFilterValue(value);
    if (value === "day") {
      setFilter("Day");
    } else if (value === "week") {
      setFilter("Week");
    } else if (value === "month") {
      setFilter("Month");
    }
  };

  console.log("for Check context", props.uxpContext);

  const fetchData = async () => {
    let start,
      end = new Date().toISOString();

    if (toggleFilterValue === "day") {
      let today = new Date();
      var dayOfWeek = today.getUTCDay();
      var diff = today.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0);
      var lastSunday = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), diff - 1)
      ).toISOString();

      start = `${lastSunday.substring(0, 10)}T18:30:00.000Z`;
    }

    if (toggleFilterValue === "week") {
      let today = new Date();
      let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      start = firstDayOfMonth.toISOString().substring(0, 10) + "T18:30:00.000Z";
    }

    if (toggleFilterValue === "month") {
      var today = new Date();
      start = new Date(today.getFullYear(), 0, 1).toISOString();
    }

    try {
      const res = await props.uxpContext.executeAction(
        "TataStreetLightAPI",
        "GetExpenditure",
        { hierarchy, start: start, end: end, filter },
        { json: true }
      );
      console.log("Response From  Expenditure API is", res, typeof res);
      setEnergyConsumptionData(res);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [filter]);

  //Old Average Calculation
  // const transformData = (
  //   rawData: EnergyConsumptionData,
  //   filterType: "day" | "week" | "month"
  // ) => {
  //   let filteredData: { name: string; powerConsumption: number }[] = [];

  //   const expenditureData:
  //     | any[]
  //     | { [key: string]: { [key: string]: number }[] } =
  //     rawData["Expenditure"] || [];

  //   if (filterType === "day") {
  //     const daysInWeekFull: string[] = [
  //       "Sunday",
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //     ];
  //     const daysInWeekAbbr: string[] = [
  //       "Sun",
  //       "Mon",
  //       "Tue",
  //       "Wed",
  //       "Thu",
  //       "Fri",
  //       "Sat",
  //     ];

  //     filteredData = daysInWeekAbbr.map((abbr, index) => {
  //       const fullDayName = daysInWeekFull[index];

  //       const currentDate = new Date();
  //       currentDate.setDate(currentDate.getDate() + index - 1);
  //       const day = currentDate.getDate();
  //       const month = currentDate.toLocaleString("default", { month: "short" });
  //       // const year = currentDate.getFullYear();
  //       const year = currentDate.toLocaleString("default", { year: "2-digit" });
  //       const dateString = `${day}/${month}/${year}`;

  //       const powerEntry = (expenditureData as any[]).find(
  //         (entry: { day: string }) => entry.day === fullDayName
  //       );

  //       // Calculate the sum
  //       const val: any = (expenditureData as any[]).reduce(
  //         (acc, obj) => acc + obj.value,
  //         0
  //       );

  //       // Calculate the average
  //       const averageVal = val / 1000 / (expenditureData as any[]).length;

  //       const fullDateString = currentDate.toLocaleDateString();

  //       return {
  //         name: abbr,
  //         fullDate: fullDateString,
  //         powerConsumption: powerEntry ? powerEntry.value : 0,
  //         averageValue: averageVal,
  //       };
  //     });
  //   } else if (filterType === "week") {
  //     const WeekNamesFull: string[] = ["Week1", "Week2", "Week3", "Week4"];

  //     filteredData = WeekNamesFull.map((weekName) => {
  //       const powerEntry = (expenditureData as any[]).find(
  //         (entry: { week: string }) => entry.week === weekName
  //       );
  //       const powerValue = powerEntry ? powerEntry.value : 0;

  //       // Calculate the sum
  //       const val: any = (expenditureData as any[]).reduce(
  //         (acc, obj) => acc + obj.value,
  //         0
  //       );

  //       // Calculate the average
  //       const averageVal = val / 1000 / (expenditureData as any[]).length;

  //       return {
  //         name: weekName,
  //         powerConsumption: powerValue,
  //         averageValue: averageVal,
  //       };
  //     });
  //   } else if (filterType === "month") {
  //     const startDate = new Date("2024-02-01T00:00:00").toISOString();
  //     const monthNamesFull: string[] = [
  //       "February",
  //       "March",
  //       "April",
  //       "May",
  //       "June",
  //       "July",
  //       "August",
  //       "September",
  //       "October",
  //       "November",
  //       "December",
  //     ];
  //     const monthNamesabbr: string[] = [
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ];

  //     filteredData = monthNamesabbr.map((abbr, index) => {
  //       const fullMonthName = monthNamesFull[index];

  //       const powerEntry = (expenditureData as any[]).find(
  //         (entry: { month: string }) => entry.month === fullMonthName
  //       );

  //       const powerValue = powerEntry ? powerEntry.value : 0;

  //       // Calculate the sum
  //       const val: any = (expenditureData as any[]).reduce(
  //         (acc, obj) => acc + obj.value,
  //         0
  //       );

  //       // Calculate the average
  //       const averageVal = val / 1000 / (expenditureData as any[]).length;

  //       return {
  //         name: abbr,
  //         powerConsumption: powerValue,
  //         averageValue: averageVal,
  //       };
  //     });
  //   }
  //   return filteredData;
  // };

  //Rolling Average Calculation

  const transformData = (
    rawData: EnergyConsumptionData,
    filterType: "day" | "week" | "month"
  ) => {
    let filteredData: { name: string; powerConsumption: number }[] = [];
    const expenditureData:
      | any[]
      | { [key: string]: { [key: string]: number }[] } =
      rawData["Expenditure"] || [];
  
    if (filterType === "day") {
      const daysInWeekFull: string[] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const daysInWeekAbbr: string[] = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ];
  
      let pastValue = 0; // Initialize past value for rolling average calculation
      filteredData = daysInWeekAbbr.map((abbr, index) => {
        const fullDayName = daysInWeekFull[index];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + index - 1);
        const powerEntry = (expenditureData as any[]).find(
          (entry: { day: string }) => entry.day === fullDayName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue; // Update past value for next iteration
  
        return {
          name: abbr,
          powerConsumption: currentValue,
          averageValue: rollingAverage/1000,
        };
      });
    } else if (filterType === "week") {
      const WeekNamesFull: string[] = ["Week1", "Week2", "Week3", "Week4"];
      let pastValue = 0; // Initialize past value for rolling average calculation
  
      filteredData = WeekNamesFull.map((weekName) => {
        const powerEntry = (expenditureData as any[]).find(
          (entry: { week: string }) => entry.week === weekName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue; // Update past value for next iteration
  
        return {
          name: weekName,
          powerConsumption: currentValue,
          averageValue: rollingAverage/1000,
        };
      });
    } else if (filterType === "month") {
      const monthNamesFull: string[] = [
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthNamesabbr: string[] = [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let pastValue = 0; // Initialize past value for rolling average calculation
  
      filteredData = monthNamesabbr.map((abbr, index) => {
        const fullMonthName = monthNamesFull[index];
        const powerEntry = (expenditureData as any[]).find(
          (entry: { month: string }) => entry.month === fullMonthName
        );
        const currentValue = powerEntry ? powerEntry.value : 0;
        const rollingAverage = (pastValue + currentValue) / 2;
        pastValue = currentValue; // Update past value for next iteration
  
        return {
          name: abbr,
          powerConsumption: currentValue,
          averageValue: rollingAverage/1000,
        };
      });
    }
    return filteredData;
  };
  const transformedData1 = transformData(energyConsumptionData, "month");
  const transformedData2 = transformData(energyConsumptionData, "week");
  const transformedData3 = transformData(energyConsumptionData, "day");

  const filterToDataMap: { [key: string]: any[] } = {
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
    <WidgetWrapper className="smart-city_box waste-bin-box">
      <TitleBar
        title="Street Light Alerts"
        icon="https://static.iviva.com/images/Udhayimages/streetlight-alert.png"
      ></TitleBar>

      <div className="smart-city-content">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="status-content">
            <div className="status Attention">
              <h3>
                {health?.ilmAlerts?.["Main Fail"] +
                  health?.ilmAlerts?.["Lamp Flickering"]}{" "}
                <span></span>
              </h3>
              <p>High</p>
            </div>

            <div className="status Pending">
              <h3>
                {health?.ilmAlerts?.["Load Fail"] +
                  health?.ilmAlerts?.["Lux Sensor Blocked"] +
                  health?.ilmAlerts?.["Partial Failure"]}{" "}
                <span></span>
              </h3>
              <p>Medium</p>
            </div>

            <div className="status Resloved">
              <h3>
                {health?.ilmAlerts?.["Power Factor"] +
                  health?.ilmAlerts?.["AC Voltage"]}{" "}
                <span></span>
              </h3>
              <p>Low</p>
            </div>
          </div>
        )}

        <div className="technician_chart">
          <div className="sub_title_bar">Installed vs Working lamps</div>

          <div className="progress-bar-container">
            <>
              <div
                className="progress-bar installedLamps"
                style={{
                  width: `${
                    Number(
                      calculatePercentage(
                        Number(lampdata?.ilm?.installedLamps ?? 75),
                        Number(lampdata?.ilm?.installedLamps ?? 75) +
                          Number(lampdata?.ilm?.workingLamps ?? 25)
                      )
                    ) < 10
                      ? 10
                      : Math.max(
                          10,
                          Number(
                            calculatePercentage(
                              Number(lampdata?.ilm?.installedLamps ?? 75),
                              Number(lampdata?.ilm?.installedLamps ?? 75) +
                                Number(lampdata?.ilm?.workingLamps ?? 25)
                            )
                          )
                        )
                  }%`,
                }}
              ></div>

              <div
                className="progress-bar working-lamps"
                style={{
                  width: `${
                    Number(
                      calculatePercentage(
                        Number(lampdata?.ilm?.workingLamps ?? 25),
                        Number(lampdata?.ilm?.installedLamps ?? 75) +
                          Number(lampdata?.ilm?.workingLamps ?? 25)
                      )
                    ) < 10
                      ? 10
                      : Number(
                          calculatePercentage(
                            Number(lampdata?.ilm?.workingLamps ?? 25),
                            Number(lampdata?.ilm?.installedLamps ?? 75) +
                              Number(lampdata?.ilm?.workingLamps ?? 25)
                          )
                        )
                  }%`,
                }}
              ></div>
            </>
          </div>

          <div className="chart-sec">
            <div className="chart-issue">
              <h3>{lampdata?.ilm?.installedLamps ?? "N/A"}</h3>
              <p>Installed lamps</p>
            </div>

            <div className="chart-pending">
              <h3>{lampdata?.ilm?.workingLamps ?? "N/A"}</h3>
              <p>Working lamps</p>
            </div>
          </div>
        </div>

        <div
          className="smart-city-content"
          style={{ height: "400px", width: "100%" }}
        >
          <WidgetWrapper className="smart-city_box energy_consumption-box  expenditure-box">
            <TitleBar
              icon="https://static.iviva.com/images/Udhayimages/expenditure.png"
              title="Energy Consumption Expenditure"
            >
              {" "}
            </TitleBar>
            <div className="smart-city-content">
              <div className="technician_chart">
                <div className="chart-top">
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

                <div className="chart-top" style={{ marginTop: "0.5em" }}>
                  <div className="sub_title_bar">SAR x 1000 &#41;</div>
                </div>

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
                      name="Rolling Average"
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
          </WidgetWrapper>
          {transformedChartData[0].averageValue ? (
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
