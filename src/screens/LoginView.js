import React, { Component } from 'react';
import { Alert,TouchableOpacity,Dimensions,Image,ActivityIndicator,KeyboardAvoidingView,StyleSheet,Text,View,StatusBar, Platform, Keyboard} from 'react-native';
import * as Network from 'expo-network';
import { LinearGradient } from 'expo-linear-gradient'
import Constants from 'expo-constants';
import Icon from '@expo/vector-icons/Entypo'
import { login, CheckCasherIn } from '../services';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import { Input, Button } from 'react-native-elements';
import {ENDPOINT_URL, LOGIN_INPUT_FONT_SIZE, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, BACKGROUND_COLOR,H1FontSize,H2FontSize,H3FontSize, H1_FONT_SIZE } from '../config/constants';
import translate from '../services/translate';
import colors from "../config/colors";
import { setCustomText } from 'react-native-global-props';
import Question from '../components/Question';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class LoginView extends Component {

  login_button_text = 'Login';
  has_back_button=false;
  constructor(props) {
    super(props);
    this.state = {
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
      endpoint:''
    };
    this.translate = new translate();
  }

  async componentDidMount()  {
    try{
    let { username } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
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
        this.props.navigation.navigate("OrderView", { settings, user, table });
        return;
      }
      else {
        this.props.navigation.navigate("TableView", { settings, user });
        return;
      }
    }
    this.translate = await this.translate.loadLang();
    await cacheFonts({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    });
    let language = await _retrieveData('culture', 1);
   
   /* let network = await Network.getNetworkStateAsync();
      if (!network.isInternetReachable) {
       Alert.alert('Message', 'Please connect to internet!');
     }
    */

    let endpoint =await _retrieveData( "APP@BACKEND_ENDPOINT",  JSON.stringify(ENDPOINT_URL));
    endpoint=JSON.parse(endpoint);
 
    StatusBar.setHidden(true);
    this.defaultFonts();
    this.setState({ fontLoaded: true,endpoint, username, language: language, settings });
  } catch (ex) {
    console.log('LoginView componentDidMount Error:' + ex);
  }
  }
  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('lockTable', state.lockTable) != state.lockTable) {
      return {
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
        notification: props.navigation.getParam('notification', state.notification),
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
BingdingConfig = async (user,Config,JwtToken) => { 
  let { password, settings } = this.state;
  user.PassWord = password;
  user.BranchId = Config.I_BranchId;
  //console.log('Config.I_ItemGroupLevel:'+JSON.stringify(Config.I_ItemGroupLevel))
  _storeData('APP@USER', JSON.stringify(user), () => {
      _storeData('APP@CONFIG', JSON.stringify(Config), () => {
        _storeData('APP@JWT', JSON.stringify(JwtToken), () => {
          CheckCasherIn(Config).then(res => { 
            if (res.Status == 1) 
            {
              this.setState({ isLoading: false, isWorking: false, }, () => {
                  this.props.navigation.navigate("TableView", { settings, user });
              });
            }
            else {
             
              Question.alert('Thông báo !',
              'Quầy này chưa vào ca vui lòng kiểm tra thu ngân !', [
              {
                text: "OK", onPress: () => {
                  _remove('APP@USER');
                }
              }
            ]);
              this.setState({  isWorking: false, isLoading: false, });
            }
          }).catch((error) => {
            Question.alert( this.translate.Get('Notice'),
              this.translate.Get('Có lỗi trong quá trình xử lý :'+error), [
              {
                text: "OK", onPress: () => {}
              }
            ]);
            this.setState({ isWorking: false, isLoading: false, });
          });
      });
    });
  });
}
  login = async () => {  
    let {  username, password } = this.state;
    let that = this;
    if (username == undefined)
    username=''
    if (typeof(password) == undefined)
    password=''
if (this.has_back_button==false &&((username=='cauhinh'&&password=='')||(username==''&&password=='cauhinh')))
{
  this.props.navigation.navigate('Settings');
  return;
}
//console.log('login in form LoginView:');
const usernameValid = this.ValidaUsername();
const passwordValid = this.validatePassword();
      if (!usernameValid || !passwordValid)
        return;
    this.setState({  isWorking: true, });
        login(username, password).then((res) => {
         // console.log('login in form LoginView:'+JSON.stringify(res));
          if (res.Status != 1)
          {
            Question.alert(  this.translate.Get('Notice'),
              res.Exception_Message ? res.Exception_Message : res.LicenseAlert, [
              {
                text: this.translate.Get('AlertOK'), onPress: () => {
                }
              }
            ])
            return;
          }
          
            if (res.isAlertLicense == true) {
              Question.alert( this.translate.Get('Notice'),
                res.LicenseAlert ? res.LicenseAlert : this.translate.Get('Vui lòng xem lại bản quyền!'), [
                {
                  text: this.translate.Get('AlertOK'), onPress: () => {
                    if (res.Data != undefined && 'UserId' in res.Data && res.Data.UserId > 0) {
                      this.BingdingConfig(res.Data,res.Config,res.JwtToken);
                    }
                    else {
                      Question.alert( this.translate.Get('Notice'),
                        res.Exception_Message ? res.Exception_Message : this.translate.Get('Mật khẩu hoặc tài khoản không đúng!'), [
                        {
                          text: this.translate.Get('AlertOK'), onPress: () => {
                          }
                        }
                      ])
                    }
                  }
                }
              ]);
             return;
            }
              if (res.Data != undefined && 'UserId' in res.Data && res.Data.UserId > 0) {
                this.BingdingConfig(res.Data,res.Config,res.JwtToken);
              }
              else {
                Question.alert(  this.translate.Get('Notice'),
                  res.Exception_Message ? res.Exception_Message : this.translate.Get('Mật khẩu hoặc tài khoản không đúng!'), [
                  {
                    text: this.translate.Get('AlertOK'), onPress: () => {
                    }
                  }
                ])
              }
            
        }).catch((error) => {
          Question.alert( this.translate.Get('Notice'),error [
            {
              text: "Cancel", onPress: () => {
               
              }
            }
          ]);
        });
        this.setState({ isLoading: false, isWorking: false, })
  }
  changeLanguage = async (lang) => {
    if (this.state.language != lang) {
      _storeData("culture", lang.toString(), async () => {
        this.translate = await this.translate.loadLang();
        this.setState({ language: lang });
        this.getBranchesList();
      });
    }
  }
  ValidaUsername = async => {
    //try{
      let { username } = this.state;
      let isValid =false;
      if (username&&username!=null) 
    if (username.trim().length > 0)
    isValid=true;
    this.setState({ usernameValid:isValid });
   // console.log('usernameValid:'+isValid)
    return isValid;
    // }catch(ex)
    // {
    //   ;
    // }
    // return false;
  }

  validatePassword = () => {
    try{
      let { password } = this.state;
      let isValid =false;
    if (password&& password.trim().length > 0)
    isValid=true;
    this.setState({ passwordValid:isValid });
    return isValid;
  }catch(ex)
  {
    ;
  }
  return false;
}
_CombackView = () => {
    let { lockTable } = this.state;
    this.props.navigation.navigate('OrderView', { lockTable });
  }
  render = () => {
    const { manifest } = Constants;
    const {endpoint,  isLoading, fontLoaded,  password,  passwordValid,  username,  lockTable,  secureTextEntry,  usernameValid, } = this.state;
let ImageWidth=SCREEN_WIDTH*0.12

    if (!fontLoaded) {
      return (
        <ActivityIndicator style={{ marginTop: SCREEN_HEIGHT / 2 - 20 }} size="large" color="red"></ActivityIndicator>);
    }
    return (
      <View style={styles.container}>
          <StatusBar hidden={true} />
        <KeyboardAvoidingView  keyboardType='light' behavior="position" contentContainerStyle={styles.formContainer}  >
            {this.state.notification ?
            <View style={{ marginBottom:'5%'}} >
              <Text style={{fontSize:H1_FONT_SIZE*1.2, color:'#fff'}}>Quý khách vui lòng đợi nhân viên xác nhận thanh toán</Text>
            </View>
            :null}
          <View style={styles.BorderLogin}>
            <View style={styles.BorderFormLogin}>
            <View><Text style={{ color: BACKGROUND_COLOR, textAlign: 'center', fontSize: H1FontSize, }}>{this.translate.Get('Đăng nhập hệ thống')}</Text></View> 
              <FormInput leftIcon={  <Icon  name="user"  type="antdesign"
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
                placeholder={this.translate.Get('username')}
                placeholderTextColor="#7384B4"
                refInput={(input) => this.usernameInput = input}
                onChangeText={username =>{ this.setState({ username })
                this.ValidaUsername();
              }
              }
                onSubmitEditing={() => {
                  this.ValidaUsername();
                  this.passwordInput.focus();
                }}
                errorMessage={(usernameValid==true) ? null : this.translate.Get('login.fail.missing_username')}
              />
              <FormInput  leftIcon={
                  <Icon  name="lock"
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
                placeholder={this.translate.Get('password')}
                placeholderTextColor="#7384B4"
                refInput={(input) => this.passwordInput = input}
                onChangeText={password =>{ 
                  this.setState({ password })
                this.validatePassword();
              }
              }
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  this.validatePassword();
                  this.login();
                }}
                errorMessage={(passwordValid==true) ? null : this.translate.Get('login.fail.missing_password')}
              />
            </View>
            <LinearGradient  colors={["#257DBC", "#1D75B3", "#166ead", "#0C629F"]}
              style={{ marginTop: ITEM_FONT_SIZE }}>
              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ITEM_FONT_SIZE * 1.5 }}>
                <View style={{ flexDirection: "row", alignContent: "flex-start",textAlignVertical:'center', paddingTop: ITEM_FONT_SIZE / 2, }}>
               

                  <TouchableOpacity onPress={() => this.changeLanguage(1)}>
                    <Image resizeMode="contain" source={require('../../assets/icons/vi1.png')} style={{ width: 50, height: 50, opacity: this.state.language == 1 ? 1 : 0.5 }}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.changeLanguage(2)} style={{ left: 5 }}>
                    <Image resizeMode="contain" source={require('../../assets/icons/en1.png')} style={{ width: 50, height: 50, opacity: this.state.language == 1 ? 0.5 : 1 }}></Image>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignContent: "center", paddingTop: ITEM_FONT_SIZE / 2, paddingBottom: ITEM_FONT_SIZE / 2, }}>
                {this.has_back_button ? 
                <View style={{ paddingRight: ITEM_FONT_SIZE / 2 }}>
                  <Button
                    con={{name:"input", color:"white"}}
                    buttonStyle={styles.button}
                    ontainerStyle={styles.buttonContainer}
                    title={this.translate.Get('Back')}
                    onPress={() => {
                      Keyboard.dismiss();
                      this._CombackView();
                    }}
                    titleStyle={styles.buttonText}
                    disabled={isLoading}
                  /></View> 
                   : null}
                  <View style={{}}><Button buttonStyle={styles.button}  title={this.translate.Get(this.login_button_text)}
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

         {/* <View style={styles.bottomImage}>
          <TouchableOpacity style={{ width: "80%", maxWidth: 442 }} onPress={() => {
            
            let now = (new Date()).getTime();
            if ((now - this.state.firstTouch) / 1000 > 1) {
              this.setState({ firstTouch: now });
            }
            else {
              this.props.navigation.navigate('Settings');
            }
          }
          }>
             <Image resizeMode="contain" style={{ width: SCREEN_WIDTH * 0.8, maxWidth: 442 }} 
            source={require('../../assets/icons/relipos_copyright_white_2x.png')}
             ></Image> 
             
          </TouchableOpacity>
        </View>  */}
       
        {this.state.isWorking ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
           <View position='absolute'  style={{width:ImageWidth, alignItems:'baseline',top:5,left:0,opacity:0.7  }}>
            <Image resizeMode='contain' source={{uri:endpoint+'/Resources/Images/View/Logo.jpg'}}
              style={{ width:ImageWidth,height:ImageWidth*4/6 }}></Image>
           <View style={{ width:'100%',alignItems:'center'}}>
             <Text style={{ color: colors.white }}>V.{manifest.version} _ {Platform.OS == 'ios' ?manifest.ios.buildNumber :manifest.android.versionCode}</Text></View>
          </View> 
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
    backgroundColor: '#333D4C',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    marginTop: ITEM_FONT_SIZE / 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333D4C',
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
