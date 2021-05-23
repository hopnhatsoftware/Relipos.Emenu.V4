
import { _retrieveData, _storeData, _clearData } from './storages';
import { ENDPOINT_URL } from '../config/constants';
import { serialize, formatDate1 } from '../services/util';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { loginData } from '../data/login';
import Constants from 'expo-constants';

export const getToken = async () => {
  if (!Constants.isDevice)
    return 'simulator';
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return { error: true, message: "Vui lòng cấp quyền cho ứng dụng" };
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  return token;
}

export const login = async (endpoint, userName, passWord) => {
  let settings = await _retrieveData('settings', JSON.stringify({}));
  if (settings == undefined) {
    settings = { PosId: 1, PosIdName: 'Thu ngân' };
  }
  else {
    settings = JSON.parse(settings);
  }
  if (userName == 'apple' && passWord == '123456') {
    return new Promise(resolve => {
      resolve(loginData);
    });
  }
  const moonLanding = new Date();
  moonLanding.getTime();
  let token = 'c5JHSe7PTp2dGPuMZnJ08k:APA91bG8ODmZ5FmEWlcXoCp0-qYWEewlUOubfqn5b2NFHgCOjLH3QFM6JWH8cU-yr5wiDYIzzmPyu0cwFcYboQgjzrmhQp6LUR-ORQhfq-' + formatDate1(moonLanding, 8);
  const culture = await _retrieveData('culture', 1);
  let Device = {
    Token: token,
    DeviceName: Constants.deviceName ? Constants.deviceName : 'simulator',
    DeviceId: Constants.deviceId ? Constants.deviceId : 'simulator',
    PosId: settings.PosId && settings.PosId > 0 ? settings.PosId : 1
  }

  const URL = endpoint + '/Emenu/Login?' + serialize({
    username: userName,
    password: passWord,
    Culture: culture,
    Device,
    ModId: 5,
  });
  let data = {
    UserName: userName,
    Password: passWord,
    Culture: culture,
    Device,
    ModId: 5,
  };

  console.log(URL, JSON.stringify(data));
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then((res) => {
      return res.json();
    });
}