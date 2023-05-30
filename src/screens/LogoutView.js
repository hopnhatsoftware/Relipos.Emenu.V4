import React, { Component } from 'react';
import {
  Alert,
  StatusBar, Platform
} from 'react-native';
import { ENDPOINT_URL } from '../config/constants';
import {getLanguage } from '../services';
import { login } from '../services';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import LoginView from './LoginView';
import Question from '../components/Question';


export default class LogoutView extends LoginView {
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
      isColor: false,
      branchesList: [],
      passwordValid: true,
      secureTextEntry: true,
      usernameValid: true,
      notification :false,
      language: 1,
      settings: {},
      firstTouch: '',
      lockTable: false,
      isWorking: false,
      showDropdown: false,
    };
  }
  async componentDidMount() {
    //await this.props.componentDidMount();
    let settings = await _retrieveData('settings', JSON.stringify({}));
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
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
    let endpoint =await _retrieveData( "APP@BACKEND_ENDPOINT",  JSON.stringify(ENDPOINT_URL));
    endpoint=JSON.parse(endpoint);
    this.setState({ fontLoaded: true,endpoint, language: language, dictionary: dictionary, settings,isColor });
    await this._getLanguage(true);
    StatusBar.setHidden(true);
  }
  _getLanguage(IsActive){
    let {listLanguage,language,listLanguage2,} = this.state;
    getLanguage(IsActive).then(res => {
      listLanguage = res.Data
      this.setState({listLanguage: listLanguage})
     
      listLanguage2 = listLanguage.find((item) => {
        return item.LgId == language;
      })  
      this.setState({languageText: listLanguage2.LgName,languageImg: listLanguage2.LgClsIco})
      
      })  
  }
  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('settings', state.settings) != state.settings) {
      return {
        settings: props.navigation.getParam('settings', state.settings),
        secretPassword: ''
      };
    }
    else{
      return{
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
        notification: props.navigation.getParam('notification', state.notification),
      }
    }
    // Return null if the state hasn't changed
    return null;
  }
}
