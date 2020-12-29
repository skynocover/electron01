import React from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';

import SideBar from '../components/sidebar';

const { Header, Content, Footer, Sider } = antd.Layout;
const { SubMenu } = antd.Menu;

const Test = () => {
  const appCtx = React.useContext(AppContext);
  const onPanelChange = (value: moment.Moment, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  // return <antd.Calendar onPanelChange={onPanelChange} />;
  return (
    <antd.Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <antd.Layout className="site-layout" style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '0 16px' }}>
          <antd.Calendar onPanelChange={onPanelChange} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </antd.Layout>
    </antd.Layout>
  );
};

export default Test;
