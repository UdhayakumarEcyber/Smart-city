import React, { useState } from 'react';
 
import {  WidgetWrapper,  TitleBar } from "uxp/components";  
import { ResponsivePie } from '@nivo/pie';  
 
 
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const Segregation_MetricsChart: React.FunctionComponent<{}> = () => {  
 

    
 var data =[
    {
      "id": "plastic",
      "label": "Plastic",
      "value": 3273,
      "color": "rgb(106 186 53)"
    },
    {
      "id": "paper",
      "label": "Paper", 
      "value": 2947 ,
      "color": "rgb(2 108 92)"
    },
    {
      "id": "metal",
      "label": "Metal",
      "value":  2838,
      "color": "rgb(50 161 152)"
    },
    {
      "id": "food_waste",
      "label": "Food Waste",
      "value":  3875,
      "color": "rgb(99 245 227)"
    },
    {
      "id": "glass",
      "label": "Glass",
      "value":  1945,
      "color": "rgb(179 238 142)"
    }
  ]
    
    const MyResponsivePie = ({  }) => (
         

   <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <ResponsiveContainer width={300} height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            content={(props) => {
              const { payload } = props;

              return (
                <ul>
                  {data.map((entry, index) => (
                    <li key={`legend-${index}`} style={{ color: entry.color }}>
                      <em style={{ background: entry.color }}></em>
                      <span>{`${entry.label}:`}</span>
                      <span className="data_values">{` ${entry.value} Tons`}</span>
                    </li>
                  ))}
                </ul>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    )
    
        return ( 
           
            <WidgetWrapper className="smart-city_box segregation_metrics-box waste-segregation_metrics-box"> 
          
    
                <TitleBar title="Waste Segregation Metrics" icon='https://static.iviva.com/images/Udhayimages/waste-seg-matrix.png'></TitleBar>  
    
                <div className="smart-city-content">  
                    <div className="technician_chart">  
                        <MyResponsivePie/>
                    </div>  
                </div>
    
            </WidgetWrapper>
    
        )
    };

export default Segregation_MetricsChart;
