import React from 'react';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import List from './pages/List';
const { Header, Content, Footer, Sider } = antd.Layout;
const { SubMenu } = antd.Menu;

function App() {
  const appCtx = React.useContext(AppContext);

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  return (
    <>
      <antd.Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <antd.Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <antd.Menu.Item key="1" icon={<PieChartOutlined />}>
              Option 1
            </antd.Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <antd.Menu.Item key="3">Tom</antd.Menu.Item>
              <antd.Menu.Item key="5">Alex</antd.Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <antd.Menu.Item key="6">Team 1</antd.Menu.Item>
              <antd.Menu.Item key="8">Team 2</antd.Menu.Item>
            </SubMenu>
          </antd.Menu>
        </Sider>
        <antd.Layout className="site-layout" style={{ minHeight: '100vh' }}>
          {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
          <Content style={{ margin: '0 16px' }}>
            <List />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </antd.Layout>
      </antd.Layout>
    </>
  );
}

export default App;
