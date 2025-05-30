import React from "react";
import { Button, IconButton, WidgetWrapper } from "uxp/components";
import { IContextProvider } from "../uxp";
import { EventsEnum } from "..";

interface IRefresh {
	uxpContext: IContextProvider;
}

const SBIM_Btn: React.FunctionComponent<IRefresh> = (props) => {
	const { uxpContext } = props;

	const handleModeChange = () => {
		uxpContext.eventHandler?.(EventsEnum.UpdateIOTAssetData, {});
	};

	return (
		<WidgetWrapper className="smart-city_box sbim-btn-box">
			<div
				className="sbim-btn"
				onClick={() =>
					window.open(
						"https://b4.smartbim.ivivacloud.com/Apps/SmartBIM/home?view=IISC",
						"_blank",
						"width=1000,height=500"
					)
				}
			></div>
			<div className="sbim-btn-title">
				<p>Smart BIM</p>
			</div>
		</WidgetWrapper>
	);
};

export default SBIM_Btn;
