import React, { Component } from 'react';
import {
  Alert,
  StatusBar, Platform
} from 'react-native';
import { ENDPOINT_URL } from '../config/constants';
import { login } from '../services';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import LoginView from './LoginView';
import Question from '../components/Question';


export default class LogoutView extends LoginView {
  login_button_text = 'Logout';
  has_back_button = true;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      branchId: -1,
      fontLoaded: false,
      branch: '',
      username: '',
      password: '',
      endpoint: '',
      secretPassword: '',
      isShowPassword: false,
      branchesList: [],
      passwordValid: true,
      secureTextEntry: true,
      usernameValid: true,
      language: 1,
      settings: {},
      firstTouch: '',
      lockTable: false,
      isWorking: false,
      showDropdown: false,
    };
  }
  async componentDidMount() {
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == undefined) {
      settings = {};
    }
    else {
      settings = JSON.parse(settings);
    }
    this.translate = await this.translate.loadLang();
    await cacheFonts({
      'georgia': require('../../assets/fonts/Georgia.ttf'),
      'regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
      'bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
      'light': require('../../assets/fonts/Montserrat-Light.ttf'),
    });
    let dictionary = await _retrieveData('dictionary');
    let language = await _retrieveData('culture', 1);
    this.setState({ fontLoaded: true, language: language, dictionary: dictionary, settings });
    StatusBar.setHidden(true);
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('settings', state.settings) != state.settings || 
    props.navigation.getParam('lockTable', state.lockTable) != state.lockTable) {
      return {
        settings: props.navigation.getParam('settings', state.settings),
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
        secretPassword: ''
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
}
