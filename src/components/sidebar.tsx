import React from 'react';
import '../App.css';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

const { Header, Content, Footer, Sider } = antd.Layout;
const { SubMenu } = antd.Menu;

const SideBar = () => {
  const appCtx = React.useContext(AppContext);
  const navigation = useNavigation();
  return (
    <Sider collapsible collapsed={appCtx.collapsed} onCollapse={appCtx.onCollapse}>
      <div className="logo" />
      <antd.Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <antd.Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => navigation.navigate('Test')}>
          Option 1
        </antd.Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <antd.Menu.Item key="3" onClick={() => navigation.navigate('List')}>
            Tom
          </antd.Menu.Item>
          <antd.Menu.Item key="5">Alex</antd.Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <antd.Menu.Item key="6">Team 1</antd.Menu.Item>
          <antd.Menu.Item key="8">Team 2</antd.Menu.Item>
        </SubMenu>
      </antd.Menu>
    </Sider>
  );
};

export default SideBar;
