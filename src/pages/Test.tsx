import React from 'react';
import './App.css';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';

const Test = () => {
  const appCtx = React.useContext(AppContext);
  const onPanelChange = (value: moment.Moment, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return <antd.Calendar onPanelChange={onPanelChange} />;
};

export default Test;
