import axios from "axios";
import React, { useEffect, useState } from "react";
import { WidgetWrapper, TitleBar } from "uxp/components";

const BuildingSmartBim: React.FunctionComponent<{}> = () => {
	const [buildingData, setBuildingData] = useState<any>([]);
	// const [buildingData, setBuildingData] = useState<any>([
	// 	{
	// 		primary_text: "Airport",
	// 		secondary_text: "MySite.Airport.Departure",
	// 	},
	// 	{
	// 		primary_text: "Cobler",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "test",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "DFC",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "OBK",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "ONH",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "IISC",
	// 		secondary_text: "MySite",
	// 	},
	// 	{
	// 		primary_text: "changi test",
	// 		secondary_text: "Singapore",
	// 	},
	// 	{
	// 		primary_text: "Gate D5",
	// 		secondary_text: "Airport",
	// 	},
	// 	{
	// 		primary_text: "D6",
	// 		secondary_text: "Airport",
	// 	},
	// 	{
	// 		primary_text: "AHU Room",
	// 		secondary_text: "Cobler",
	// 	},
	// 	{
	// 		primary_text: "DFC view",
	// 		secondary_text: "DFC",
	// 	},
	// 	{
	// 		primary_text: "ONH Reception",
	// 		secondary_text: "ONH",
	// 	},
	// 	{
	// 		primary_text: "cafeteria-iisc-1",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Waiting Area-iisc-1",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Meeting Room-iisc-1",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Hall-iisc-1",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Meeting Room-iisc-2",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "cafeteria/Waiting Area-iisc-2",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Hall-iisc-2",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Hall-iisc-3",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Meeting Room-iisc-3",
	// 		secondary_text: "IISC",
	// 	},
	// 	{
	// 		primary_text: "Cofference Room-iisc-1",
	// 		secondary_text: "IISC",
	// 	},
	// ]);
	const bimSiteURL = "https://b4.smartbim.ivivacloud.com";

	useEffect(() => {
		getBuildingBimData();
	}, []);

	const getBuildingBimData = async () => {
		axios
			.get(
				// "http://b4.smartbim.ivivacloud.com/hook/ExternalViewPort/z9wh0ofn7io"
				`${bimSiteURL}/Lucy/ExternalViewPort/GetViewPortInfo`,
				// `${bimSiteURL}/Lucy/hook/ExternalViewPort/GetViewPortInfo`,
				{
					maxRedirects: 0,
					params: {
						apikey: "SC:b4:dc0235f23f1672c6",
					},
					// headers: {
					// 	Authorization: "APIKEY SC:b4:cdf1f8382693aee6",
					// 	"Content-Type": "application/json",
					// },
				}
			)
			// fetch(`${bimSiteURL}/Lucy/hook/ExternalViewPort/GetViewPortInfo`, {
			// 	method: "GET",
			// 	redirect: "follow",
			// })
			.then((data) => {
				console.log(data.data);
				setBuildingData(data.data);
			})
			.catch((err) => {
				console.log("err:", err);
			});
	};

	return (
		<WidgetWrapper className="smart-city_box building_layout-box">
			<TitleBar
				title="Smart Bim"
				icon="https://static.iviva.com/images/Udhayimages/mda-building-images/bim.png"
			></TitleBar>
			<div className="smart-city-content">
				<div id="ViewsMenu" className="modal-layer show">
					<div className="model-items">
						{buildingData.map((item: any) => {
							return (
								<div className="menu-item image" key={item.primary_text}>
									<div className="item-header">
										<div className="blue-plate"></div>
										<img
											className="header-image"
											src="https://demo.iviva.cloud/AccountResources/OI/14e92953-5143-4bd6-a5d3-b61c414af193-a.png"
											alt="header"
										/>
										<div className="header-no-image"></div>
										<div className="blue-overlay"></div>
										<div className="blue-overlay-mask"></div>
									</div>
									<div className="item-body">
										<div className="primary-text">{item.primary_text}</div>
										<div className="secondary-text">{item.secondary_text}</div>
									</div>
									<div className="centering-container">
										<div className="blue-button enabled">
											<a
												onClick={() =>
													window.open(
														`${bimSiteURL}/Apps/SmartBIM/home/url?view=${item.primary_text}`,
														"_blank",
														"width=1000,height=500"
													)
												}
											>
												VIEW
											</a>
										</div>
									</div>
								</div>
							);
						})}

						{/* <div className="menu-item image">
							<div className="item-header">
								<div className="blue-plate"></div>
								<img
									className="header-image"
									src="https://demo.iviva.cloud/AccountResources/OI/14e92953-5143-4bd6-a5d3-b61c414af193-a.png"
								/>
								<div className="header-no-image"></div>
								<div className="blue-overlay"></div>
								<div className="blue-overlay-mask"></div>
							</div>
							<div className="item-body">
								<div className="primary-text">435 Bourke St Building view</div>
								<div className="secondary-text">
									435 Bourke St Building view
								</div>
							</div>
							<div className="centering-container">
								<div className="blue-button enabled">
									<a
										onClick={() =>
											window.open(
												"https://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home",
												// "http://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home?index=0",
												"_blank",
												"width=1000,height=500"
											)
										}
									>
										VIEW
									</a>
								</div>
							</div>
						</div>

						<div className="menu-item image">
							<div className="item-header">
								<div className="blue-plate"></div>
								<img
									className="header-image"
									src="https://demo.iviva.cloud/AccountResources/OI/14e92953-5143-4bd6-a5d3-b61c414af193-a.png"
								/>
								<div className="header-no-image"></div>
								<div className="blue-overlay"></div>
								<div className="blue-overlay-mask"></div>
							</div>
							<div className="item-body">
								<div className="primary-text">435 Bourke St Floor 5</div>
								<div className="secondary-text">435 Bourke St Floor 5</div>
							</div>
							<div className="centering-container">
								<div className="blue-button enabled">
									<a
										onClick={() =>
											window.open(
												"https://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home",
												// "http://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home?index=4",
												"_blank",
												"width=1000,height=500"
											)
										}
									>
										VIEW
									</a>
								</div>
							</div>
						</div>

						<div className="menu-item image">
							<div className="item-header">
								<div className="blue-plate"></div>
								<img
									className="header-image"
									src="https://demo.iviva.cloud/AccountResources/OI/14e92953-5143-4bd6-a5d3-b61c414af193-a.png"
								/>
								<div className="header-no-image"></div>
								<div className="blue-overlay"></div>
								<div className="blue-overlay-mask"></div>
							</div>
							<div className="item-body">
								<div className="primary-text">435 Bourke St GF</div>
								<div className="secondary-text">435 Bourke St GF</div>
							</div>
							<div className="centering-container">
								<div className="blue-button enabled">
									<a
										onClick={() =>
											window.open(
												"https://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home",
												// "http://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home?index=10",
												"_blank",
												"width=1000,height=500"
											)
										}
									>
										VIEW
									</a>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</WidgetWrapper>
	);
};

export default BuildingSmartBim;
