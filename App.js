import React from 'react';

import RequestView from './src/screens/RequestView';
import SetMenuView from './src/screens/SetMenuView';
import OrderView from './src/screens/OrderView';
import TableView from './src/screens/TableView';
import LoginView from './src/screens/LoginView';
import LogoutView from './src/screens/LogoutView';
import SettingView from './src/screens/SettingView';
import ScannerView from './src/screens/ScannerView';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const MainRoot = createAppContainer(createSwitchNavigator(
  {
    Login: {
      path: '/LoginView',
      screen: LoginView,
     },
     Logout: {
       path: '/LogoutView',
       screen: LogoutView,
      },
     Areas: {
      path: '/TableView',
      screen: TableView,
     },
     OrderView: {
      path: '/OrderView',
      screen: OrderView,
     },
     SetMenuView: {
      path: '/SetMenuView',
      screen: SetMenuView,
     },
     RequestView: {
      path: '/RequestView',
      screen: RequestView,
     },
     Settings: {
      path: '/SettingView',
      screen: SettingView,
     },
     Scanner: {
      path: '/ScannerView',
      screen: ScannerView,
     },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
  ));

export default function App() {
  return (
    <MainRoot/>
  );
}