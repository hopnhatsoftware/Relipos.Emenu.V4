import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image,Keyboard, TouchableHighlight, ActivityIndicator, UIManager, StatusBar, ImageBackground, StyleSheet, Platform, Animated, Text, View,TextInput } from "react-native";
import * as Font from "expo-font";
import Constants from 'expo-constants';
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { setCustomText } from 'react-native-global-props';
import {  _Header, _ChoiceCategory } from '../components';
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, H1FontSize, H2FontSize, H3FontSize, H4FontSize } from "../config/constants";
import translate from "../services/translate";
import { SetMenu_getChoiceCategory, getByChoiceId, SetMenu_gettemDefault, } from "../services";
import { formatCurrency } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from '../components/Question';
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height //- Constants.statusBarHeight;
const Header={height:SCREEN_HEIGHT* 0.085};

export default class SetMenuView extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.state = {
      endpoint: '',
      isColor: false,
      language: 1,
      IsPostBack: false,
      isShowFullImage:false,
      ImageUrl:'',
      ProductGroupList: [],
      CategorySelectedIndex: -1,
      ChoiceSet: [],
      Ticket: {},
      table: {},
      settings: {},
      showDropdown: false,
      Product: {},
      ProductSet: {
        PrdId: 0,
        PrdNo: '',
        PrdName: '',
        UnitId: 0,
        OrddQuantity: 1,
        UnitPrice: 0,
        UpAmount: 0,
        TkdBasePrice: 0,
        TkdItemAmount: 0,
        TotalChoiseAmount: 0,
        PrdVatPercent: 0,
        TkdVatAmount: 0,
        TkdTotalAmount: 0,
        ObjRelate: 0,
        ObjRelateName: '',
        OrddIsPromotion: 0,
        OrddDescription: '',
        RtkdParentId: 0,
        ObjManager: 0,
        ObjManagerName: '',
        IcsId: 0,
        Description: '',
        OrddType: 0,
        OrddPosition: 0,
        subItems: [],
      },
      Cart: {
        subItems: [],
        OrddQuantity: 0,
        Amount: 0,
        itemIsSet: [],
        isSetQuantity: 0,
        isSetAmount: 0
      },
      selectedItemIndex: 0,
      index: 0,
      isMakeDetault: false,
      lStyle:{
        TitleCorlor:'',
        PnLeft:{
          Width:0,
          Height:0
        },
        PnCenter:{
          Width:0,
          Height:0,
          RowNumer:3,
          NumColumns:2,
          ItemHeight:0,
          ItemWidth:0
        },
        pnChoiceCategory:{
          Width:0,
          Height:SCREEN_HEIGHT * 0.085,
          ItemWidth:0
        },
        Bottonbar:{
          Width:SCREEN_HEIGHT*0.4,
          Height:SCREEN_HEIGHT * 0.08,
        }
    }
    };
    this.translate = new translate();

  }
  static getDerivedStateFromProps = (props, state) => {

    if (
      props.navigation.getParam("settings", state.settings) != state.settings ||
      props.navigation.getParam("Product", state.Product) != state.Product
    ) {

      return {
        settings: props.navigation.getParam("settings", state.settings),
        Product: props.navigation.getParam("Product", state.Product),
      }
    }
    // Return null if the state hasn't changed
    return null;
  };
  componentWillUnmount= async () => {
   await _remove("SetMenuView@State", async () => {});
  }
  componentDidMount = async () => {
    try {
     // console.log('componentDidMount ');
      this.translate = await this.translate.loadLang();
      StatusBar.setHidden(true);
      let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    this.setState({isColor})
      let state = await _retrieveData("SetMenuView@State", '{}');
      if (state=='{}') {
        state =this.state;
      } else    state = JSON.parse(state);
        _storeData("SetMenuView@State", "", async () => {
          let item = state.Product;
          let UnitPrice = parseFloat(('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice);
          let ProductSet = {
            isColor: false,
            PrdId: item.PrdId,
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
            OrddQuantity: 1,
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
          }
          state.ProductSet = ProductSet;
          state.isMakeDetault = true;

        });
        let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
        endpoint=JSON.parse(endpoint);
        state.endpoint=endpoint;
        let settings = await _retrieveData('settings', JSON.stringify({}));
          state.settings=settings;
        let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
            Config = JSON.parse(Config);
            state.Config=Config;
        let language1 = await _retrieveData('culture', 1);
        state.language=language1;
        /*Tính toàn Style*/
        let lStyle=state.lStyle;
        lStyle.PnLeft.width=SCREEN_WIDTH*0.3;
        lStyle.PnCenter.width=SCREEN_WIDTH-lStyle.PnLeft.width;
        lStyle.pnChoiceCategory.ItemWidth=lStyle.PnCenter.width/3;
        lStyle.pnChoiceCategory.Height= SCREEN_HEIGHT * 0.085,
        /*Số dòng của mặt hàng */
        lStyle.PnCenter.RowNumer=3;
        lStyle.PnCenter.Height= SCREEN_HEIGHT -(lStyle.pnChoiceCategory.Height+lStyle.Bottonbar.Height);
         /*Số cột của mặt hàng */
        lStyle.PnCenter.NumColumns=2;
        lStyle.PnCenter.ItemWidth=lStyle.PnCenter.width/lStyle.PnCenter.NumColumns;
        lStyle.PnCenter.ItemHeight= lStyle.PnCenter.Height/lStyle.PnCenter.RowNumer;
        state.lStyle=lStyle;
      
      this.setState(state,);
      
      await this.fetchData(); 
    } catch (ex) {
      console.log('componentDidMount Error:' + ex);
    }
  };
  _getAllItembyChoiceId = async group => {
    try{
    const { ProductSet,language,Config } = this.state;
    await getByChoiceId(group.chsId, Config, ProductSet, '', language).then(res => {
      if ("Table" in res.Data)
        this.setState({ ChoiceSet: res.Data.Table });
    });
  } catch (ex) {
    console.log('_getAllItembyChoiceId Error:' + ex);
  }
  };

  _BindingFont = async () => {
    try {
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
    } catch (ex) {
      console.log('_BindingFont Error :' + ex)
    }
    return true;
  };
  fetchData = async () => {
    try {
      await this._BindingFont();
      //  await this.defaultFonts();
      await this._fetchgetChoiceCategory();
      let { ProductGroupList, CategorySelectedIndex } = this.state;
      CategorySelectedIndex = 0;
      if (ProductGroupList.length > 0) {
        await this._getAllItembyChoiceId(ProductGroupList[CategorySelectedIndex]);
        this.setState({ CategorySelectedIndex });
      }
      await this._getItemDefault();
      await this._CaculatorMaster(null);
      this.setState({ IsPostBack: true });
    }catch (ex) {
      console.log('fetchData Error :' + ex)
    }
  };
  defaultFonts = async () => {
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }
  _fetchgetChoiceCategory = async () => {
    try{
    let { table, ProductSet ,Config} = this.state;
   
    if (!("TicketId" in table)) {
      table = await _retrieveData("APP@TABLE", JSON.stringify({}));
      table = JSON.parse(table);
    }
    if ("PrdId" in ProductSet && ProductSet.PrdId > 0) {
      await SetMenu_getChoiceCategory(Config, ProductSet).then(res => {
        if (res.Data.Table.length >0){
        let ProductGroupList = res.Data.Table;
        this.setState({ table, ProductGroupList, });
        }
      });
    }
  }catch (ex) {
    console.log('_fetchgetChoiceCategory Error :' + ex)
  }
  }
  _CaculatorMaster = async (ProductSet) => {
    try{
    let { ProductSet1 } = this.state;
    if (ProductSet == null)
    ProductSet=ProductSet1;
    if (ProductSet == null)
      return null;
    let UpAmount = 0;
    ProductSet.subItems.forEach((item, index) => {
      if (item.TksdQuantity > 0 && item.TksdPrice > 0)
        UpAmount += parseFloat(item.TksdQuantity) * parseFloat(item.TksdPrice);
    });
    ProductSet.UpAmount = UpAmount;
    ProductSet.TotalChoiseAmount = parseFloat(ProductSet.UnitPrice + ProductSet.UpAmount);
    ProductSet.TkdItemAmount = parseFloat(ProductSet.TotalChoiseAmount * ProductSet.OrddQuantity);
    ProductSet.TkdVatAmount = parseFloat(ProductSet.TkdItemAmount * ProductSet.PrdVatPercent * 0.01);
    ProductSet.TkdTotalAmount = parseFloat(ProductSet.TkdItemAmount + ProductSet.TkdVatAmount);
    //console.log('_CaculatorMaster:  TkdVatAmount'+ ProductSet.PrdVatPercent);
    this.setState({ ProductSet });
    return ProductSet;
  }catch (ex) {
    console.log('_CaculatorMaster Error :' + ex);
    return null;
  }
  
  }
  _getItemDefault = async () => {
    try {
      let { ProductSet,Config } = this.state;
      await SetMenu_gettemDefault(Config, ProductSet).then(res => {
        if ("Table" in res.Data) {
          if (ProductSet.subItems == undefined || ProductSet.subItems == null || ProductSet.subItems.length <= 0)
            ProductSet.subItems = res.Data.Table;
          this.setState({ ProductSet });
        }
      });
    } catch (ex) {
      console.log('_getItemDefault Error :' + ex)
    }
  };
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
  _HandleQuantityDetail = async (item, OrddQuantity, IsOveRight) => {
    //console.log('_HandleQuantityDetail'+ OrddQuantity);
    let { ProductSet, ProductGroupList, CategorySelectedIndex,Config } = this.state;
    let group = ProductGroupList[CategorySelectedIndex];
    if (('OrddQuantity' in group && group.OrddQuantity + OrddQuantity > group.ChcgMaxQuantity) || group.ChcgMaxQuantity <= 0) {
      Question.alert(this.translate.Get("Alert"), this.translate.Get("ChoiseOrderlimited"));
      //console.log('Limited OrddQuantity:'+ JSON.stringify(group));
      return null;
    }
    var Detail = null;
    let ItemIndex = 0, GroupQuantity = 0;
    ProductSet.subItems.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        GroupQuantity = product.TksdQuantity;
        if (IsOveRight)
          product.TksdQuantity = OrddQuantity;
        else
          product.TksdQuantity += OrddQuantity;
        ItemIndex = index;
        Detail = product;
        return Detail;
      }
    });
    if (Detail != null && OrddQuantity > 0) {
      if (Config.I_LimitTypeBooking > 0 && ProductSet.subItems.length >= Config.I_LimitTypeBooking) {
        Question.alert(this.translate.Get("Limited ChoiceSet!"), this.translate.Get("Your products number is limited, Please check in!"));
        return;
      }
    }
    if (Detail == null && OrddQuantity > 0) {
      // console.log('Detail push:'+ JSON.stringify(Detail));
      ProductSet.subItems.push({
        SmnIsChange: true,
        PrdId: item.PrdId,
        PrdNo: item.PrdNo,
        PrdName: item.PrdName,
        TksdUnitId: item.UnitId,
        chsId: ('chsId' in item) ? item.chsId : null,
        TksdPrice: ('TksdPrice' in item) ? item.TksdPrice : 0,
        OdsdDescription: ('OdsdDescription' in item) ? item.OdsdDescription : '',
        TksdQuantity: OrddQuantity,
      });
      GroupQuantity = OrddQuantity;
    } 
    // console.log('Detail product:'+ JSON.stringify(Detail));
    /*Kiểm tra xoá hoặc cập nhật */
    if (Detail != null) {
      if (Detail.TksdQuantity == 0) {
        ProductSet.subItems.splice(ItemIndex, 1);
        GroupQuantity = GroupQuantity * -1;
      }
      else GroupQuantity = OrddQuantity;
    }
    if (('chsId' in item) && item.chsId == group.chsId) {
      if ('OrddQuantity' in group)
        group.OrddQuantity += GroupQuantity;
      else
        group.OrddQuantity = GroupQuantity;
      ProductGroupList[CategorySelectedIndex] = group;
    }
    //console.log('Detail group:'+ JSON.stringify(group));
    this.setState({ ProductGroupList, ProductSet });
    this._CaculatorMaster(ProductSet);
  };
  _HandleQuantity = async (OrddQuantity) => {

    let { ProductSet } = this.state;
    ProductSet.OrddQuantity = parseFloat(ProductSet.OrddQuantity) + parseFloat(OrddQuantity);
    this.setState({ ProductSet });
    this._CaculatorMaster(ProductSet);
  };
  _showCurrentQty = item => {
    let { Cart } = this.state;
    let OrddQuantity = 1;
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        OrddQuantity = product.OrddQuantity;
        return OrddQuantity;
      }
    });
    return OrddQuantity;
  };
  changeLanguage = async lang => {
    if (this.state.language != lang) {
      await _storeData("culture", lang.toString(), async () => {
        this.translate = await this.translate.loadLang();
        this.setState({ language: lang }, () => this.fetchData());
      });
    }
  };
  _ChoiceCategorySelect = (item, index) => {
    console.log('item',item)
    console.log('index',index)
    this.setState({ CategorySelectedIndex: index}, () => {
      this._getAllItembyChoiceId(item);
    });
  };
  _ValidateProductSet= async () => {
    let { ProductSet } = this.state;
    return true;
  }
  /**
   * Xử lý lư vào data CartData
   * @returns Bool
   */
  _AcceptHandle = async () => {
    try {
     // console.log('_AcceptHandle Begin');
      this.setState({ isShowMash:true });
      let { ProductSet } = this.state;
      /*Valid ProductSet */
      let isValidate=await this._ValidateProductSet();
      if (isValidate!=true) 
         { this.setState({ isShowMash:false });
          return;
    }
      let CartInfor = await _retrieveData("APP@CART",JSON.stringify({
        items: [],
        OrddQuantity: 0,
        Amount: 0,
        UnitPrice:0,
        itemIsSet: [],
        isSetQuantity: 0,
        isSetAmount: 0
      })
    );
   // console.log('_AcceptHandle Begin 1');
    CartInfor = JSON.parse(CartInfor);
      if (!('Json' in ProductSet) || ProductSet.Json == '')
        ProductSet.Json = JSON.stringify(ProductSet.subItems);
      let CartItem = ProductSet, CartIndex = -1;
      CartInfor.items.forEach((iProductSet, index) => {
        if (iProductSet.PrdId == ProductSet.PrdId&&iProductSet.Json==ProductSet.Json) {
          CartItem = iProductSet;
          CartIndex = index;
          return CartItem;
        }
      });
      if (CartIndex<0){
        CartItem= await this._CaculatorMaster(CartItem);
      CartInfor.items.push(CartItem);
      }
      else 
      CartInfor.items[CartIndex] = CartItem= await this._CaculatorMaster(ProductSet);
      let TotalAmount = 0, TotalQuantity = 0;
      CartInfor.items.forEach((Item, index) => {
        TotalAmount += Item.TkdTotalAmount;
        TotalQuantity += ProductSet.OrddQuantity;
      });
      CartInfor.OrddQuantity = TotalQuantity;
      CartInfor.Amount += parseFloat(TotalAmount);
     //console.log('CartInfor :'+JSON.stringify(CartInfor)); 
      _storeData("APP@CART", JSON.stringify(CartInfor), () => 
      {  this.setState({ isShowMash:false });
        
        this.props.navigation.navigate('OrderView');
      });
    } catch (ex) {
      console.log('_AcceptHandle Error:' + ex);
    }
    this.setState({ isShowMash:false });
  };
  _showQty = item => {
    let { ProductSet } = this.state;
    let OrddQuantity = 0;
    ProductSet.subItems.forEach(product => {
      if (product.PrdId == item.PrdId) {
        OrddQuantity = product.TksdQuantity;
        return OrddQuantity;
      }
    });
    return OrddQuantity;
  };
  _updateDescription = async (Product) => {
    let state = await _retrieveData('SetMenuView@State', '');
    if (state != '') 
    {
      state = JSON.parse(state);
      state.ProductSet.subItems[state.selectedItemIndex] = Product;
      _storeData("SetMenuView@State", JSON.stringify(state));
    }
  }
  _updateSetDescription = async (data) => {
    let state = await _retrieveData('SetMenuView@State', '');
    if (state != '') {
      state = JSON.parse(state);
      state.ProductSet = data;
      _storeData("SetMenuView@State", JSON.stringify(state));
    }
  }
  _addExtraRequestToItem = (item) => {
    if (item == null) {
      return;
    }
    let state = this.state;
    ProductSet.subItems.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        state.Product = product;
        state.selectedItemIndex = index;
      }
    });
    _storeData("SetMenuView@State", JSON.stringify(this.state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "SetMenuView", Product: item, UpdateDescription: async (item) => this._updateDescription(item) });
    });
  };
  _addExtraRequestToSet = () => {
    let state = this.state;
    _storeData("SetMenuView@State", JSON.stringify(this.state), async () => {
      this.props.navigation.navigate('RequestView', { ReturnScreen: "SetMenuView", Product: this.state.ProductSet, UpdateDescription: async (item) => this._updateSetDescription(item) });
    });
  }
  _Cancel = () => {
    _storeData("SetMenuView@State", '', async () => {
      this.props.navigation.navigate('OrderView');
    });
  };
  RenderRowDetail = ({ item, index }) => {
    let{isColor}= this.state;
    return (
      <View style={{ width: '100%',paddingTop:5,paddingBottom:5, flexDirection: "row", borderBottomWidth: 1, borderBottomEndRadius: 1,backgroundColor:isColor == true ? "#444444" : "#FFFFFF",borderBottomColor: colors.grey4}}>
        <View key={index} style={{ width: '10%', justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ color: isColor == true ? "#FFFFFF" :"#000000", width: '100%', fontSize: H4FontSize, textAlign: 'center' }} numberOfLines={2}>
          {this._showQty(item)} 
          </Text>
        </View>
        <View style={{ width: '90%', flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
          <View style={{ flexDirection: "row",  justifyContent: "flex-start", alignContent: 'flex-start', alignItems: 'flex-start', width: '53%', }}>
            <Text style={[{ color:isColor == true ? "#FFFFFF" : "#000000", width: '100%', fontSize: H4FontSize, textAlign: 'left', }]} numberOfLines={5}>
            {item.PrdName}
            </Text>  
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: 'center', alignItems: 'center', width: '35%', paddingRight: 5, }}>
            <Text style={{color: isColor == true ? "#FFFFFF" :"#000000", paddingRight: 5, fontSize: H3FontSize * 0.8 }}>
              {formatCurrency(item.TksdPrice, '')}</Text>
          </View>
          {item.SmnId && item.SmnId > 0 ?
            <View style={{ flexDirection: 'row', width: '12%', justifyContent: 'center', alignItems: 'center', }}>
            </View>
            :
            <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
              <TouchableOpacity onPress={() => { this._HandleQuantityDetail(item, 0, true) }}>
                <Icon name="close" type="closesquare" color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }
  _getItemFromCart = item => {
    let { ProductSet } = this.state;
    let prd = null;
    let ind = -1;
    ProductSet.subItems.forEach((product, index) => {
      if (product.PrdId == item.PrdId && product.TksdQuantity > 0) {
        prd = product;
        ind = index;
        return prd;
      }
    });

    return { prd, ind };
  };
  renderProduct = ({ item, index }) => {
    let { lStyle,Config,ProductGroupList,CategorySelectedIndex } = this.state;
    let { isColor } = this.state;
    let width=lStyle.PnCenter.ItemWidth;
    let LeftWidth=lStyle.PnCenter.ItemWidth*0.6;
    let RightWidth=lStyle.PnCenter.ItemWidth*0.4;
    return ( 
      <TouchableHighlight style={{borderWidth:1, borderColor: colors.grey5, width:width,height: lStyle.PnCenter.ItemHeight,}}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: width, height: '100%' }}>
          <View style={{ backgroundColor:isColor == true ? "#333333" : "grey", width: LeftWidth, height: '100%' }}>
          <TouchableOpacity style={{}} onPress={() =>  this._ShowFullImage(item,true)}>
            <ImageBackground resizeMode="contain"
              source={item.PrdImageUrl ? {  uri:this.state.endpoint + "/Resources/Images/Product/" +  item.PrdImageUrl 
                } : require("../../assets/icons/ReliposEmenu_4x.png")
              }
              style={[{ width: '100%', height: '100%', backgroundColor: colors.grey1 }]} >
              {item.SttId && item.SttId == 3 ?
                <View style={{
                  position: "absolute", paddingTop: H1FontSize, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%'
                }}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_like.png')}
                    style={{ width: H1FontSize, height: H1FontSize, }} />
                </View>
                : null}
              {item.SttId && item.SttId == 2 ?
                <View style={{
                  position: "absolute", paddingTop: H1FontSize, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%'
                }}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_new.png')}
                    style={{ width: H1FontSize, height: H1FontSize, }} />
                </View>
                : null}
              <View style={{ position: "absolute", paddingTop: SCREEN_HEIGHT * 0.136 - ITEM_FONT_SIZE, right: -15 }}>
                <Icon  name="caretleft"  type="antdesign"  iconStyle={{ justifyContent: "space-between", color: "#FFFFFF", fontSize: 36 }} />
              </View>
            </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", flexWrap: "wrap", width:RightWidth, height: '100%', backgroundColor:isColor == true ? "#48515E" : "#EEEEEE" }}>
            <View style={{ flexDirection: "column",marginLeft:2,marginRight:2, flexWrap: "wrap", width: "100%"}}>
           
            {Config.B_ViewProductNo?
             <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%",height:lStyle.PnCenter.ItemHeight-(H3FontSize*1.2+5+H3FontSize )}}>
              <View style={{ height: H3FontSize*1.2, width: '100%',paddingTop:5}}>
                <Text style={{ color:isColor == true ? "#FFFFFF" : "#0d65cd", textAlign: 'center', width: '99%', fontSize: H3FontSize, fontFamily: "RobotoBold"  }} numberOfLines={5}>
                  {item.PrdNo} 
                </Text>
              </View> 
              <View style={{  width: '100%',paddingTop:5 }}>
                <Text style={{  color:isColor == true ? "#FFFFFF" : "#0d65cd",width: '99%',fontSize: H4FontSize,textAlign:'left', alignContent:'center', flexWrap: "wrap" }} numberOfLines={15}>
                  {item.PrdName}
                </Text>    
              </View> 
               </View>
              :
              <View style={{  width: '99%',textAlign:'left',paddingTop:10 }}>
                <Text style={{color:isColor == true ? "#FFFFFF" : "#000000", marginLeft:2,marginRight:2,fontSize: H4FontSize*1.1,textAlign: 'left', flexWrap: "wrap" ,fontWeight:'bold'}} numberOfLines={15}>
                  {item.PrdName}
                </Text>    
              </View> 
            }
              <View style={{ height: H3FontSize, width: '100%',marginTop:5 }}>
              <Text style={{ color: isColor == true ? "#FFFFFF" :"#000000",marginLeft:10, fontSize: H3FontSize * 0.8 ,fontStyle:'italic'}}>
                    {item.TksdPrice>0? this.translate.Get("Giá :")+' '+formatCurrency(item.TksdPrice, ""):''}
                  </Text>
              </View> 
            </View> 
            <View style={{ position: "absolute", bottom: 0, right: 0, width: RightWidth-10, height: H2FontSize*1.2,marginLeft:5,marginRight:5  }}>
              <View style={{ flexDirection: "row", justifyContent: 'space-evenly', width: RightWidth-10, height: H3FontSize*1.2 }}>
                  <View style={{ width: H2FontSize, height: H2FontSize*1.2,  justifyContent: 'center', alignItems: 'center',
                  }}>
                    {this._showQty(item) > 0 ?
                  <TouchableOpacity onPress={() => this._HandleQuantityDetail(item, -1, false)} > 
                    <Image resizeMode="stretch" source={require('../../assets/icons/IconDelete.png')}
                      style={{ width: H2FontSize , height: H2FontSize , }} />
                  </TouchableOpacity>
                  : null
                  }
                  </View>
                <View style={{ width:RightWidth-10-(H2FontSize*2), justifyContent: 'center', }}>
                  <Text style={{ color:isColor == true ? "#FFFFFF" : "#af3037", width: '100%', fontSize: H2FontSize*0.8 , textAlign: "center" }} >
                    {this._showQty(item)} 
                  </Text>
                </View> 
                <TouchableOpacity style={{}} onPress={() => this._HandleQuantityDetail(item, 1, false)}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/IconAdd.png')}
                    style={{ width: H2FontSize, height: H2FontSize }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  render() {
    const { ProductGroupList, ChoiceSet, CategorySelectedIndex, ProductSet, IsPostBack,lStyle,language } = this.state;
    const{isColor}= this.state;
    if (!IsPostBack) {
      return(
      <View style={{height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: "absolute",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isColor == true ? colors.white : "black",
        opacity: 0.5,
        bottom: 0,
        right: 0,
        zIndex: 99,
        }}>
        <ActivityIndicator color={isColor == true ? colors.blue : colors.primary} size="large"></ActivityIndicator>
      </View>
      );}
    let GridHeight=SCREEN_HEIGHT-Header.height;
  //  console.log('Header.state:'+JSON.stringify(this.state));
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {/* {!IsPostBack ?
          <View style={{height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            position: "absolute",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isColor == true ? colors.white : "black",
            opacity: 0.5,
            bottom: 0,
            right: 0,
            zIndex: 99,
            borderTopColor: colors.grey4,
            borderTopWidth: 1
            }}>
            <ActivityIndicator color={isColor == true ? colors.blue : colors.primary} size="large"></ActivityIndicator>
          </View>
          : null} */}
        <_Header name={'SetMenuView'} state={this.state} table={this.state.table}
          translate={this.translate} titleSet={ProductSet} setState={(state) => this.setState(state)}
          BookingsStyle={BookingsStyle} islockTable={false} backgroundColor="#333D4C"
          iheight={Header.height} language={language}   style={{height:Header.height}}  />
        <View style={styles.mainContainer}> 
          <View style={{ width: lStyle.PnLeft.width, height: GridHeight , backgroundColor:isColor == true ? "#444444" : '#FFFFFF',borderRightColor: colors.grey4, borderRightWidth: 0.5, borderRightRadius: 1 }}>
            <View name='pnGridDetail' style={{ flexDirection: 'column', width: "100%",  height: GridHeight-(H2FontSize*2+H2FontSize*2) }}>
            <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={ProductSet.subItems}
                  extraData={this.state.ProductSet}
                  renderItem={this.RenderRowDetail}
                  contentContainerStyle={{ backgroundColor: colors.white}}
                />
            </View> 
            <View style={{ height:H2FontSize+H2FontSize*1.5,backgroundColor:isColor == true ? "#333333" : colors.grey5, flexDirection: 'row', width: '100%',alignItems: "center", justifyContent: "center"}}>
            <View style={{ height:'100%', flexDirection: 'row', width: '98%',alignItems: "center", justifyContent: "center"}}>
                    <Text style={{ color:isColor == true ? "#FFFFFF" : '#000000', textAlign: 'left', fontSize: H3FontSize,width:'30%',marginLeft:5 }}> 
                      {this.translate.Get('Số lượng :')}
                    </Text>
                    <View style={{width:'10%'}}>
                    {ProductSet.OrddQuantity > 1 ?
                          <TouchableOpacity onPress={() => {this._HandleQuantity(-1) }} >
                            <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiam.png')}
                              style={{ width: H2FontSize, height:H2FontSize }} />
                          </TouchableOpacity>
                          :
                          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Image resizeMode="stretch"  size={H2FontSize}   source={require('../../assets/icons/v2/icon_btnGiamGrey.png')}
                              style={{ width: H2FontSize, height:H2FontSize}} />
                          </View>
                        }
                      </View>
                    <View style={{ flexDirection: 'row',marginLeft:5, alignItems: "center", justifyContent: "center", width: '47%',borderColor: colors.grey4, borderWidth: 1, height:H2FontSize*1.3}}>
                      <TextInput ref={input => this.textInput = input}
                        style={{  color:isColor == true ? "#FFFFFF" :  "#af3037",
                        fontSize: H2FontSize*0.8, width: '100%', textAlign: 'left', }}
                        autoFocus={false}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardAppearance="dark"
                        keyboardType='numeric'
                        autoCompleteType='off'
                        returnKeyType='done'
                        blurOnSubmit={true}
                        defaultValue={ProductSet.OrddQuantity ? ProductSet.OrddQuantity.toString() : ''}
                        Value={ProductSet.OrddQuantity>0 ? ProductSet.OrddQuantity.toString() : '' }
                        onBlur={()=>{
                          this._CaculatorMaster(ProductSet);
                        }}
                        onChangeText={(textInput) => {
                         ProductSet.OrddQuantity = textInput;
                          /*if(parseFloat(textInput)>0 )
                          ProductSet.OrddQuantity = textInput;
                          console.log('textInput'+textInput);
                          */
                      
                        }}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          if(parseFloat(ProductSet.OrddQuantity)<0 )
                          ProductSet.OrddQuantity=0;
                          this.setState({ ProductSet });
                          this._CaculatorMaster(ProductSet);
                        }}
                      />
                      </View>
                      <View style={{width:'10%',paddingLeft:5}}>
                      <TouchableOpacity onPress={() => { this._HandleQuantity(1) }}>
                          <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnTang.png')}
                            style={{ width: H2FontSize*1.2, height:H2FontSize*1.2}} />
                        </TouchableOpacity>
                        </View>
                   </View>  
            </View>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center',height: H2FontSize*2, borderColor: colors.white,  backgroundColor:isColor == true ? "#444444" : '#dc7d46', flexDirection: 'row' }}>
            <Text style={{ width:'49%',marginLeft:5, fontSize: H2FontSize, color: colors.white,fontWeight:'bold', }}>
                    {this.translate.Get('Tổng tiền')} :
                    </Text>
                    <Text style={{ width:'50%',fontSize: H2FontSize, color: colors.white,textAlign:'right',marginRight:5 }}>
                    {formatCurrency(this.state.ProductSet.TkdTotalAmount, '')}
                  </Text>
              </View>
          </View>
          <View style={{ width: lStyle.PnCenter.width, backgroundColor:isColor == true ? "#222222" :  '##FFFFFF' }}>
            <_ChoiceCategory  state={this.state} translate={this.translate} ProductGroupList={ProductGroupList}
              CategorySelectedIndex={CategorySelectedIndex}
              _ChoiceCategorySelect={(item, index) => this._ChoiceCategorySelect(item, index)}
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
              pnWidth={lStyle.pnChoiceCategory.Width}
              pnHeight={lStyle.pnChoiceCategory.Height}
              ItemWidth={lStyle.pnChoiceCategory.ItemWidth} /> 
            <FlatList data={ChoiceSet}  renderItem={this.renderProduct} numColumns={2}  extraData={this.state}  contentContainerStyle={{ paddingBottom: SCREEN_HEIGHT * 0.08 }} />
            <View style={[styles.navigationBar, { width:lStyle.PnCenter.width, backgroundColor:isColor == true ? "#222222" : colors.white, flexDirection: 'row',alignContent:'flex-end', height: lStyle.Bottonbar.Height }]}>
            <View style={{width:lStyle.PnCenter.width-lStyle.Bottonbar.Width*2}} />
                <TouchableOpacity onPress={() => this._Cancel()}>
                  <View style={[BookingsStyle.bottombar, {
                    borderColor: colors.white, borderTopRightRadius: 1, borderWidth: 1, width:lStyle.Bottonbar.Width,
                    color: "white", alignItems: 'center', justifyContent: 'center', backgroundColor: '#c00003', }]}>
                    <Text style={[styles.item_menu_order, { fontSize: H2FontSize }]} >
                      {this.translate.Get("Bỏ qua")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._AcceptHandle()} disabled={this.state.ProductSet.OrddQuantity == 0 || this.state.isShowMash}>
                  <View style={[BookingsStyle.bottombar, {
                    borderColor: colors.white, borderTopLeftRadius: 1, borderWidth: 1, width: lStyle.Bottonbar.Width,
                    color: "white", alignItems: 'center', justifyContent: 'center', backgroundColor: '#008bc5',
                  }]}>
                    <Text style={[styles.item_menu_order, { fontSize: H2FontSize }]} >
                      {this.translate.Get("Chấp nhận")}
                    </Text>
                  </View>
                </TouchableOpacity>
            </View>

          </View>
        </View>
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
        {this.state.isShowMash ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.red} size="large"></ActivityIndicator>
          </View>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  horizontal: {
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    backgroundColor: "#FFFFFF",
    // alignItems: 'center',
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    flex: 1
  },
  navigationBar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  mainContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    height: "92%",
    width: "100%"
  },
  item_Table: {
    color: '#008bc5',
    maxHeight: SCREEN_HEIGHT * 0.16,
  },
  left_menu_group: {
    paddingLeft: 12,
    height: ITEM_FONT_SIZE * 3.5,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center",
    backgroundColor: "#3275A1",
  },
  item_Search: {
    width: '90%',
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50,
  },
  item_language: {
    flexDirection: "row",
  },
  item_menu_order: {
    fontSize: ITEM_FONT_SIZE * 1.5,
    fontFamily: 'RobotoBold',
    textAlign: "center",
    color: "white",
  },
  item_menu_CurrentItem: {
    fontSize: ITEM_FONT_SIZE * 1.5,
    fontFamily: 'RobotoBold',
    textAlign: "center",
    color: "white",
    backgroundColor: "#008bc5",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#0176cd',
  },
  buttonText: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.2,
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE,
    fontFamily: 'RobotoBold'
  },
  button_end_left_order: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: BUTTON_FONT_SIZE * 0.25,
  },
  button_end_right_order: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: BUTTON_FONT_SIZE * 0.25,
  },
  item_text_center: {
    width: '50%',
    justifyContent: "center",
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
