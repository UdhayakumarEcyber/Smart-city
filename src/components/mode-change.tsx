import React, { useState } from 'react';
import { WidgetWrapper, Select, FormField } from 'uxp/components';
import { IContextProvider } from '../uxp';
import { EventsEnum } from '..';
interface IMapChangeMode {
  uxpContext: IContextProvider;
  appMode: string;
}
const ModeChangeWidget: React.FunctionComponent<IMapChangeMode> = (props) => {
  const { uxpContext, appMode } = props;
  const handleModeChange = (selectedOption: string) => {

    console.log("The mode",selectedOption);
    uxpContext.eventHandler?.(
      EventsEnum.ChangeAppMode,
      { mode: selectedOption }
      );
  };
  const [selected, setSelected] = React.useState<string>(appMode || "Land Bank Management");
  return (
    <WidgetWrapper className="smart-city_box mode-change-box">
      <FormField inline className="showcase-input">
        <Select  className='harapa'  
          selected={selected}
          options={[
            { label: 'Land Bank Management', value: 'Land Bank Management' },
            { label: 'Real Estate Insights', value: 'Real Estate Insights' }
          ]}
          onChange={(selectedOption) => {
            setSelected(selectedOption);
            handleModeChange(selectedOption);
          }}
          placeholder="Land Bank Management"
        />
      </FormField>
  </WidgetWrapper>
  );
};
export default ModeChangeWidget;
 