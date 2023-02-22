import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, TouchableHighlight, ActivityIndicator, UIManager, StatusBar, ImageBackground, ScrollView, KeyboardAvoidingView, Keyboard, StyleSheet, Platform, Animated, Easing, Text, View, TextInput,Alert} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { Audio } from 'expo-av';
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import { Input, Button, Icon, CheckBox } from "react-native-elements";
import { setCustomText } from "react-native-global-props";
import { AntDesign } from "@expo/vector-icons";
import StepIndicator from 'react-native-step-indicator';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductDetails, CardDetailView, _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor,} from "../components";
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, H1_FONT_SIZE,H2_FONT_SIZE,H3_FONT_SIZE,H4_FONT_SIZE,} from "../config/constants";
import translate from "../services/translate";
import {SearchTaxInfor,FlushInvoiceInfor, CallServices, getinvoiceInfor } from "../services";
import { formatCurrency } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from "../components/Question";
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("window").height; //- Constants.statusBarHeight;
const Bordy = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
const pnLeft = { width: Bordy.width * 0.17, height: SCREEN_HEIGHT };
const Center = { width: Bordy.width - pnLeft.width, height: Bordy.height };
const Header = { width: Center.width, height: Bordy.height * 0.085 };

const Booton = { width: Center.width, height: Center.height * 0.07 };
const ProductList = {
  width: Center.width,
  height: Center.height - Header.height - Booton.height,
  ColumnNum: 2,
  RowNum: 3,
};

const labels = ["Thông tin đơn hàng","Xuất hóa đơn","Thanh toán"];
const customStyles = {
  stepIndicatorSize: H1_FONT_SIZE,
  currentStepIndicatorSize:H1_FONT_SIZE*1.3,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#333d4c',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#333d4c',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#333d4c',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#333d4c',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: H4_FONT_SIZE,
  stepIndicatorSize:H1_FONT_SIZE,
  currentStepIndicatorLabelFontSize: H4_FONT_SIZE,
  stepIndicatorLabelCurrentColor: '#333d4c',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: H3_FONT_SIZE,
  currentStepLabelColor: '#333d4c'
}
export default class Payment2 extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    this.state = {
      value :'',
      currentPosition: 1,
      showCall: false,
      isRenderProduct: true,
      selectedType: null,
      isPostBack: false,
      language: 1,
      call: 1,
      data: [],
      Tax:{
        Name:null,
        TaxCode:null,
        TkeCompany:null,
        Address:null,
        Email:null,
        Phone:null,
      },
      Ticket: {},
      table: {},
      settings: {},
      buttontext: props.defaultValue,
      endpoint: "",
      Config: {},
    };
    this.translate = new translate();
  }
  componentWillUnmount = async () => {
    clearInterval(this.interval);
  };
  componentDidMount = async () => {
    await this._setConfig();
    await this._getinvoiceInfor();
    this.setState({ isPostBack: true });
  };
  _setConfig = async () => {
    try{
      let Ticket = await _retrieveData('APP@BACKEND_Payment', JSON.stringify({}))
      Ticket=JSON.parse(Ticket);
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
    this.setState({endpoint,language,settings,Config,Ticket});
  }
  catch(ex){
    console.log('_setConfig Error :'+ex)
  }
    return true;
  };
  _getinvoiceInfor = async () => {
    let{Tax,Ticket} =  this.state;
    getinvoiceInfor(null, Ticket.TicketID, true).then(res => {
      console.log(res);
        Tax.TaxCode = res.Data.ReiTaxId;
        Tax.Name = res.Data.CustomerName;
        Tax.TkeCompany = res.Data.CompanyName;
        Tax.Address = res.Data.ReiAddress;
        Tax.Email = res.Data.ReiEmail;
        Tax.Phone = res.Data.ReiPhone;
        this.setState({Tax});
      })  
  }
  _SearchTaxInfor = async () => {
    let{Tax} =  this.state;
    SearchTaxInfor( Tax.TaxCode).then(res => {
      if(res.Status === 1){
        Tax.Name = res.Data.CustomerName;
        Tax.TkeCompany = res.Data.CompanyName;
        Tax.Address = res.Data.ReiAddress;
      }
      else {
        Tax.TaxCode = ''
        Tax.TkeCompany = '';
        Tax.Address = '';
      }
        this.setState({Tax});
      })  
  }
  _FlushInvoiceInfor = async () => {
    let{Ticket,Tax} =  this.state;
    let a = Ticket
    if (Tax.TaxCode === null || Tax.TaxCode === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Mã số thuế không được để trống')
    }else if(Tax.TkeCompany === null || Tax.TkeCompany === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Tên công ty không được để trống')
    }else if(Tax.Address === null || Tax.Address === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Địa chỉ không được để trống')
    }else if(Tax.Email === null || Tax.Email === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Email không được để trống')
    }else{
      FlushInvoiceInfor( Ticket.TicketID,Tax.TaxCode,Tax.Name, Tax.TkeCompany, Tax.Address, Tax.Email, Tax.Phone).then(res => {
      if(res.Status === 1){
        _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
          this.props.navigation.navigate('Payment3');
        });
      }
    }) 
    }
  }
  onCallServices= async() => {
    let { settings,table } = this.state;
    let user = await _retrieveData('APP@USER', JSON.stringify({ObjId:-1}));
      user = JSON.parse(user);
    await CallServices(settings.I_BranchID,table.TabId,table.TicketID,1,user.ObjId);
  }
  _onPlaybackStatusUpdate = playbackStatus => {
    if (!playbackStatus.isLoaded) {
     ;
    } else {
      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
      } else 
      {
        // Update your UI for the paused state
      }
      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }
      if (playbackStatus.didJustFinish) {
        this.setState({ showCall:false })
      }
    }
  };
  _LoadSound= async () => {
    try{
      let { sound} = this.state;
      if (sound==null) {
      sound= new Audio.Sound();
    await sound.loadAsync({uri:this.state.endpoint+ '/Resources/Sound/RingSton.mp3'});
    await sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
    this.setState({ sound})
    return sound;
      }
    }catch(ex){
      console.log('_LoadSound Error :'+ex)
      this.setState({ sound:null})
    }
    return null;
  }
  _HandleSound= async () => {
    let { sound } = this.state;
    try{
      if (sound==null) 
         sound = await this._LoadSound();
    if (sound==null)
         return;
      if (this.state.showCall) 
      {
        await sound.stopAsync();
        this.setState({ showCall: false });
        return;
      }  
      else {
        this.setState({ showCall: true });
        await  sound.setPositionAsync(0);
        await sound.playAsync();
        await  this.onCallServices(); 
   }
  }catch(ex){
    this.setState({ showCall:false })
   console.log('_HandleSound Error :'+ex)
  }
  }
  onPressBack = () => {
    this.props.navigation.navigate('Payment')
  };
  onPressNext = () => {
    let { Ticket} = this.state;
    let a = Ticket
    _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
          this.props.navigation.navigate('Payment3');
        });
  };
  onPressHome = async () => {
    _remove("APP@TABLE", () => {
      _remove("APP@CART", () => {
        _remove("APP@BACKEND_Payment", () => {
          this.props.navigation.navigate("TableView");
        });
      });
    });
};

  /**
   *
   * @param {*} ite
   * @param {*} ind
   * @param {*} type
   * @returns
   */
  render() {
    if (this.state.showCall==undefined||this.state.showCall==null) {
      this.state.showCall=false;
    }
    if (!this.state.isPostBack) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            onLayout={() => {
              this.setState({ isPostBack: false });
            }}
          />
        </View>
      );
    }
    const { } = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.Container}>
          <ScrollView>
          <View style={{ flexDirection: "row", height: SCREEN_HEIGHT * 0.1, width: SCREEN_WIDTH, backgroundColor:'#333d4c',alignItems:'center'}}>
            <TouchableOpacity onPress={this.onPressBack} style={{ justifyContent: "center", width:'7%',alignItems:'center'}}>
               <Image style={{height: "55%", width: "55%",}} resizeMode='contain' source={require("../../assets/icons/IconBack.png")}/>
            </TouchableOpacity>
            <View style={{width:'64%'}}>
              <Text style={{fontSize:H1_FONT_SIZE,fontFamily: "RobotoBold", textAlign: "center", color:'#fff'}}>Thông tin hóa đơn của bạn</Text>
            </View>
            <TouchableOpacity onPress={() => {this._HandleSound(); }} style={{ backgroundColor: '#fff', height: "60%", width: "22%", borderRadius: 25, }}>
            {this.state.showCall ?
              <View style={{backgroundColor:'#FF7E27',borderRadius: 50,height:'100%',justifyContent: "center", flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: "25%", alignItems:'center'}}>
                <Image style={{height: "70%", width: "70%"}} resizeMode='contain' source={require("../../assets/icons/IconCall-11.png")}/>
              </View>
              <Text style={{ color:'#333d4c',textAlign: "left", width: "75%", fontSize: H2_FONT_SIZE }}>Đang gọi ...</Text>
              </View>
              :
              <View style={{height:'100%',justifyContent: "center",borderRadius: 25, flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: "25%", alignItems:'center'}}>
                <Image style={{height: "70%", width: "70%"}} resizeMode='contain' source={require("../../assets/icons/IconCall-11.png")}/>
              </View>
              <Text style={{ color:'#333d4c',textAlign: "left", width: "75%", fontSize: H2_FONT_SIZE }}>Gọi nhân viên</Text>
              </View>
            }
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressHome} style={{ justifyContent: "center", width:'7%',alignItems:'center'}}>
              <Image style={{height: "55%", width: "55%",}} resizeMode='contain' source={require("../../assets/icons/IconHome-11.png")}/>
            </TouchableOpacity>
          </View>
          <View style={{ height: SCREEN_HEIGHT * 0.67, width: SCREEN_WIDTH * 0.95, marginHorizontal: "2.5%"}}>
            <View style={{ height: "74%", marginLeft: "2%",}}>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center"}}>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "50%" }}>Mã số thuế:</Text>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "50%" }}>Người nhận:</Text>
              </View>
              <View style={{ height: "11%", flexDirection: "row"}}>
                <TextInput 
                  value={this.state.Tax.TaxCode}
                  onBlur={this._SearchTaxInfor}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , TaxCode : item}, }) } 
                  keyboardType="number-pad" 
                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "48%", marginRight: "2%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
                <TextInput 
                  value={this.state.Tax.Name}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Name : item}, }) } 
                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "48%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1 }}>
                </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%' }}>
                <Text style={{ fontSize: H3_FONT_SIZE }}>Tên công ty:</Text>
              </View>
              <View style={{ height: "21%", flexDirection: "row"}}>
                <TextInput 
                  value={this.state.Tax.TkeCompany}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , TkeCompany : item}, }) }  
                  multiline={true} 
                  numberOfLines={10} 
                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "98%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%'}}>
                <Text style={{ fontSize: H3_FONT_SIZE }}>Địa chỉ:</Text>
              </View>
              <View style={{ height: "21%", flexDirection: "row"}}>
                <TextInput 
                value={this.state.Tax.Address}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Address : item}, }) }
                multiline={true} 
                numberOfLines={10} 
                style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "98%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
              </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%'}}>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "50%", height: "100%",}}>Email:</Text>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "50%" }}>SĐT:</Text>
              </View>
              <View style={{ height: "11%", flexDirection: "row"}}>
                <TextInput
                value={this.state.Tax.Email}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Email : item}, }) } 
                keyboardType="email-address" 
                style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "48%", marginRight: "2%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
                <TextInput 
                value={this.state.Tax.Phone}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Phone : item}, }) } 
                keyboardType="phone-pad" 
                style={{ paddingHorizontal:8,fontSize:H3_FONT_SIZE,width: "48%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
              </View>
            </View>
            <View style={{  backgroundColor: "#FFCCCC", opacity: 0.8, borderWidth: 1, borderColor: "#FF3333", width: "96%", marginHorizontal: "2%", paddingLeft: 5, paddingTop: 5,}} >
              <Text style={{fontSize: H3_FONT_SIZE }}>• Quý Khách vui lòng cung cấp thông tin xuất hóa đơn tài chính ngay tại thời điểm thanh toán.</Text>
              <Text style={{fontSize: H3_FONT_SIZE }}>• Trường hợp Quý khách không cung cấp thông tin xuất hóa đơn tài chính tại thời điểm thanh toán:</Text>
              <Text style={{ fontSize: H4_FONT_SIZE, paddingLeft: 8,}}>• Công ty sẽ xuất hóa đơn KHÁCH LẺ</Text>
              <Text style={{ fontSize: H4_FONT_SIZE, paddingLeft: 8 }}>• Công ty KHÔNG xuất lại hóa đơn trong mọi trường hợp sau khi xuất hóa đơn KHÁCH LẺ trên đây</Text>
              <Text style={{ fontSize: H2_FONT_SIZE}}>Xin cảm ơn quý khách</Text>
            </View>
          </View>
          <View style={{ height: SCREEN_HEIGHT * 0.23, width: SCREEN_WIDTH, justifyContent: "center", alignItems: "center"}}>
            <View style={{ height: "30%", justifyContent: "center", alignItems: "center"}}>
              <Text style={{ fontSize: H2_FONT_SIZE }}>Chọn bỏ qua nếu bạn không xuất hóa đơn VAT</Text>
            </View>
            <View style={{ height: "30%", flexDirection: "row" }}>
              <TouchableOpacity
                onPress={()=>this.onPressNext()}
                style={{ backgroundColor: "#DDDDDD", height: "75%", width: "22%",borderRadius:35,marginRight:'2%', justifyContent: "center", alignItems: "center"}}>
                <Text style={{ textAlign: "center", width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2,}}>Bỏ qua</Text>
              </TouchableOpacity>
              <LinearGradient
              colors={[ '#333d4c', '#333d4c']}
              start={{ x: 0, y: 0 }}
              end={{ x:0, y: 1 }}
              style={{ borderWidth: 1,height: '75%',borderRadius:35,width:'22%',shadowColor: "#000"}}>
            <TouchableOpacity onPress={()=>this._FlushInvoiceInfor()} style={{  height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
              <Text style={{ textAlign: "center",color:'#FFFFFF', width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2}}>Xác nhận</Text>
            </TouchableOpacity>
            </LinearGradient>
            </View>
            <View style={{height:'40%', width: SCREEN_WIDTH, justifyContent:'center'}}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={3}
              currentPosition={1}
              labels={labels}/>
            </View>
          </View>
          </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  pnbody: {
    // backgroundColor: "#E3E3E3",
    // alignItems: 'center',
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    flex: 1,
  },
  Container: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: "center",
  },

  pnLeft: {
    flexDirection: "column",
    height: "94%",
  },
  horizontal: {
    justifyContent: "space-around",
    padding: 10,
  },
  BottonMenu: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    right: 0,
    paddingTop: 5,
    paddingLeft: 2,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
  },
  left_menu_group_item: {
    paddingLeft: 12,
    color: colors.grey2,
  },
  left_menu_group_item: {
    borderColor: colors.grey3,
    borderRadius: 1,
    justifyContent: "center",
    color: colors.grey2,
    paddingLeft: 16,
    height: ITEM_FONT_SIZE * 3,
  },
  item_Search: {
    width: "90%",
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
    paddingTop: SCREEN_HEIGHT * 0.045 - ITEM_FONT_SIZE - 5,
    fontSize: ITEM_FONT_SIZE * 1.3,
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    backgroundColor: "#CC6300",
    justifyContent: "center",
    alignItems: "center",
  },
  item_menu_cart: {
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#0176cd",
  },
  buttontext: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.2,
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE,
    fontFamily: "RobotoBold",
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
    borderTopWidth: 1,
  },
  btnNormal: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    height: 30,
    width: 100,
  },
  btnPress: {
    borderColor: 'blue',
    borderWidth: 1,
    height: 30,
    width: 100,
  }
});
