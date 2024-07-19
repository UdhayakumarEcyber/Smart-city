import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  WidgetWrapper,
  SearchBox,
  TitleBar,
  FormField,
  Label,
  Select,
  DatePicker,
  ToggleFilter,
} from "uxp/components";

interface EnergyConsumptionData {
  Alerts?: {
    [key: string]: { [key: string]: number }[];
  };
}
const AlertTrends: React.FunctionComponent<{}> = () => {
  let [inputValue, setInputValue] = React.useState<string | null>("Location");
  let [selected, setSelected] = React.useState<string | null>("All Alert");
  const [toggleFilterValue, setToggleFilterValue] =
    React.useState<string>("day");
  let [date, setDate] = React.useState<Date>(new Date());
  let [date1, setDate1] = React.useState<Date>(new Date());
  const handleFilterChange = (value: any) => {
    console.log("Selected Filter Value:", value);
    setToggleFilterValue(value);
  };

  // const data = [
  //   {
  //     name: "Traffic",
  //     uv: 31.47,
  //     pv: 2400,
  //     fill: "#8884d8",
  //   },
  //   {
  //     name: "Crowed",
  //     uv: 26.69,
  //     pv: 4567,
  //     fill: "#83a6ed",
  //   },
  //   {
  //     name: "ANPR",
  //     uv: 15.69,
  //     pv: 1398,
  //     fill: "#8dd1e1",
  //   },
  //   {
  //     name: "Object Detetcted",
  //     uv: 8.22,
  //     pv: 9800,
  //     fill: "#82ca9d",
  //   },
  // ];

  const alert_trend_data1 = [
    {
      name: "1 Jan",
      ClassA: 180,
      ClassB: 90,
      ClassC: 45,
      ClassD: 18,
      Electricity: 330,
      amt: 450,
    },
    {
      name: "2 Jan",
      ClassA: 190,
      ClassB: 95,
      ClassC: 48,
      ClassD: 19,
      Electricity: 340,
      amt: 370,
    },
    {
      name: "3 Jan",
      ClassA: 185,
      ClassB: 92,
      ClassC: 46,
      ClassD: 18,
      Electricity: 335,
      amt: 300,
    },
    {
      name: "4 Jan",
      ClassA: 175,
      ClassB: 88,
      ClassC: 44,
      ClassD: 17,
      Electricity: 325,
      amt: 210,
    },
    {
      name: "5 Jan",
      ClassA: 180,
      ClassB: 90,
      ClassC: 45,
      ClassD: 18,
      Electricity: 330,
      amt: 225,
    },
    {
      name: "6 Jan",
      ClassA: 185,
      ClassB: 92,
      ClassC: 46,
      ClassD: 18,
      Electricity: 335,
      amt: 270,
    },
    {
      name: "7 Jan",
      ClassA: 170,
      ClassB: 85,
      ClassC: 42,
      ClassD: 17,
      Electricity: 320,
      amt: 150,
    },
  ];

  const alert_trend_data2 = [
    {
      name: "Week 1",
      ClassA: 195,
      ClassB: 97,
      ClassC: 49,
      ClassD: 20,
      Electricity: 345,
      amt: 2300,
    },
    {
      name: "Week 2",
      ClassA: 200,
      ClassB: 100,
      ClassC: 50,
      ClassD: 20,
      Electricity: 350,
      amt: 2200,
    },
    {
      name: "Week 3",
      ClassA: 190,
      ClassB: 95,
      ClassC: 48,
      ClassD: 19,
      Electricity: 340,
      amt: 2150,
    },
    {
      name: "Week 4",
      ClassA: 180,
      ClassB: 90,
      ClassC: 45,
      ClassD: 18,
      Electricity: 330,
      amt: 1980,
    },
  ];

  const alert_trend_data3 = [
    {
      name: "Jan",
      ClassA: 200,
      ClassB: 100,
      ClassC: 50,
      ClassD: 20,
      Electricity: 350,
      amt: 2200,
    },
    {
      name: "Feb",
      ClassA: 195,
      ClassB: 97,
      ClassC: 49,
      ClassD: 20,
      Electricity: 345,
      amt: 2400,
    },
    {
      name: "Mar",
      ClassA: 185,
      ClassB: 92,
      ClassC: 46,
      ClassD: 18,
      Electricity: 335,
      amt: 2250,
    },
    {
      name: "Apr",
      ClassA: 175,
      ClassB: 88,
      ClassC: 44,
      ClassD: 17,
      Electricity: 325,
      amt: 1990,
    },
    {
      name: "May",
      ClassA: 180,
      ClassB: 90,
      ClassC: 45,
      ClassD: 18,
      Electricity: 330,
      amt: 2300,
    },
    {
      name: "Jun",
      ClassA: 190,
      ClassB: 95,
      ClassC: 48,
      ClassD: 19,
      Electricity: 340,
      amt: 2450,
    },
    {
      name: "Jul",
      ClassA: 170,
      ClassB: 85,
      ClassC: 42,
      ClassD: 17,
      Electricity: 320,
      amt: 2120,
    },
    {
      name: "Aug",
      ClassA: 175,
      ClassB: 88,
      ClassC: 44,
      ClassD: 17,
      Electricity: 325,
      amt: 2050,
    },
    {
      name: "Sep",
      ClassA: 165,
      ClassB: 82,
      ClassC: 41,
      ClassD: 16,
      Electricity: 315,
      amt: 1950,
    },
    {
      name: "Oct",
      ClassA: 170,
      ClassB: 85,
      ClassC: 42,
      ClassD: 17,
      Electricity: 320,
      amt: 2100,
    },
    {
      name: "Nov",
      ClassA: 180,
      ClassB: 90,
      ClassC: 45,
      ClassD: 18,
      Electricity: 330,
      amt: 2200,
    },
    {
      name: "Dec",
      ClassA: 185,
      ClassB: 92,
      ClassC: 46,
      ClassD: 18,
      Electricity: 335,
      amt: 2300,
    },
  ];

  const style = {
    top: "50%",
    right: "-30px",
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };

  const filterToDataMap: Record<
    string,
    Array<{
      name: string;
      ClassA: number;
      ClassB: number;
      ClassC: number;
      ClassD: number;
      Electricity: number;
      amt: number;
    }>
  > = {
    day: alert_trend_data1,
    week: alert_trend_data2,
    month: alert_trend_data3,
  };

  const alert_trend_data: any[] =
    filterToDataMap[toggleFilterValue] || alert_trend_data1;

  const finalChartData = alert_trend_data.map((item) => ({
    ...item,
    // averageValue: averageVal,
  }));

  // const totalValue = data.reduce((total, entry) => total + entry.uv, 0);
  // const minAngle = 5;

  // data.forEach((entry) => {
  //   entry.uv = Math.max(entry.uv, (minAngle / 360) * totalValue);
  // });

  return (
    <WidgetWrapper className="smart-city_box vehicle_summary-box">
      <TitleBar
        title="Fire Alert Trend"
        icon="https://static.iviva.com/images/Udhayimages/alert-trends.png"
      ></TitleBar>

      <div className="smart-city-content">
        <div className="chart-top">
          <FormField inline className="showcase-input">
            <SearchBox
              value={inputValue}
              onChange={(newValue) => {
                setInputValue(newValue);
              }}
              position="left"
              placeholder=""
            />

            {/* <Select
              selected={selected}
              options={[
                { label: "All Alert", value: "op-1" },
                { label: "All Alert 1", value: "op-2" },
                { label: "All Alert 2", value: "op-3" },
              ]}
              onChange={(value) => {
                setSelected(value);
              }}
              placeholder=" All Alert"
            /> */}

            {/* <DatePicker
              title="Date"
              date={date}
              onChange={(date) => setDate(date)}
            />

            <DatePicker
              title="Date"
              date={date1}
              onChange={(date1) => setDate1(date1)}
            /> */}
            <ToggleFilter
              options={[
                { label: "7D", value: "day" },
                { label: "1M", value: "week" },
                { label: "1Y", value: "month" },
              ]}
              value={toggleFilterValue}
              onChange={handleFilterChange}
            />
          </FormField>
        </div>

        <div className="technician_chart">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              height: "250px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {/* <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" barSize={10} data={data}> */}
              {/* <RadialBar
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background 
                            dataKey="uv"
                          /> */}
              <LineChart data={finalChartData}>
                <CartesianGrid stroke="#1a6f60cf" strokeDasharray="1 1" />
                <XAxis dataKey="name" tick={{ fill: "#ffffff" }} />
                <YAxis tick={{ fill: "#ffffff" }} />
                <Legend />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="ClassA"
                  name="Class A"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="ClassB"
                  name="Class B"
                  stroke="#82ca9d"
                />
                <Line
                  type="monotone"
                  dataKey="ClassC"
                  name="Class C"
                  stroke="#ffc658"
                />
                <Line
                  type="monotone"
                  dataKey="ClassD"
                  name="Class D"
                  stroke="#ff7300"
                />
                <Line
                  type="monotone"
                  dataKey="ClassF"
                  name="Class F"
                  stroke="#00bcd4"
                />
                <Line type="monotone" dataKey="Electrical Fire" stroke="#f44336" />
              </LineChart>
              {/* </RadialBarChart> */}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default AlertTrends;
