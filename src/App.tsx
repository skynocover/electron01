import React from 'react';
import './App.css';
import * as antd from 'antd';
import { AppContext } from './AppContext';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import List from './pages/List';
import Test from './pages/Test';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

const { Header, Content, Footer, Sider } = antd.Layout;
const { SubMenu } = antd.Menu;

const Stack = createStackNavigator();

function App() {
  const appCtx = React.useContext(AppContext);

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const pages = [
    { name: 'List', component: List, options: {} },
    { name: 'Test', component: Test, options: { ...TransitionPresets.ModalPresentationIOS } },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: '100vw',
        height: '100vh',
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="List"
          screenOptions={{
            title: 'app',
            animationEnabled: true,
            // headerShown: false,
            gestureEnabled: true,
            cardOverlayEnabled: true,
          }}
        >
          {pages.map((item) => (
            <Stack.Screen key={item.name} name={item.name} component={item.component} options={item.options} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </div>
  );

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
