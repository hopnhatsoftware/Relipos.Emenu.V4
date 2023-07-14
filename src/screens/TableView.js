/*Màn hình bàn */
import React, { Component } from 'react';
import {TouchableOpacity,  Dimensions,  ActivityIndicator, UIManager, TextInput, TouchableWithoutFeedback,StyleSheet, Text, View, StatusBar, FlatList,Alert } from 'react-native';
import Constants from 'expo-constants';
import { _retrieveData, _storeData, _remove, _clearData } from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import { ListArea, ListTables, CheckAndGetOrder, Object_Search, Ticket_getById, Ticket_Flush } from '../services';
import translate from '../services/translate';
import { Icon } from 'react-native-elements';
import { getTableColor } from '../services/util';
import { setCustomText } from 'react-native-global-props';
import { _TableInfo } from '../components';
import colors from '../config/colors';
import { formatCurrency } from "../services/util";
import AreasStyle from "../styles/areas";
import Question from '../components/Question';
import { TITLE_FONT_SIZE, BUTTON_FONT_SIZE, ITEM_FONT_SIZE,H1FontSize, H2FontSize, H3FontSize, H4FontSize } from '../config/constants';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
export default class TableView extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.Search = null;
    //const data = Array.apply(null, {length: 20}).map(Number.call, Number);
    this.state = {
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
      isColor:false,
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
      /*App Config */
      Config:null,
      /*Hiện Form nhập thông tin phiếu */
      isShowTicketInfor:false
    };
    this.translate = new translate();
  }

  async componentDidMount() {
    try {
    this.translate = await this.translate.loadLang();
    await cacheFonts({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    });
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings!='{}') 
      settings = JSON.parse(settings);
    let user = await _retrieveData('APP@USER', JSON.stringify({}));
    if(user!='{}')
    user = JSON.parse(user);
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    let Config = await _retrieveData('APP@CONFIG', '{}');
    if (Config!='{}')
    Config=JSON.parse(Config);
    this.setState({ Config,settings, user,isColor });
    await this.GetListCustomer();
    await this.getlistArea(()=> this.loadTables(0));
    StatusBar.setHidden(true);
    this.defaultFonts();
    this.setState({ fontLoaded:true})
    } catch (error) {
      Alert.alert(this.t._('Notice'), error, [
        {
          text: "OK", onPress: () => {
            this.setState({ fontLoaded:true, isWorking: false})
          }
        }
      ]
      )
    }
  }
  GetListCustomer = async () => {
    try{
    const { ObjType, KeySearch, OgId, isGetOrg } = this.state;
    this.setState({ isWorking: true });
    Object_Search(ObjType, KeySearch, OgId, isGetOrg).then((res) => {
      let CustomerList = res.Data;
      this.setState({ CustomerList, isWorking: false });
    })}
    catch{(async (err) => {
      this.setState({ CustomerList: [],  isWorking: false });
    })};
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
    _remove('APP@USER', () => {
      that.props.navigation.navigate('LoginView') ;
    });
  }
/**
 * Load thông tin khu
 * @param {*} callback 
 */
  getlistArea = async (callback) => {
    try{
    let { settings,Config} = this.state;
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    this.setState({ isWorking: true,showFilterPanel: false});
    ListArea(Config).then((res) => {
      if (res.Data.length > 0) {
        this.setState({ AreasList: res.Data, selectedAreaIndex: 0 }, callback);
      }
      else {
        this.setState({ isWorking: false });
      }
    })}
    catch{(async (err) => {
      Question.alert( this.translate.Get('Notice'),err, [
        {
          text: "OK", onPress: () => {
            this.setState({ isWorking: false });
          }
        }
      ]);
     
    })};
  }
  loadTables = async (selectedAreaIndex) => {
    try{
    let { AreasList, tableStatus,settings,Config } = this.state;
    let AreaId = AreasList[selectedAreaIndex].AreID;
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    this.setState({  isWorking: true});
    ListTables(Config, AreaId, tableStatus).then((res) => {
      this.setState({ selectedAreaIndex, TablesList: res.Data.Table, isWorking: false });
    })}
    catch{(async (err) => {
      Alert.alert(this.t._('Notice'), error, [
        {
          text: "OK", onPress: () => {
            this.setState({ selectedAreaIndex, isWorking: false});
          }
        }
      ]
      )
    })};
  }
  filter = (status) => {
    this.setState({ tableStatus: status }, () => { this.loadTables(this.state.selectedAreaIndex) });
  }
  _onPressTable = async (item, index) => {
    const { user, AreasList, OrdPlatform, selectedAreaIndex,settings,sItemTable,CustomerList } = this.state;
    if (item == null || item.TicketID <= 0) {
      this.setState({
        sItemTable: item, sIndexTable: index, isShowTicketInfor: true, isWorking: false
      });
    }
    else {
      try{
      this.setState({ isLoading: true });
      CheckAndGetOrder(item, OrdPlatform).then((res) => {
        item.OrderId = res.Data;
        item.AreaID = AreasList[selectedAreaIndex].AreID;
        this.setState({ isLoading: false });
        _storeData('APP@TABLE', JSON.stringify(item),
          () => {
            _remove('APP@CART', () => {
            this.props.navigation.navigate("OrderView", { settings, user, table: item ,AreasList, selectedAreaIndex,sItemTable,CustomerList});
              })
          });
      })}
      catch{((error) => {
        Question.alert( 'System Error',error, [
          {
            text: "OK", onPress: () => {
              this.setState({ isLoading: false });
            }
          }
        ]);
       
      })};
    }
  }

  _handleChangeButton = async () => {
    try{
    let {user,settings,Config, sItemTable, B_UseOrderDefault,TicketInfor, OrdPlatform, group, AreasList, selectedAreaIndex } = this.state;
    Config.PosId = settings && settings.PosId ? settings.PosId : 1;
    Config.I_BusinessType = 1;
    sItemTable.AreaID = AreasList[selectedAreaIndex].AreID;
    this.setState({ isWorking: true, });
    TicketInfor.TkPcName = Constants.deviceName ? Constants.deviceName : 'simulator';
    TicketInfor.DeviceName = Constants.deviceName ? Constants.deviceName : 'simulator';
    Ticket_Flush(Config,0, B_UseOrderDefault, sItemTable, group, user, TicketInfor).then((res) => {
      if (res.Status == 1) {
        let CurrentData = res.Data;
        sItemTable.TicketID = CurrentData.TicketID;
        Ticket_getById(sItemTable.TicketID).then((res) => {
          if (res.Status == 1) {
            TicketInfor = res.Data;
            _storeData('APP@TICKETINFOR', JSON.stringify(TicketInfor), () => {
              CheckAndGetOrder(sItemTable, OrdPlatform).then((res) => {
                if (res.Status == 1) {
                  sItemTable.OrderId = res.Data;
                  sItemTable.AreaID = AreasList[selectedAreaIndex].AreID;
                  _storeData('APP@TABLE', JSON.stringify(sItemTable),
                    () => {
                      this.setState({ isWorking: false, sItemTable, TicketInfor }, () => {
                        _remove('APP@CART', () => {
                        this.props.navigation.navigate("OrderView", { settings, user, table: sItemTable });
                        })
                        return;
                      });
                    });
                }
                else {
                  this.setState({ isWorking: false, });
                }
              });
            });
          }
          else {
            this.setState({ isWorking: false, });
          }
        });
      }
      else {
        this.setState({ isWorking: false, })
      }
    })}
    catch{((error) => {
      Question.alert('System Error',error, [
        {
          text: "OK", onPress: () => {
            this.setState({ isWorking: false, });
          }
        }
      ]
      )
      this.setState({ isWorking: false, });
    })};
  }
  _setItemCustomer = async (item, index) => {
    let { TicketInfor } = this.state;
    TicketInfor.CustomerId = item.ObjId;
    TicketInfor.CustomerName = item.ObjName;
    this.setState({ sCustomerItem: item, sCustomerIndex: index, showCustomer: false,TicketInfor });
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
    const {  AreasList,  TablesList,  Config,  showFilterPanel,  isShowTicketInfor,  showCustomer,  CustomerList,  TicketInfor,  isColor} = this.state;
    
    if (!this.state.fontLoaded) {
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"
            onLayout={() => {
              this.setState({ fontLoaded: false });
            }}
          />
        </View>
      )
    }
    let pnHeaderheight=Bordy.height* 0.085;
    let pnAreaheight=Bordy.height* 0.1; 
    let I_TableColumn=5;//(Config&&Config.I_TableColumn&&Config.I_TableColumn>0)?Config.I_TableColumn:5;
    let I_TableWidth=Bordy.width/I_TableColumn;
    return (
      <View style={[styles.container,{backgroundColor: isColor == true ? '#444444' : colors.grey5,}]}>
        <StatusBar hidden={true} />
          <View style={[styles.toolbar,{height:pnHeaderheight,backgroundColor:"#333D4C"}]}>
            <TouchableOpacity onPress={() => this.onPressLogout()} >
              <Icon name="lock" iconStyle={{ color: colors.white, paddingLeft: H1FontSize * 1, }} fontSize={H1FontSize} type="antdesign"></Icon>
            </TouchableOpacity>
            <View style={{ color: colors.white, flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
              <Text style={{ fontSize: H2FontSize, color: colors.white, textAlign: 'center'}}>
                {this.translate.Get('SƠ ĐỒ BÀN')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({ showFilterPanel: !showFilterPanel })} >
              <Icon name="filter" iconStyle={{ color: colors.white, marginRight: 10 }} fontSize={H1FontSize} type="font-awesome"></Icon>
            </TouchableOpacity>
          </View>
          <View name='pnArea' style={{width:'100%',height:pnAreaheight, borderBottomWidth: 1,borderColor:isColor == true ? '#444444' : colors.grey5,}}>
            <FlatList horizontal={true}  extraData={this.state.selectedAreaIndex}  data={AreasList}
              renderItem={({ item, index }) => <TouchableOpacity key={index}
                style={{
                  width: Bordy.width/5-3, height:pnAreaheight, borderRadius: 2, borderWidth: 0.5,marginHorizontal:1.5, borderColor: isColor == true ? '#444444' : colors.grey5, justifyContent: 'center', alignItems: 'center', backgroundColor:
                    index == this.state.selectedAreaIndex ? '#ea6721' : '#2e7cc6',
                }}
                onPress={() => { this.loadTables(index) }}>
                <View>
                  <Text style={{ fontSize: H2FontSize, fontFamily: index == this.state.selectedAreaIndex ? 'RobotoBold' : 'RobotoRegular', color: 'white', }}>{item.AreName}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 1, right: 0, paddingRight: 2 }}>
                  <Text style={{ color: colors.white, width: '100%', fontSize: H3FontSize, }}>{item.TicketCount}</Text>
                </View>
              </TouchableOpacity>}
            />
          </View>
          <FlatList numColumns={5}   data={TablesList} 
            renderItem={({ item, index }) =>
              <TouchableOpacity onPress={() => this._onPressTable(item, index)}
                style={{ width: '19.7%', borderRadius: 5, borderWidth: 0.5, borderColor:isColor == true ? '#444444' : colors.grey5, marginHorizontal:1.5,marginVertical:1.5}}>
                <View style={{
                  justifyContent: "center", alignItems: 'center', height: Bordy.height * 0.18, borderRadius: 5, borderColor:isColor == true ? '#444444' : colors.grey5,
                  backgroundColor: getTableColor(item.Status)
                }}>
                  <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, paddingTop: 3.6 }}>
                    <Text style={{ color: colors.white, width: '100%', textAlign: "center", fontSize: H3FontSize, }}>{item.TbNo}</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: 0, right: 0, paddingRight: 2 }}>
                    <Text style={{ color: colors.white, width: '100%', fontSize: H4FontSize, }}>{formatCurrency(item.TkPaymentAmount == 0 ? '' : item.TkPaymentAmount, '')}</Text>
                  </View>
                </View>
              </TouchableOpacity>}
          />

        {isShowTicketInfor ?
          <_TableInfo
          backgroundColor="#333D4C"
          HeaderHeight={pnHeaderheight}
            TicketInfor={TicketInfor}
            onClose={() => this.setState({ isShowTicketInfor: false })}
            onPressAc={() => this._handleChangeButton()}
            onPressShow={() => this.setState({ showCustomer: true })}
            translate={this.translate}/> : null
        }

        {showCustomer ?
          <TouchableWithoutFeedback onPress={() => this.setState({ showCustomer: false, isWorking: false })}>
            <View style={{
              position: "absolute", right: 0, top: 0, width: '100%', height: '100%',
              alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <View style={{ backgroundColor: 'white', marginTop: 60, height: Bordy.height + Constants.statusBarHeight, width: Bordy.width / 1.46, borderRadius: 10 }}>
                <View style={{
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: BUTTON_FONT_SIZE * 2.5,
                  borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#0176cd'
                }}>
                  <Text style={{ height: 25, fontSize: 18, color: colors.white, textAlign: 'center' }}>{this.translate.Get("Danh sách khách hàng")}</Text>
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
                    placeholder={this.translate.Get("Tìm kiếm ...")}
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
                <View style={{ height: Bordy.height - (BUTTON_FONT_SIZE * 5) - 60 }}>
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
            <View style={{ position: "absolute", right: 0, top: 0, width: Bordy.width, height: Bordy.height, backgroundColor: 'rgba(0, 0, 0, 0.4)', }}>
              <View style={{ position: "absolute", right: 0, top: 60, width: Bordy.width / 4, height: Bordy.height / 1.2 }}>
                <FlatList
                  data={[{ ID: 0, Text: this.translate.Get("Tất cả") },
                  { ID: 6, Text: this.translate.Get("Đặt chỗ") },
                  { ID: 1, Text: this.translate.Get("Bàn trống") },
                  { ID: 4, Text: this.translate.Get("Bàn tạm tính") },
                  { ID: 3, Text: this.translate.Get("Bàn dùng hết") },
                  { ID: 2, Text: this.translate.Get("Bàn có khách") },
                  { ID: 5, Text: this.translate.Get("Bàn thanh toán") },
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
    backgroundColor: colors.grey5,
    flex:1,
    justifyContent: 'space-around',
  },
  toolbar: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.primary,
    //Step 1
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.grey5,
  },
  footer: {
    width: Bordy.width,
    paddingLeft: ITEM_FONT_SIZE * 0.2,
  },
  item_view_text: {
    height: Bordy.height + Constants.statusBarHeight,
    width: Bordy.width,
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
