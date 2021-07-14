/*Màn hình chọn món */
import React, { Component } from "react";
import {TouchableOpacity,Dimensions,Image,TouchableHighlight,ActivityIndicator, UIManager,StatusBar,ImageBackground,Keyboard,StyleSheet,Platform,Animated,Easing,Text,View,
  TextInput} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { setCustomText } from "react-native-global-props";
import { ProductDetails, CardDetailView, _CustomerSendNotification, _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor } from '../components';
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE,H1FontSize,H2FontSize,H3FontSize,H4FontSize,FontSize } from "../config/constants";
import translate from "../services/translate";
import {GetViewGroup,GetPrdChildGroups,GetProductByGroupParent,getTicketInfor, sendOrder,CheckAndGetOrder,SetMenu_getChoiceCategory,getAllItembyChoiceId,CancelOrder} from "../services";
import { formatCurrency } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from '../components/Question';
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
 const SCREEN_HEIGHT = Dimensions.get("window").height //- Constants.statusBarHeight;
 const Bordy={width:SCREEN_WIDTH,height:SCREEN_HEIGHT};
const pnLeft={ width:Bordy.width*0.17,height:SCREEN_HEIGHT };  
const Center={width:Bordy.width-pnLeft.width, height:Bordy.height};
const Header={width:Center.width,height:Bordy.height* 0.085};

const Booton={width:Center.width,height:Center.height* 0.07};
const ProductList={width:Center.width,height:Center.height-Header.height-Booton.height,ColumnNum:2,RowNum:3}
export default class OrderView extends Component {constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    this.state = {
      isRenderProduct: true,
      selectedType: null,
      isPostBack: false,
      selectedId: -1,
      language: 1,
      call: 1,
      data: [],
      ProductGroupList: [],
      ChoiceCategory: [],
      SelectedGroupIndex: -1,
      PrdChildGroups: [],
      SelectedChildGroupIndex: -1,
      Products: [],
      ProductsOrdered: [],
      isShowMash: false,
      Ticket: {},
      table: {},
      settings: {},
      showDropdown: false,
      buttontext: props.defaultValue,
      keysearch: "",
      ShowFullCart: true,
      isShowButtonBar: false,
      FullCartWidth: new Animated.Value(0),
      CartWidth: new Animated.Value(SCREEN_WIDTH * 0.82),
      tableStatus: -1,
      isBooking: true,
      IsShowCustomerSendNotification: false,
      showCall: false,
     
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
        TotalQuantity: 0,
        TotalAmount: 0,
        items: []
      },
      /*Danh Sách Set được tìm thấy */
      SetItemsFilter:[],
      lockTable: false,
      iconCheck: false,
      ShowFeesInfo: false,
      OrdPlatform: 1,
      endpoint: "",
      showSetInCart: false,
      ShowTotalInfo: false,
      ProductImagePrefix: "",
      Config:{

      }
    };
    this.translate = new translate();
  }
  componentWillUnmount() {
  // clearInterval(this.interval);
  }
  componentDidMount = async () => {
    try{
    this.translate = await this.translate.loadLang();
    StatusBar.setHidden(true);
    that = this;
    let state = await _retrieveData("OrderView@STATE", "");
    if (state!='') 
      state = JSON.parse(state);
else  state = this.state;
let CartInfor = await _retrieveData("APP@CART",'');
if (CartInfor!='')
        CartInfor = JSON.parse(CartInfor);
        else CartInfor=this.state.CartInfor;

        state.CartInfor = CartInfor;
       // console.log(' OrderView componentDidMount CartInfor:' + JSON.stringify(CartInfor));
        state.Product = that.state.Product;
        state.FullCartWidth = new Animated.Value(0);
        state.CartWidth = new Animated.Value(SCREEN_WIDTH * 0.82);
      _storeData("OrderView@STATE", JSON.stringify(state), async () => {
        that.setState({state,CartInfor,SelectedGroupIndex:-1});
        return false;
      });
      await this._getTicketInfor();
      await this.fetchData();
      await this.CaculatorCardInfor();
    //  this.interval = setInterval(() => {
    //    this.setState({ TimeToNextBooking: this.state.TimeToNextBooking - 1 });
    //  }, 1000);
   // console.log(' OrderView componentDidMount CartInfor:' + JSON.stringify(state.CartInfor));
  } catch (ex) {
    console.log('OrderView componentDidMount Error:' + ex);
  }
  };
  onPressBack = async() => {
    let { lockTable,table } = this.state;
    
    if (lockTable == true) {
       this.props.navigation.navigate("LogoutView", { lockTable });
      
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
  _loadProductsIsSet = async (item) => {
    let language = await _retrieveData('culture', 1);
    let { settings, Config, } = this.state;
    item.TkdBasePrice = ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice;
    await SetMenu_getChoiceCategory(Config, item).then(async (res) => {
      if (res.Data.Table.length > 0) {
        let ChoiceCategory = res.Data.Table;
        let itemSetGroups = res.Data.Table[0];
        await getAllItembyChoiceId(itemSetGroups.chsId, Config, item, '', language).then(res => {
          if ("Table" in res.Data && res.Data.Table.length > 0) {
            let ChoisetDetails = res.Data.Table;
            this.setState({ ChoiceCategory, ChoisetDetails, isShowMash: false, isPostBack: true });
          }
          else {
            this.setState({ ChoiceCategory, ChoisetDetails: [], isShowMash: false, isPostBack: true });
          }
        }).catch(async (error) => {
          this.setState({ ChoisetDetails: [], isShowMash: false, isPostBack: true });
        });
      }
      else {
        this.setState({isPostBack: true, language, endpoint, Config, });
      }
    }).catch(error => {
      this.setState({
        language, endpoint, settings,  isPostBack: true,
      });
    });
    this.setState({  isShowMash: false, isPostBack: true, });
    return;
  };
  _loadProductsByGroup = async group => {
    let { table, keysearch,Config } = this.state;
    await GetProductByGroupParent(Config, table, group, keysearch).then(res => {
      if ("Table" in res.Data) {
        let Products = res.Data.Table;
        let ProductImagePrefix = res.Data1;
        this.setState({ Products, ProductImagePrefix, isShowMash: false });
      }
    });
  };
  /*Tìm kiếm mặt hàng */
  _searchProduct = () => {
    let {  SelectedGroupIndex, ProductGroupList, PrdChildGroups, SelectedChildGroupIndex } = this.state;
    if (SelectedChildGroupIndex > -1 && PrdChildGroups.length > 0) {
      this._loadProductsByGroup(PrdChildGroups[SelectedChildGroupIndex]);
    } else if (SelectedGroupIndex > -1 && ProductGroupList.length > 0) {
      this._loadProductsByGroup(ProductGroupList[SelectedGroupIndex]);
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
              () => this._loadProductsByGroup(group)
            );
          } else {
            this.setState(
              { PrdChildGroups: [], SelectedChildGroupIndex: -1 },
              () => this._loadProductsByGroup(group)
            );
          }
        })
          .catch(error => {
            this._loadProductsByGroup(group);
          });
      }
    }
    this.setState({  isShowMash: false, isPostBack: true, });
  };
  _setConfig = async () => {
    try{
    let endpoint = await _retrieveData( "APP@BACKEND_ENDPOINT",  JSON.stringify(ENDPOINT_URL) );
    endpoint = JSON.parse(endpoint);
    endpoint = endpoint.replace("api/", "");
    let language = await _retrieveData("culture", 1);
   
    let settings = await _retrieveData('settings', JSON.stringify({ "PosId": 1, "PosIdName": "Thu ngân" }));
    settings = JSON.parse(settings);
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({
          'PosId':settings.PosId,
          'I_BusinessType':1
          }));
    Config = JSON.parse(Config);
    this.setState({endpoint,language,settings,Config});
  }catch(ex){
    console.log('_BindingFont Error :'+ex)
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
    let {  SelectedGroupIndex, ProductGroupList,OrdPlatform,table,Config} = this.state;
         if (!("TicketId" in table)) {
          table = await _retrieveData("APP@TABLE", JSON.stringify({}));
          table = JSON.parse(table);
        }
        if ("TicketID" in table && table.TicketID > 0) {
          CheckAndGetOrder(table, OrdPlatform).then(res => {
            table.OrderId = res.Data;
            _storeData("APP@TABLE", JSON.stringify(table), () => {
              GetViewGroup(Config, table).then(res => {
                if (res.Data.Table.length > 0) {
                  ProductGroupList = res.Data.Table;
                  SelectedGroupIndex = SelectedGroupIndex < 0 ? 0 : SelectedGroupIndex;
                  this.setState( { table,   ProductGroupList,  SelectedGroupIndex },
                    () => {  this._loadChildGroups(SelectedGroupIndex);  }
                  );
                }
              }).catch(error => {
                Question.alert(  this.translate.Get("Thông báo"),   this.translate.Get(  "Không thể truy cập dữ liệu, vui lòng kiểm tra kết nối!" ),
                  [{
                      text: "OK",
                      onPress: () => {   }
                    }
                  ]
                );
              });
            });
          }).catch(error => {
          });
        }
      }catch(ex){
        console.log('_BindingMeta Error :'+ex)
      }
        return true;
  } ; 
  fetchData = async () => {
    await  this._BindingFont();
    await this._setConfig();
    await this._BindingMeta();
    this.setState({  isShowMash: false, isPostBack: true, });
  };
  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: "RobotoRegular"
      }
    };
    setCustomText(customTextProps);
  }
  _getTicketInfor = async () => {
    let { table, Ticket, ProductsOrdered ,Config} = this.state;
   
    if ("TicketID" in table && table.TicketID > 0) {
      getTicketInfor(Config, table).then(res => {
        if (!("Table" in res.Data) || res.Data.Table.length == 0) {
          ;
        }
        if ("Table2" in res.Data) {
          ProductsOrdered = res.Data.Table2;
        }
        if ("Table1" in res.Data) {
          if (res.Data.Table1.length > 0) {
            Ticket = res.Data.Table1[0];
          } else {
            Ticket = { TkTotalAmount: 0, TkNo: 0, TkServiceChargeAmout: 0 };
          }
        }
        table.Ticket = Ticket;
        //console.log('table.ProductsOrdered:'+JSON.stringify(ProductsOrdered));
        _storeData("APP@TABLE", JSON.stringify(table), () => {
          this.setState({ Ticket, table, ProductsOrdered, isBooking: false });
        });
      }).catch(error => {
        this.setState({ empty: true, isShowMash: false, isPostBack: true, });
      });
    }
    this.setState({  isShowMash: false, isPostBack: true, });
  };
  static getDerivedStateFromProps = (props, state) => {
    if (
      props.navigation.getParam("settings", state.settings) != state.settings ||
      props.navigation.getParam("lockTable", state.lockTable) != state.lockTable ||
      props.navigation.getParam("table", state.table) != state.table
    ) {
      return {
        settings: props.navigation.getParam("settings", state.settings),
        lockTable: props.navigation.getParam("lockTable", state.lockTable),
        table: props.navigation.getParam("table", state.table)
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
  /*
let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    let QuantityCheck=CartInfor.OrddQuantity+OrddQuantity,TypeNumCheck=CartInfor.items.length ;
        if(!isExits)
            TypeNumCheck++;
            if (Config.I_LimitQuntityBooking > 0) {
              if (QuantityCheck>= Config.I_LimitQuntityBooking) {
                Question.alert(
                  this.translate.Get("Limited OrddQuantity!"),
                  this.translate.Get("Your quantity is limited, Please check in!")
                );
                return;
              }
            }
              if (Config.I_LimitTypeBooking > 0) 
                if (TypeNumCheck>= Config.I_LimitTypeBooking) {
                  Question.alert(
                    this.translate.Get("Limited Products!"),
                    this.translate.Get("Your products number is limited, Please check in!")
                  );
                  return;
                }
                
        */
        if(iQuantity>0){
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
 
  changeLanguage = async lang => {
    if (this.state.language != lang) {
      let that = this;
      await _storeData("culture", lang.toString(), async () => {
        that.translate = await this.translate.loadLang();
        that.setState({ language: lang }, () => that.fetchData());
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
      this._loadProductsByGroup(item);
    });
  };
  _sendOrder = async () => {
    let { table, CartInfor, OrdPlatform,Config } = this.state;
   
    if (CartInfor.TotalQuantity<=0) 
      return;
    this.setState({ isShowMash: true }); 
    console.log('CartInfor.items :'+JSON.stringify(CartInfor.items)); 
    await sendOrder(Config, table, OrdPlatform, CartInfor.items).then(async res => {
      if (res.Status == 1) {
        await _remove("APP@CART", async () => {
          await this.setState({ CartInfor: {  TotalQuantity: 0, TotalAmount: 0, items: [], } }, async () => {
            await CheckAndGetOrder(table, OrdPlatform).then(async res => {
              table.OrderId = res.Data;
              await _storeData("APP@TABLE", JSON.stringify(table), async () => {
                _storeData('APP@TimeToNextBooking', JSON.stringify(new Date().getTime()), async () => {
                  await this.setState({
                    table: table, isShowMash: false,
                    TimeToNextBooking: Config.I_Limit_Booking_Time ? Config.I_Limit_Booking_Time : 5
                  }, async () => {
                    await this.CartToggleHandle(false);
                    this._getTicketInfor();
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
              this._getTicketInfor();
            });
          }
          );
        });
      }
    }).catch(error => {
      Question.alert( this.translate.Get("Notice"),
        this.translate.Get("ServerError"+':'+error),
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
        this._getTicketInfor();
      });
    });
  };

  _CaculatorMaster = (Master) => {
    try{
    if (Master == null)
      return  {Master};
    let UpAmount = 0;
    if (Master.UnitPrice==undefined||Master.UnitPrice==null) 
    Master.UnitPrice=0;
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
    let TotalAmount=0,TotalQuantity=0,Master=null;
   //console.log("CaculatorCardInfor CartInfor "+JSON.stringify({CartInfor}));
   // console.log("-----------------------");
   if (CartInfor.items&&CartInfor.items.length>0) 
    CartInfor.items.forEach((item, index) => {
     let{Master}=  this._CaculatorMaster(item);
       // console.log("item.TkdTotalAmount:"+item.TkdTotalAmount);
        TotalAmount+=Master.TkdTotalAmount;
        //console.log("CaculatorCardInfor TkdTotalAmount itembf"+result.Master.TkdTotalAmount );
        TotalQuantity+=Master.OrddQuantity
        CartInfor.items[index]=Master;
    
    });
    //console.log("CaculatorCardInfor:"+TotalAmount);
     if (!isRender||(CartInfor.TotalQuantity!=TotalQuantity||CartInfor.TotalAmount != parseFloat(TotalAmount)))
     isRender=true;
    CartInfor.TotalQuantity=TotalQuantity;
    CartInfor.TotalAmount = parseFloat(TotalAmount);
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
      if (product.PrdId == item.PrdId&&(Json==null|| product.Json==Json)) 
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
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => this.setState({ ShowFullCart: isShow }));
  }
  CartToggleHandle(isShow) {
    const endWidth = !this.state.isShowButtonBar ? SCREEN_WIDTH * 0.75 : 0;
    if (isShow) {
      this.setState({ isShowButtonBar: isShow, isBooking: true });
    }
    Animated.timing(this.state.FullCartWidth, {
      toValue: endWidth,
      duration: 1000,
      easing: Easing.linear
    }).start(() => this.setState({ isShowButtonBar: isShow }));
  }
  _buy = item => {
    this.setState({ CartItemSelected: null, CartProductIndex: -1 }, () =>
      this.CartToggleHandle(true)
    );
  };
  _addExtraRequestToItem = (item) => {
    if (item == null) {
      return;
    }
    let {CartFilter}= this._getCartItems(item,'');
    let state = this.state;
    state.CartProductIndex = CartFilter.FirstIndex;
    _storeData("OrderView@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "OrderView", 
      Product: DataCurrent.DataRow, UpdateDescription: async (item) => this._updateItemDescription(item) });
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
  sendNotice = status => {
    this.setState({ showCall: false, IsShowCustomerSendNotification: false, isShowMash: false, tableStatus: status });
  };
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
    await this._loadProductsByGroup(ProductGroupList[SelectedGroupIndex]);
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
          this.setState({ CartItemHandle ,CartItemSelected,CartProductIndex,ProductChoise,ProductChoiseIndex,SelectedGroupIndex}, () => {
            if (ProductChoise.PrdViewSetMenuType && ProductChoise.PrdViewSetMenuType == 2) 
            this._loadProductsIsSet(ProductChoise);
          });
          //console.log('_ProductDetailsAccept CartProductIndex:'+JSON.stringify(CartProductIndex));
          this.setState({showSetInCart:false,isPostBack: true});
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
          <View style={{ 
             position: "absolute",
             right: H3FontSize * 3, flexDirection: "row" }}>
            <Text style={{ color: "#000000", paddingRight: 5, fontSize: H3FontSize * 0.8 }}>
              {item.TksdPrice > 0 ? (<Text>+{formatCurrency(item.TksdPrice, "")}</Text>) : null}{" "}
            </Text>
          </View>
        </View>
      </View>
    );
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
      //  console.log('renderProductModal ProductChoiseIndex:'+ProductChoiseIndex)
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
  renderProduct = ({ item, index }) => {
    let { Config } = this.state;
    let iWith=(ProductList.width/ProductList.ColumnNum)-2;
    //let iHeight=(ProductList.height/ProductList.RowNum)-2;
    let iHeight=iWith*3/6;
    let {CartFilter}= this._getCartItems(item,null);
   // console.log("CartFilter TotalQuantity:"+JSON.stringify( CartFilter.TotalQuantity));
    item.OrddQuantity=CartFilter.TotalQuantity;
    this.state.isRenderProduct=true;
    return (
      <TouchableHighlight   style={ { borderBottomWidth: 1, borderLeftWidth: 1,borderTopWidth: 1,borderColor: colors.grey5,width:iWith-2,height: iHeight, }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", height: '100%' }}>
          <View style={{ width: "60%", height: '100%' }}>
            <TouchableOpacity name='dvImage' style={{ flexDirection: "row", width: '100%', height: '100%' }}
              onPress={() => { this.PrerenderProductModal(item,CartFilter,index);
            }}> 
              <ImageBackground  resizeMode="stretch"
                source={ item.PrdImageUrl ? {uri: this.state.ProductImagePrefix == '' ? this.state.endpoint + "/Resources/Images/Product/" +
                        item.PrdImageUrl : this.state.ProductImagePrefix + '/' + item.PrdImageUrl
                  }: require("../../assets/icons/ReliposEmenu_4x.png")
                }
                style={[{ width: '100%', height: '100%', backgroundColor: colors.grey1 }]} >
                {item.SttId && item.SttId == 3 ? 
                  <View style={{ position: "absolute", paddingTop:5,right:5,paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%'}}>
                    <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_like.png')}
                      style={{ width: H3FontSize * 1.2, height: H3FontSize * 1.2, }} />
                  </View>
                : null}
                {item.SttId && item.SttId == 2 ?
                  <View style={{  position: "absolute", paddingTop: 5, right: 5,  paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%' }}>
                    <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_new.png')}
                      style={{ width: H3FontSize * 1.2, height: H3FontSize * 1.2, }} />
                  </View>
                  : null} 
                <View style={{ position: "absolute", paddingTop: (iHeight-36)/2, right: -15 }}>
                  <Icon  name="caretleft" type="antdesign" iconStyle={{ justifyContent: "space-between", color: "#EEEEEE", fontSize: 36 }} />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View> 
          <View style={{ flexDirection: "column", flexWrap: "wrap", width: "40%", height: '100%',paddingLeft:5,paddingRight:5,backgroundColor: "#EEEEEE" }}>
          <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:'100%'}}>
             {Config.B_ViewProductNo?
               <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:iHeight-(H4FontSize+H2FontSize+10)}}>
              <View name='pnProductNo' style={{width: '100%',height:H3FontSize*1.5 ,paddingTop:2 }}>
                <Text style={{ color: "#0d65cd", textAlign: 'center', width: '95%',fontSize: H3FontSize, fontFamily: "RobotoBold"}} numberOfLines={2}> 
                  {item.PrdNo}
                </Text>
              </View>
              <View name='pnProductName' style={{width: '100%',paddingTop:2 }}>
                <Text style={{color: "#000000",width: '100%',textAlign:'left',fontSize:H4FontSize,flexWrap:"wrap"}} numberOfLines={5}>
                  {item.PrdName} 
                </Text>
              </View>
              </View>
              :
              <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:iHeight-(H4FontSize+H2FontSize+10)}}>
            <View name='pnProductName' style={{width: '100%',paddingTop:2 }}>
              <Text style={{color: "#000000",width: '100%',textAlign:'left',fontSize:H4FontSize,flexWrap:"wrap"}} numberOfLines={5}>
                {item.PrdName} 
              </Text>
            </View>
            </View>
             }
              <View  name='lbPrice' style={{height:H4FontSize,width:'100%' }}>
                <Text style={{color: "#af3037",width: "100%",textAlign:'center',fontSize: H4FontSize}}>
                  {this.translate.Get("Giá")}:{" "}
                  <Text style={{ fontFamily: "RobotoItalic" }}>
                    {formatCurrency(item.UnitPrice, "")}
                  </Text>
                </Text>
              </View>
              <View style={{width: "100%", height: H2FontSize,paddingTop:5}}>
                <View style={{ flexDirection: "row", justifyContent: 'space-evenly',  width: "100%", height: '100%'}}  >
                  {item.OrddQuantity> 0 ?
                    <TouchableOpacity 
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
                      <Image resizeMode='center' source={require('../../assets/icons/IconDelete.png')} style={{ width: H2FontSize, height: H2FontSize,}} />
                      }
                    </TouchableOpacity> :
                    <View style={{  width:H2FontSize, height: H2FontSize, justifyContent: 'center', alignItems: 'center', }}>
                    </View>
                  }
                  <View style={{ width:(iWith-4)*0.4*0.6, height: H2FontSize, justifyContent: 'center' }}>
                 {( item.PrdIsSetMenu != true && item.OrddQuantity>0)?
                      <TextInput ref={input => this.textInput = input}
                        style={{  color: "#af3037",width: '100%',fontSize:H2FontSize,textAlign:"center",fontFamily: "RobotoBold", }}
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
                  <TouchableOpacity style={{}} onPress={() => {
                     if (item.PrdIsSetMenu == true ) 
                     this.PrerenderProductModal(item,CartFilter,index);
                     else {
                    this.HandleQuantity(item,1,false);
                    this.CaculatorCardInfor(true);
                     }
                  }}>
                    <Image resizeMode='center' source={require('../../assets/icons/IconAdd.png')}
                      style={{width: H2FontSize, height: H2FontSize, }} />
                  </TouchableOpacity>
                </View>
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
    const {ProductGroupList,PrdChildGroups,Products,CartInfor,CartItemSelected,CartProductIndex,IsShowCustomerSendNotification,SelectedChildGroupIndex,SelectedGroupIndex, Config, lockTable,ProductsOrdered} = this.state; 
    return (
      <View style={styles.pnbody,{height:Bordy.height,width:Bordy.width}}>
        <View style={styles.Container}>
         
          <View name='pbLeft' style={[styles.pnLeft, { backgroundColor: "#333D4C",width:pnLeft.width }]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: pnLeft.width, }}>
              <Image resizeMode="stretch" 
              //source={require('../../assets/icons/Logo_Emenu_BG_Red_3.png')}
               source={require('../../assets/LogoSos.jpg')}
                style={{ width: '67%', height: '67%' }} />
            </View> 
            <_ProductGroup  state={this.state}  
              translate={this.translate}
              ProductGroupList={ProductGroupList}
              SelectedGroupIndex={SelectedGroupIndex}
              _GroupClick={(index) => this._GroupClick(index)}
              setState={(state) => this.setState(state)}
              pnheight={Bordy.height-pnLeft.width}
              BookingsStyle={BookingsStyle}
              PrdChildGroups={PrdChildGroups}
              SelectedChildGroupIndex={SelectedChildGroupIndex}
              _selectChildGroup={(item,index) => this._selectChildGroup(item,index)}
            />
          </View>
          <View style={styles.pnCenter,{width:Center.width,height:Center.height}}>
            <_HeaderNew
              state={this.state}
              backgroundColor="#333D4C"
              table={this.state.table}
              onPressBack={() => { this.onPressBack(); }}
              _searchProduct={(val) => this._searchProduct(val)}
              translate={this.translate}
              name={'OrderView'}
              lockTable={lockTable}
              language={this.state.language} 
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
               style={{height:Header.height}}  />
            <View styles={{ height:ProductList.height,width:ProductList.width,paddingTop:1,backgroundColor: "#333D4C"}} >
              <FlatList   data={Products}  numColumns={2}
                extraData={this.state.isRenderProduct==false}
                renderItem={this.renderProduct}
                contentContainerStyle={{paddingBottom: ProductList.height/ProductList.RowNum}}
              />
            </View>
          </View>
        </View>
        {!this.state.isShowButtonBar ? (
         //Bottonbar 
          <Animated.View style={[styles.BottonMenu, { width:Center.width,height:Booton.height }]}>
            {this.state.ShowFullCart ? (
              <View style={{ width: "100%", flexDirection: "row" }}>
                  <View style={{ flexDirection: "row",justifyContent: "center",alignItems: "center", width: (Center.width/2),}}>
                    {
                 <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                   {/* { <Image resizeMode="contain" style={{ width: SCREEN_WIDTH * 0.35, maxWidth: 442 }}
                       source={require('../../assets/icons/iconNew/PhatTrien2-10.png')} ></Image> } */}
                   </View>
                  }
                </View> 
                <View style={[BookingsStyle.bottombar, styles.item_menu_order, { width: (Center.width/4), flexDirection: "row" }]}>
                  <View style={{ position: 'absolute', left: 10, paddingTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                    {<Image resizeMode="stretch" source={require('../../assets/icons/iconCash.png')}
                      style={{ width: H3FontSize * 1.3, height: H3FontSize * 1.3, }} /> }
                  </View>
                  <Text style={[{ fontSize: H3FontSize, fontFamily: "RobotoBold", color: '#FFFFFF', paddingLeft: 10 }]}>
                    {formatCurrency(CartInfor.TotalAmount, "")}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.CartToggleHandle(true)}>
                  <View style={[BookingsStyle.bottombar, { width: (Center.width/4), flexDirection: "row", color: "white", alignItems: "center", justifyContent: "center", 
                  backgroundColor: "#0D66CE"
                  }]}> 
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_GioHang.png')}
                        style={{ width: H3FontSize * 1.3, height: H3FontSize * 1.3, }} />
                    </View>
                    <Text style={[{ color: "white", fontSize: H3FontSize, fontFamily: "RobotoBold", paddingLeft: 10 }]}>
                      {this.translate.Get("Giỏ hàng")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.toggleWidth(true)}
                style={[BookingsStyle.bottombar, { backgroundColor: "#29ade3", width: SCREEN_HEIGHT * 0.08 }]}>
                <Icon name="cart-outline"  type="material-community"
                  containerStyle={[BookingsStyle.bottombar, { paddingLeft: SCREEN_HEIGHT * 0.005, justifyContent: "center" }]}
                  iconStyle={{ fontSize: ITEM_FONT_SIZE * 2, color: "white" }}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          <CardDetailView
            state={this.state}
            CartToggleHandle={(val) => this.CartToggleHandle(val)}
            translate={this.translate}
            HandleQuantity={(item,OrddQuantity,isReplace,Json) => { this.HandleQuantity(item,OrddQuantity,isReplace) }}
            setState={(state) => this.setState(state)}
            settings={Config}
            BookingsStyle={BookingsStyle}
            ProductsOrdered={ProductsOrdered}
            onGetInfor={() => this._getTicketInfor()}
            onSendOrder={() => this._sendOrder()}
          />
        )}
        {this.renderProductModal()}
        {IsShowCustomerSendNotification ? (
        <_CustomerSendNotification  table={this.state.table} BookingsStyle={BookingsStyle}  settings={Config}
          endpoint={this.state.endpoint}  language={this.state.language}  changeLanguage={(lang) => this.changeLanguage(lang)}
          sendNotice={(status) => this.sendNotice(status)} setState={(state) => this.setState(state)}
          translate={this.translate} tableStatus={this.state.tableStatus}
        />
        ) : null}
        {/* {
        // Gọi phục vụ
        showCall ? (<_CallOptions  table={this.state.table}  BookingsStyle={BookingsStyle} settings={Config} endpoint={this.state.endpoint}  call={this.state.call}  setState={(state) => this.setState(state)}  translate={this.translate} tableStatus={this.state.tableStatus}
        />
        ) : null} */}
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
        {this.state.isShowMash ?
          <View style={styles.BackgroundMash}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
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
