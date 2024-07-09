import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { IContextProvider } from "../uxp";
import { EventsEnum } from "../index";
import { TitleBar, WidgetWrapper } from "uxp/components";

interface IMapChangeMode {
  uxpContext: IContextProvider;
  sgDensity?: number;
}

const SgGridDensity: React.FunctionComponent<IMapChangeMode> = (props) => {
  const { uxpContext, sgDensity } = props;
  
  const [currentHour, setCurrentHour] = useState(12);  
  const [value, setValue] = useState(sgDensity || 100);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const initialHour = now.getHours() + now.getMinutes() / 60;
    setCurrentHour(initialHour); 
  }, []);

  const changeFormatTime = (value: number) => {
    const hours = Math.floor(value) % 24;
    const formattedHours = String(hours).padStart(2, "0");
    const minutes = Math.round((value % 1) * 60);
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  // const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const newHour = parseFloat(event.target.value);
  //   setCurrentHour(newHour);
  //   uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, { percentage: 100 });
  //   inputRef.current?.blur();
  // }; 

  const calculateGradientPercentage = () => {
    const min = 50;
    const max = 100;
    const percentage = ((value - min) / (max - min)) * 100; 
    return percentage;
  };

  // const handleSliderChange = (e: any) => {
  //   const newValue = parseInt(e.target.value);
  //   setValue(newValue);
  //    console.log("Slider Value Changed: ", newValue);  
  //   handleTimeChange(e);
  //   uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, {
  //     percentage: newValue,
  //   });
  //   console.log("Event Triggered: ", EventsEnum.SetSGGridDensity, { percentage: newValue });  
  // }; 


  const handleSliderChange = (e: any) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
   // console.log("Slider Value Changed: ", newValue);
    uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, {
        percentage: newValue,
    });
    inputRef.current?.blur();
    console.log("Event Triggered: ", EventsEnum.SetSGGridDensity, { percentage: newValue });
};
 

  return (
    <WidgetWrapper className="smart-city_box sg_density-box">
      <TitleBar title="SG Density Controller" />
      <div className="sg_density-widget">
        <div className="timer-slider" style={{ flexDirection: "row" }}>
          <div className="minus" style={{ width: "20px", color: "white", fontSize: "20px", fontWeight: "900", position: "absolute", left: "0px", top: "67px" }}>-</div>
          <input
            ref={inputRef}
            type="range"
            className="timer-range"
            min={50}
            max={100}
            step={10}
            list="steplist"
            value={value}
            onChange={handleSliderChange}
            style={{
              background: `linear-gradient(to right, rgb(9 230 152) 0%, #023d28 ${calculateGradientPercentage()}%, #fff ${calculateGradientPercentage()}%, #ddd 100%)`,
            }}
          />
          <div className="plus" style={{ width: "20px", color: "white", fontSize: "18px", fontWeight: "900", position: "absolute", right: "0px", top: "67px" }}>+</div>
        </div>
        <div className="slider-ticks">
          {[50, 60, 70, 80, 90, 100].map(i => (
            <span key={i}>{i}%</span>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default SgGridDensity;






// import React, { useState, ChangeEvent, useEffect, useRef } from "react";
// import { IContextProvider } from "../uxp";
// import { EventsEnum } from "../index";
// import { TitleBar, WidgetWrapper } from "uxp/components";

// interface IMapChangeMode {
//   uxpContext: IContextProvider;
//   sgDensity: number;
// }

// const SgGridDensity: React.FunctionComponent<IMapChangeMode> = (props) => {

//   const { uxpContext, sgDensity } = props;

//   const [currentHour, setCurrentHour] = useState(12);
//   const [value, setValue] = useState(sgDensity || 100);
 
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const now = new Date();
//     const initialHour = now.getHours() + now.getMinutes() / 60;
//     setCurrentHour(initialHour);
//     console.log("Initial Hour: ", initialHour); // Debug line
//   }, []); 
 
//   const calculateGradientPercentage = () => {
//     const min = 50;
//     const max = 100;
//     const percentage = ((value - min) / (max - min)) * 100;
//     console.log("Gradient Percentage: ", percentage); // Debug line
//     return percentage;
//   }; 

//   const handleSliderChange = (e: any) => {
//     const newValue = parseInt(e.target.value);
//     setValue(newValue);
//     console.log("Slider Value Changed: ", newValue); // Debug line
//     uxpContext.eventHandler?.(EventsEnum.SetSGGridDensity, {
//       percentage: newValue,
//     });
//     console.log("Event Triggered: ", EventsEnum.SetSGGridDensity, { percentage: newValue }); // Debug line
//   };

//   return (
//     <WidgetWrapper className="smart-city_box sg_density-box">
//       <TitleBar title="SG Density Controller" />
//       <div className="sg_density-widget">
//         <div className="timer-slider" style={{flexDirection:"row"}}>
//           <div className="minus" style={{width:"20px", color:"white", fontSize:"20px", fontWeight:"900", position:"absolute", left:"0px", top:"67px"}}>-</div>
//           <input
//             ref={inputRef}
//             type="range"
//             className="timer-range"
//             min={50}
//             max={100}
//             step={10}
//             list="steplist"
//             value={value}
//             onChange={handleSliderChange}
//             style={{
//               background: `linear-gradient(to right, rgb(9 230 152) 0%, #023d28 ${calculateGradientPercentage()}%, #fff ${calculateGradientPercentage()}%, #ddd 100%)`,
//             }} 
//           />
//           <div className="plus" style={{width:"20px", color:"white", fontSize:"18px", fontWeight:"900", position:"absolute", right:"0px", top:"67px"}}>+</div>
//         </div>
//         <div className="slider-ticks">
//           {[50, 60, 70, 80, 90, 100].map(i => (
//             <span key={i}>{i}%</span>
//           ))}
//         </div>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default SgGridDensity;




 