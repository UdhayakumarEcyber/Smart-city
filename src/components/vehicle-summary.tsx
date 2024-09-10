import React, { useState, useEffect } from "react";
import { WidgetWrapper, TitleBar } from "uxp/components";
import { IContextProvider } from "../uxp";
import { ResponsivePie } from "@nivo/pie";

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

const DEFAULT_PIE_DATA = [
  { id: "AC Voltage", label: "AC Voltage", value: 45 },
  { id: "Load Fail", label: "Load Fail", value: 58 },
  { id: "Lux Sensor Blocked", label: "Lux Sensor Blocked", value: 42 },
  { id: "Main Fail", label: "Main Fail", value: 54 },
  { id: "Partial Failure", label: "Partial Failure", value: 57 },
  { id: "Power Factor", label: "Power Factor", value: 36 },
  { id: "Lamp Flickering", label: "Lamp Flickering", value: 87 },
];

const COLORS = [
  "rgb(99, 245, 227)",
  "rgb(25, 190, 92)",
  "rgb(25, 157, 142)",
  "rgb(179, 238, 142)",
  "rgb(64, 141, 173)",
  "rgb(143, 212, 98)",
  "rgb(102, 198, 142)",
];

const HIERARCHY = "منطقة المدينة";

const VehicleSummaryWidget: React.FunctionComponent<IWidgetProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState({
    ilmAlerts: {
      "AC Voltage": 0,
      "Load Fail": 0,
      "Sensor Blocked": 0,
      "Main Fail": 0,
      "Partial Failure": 0,
      "Power Factor": 0,
      "Lamp Flickering": 0,
    },
  });

  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  useEffect(() => {
    const getHealthData = async () => {
      try {
        const res = await props.uxpContext?.executeAction(
          "TataStreetLightAPI",
          "Alert Summary",
          { hierarchy: HIERARCHY },
          { json: true }
        );
        console.log("Response From API is", res, typeof res);
        setHealth(res);
      } catch (e) {
        console.error("Error fetching health data:", e);
      } finally {
        setLoading(false);
      }
    };
    
    getHealthData();
  }, [props.uxpContext]);

  const pieChartData = [
    { id: "AC Voltage", label: "AC Voltage", value: Number(health.ilmAlerts["AC Voltage"]) || 45 },
    { id: "Load Fail", label: "Load Fail", value: Number(health.ilmAlerts["Load Fail"]) || 58 },
    { id: "Sensor Blocked", label: "Sensor Blocked", value: Number(health.ilmAlerts["Sensor Blocked"]) || 42 },
    { id: "Main Fail", label: "Main Fail", value: Number(health.ilmAlerts["Main Fail"]) || 54 },
    { id: "Partial Failure", label: "Partial Failure", value: Number(health.ilmAlerts["Partial Failure"]) || 57 },
    { id: "Power Factor", label: "Power Factor", value: Number(health.ilmAlerts["Power Factor"]) || 36 },
    { id: "Lamp Flickering", label: "Lamp Flickering", value: Number(health.ilmAlerts["Lamp Flickering"]) || 87 },
  ];

  const chartTheme = {
    background: "transparent",
    text: { fontSize: 13, fill: "#f61e1e", outlineWidth: 0 },
    legends: {
      title: { text: { fontSize: 10, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" } },
      text: { fontSize: 12, fill: "#333333", outlineWidth: 10, outlineColor: "transparent" },
      ticks: { line: {}, text: { fontSize: 10, fill: "#333333", outlineWidth: 0, outlineColor: "transparent" } },
    },
    tooltip: { container: { background: "#ffffff", fontSize: 12 } },
  };

  const handleLegendClick = (legendItem: any) => {
    setHighlightedCategory(legendItem.id === highlightedCategory ? null : legendItem.id);
  };

  const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
    const total = dataWithArc.reduce((acc: number, datum: any) => acc + datum.value, 0);

    return (
      <>
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: "1.5rem", fontWeight: "bolder" }}
        >
          {total.toLocaleString("en-US")}
        </text>
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          Alerts
        </text>
      </>
    );
  };

  return (
    <WidgetWrapper className="smart-city_box vehicle_summary-box">
      <TitleBar
        title="Streetlight health summary"
        icon="https://static.iviva.com/images/Udhayimages/health-data.png"
      />
      <div className="smart-city-content" style={{ width: "100%", height: "100%" }}>
         
          <div className="technician_chart" style={{ width: "100%", height: "95%" }}>
            <ResponsivePie
              valueFormat=","
              theme={chartTheme}
              data={pieChartData}
              margin={{ top: 40, right: 80, bottom: 40, left: -50 }}
              innerRadius={0.5}
              padAngle={1}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={0.8}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              animate
              colors={(datum) =>
                datum.id === highlightedCategory
                  ? "#ffcc00"
                  : COLORS[pieChartData.findIndex((item) => item.id === datum.id) % COLORS.length]
              }
              enableArcLinkLabels
              enableArcLabels={false}
              legends={[
                {
                  anchor: "top-right",
                  direction: "column",
                  justify: false,
                  translateX: 56,
                  translateY: 0,
                  itemsSpacing: 5,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 10,
                  symbolShape: "square",
                  effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
                  onClick: handleLegendClick,
                },
              ]}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLinkLabel={(e) => `${e.id} (${e.value.toLocaleString("en-US")})`}
              arcLinkLabelsSkipAngle={5}
              arcLabelsTextColor="#000000"
              layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
            />
          </div>
        
      </div>
    </WidgetWrapper>
  );
};

export default VehicleSummaryWidget;





















// import React, { useState, useEffect } from "react";
// import { WidgetWrapper, TitleBar } from "uxp/components";
// import { IContextProvider } from "../uxp";
// import { ResponsivePie } from "@nivo/pie";

// interface IWidgetProps {
//   instanceId?: string;
//   uxpContext?: IContextProvider;
//   ilmAlerts?: {
//     "AC Voltage"?: string;
//     "Load Fail"?: string;
//     "Lux Sensor Blocked"?: string;
//     "Main Fail"?: string;
//     "Partial Failure"?: string;
//     "Power Factor"?: string;
//   };
// }

// const DEFAULT_PIE_DATA = [
//   { id: "AC Voltage", label: "AC Voltage", value: 45 },
//   { id: "Load Fail", label: "Load Fail", value: 58 },
//   { id: "Lux Sensor Blocked", label: "Lux Sensor Blocked", value: 42 },
//   { id: "Main Fail", label: "Main Fail", value: 54 },
//   { id: "Partial Failure", label: "Partial Failure", value: 57 },
//   { id: "Power Factor", label: "Power Factor", value: 36 },
//   { id: "Lamp Flickering", label: "Lamp Flickering", value: 87 },
// ];

// const COLORS = [
//   "rgb(99, 245, 227)",
//   "rgb(25, 190, 92)",
//   "rgb(25, 157, 142)",
//   "rgb(179, 238, 142)",
//   "rgb(64, 141, 173)",
//   "rgb(143, 212, 98)",
//   "rgb(102, 198, 142)",
// ];

// const HIERARCHY = "منطقة المدينة";

// const VehicleSummaryWidget: React.FunctionComponent<IWidgetProps> = (props) => {
//   const [loading, setLoading] = useState(true);
//   const [health, setHealth] = useState({
//     ilmAlerts: {
//       "AC Voltage": 0,
//       "Load Fail": 0,
//       "Lux Sensor Blocked": 0,
//       "Main Fail": 0,
//       "Partial Failure": 0,
//       "Power Factor": 0,
//       "Lamp Flickering": 0,
//     },
//   });

//   const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

//   useEffect(() => {
//     const getHealthData = async () => {
//       try {
//         const res = await props.uxpContext?.executeAction(
//           "TataStreetLightAPI",
//           "Alert Summary",
//           { hierarchy: HIERARCHY },
//           { json: true }
//         );
//         console.log("Response From API is", res, typeof res);
//         setHealth(res);
//       } catch (e) {
//         console.error("Error fetching health data:", e);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     getHealthData();
//   }, [props.uxpContext]);

//   const pieChartData = [
//     { id: "AC Voltage", label: "AC Voltage", value: Number(health.ilmAlerts["AC Voltage"]) || 45 },
//     { id: "Load Fail", label: "Load Fail", value: Number(health.ilmAlerts["Load Fail"]) || 58 },
//     { id: "Lux Sensor Blocked", label: "Lux Sensor Blocked", value: Number(health.ilmAlerts["Lux Sensor Blocked"]) || 42 },
//     { id: "Main Fail", label: "Main Fail", value: Number(health.ilmAlerts["Main Fail"]) || 54 },
//     { id: "Partial Failure", label: "Partial Failure", value: Number(health.ilmAlerts["Partial Failure"]) || 57 },
//     { id: "Power Factor", label: "Power Factor", value: Number(health.ilmAlerts["Power Factor"]) || 36 },
//     { id: "Lamp Flickering", label: "Lamp Flickering", value: Number(health.ilmAlerts["Lamp Flickering"]) || 87 },
//   ];

//   const chartTheme = {
//     background: "transparent",
//     text: { fontSize: 13, fill: "#f61e1e", outlineWidth: 0 },
//     legends: {
//       title: { text: { fontSize: 10, fill: "#fff", outlineWidth: 0, outlineColor: "transparent" } },
//       text: { fontSize: 12, fill: "#333333", outlineWidth: 10, outlineColor: "transparent" },
//       ticks: { line: {}, text: { fontSize: 10, fill: "#333333", outlineWidth: 0, outlineColor: "transparent" } },
//     },
//     tooltip: { container: { background: "#ffffff", fontSize: 12 } },
//   };

//   const handleLegendClick = (legendItem: any) => {
//     setHighlightedCategory(legendItem.id === highlightedCategory ? null : legendItem.id);
//   };

//   const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
//     const total = dataWithArc.reduce((acc: number, datum: any) => acc + datum.value, 0);

//     return (
//       <>
//         <text
//           x={centerX}
//           y={centerY - 10}
//           textAnchor="middle"
//           dominantBaseline="central"
//           style={{ fontSize: "1.5rem", fontWeight: "bolder" }}
//         >
//           {total.toLocaleString("en-US")}
//         </text>
//         <text
//           x={centerX}
//           y={centerY + 5}
//           textAnchor="middle"
//           dominantBaseline="central"
//           style={{ fontSize: "1rem", fontWeight: "bold" }}
//         >
//           Alerts
//         </text>
//       </>
//     );
//   };

//   return (
//     <WidgetWrapper className="smart-city_box vehicle_summary-box">
//       <TitleBar
//         title="Streetlight health summary"
//         icon="https://static.iviva.com/images/Udhayimages/health-data.png"
//       />
//       <div className="smart-city-content" style={{ width: "100%", height: "100%" }}>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div className="technician_chart" style={{ width: "100%", height: "400px" }}>
//             <ResponsivePie
//               valueFormat=","
//               theme={chartTheme}
//               data={pieChartData}
//               margin={{ top: 40, right: 80, bottom: 40, left: -50 }}
//               innerRadius={0.5}
//               padAngle={1}
//               cornerRadius={3}
//               activeOuterRadiusOffset={8}
//               borderWidth={0.8}
//               borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
//               animate
//               colors={(datum) =>
//                 datum.id === highlightedCategory
//                   ? "#ffcc00"
//                   : COLORS[pieChartData.findIndex((item) => item.id === datum.id) % COLORS.length]
//               }
//               enableArcLinkLabels
//               enableArcLabels={false}
//               legends={[
//                 {
//                   anchor: "top-right",
//                   direction: "column",
//                   justify: false,
//                   translateX: 56,
//                   translateY: 0,
//                   itemsSpacing: 5,
//                   itemWidth: 100,
//                   itemHeight: 18,
//                   itemTextColor: "#999",
//                   itemDirection: "left-to-right",
//                   itemOpacity: 1,
//                   symbolSize: 10,
//                   symbolShape: "square",
//                   effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
//                   onClick: handleLegendClick,
//                 },
//               ]}
//               arcLinkLabelsThickness={2}
//               arcLinkLabelsColor={{ from: "color" }}
//               arcLinkLabel={(e) => `${e.id} (${e.value.toLocaleString("en-US")})`}
//               arcLinkLabelsSkipAngle={5}
//               arcLabelsTextColor="#000000"
//               layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
//             />
//           </div>
//         )}
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default VehicleSummaryWidget;





















 