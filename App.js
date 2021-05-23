import React from 'react';

import Requestscreen from './src/screens/Requestscreen';
import BookingSetscreen from './src/screens/BookingSetscreen';
import Bookingscreen from './src/screens/Bookingscreen';
import Areascreen from './src/screens/Areascreen';
import Loginscreen from './src/screens/Loginscreen';
import Logoutscreen from './src/screens/Logoutscreen';
import Settingscreen from './src/screens/Settingscreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const MainRoot = createAppContainer(createSwitchNavigator(
  {
    Login: {
      path: '/Loginscreen',
      screen: Loginscreen,
     },
     Logout: {
       path: '/Logoutscreen',
       screen: Logoutscreen,
      },
     Areas: {
      path: '/Areascreen',
      screen: Areascreen,
     },
     Booking: {
      path: '/Bookingscreen',
      screen: Bookingscreen,
     },
     BookingSet: {
      path: '/BookingSetscreen',
      screen: BookingSetscreen,
     },
     Request: {
      path: '/Requestscreen',
      screen: Requestscreen,
     },
     Settings: {
      path: '/Settingscreen',
      screen: Settingscreen,
     },
     Scanner: {
      path: '/ScannerScreen',
      screen: ScannerScreen,
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