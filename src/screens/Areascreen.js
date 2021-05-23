import React, { Component } from 'react';
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  separators,
  GeneralStatusBarColor,
  UIManager,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList
} from 'react-native';
import Constants from 'expo-constants';
import { _retrieveData, _storeData, _remove, _clearData } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import { ListArea, ListTables, getOrderId, Object_Search, Ticket_getById, Ticket_Flush } from '../services';
import t from '../services/translate';
import { Icon } from 'react-native-elements';
import { getTableColor } from '../services/util';
import { setCustomText } from 'react-native-global-props';
import { _TableInfo } from '../components';
import colors from '../config/colors';
import { formatCurrency } from "../services/util";
import AreasStyle from "../styles/areas";
import Question from '../components/Question';
import { TITLE_FONT_SIZE, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, ENDPOINT_URL } from '../config/constants';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Areascreen extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.Search = null;
    //const data = Array.apply(null, {length: 20}).map(Number.call, Number);

    this.state = {
      isLoading: false,
      selectedType: null,
      fontLoaded: false,
      data: [],
      selectedAreaIndex: -1,
      //dataSource: ds.cloneWithRows(data),
      AreasList: [],
      TablesList: [],
      settings: {},
      user: {},
      sItemTable: false,
      sIndexTable: -1,
      TicketInfor: {
        CustomerId: 0,
        Customquantity: 1,
        DeviceName: '',
        Description: '',
        MaleQuantity: 0,
        FemaleQuantity: 0,
        ChildrenQuantity: 0,
        ForeignQuantity: 0,
        CustomerName: '',
        TkCustomerQuantity: 1,
        TkForeignQuantity: 0,
        TkChildrenQuantity: 0,
        TkMaleQuantity: 0,
        TkFemaleQuantity: 0,
        CreateBy: null,
        CreateByName: '',
      },
      group: {
        OGroupId: '',
        ObjWaiter: '',
        ObjWaiterName: '',
      },
      B_UseOrderDefault: true,
      ObjType: 2,
      KeySearch: '',
      OgId: 2,
      isGetOrg: false,
      CustomerList: [],
      showCustomer: false,
      sCustomerItem: null,
      sCustomerIndex: -1,
      showFilterPanel: false,
      selectItemAreas: null,
      tableStatus: 0, //2,
      OrdPlatform: 1,
      showDropdown: false,
    };
    this.t = new t();
  }

  async componentDidMount() {
    this.t = await this.t.loadLang();
    this.GetListCustomer();
    await cacheFonts({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    });
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let user = await _retrieveData('APP@USER', JSON.stringify({}));
    user = JSON.parse(user);
    let user_linking = await _retrieveData('APP@USER_LINKING', JSON.stringify({}));
    user_linking = JSON.parse(user_linking);
    let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify({}));
    if (endpoint == "{}" || endpoint == null) {
      endpoint = ENDPOINT_URL;
    }
    else {
      endpoint = JSON.parse(endpoint);
    }

    console.log('settings: ', settings, user);
    this.setState({ settings, user });
    this.getlistArea(() => this.loadTables(0));
    StatusBar.setHidden(true);
    this.defaultFonts();
  }

  GetListCustomer = async () => {
    const { ObjType, KeySearch, OgId, isGetOrg } = this.state;
    this.setState({ isWorking: true });
    Object_Search(ObjType, KeySearch, OgId, isGetOrg).then((res) => {
      let CustomerList = res.Data;
      this.setState({ CustomerList, fontLoaded: true, isWorking: false, isLoading: false });
    }).catch(async (err) => {
      this.setState({ CustomerList: [], fontLoaded: true, isWorking: false, isLoading: false });
    });
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  }

  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('user', state.user) != state.user) {
      return {
        user: props.navigation.getParam('user', state.user)
      };
    }
    if (props.navigation.getParam('user', state.user) != state.user) {
      return {
        user: props.navigation.getParam('user', state.user)
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  onPressLogout = () => {
    let that = this;
    Question.alert(
      this.t._('Notice'),
      this.t._('Bạn có chắc chắn muốn đăng xuất?'),
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'OK', onPress: () => { _remove('APP@USER', () => { console.log('logout from request'); that.props.navigation.navigate('Login') }); }
        },
      ],
      { cancelable: false }
    )
  }

  getlistArea = async (callback) => {
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    let language = await _retrieveData('culture', 1);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    ListArea(Config).then((res) => {
      if (res.Data.length > 0) {
        this.setState({ AreasList: res.Data, selectedAreaIndex: 0 }, callback);
      }
      else {
        this.setState({ fontLoaded: true, language, isLoading: false, showFilterPanel: false });
      }
    }).catch(async (err) => {
      console.log('error', err);
      _remove('APP@USER',
        () => { this.props.navigation.navigate("Login"); });
    });
  }

  loadTables = async (selectedAreaIndex) => {
    let { AreasList, tableStatus } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    let AreaId = AreasList[selectedAreaIndex].AreID;
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    ListTables(Config, AreaId, tableStatus).then((res) => {
      this.setState({ selectedAreaIndex, TablesList: res.Data.Table, fontLoaded: true, isLoading: false, showFilterPanel: false });
    }).catch(async (err) => {
      this.setState({ selectedAreaIndex, fontLoaded: true, isLoading: false, showFilterPanel: false });
    });
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  }

  filter = (status) => {
    this.setState({ showFilterPanel: false, tableStatus: status }, () => { this.loadTables(this.state.selectedAreaIndex) });
  }

  _onPressTable = async (item, index) => {
    const { user, AreasList, OrdPlatform, selectedAreaIndex } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    if (item == null || item.TicketID <= 0) {
      this.setState({
        sItemTable: item, sIndexTable: index, itemTableShow: true, fontLoaded: true,
        isLoading: false, isWorking: false
      });
    }
    else {
      getOrderId(item, OrdPlatform).then((res) => {
        item.OrderId = res.Data;
        item.AreaID = AreasList[selectedAreaIndex].AreID;
        _storeData('APP@TABLE', JSON.stringify(item),
          () => {
            this.props.navigation.navigate("Booking", { settings, user, table: item });
          });
      }).catch((error) => {
        console.log(error);
        Question.alert(
          this.t._('Notice'),
          this.t._('No connection to the server, please check again!'), [
          {
            text: "OK", onPress: () => {
              this.setState({ isLoading: false });
            }
          }
        ],
          { cancelable: false }
        )
        this.setState({ isLoading: false, });
      });
    }
  }

  _handleChangeButton = async () => {
    let { TicketInfor, sItemTable, B_UseOrderDefault, OrdPlatform, group, AreasList, selectedAreaIndex } = this.state;
    let user = await _retrieveData('APP@USER', JSON.stringify({}));
    user = JSON.parse(user);
    let settings = await _retrieveData('settings', JSON.stringify({}));
    settings = JSON.parse(settings);
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings && settings.PosId ? settings.PosId : 1;
    Config.I_BusinessType = 1;
    sItemTable.AreaID = AreasList[selectedAreaIndex].AreID;
    this.setState({ isWorking: true, });
    TicketInfor.TkPcName = Constants.deviceName ? Constants.deviceName : 'simulator';
    TicketInfor.DeviceName = Constants.deviceName ? Constants.deviceName : 'simulator';
    Ticket_Flush(Config, B_UseOrderDefault, sItemTable, group, user, TicketInfor).then((res) => {
      if (res.Status == 1) {
        let CurrentData = res.Data;
        sItemTable.TicketID = CurrentData.TicketID;
        Ticket_getById(sItemTable.TicketID).then((res) => {
          if (res.Status == 1) {
            TicketInfor = res.Data;
            _storeData('APP@TICKETINFOR', JSON.stringify(TicketInfor), () => {
              getOrderId(sItemTable, OrdPlatform).then((res) => {
                if (res.Status == 1) {
                  sItemTable.OrderId = res.Data;
                  sItemTable.AreaID = AreasList[selectedAreaIndex].AreID;
                  _storeData('APP@TABLE', JSON.stringify(sItemTable),
                    () => {
                      this.setState({ isWorking: false, sItemTable, TicketInfor }, () => {
                        this.props.navigation.navigate("Booking", { settings, user, table: sItemTable });
                        return;
                      });
                    });
                }
                else {
                  this.setState({ isLoading: false, fontLoaded: true, isWorking: false, });
                }
              });
            });
          }
          else {
            this.setState({ isLoading: false, fontLoaded: true, isWorking: false, });
          }
        });
      }
      else {
        this.setState({ isLoading: false, fontLoaded: true, isWorking: false, })
      }
    }).catch((error) => {
      Question.alert(
        this.t._('Notice'),
        this.t._('Vui lòng kiểm tra lại thông tin!'), [
        {
          text: "OK", onPress: () => {
            this.setState({ isLoading: false, fontLoaded: true, isWorking: false, });
          }
        }
      ]
      )
      this.setState({ isLoading: false, fontLoaded: true, isWorking: false, });
    });
  }

  _setItemCustomer = async (item, index) => {
    let { TicketInfor } = this.state;
    TicketInfor.CustomerId = item.ObjId;
    TicketInfor.CustomerName = item.ObjName;
    this.setState({ sCustomerItem: item, sCustomerIndex: index, showCustomer: false, });
  }

  renderCustomer = (item, index) => {
    return (
      <TouchableOpacity onPress={() => { this._setItemCustomer(item, index); }}
        style={{ justifyContent: 'space-between', width: '95%', paddingLeft: 5, paddingRight: 5, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.grey5, }}  >
        <View style={{ paddingBottom: ITEM_FONT_SIZE, paddingTop: ITEM_FONT_SIZE, width: '100%' }}>
          <View style={{ paddingLeft: '5%', paddingRight: '5%', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={[styles.colorText, { width: '30%' }]} numberOfLines={2} >{item.ObjNo}</Text>
            <Text style={[styles.colorText, { width: '70%' }]} numberOfLines={2} >{item.ObjName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      AreasList,
      TablesList,
      fontLoaded,
      showFilterPanel,
      itemTableShow,
      showCustomer,
      CustomerList,
      TicketInfor,
    } = this.state;
    if (!this.state.fontLoaded) {
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator
            size="large" color="#0000ff"

            onLayout={() => {
              this.setState({ fontLoaded: false });
            }}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={{ flex: 1 }}>
          <View style={styles.toolbar}>
            <TouchableOpacity onPress={() => this.onPressLogout()} >
              <Icon name="lock" iconStyle={{ color: colors.white, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={TITLE_FONT_SIZE} type="antdesign"></Icon>
            </TouchableOpacity>
            <View style={{ color: colors.white, flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
              <View style={{ width: '8%', height: 3, backgroundColor: colors.white }}></View>
              <Text style={{ fontSize: BUTTON_FONT_SIZE * 1.5, fontFamily: 'RobotoBold', color: colors.white, textAlign: 'center', paddingHorizontal: 4 }}>
                {this.t._('CHỌN BÀN')}
              </Text>
              <View style={{ width: '8%', height: 3, backgroundColor: colors.white }}></View>
            </View>
            <TouchableOpacity onPress={() => this.setState({ showFilterPanel: !showFilterPanel })} >
              <Icon name="filter" iconStyle={{ color: colors.white, marginRight: 10 }} fontSize={TITLE_FONT_SIZE} type="font-awesome"></Icon>
            </TouchableOpacity>
          </View>
          <View style={[styles.header, {}]}>
            <FlatList
              horizontal={true}
              extraData={this.state.selectedAreaIndex}
              data={AreasList}
              renderItem={({ item, index }) => <TouchableOpacity
                key={index}
                style={{
                  width: SCREEN_WIDTH * 0.1655, height: SCREEN_HEIGHT * 0.14, borderRadius: 2, borderWidth: 0.5, borderColor: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor:
                    index == this.state.selectedAreaIndex ? '#ea6721' : '#2e7cc6',
                }}
                onPress={() => { this.loadTables(index) }}>
                <View>
                  <Text style={{ fontSize: ITEM_FONT_SIZE * 1.5, fontFamily: index == this.state.selectedAreaIndex ? 'RobotoBold' : 'RobotoRegular', color: 'white', }}>{item.AreName}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 0, right: 0, paddingRight: 2 }}>
                  <Text style={{ color: colors.white, width: '100%', fontSize: TITLE_FONT_SIZE / 1.8, }}>{item.TicketCount}</Text>
                </View>
              </TouchableOpacity>}
            />
          </View>
          <FlatList
            numColumns={6}
            data={TablesList}
            style={styles.footer}
            renderItem={({ item, index }) =>
              <TouchableOpacity
                onPress={() => this._onPressTable(item, index)}
                style={{ width: SCREEN_WIDTH * 0.1655, backgroundColor: colors.grey0, borderRadius: 2, borderWidth: 0.5, borderColor: 'white', }}>
                <View style={{
                  justifyContent: "center", alignItems: 'center', height: SCREEN_HEIGHT * 0.18, borderRadius: 2, borderColor: 'white',
                  backgroundColor: getTableColor(item.Status)
                }}>
                  <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, paddingTop: 3.6 }}>
                    <Text style={{ color: colors.white, width: '100%', textAlign: "center", fontSize: TITLE_FONT_SIZE / 1.8, }}>{item.TbNo}</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: 0, right: 0, paddingRight: 2 }}>
                    <Text style={{ color: colors.white, width: '100%', fontSize: TITLE_FONT_SIZE / 1.8, }}>{formatCurrency(item.TkPaymentAmount, '')}</Text>
                  </View>
                </View>
              </TouchableOpacity>}
          />
        </View>

        {itemTableShow ?
          <_TableInfo
            TicketInfor={TicketInfor}
            onClose={() => this.setState({ itemTableShow: false })}
            onPress={() => this._handleChangeButton()}
            onPressShow={() => this.setState({ showCustomer: true })}
            t={this.t} /> : null
        }

        {showCustomer ?
          <TouchableWithoutFeedback onPress={() => this.setState({ showCustomer: false, isWorking: false })}>
            <View style={{
              position: "absolute", right: 0, top: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT + Constants.statusBarHeight,
              alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <View style={{ backgroundColor: 'white', marginTop: 60, height: SCREEN_HEIGHT + Constants.statusBarHeight, width: SCREEN_WIDTH / 1.46, borderRadius: 10 }}>
                <View style={{
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: BUTTON_FONT_SIZE * 2.5,
                  borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#0176cd'
                }}>
                  <Text style={{ height: 25, fontSize: 18, color: colors.white, textAlign: 'center' }}>{this.t._("Danh sách khách hàng")}</Text>
                </View>
                <View style={{ backgroundColor: colors.white, justifyContent: 'center', borderColor: "#EEEEEE", borderWidth: 1, height: BUTTON_FONT_SIZE * 2.5 }}>
                  <TextInput
                    ref={input => this.Search = input}
                    style={[{
                      fontSize: 15, paddingHorizontal: 10, paddingVertical: 10, marginLeft: 0,
                      backgroundColor: 'white', textAlign: 'left', paddingLeft: 5,
                      borderColor: '#EEEEEE', borderWidth: 1, borderRadius: 4,
                    }]}
                    autoFocus={false}
                    autoCapitalize="none"
                    placeholder={this.t._("Tìm kiếm ...")}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    returnKeyType='next'
                    autoCorrect={false}
                    blurOnSubmit={false}
                    onChangeText={(KeySearch) => { this.setState({ KeySearch }) }}
                    onSubmitEditing={() => this.GetListCustomer()}
                    value={this.state.KeySearch}
                    placeholderTextColor="#7384B4"
                  />
                </View>
                <View style={{ height: SCREEN_HEIGHT - (BUTTON_FONT_SIZE * 5) - 60 }}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={CustomerList}
                    extraData={this.state}
                    renderItem={({ item, index }) => this.renderCustomer(item, index)}
                    contentContainerStyle={{ backgroundColor: colors.white }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          : null}

        {showFilterPanel ?
          <TouchableWithoutFeedback onPress={() => this.setState({ showFilterPanel: false, isWorking: false })}>
            <View style={{ position: "absolute", right: 0, top: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'rgba(0, 0, 0, 0.4)', }}>
              <View style={{ position: "absolute", right: 0, top: 60, width: SCREEN_WIDTH / 4, height: SCREEN_HEIGHT / 1.2 }}>
                <FlatList
                  data={[{ ID: 0, Text: this.t._("Tất cả") },
                  { ID: 6, Text: this.t._("Đặt chỗ") },
                  { ID: 1, Text: this.t._("Bàn trống") },
                  { ID: 4, Text: this.t._("Bàn tạm tính") },
                  { ID: 3, Text: this.t._("Bàn dùng hết") },
                  { ID: 2, Text: this.t._("Bàn có khách") },
                  { ID: 5, Text: this.t._("Bàn thanh toán") },
                  ]}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => <TouchableOpacity
                    key={index}
                    style={{
                      borderColor: colors.white,
                      borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:
                        getTableColor(item.ID), paddingVertical: 10
                    }}
                    onPress={() => { this.filter(item.ID) }}>
                    <View>
                      <Text style={{ color: colors.white, fontFamily: item.ID == this.state.tableStatus ? 'RobotoBold' : 'RobotoRegular' }}>{item.Text}</Text>
                    </View>
                  </TouchableOpacity>}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          : null}

        {this.state.isWorking ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: colors.grey5,
    width: SCREEN_WIDTH,
    justifyContent: 'space-around',
  },
  toolbar: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.primary,
    //Step 1
  },
  header: {
    borderBottomWidth: 2,
    borderColor: colors.grey5,
    paddingLeft: ITEM_FONT_SIZE * 0.2,
    paddingTop: ITEM_FONT_SIZE * 0.2,
  },
  footer: {
    width: SCREEN_WIDTH,
    paddingLeft: ITEM_FONT_SIZE * 0.2,
  },
  item_view_text: {
    height: SCREEN_HEIGHT + Constants.statusBarHeight,
    width: SCREEN_WIDTH,
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grey1,
    opacity: 0.5,
    bottom: 0,
    right: 0,
    borderTopColor: colors.grey4,
    borderTopWidth: 1
  }
});
