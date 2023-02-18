import React from 'react';

import RequestView from './src/screens/RequestView';
import SetMenuView from './src/screens/SetMenuView';
import OrderView from './src/screens/OrderView';
import TableView from './src/screens/TableView';
import Payment from "./src/screens/Payment";
import Payment2 from "./src/screens/Payment2";
import Payment3 from "./src/screens/Payment3";
import LoginView from './src/screens/LoginView';
import LogoutView from './src/screens/LogoutView';
import SettingView from './src/screens/SettingView';
import ScannerView from './src/screens/ScannerView';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const MainRoot = createAppContainer(createSwitchNavigator(
  {
    LoginView: {
      path: '/LoginView',
      screen: LoginView,
     },
     LogoutView: {
       path: '/LogoutView',
       screen: LogoutView,
      },
      TableView: {
      path: '/TableView',
      screen: TableView,
     },
     OrderView: {
      path: '/OrderView',
      screen: OrderView,
     },
     Payment: {
      path: "/Payment",
      screen: Payment,
    },
    Payment2: {
      path: "/Payment2",
      screen: Payment2,
    },
    Payment3: {
      path: "/Payment3",
      screen: Payment3,
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
    initialRouteName: 'LoginView',
    headerMode: 'none',
  }
  ));

export default function App() {
  return (
    <MainRoot/>
  );
}