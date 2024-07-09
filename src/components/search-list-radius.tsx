import React, { useState } from "react";
 
import {
  WidgetWrapper,
  SearchBox,
  TitleBar,
  FormField,
  Label,
  Select,
  DatePicker,
  ToggleFilter,
  Input
} from "uxp/components";

interface EnergyConsumptionData {
  Alerts?: {
    [key: string]: { [key: string]: number }[];
  };
}
const SearchRadius: React.FunctionComponent<{}> = () => {
  let [inputValue, setInputValue] = React.useState<string | null>("Location");
  
 
  const alert_trend_data = [
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
 

  
  return (
 
<div className='searchBox-widget searchRadius_widget'>
<div className='searchbox-container'>
           
          <input 
            className='searchbox'
            type='text'
            value=" " 
            placeholder='1000'
          />
 
          
        </div>
 
      </div> 
  );
};

export default SearchRadius;
