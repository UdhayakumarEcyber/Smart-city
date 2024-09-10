import React, { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList,
} from "recharts";

import {
  DataList,
  WidgetWrapper,
  DynamicSelect,
  SearchBox,
  DataTable,
  MapComponent,
  TitleBar,
  ItemListCard,
  FilterPanel,
  DataGrid,
  ItemCard,
  FormField,
  Label,
  Select,
  Input,
  DateRangePicker,
  DatePicker,
  Checkbox,
  ProfileImage,
  Popover,
  TrendChartComponent,
  ToggleFilter,
} from "uxp/components";

const CountsWidget: React.FunctionComponent<{}> = () => {
  let [inputValue, setInputValue] = React.useState<string | null>("Location");
  let [selected, setSelected] = React.useState<string | null>("Vehicle");
  let [date, setDate] = React.useState<Date>(new Date());
  let [date1, setDate1] = React.useState<Date>(new Date());

  var countsData = [
    {
      fire_type: "Class A",
      value: 120,
      fullValue: 150,
    },
    {
      fire_type: "Class B",
      value: 98,
      fullValue: 150,
    },
    {
      fire_type: "Class C",
      value: 86,
      fullValue: 150,
    },
    {
      fire_type: "Class D",
      value: 99,
      fullValue: 150,
    },
    {
      fire_type: "Class F",
      value: 85,
      fullValue: 150,
    },
    {
      fire_type: "Electrical Fire",
      value: 65,
      fullValue: 150,
    },
  ];

  const MyResponsiveRadar = ({}) => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={countsData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="fire_type" />
        <PolarRadiusAxis />
        <Radar
          name="Value"
          dataKey="value"
          stroke="#005936"
          fill="#00a68a"
          fillOpacity={0.6}
        >
          <LabelList dataKey="value" position="top" />
        </Radar>
        <Tooltip />
        {/* <Legend   /> */}
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <WidgetWrapper className="smart-city_box vehicle_summary-box">
      <TitleBar
        title="Fire Count Summary"
        icon="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDYxMS45OTkgNjExLjk5OSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3Ryb2tlPSIjZmZmZmZmIj4KDTxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+Cg08ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KDTxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPGc+IDxwYXRoIGQ9Ik0yMTYuMDIsNjExLjE5NWM1Ljk3OCwzLjE3OCwxMi4yODQtMy43MDQsOC42MjQtOS40Yy0xOS44NjYtMzAuOTE5LTM4LjY3OC04Mi45NDctOC43MDYtMTQ5Ljk1MiBjNDkuOTgyLTExMS43MzcsODAuMzk2LTE2OS42MDksODAuMzk2LTE2OS42MDlzMTYuMTc3LDY3LjUzNiw2MC4wMjksMTI3LjU4NWM0Mi4yMDUsNTcuNzkzLDY1LjMwNiwxMzAuNDc4LDI4LjA2NCwxOTEuMDI5IGMtMy40OTUsNS42ODMsMi42NjgsMTIuMzg4LDguNjA3LDkuMzQ5YzQ2LjEtMjMuNTgyLDk3LjgwNi03MC44ODUsMTAzLjY0LTE2NS4wMTdjMi4xNTEtMjguNzY0LTEuMDc1LTY5LjAzNC0xNy4yMDYtMTE5Ljg1MSBjLTIwLjc0MS02NC40MDYtNDYuMjM5LTk0LjQ1OS02MC45OTItMTA3LjM2NWMtNC40MTMtMy44NjEtMTEuMjc2LTAuNDM5LTEwLjkxNCw1LjQxM2M0LjI5OSw2OS40OTQtMjEuODQ1LDg3LjEyOS0zNi43MjYsNDcuMzg2IGMtNS45NDMtMTUuODc0LTkuNDA5LTQzLjMzLTkuNDA5LTc2Ljc2NmMwLTU1LjY2NS0xNi4xNS0xMTIuOTY3LTUxLjc1NS0xNTkuNTMxYy05LjI1OS0xMi4xMDktMjAuMDkzLTIzLjQyNC0zMi41MjMtMzMuMDczIGMtNC41LTMuNDk0LTExLjAyMywwLjAxOC0xMC42MTEsNS43YzIuNzM0LDM3LjczNiwwLjI1NywxNDUuODg1LTk0LjYyNCwyNzUuMDg5Yy04Ni4wMjksMTE5Ljg1MS01Mi42OTMsMjExLjg5Ni00MC44NjQsMjM2LjgyNiBDMTUzLjY2Niw1NjYuNzY3LDE4NS4yMTIsNTk0LjgxNCwyMTYuMDIsNjExLjE5NXoiLz4gPC9nPiA8L2c+Cg08L3N2Zz4="
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
 
            <DatePicker
              title="Date"
              date={date}
              onChange={(date) => setDate(date)}
            />

            <DatePicker
              title="Date"
              date={date1}
              onChange={(date1) => setDate1(date1)}
            />
          </FormField>
        </div>

        <div className="technician_chart" style={{ height: '90%' }}>
          <MyResponsiveRadar />
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default CountsWidget;
