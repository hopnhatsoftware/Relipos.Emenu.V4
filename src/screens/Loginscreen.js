import React, { Component } from 'react';
import {
  Alert,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  StatusBar, Platform, Keyboard
} from 'react-native';
import * as Network from 'expo-network';
import { LinearGradient } from 'expo-linear-gradient'
import Constants from 'expo-constants';
import Icon from '@expo/vector-icons/Entypo'
import { login, CheckCasherIn } from '../services';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import { Input, Button } from 'react-native-elements';
import { LOGIN_INPUT_FONT_SIZE, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, BACKGROUND_COLOR, ENDPOINT_URL } from '../config/constants';
import t from '../services/translate';
import FormStyle from '../styles/form';
import colors from "../config/colors";
import { setCustomText } from 'react-native-global-props';
import Question from '../components/Question';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Loginscreen extends Component {

  login_button_text = 'Login';
  has_back_button = false;

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      isLoading: false,
      branchId: -1,
      fontLoaded: false,
      branch: '',
      username: '',
      password: '',
      secretPassword: '',
      isShowPassword: false,
      branchesList: [],
      secureTextEntry: true,
      usernameValid: true,
      passwordValid: true,
      language: 1,
      settings: {},
      firstTouch: '',
      lockTable: false,
      isWorking: false,
      showDropdown: false,
    };
    this.t = new t();
  }

  async componentDidMount() {
    let { username } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
    console.log('setting login', settings);

    let user_linking = await _retrieveData('APP@USER_LINKING', JSON.stringify({}));
    if (user_linking != "{}") {
      user_linking = JSON.parse(user_linking);
    }
    let user = await _retrieveData('APP@USER', JSON.stringify({}));
    if (typeof user !== 'undefined') {
      user = JSON.parse(user);
      username = user.UserName;
    }
    if (settings == undefined) {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      try {
        settings = JSON.parse(settings);
      }
      catch (ex) {
        this.props.navigation.navigate("Settings");
        return;
      }
    }
    if (user != null && user.UserId > 0) {
      let table = await _retrieveData('APP@TABLE', JSON.stringify({}));
      table = JSON.parse(table);
      if (table != null && table.TicketID > 0) {
        this.props.navigation.navigate("Booking", { settings, user, table });
        return;
      }
      else {
        this.props.navigation.navigate("Areas", { settings, user });
        return;
      }
    }

    this.t = await this.t.loadLang();
    await cacheFonts({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    });
    let language = await _retrieveData('culture', 1);
    let network = await Network.getNetworkStateAsync();
    if (!network.isInternetReachable) {
      Alert.alert('Message', 'Please connect to internet!');
    }
    this.setState({ fontLoaded: true, isConnected: network.isInternetReachable, username, language: language, settings });
    StatusBar.setHidden(true);
    this.defaultFonts();
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('lockTable', state.lockTable) != state.lockTable) {
      return {
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }

  login = async () => {
    let {
      username,
      password,
      settings
    } = this.state;
    this.setState({ isLoading: true, isWorking: true, });

    let that = this;
    let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
    endpoint = JSON.parse(endpoint);
    if (username == 'apple' && endpoint == ENDPOINT_URL) {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
      let user = {};
      user.BranchId = 1;
      user.PassWord = '1234567890';
      user.UserName = username;
      _storeData('settings', JSON.stringify(settings), () => {
        _storeData('APP@USER', JSON.stringify(user),
          () => {
            that.props.navigation.navigate("Areas", { settings, user });
            return;
          });
      });
    }
    else {
      // Simulate an API call
      const usernameValid = this.validateusername();
      const passwordValid = this.validatePassword();

      if (usernameValid && passwordValid) {
        login(endpoint, username, password).then((res) => {
          if (res.Status == 1) {
            if (res.isAlertLicense == true) {
              Question.alert(
                this.t._('Notice'),
                res.LicenseAlert ? res.LicenseAlert : this.t._('Vui lòng xem lại bản quyền!'), [
                {
                  text: this.t._('CHẤP NHẬN'), onPress: () => {
                    if (res.Data != undefined && 'UserId' in res.Data && res.Data.UserId > 0) {
                      let user = res.Data;
                      let Config = res.Config;
                      let JwtToken = res.JwtToken;
                      user.BranchId = Config.I_BranchId;
                      user.PassWord = password;
                      _storeData('APP@USER', JSON.stringify(user), () => {
                        _storeData('APP@USER_LINKING', JSON.stringify(user), () => {
                          _storeData('APP@CONFIG', JSON.stringify(Config), () => {
                            _storeData('APP@JWT', JSON.stringify(JwtToken), () => {
                              CheckCasherIn().then(res => {
                                if (res.Status == 1) {
                                  this.setState({ isLoading: false, fontLoaded: true, isWorking: false, }, () => {
                                    that.props.navigation.navigate("Areas", { settings, user });
                                  });
                                }
                                else {
                                  this.setState({ fontLoaded: true, isWorking: false, isLoading: false, });
                                }
                              }).catch(error => {
                                this.setState({ fontLoaded: true, isWorking: false, isLoading: false, });
                              });
                            });
                          });
                        });
                      });
                    }
                    else {
                      Question.alert(
                        this.t._('Notice'),
                        res.Exception_Message ? res.Exception_Message : this.t._('Mật khẩu hoặc tài khoản không đúng!'), [
                        {
                          text: this.t._('CHẤP NHẬN'), onPress: () => {
                            this.setState({ isLoading: false, isWorking: false, fontLoaded: true, })
                          }
                        }
                      ])
                    }
                  }
                }
              ])
            }
            else {
              if (res.Data != undefined && 'UserId' in res.Data && res.Data.UserId > 0) {
                let user = res.Data;
                let Config = res.Config;
                let JwtToken = res.JwtToken;
                user.BranchId = Config.I_BranchId;
                user.PassWord = password;
                _storeData('APP@USER', JSON.stringify(user), () => {
                  _storeData('APP@USER_LINKING', JSON.stringify(user), () => {
                    _storeData('APP@CONFIG', JSON.stringify(Config), () => {
                      _storeData('APP@JWT', JSON.stringify(JwtToken), () => {
                        CheckCasherIn().then(res => {
                          if (res.Status == 1) {
                            this.setState({ isLoading: false, fontLoaded: true, isWorking: false, }, () => {
                              that.props.navigation.navigate("Areas", { settings, user });
                            });
                          }
                          else {
                            this.setState({ fontLoaded: true, isWorking: false, isLoading: false, });
                          }
                        }).catch(error => {
                          this.setState({ fontLoaded: true, isWorking: false, isLoading: false, });
                        });
                      });
                    });
                  });
                });
              }
              else {
                Question.alert(
                  this.t._('Notice'),
                  res.Exception_Message ? res.Exception_Message : this.t._('Mật khẩu hoặc tài khoản không đúng!'), [
                  {
                    text: this.t._('CHẤP NHẬN'), onPress: () => {
                      this.setState({ isLoading: false, isWorking: false, fontLoaded: true, })
                    }
                  }
                ])
              }
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
            ])
          }
        }).catch((error) => {
          Question.alert(
            this.t._('Notice'),
            this.t._('Không thể kết nối đến máy chủ, vui lòng xoá dữ liệu tạm và thử lại!'), [
            {
              text: "Cancel", onPress: () => {
                this.setState({ isLoading: false, isWorking: false, })
              }
            },
            {
              text: this.t._("Xoá dữ liệu tạm"), onPress: () => {
                let settings = { "PosId": 1, "PosIdName": "Thu ngân" };
                _remove("APP@BACKEND_ENDPOINT", async () => {
                  this.setState({ isLoading: false, settings, isWorking: false, })
                });
              }
            }
          ]);
        });
      }
      else {
        this.setState({ isLoading: false, isWorking: false, usernameValid, passwordValid });
      }
    }
  }
  changeLanguage = async (lang) => {
    if (this.state.language != lang) {
      _storeData("culture", lang.toString(), async () => {
        this.t = await this.t.loadLang();
        this.setState({ language: lang });
        this.getBranchesList();
      });
    }
  }
  validateusername = () => {
    const { username } = this.state;
    const usernameValid = username.trim().length > 0;
    this.setState({ usernameValid });
    return usernameValid;
  }

  validatePassword = () => {
    const { password } = this.state;
    const passwordValid = password.trim().length > 0;
    this.setState({ passwordValid });
    return passwordValid;
  }

  _renderBooking = () => {
    let { lockTable } = this.state;
    this.props.navigation.navigate('Booking', { lockTable });
  }

  render = () => {
    const { manifest } = Constants;
    const {
      isLoading,
      fontLoaded,
      password,
      passwordValid,
      username,
      lockTable,
      secureTextEntry,
      usernameValid,
    } = this.state;

    if (!fontLoaded) {
      return (
        <ActivityIndicator style={{ marginTop: SCREEN_HEIGHT / 2 - 20 }} size="large" color="red"></ActivityIndicator>);
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <KeyboardAvoidingView
          keyboardType='light'
          behavior="position"
          contentContainerStyle={styles.formContainer}
        >
          <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, alignItems: "center", height: SCREEN_HEIGHT * 0.27 }}>
            <Image resizeMode="contain" source={require('../../assets/icons/logo1_doc.png')}
              style={{ height: SCREEN_HEIGHT * 0.25 - 20 }}></Image>
            <View style={{ width: SCREEN_WIDTH, alignItems: "center", height: 20 }}><Text style={{ color: colors.white }}>Version: {manifest.version} - Build: {Platform.OS == 'ios' ? manifest.ios.buildNumber : manifest.android.versionCode}</Text></View>
          </View>
          <View style={styles.BorderLogin}>
            <View style={styles.BorderFormLogin}>
              {!this.has_back_button ? <View><Text style={{ color: BACKGROUND_COLOR, textAlign: 'center', fontSize: BUTTON_FONT_SIZE * 1.2, }}>{this.t._('Đăng nhập hệ thống')}</Text></View> : null}
              {this.has_back_button ? <View><Text style={{ color: BACKGROUND_COLOR, textAlign: 'center', fontSize: BUTTON_FONT_SIZE * 1.2, }}>{this.t._('Đăng xuất hệ thống')}</Text></View> : null}
              <FormInput
                leftIcon={
                  <Icon
                    name="user"
                    type="antdesign"
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 22,
                      color: 'rgba(0, 0, 0, 0.38)',
                    }}
                  />
                }
                inputContainerStyle={styles.inputContainerStyle}
                value={username}
                keyboardAppearance='light'
                autoFocus={false}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='next'
                placeholder={this.t._('username')}
                placeholderTextColor="#7384B4"
                refInput={(input) => this.usernameInput = input}
                onChangeText={username => this.setState({ username })}
                onSubmitEditing={() => {
                  this.validateusername();
                  this.passwordInput.focus();
                }}
                errorMessage={usernameValid ? null : this.t._('login.fail.missing_username')}
              />
              <FormInput
                leftIcon={
                  <Icon
                    name="lock"
                    type="antdesign"
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 22,
                      color: 'rgba(0, 0, 0, 0.38)',
                    }}
                  />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => { this.setState({ secureTextEntry: !this.state.secureTextEntry, }) }}>
                    <Icon
                      name={this.state.secureTextEntry ? 'eye' : 'eye-with-line'}
                      type="entypo"
                      style={{
                        justifyContent: "space-between",
                        color: 'rgba(0, 0, 0, 0.38)',
                        backgroundColor: 'transparent',
                        fontSize: 22,
                      }}
                    />
                  </TouchableOpacity>
                }
                inputContainerStyle={styles.inputContainerStyle}
                secureTextEntry={this.state.secureTextEntry}
                textContentType="password"
                value={password}
                keyboardAppearance='light'
                autoFocus={false}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='next'
                placeholder={this.t._('password')}
                placeholderTextColor="#7384B4"
                refInput={(input) => this.passwordInput = input}
                onChangeText={password => this.setState({ password })}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  this.login();
                }}
                errorMessage={passwordValid ? null : this.t._('login.fail.missing_password')}
              />
            </View>
            <LinearGradient
              colors={["#257DBC", "#1D75B3", "#166ead", "#0C629F"]}
              style={{ marginTop: ITEM_FONT_SIZE }}>
              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ITEM_FONT_SIZE * 1.5 }}>
                <View style={{ flexDirection: "row", alignContent: "flex-start", paddingTop: ITEM_FONT_SIZE / 2, }}>
                  <TouchableOpacity onPress={() => this.changeLanguage(1)}>
                    <Image resizeMode="contain" source={require('../../assets/icons/vi1.png')} style={{ width: 50, height: 50, opacity: this.state.language == 1 ? 1 : 0.5 }}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.changeLanguage(2)} style={{ left: 5 }}>
                    <Image resizeMode="contain" source={require('../../assets/icons/en1.png')} style={{ width: 50, height: 50, opacity: this.state.language == 1 ? 0.5 : 1 }}></Image>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignContent: "center", paddingTop: ITEM_FONT_SIZE / 2, paddingBottom: ITEM_FONT_SIZE / 2, }}>
                  {this.has_back_button ? <View style={{ paddingRight: ITEM_FONT_SIZE / 2 }}><Button
                    //icon={{name:"input", color:"white"}}
                    buttonStyle={styles.button}
                    //containerStyle={styles.buttonContainer}
                    title={this.t._('Back')}
                    onPress={() => {
                      Keyboard.dismiss();
                      this._renderBooking();
                    }}
                    titleStyle={styles.buttonText}
                    disabled={isLoading}
                  /></View> : null}
                  <View style={{}}><Button
                    //icon={{name:"input", color:"white"}}
                    buttonStyle={styles.button}
                    //containerStyle={styles.buttonContainer}
                    title={this.t._(this.login_button_text)}
                    onPress={() => {
                      Keyboard.dismiss();
                      this.login();
                    }}
                    titleStyle={styles.buttonText}
                    disabled={isLoading}
                  /></View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.bottomImage}>
          <TouchableOpacity style={{ width: "80%", maxWidth: 442 }} onPress={() => {
            if (this.has_back_button) {
              return;
            }
            let now = (new Date()).getTime();
            if ((now - this.state.firstTouch) / 1000 > 1) {
              this.setState({ firstTouch: now });
            }
            else {
              this.props.navigation.navigate('Settings');
            }
          }
          }>
            <Image resizeMode="contain" style={{ width: SCREEN_WIDTH * 0.8, maxWidth: 442 }} source={require('../../assets/icons/relipos_copyright_white_2x.png')} ></Image>
          </TouchableOpacity>
        </View>
        {this.state.isWorking ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
      </View>
    );
  }
}

export const FormInput = props => {
  const { icon, type, refInput, ...otherProps } = props;
  return (
    <Input
      {...otherProps}
      ref={refInput}
      containerStyle={{ height: 'auto', marginTop: '5%', borderColor: 'white', borderRadius: 3, borderWidth: 1, backgroundColor: 'white', }}
      inputContainerStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2 + 4, borderBottomWidth: 0, }}
      leftIcon={<Icon name={icon} type={type}
        color='rgba(0, 0, 0, 0.38)' size={LOGIN_INPUT_FONT_SIZE} />}
      inputStyle={{ minHeight: 0, height: 'auto', fontSize: LOGIN_INPUT_FONT_SIZE, paddingLeft: '2%' }}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      errorStyle={styles.errorInputStyle}
      autoCorrect={false}
      blurOnSubmit={false}
      placeholderTextColor="#000000"
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a84d0',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    marginTop: ITEM_FONT_SIZE / 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a84d0',
  },
  inputContainerStyle: {
    height: LOGIN_INPUT_FONT_SIZE * 3,
    borderBottomColor: 'white'
  },
  // Dropdown
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#0176cd',
  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  inputContainer: {
    paddingLeft: ITEM_FONT_SIZE / 2,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: ITEM_FONT_SIZE * 2,
    marginVertical: ITEM_FONT_SIZE / 2,
  },
  inputStyle: {
    flex: 1,
    marginLeft: ITEM_FONT_SIZE / 2,
    color: '#000000',
    fontSize: ITEM_FONT_SIZE,
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#FF0000',
  },

  bottomImage: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: 'flex-end',
    // marginBottom:30,
    width: SCREEN_WIDTH
  },
  buttonText: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.3,
    width: BUTTON_FONT_SIZE * 4
  },
  bottomPanel: {
    flex: 1
  },
  modal: {
    flexGrow: 1
  },

  loading: {
    alignSelf: 'center'
  },
  list: {
    //flexGrow: 1,
  },
  rowText: {
    paddingHorizontal: ITEM_FONT_SIZE / 3,
    paddingVertical: ITEM_FONT_SIZE / 3,
    fontSize: ITEM_FONT_SIZE,
    color: '#000000',
    backgroundColor: '#000000',
    textAlignVertical: 'center'
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white'
  },
  BorderLogin: {
    borderRadius: 2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderColor: '#166ead',
    borderBottomColor: '#0C629F',
    backgroundColor: '#EEEEEE',
    width: SCREEN_WIDTH * 0.5,
  },
  BorderFormLogin: {
    paddingBottom: ITEM_FONT_SIZE / 2,
    paddingLeft: ITEM_FONT_SIZE,
    paddingRight: ITEM_FONT_SIZE,
    paddingTop: ITEM_FONT_SIZE,
  },
  item_view_text: {
    height: SCREEN_HEIGHT + Constants.statusBarHeight,
    width: SCREEN_WIDTH,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey1,
    opacity: 0.5,
    bottom: 0,
    right: 0,
    borderTopColor: colors.grey4,
    borderTopWidth: 1
  },
});
