import React, { Component } from "react";
import { TouchableOpacity, Dimensions, Image, TouchableHighlight, ActivityIndicator, UIManager, StatusBar, ImageBackground, ScrollView, KeyboardAvoidingView, Keyboard, StyleSheet, Platform, Animated, Easing, Text, View, TextInput,} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import { Input, Button, Icon, CheckBox } from "react-native-elements";
import { setCustomText } from "react-native-global-props";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import StepIndicator from 'react-native-step-indicator';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductDetails, CardDetailView, _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor,} from "../components";
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE,H1_FONT_SIZE,H2_FONT_SIZE,H3_FONT_SIZE,H4_FONT_SIZE,} from "../config/constants";
import translate from "../services/translate";
import {HandleTip, getPaymentAmount, getMasterData, GetViewGroup, GetPrdChildGroups, getProductByGroup, getTicketInfor, sendOrder, CheckAndGetOrder, SetMenu_getChoiceCategory, getByChoiceId, CancelOrder, CallServices,} from "../services";
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
export default class Payment extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    this.state = {
      mod : 0,
      PaymentAmount:0,
      SumVoucher:0,
      Money:{},
      TicketDetail: [],
      TicketPayment: [],
      IsLoaded:false,
      IsInvoiceTip:false,
      sound:null,
      value:0,
      value2:0,
      currentPosition: 0,
      selectedAreaIndex: -1,
      showCall: false,
      isPostBack: false,
      language: 1,
      Ticket: {},
      table: {},
      settings: {},
      buttontext: props.defaultValue,
      endpoint: "",
      Config: {},
    };
    this.translate = new translate();
  }
  onPressBack = () => {
    this.props.navigation.navigate('OrderView')
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
  _getMasterData = async () => {
    let {Config,TicketDetail,Money,TicketPayment,SumVoucher,Ticket} = this.state;
    getMasterData( Ticket.TicketID, Config, '').then(res => {
      if ("TicketDetail" in res.Data)
      TicketDetail = res.Data.TicketDetail
      if ("TicketInfor" in res.Data){
        Money = res.Data.TicketInfor[0];
        if(Money.TkeIsInvoiceTip === undefined || Money.TkeIsInvoiceTip === null)
        Money.TkeIsInvoiceTip = false ;
      }
      if ("TicketPayment" in res.Data){
      TicketPayment = res.Data.TicketPayment;
      SumVoucher = TicketPayment.reduce((a,v) => {if (v.PaymentName === "VOUCHER"){return a + v.TkpAmount ;} return a;},0)
      }
      this.setState({ TicketDetail,Money,TicketPayment,SumVoucher,});
    })
  }
  _getPaymentAmount = async () => {
    let {PaymentAmount,mod, Ticket} = this.state;
    getPaymentAmount( Ticket.TicketID , '').then(res => {
      PaymentAmount = res.Data;
      if (PaymentAmount % 1000 != 0) {
      mod = 1000 - PaymentAmount % 1000
      }this.setState({ PaymentAmount, mod})
      })  
    }
  _HandleTip = async () => {
    let { Ticket,Money} = this.state;
    let totalTip = parseFloat(this.state.Money.TkTipAmount) + parseFloat(this.state.value)
    let a = Ticket;
    HandleTip( Ticket.TicketID , totalTip, Money.TkeIsInvoiceTip).then(res => {
      this.setState({IsLoaded:true });
      if (res.Status === 1){
        _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
          this.props.navigation.navigate('Payment2');
        });
      }
      else{
        Alert.alert(this.translate.Get("Thông báo"),'Lỗi hệ thống !')
      }
      })
  }
  renderOrdered= ({ item, Index }) => {
    const { BookingsStyle } = this.props;
      return (
        <View style={{ width: '100%', flexDirection: "row"}}>
            <Text style={{fontSize:H3_FONT_SIZE,width:'5%'}}>{item.TkdQuantity} x </Text>
            <Text style={{fontSize:H3_FONT_SIZE,width:'80%'}}>{item.PrdName}</Text>
            <Text style={{fontSize:H3_FONT_SIZE, textAlign:'right',width:'15%',paddingRight:'1%'}}>{formatCurrency(item.TkdItemAmount,"")}</Text>
          </View>
      ); 
  };
  onCallServices= async() => {
    let { settings,table } = this.state;
    let user = await _retrieveData('APP@USER', JSON.stringify({ObjId:-1}));
      user = JSON.parse(user);
    await CallServices(settings.I_BranchID,table.TabId,table.TicketID,1,user.ObjId);
  }
  componentWillUnmount= async () => 
  {
    let { sound} = this.state;
    if (sound!=null) {
      await sound.unloadAsync();
        this.setState({sound:null})
    }
  }
  componentDidMount = async () => {
    this.setState({IsLoaded:true ,KeyCode:''});
    await this._LoadSound();
    this.setState({IsLoaded:true });
    await this._setConfig();
    await this._getMasterData();
    await this._getPaymentAmount();
      this.setState({ isPostBack: true });
}
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
    console.log(SCREEN_HEIGHT)
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
    if (!this.state.IsLoaded) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      );
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
    const { showCall,Money} = this.state;
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.Container}>
          <View style={{ flexDirection: "row", height: SCREEN_HEIGHT * 0.1, width: SCREEN_WIDTH, backgroundColor:'#333d4c',alignItems:'center'}}>
            <TouchableOpacity onPress={this.onPressBack} style={{ justifyContent: "center", width:'7%',alignItems:'center'}}>
               <Image style={{height: "55%", width: "55%",}} resizeMode='contain' source={require("../../assets/icons/IconBack.png")}/>
            </TouchableOpacity>
            <View style={{width:'64%'}}>
              <Text style={{fontSize:H1_FONT_SIZE,fontFamily: "RobotoBold", textAlign: "center", color:'#fff'}}>Thông tin đơn hàng</Text>
            </View>
            <TouchableOpacity onPress={() => {this._HandleSound(); }} style={{ backgroundColor: '#fff', height: "60%", width: "22%", borderRadius: 25, }}>
            {showCall ?
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
          <View style={{height: SCREEN_HEIGHT * 0.72, width: SCREEN_WIDTH ,  flexDirection: "row",shadowOffset: {width: 0,height: 5},shadowOpacity: 0.10,shadowRadius: 5,elevation: 6}}>
          <View style={{ width: "70%", height: "100%",}}>
            <View style={{ height: "80%", width: "100%", backgroundColor:"#fff",paddingHorizontal:'1.5%',paddingVertical:'1.5%'}}>
            <FlatList
              keyExtractor={(item, Index) => Index.toString()}
              data={this.state.TicketDetail }
              renderItem={this.renderOrdered}
            /> 
            </View>
            <View style={{ height: "20%", width: "100%",shadowColor: "#000",backgroundColor:'#fff', shadowOffset: {width: 0,height: -5},shadowOpacity: 0.10,shadowRadius: 5,elevation: 6 ,paddingHorizontal:'2%',}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:'0.5%'}}>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{ fontSize: H3_FONT_SIZE }}>Thành tiền:</Text>
                  <Text style={{ fontSize: H3_FONT_SIZE }}>{formatCurrency(Money.TkItemAmout,"")}</Text>
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{ fontSize: H3_FONT_SIZE  ,textAlign:'left'}}>Voucher:</Text>
                  <Text style={{ fontSize: H3_FONT_SIZE , textAlign:'right'}}>{formatCurrency(this.state.SumVoucher,"")}</Text>
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{ fontSize: H3_FONT_SIZE ,textAlign:'left'}}>Giảm giá:</Text>
                  <Text style={{ fontSize: H3_FONT_SIZE , textAlign:'right'}}>{formatCurrency(Money.TkTotalDiscount,"")}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:'0.5%'}}>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{ fontSize: H3_FONT_SIZE}}>VAT ({formatCurrency(Money.TkVatPercent,"%")}):</Text>
                  <Text style={{ fontSize: H3_FONT_SIZE }}>{formatCurrency(Money.TkVatTotalAmount,"")}</Text>
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{ fontSize: H3_FONT_SIZE ,textAlign:'left'}}>Tip:</Text>
                  <Text style={{ fontSize: H3_FONT_SIZE , textAlign:'right'}}>{formatCurrency(parseFloat(Money.TkTipAmount) + parseFloat(this.state.value) , '')}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingVertical:'0.5%'}}>
                <Text style={{ fontSize: H2_FONT_SIZE, textAlign: "center", justifyContent: "flex-start",fontFamily:'RobotoBold',}}>Tổng tiền cần thanh toán</Text>
                <Text style={{ fontSize: H2_FONT_SIZE, textAlign: "center", justifyContent: "flex-end", color: "#CC0000",fontFamily:'RobotoBold',}}>{formatCurrency(parseFloat(this.state.PaymentAmount)+ parseFloat(this.state.value),"")}</Text>
              </View>
            </View>
          </View> 
          <View style={{ width: "30%", height: "100%", backgroundColor:'#fff', shadowOffset: {width: -5,height: 0},shadowOpacity: 0.1,shadowRadius: 5,elevation:6}}>
            <View style={{ height: "100%", width: "100%",}}>
              <View style={{ height: "10%", width: "100%", flexDirection: "row",justifyContent:'center',alignItems:'center'}}>
                <Image style={{height: "60%", width: "12%",marginRight:'2%'}} resizeMode='contain' source={require("../../assets/icons/IconTIP-11.png")}/>
                <Text style={{ fontSize: H2_FONT_SIZE, color:'#333d4c'}}>Tip thêm cho nhà hàng</Text>
              </View>
              <View style={{ height: "20%", width: "100%", flexDirection: "row",justifyContent:'center',}}>
                <TouchableOpacity onPress={()=> this.setState({value: parseFloat(this.state.value) + (parseFloat(this.state.mod))})} style={styles.tip}>
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.value2 = (parseFloat(this.state.PaymentAmount)) + (parseFloat(this.state.mod)),"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center" ,justifyContent:'center'}}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>+ {formatCurrency(this.state.mod,"")}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.setState({value: parseFloat(this.state.value) + 10000})} style={styles.tip} >
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.value2 = (parseFloat(this.state.PaymentAmount)) + 10000 + (parseFloat(this.state.value)),"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center" ,justifyContent:'center'}}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>{formatCurrency("+ 10000","")}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ height: "20%", width: "100%", flexDirection: "row",justifyContent:'center'}}>
              <TouchableOpacity onPress={()=> this.setState({value: parseFloat(this.state.value) + 20000})} style={styles.tip} >
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.value2 = (parseFloat(this.state.PaymentAmount)) + 20000 + (parseFloat(this.state.value)),"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center",justifyContent:'center' }}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>{formatCurrency("+ 20000","")}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.setState({value: parseFloat(this.state.value) + 50000})} style={styles.tip} >
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.value2 = (parseFloat(this.state.PaymentAmount)) + 50000 + (parseFloat(this.state.value)),"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center" ,justifyContent:'center'}}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>{formatCurrency("+ 50000","")}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ height: "20%", width: "100%", flexDirection: "row",justifyContent:'center'}}>
              <TouchableOpacity onPress={()=> this.setState({value: parseFloat(this.state.value) + 100000})} style={styles.tip} >
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.value2 = (parseFloat(this.state.PaymentAmount)) + 100000 + (parseFloat(this.state.value)),"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center",justifyContent:'center' }}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>{formatCurrency("+ 100000","")}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.setState({value : 0})} style={styles.tip} >
                  <View style={styles.tipView}>
                    <Text style={{ fontSize: H4_FONT_SIZE, color: '#008800' }}>Tổng: {formatCurrency(this.state.PaymentAmount,"")}</Text>
                  </View>
                  <View style={{height: "65%", alignItems: "center" ,justifyContent:'center'}}>
                    <Text style={{ fontSize: H4_FONT_SIZE,}}>Tiền tip</Text>
                    <Text style={{ fontSize: H3_FONT_SIZE, }}>Không tip</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ height: "10%", width: "100%", alignItems:'center',justifyContent:'center'}}>
                <TextInput
                  placeholder="Nhập số tiền tip (đ)"
                  keyboardType="number-pad"
                  value={this.state.value}
                  onChangeText={(number) => this.setState({value : number}) }
                  style={[{paddingHorizontal:8,fontSize: H3_FONT_SIZE, borderRadius: 8, borderWidth: 1,backgroundColor:'#FFFFFF', borderColor: colors.grey3, height: 40, width: "95%"}]}>
                </TextInput>
                <View style={{position: 'absolute', right: '5%', top: '22%', backgroundColor: "transpanent", zIndex: 10,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end',}}>
                  <TouchableOpacity onPress={()=> this.setState({value : 0})} style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: 5 }}>
                    <AntDesign name='closecircle' size={ITEM_FONT_SIZE*1.2} color={colors.red2} ></AntDesign>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height: "7%", width: "100%",justifyContent:'center' }}>
                <Text style={{marginLeft:'2%', color: "#CC0000", fontSize: H4_FONT_SIZE}}>Tip có xuất hóa đơn hay không</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row",justifyContent:'center'}}>
                <CheckBox checked={Money.TkeIsInvoiceTip ? true : false} onPress={()=> {this.setState({Money: {...Money, TkeIsInvoiceTip : Money.TkeIsInvoiceTip ? false : true}})}} containerStyle={{width:'45%', backgroundColor:'#fff'}} title="Có"/>
                <CheckBox checked={Money.TkeIsInvoiceTip ? false : true} onPress={()=> {this.setState({Money: {...Money, TkeIsInvoiceTip : Money.TkeIsInvoiceTip ? false : true}})}} containerStyle={{width:'45%', backgroundColor:'#fff'}}  title="Không"/>
              </View>
            </View>
          </View>
        </View>
          <View style={{ height: SCREEN_HEIGHT * 0.18, width: SCREEN_WIDTH, alignItems: "center"}}>
          <LinearGradient
              colors={[ '#333d4c', '#333d4c']}
              start={{ x: 0, y: 0 }}
              end={{ x:0, y: 1 }}
              style={{marginTop: 15, borderWidth: 1, height: '30%',borderRadius:35,width:'20%'}}>
            <TouchableOpacity onPress={()=> this._HandleTip ()} style={{  height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
              <Text style={{ textAlign: "center",color:'#FFFFFF', width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2}}>Xác nhận</Text>
            </TouchableOpacity>
            </LinearGradient>
            <View style={{height:'70%', width: SCREEN_WIDTH, justifyContent:'center'}}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={3}
              currentPosition={0}
              labels={labels}/>
            </View>
          </View>
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
  tip:{
    borderRadius: 8,
    borderWidth: 2, 
    borderColor: "#CCCCCC", 
    width: "46%", 
    height: "90%", 
    marginHorizontal: "2%", 
    backgroundColor: "#FFFFFF"
  },
  tipView: {
    borderBottomWidth: 2, 
    borderBottomColor: "#CCCCCC", 
    height: "35%", 
    alignItems: "center", 
    justifyContent: "center"
  },
  pnLeft: {
    flexDirection: "column",
    height: "94%",
  },
  horizontal: {
    justifyContent: "space-around",
    padding: 10,
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
});
