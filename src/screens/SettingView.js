import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Dimensions,
  Linking,
  Image, Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  StatusBar,
  Keyboard
} from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { ENDPOINT_URL, BUTTON_FONT_SIZE } from '../config/constants';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import { _retrieveData, _storeData, _remove } from '../services/storages';
import colors from '../config/colors';
import translate from '../services/translate';
import { ComboBox, Button } from '../components';
import { FormInput } from '../components/formControls';
import { validUrl } from '../services/util';
import { GetPosList, loadPosConfig } from '../services';
import { setCustomText } from 'react-native-global-props';
import FormStyle from '../styles/form';
import Question from '../components/Question';
import * as Permissions from 'expo-permissions';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Settings extends Component {
  S_DepartmentNameInput = null;
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      language: 'en',
      endpoint: '',
      PosList: [],
      Data: [],
      isEndpointValid: false,
      showPosPicker: false,
      settings: {
        PosId: 0,
        PolName: '',
        PosIdName: '',
        I_BusinessType: 0,
        I_BusinessTypeName: '',
        I_BranchID: 0,
        I_BranchIDName: '',
        I_Counter: 0,
        I_CounterName: '',
        I_Currency: 0,
        I_CurrencyName: '',
        I_Limit_Booking_Time: 0,
        I_LimitQuntityBooking: 0,
        I_LimitTypeBooking: 0,
        URL_LOGO: '',
        S_DepartmentName: '',
      },
      URL_LOGO: '',
      imageName: null,
      imageType: null,
    };
    this.translate = new translate();
  }

  static getDerivedStateFromProps = (props, state) => {
    let settings = props.navigation.getParam("settings", state.settings);
    if (settings != state.settings) {
      return {
        settings: props.navigation.getParam("settings", state.settings),
      };
    }
    // Return null if the state hasn't changed
    return null;
  };

  async componentDidMount() {
    this.translate = await this.translate.loadLang();
    let settings = await _retrieveData('settings');
    if (settings == undefined) {
      settings = {};
    }
    else {
      try {
        settings = JSON.parse(settings);
      }
      catch (ex) {
        settings = {};
      }
    }
    await Font.loadAsync({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    });
    let res = ENDPOINT_URL;
    res = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
    res = JSON.parse(res);
    let language = await _retrieveData('culture', 1);
    const isEndpointValid = this.state.endpoint.length > 0 && validUrl(this.state.endpoint);
    this.getPermissionAsync();
    this.setState({ settings, fontLoaded: true, isEndpointValid, endpoint: res, language, isReady: true }, () => this._retrievePos(settings));
    this.defaultFonts();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }

  _retrievePos = async (settings) => {
    if (this.validateEndpoint()) {
      GetPosList().then((res) => {
        let item = {};
        if ('PosId' in settings) {
          item.PosId = settings.PosId;
        }
        if ('PosIdName' in settings) {
          item.PolName = settings.PosIdName;
          item.PosIdName = settings.PosIdName;
        }
        if (res.Data.length > 0) {
          item.PosId = settings.PosId > 0 ? settings.PosId : res.Data[0].PosId;
          item.PolName = settings.PosIdName != null ? settings.PosIdName : res.Data[0].PolName;
          item.PosIdName = settings.PosIdName != null ? settings.PosIdName : res.Data[0].PolName;
          this.setState({ PosList: res.Data }, () => { this._loadPosConfig(item) });
        }
      });
    }
  }

  _loadPosConfig = async (item) => {
    let { settings } = this.state;
    if (!('PosId' in item) || item.PosId < 1) {
      return;
    }
    settings.PosId = item.PosId;
    settings.PolName = item.PolName;
    settings.PosIdName = item.PolName;
    _storeData('settings', JSON.stringify(settings), () => {
      this.setState({ settings, showPosPicker: false });
    });
  }

  updateEndpoint = () => {
    if (this.validateEndpoint()) {
      const { endpoint, settings } = this.state;
      let that = this;
      _storeData('APP@BACKEND_ENDPOINT', JSON.stringify(endpoint), () => { that._retrievePos(settings) });
    }
  }

  validateEndpoint() {
    const { endpoint } = this.state
    const isEndpointValid = endpoint.length > 0 && validUrl(endpoint);
    LayoutAnimation.easeInEaseOut();
    this.setState({ isEndpointValid });
    isEndpointValid || this.endpointInput.shake();
    return isEndpointValid;
  }

  _saveSettings = () => {
    _storeData('settings', JSON.stringify(this.state.settings), () => { this.props.navigation.navigate("Login", { settings: this.state.settings }) });
  }

  _clearSettings = () => {
    Question.alert(
      this.translate.Get('Notice'),
      this.translate.Get('Bạn có chắc chắn muốn xoá?'), [
      {
        text: "Ok", onPress: () => {
          this.setState({ isLoading: false, isWorking: false, })
        }
      }
    ],
      { cancelable: false }
    )
    let settings = { "PosId": 1, "PosIdName": "Thu ngân", "I_BusinessType": 1, "I_BranchID": 3, "I_Currency": 1, "S_DepartmentName": "Nhà hàng HỢP NHẤT", "I_LimitTypeBooking": "5", "I_LimitQuntityBooking": "5", "I_Limit_Booking_Time": "5", "I_CounterName": "Thu ngân 1", "I_BusinessTypeName": "Restaurant | Coffee | Bar", "I_BranchIDName": "Mô hinh phức hợp", "I_CurrencyName": "VND" };
    _remove("APP@BACKEND_ENDPOINT", async () => {
      _storeData('settings', JSON.stringify(settings), () => { this.setState({ settings, endpoint: ENDPOINT_URL }) });
    });
  }

  _setSetting = (id, value, key) => {
    let { settings } = this.state;
    settings[key] = id;
    settings[key + 'Name'] = value;
    this.setState({ settings });
  }

  render() {
    let { endpoint, isEndpointValid, PosList, Data, settings, item, URL_LOGO } = this.state;
    if (!this.state.fontLoaded) {
      return (
        <View style={[styles.container, { alignItems: 'center', justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="red"></ActivityIndicator>
        </View>);
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
        <StatusBar hidden={true} />
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <ScrollView style={{ width: SCREEN_WIDTH, }}>
            <View style={{ width: SCREEN_WIDTH, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", paddingBottom: 5, borderBottomColor: 'white', borderBottomWidth: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%' }}>
                  <View style={{ width: '25%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14 }} numberOfLines={5}>{this.translate.Get('Endpoint')}:</Text>
                  </View>
                  <FormInput
                    refInput={input => (this.endpointInput = input)}
                    inputContainerStyle={[{ borderBottomWidth: 1, borderColor: '#EEEEEE', width: '75%' }]}
                    rightIcon={
                      <TouchableOpacity style={{ paddingRight: 15, paddingTop: 5 }} onPress={() => { this.updateEndpoint(); Keyboard.dismiss(); }}>
                        <Icon
                          name={'check'}
                          type="Entypo"
                          color={'#0074D2'}
                          size={26}
                          style={{
                            justifyContent: "space-between",
                            backgroundColor: 'transparent',
                            fontSize: 22,
                          }}
                        />
                      </TouchableOpacity>
                    }
                    color={colors.grey1}
                    value={endpoint}
                    placeholder={this.translate.Get('Endpoint')}
                    returnKeyType="next"
                    keyboardType="url"
                    inputStyle={[{ fontSize: 14, color: '#29ade3' }]}
                    onBlur={() => { this.setState({ endpoint }, () => { this.updateEndpoint() }); Keyboard.dismiss(); }}
                    onChangeText={endpoint => this.setState({ endpoint })}
                    errorMessage={isEndpointValid ? null : this.translate.Get('wrong endpoint')}
                    onSubmitEditing={() => { this.updateEndpoint(); Keyboard.dismiss(); }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", paddingBottom: 5, borderBottomColor: 'white', borderBottomWidth: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%' }}>
                  <View style={{ width: '25%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14 }} numberOfLines={5}>{this.translate.Get('Pos')}:</Text>
                  </View>
                  <FormInput
                    onFocus={() => { Keyboard.dismiss(); this.setState({ showPosPicker: true }); }}
                    refInput={input => this.PosPicker = input}
                    placeholder={this.translate.Get('Please select pos')}
                    inputContainerStyle={[{ borderBottomWidth: 1, borderColor: '#EEEEEE', width: '75%' }]}
                    inputStyle={[{ fontSize: 14, color: '#29ade3' }]}
                    autoFocus={false}
                    color={colors.grey1}
                    autoCapitalize="none"
                    rrorStyle={FormStyle.errorInputStyle}
                    autoCorrect={false}
                    blurOnSubmit={false}
                    value={settings.PosIdName}
                    placeholderTextColor="#7384B4" />
                </View>
              </View>

            </View>
          </ScrollView>
        </View>

        <View style={{ backgroundColor: colors.primary, alignContent: "center", flexDirection: 'row', alignItems: "center", justifyContent: "center", height: 70, maxHeight: 70, }}>
          <Button
            containerStyle={{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, width: SCREEN_WIDTH / 3, maxHeight: 40, paddingLeft: 40 }}
            buttonStyle={{ borderRadius: 0, backgroundColor: colors.white, paddingHorizontal: 50 }}
            title={this.translate.Get("Xoá dữ liệu tạm")}
            onPress={this._clearSettings}
          />
          <Button
            containerStyle={{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, width: SCREEN_WIDTH / 3, maxHeight: 40, marginLeft: 40 }}
            buttonStyle={{ borderRadius: 0, backgroundColor: colors.white, paddingHorizontal: 10 }}
            title={this.translate.Get("Apply")}
            onPress={this._saveSettings}
          />
        </View>

        {this.state.showPosPicker ?
          <ComboBox data={PosList} translate={this.translate}
            keyId='PosId'
            value='PolName'
            name={this.translate.Get("CHỌN MÁY POS")}
            selectedId={settings.PosId}
            onCancel={() => this.setState({ showPosPicker: false })}
            onSelect={(item) => { this._loadPosConfig(item); }}
          />
          : null}

        {this.state.isWorking ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
      </View>
    );
  }

  renderHeader = () => {
    return (
      <View style={{
        backgroundColor: colors.primary,
        paddingVertical: 10,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.primary,
      }}>
        <TouchableOpacity style={{ paddingTop: 10 }}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Icon name='arrowleft' type='antdesign' style={{ fontSize: 20, paddingTop: 10, }} color='white' ></Icon>
        </TouchableOpacity>
        <View style={{ color: colors.primary, flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
          <View style={{ width: '10%', height: 3, backgroundColor: colors.white }}></View>
          <Text style={{ fontSize: BUTTON_FONT_SIZE * 1.2, fontFamily: 'RobotoBold', color: colors.white, textAlign: 'center', paddingHorizontal: 4 }}>
            {this.translate.Get('SETTINGS')}
          </Text>
          <View style={{ width: '10%', height: 3, backgroundColor: colors.white }}></View>
        </View>
        <TouchableOpacity style={{ paddingTop: 10 }}
          onPress={() => this.props.navigation.navigate('Scanner')}>
          <Icon name='qrcode' type='antdesign' style={{ fontSize: 20, paddingTop: 10, }} color='white' ></Icon>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dropdownItemViewStyle: {
    justifyContent: "center",
    width: SCREEN_WIDTH / 3 - 10
  },
  dropdownItemTextStyle: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    margin: 10,
    width: SCREEN_WIDTH / 3 - 30
  },
  dropdownControlStyle: {
    height: 30,
    borderRadius: 20,
    zIndex: 10,
    width: SCREEN_WIDTH / 3
  },
  dropdownTextStyle: {
    width: SCREEN_WIDTH / 3 - 20,
  },
  dropdownStyle: {
    borderColor: "rgba(110, 120, 170, 1)",
    width: SCREEN_WIDTH / 3 - 20,
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: Constants.statusBarHeight,
  },
  rowSelector: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selected: {
    position: 'absolute',
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTextButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#034e7d',
    borderRadius: 10,
    height: 40,
    width: 160,
  },
  registerButton: {
    backgroundColor: '#ec1e24',
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  inputContainerStyle: {
    borderBottomColor: '#EEEEEE'
  },
  titleContainer: {
    height: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: '#FF0000',
    fontSize: 30,
  },
  helpContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH,
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  helpText: {
    color: '#034e7d',
    fontSize: 16,
  }
});
