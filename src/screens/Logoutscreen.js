import React, { Component } from 'react';
import {
  Alert,
  StatusBar, Platform
} from 'react-native';
import { ENDPOINT_URL } from '../config/constants';
import { login } from '../services';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import Loginscreen from './Loginscreen';
import Question from '../components/Question';


export default class Logoutscreen extends Loginscreen {
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
    this.t = await this.t.loadLang();
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

  login = async () => {
    let {
      username,
      password,
      settings,
      endpoint
    } = this.state;
    this.setState({ isLoading: true, isWorking: true, });
    // Simulate an API call
    const usernameValid = this.validateusername();
    const passwordValid = this.validatePassword();

    endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
    endpoint = JSON.parse(endpoint);
    if (usernameValid && passwordValid) {
      let that = this;
      login(endpoint, username, password).then((res) => {
        if (res.Status == 1) {
          if (res.Data != undefined && 'UserId' in res.Data && res.Data.UserId > 0) {
            let user = res.Data;
            let Config = res.Config;
            let JwtToken = res.JwtToken;
            user.BranchId = Config.I_BranchId;
            user.PassWord = password;
            _remove('APP@TABLE', () => {
              _remove('APP@CART', () => {
                that.props.navigation.navigate("Areas", { settings, user });
              });
            });
          }
          else {
            if (this.state.isLoggedIn) {
              this.navigation.navigate('')
            }
            Question.alert(
              this.t._('Notice'),
              this.t._('Password or account is incorrect!'), [
              {
                text: "OK", onPress: () => {
                  this.setState({ isLoading: false, isWorking: false })
                }
              }
            ],
              { cancelable: false }
            )
          }
        }
        else {
          Question.alert(
            this.t._('Notice'),
            res.Exception_Message ? res.Exception_Message : res.LicenseAlert, [
            {
              text: this.t._('CHẤP NHẬN'), onPress: () => {
                this.setState({ isLoading: false, isWorking: false, fontLoaded: true, })
              }
            }
          ],
            { cancelable: false }
          )
        }
      }).catch((error) => {
        console.log(error);
        Question.alert(
          this.t._('Notice'),
          this.t._('Incorrect information!'), [
          {
            text: "OK", onPress: () => {
              if (username == 'nimda' && password == '@hopnhat@') {
                _remove('APP@TABLE',
                  () => {
                    _remove('APP@CART',
                      () => {
                        _remove('APP@USER',
                          () => {
                            that.props.navigation.navigate("Login");
                          });
                      });
                  });
              }
              else {
                this.setState({ isLoading: false, isWorking: false })
              }
            }
          }
        ],
          { cancelable: false }
        )
        this.setState({ isLoading: false, fontLoaded: true, isWorking: false, });
      });
    }
    else {
      this.setState({
        isLoading: false,
        isWorking: false,
        usernameValid,
        passwordValid
      });
    }
  }
}
