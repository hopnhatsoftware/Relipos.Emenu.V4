/*Màn hình chọn món */
import React, { Component } from "react";
import {AppState,TouchableOpacity,Dimensions,Image,TouchableHighlight,ActivityIndicator, UIManager,StatusBar,ImageBackground,Keyboard,StyleSheet,Alert,Platform,Animated,Easing,Text,View,
  TextInput,ScrollView} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import { Input, Button, Icon ,CheckBox} from "react-native-elements";
import { setCustomText } from "react-native-global-props";
import { ProductDetails, CardDetailView, _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor } from '../components';
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE,H1FontSize,H2FontSize,H3FontSize,H4FontSize,H2_FONT_SIZE,H3_FONT_SIZE,FontSize,H4_FONT_SIZE, H1_FONT_SIZE } from "../config/constants";
import translate from "../services/translate";
import {getMasterData,GetViewGroup,GetPrdChildGroups,getProductByGroup,getTicketInforOnTable, sendOrder,CheckAndGetOrder,SetMenu_getChoiceCategory,getByChoiceId,CancelOrder,CallServices,getLanguage} from "../services";
import { formatCurrency } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from '../components/Question';
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
 const SCREEN_HEIGHT = Dimensions.get("window").height //- Constants.statusBarHeight;
 const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
const pnLeft={ width:Bordy.width*0.17,height:SCREEN_HEIGHT };  
const Center={width:Bordy.width-pnLeft.width, height:Bordy.height};
const Header={width:Center.width,height:Bordy.height* 0.085};

const Booton={width:Center.width,height:Center.height* 0.07};
const ProductList={width:Center.width,height:Center.height-Header.height-Booton.height,ColumnNum:3,RowNum:3}
export default class OrderView extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    this.state = {
      appState: AppState.currentState,
      isHavingOrder: 1,
      showCall:false,
      refreshing: false,
      isRenderProduct: true,
      selectedType: null,
      isPostBack: false,
      checked:'',
      test:'',
      itemChecked:{},
      AreasList: [],
      selectedAreaIndex: -1,
      CustomerList: [],
      dataCheck: [{PrdId:''}],
      DataSize: [],
      selectedId: -1,
      listLanguage:[],
      listLanguage2:{},
      language: 1,
      a:'',
      b:'',
      call: 1,
      data: [],
      TicketDetail: [],
      ProductGroupList: [],
      ChoiceCategory: [],
      SelectedGroupIndex: -1,
      PrdChildGroups: [],
      SelectedChildGroupIndex: -1,
      Products: [],
      Products2: [{
        PrdName:''
      }],
      TicketHitory:[],
      ProductsOrdered: [],
      isShowMash: false,
      Ticket: {},
      table: {},
      settings: {},
      isColor:false,
      buttontext: props.defaultValue,
      keysearch: "",
      ShowFullCart: true,
      isShowFormCard: false,
      FullCartWidth: new Animated.Value(0),
      CartWidth: new Animated.Value(Bordy.width * 0.82),
      /*Dòng mặt hàng đang chọn trong giỏ hàng */
      CartItemSelected: null,
      CartProductIndex: -1,
      /*Dòng giỏ hàng đang xử lý*/
      CartItemHandle:null,
       /*Mặt hàng đang chọn để xử lý */
       ProductChoise:null,
       /*Vị trí mặt hàng đang chọn để xử lý */
       ProductChoiseIndex: -1,
       ChoisetDetails: [],
      TimeToNextBooking: 0,
      CartInfor: {
        ItemAmount:0,
        TotalQuantity: 0,
        TotalAmount: 0,
        items: []
      },
      /*Danh Sách Set được tìm thấy */
      SetItemsFilter:[],
      lockTable: false,
      OrdPlatform: 1,
      endpoint: "",
      showSetInCart: false,
      ShowTotalInfo: false,
      ProductImagePrefix: "",
      Config:{},
      isShowFullImage:false,
      ImageUrl:'',
    };
    this.translate = new translate();
  }
  componentWillUnmount= async () => {
    this.appStateSubscription.remove();
    clearInterval(this.interval);
  }
  componentDidMount = async () => {
    try{
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!');
        }
        this.setState({appState: nextAppState});
        this._CancelOrder();
      },
    );
    this.translate = await this.translate.loadLang();
    await  this._BindingFont();
    StatusBar.setHidden(true);
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    let state = await _retrieveData("OrderView@STATE", "");
    if (state!='') 
      state = JSON.parse(state);
    else  state = this.state;
  let CartInfor = await _retrieveData("APP@CART",'');
    if (CartInfor!='')
        CartInfor = JSON.parse(CartInfor);
        else CartInfor=this.state.CartInfor;
        state.CartInfor = CartInfor;
        state.Product = this.state.Product;
        state.FullCartWidth = new Animated.Value(0);
        state.CartWidth = new Animated.Value(Bordy.width * 0.82);
      _storeData("OrderView@STATE", JSON.stringify(state), async () => {
        this.setState({state,CartInfor,SelectedGroupIndex:-1});
        return false;
      });
      await this._getMasterData();
      await this._getTicketInforOnTable();
      await this._getLanguage(true);
      await this.fetchData();
      await this.CaculatorCardInfor();
      this.setState({  isPostBack: true,isColor });
    //  this.interval = setInterval(() => {
    //    this.setState({ TimeToNextBooking: this.state.TimeToNextBooking - 1 });
    //  }, 1000);
  } catch (ex) {
    this.setState({ isPostBack: true,});
    console.log('OrderView componentDidMount Error:' + ex);  
  }
  };
  _getMasterData = async () => {
    let { table } = this.state;
    table = await _retrieveData('APP@BACKEND_Payment', JSON.stringify({}))
    table=JSON.parse(table);
    this.setState({table})
  }
  _CancelOrder = async() => {
    let{appState,table}= this.state;
    if(appState == 'background'){
      await CancelOrder(table.OrderId);
    }
  }
  onPressBack = async() => {
    let { lockTable,table } = this.state;
    if (lockTable == true) {
        this.props.navigation.navigate("LogoutView", { lockTable,OrderId: table.OrderId});
    }else{
    //console.log('table :'+JSON.stringify(table));
    /*Cancel Order */
    await CancelOrder(table.OrderId);
    _remove('APP@TABLE', () => {
      _remove('APP@CART', () => {
      this.props.navigation.navigate("TableView");
    });
  
  });
}
}
_getLanguage(IsActive){
  try{
  let {listLanguage,language,listLanguage2,} = this.state;
  getLanguage(IsActive).then(res => {
    listLanguage = res.Data
    this.setState({listLanguage: listLanguage})
   
    listLanguage2 = listLanguage.find((item) => {
      return item.LgId == language;
    })  
    })  
  }
  catch{((error) => {
    Question.alert( 'System Error',error, [
      {
        text: "OK", onPress: () => {
        }
      }
    ]);
  })};
}
onCallServices= async() => {
  let { settings,table } = this.state;
  let user = await _retrieveData('APP@USER', JSON.stringify({ObjId:-1}));
    user = JSON.parse(user);
  await CallServices(settings.I_BranchID,table.TabId,table.TicketID,1,user.ObjId);
}
  _loadProductsIsSet = async (item) => {
    let language = await _retrieveData('culture', 1);
    let { settings, Config, } = this.state;
    item.TkdBasePrice = ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice;
    await SetMenu_getChoiceCategory(Config, item).then(async (res) => {
      if (res.Data.Table.length > 0) {
        let ChoiceCategory = res.Data.Table;
        let itemSetGroups = res.Data.Table[0];
        await getByChoiceId(itemSetGroups.chsId, Config, item, '', language).then(res => {
          if ("Table" in res.Data && res.Data.Table.length > 0) {
            let ChoisetDetails = res.Data.Table;
            this.setState({ ChoiceCategory, ChoisetDetails, isShowMash: false});
          }
          else {
            this.setState({ ChoiceCategory, ChoisetDetails: [], isShowMash: false});
          }
        }).catch(async (error) => {
          this.setState({ ChoisetDetails: [], isShowMash: false });
        });
      }
      else {
        this.setState({ language, endpoint, Config, });
      }
    }).catch(error => {
      this.setState({
        language, endpoint, settings, 
      });
    });
    this.setState({  isShowMash: false });
    return;
  };

  _getProductByGroup = async group => {
    let { table, keysearch,Config,settings,language } = this.state;
    await getProductByGroup(Config,settings, table.TicketID,table.AreaID, group.PrgId, keysearch,language).then(res => {
      if ("Table" in res.Data) {
        let Products = res.Data.Table;
        let Products2 = res.Data.Table1;
        let ProductImagePrefix = res.Data1;
        this.setState({ Products,Products2, ProductImagePrefix, isShowMash: false });
      }
    });
  };
  /*Tìm kiếm mặt hàng */
  _searchProduct = () => {
    let {  SelectedGroupIndex, ProductGroupList, PrdChildGroups, SelectedChildGroupIndex } = this.state;
    if (SelectedChildGroupIndex > -1 && PrdChildGroups.length > 0) {
      this._getProductByGroup(PrdChildGroups[SelectedChildGroupIndex]);
    } else if (SelectedGroupIndex > -1 && ProductGroupList.length > 0) {
      this._getProductByGroup(ProductGroupList[SelectedGroupIndex]);
    }
  };
  /*Vẽ nhóm cấp 2 */
  _loadChildGroups = async SelectedGroupIndex => {
    let { table, ProductGroupList, SelectedChildGroupIndex,Config } = this.state;
    if (SelectedGroupIndex >= 0) {
      let group = ProductGroupList[SelectedGroupIndex];
      if (group) {
        GetPrdChildGroups(Config, table, group).then(res => {
          if ("Table" in res.Data && res.Data.Table.length > 0) {
            let PrdChildGroups = res.Data.Table;
            SelectedChildGroupIndex =
              SelectedChildGroupIndex < 0 ? 0 : SelectedChildGroupIndex;
            group = PrdChildGroups[SelectedChildGroupIndex];
            this.setState(
              { PrdChildGroups, SelectedChildGroupIndex, isShowMash: true },
              () => this._getProductByGroup(group)
            );
          } else {
            this.setState(
              { PrdChildGroups: [], SelectedChildGroupIndex: -1 },
              () => this._getProductByGroup(group)
            );
          }
        })
          .catch(error => {

            this._getProductByGroup(group);
          });
      }
    }
    this.setState({  isShowMash: false });
  };
  _setConfig = async () => {
    try{
    let endpoint = await _retrieveData( "APP@BACKEND_ENDPOINT",  JSON.stringify(ENDPOINT_URL));
    endpoint=JSON.parse(endpoint);
    let language = await _retrieveData("culture", 1);
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings!='{}') 
    settings = JSON.parse(settings);
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({
          'PosId':settings.PosId,
          'I_BusinessType':1
          }));
    Config = JSON.parse(Config);
    this.setState({endpoint,language,settings,Config});
  }
  catch(ex){
    console.log('_setConfig Error :'+ex)
  }
    return true;
  };
  _BindingFont = async () => {
    try{
    await Font.loadAsync({
      RobotoBlack: require("../../assets/fonts/Roboto-Black.ttf"),
      RobotoBlackItalic: require("../../assets/fonts/Roboto-BlackItalic.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoBoldCondensed: require("../../assets/fonts/Roboto-BoldCondensed.ttf"),
      RobotoBoldItalic: require("../../assets/fonts/Roboto-BoldItalic.ttf"),
      RobotoItalic: require("../../assets/fonts/Roboto-Italic.ttf"),
      RobotoThinItalic: require("../../assets/fonts/Roboto-ThinItalic.ttf"),
      RobotoThin: require("../../assets/fonts/Roboto-Thin.ttf"),
      RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
      RobotoBoldCondensedItalic: require("../../assets/fonts/Roboto-BoldCondensedItalic.ttf"),
      RobotoCondensed: require("../../assets/fonts/Roboto-Condensed.ttf"),
      RobotoCondensedItalic: require("../../assets/fonts/Roboto-CondensedItalic.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoMediumItalic: require("../../assets/fonts/Roboto-MediumItalic.ttf"),
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
    });
    await this.defaultFonts();
  }catch(ex){
    console.log('_BindingFont Error :'+ex)
  }
    return true;
  };
  _BindingMeta= async () => {
    try{
    let {  SelectedGroupIndex, ProductGroupList,OrdPlatform,table,Config,} = this.state;
         if (!("TicketId" in table)) {
          table = await _retrieveData("APP@TABLE", JSON.stringify({}));
          table = JSON.parse(table);
        }
        if ("TicketID" in table && table.TicketID > 0) {
          this.setState( { isShowMash:true});
          CheckAndGetOrder(table, OrdPlatform).then(res => {
       if(res.Status == 1){
        table.OrderId = res.Data;
        _storeData("APP@TABLE", JSON.stringify(table), () => {
          GetViewGroup(Config, table).then(res => {
            if (res.Data.Table.length > 0) {
              ProductGroupList = res.Data.Table;
              SelectedGroupIndex = SelectedGroupIndex < 0 ? 0 : SelectedGroupIndex;
              this.setState( { table,isShowMash:false,   ProductGroupList,  SelectedGroupIndex },
                () => {  this._loadChildGroups(SelectedGroupIndex);  }
              );
            }
          }).catch(error => {
            Question.alert('System Error', error,
              [{
                  text: "OK",
                  onPress: () => {  this.setState( { isShowMash:false});  }
                }
              ]
            );
          });
        });
       }else{
        this.props.navigation.navigate('TableView')
       }
          }).catch(error => {
            Question.alert('System Error', error,
            [{
                text: "OK",
                onPress: () => {  this.setState( { isShowMash:false});  }
              }
            ]
          );
          });
        }
      }catch(ex){
        console.log('_BindingMeta Error :'+ex)
      }
        return true;
  } ; 
  fetchData = async () => {
   
    await this._setConfig();
    await this._BindingMeta();
   
  };
  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: "RobotoRegular"
      }
    };
    setCustomText(customTextProps);
  }
  _getTicketInforOnTable = async () =>{
    try{
      this.setState({ isShowMash: true });
    let{TicketHitory,ProductsOrdered,table,Ticket}=this.state;
    if ("TicketID" in table && table.TicketID > 0) {
    getTicketInforOnTable(table).then(res => {
      this.setState({ isShowMash: false });
      if ("Table" in res.Data) {
        if (res.Data.Table.length > 0) {
          Ticket = res.Data.Table[0];
        } else {
          Ticket = { TkTotalAmount: 0,TkItemAmout:0, TkNo: 0, TkServiceChargeAmout: 0 };
        }
      }
      table.Ticket = Ticket;
      if("Table1" in res.Data) {
        ProductsOrdered = res.Data.Table1;
      }
      
      if("Table2" in res.Data) {
        TicketHitory = res.Data.Table2;
      }
      _storeData("APP@TABLE", JSON.stringify(table), () => {
        this.setState({ Ticket, table, ProductsOrdered,TicketHitory,refreshing:false});
      });
    }).catch(error => {
      this.setState({ isShowMash: false });
    });
  }
  this.setState({isShowMash: false});}
    catch(error){
      Alert.alert(translate.Get("Thông báo"),translate.Get("Lỗi hệ thống, _getTicketInforOnTable"), [
        {
          text: "OK", onPress: () => { }
        }
      ]);
      return null;
    }
  }
  static getDerivedStateFromProps = (props, state) => {
    if (
      props.navigation.getParam("settings", state.settings) != state.settings ||
      props.navigation.getParam("lockTable", state.lockTable) != state.lockTable ||
      props.navigation.getParam("table", state.table) != state.table
    ) {
      return {
        settings: props.navigation.getParam("settings", state.settings),
        lockTable: props.navigation.getParam("lockTable", state.lockTable),
        table: props.navigation.getParam("table", state.table),
        CustomerList: props.navigation.getParam("CustomerList", state.CustomerList),
        AreasList: props.navigation.getParam("AreasList", state.AreasList),
        selectedAreaIndex: props.navigation.getParam("selectedAreaIndex", state.selectedAreaIndex),
      };
    }
    if (
      props.navigation.getParam( "SelectedGroupIndex", state.SelectedGroupIndex  ) != state.SelectedGroupIndex ||
      props.navigation.getParam( "SelectedChildGroupIndex",  state.SelectedChildGroupIndex ) != state.SelectedChildGroupIndex ||
      props.navigation.getParam(  "CartProductIndex",  state.CartProductIndex ) != state.CartProductIndex
    ) {
      return {
        SelectedGroupIndex: props.navigation.getParam( "SelectedGroupIndex",  state.SelectedGroupIndex ),
        SelectedChildGroupIndex: props.navigation.getParam( "SelectedChildGroupIndex", state.SelectedChildGroupIndex  ),
        CartProductIndex: props.navigation.getParam( "CartProductIndex", state.CartProductIndex )
      };
    }
    // Return null if the state hasn't changed
    return null;
  };
  HandleDescription = async (item,Description) => {
    try{
    let { CartInfor} = this.state;
    let {CartFilter}= this._getCartItems(item,item.Json);
    CartInfor.items[CartFilter.FirstIndex].OrddDescription=Description;
    this.setState({ CartInfor }, () => {
      _storeData("APP@CART", JSON.stringify(CartInfor))
    });
  }catch (error) {
    console.log('HandleDescription Error:'+error);
    return null;
  }
  }
  HandleQuantity = async (item,OrddQuantity,isReplace) => {
    try {
      let { CartInfor} = this.state;
      let iQuantity=parseFloat(OrddQuantity);
      if (!('Json' in item) || item.Json == '')
      item.Json = '';
      let {CartFilter}= this._getCartItems(item,item.Json);
      let DataCurrent = CartFilter.FirstItem;
      let RowIndex=CartFilter.FirstIndex
      if(DataCurrent!=null)
      {
        if(isReplace)
        DataCurrent.OrddQuantity=0;
        iQuantity=iQuantity+DataCurrent.OrddQuantity;
      }
      let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
      Config = JSON.parse(Config);
      let QuantityCheck=CartInfor.TotalQuantity,TypeNumCheck=CartInfor.items.length,total = OrddQuantity + CartInfor.TotalQuantity ;
        if(iQuantity>0 ){
          if (Config.I_LimitTypeBooking > 0) 
              if (TypeNumCheck>= Config.I_LimitTypeBooking  && OrddQuantity > 0) {
                if (Config.I_LimitQuntityBooking > 0) {
                  if (QuantityCheck>= Config.I_LimitQuntityBooking && total > Config.I_LimitQuntityBooking) {
                    let a = Config.I_LimitQuntityBooking
                    Alert.alert(
                      this.translate.Get("Limited OrddQuantity!"),
                      this.translate.Get("The total quantity of ordered items must not exceed ") + Config.I_LimitQuntityBooking + 
                      this.translate.Get("The total quantity of ordered items should not exceed ") + Config.I_LimitTypeBooking +
                      this.translate.Get(".Please double-check to avoid incorrect or excessive food orders.")
                    );
                    return;
                  }
                }
                 if(TypeNumCheck>= Config.I_LimitTypeBooking && DataCurrent == null){
                  Alert.alert(
                        this.translate.Get("Limited Products!"),
                        this.translate.Get("The total quantity of ordered items must not exceed ") + Config.I_LimitQuntityBooking + 
                      this.translate.Get("The total quantity of ordered items should not exceed ") + Config.I_LimitTypeBooking +this.translate.Get(".Please double-check to avoid incorrect or excessive food orders.")
                      );
                      return;
                }
              }
          if (Config.I_LimitQuntityBooking > 0 && OrddQuantity > 0) {
            if (QuantityCheck>= Config.I_LimitQuntityBooking && total > Config.I_LimitQuntityBooking) {
              Alert.alert(
                this.translate.Get("Limited OrddQuantity!"),
                this.translate.Get("The total quantity of ordered items must not exceed ") + Config.I_LimitQuntityBooking + 
                      this.translate.Get("The total quantity of ordered items should not exceed ") + Config.I_LimitTypeBooking +
                this.translate.Get(".Please double-check to avoid incorrect or excessive food orders.")
              );
              return;
            }
            if ( total > Config.I_LimitQuntityBooking) {
              Alert.alert(
                this.translate.Get("Limited OrddQuantity!"),
                this.translate.Get("The total quantity of ordered items must not exceed ") + Config.I_LimitQuntityBooking + 
                      this.translate.Get("The total quantity of ordered items should not exceed ") + Config.I_LimitTypeBooking +
                this.translate.Get(".Please double-check to avoid incorrect or excessive food orders.")
                
              );
              return;
            }
          }
          if(DataCurrent!=null)
          DataCurrent.OrddQuantity = iQuantity;
        if(DataCurrent==null)
        {
          item.OrddQuantity = iQuantity;
          item.UpAmount=0;
          CartInfor.items.push(item);
        }
      }
      else 
      {
        CartInfor.items.splice(RowIndex, 1);
        item.OrddQuantity = iQuantity;
       // console.log('Remove CartInfor '+JSON.stringify(CartInfor));
      }
       this.setState({ CartInfor }, () => {
         _storeData("APP@CART", JSON.stringify(CartInfor))
         if (item.PrdIsSetMenu && this.state.showSetInCart&&(this.state.SetItemsFilter&&this.state.SetItemsFilter!=null&&this.state.SetItemsFilter.length>0)) {
          let {CartFilter}= this._getCartItems(item,null);
          this.setState({ SetItemsFilter:CartFilter.items, CartItemSelected: CartFilter.FirstItem, CartProductIndex :CartFilter.FirstIndex})
        }
       });
     
     this.CaculatorCardInfor(true);
     // console.log(CartInfor)
    } catch (error) {
      console.log('HandleQuantity Error:'+error);
      return null;
    }
  };
 
  changeLanguage = async (lang , item) => {
    if (this.state.language != lang) {
      await _storeData("culture", lang.toString(), async () => {
        this.translate = await this.translate.loadLang();
        this.setState({ language: lang,}, () => this.fetchData());
      });
    }
    this.setState({ language: lang });
  };
  _GroupClick = index => {
    this.setState({  SelectedGroupIndex: index,  SelectedChildGroupIndex: -1, isShowMash: true },
      () => { this._loadChildGroups(index);  }
    );
  };
  _selectChildGroup = (item, index) => {
    this.setState({ SelectedChildGroupIndex: index, isShowMash: true }, () => {
      this._getProductByGroup(item);
    });
  };
  
  _sendOrder = async () => {
    try{
    let { table, CartInfor, OrdPlatform,Config } = this.state;
    if (CartInfor.TotalQuantity<=0)
      return;
    this.setState({ isShowMash: true }); 
    await sendOrder(Config, table, OrdPlatform, CartInfor.items).then(async res => {
      if (res.Status == 1) {
        await _remove("APP@CART", async () => {
          await this.setState({ CartInfor: {  TotalQuantity: 0, TotalAmount: 0, ItemAmount:0, items: [], } }, async () => {
            await CheckAndGetOrder(table, OrdPlatform).then(async res => {
              table.OrderId = res.Data;
              await _storeData("APP@TABLE", JSON.stringify(table), async () => {
                _storeData('APP@TimeToNextBooking', JSON.stringify(new Date().getTime()), async () => {
                  await this.setState({
                    table: table, isShowMash: false,
                    TimeToNextBooking: Config.I_Limit_Booking_Time ? Config.I_Limit_Booking_Time : 5
                  }, async () => {
                    await this.CartToggleHandle(false);
                    this._getTicketInforOnTable();
                  });
                });
              }
              );
            });
          }
          );
        });
      } else {
        await CheckAndGetOrder(table, OrdPlatform).then(async res => {
          table.OrderId = res.Data;
          await _storeData("APP@TABLE", JSON.stringify(table), async () => {
            await this.setState({ table: table, isShowMash: false }, async () => {
              this._getTicketInforOnTable();
            });
          }
          );
        });
      }
    }).catch(error => {
      Question.alert( 'System Error',error,
        [
          {
            text: "OK",
            onPress: () => {
             
            }
          }
        ],
        { cancelable: false }
      );
      this.setState({ isShowMash: false }, async () => {
        await this.CartToggleHandle(false);
        this._getTicketInforOnTable();
      });
    });
  }
  catch{((error) => {
    Question.alert( 'System Error',error, [
      {
        text: "OK", onPress: () => {
        }
      }
    ]);
  })};
  };

  _CaculatorMaster = (Master) => {
    try{
    if (Master == null)
      return  {Master};
    let UpAmount = 0;
    if (Master.UnitPrice==undefined||Master.UnitPrice==null) 
    Master.UnitPrice=0;
    if (Master.UnitPriceBefore==undefined||Master.UnitPriceBefore==null) 
    Master.UnitPriceBefore=0;
    if (Master.UnitPriceAfter==undefined||Master.UnitPriceAfter==null) 
    Master.UnitPriceAfter=0;
    if (Master.OrddQuantity==undefined||Master.OrddQuantity==null) 
    Master.OrddQuantity=0;
    if (Master.PrdVatPercent==undefined||Master.PrdVatPercent==null) 
    Master.PrdVatPercent=0;
    if (Master.TkdVatAmount==undefined||Master.TkdVatAmount==null) 
    Master.TkdVatAmount=0;
    if (Master.TkdItemAmount==undefined||Master.TkdItemAmount==null) 
    Master.TkdItemAmount=0;
    if (Master.TkdTotalAmount==undefined||Master.TkdTotalAmount==null) 
    Master.TkdTotalAmount=0;
    if (Master.subItems&&Master.subItems!=undefined&&Master.subItems!=null) 
    Master.subItems.forEach((item, index) => {
      if (item.TksdQuantity > 0 && item.TksdPrice > 0)
        UpAmount += parseFloat(item.TksdQuantity) * parseFloat(item.TksdPrice);
    });
    Master.UpAmount = UpAmount;
    if(Master.UnitPrice == 0 || Master.UnitPrice == undefined)
    {
    Master.UnitPrice = Master.UnitPriceBefore;
    }
    Master.TotalChoiseAmount = parseFloat(Master.UnitPrice + Master.UpAmount);
    Master.TkdItemAmount = parseFloat(Master.TotalChoiseAmount * Master.OrddQuantity);
    Master.TkdVatAmount = parseFloat(Master.TkdItemAmount * Master.PrdVatPercent * 0.01);
    Master.TkdTotalAmount = parseFloat(Master.TkdItemAmount + Master.TkdVatAmount);
    //console.log('_CaculatorMaster:  TkdVatAmount'+ Master);
   // console.log("CaculatorCardInfor TkdTotalAmount "+Master.TkdTotalAmount );
    return  {Master};
  }catch (ex) {
    console.log('_CaculatorMaster Error :' + ex);
    return  {Master};
  }
  }
  CaculatorCardInfor = async (isRender)=>
  { 
    let { CartInfor } = this.state;
    let TotalAmount=0,TotalQuantity=0,ItemAmount=0,Master=null;
   //console.log("CaculatorCardInfor CartInfor "+JSON.stringify({CartInfor}));
   // console.log("-----------------------");
   if (CartInfor.items&&CartInfor.items.length>0) 
    CartInfor.items.forEach((item, index) => {
     let{Master}=  this._CaculatorMaster(item);
        TotalAmount+=Master.TkdTotalAmount;
        ItemAmount+=Master.TkdItemAmount;
        //console.log("CaculatorCardInfor TkdTotalAmount itembf"+result.Master.TkdTotalAmount );
        TotalQuantity+=Master.OrddQuantity
        CartInfor.items[index]=Master;
  
    
    });
    //console.log("CaculatorCardInfor:"+TotalAmount);
     if (!isRender||(CartInfor.TotalQuantity!=TotalQuantity||CartInfor.TotalAmount != parseFloat(TotalAmount)))
     isRender=true;
    CartInfor.TotalQuantity=TotalQuantity;
    CartInfor.TotalAmount = parseFloat(TotalAmount);
    CartInfor.ItemAmount = parseFloat(ItemAmount);
    this.setState({ CartInfor }, () => _storeData("APP@CART", JSON.stringify(CartInfor)));
    this.setState({ isRenderProduct:isRender});
  };
  /**
   * Lấy Danh Items trong trong giỏ hàng
   * @param {*} item 
   * * @param {*} Json: chuỗi Json của detail 
   * @returns CartFilter 
   * CartFilter.FirstItem: dòng dữ liệu đầu tiên
   * CartFilter.FirstIndex
   */
  _getCartItems = (item,Json) => {
    let { CartInfor } = this.state;
   let CartFilter  =JSON.parse(JSON.stringify({ TotalQuantity:0, FirstIndex:-1,FirstItem:null,items:[] }));
   if (item==undefined||item==null)
   return {CartFilter};
    let TotalQuantity=0;
    
    CartInfor.items.forEach((product, index) => {
      if (!('Json' in product) )
             product.Json ='';
      if (product.PrdId == item.PrdId&&(product.UnitId == item.UnitId&&(Json==null|| product.Json==Json)))
      {
        if (CartFilter.FirstItem==null) {
          CartFilter.FirstItem = product;
          CartFilter.FirstIndex=index;
        }
        TotalQuantity=TotalQuantity+product.OrddQuantity; 
        CartFilter.TotalQuantity=TotalQuantity;
        CartFilter.items.push(product);
     if (item.PrdIsSetMenu!=true) 
        return {CartFilter};
      }
    });
    
    return {CartFilter};
  };
  _showIsSetQty = item => {
    let { CartInfor } = this.state;
    let isSetQuantity1 = 0;
    CartInfor.itemIsSet.forEach(product => {
      if (product.PrdId == item.PrdId) {
        isSetQuantity1 = product.isSetQuantity;
        return isSetQuantity1;
      }
    });
    return isSetQuantity1;
  };
  toggleWidth(isShow) {
    const endWidth = !this.state.ShowFullCart
      ? SCREEN_WIDTH * 0.4
      : SCREEN_HEIGHT * 0.11 - 20;
    if (isShow) {
      this.setState({ ShowFullCart: isShow });
    }
    Animated.timing(this.state.CartWidth, {
      toValue: endWidth,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => this.setState({ ShowFullCart: isShow }));
  }
  onPressNext = async () => {
    let {table, lockTable, a,} = this.state;
    a = table;
    if (lockTable == true) {
      _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
        this.props.navigation.navigate('Payment', { lockTable });
    });
    }else{
      _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
        this.props.navigation.navigate('Payment');
      });
    }
  }
  CartToggleHandle = async (isShow) =>{
    const endWidth = !this.state.isShowFormCard ? SCREEN_WIDTH * 0.75 : 0;
    if (isShow) {
      await this._getTicketInforOnTable();
      this.setState({ isShowFormCard: isShow});
    }
    Animated.timing(this.state.FullCartWidth, {
      toValue: endWidth,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(() => this.setState({ isShowFormCard: isShow ,isHavingOrder : 1}));
  }
  _buy = item => {
    this.setState({ CartItemSelected: null, CartProductIndex: -1 }, () =>
      this.CartToggleHandle(true)
    );
  };
  _addExtraRequestToItem = (item, RowIndex) => {
    if (item == null) 
      return;
    let state = this.state;
    //console.log('_addExtraRequestToItem:'+JSON.stringify(item));
    _storeData("OrderView@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "OrderView", 
      Product: item,RowIndex:RowIndex, UpdateDescription: async (item,RowIndex) => this._updateItemDescription(item) });
    });
  };
  _addExtraRequestToSetItemDetail = (item, ind, cartDetailIndex) => {
    if (item == null) {
      return;
    }
    let state = this.state;
    state.Product = item;
    state.selectedItemIndex = ind;
    state.cartDetailIndex = cartDetailIndex;
    _storeData("OrderView@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "OrderView", Product: item, UpdateDescription: async (item) => this._updateSubItemDetailDescription(item) });
    });
  }
  _updateSubItemDetailDescription = async (Product) => {
    let state = await _retrieveData('OrderView@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.CartItemSelected.subItems[state.cartDetailIndex].subItems[state.selectedItemIndex] = Product;
      state.CartInfor.items[state.CartProductIndex] = state.CartItemSelected;
      _storeData("APP@CART", JSON.stringify(state.CartInfor));
    }
  }
  _updateItemDetailDescription = async (Product) => {
    let state = await _retrieveData('OrderView@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.CartItemSelected.Details[state.selectedItemIndex] = Product;
      state.CartInfor.items[state.CartProductIndex] = state.CartItemSelected;
      _storeData("APP@CART", JSON.stringify(state.CartInfor));
    }
  }
  _updateItemDescription = async (Product) => {
    let state = await _retrieveData('OrderView@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.CartInfor.items[state.CartProductIndex] = Product;
      _storeData("APP@CART", JSON.stringify(state.CartInfor));
    }
  }
  _addExtraRequestToSet = (item, ind) => {
    let state = this.state;
    state.selectedItemIndex = ind;
    _storeData("OrderView@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "OrderView", Product: item, UpdateDescription: async (item) => this._updateItemDetailDescription(item) });
    });
  }
/*Mở màn hình Set */
  _SetMenuViewOpen = async (item, index) => {
    await _storeData("OrderView@STATE", JSON.stringify(this.state), () => {});
    await _storeData("APP@CART", JSON.stringify(this.state.CartInfor), () => {});
    this.props.navigation.navigate("SetMenuView", {Product: item, index });

    // await _storeData("OrderView@STATE", JSON.stringify(this.state), () => {
    //   _storeData("OrderView@STATE", JSON.stringify(this.state), () => {
    //     this.props.navigation.navigate("SetMenuView", {Product: item, index });
    //   });
    // });
  };
  _ProductDetailsAccept = async (CartItemHandle, CartProductIndex,isCloseForm) => {
    let { CartInfor} = this.state;
    //console.log('_ProductDetailsAccept CartItemHandle:'+JSON.stringify(CartItemHandle));
    //console.log('_ProductDetailsAccept CartProductIndex:'+JSON.stringify(CartProductIndex));
   if (CartItemHandle.OrddQuantity<=0)
   {
   if (CartProductIndex>=0) 
    CartInfor.items.splice(CartProductIndex, 1);
    this.setState({ CartInfor});
    if (isCloseForm) 
      this.setState({ showSetInCart:true, CartItemHandle:null});
   return;
   }
   if (!('Json' in CartItemHandle) )
   CartItemHandle.Json = '';
   if (CartItemHandle.subItems.length>0)
    CartItemHandle.Json = JSON.stringify(CartItemHandle.subItems);

   if (CartProductIndex==null||CartProductIndex<0) 
      {
        CartInfor.items.push(CartItemHandle);
        CartProductIndex=CartInfor.items.length-1;
      }
   else
   CartInfor.items[CartProductIndex]=CartItemHandle;
   /*
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    if (Config.I_LimitQuntityBooking > 0) {
      if (CartInfor.OrddQuantity >= Config.I_LimitQuntityBooking) {
        Question.alert(
          this.translate.Get("Limited OrddQuantity!"),
          this.translate.Get("Your quantity is limited, Please check in!")
        );
        return;
      }
    }
   
    let existedSet = false;
    CurrentSet.forEach((product, index) => {
      if (product.PrdId != SelectediPrd.PrdId) {
        CurrentSet.splice(index, 1);
        this.setState({ CurrentSet });
      }
    });
    if (!existedSet) {
      CurrentSet.push({
        SmnIsChange: true,
        PrdId: SelectediPrd.PrdId,
        PrdNo: SelectediPrd.PrdNo,
        PrdName: SelectediPrd.PrdName,
        TksdUnitId: SelectediPrd.UnitId,
        chsId: ('chsId' in SelectediPrd) ? SelectediPrd.chsId : null,
        TksdPrice: ('TksdPrice' in SelectediPrd) ? SelectediPrd.TksdPrice : 0,
        OdsdDescription: ('OdsdDescription' in SelectediPrd) ? SelectediPrd.OdsdDescription : '',
        TksdQuantity: SelectediPrd.chsQuantity ? SelectediPrd.chsQuantity : 1,
      });*/
      await _storeData("APP@CART", JSON.stringify(CartInfor));
        this.setState({ CartInfor:CartInfor, CartProductIndex:CartProductIndex,isShowMash: false });
        this.CaculatorCardInfor();
        if (isCloseForm) 
        this.setState({ showSetInCart:true, CartItemHandle:null,isPostBack:true,CartProductIndex:-1});
        else  this.setState({ isPostBack:true});
  };
  _getRollBackInfor = async (SelectedGroupIndex,ProductChoiseIndex, type,NumberRun) => {
    let isLoadProduct=false;
    let { ProductGroupList, Products} = this.state;
    if (type == 1) 
    {
      ProductChoiseIndex++;
      /*nếu Index > danh sách hiện tại Thì Tăng nhóp lên 1 cấp và set ProductChoiseIndex=0 , tăng Index nhóm lên 1*/
      if (ProductChoiseIndex>Products.length) 
      { 
        ProductChoiseIndex=0;
        SelectedGroupIndex++;
        isLoadProduct=true;
      }
      /*Nếu Index nhóm lớn hơn thì set về 0 */
      if (SelectedGroupIndex>ProductGroupList.length) 
         {
           SelectedGroupIndex=0;
           isLoadProduct=true;
         } 
    }
   else {
     ProductChoiseIndex--;
     if (ProductChoiseIndex<0) 
     {
          SelectedGroupIndex--;
          isLoadProduct=true;
           ProductChoiseIndex=-1;
     }
     if (SelectedGroupIndex<0) 
     {
      SelectedGroupIndex=ProductGroupList.length-1;
      isLoadProduct=true;
      ProductChoiseIndex=-1;
      
     }
    }
    if(isLoadProduct){
    await this._getProductByGroup(ProductGroupList[SelectedGroupIndex]);
    Products = this.state.Products;
    if ((this.state.Products.length<=0)&&NumberRun<=10) {
      NumberRun++;
       return await this._getRollBackInfor(SelectedGroupIndex,ProductChoiseIndex, type,NumberRun);
     }
    }
   if (ProductChoiseIndex<0&&Products.length>0)
         ProductChoiseIndex=Products.length-1;
       let  ProductChoise=Products[ProductChoiseIndex];
       if ((ProductChoise==null||Products.length<=0)&&NumberRun<=10) {
        NumberRun++;
         return await this._getRollBackInfor(ProductChoiseIndex, type,NumberRun);
       }
       return {ProductChoise,SelectedGroupIndex,ProductChoiseIndex};
  };
  /**
   * 
   * @param {*} ite 
   * @param {*} ind 
   * @param {*} type 
   * @returns 
   */
  _onRollBack = async (CartItemHandle, CartProductIndex,iProduct, index, type) => {
    if (CartProductIndex>0) 
    await this._ProductDetailsAccept(CartItemHandle,CartProductIndex,true);
    let iSelectedGroupIndex=this.state.SelectedGroupIndex;
        let {ProductChoise,SelectedGroupIndex,ProductChoiseIndex}=await this._getRollBackInfor(iSelectedGroupIndex,index,type,1);
if (ProductChoise==null) {
    this.setState({showSetInCart:true});
    return;
    
  }
         let {CartFilter}= this._getCartItems(ProductChoise,null);
         let CartItemSelected=null;
         ProductChoise.OrddQuantity=CartFilter.TotalQuantity;
         CartProductIndex=-1;
         if (CartFilter.FirstItem != null) {
          CartItemSelected=CartFilter.FirstItem;
          CartProductIndex=CartFilter.FirstIndex;
         }
         CartItemHandle=CartItemSelected;
         if (CartItemHandle==null) {
          let UnitPrice = parseFloat(('TkdBasePrice' in ProductChoise) ? ProductChoise.TkdBasePrice : ProductChoise.UnitPrice);
          CartItemHandle={
            PrdId: ProductChoise.PrdId,
            PrdNo: ProductChoise.PrdNo,
            PrdName: ProductChoise.PrdName,
            UnitId: ProductChoise.UnitId,
            PrdIsSetMenu: ProductChoise.PrdIsSetMenu,
            ObjRelate: null,
            ObjRelateName: null,
            OrddIsPromotion: null,
            OrddDescription: null,
            RtkdParentId: null,
            ObjManager: null,
            ObjManagerName: null,
            IcsId: null,
            OrddType: 0,
            OrddPosition: 0,
            OrddQuantity: 0,
            UnitPrice: UnitPrice,
            TkdBasePrice: UnitPrice,
            UpAmount: 0,
            TotalChoiseAmount: UnitPrice,
            TkdItemAmount: UnitPrice,
            PrdVatPercent: parseFloat(ProductChoise.PrdVatPercent),
            TkdVatAmount: 0,
            TkdTotalAmount: UnitPrice,
            Description: '',
            PrdSize: ProductChoise.PrdSize,   
            subItems: [],
            Json:''
            }
          }
          this.setState({ CartItemHandle ,CartItemSelected,CartProductIndex,ProductChoise,ChoisetDetails:[],ProductChoiseIndex,SelectedGroupIndex}, () => {
            if (ProductChoise.PrdViewSetMenuType && ProductChoise.PrdViewSetMenuType == 2) 
            this._loadProductsIsSet(ProductChoise);
          });
          //console.log('_ProductDetailsAccept CartProductIndex:'+JSON.stringify(CartProductIndex));
          this.setState({showSetInCart:false});
  };
  RenderSetmenusEditViewSub = (item, index, cartDetailIndex) => {
    return (
      <View style={{ paddingVertical: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderRadius: 1, borderColor: colors.grey4 }}>
        <View style={{ flexDirection: "row", left: H3FontSize * 1.5 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#000000", paddingLeft: 5, paddingRight: 5, fontSize: H3FontSize * 0.8 }}>
              {item.TksdQuantity}
            </Text>
            <Text style={{ color: "#000000", paddingLeft: 5, fontSize: H3FontSize * 0.8 }}>
              {item.PrdName}
            </Text>
            <View style={{ flexDirection: 'row', paddingLeft: 5, }}>
              {item.itemDescription != null ? <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: H3FontSize * 0.8 }}>#</Text> : null}
              <FlatList
                horizontal={true}
                data={item.itemDescription}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: H3FontSize * 0.8 }}>{item.MrqDescription}</Text>}
              />
            </View>
          </View>
          <View style={{position: "absolute",right: H3FontSize * 3, flexDirection: "row" }}>
            <Text style={{ color: "#000000", paddingRight: 5, fontSize: H3FontSize * 0.8 }}>
              {item.TksdPrice > 0 ? (<Text>+{formatCurrency(item.TksdPrice, "")}</Text>) : null}{" "}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  /**
   * Show Full Hình ảnh
   * @param {*} Item 
   * @param {*} isShow 
   */
  _ShowFullImage = async (Item,isShow) => {
    try {
      let { ImageUrl } = this.state;
      ImageUrl='';
      if(isShow&&Item!=null)
        ImageUrl=Item.PrdImageUrl?Item.PrdImageUrl:'';
        this.setState({isShowFullImage:isShow,ImageUrl});
       
    } catch (ex) {
      console.log('_ShowFullImage Error :' + ex)
    }
  };
/*Danh sách setmenu để chọn edit */
  RenderListSetmenuViewDetail = (CartItem, ind) => {
    let RowWidth=(Bordy.width*0.85)-10;
      //return(<Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: H3FontSize * 0.8 }}>{CartItem.PrdName} </Text>);
    return (
        <View style={{ borderColor: colors.grey5, borderWidth: 1, borderRadius: 4, width: RowWidth }}>
          <View style={{ flexDirection: "row", justifyContent:'flex-start', alignItems: "center", backgroundColor: colors.grey5, height: H2FontSize * 2 }}>
            <View style={{ flexDirection: "row",textAlign:'left',width:RowWidth }}>
              <Text style={{ color: 'red', textAlign:'left',width:RowWidth*0.8,marginLeft:H2FontSize,fontSize:H2FontSize}}>
                {CartItem.PrdName}: 
              </Text> 
              <Text style={{width:RowWidth*0.2, textAlign:'left',fontWeight:'bold', fontSize: H2FontSize}}>
                {"TotalChoiseAmount" in CartItem && CartItem.TotalChoiseAmount != null ? formatCurrency(CartItem.TotalChoiseAmount, "") : ""}
              </Text>
            </View>
          </View>
           <FlatList keyExtractor={(item, index) => index.toString()}  data={CartItem.subItems}  extraData={this.state}  renderItem={({ item, index }) =>
              this.RenderSetmenusEditViewSub(item, index, ind)
            }
          /> 
          <View style={{ flexDirection: "row", backgroundColor: 'rgba(98,98,98,0.6)', height: H2FontSize*2, justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row",
              position: "absolute",
              backgroundColor: colors.grey5, left: 10, }}>
              <View style={{ flexDirection: 'row', paddingLeft: 5, }}>
                {CartItem.itemDescription != null ? 
                <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: H2FontSize }}>#</Text> : null}
                <FlatList horizontal={true}   data={CartItem.itemDescription}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: H2FontSize }}>{item.MrqDescription}</Text>}
                />
              </View>
            </View> 
            <View style={{ flexDirection: "row",  position: "absolute",   right: 5  }} >
            <TouchableOpacity
                style={{ width: H2FontSize*1.5}}
                onPress={() =>  this.HandleQuantity(CartItem,0,true) } >
                <Icon name="close"  type="antdesign"  containerStyle={{ justifyContent: "center" }}
                  size={H2FontSize*1.5}  iconStyle={{ color: colors.red, fontFamily: "RobotoBold" }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => this.HandleQuantity(CartItem,-1,false)}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_View3.png')}
                  style={{ width: H2FontSize*1.5, height: H2FontSize*1.5, }} />
              </TouchableOpacity> 
              <Text style={{ color: "#af3037", width:H2FontSize*3, fontSize: H2FontSize, textAlign: "center",justifyContent: "center", fontFamily: "RobotoBold" }}>
                {CartItem.OrddQuantity}
              </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() =>this.HandleQuantity(CartItem,+1,false)}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_View4.png')}
                  style={{ width:H2FontSize*1.5, height: H2FontSize*1.5, }} />
              </TouchableOpacity>
           
            </View>
          </View>
        </View>
    
    );
  };
  PrerenderProductModal= (item,CartFilter,index) => {
    
    let ishowSetInCart=false,iCartItemSelected=null,iCartProductIndex=-1;
    if (item.PrdIsSetMenu == true) {
      /*1:Cách chọn set Bình thường */
      if (item.PrdViewSetMenuType && item.PrdViewSetMenuType ==1) {
      this._SetMenuViewOpen(item, index);
      return;
      }
      /*2:Set Check Để chọn */
      if (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) 
        this._loadProductsIsSet(item);
        if (CartFilter.FirstItem != null) {
        iCartItemSelected=CartFilter.FirstItem;
        iCartProductIndex=CartFilter.FirstIndex;
        }
       /*Set Check Để chọn */
    if (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) 
    ishowSetInCart=false;
    else ishowSetInCart=true;
    }
    /*Mở chi tiết mặt hàng để chọn */
    if (ishowSetInCart==false) {
      let CartItemHandle=null;
      CartItemHandle=iCartItemSelected;
      if (CartItemHandle==null&&item!=null) {
        let UnitPrice = parseFloat(('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice);
        CartItemHandle={PrdId: item.PrdId,
          PrdNo: item.PrdNo,
          PrdName: item.PrdName,
          UnitId: item.UnitId,
          PrdIsSetMenu: item.PrdIsSetMenu,
          ObjRelate: null,
          ObjRelateName: null,
          OrddIsPromotion: null,
          OrddDescription: null,
          RtkdParentId: null,
          ObjManager: null,
          ObjManagerName: null,
          IcsId: null,
          OrddType: 0,
          OrddPosition: 0,
          OrddQuantity: CartItemHandle?CartItemHandle.OrddQuantity:0,
          UnitPrice: UnitPrice,
          TkdBasePrice: UnitPrice,
          UpAmount: 0,
          TotalChoiseAmount: UnitPrice,
          TkdItemAmount: UnitPrice,
          PrdVatPercent: parseFloat(item.PrdVatPercent),
          TkdVatAmount: 0,
          TkdTotalAmount: UnitPrice,
          Description: '',
          PrdSize: item.PrdSize,   
          subItems: [],
          Json:''
          }}
    this.setState({CartItemHandle ,CartItemSelected:iCartItemSelected,CartProductIndex:iCartItemSelected,ProductChoise: item,ProductChoiseIndex:index, showSetInCart:ishowSetInCart});  
  }}
  renderProductModal = () => {

    if (this.state.showSetInCart==true)
    return null;
      let { ProductChoise,CartProductIndex,CartItemHandle,ChoisetDetails,ProductChoiseIndex } = this.state;
      if (ProductChoise == null||CartItemHandle==null) 
        return null;
      return (
        <ProductDetails
          endpoint={this.state.ProductImagePrefix == '' ? 
          this.state.endpoint + '/Resources/Images/Product/' : this.state.ProductImagePrefix}
          CartProductIndex={CartProductIndex}
          translate={this.translate}
          CartItemHandle={CartItemHandle}
          iProduct={ProductChoise}
          /*Vị trí mặt hàng đang chọn để xử lý */
          ProductChoiseIndex={ProductChoiseIndex}
          //_ProductDetailsCheckDetail={(item, index) => this._ProductDetailsCheckDetail(item, index)}
          ProductDetailsAccept={(CartItemHandle, CartProductIndex,isCloseForm) => this._ProductDetailsAccept(CartItemHandle, CartProductIndex,isCloseForm)}
          ChoisetDetails={ChoisetDetails != null ? ChoisetDetails : []}
          onRollBack={(CartItemHandle, CartProductIndex,iProduct, ProductChoiseIndex, type) => this._onRollBack(CartItemHandle, CartProductIndex,iProduct, ProductChoiseIndex, type)}
          _SetMenuViewOpen={this._SetMenuViewOpen}
          setState={(state) => this.setState(state)}
          BookingsStyle={BookingsStyle}
        />
      );
  };
  GetSize = (ProductItem) => {
    try{
    let {Products2}= this.state;
    let prdPrices=[];
    const Products3 = Products2.filter((item) => item.PrdName == ProductItem.PrdName);
    Products3.forEach((item, index) => {
      item.PrdName=ProductItem.PrdName;
      item.PrdNameUi=ProductItem.PrdNameUi;
      prdPrices.push(item);
    });
    return Products3;
    }catch{
    }
  }
  renderSize = ({ item, index }) => {
    let{isColor} = this.state;
    let {CartFilter}= this._getCartItems(item,null);
    item.OrddQuantity=CartFilter.TotalQuantity;
    return (
      <View style={{ flexDirection: "row",height:H2FontSize,marginTop:5, width: "100%"}}  >
                  <View style={{width: "50%",height:'100%',justifyContent: 'center'}}>
                  <Text style={{fontStyle:'italic',color:isColor == true ?'#FFFFFF' : "#af3037",fontFamily:'RobotoBold',marginLeft:5,textAlign:'left',fontSize: H4FontSize*0.9,textAlign:'left'}}>
             {formatCurrency(item.UnitPrice, "")}/{item.UnitName} 
                </Text>
                  </View>
                  {item.OrddQuantity> 0 ?
                    <TouchableOpacity
                    style={{width:'15%',height:'100%', alignItems:'center',justifyContent: 'center' }}
                    onPress={() => { 
                if (item.PrdIsSetMenu == true&&item.PrdViewSetMenuType && item.PrdViewSetMenuType == 1){
                      this.setState({ showSetInCart: true,SetItemsFilter:CartFilter.items, CartItemSelected: CartFilter.FirstItem, CartProductIndex :CartFilter.FirstIndex})
                      }
                      else {
                      this.HandleQuantity(item,-1,false);
                        this.CaculatorCardInfor(true);
                      }
                    }} >
                      <Image resizeMode='contain' source={require('../../assets/icons/IconDelete.png')} style={{ width: H2FontSize, height: H2FontSize,}} />
                    </TouchableOpacity> :
                    <View style={{  width:'15%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    </View>
                  }
                  <View style={{ width:'20%', justifyContent: 'center' }}>
                 {(item.OrddQuantity>0)?
                      <TextInput ref={input => this.textInput = input}
                        style={{  color:isColor == true ?'#FFFFFF' :  "#af3037",width: '100%',fontSize:H2FontSize*0.8,textAlign:"center",fontFamily: "RobotoBold", }}
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardAppearance="dark"
                        keyboardType='numeric'
                        autoCompleteType='off'
                        returnKeyType='done'
                        blurOnSubmit={true}
                        defaultValue={item.OrddQuantity ? item.OrddQuantity.toString() : ''}
                        Value={item.OrddQuantity>0 ? item.OrddQuantity.toString() : '' }
                        onBlur={()=>{
                          this.CaculatorCardInfor(true);
                        }}
                        onChangeText={(textInput) => {
                         item.OrddQuantity = parseFloat(textInput);
                        }}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          if(parseFloat(item.OrddQuantity)<0 )
                          item.OrddQuantity=0;
                         this.HandleQuantity(item,item.OrddQuantity,true);
                        
                        }}
                      />
                      :null
                     }
                  </View>
                  {item.isSoldout ?
                  <View style={{width:'15%',height:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
                  </View>
                  :
                  <TouchableOpacity style={{width:'15%',height:'100%',alignItems:'center',justifyContent: 'center' }} onPress={() => {
                     if (item.PrdIsSetMenu == true ) 
                     this.PrerenderProductModal(item,CartFilter,index);
                     else{
                    this.HandleQuantity(item,1,false);
                    this.CaculatorCardInfor(true);
                     }
                  }}>
                    <Image resizeMode='contain' source={require('../../assets/icons/IconAdd.png')}
                      style={{width: H2FontSize, height: H2FontSize, }} />
                  </TouchableOpacity>}
                </View>
    )
  }
  renderProduct = ({ item, index }) => {
    let { Config,isColor } = this.state;
    let iWith=(ProductList.width/ProductList.ColumnNum-4);
    let iHeight=iWith*3/2.4;
    let {CartFilter}= this._getCartItems(item,null);
    item.OrddQuantity=CartFilter.TotalQuantity;
    // if(item.OrddQuantity>0 && item.UnitId != CartFilter.FirstItem.UnitId){
    // item.UnitPrice = CartFilter.FirstItem.UnitPriceBefore;
    // item.UnitName = CartFilter.FirstItem.UnitName ;
    // item.UnitId = CartFilter.FirstItem.UnitId ;
    // }
    const dataSize = this.GetSize(item)
    this.state.isRenderProduct=true;
    return (
      <TouchableHighlight   style={ { borderBottomWidth:6,borderColor: isColor == true ?'#333333': '#DDDDDD',width:iWith,height: iHeight,marginRight:6}}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", height: '100%'}}>
          <View style={{ width: "100%", height:'60%' ,}}>
            {item.PrdDescription ?
            <View style={{position:'absolute',width: "100%", height: '15%',bottom:0,zIndex:98,backgroundColor:'black',opacity: 0.5,justifyContent:'center' }}>
              <Text style={{fontSize:H3_FONT_SIZE,color:'white',paddingLeft:5}}>{item.PrdDescription}</Text>
            </View>
            :null}
            {item.isSoldout ?
            <View style={{position:'absolute',width: "100%", height: '100%',zIndex:99,backgroundColor:'black',opacity: 0.5,justifyContent:'center' }}>
              <View style={{transform: [{rotate: '-30deg'}],alignItems:'center'}}>
                <Text style={{fontSize: H1_FONT_SIZE*1.5, color:'#FF0000',fontFamily: "RobotoBold",}}>{this.translate.Get("Hết hàng")}</Text>
              </View>
            </View>
            : null}
            <TouchableOpacity name='dvImage' style={{ flexDirection: "row", width: '100%', height: '100%' }}
              onPress={() =>
              { 
                this._ShowFullImage(item,true);
            }}> 
              <ImageBackground  resizeMode='contain'
                source={ item.PrdImageUrl ? {uri: this.state.endpoint + "/Resources/Images/Product/" + item.PrdImageUrl
                  }:  require("../../assets/images/NoImage_trans-04.png")
                }
                style={[{ width: '100%', height: '100%', backgroundColor:isColor == true ? '#454545' : "#FFFFFF" }]} >
                {item.ResName && item.SttName == 'HOT' ? 
                  <View style={{ position: "absolute", paddingTop:10,right:10, width: '20%'}}>
                    <Image resizeMode="contain" source={require('../../assets/icons/IconHot-09.png')}
                      style={{ width: H1_FONT_SIZE*1.6, height: H1_FONT_SIZE*1.6,}} />
                  </View>
                : item.ResName && item.SttName == 'NEW' ?
                  <View style={{  position: "absolute", paddingTop: 10, right: 10,width: '20%' }}>
                    <Image resizeMode="contain" source={require('../../assets/icons/IconNew-09.png')}
                      style={{width: H1_FONT_SIZE*1.6, height: H1_FONT_SIZE*1.6, }}/>
                  </View>
                  : item.SttName == 'SALE' ?
                  <View style={{  position: "absolute", paddingTop: 0, right: 5}}>
                    <View style={{position: "absolute",zIndex:1000,width: H1_FONT_SIZE*4.2, height: H1_FONT_SIZE*1.3,justifyContent:'center',alignItems:'center',paddingHorizontal:5}}>
                    <Text style={{fontSize:H4_FONT_SIZE,color:'#FFFFFF'}}>{item.ResName}</Text>
                    </View>
                    <Image resizeMode="contain" source={require('../../assets/icons/IconSale.png')}
                      style={{width: H1_FONT_SIZE*4.2, height: H1_FONT_SIZE*1.6, }}/>
                  </View>
                  : null} 
                {/* <View style={{ position: "absolute", paddingTop: (iHeight-36)/2, right: -15 }}>
                  <Icon  name="caretleft" type="antdesign" iconStyle={{ justifyContent: "space-between", color: "#EEEEEE", fontSize: 36 }} />
                </View> */}
              </ImageBackground>
            </TouchableOpacity>
          </View> 
          <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%", height:'40%',paddingLeft:5,backgroundColor: isColor == true ? '#454545' : "#FFFFFF" }}>
          <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:'100%'}}>
             {Config.B_ViewProductNo?
               <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:'50%'}}>
              <View name='pnProductNo' style={{width: '100%',height:H3FontSize*1.5 ,paddingTop:5,height:'50%' }}>
                <Text style={{ color: isColor == true ? '#FFFFFF' : "#0d65cd", textAlign: 'center', width: '95%',fontSize: H3FontSize, fontFamily: "RobotoBold"}} numberOfLines={2}> 
                  {item.PrdNo}
                </Text>
              </View>
              <View name='pnProductName' style={{width: '100%',paddingTop:2,height:'50%' }}>
                <Text style={{color: isColor == true ? '#FFFFFF' : "#000000",marginLeft:2,marginRight:2,textAlign:'left',fontSize:H4FontSize,}} numberOfLines={5}>
                  {item.PrdNameUi}
                </Text>
              </View>
              </View>
              :
              <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",justifyContent:'space-between',paddingVertical: 5,height:'50%'}}>
            <View name='pnProductName' style={{width: '100%',marginTop:5}}>
              <Text style={{color: isColor == true ? '#FFFFFF' : "#000000",marginLeft:2,marginRight:2,textAlign:'left',fontSize:H3FontSize,fontWeight:'bold',flexWrap:"wrap"}} numberOfLines={5}>
                {item.PrdNameUi}
              </Text>
              
            </View>
            </View>
             }
              <View style={{width: "100%", height: '50%',paddingTop:5}}>
                {item.RECORD > 1 ?
                <ScrollView>
                <FlatList
                data={dataSize}
                renderItem={this.renderSize}
                />
                </ScrollView>
                :
                <View style={{ flexDirection: "row", width: "100%",}}  >
                  <View style={{width: "50%",height:'100%',justifyContent: 'center'}}>
                  <Text style={{fontStyle:'italic',color:isColor == true ?'#FFFFFF' : "#af3037",fontFamily:'RobotoBold',marginLeft:5,textAlign:'left',fontSize: H4FontSize*0.9,textAlign:'left'}}>
             {formatCurrency(Config.B_ViewUnitPriceBefor ? item.UnitPrice: item.UnitPriceAfter, "")}/{item.UnitName} 
                </Text>
                  </View>
                  {item.OrddQuantity> 0 ?
                    <TouchableOpacity
                    style={{width:'15%',height:'100%', alignItems:'center',justifyContent: 'center' }}
                    onPress={() => { 
                if (item.PrdIsSetMenu == true&&item.PrdViewSetMenuType && item.PrdViewSetMenuType == 1){
                      this.setState({ showSetInCart: true,SetItemsFilter:CartFilter.items, CartItemSelected: CartFilter.FirstItem, CartProductIndex :CartFilter.FirstIndex})
                      }
                      else {
                      this.HandleQuantity(item,-1,false);
                        this.CaculatorCardInfor(true);
                      }
                    }} >
                      {( item.PrdIsSetMenu == true&&item.PrdViewSetMenuType && item.PrdViewSetMenuType == 1)?
                      <Icon name='edit'  type="antdesign" containerStyle={{ justifyContent: "center" }}
                      size={H2FontSize}  iconStyle={{ color: colors.yellow1, fontFamily: "RobotoRegular" }}  />
                      :
                      <Image resizeMode='contain' source={require('../../assets/icons/IconDelete.png')} style={{ width: H2FontSize, height: H2FontSize,}} />
                      }
                    </TouchableOpacity> :
                    <View style={{  width:'15%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    </View>
                  }
                  <View style={{ width:'20%', justifyContent: 'center' }}>
                 {(item.OrddQuantity>0)?
                      <TextInput ref={input => this.textInput = input}
                        style={{  color:isColor == true ?'#FFFFFF' :  "#af3037",width: '100%',fontSize:H2FontSize*0.8,textAlign:"center",fontFamily: "RobotoBold", }}
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardAppearance="dark"
                        keyboardType='numeric'
                        autoCompleteType='off'
                        returnKeyType='done'
                        blurOnSubmit={true}
                        defaultValue={item.OrddQuantity ? item.OrddQuantity.toString() : ''}
                        Value={item.OrddQuantity>0 ? item.OrddQuantity.toString() : '' }
                        onBlur={()=>{
                          this.CaculatorCardInfor(true);
                        }}
                        onChangeText={(textInput) => {
                         item.OrddQuantity = parseFloat(textInput);
                        }}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          if(parseFloat(item.OrddQuantity)<0 )
                          item.OrddQuantity=0;
                         this.HandleQuantity(item,item.OrddQuantity,true);
                        
                        }}
                      />
                      :null
                     }
                  </View>
                  {item.isSoldout ?
                  <View style={{width:'15%',height:'100%',alignItems:'flex-start',justifyContent: 'flex-start' }}>
                  </View>
                  : 
                  <TouchableOpacity style={{width:'15%',height:'100%',alignItems:'center',justifyContent: 'center' }} onPress={() => {
                     if (item.PrdIsSetMenu == true ) 
                     this.PrerenderProductModal(item,CartFilter,index);
                     else{
                    this.HandleQuantity(item,1,false);
                    this.CaculatorCardInfor(true);
                     }
                  }}>
                    <Image resizeMode='contain' source={require('../../assets/icons/IconAdd.png')}
                      style={{width: H2FontSize, height: H2FontSize, }} />
                  </TouchableOpacity>}
                </View>
                }
              </View>
          
            </View>
           
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  
  render() {
    if (!this.state.isPostBack) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"
            onLayout={() => {
              this.setState({ isPostBack: false });
            }}
          />
        </View>
      );
    }
    const {ProductGroupList,endpoint,PrdChildGroups,Products,CartInfor,CartItemSelected,CartProductIndex,SelectedChildGroupIndex,SelectedGroupIndex, Config,ProductsOrdered,isColor,TicketHitory} = this.state; 
    return (
      <View style={{height:Bordy.height,width:Bordy.width, backgroundColor: isColor == true ? '#333333' : "#DDDDDD"}}>
        <View style={{flexDirection: "row"}}>
          <View name='pbLeft' style={[{ backgroundColor: "#333D4C",width:pnLeft.width, flexDirection: "column",height: Bordy.height }]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: Bordy.height/6, }}>
              <Image resizeMode='contain' 
               source={{uri:endpoint+'/Resources/Images/View/Logo.jpg'}}
                style={{ width: '99%', height: '99%' }} />
            </View> 
            <_ProductGroup state={this.state}  
              translate={this.translate}
              ProductGroupList={ProductGroupList}
              SelectedGroupIndex={SelectedGroupIndex}
              _GroupClick={(index) => this._GroupClick(index)}
              setState={(state) => this.setState(state)}
              pnheight={Bordy.height-Bordy.height/6}
              BookingsStyle={BookingsStyle}
              PrdChildGroups={PrdChildGroups}
              SelectedChildGroupIndex={SelectedChildGroupIndex}
              _selectChildGroup={(item,index) => this._selectChildGroup(item,index)}
            />
            {/* <View style={{height:Booton.height,width:'100%',bottom:0,zIndex:2, backgroundColor:'#333D4C'}}>
              <Image resizeMode='contain' style={{ width: '99%', height: '99%' }} source={require('../../assets/images/RelisoftLogo_trans-07.png')} />
            </View> */}
          </View>
          <View style={{width:Center.width,height:Center.height, flexDirection: "column"}}>
            <_HeaderNew
              state={this.state}
              Ticket={this.state.Ticket}
              CustomerList={this.state.CustomerList}
              backgroundColor="#333D4C"
              table={this.state.table}
              AreasList={this.state.AreasList}
              selectedAreaIndex={this.state.selectedAreaIndex}
              ticketId={this.state.table.TicketID}
              onPressBack={() => { this.onPressBack(); }}
              _searchProduct={(val) => this._searchProduct(val)}
              changeLanguage={(lang,item) => this.changeLanguage(lang,item)}
              data={this.state.listLanguage}
              onCallServices={() => { this.onCallServices(); }}
              listLanguage={this.state.listLanguage}
              listLanguage2={this.state.listLanguage2}
              translate={this.translate}
              name={'OrderView'}
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
               style={{height:Header.height}}  />
            <View styles={{ height:ProductList.height,width:ProductList.width,flexDirection: "column"}} >
              <FlatList   data={Products}  numColumns={ProductList.ColumnNum}
                extraData={this.state.isRenderProduct==false}
                renderItem={this.renderProduct}  style={{width:'100%'}}
                contentContainerStyle={{paddingBottom: ProductList.height/ProductList.RowNum}}
              />
            </View>
          </View>
        </View>
        {!this.state.isShowFormCard ? 
         //Bottonbar 
          <Animated.View style={[styles.BottonMenu, { width:Center.width+2,height:Booton.height }]}>
            {this.state.ShowFullCart ? 
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ flexDirection: "row",justifyContent: "center",alignItems: "center", width: (Center.width * 0.4)}}>                    
                <View style={{ width: '100%',height:'100%', justifyContent: 'center', alignItems: 'center',backgroundColor:isColor == true ? '#333333' : "#FFFFFF" }}>
                    <Text style={{fontSize:H3FontSize, fontFamily:'RobotoBold',color:isColor == true ?'#FFFFFF' :"#000000",textShadowColor:'#FFFFFF',textShadowOffset: {width:1, height:0.5 },textShadowRadius: 1 }}>{Config.B_ViewUnitPriceBefor ? this.translate.Get("Giá chưa bao gồm VAT") : this.translate.Get("Giá đã bao gồm VAT")}</Text>
                    
                   </View>
                </View> 
                <View style={[BookingsStyle.bottombar, styles.item_menu_order, { width: (Center.width*0.2), flexDirection: "row" }]}>
                  <View style={{ position: 'absolute', left: 10, paddingTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                    {<Image resizeMode="stretch" source={require('../../assets/icons/iconCash.png')}
                      style={{ width: H3FontSize * 1.3, height: H3FontSize * 1.3, }} /> }
                  </View>
                  <Text style={[{ fontSize: H3FontSize, fontFamily: "RobotoBold", color: '#FFFFFF', paddingLeft: 10 }]}>
                    {formatCurrency(Config.B_ViewUnitPriceBefor ? CartInfor.ItemAmount : CartInfor.TotalAmount, "")}
                  </Text>
                </View>
                <TouchableOpacity onPress={() =>{this.CartToggleHandle(true)}}>
                  <View style={[BookingsStyle.bottombar, { width: (Center.width*0.2), flexDirection: "row", color: "white", alignItems: "center", justifyContent: "center", 
                  backgroundColor: "#0D66CE"
                  }]}> 
                    <View style={{ justifyContent: 'center', alignItems: 'center' ,flexDirection: "column"}}>
                      <View style={{backgroundColor:'#CC0000', borderRadius:35,width:H4_FONT_SIZE*0.9,height:H4_FONT_SIZE*0.9,justifyContent:'center',alignItems:'center',marginBottom:-3, marginLeft:2}}>
                        <Text style={{color: "white", fontSize: H4_FONT_SIZE*0.6, textAlign:'center' }}>{CartInfor.TotalQuantity}</Text>
                      </View>
                      <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_GioHang.png')}
                        style={{ width: H3FontSize * 1.3, height: H3FontSize * 1.3, marginBottom:7 }} />
                    </View>
                    <Text style={[{ color: "white", fontSize: H3FontSize, paddingLeft: 10 }]}>
                      {this.translate.Get("Giỏ hàng")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>(ProductsOrdered.length > 0 &&  CartInfor.TotalAmount == 0 )? this.onPressNext(): null}>
                  <View style={[BookingsStyle.bottombar, { width: (Center.width*0.2), flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor:(ProductsOrdered.length > 0  && CartInfor.TotalAmount == 0 )? "#009900":"#dddddd"
                  }]}>
                    <Text style={[{ color: "white",fontSize: H3FontSize,}]}>
                      {this.translate.Get("Thanh toán")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
             : 
              <TouchableOpacity
                onPress={() => this.toggleWidth(true)}
                style={[BookingsStyle.bottombar, { backgroundColor: "#29ade3", width: SCREEN_HEIGHT * 0.08 }]}>
                <Icon name="cart-outline"  type="material-community"
                  containerStyle={[BookingsStyle.bottombar, { paddingLeft: SCREEN_HEIGHT * 0.005, justifyContent: "center" }]}
                  iconStyle={{ fontSize: ITEM_FONT_SIZE * 2, color: "white" }}
                />
              </TouchableOpacity>
            }
          </Animated.View>
        : (
          <CardDetailView
            state={this.state}
            _getTicketInforOnTable={this._getTicketInforOnTable}
            CartToggleHandle={(val) => this.CartToggleHandle(val)}
            translate={this.translate}
            refreshing={this.state.refreshing}
            ticketId={this.state.table.TicketID}
            BranchID={this.state.settings.I_BranchID}
            HandleQuantity={(item,OrddQuantity,isReplace,Json) => { this.HandleQuantity(item,OrddQuantity,isReplace) }}
            setState={(state) => this.setState(state)}
            settings={Config}
            table={this.state.table}
            lockTable={this.state.lockTable}
            BookingsStyle={BookingsStyle}
            TicketHitory={TicketHitory}
            ProductsOrdered={ProductsOrdered}
            onPressNext={this.onPressNext}
            HandleDescription={(item,Description) => { this.HandleDescription(item,Description) }}
            onSendOrder={() => this._sendOrder()}
            onCallServices={() => { this.onCallServices(); }}
            _addExtraRequestToItem={(item, RowIndex) => { this._addExtraRequestToItem(item, RowIndex); }}
          />
        )}
        {/* /*hiển thị chi tiết */}
        {this.renderProductModal()
        }
        { 
        /* Hiển thị Edit Set */
        (CartItemSelected != undefined &&  CartItemSelected != null && CartProductIndex >= 0 && CartItemSelected.PrdIsSetMenu && this.state.showSetInCart)? ( 
            <View name='pnListSetmenuView' style={{ width: Bordy.width,height: Bordy.height, backgroundColor: "rgba(98,98,98,0.6)", 
             position: "absolute",
            justifyContent: "center", alignItems: "center",   }}  > 
              <View style={[{ 
                 position: "absolute",
                width:(Bordy.width*0.85),height:(Bordy.height-Header.height),top: Header.height,  borderColor:'gray',backgroundColor:'gray',  borderWidth: 2, borderRadius: 6}]} >
                <View  name='pnShowSetHeader' style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",  borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,  backgroundColor: "#333D4C",  height: Bordy.height*0.07
                  }} > 
                  <Text style={{  fontSize: H1FontSize, color: colors.white, textAlign: "center" }}> 
                    {this.translate.Get("Chi tiết Set - Combo")}
                  </Text>
                  <View style={{ 
                     position: "absolute", 
                  right: 5, borderRadius: 2 }}>
                    <TouchableOpacity style={{ width: '100%'}}
                      onPress={() =>
                        this.setState({  showSetInCart: false,  CartItemSelected: null, CartProductIndex: -1 })
                      }>
                      <Icon  name="close"  type="antdesign" containerStyle={{ borderRadius: 1, width: SCREEN_WIDTH*0.025, height: SCREEN_WIDTH*0.025 }}
                        iconStyle={{ color:'red', fontWeight:'bold', fontSize: H1FontSize}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{  
                   height: ((Bordy.height-Header.height)-(Bordy.height*0.14)),  backgroundColor: colors.white,   justifyContent: "center", alignItems: "center"
                  }} >
                <FlatList 
                data={this.state.SetItemsFilter}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                this.RenderListSetmenuViewDetail(item, index) 
                }></FlatList>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",height: Bordy.height*0.07}} >
                 
                  <TouchableOpacity  onPress={() => this.setState({ showSetInCart: false, CartItemSelected: null, CartProductIndex: -1, })}>
                  <View style={[{ width: (Center.width/5),height:'99%', flexDirection: "row", color: "white", alignItems: "center", justifyContent: "center", backgroundColor: "#008bc5",
                   borderColor:'#008bc5',  borderWidth: 2, borderRadius: 10 
                  }]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon  name="check" type="antdesign"
                    iconStyle={{ justifyContent: "space-between", color: "#FFFFFF", fontSize: ITEM_FONT_SIZE * 1.3 }}
                  /> 
                    </View>
                    <Text style={[{ color: "white", fontSize: ITEM_FONT_SIZE, fontFamily: "RobotoBold", paddingLeft: 10 }]}>
                    {this.translate.Get("Accept")}
                    </Text>
                  </View>
                </TouchableOpacity>
                  <TouchableOpacity  onPress={() => this._SetMenuViewOpen(CartItemSelected, CartProductIndex)}>
                  <View style={[{ width: (Center.width/5), height:'99%',marginLeft:10, flexDirection: "row", color: "white", 
                  alignItems: "center", justifyContent: "center", backgroundColor: "#0D66CE",
                  borderColor:'#0D66CE',  borderWidth: 2, borderRadius: 10 
                  }]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon  name="plus" type="antdesign"
                    iconStyle={{ justifyContent: "space-between", color: "#FFFFFF", fontSize: ITEM_FONT_SIZE * 1.3 }}
                  />
                    </View>
                    <Text style={[{ color: "white", fontSize: ITEM_FONT_SIZE, fontFamily: "RobotoBold", paddingLeft: 10 }]}>
                    {this.translate.Get("Choose add")}
                    </Text>
                  </View>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        {this.state.isShowMash?
      <View style={styles.BackgroundMash}>
      <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
    </View>
      :null}
       {(this.state.isShowFullImage==true&& this.state.ImageUrl!='')?
            <View style={{ backgroundColor: "rgba(98,98,98,0.6)", position: "absolute", top: 0, left: 0, width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', height: SCREEN_HEIGHT }}>
             <TouchableOpacity style={{}} onPress={() =>  this._ShowFullImage(null,false)}>
            <ImageBackground resizeMode="contain"
              source={{ uri:this.state.endpoint + "/Resources/Images/Product/" + this.state.ImageUrl}
              }
              style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: colors.grey1 }]} >

              </ImageBackground>
              </TouchableOpacity>
          </View>
          :null
        
        }
      </View>
    );
}
}

const styles = StyleSheet.create({
  pnbody: {
   // backgroundColor: "#E3E3E3",
    // alignItems: 'center',
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    width:SCREEN_WIDTH,
    flex: 1
  },
  container1: {
    flex: 1,
    justifyContent: "center"
  },

  pnLeft: {
    flexDirection: "column",
    height: "94%"
  },
  horizontal: {
    justifyContent: "space-around",
    padding: 10
  },
  BottonMenu: {
  
     position: "absolute",
    flexDirection: "row",
    bottom: 0,
    right: 0,
    paddingTop: 5,
    paddingLeft: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  Container: {
    flexDirection: "row"
  },
  pnCenter: {
    flexDirection: "column",
  },
  left_menu_group: {
    paddingLeft: 12,
    height: ITEM_FONT_SIZE * 3.5,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center"
  },
  left_menu_group_item: {
    paddingLeft: 12,
    color: colors.grey2
  },
  left_menu_group_item: {
    borderColor: colors.grey3,
    borderRadius: 1,
    justifyContent: "center",
    color: colors.grey2,
    paddingLeft: 16,
    height: ITEM_FONT_SIZE * 3
  },
  item_Search: {
    width: "90%",
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50
  },
  item_language: {
    flexDirection: "row"
  },
  item_menu_order: {
    paddingTop: SCREEN_HEIGHT * 0.045 - ITEM_FONT_SIZE - 5,
    fontSize: ITEM_FONT_SIZE * 1.3,
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    backgroundColor: "#CC6300",
    justifyContent: "center",
    alignItems: "center"
  },
  item_menu_cart: {
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#0176cd"
  },
  buttontext: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.2
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE,
    fontFamily: "RobotoBold"
  },
  BackgroundMash: {
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
