import React, { Component } from "react";
import { AppState,TouchableOpacity, Dimensions, Image, ActivityIndicator, UIManager,  KeyboardAvoidingView, StyleSheet, Platform, Text, View, TextInput,Alert} from "react-native";
import Constants from "expo-constants";
import Modal from "react-native-modal";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { FlatList } from "react-native";
import StepIndicator from 'react-native-step-indicator';
import { ScannerQR, ScannerQRVip, _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor,} from "../components";
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, H1_FONT_SIZE,H2_FONT_SIZE,H3_FONT_SIZE,H4_FONT_SIZE,H5_FONT_SIZE} from "../config/constants";
import translate from "../services/translate";
import {getVipCardInfor,getQrCode,ApplyVipCard,ApplyVoucher,API_Print,getLinkQrBank,getPaymentAmount,getMasterData,CancelOrder} from "../services";
import { formatCurrency } from "../services/util";
import colors from "../config/colors";
import Question from "../components/Question";
import { ScrollView } from "react-native";
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("window").height; //- Constants.statusBarHeight;
const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
const pnLeft = { width: Bordy.width * 0.17, height: SCREEN_HEIGHT };
const Center = { width: Bordy.width - pnLeft.width, height: Bordy.height };
const Header = { width: Center.width, height: Bordy.height * 0.085 };
const Booton = { width: Center.width, height: Center.height * 0.07 };
export default class Payment3 extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    this.translate = new translate();
    this.state = {
      appState: AppState.currentState,
      isColor:false,
      QRData:'',
      NameE_wallet:'',
      linkQrBank:'',
      PaymentAmount:0,
      Money:{},
      Barcode:'',
      Vip:{
        Name:'',
        SDT:'',
        date:'',
        cardNo:'',
        point:'',
        rank:'',
      },
      TicketDetail: [],
      TicketPayment: [],
      Voucher: '',
      showCall: false,
      isPostBack: false,
      language: 1,
      call: 1,
      data: [],
      Ticket: {},
      table: {},
      lockTable:false,
      notification:false,
      settings: {},
      buttontext: props.defaultValue, 
      Description:'',
      modPayment:'',
      ModalCallStaff: false,
      isShowBarCode: false,
      isShowBarCodeVip: false,
      isShowScanner: false,
      isShowFormCard: false,
      isShowCash: true,
      isShowCard: false,
      isShowE_wallet: false,
      isShowVip: false,
      isShowBanking: false, 
      endpoint: "", 
      Config: {},
    };
    
  }
  componentWillUnmount = async () => {
    this.appStateSubscription.remove();
    clearInterval(this.interval);
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
    let user = await _retrieveData('APP@USER', JSON.stringify({ObjId:-1}));
    if (user!='{}') 
    user = JSON.parse(user);
    this.setState({endpoint,language,settings,Config,Ticket,user});
  }
  catch(ex){
    console.log('_setConfig Error :'+ex)
  }
    return true;
  };
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
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    await this._setConfig();
    await this._getMasterData();
    await this._getPaymentAmount();
    this.setState({ isPostBack: true ,isColor,modPayment: this.translate.Get('Tiền mặt')});
    }
    catch (ex) {
      this.setState({ isPostBack: true,});
      console.log('Payment3 componentDidMount Error:' + ex);
    }
  };
  _CancelOrder = async() => {
    let{appState,Ticket}= this.state;
    if(appState == 'background'){
      await CancelOrder(Ticket.OrderId);
    }
  }
  _getPaymentAmount= async () => {
    let {PaymentAmount,Ticket} = this.state;
    getPaymentAmount( Ticket.TicketID , '').then(res => {
      PaymentAmount = res.Data;
      this.setState({ PaymentAmount})
      }).catch((error) => {
        Alert.alert(this.translate.Get('Thông báo'),this.translate.Get('Lỗi hệ thống !'),
        [
          {
            text: "OK", onPress: () => {
              this.setState({PaymentAmount:0 });
            }
          }
        ])
  })
  }
  _getLinkQrBank = async () => {
    let{linkQrBank, Ticket} =  this.state;
    getLinkQrBank( Ticket.TicketID , '').then(res => {
      linkQrBank = res.Data;
      if(linkQrBank === null || linkQrBank === ''){
        Alert.alert(this.translate.Get("Thông báo"),'Vui lòng liên hệ nhà cung cấp')
      }
      else{
        this.setState({ linkQrBank})
      }
      }).catch((error) => {
        Question.alert( 'System Error',error, [
          {
            text: "OK", onPress: () => {
            }
          }
        ]);
      });
  }
  _getQrCode = async () => {
    let{QRData,Ticket,NameE_wallet} =  this.state;
    getQrCode( Ticket.TicketID , NameE_wallet).then(res => {
      QRData = res.Data;
      if (QRData === '' || QRData === null){
        Alert.alert(this.translate.Get("Thông báo"), 'Vui lòng liên hệ nhà cung cấp', [
          {text: this.translate.Get("AlertOK")},
        ]);
      }
      this.setState({QRData, NameE_wallet});
      }).catch((error) => {
        Question.alert( 'System Error',error, [
          {
            text: "OK", onPress: () => {
            }
          }
        ]);
      });
  }
  _getQrCodeVNPAY = async () => {
    let{QRData,Ticket,NameE_wallet} =  this.state;
    getQrCode( Ticket.TicketID , NameE_wallet).then(res => {
      QRData = res.Data;
      if (QRData === '' || QRData === null){
        Alert.alert(this.translate.Get("Thông báo"), 'Vui lòng liên hệ nhà cung cấp', [
          {text: this.translate.Get("AlertOK")},
        ]);
      }
      this.setState({QRData, NameE_wallet});
      }).catch((error) => {
        Question.alert( 'System Error',error, [
          {
            text: "OK", onPress: () => {
            }
          }
        ]);
      });  
  }
  _ApplyVoucher = async (QrCode) => {
    let{settings,Ticket} = this.state;
    ApplyVoucher (Ticket.TicketID, settings, QrCode ).then(res => {
      if (res.status == 1){
        this.setState({isShowBarCode:false});
        this._getMasterData();
        this._getPaymentAmount();
      }
      else{
        this.setState({isShowBarCode:false});
        this._getMasterData();
        this._getPaymentAmount();
      }
    }).catch((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    });  
  }
  _ApplyVipCard = async (QRCodeString) => {
    let{Ticket,Vip} = this.state;
    ApplyVipCard (Ticket.TicketID,  QRCodeString ).then(res => {
      if (res.Status == 1){
        Vip.Name = res.Data.Table[0].ObjName;
        Vip.SDT = res.Data.Table[0].ObjPhone;
        Vip.date = res.Data.Table[0].ObjBirthDay;
        Vip.cardNo = QRCodeString;
        Vip.point = res.Data.Table[0].VicPointCurrent - res.Data.Table[0].VctPointNorm ;
        Vip.rank = res.Data.Table[0].VctName;
        this.setState({isShowBarCodeVip:false,Vip});
        this.componentDidMount();
      }
      else{
        this.setState({isShowBarCodeVip:false});
        this.componentDidMount();
      }
    }).catch((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    });  
  }
  //Thông tin phiếu
  _getMasterData = async () => {
    try{
    let {Config,TicketDetail,Money,TicketPayment,SumVoucher,Ticket} = this.state;
    getMasterData( Ticket.TicketID, Config, '').then(res => {
      if ("TicketDetail" in res.Data)
      TicketDetail = res.Data.TicketDetail
      if ("TicketInfor" in res.Data)
      Money = res.Data.TicketInfor[0];
      if ("TicketPayment" in res.Data){
      TicketPayment = res.Data.TicketPayment;
      SumVoucher = TicketPayment.reduce((a,v) => {if (v.PaymentName === "VOUCHER"){return a + v.TkpAmount ;} return a;},0)
      }
      this.setState({ TicketDetail,Money,TicketPayment,SumVoucher});
    })}catch{((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    })};
  }
  _RemoveVoucher = async () => {
    Alert.alert(this.translate.Get("Thông báo"), 'Bạn có chắc muốn xóa Voucher', [
      {
        text: this.translate.Get("BỎ QUA"),
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: this.translate.Get("AlertOK"), onPress: () => console.log('OK Pressed')},
    ]);
  }
  //Danh sách món 
  renderOrdered= ({ item, Index }) => {
      return (
        <View style={{ width: '100%', flexDirection: "row"}}>
            <Text style={{color:this.state.isColor == true ? '#ffffff' : '000000',fontSize:H3_FONT_SIZE,width:'5%'}}>{item.TkdQuantity} x </Text>
            <Text style={{color:this.state.isColor == true ? '#ffffff' : '000000',fontSize:H3_FONT_SIZE,width:'80%'}}>{item.PrdName}</Text>
            <Text style={{color:this.state.isColor == true ? '#ffffff' : '000000',fontSize:H3_FONT_SIZE, textAlign:'right',width:'15%',paddingRight:'1%'}}>{formatCurrency(item.TkdItemAmount,"")}</Text>
          </View>
      ); 
  };
  onPressBack = () => {
    let {lockTable} = this.state;
    this.props.navigation.navigate('Payment2',{lockTable})
  };
  _closeScanner= async () => {
  this.setState({isShowBarCodeVip : false, isShowBarCode : false});
  }
  _isShowBarCode = async (item) => {
    this.setState({ isShowBarCode : true ,modPayment:item})
  }
  _isShowBarCodeVip = async () => {
    this.setState({ isShowBarCodeVip : true })
  }
  _ShowATM = async (item) => {
    this.setState({ isShowCard: true ,isShowE_wallet: false ,isShowCash:false, isShowVip:false,isShowBanking:false ,modPayment:item});
  }
  _ShowVip = async (item) => {
    let {Money,Vip} = this.state
    if(Money.RpcNo !== undefined && Money.RpcNo !== null && Money.RpcNo !== '')
    {
      getVipCardInfor( Money.RpcNo).then(res => {
        Vip.Name = res.Data.Table[0].ObjName;
        Vip.SDT = res.Data.Table[0].ObjPhone;
        Vip.date = res.Data.Table[0].ObjBirthDay;
        Vip.cardNo = res.Data.Table[0].RpcNo;
        Vip.point = res.Data.Table[0].VicPointCurrent - res.Data.Table[0].VctPointNorm;
        Vip.rank = res.Data.Table[0].VctName;
        this.setState({Vip })
    }).catch((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    });
    }
    this.setState({ isShowCard: false ,isShowE_wallet: false ,isShowCash:false, isShowVip:true,isShowBanking:false,modPayment:item });

  }
  _ShowBanking = async (item) => {
    this.setState({ isShowCard: false ,isShowE_wallet: false ,isShowCash:false, isShowVip:false,isShowBanking:true ,modPayment:item});
    this._getLinkQrBank();
  }
  _ShowE_wallet = async (item) => {
    this.setState({ isShowCard: false ,isShowE_wallet: true ,isShowCash:false, isShowVip:false,isShowBanking:false,modPayment:item});
    this._getQrCode(this.state.NameE_wallet = 'MOMO')
  }
  _ShowTM = async (item) => {
    this.setState({ isShowCard: false ,isShowE_wallet: false ,isShowCash:true, isShowVip:false,isShowBanking:false,modPayment:item });
  }
  onPressHome = async () => {
    this.props.navigation.navigate("OrderView");
};
  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('lockTable', state.lockTable) != state.lockTable) {
      return {
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  onPressNext = async () => {
    let {lockTable,Ticket } = this.state;
    await CancelOrder(Ticket.OrderId);
    if (lockTable === true) {
      this.props.navigation.navigate("LogoutView", { lockTable , notification : true});
    }else{
      this.props.navigation.navigate("LogoutView", { lockTable , notification : true});
    }
  }
  /**
   * Xác nhận thanh toán in qua Services
   * typeView == 1 (Yêu cầu thanh toán)
   * typeView == 2 (Gọi nhân viên)
   */
  _AcceptPayment = async (Description,typeView) => {
    try{
    let{Ticket,user,ModalCallStaff} = this.state;
    this.setState({ isPostBack: false});
    if(typeView == 1){
      API_Print (user.BranchId, Ticket.TicketID,typeView, Description).then(res => {
        this.setState({ isPostBack: true});
        if (res.Status == 1){
         this.onPressNext();
        }
        else{
          Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
            {
              text: "OK", onPress: () => {
                this.setState({ isPostBack: true});
              }
            }
          ]);
        }
      }).catch((error) => {
        this.setState({ isPostBack: true});
        Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
          {
            text: "OK", onPress: () => {
              this.setState({ isPostBack: true});
            }
          }
        ]);
    })}
    else{
      API_Print (user.BranchId, Ticket.TicketID,typeView, Description).then(res => {
        if (res.Status == 1){
          this.setModalCallStaff(!ModalCallStaff)
          Alert.alert( this.translate.Get('Notice'),"Quý khách vui lòng đợi trong giây lát", [
            {
              text: "OK", onPress: () => {
                this.setState({ isPostBack: true});
              }
            }
          ]);
        }
        else{
          Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
            {
              text: "OK", onPress: () => {
                this.setState({ isPostBack: true});
              }
            }
          ]);
        }
      }).catch((error) => {
        this.setState({ isPostBack: true,});
        Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
          {
            text: "OK", onPress: () => {
              this.setState({ isPostBack: true});
            }
          }
        ]);
      }); 
    }
    }catch{
      this.setState({ isPostBack: true,});
      Alert.alert( this.translate.Get('Notice'),"Lỗi hệ thống!", [
        {
          text: "OK", onPress: () => {
            this.setState({ isPostBack: true});
          }
        }
      ]);
    }
  }
  /**
   *
   * @param {*} ite
   * @param {*} ind
   * @param {*} type
   * @returns
   */

  setModalCallStaff = (visible) => {
    this.setState({ ModalCallStaff: visible });
  }


  render() {
    const labels = [this.translate.Get("Thông tin đơn hàng"),this.translate.Get("Xuất hóa đơn"),this.translate.Get("Thanh toán")];
    const {Money,isShowBarCode,isShowBarCodeVip,showCall,Vip,isShowE_wallet,isShowCash,isShowCard,isShowBanking,isShowVip,lockTable,isColor,ModalCallStaff,modPayment} = this.state;
    const customStyles = {
      stepIndicatorSize: H4_FONT_SIZE,
      currentStepIndicatorSize:H1_FONT_SIZE*1.4,
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: isColor == true ? '#DAA520' :'#009900',
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: isColor == true ? '#DAA520' :'#009900',
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: isColor == true ? '#DAA520' :'#009900',
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#ffffff',
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: isColor == true ? '#DAA520' :'#009900',
      stepIndicatorLabelFontSize: H5_FONT_SIZE,
      stepIndicatorSize:H1_FONT_SIZE,
      currentStepIndicatorLabelFontSize: H3_FONT_SIZE,
      stepIndicatorLabelCurrentColor:isColor == true ? '#000000' : '#ffffff',
      stepIndicatorLabelFinishedColor: '#333d4c',
      stepIndicatorLabelUnFinishedColor: '#aaaaaa',
      labelColor: '#999999',
      labelSize: H3_FONT_SIZE,
      currentStepLabelColor: isColor == true ? '#DAA520' :'#333d4c'
    }
    const Paydata = [
      {payTitle: this.translate.Get('Tiền mặt'), payImg: require("../../assets/icons/iconCash-11.png"), payOnpress:this._ShowTM},
      {payTitle: this.translate.Get('Quẹt thẻ'), payImg: require("../../assets/icons/IconQuetThe-11.png"), payOnpress:this._ShowATM},
      {payTitle: this.translate.Get('Chuyển khoản'), payImg: require("../../assets/icons/IconBanking-11.png"), payOnpress:this._ShowBanking},
      {payTitle: this.translate.Get('Ví điện tử'), payImg: require("../../assets/icons/IconViDienTu-11.png"), payOnpress:this._ShowE_wallet},
      {payTitle: 'Voucher', payImg: require("../../assets/icons/IconVoucher-11.png"), payOnpress:this._isShowBarCode},
      {payTitle: 'Vip', payImg: require("../../assets/icons/IconVIP-11.png"), payOnpress:this._ShowVip},
    ]
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 30 : "height"} style={styles.Container}>
        {ModalCallStaff ?
        <ScrollView>
          <Modal
          // onBackdropPress={() =>this.setModalCallStaff(!ModalCallStaff)}
          isVisible={true}
          visible={ModalCallStaff}>
          <View style={{zIndex:2,top: Bordy.height*0.15, left: Bordy.width*0.275, width: Bordy.width *0.35, height: Bordy.height*0.35,borderRadius:10, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:0.5,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,height:Bordy.height*0.35*0.2,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold",textAlign:'center'}}>{this.translate.Get("Gọi nhân viên")}</Text>
            </View>
            <View style={{height:Bordy.height*0.35*0.18,width:'100%', justifyContent:'space-evenly',alignItems:'center',flexDirection:'row'}}>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + this.translate.Get("Gọi nhân viên") +' '})} style={{width:'45%', height:'75%',borderRadius:10, backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{this.translate.Get("Gọi nhân viên")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + this.translate.Get("Gọi thanh toán") +' '})}style={{width:'45%', height:'75%',borderRadius:10,backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{this.translate.Get('Gọi thanh toán')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: Bordy.height*0.35*0.42,justifyContent:'center',alignItems:'center'}}>
              <TextInput
                  placeholder={this.translate.Get("Nhập yêu cầu...")}
                  placeholderTextColor={isColor == true ? '#808080' : "#777777"}
                  value={this.state.Description}
                  onChangeText={(item) => this.setState({Description : item})}  
                  multiline={true} 
                  numberOfLines={10} 
                  style={[{width:'95%',height:Bordy.height*0.35*0.38,paddingHorizontal:12,borderWidth:0.5,borderRadius:10,fontSize: H3_FONT_SIZE,color:isColor == true ? '#ffffff' : "#000000", backgroundColor: isColor == true ? '#333333':'#FFFFFF',}]}>
              </TextInput>
            </View>
            <View style={{height:Bordy.height*0.35*0.195,width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'space-evenly',flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.setModalCallStaff(!ModalCallStaff)} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:'#af3037',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{this.translate.Get("Trở lại")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this._AcceptPayment(this.state.Description,2)}} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:isColor == true ? '#DAA520' :'#009900',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{this.translate.Get('Xác nhận')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </ScrollView>
          : null}
          {!this.state.isPostBack ?
          <View style={{height: Bordy.height,
            width: Bordy.width,
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
          : null}
        <View style={{ flexDirection: "row", height: Bordy.height * 0.08, width: Bordy.width, backgroundColor:isColor == true ? '#111111' :'#333d4c',alignItems:'center'}}>
        <TouchableOpacity onPress={this.onPressBack} style={{justifyContent: 'center', width:'12%',height:'100%',alignItems:'center',flexDirection:'row'}}>
               <Image style={{height: "55%", width: "30%",}} resizeMode='contain' source={require("../../assets/icons/IconBack.png")}/>
               <Text style={{color:'white', fontSize:H2_FONT_SIZE,fontFamily: "RobotoBold"}}>{this.translate.Get("Trở lại")}</Text>
            </TouchableOpacity>
            <View style={{width:'62%'}}>
              <Text style={{fontSize:H1_FONT_SIZE,fontFamily: "RobotoBold", textAlign: "center", color:'#fff'}}>{this.translate.Get('Phiếu thanh toán')}</Text>
            </View>
            <TouchableOpacity onPress={() => this.setModalCallStaff(!ModalCallStaff)} style={{ backgroundColor: '#fff', height: "60%", width: "19%", borderRadius: 25, }}>
              <View style={{backgroundColor:isColor == true ? '#DAA520' :'#33FF33',height:'100%',justifyContent: "center",borderRadius: 25, flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: "25%", alignItems:'center'}}>
                <Image style={{height: "70%", width: "70%"}} resizeMode='contain' source={require("../../assets/icons/IconCall-11.png")}/>
              </View>
              <Text style={{ color:'#333d4c',textAlign: "left", width: "75%", fontSize: H2_FONT_SIZE }}>{this.translate.Get('Gọi nhân viên')}</Text>
              </View>
            </TouchableOpacity>
            {lockTable == false?
            <TouchableOpacity
            onPress={this.onPressHome}
              style={{ justifyContent: "center", width:'7%',alignItems:'center'}}>
              <Image style={{height: "55%", width: "55%",}} resizeMode='contain' source={require("../../assets/icons/IconHome-11.png")}/>
            </TouchableOpacity>
            :null}
          </View>
          <View style={{height: Bordy.height * 0.54, width: Bordy.width ,  flexDirection: "row",shadowOffset: {width: 0,height: 5},shadowOpacity: 0.10,shadowRadius: 5,elevation: 6}}>
          <View style={{ width: "65%", height: "100%",}}>
            <View style={{ height: "72%", width: "100%",backgroundColor:isColor == true ? '#222222' : "#FFFFFF",paddingHorizontal:'1.5%'}}>
            <FlatList
              keyExtractor={(item, Index) => Index.toString()}
              data={this.state.TicketDetail }
              renderItem={this.renderOrdered}
            /> 
            </View>
            <View style={{ height: "28%", width: "100%",shadowColor: "#000",backgroundColor:isColor == true ? '#444444' : '#ffffff', shadowOffset: {width: 0,height: -5},shadowOpacity: 0.10,shadowRadius: 5,elevation: 6 ,paddingHorizontal:'2%'}}>
              <View style={{height:'30%',flexDirection:'row',justifyContent:'space-between',paddingVertical:'0.5%',alignItems:'center'}}>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE }}>{this.translate.Get('Thành tiền')}:</Text>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE, fontFamily:'RobotoBold' }}>{formatCurrency(this.state.Money.TkItemAmout,"")}</Text>
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between',}}>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE ,}}>Voucher:</Text>
                  <Text onChangeText={Voucher => this.setState({ Voucher })} style={{ color:isColor == true ? '#ffffff' : '000000',fontSize: H3_FONT_SIZE, fontFamily:'RobotoBold'}}>{formatCurrency(this.state.SumVoucher,"")}</Text>
                  {/* <TouchableOpacity onPress={this._RemoveVoucher}>
                    <AntDesign name='closecircle' size={H3_FONT_SIZE} color='#BB0000' />
                  </TouchableOpacity> */}
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between',}}>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE ,}}>{this.translate.Get('Giảm giá')}:</Text>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE ,fontFamily:'RobotoBold'}}>{formatCurrency(Money.TkTotalDiscount,"")}</Text>
                </View>
              </View>
              <View style={{height:'30%',flexDirection:'row',justifyContent:'space-between',paddingVertical:'0.5%',alignItems:'center'}}>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE }}>VAT ({formatCurrency(Money.TkVatPercent,"%")}):</Text>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE , fontFamily:'RobotoBold'}}>{formatCurrency(Money.TkVatTotalAmount,"")}</Text>
                </View>
                <View style={{width:'30%',flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE ,}}>Tip:</Text>
                  <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H3_FONT_SIZE , fontFamily:'RobotoBold'}}>{formatCurrency(parseFloat(Money.TkTipAmount), '')}</Text>
                </View>
              </View>
              <View style={{height:'40%', flexDirection: "row", justifyContent: "space-between", alignItems: "center",paddingVertical:'0.5%'}}>
                <Text style={{color:isColor == true ? '#ffffff' : '000000', fontSize: H1_FONT_SIZE, textAlign: "center", justifyContent: "flex-start",fontFamily:'RobotoBold',}}>{this.translate.Get('Tổng tiền cần thanh toán')}</Text>
                <Text style={{ fontSize: H1_FONT_SIZE, textAlign: "center", justifyContent: "flex-end", color:isColor == true ? '#DAA520' : "#CC0000",fontFamily:'RobotoBold',}}>{formatCurrency(this.state.PaymentAmount,"")}</Text>
              </View>
            </View>
          </View>
          <View style={{ width: "35%", height: "100%", backgroundColor:isColor == true ? '#444444' : 'ffffff',  shadowOffset: {width: -5,height: 0},shadowOpacity: 0.1,shadowRadius: 5,elevation:6}}>
          { isShowCash ? 
            <View style={{ height: "100%", width: "100%",}}>
              <View style={{height:'80%',alignItems:'center'}}>
                <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                  <Image style={{height: "80%", width: "80%"}} resizeMode='contain' source={isColor == true ? require("../../assets/images/hand_gray.gif") : require("../../assets/images/hand.gif")}/>
                </View>
              </View>
              <View style={{height:'20%',justifyContent:'center',paddingHorizontal:'7%'}}>
                <Text style={{fontSize:H2_FONT_SIZE, color:isColor == true ? '#FFFFFF':'#0000EE',textAlign:'center'}}>{this.translate.Get('Bấm nút "Gọi nhân viên" để phục vụ tiếp nhận thanh toán tiền mặt')}</Text>
              </View>
            </View>
            :isShowCard ? 
            <View style={{ height: "100%", width: "100%",}}>
              <View style={{height:'80%',alignItems:'center'}}>
                <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                <Image style={{height: "80%", width: "80%"}} resizeMode='contain' source={isColor == true ? require("../../assets/images/hand_gray.gif") : require("../../assets/images/hand.gif")}/>
                </View>
              </View>
              <View style={{height:'20%',justifyContent:'center',paddingHorizontal:'7%'}}>
                <Text style={{fontSize:H2_FONT_SIZE, color:isColor == true ? '#FFFFFF':'#0000EE',textAlign:'center'}}>{this.translate.Get('Bấm nút "Gọi nhân viên" để phục vụ tiếp nhận thanh toán quẹt thẻ')}</Text>
              </View>
            </View>
            :isShowBanking ? 
              <View style={{height:'100%',width:'100%',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE*1.2, textAlign:'center',color:isColor == true ? '#FFFFFF':'#FF0000', paddingHorizontal:'3%',textShadowColor:'#444444',textShadowOffset: {width:1, height:0.5 },textShadowRadius: 1}}>Quý khách vui lòng mở ứng dụng ngân hàng và quét mã để thanh toán</Text>
                <View style={{width:'100%',height:'85%',justifyContent:'center',alignItems:'center'}}>
                  <Image style={{height: "90%", width: "100%",}} resizeMode='contain' source={{uri: this.state.linkQrBank}}/>
                </View>
              </View>
            :isShowE_wallet ? 
            <View style={{ height: "100%", width: "100%",}}>
              <View style={{height:'80%',alignItems:'center', paddingHorizontal:'3%'}}>
                {this.state.NameE_wallet === 'VNPAY' ?
                <Text style={{fontSize:H3_FONT_SIZE, textAlign:'center',color:isColor == true ? '#FFFFFF':'#FF0000', paddingHorizontal:'3%',textShadowColor:'#444444',textShadowOffset: {width:1, height:0.5 },textShadowRadius: 1}}>Quý khách vui lòng mở ứng dụng ngân hàng và quét mã để thanh toán</Text>
                :
                <Text style={{fontSize:H3_FONT_SIZE, textAlign:'center',color:isColor == true ? '#FFFFFF':'#FF0000', paddingHorizontal:'3%',textShadowColor:'#444444',textShadowOffset: {width:1, height:0.5 },textShadowRadius: 1}}>Quý khách vui lòng quét mã QR code này bằng ứng dụng {this.state.NameE_wallet} để thanh toán </Text>
                }
                <View style={{width:'75%',height:'75%',justifyContent:'center',alignItems:'center'}}>
                  <Image style={{height: "100%", width: "100%",borderColor:isColor == true ? 'black' : null, borderWidth:1}} resizeMode='contain' source= {{uri: `data:image/png;base64,${this.state.QRData}`}}/>
                </View>
              </View>
              <View style={{height:'20%',justifyContent:'center',flexDirection:'row',width:'100%',}}>
                  <TouchableOpacity onPress={()=>this._getQrCode(this.state.NameE_wallet = 'MOMO')} style={{marginHorizontal:'2%',height:'75%', width:'20%',alignItems:'center',borderRadius:8, justifyContent:'center',shadowOpacity:0.3, shadowRadius: 4,elevation:6,backgroundColor:'#fff'}}>
                    <Image style={{height: "80%", width: "80%",}} resizeMode='contain' source={require("../../assets/icons/IconMomo-11.png")}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._getQrCode(this.state.NameE_wallet = 'ZALOPAY')} style={{marginHorizontal:'2%',height:'75%', width:'20%',alignItems:'center', borderRadius:8, justifyContent:'center',shadowOpacity: 0.3, shadowRadius: 4,elevation:6,backgroundColor:'#fff'}}>
                    <Image style={{height: "80%", width: "80%",}} resizeMode='contain' source={require("../../assets/icons/IconZalo-11.png")}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this._getQrCode(this.state.NameE_wallet = 'VNPAY')} style={{marginHorizontal:'2%',height:'75%', width:'20%',alignItems:'center', borderRadius:8, justifyContent:'center',shadowOpacity: 0.3, shadowRadius: 4,elevation:6,backgroundColor:'#fff'}}>
                    <Image style={{height: "80%", width: "80%",}} resizeMode='contain' source={require("../../assets/icons/IconVNPay-11.png")}/>
                  </TouchableOpacity>
              </View>
            </View>
            :isShowVip ? 
            <View style={{ height: "100%", width: "100%",}}>
              <View style={{height:'75%',alignItems:'center'}}>
                <Text style={{color:isColor == true ? '#FFFFFF':'#000000',height:'10%',fontSize:H2_FONT_SIZE}}>{this.translate.Get("Khách hàng VIP")}</Text>
                <View style={{width:'100%',height:'90%',justifyContent:'center',alignItems:'center',paddingHorizontal:'2%'}}>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Tên khách hàng")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8,}}>{Vip.Name}</TextInput>
                  </View>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Số điện thoại")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8,}}>{Vip.SDT}</TextInput>
                  </View>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center',}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Ngày sinh")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8,}}>{Vip.date}</TextInput>
                  </View>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Mã thẻ")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8}}>{Vip.cardNo}</TextInput>
                  </View>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Điểm tích lũy")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8,}}>{Vip.point}</TextInput>
                  </View>
                  <View style={{height:'15%', width:'100%', flexDirection:'row',justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:isColor == true ? '#FFFFFF':'#000000',width:'40%', fontSize:H3_FONT_SIZE, }}>{this.translate.Get("Hạng thẻ")}:</Text>
                    <TextInput style={{color:isColor == true ? '#FFFFFF':'#000000',width:'60%',height:'80%', fontSize:H3_FONT_SIZE, borderWidth:1,borderColor:'#CCCCCC', paddingHorizontal:8,}}>{Vip.rank}</TextInput>
                  </View>
                </View>
              </View>
              <View style={{height:'25%',justifyContent:'center',flexDirection:'row',width:'100%',}}>
                  <TouchableOpacity onPress={this._isShowBarCodeVip} style={{marginHorizontal:'2%',height:'90%', width:'25%',alignItems:'center',borderRadius:8, justifyContent:'center',shadowOpacity:0.3, shadowRadius: 4,elevation:6,backgroundColor:'#333d4c',borderColor:isColor == true ? '#ffffff' : "#333d4c",borderWidth:0.6}}>
                    <Image style={{height: "80%", width: "80%",}} resizeMode='contain' source={require("../../assets/icons/IconQR-11.png")}/>
                  </TouchableOpacity>
              </View>
            </View>
            : null}
          </View>
        </View>
        <View style={{ height: Bordy.height * 0.18, width: Bordy.width, alignItems: "center",paddingHorizontal:Bordy.width*0.2,backgroundColor: isColor == true ?'#333333' : '#ffffff',shadowOffset: {width: 0,height: -5},shadowOpacity: 0.1,shadowRadius: 5,elevation:6}}>
          <View style={{flexDirection:'row',height:'45%',width:'100%', paddingVertical:'1%',alignItems:'center'}}>
            <View style={{width:'5%',height:'100%'}}>
            <Image style={{height: "100%", width: "100%",}} resizeMode='contain' source={require("../../assets/icons/IconThanhToan-11.png")}/>
            </View>
            <Text style={{color:isColor == true ? '#ffffff' : '000000',fontSize:H2_FONT_SIZE,}}>{this.translate.Get('Chọn hình thức thanh toán')}</Text>
          </View>
          <View style={{flexDirection:'row',height:'55%',width:'100%',paddingVertical:5,borderRadius:10,backgroundColor:isColor == true ?'#333333' : '#ffffff'}}>
          <FlatList
            horizontal
                keyExtractor={(item, Index) => Index.toString()}
                data={Paydata}
                renderItem={({ item, index }) => 
                <TouchableOpacity onPress={()=> item.payOnpress(item.payTitle)} style={{width:Bordy.width*0.09,marginHorizontal:Bordy.width*0.005,height:'100%',flexDirection:'column',alignItems:'center',backgroundColor:isColor == true ? item.payTitle == modPayment ? '#DAA520' : '#555555' : item.payTitle == modPayment ?'#00CC00':'#f1f1f1',borderRadius:10,shadowOffset: {width: -3,height: 0},shadowOpacity: 0.3,shadowRadius: 2,elevation:6}}>
            <View style={{width:'100%',height:'70%',justifyContent:'center',alignItems:'center'}}>
            <Image style={{height: "90%", width: "90%",}} resizeMode='contain' source={item.payImg}/>
            </View>
            <Text style={{height:'30%',color:isColor == true ? '#FFFFFF' : '#000000', fontSize:H4_FONT_SIZE}}>{item.payTitle}</Text>
            </TouchableOpacity>}
              />
          </View>
        </View>
        <View style={{ height: Bordy.height * 0.20, width: Bordy.width, alignItems: "center",backgroundColor: isColor == true ?'#333333' : '#ffffff'}}>
            <TouchableOpacity style={{backgroundColor:isColor == true ? '#DAA520' :'#009900', marginTop: 15, borderWidth: 1, height: '30%',borderRadius:35,width:'30%', justifyContent: "center", alignItems: "center"}} 
             onPress={()=>{this._AcceptPayment(modPayment,1)}}
            >
              <Text style={{ textAlign: "center",color:isColor == true ? '#000000' :'#FFFFFF', width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2}}>
                {this.translate.Get('Xác nhận thanh toán')}</Text>
            </TouchableOpacity>
          <View style={{height:'70%', width: Bordy.width, justifyContent:'center'}}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={3}
              currentPosition={2}
              labels={labels}/>
          </View>
          {isShowBarCode ?
            <ScannerQR
            onCancel={() => {
              this.setState({isShowBarCode: false});
            }}
            onSelect={(QRCode) => {
              this._ApplyVoucher(QRCode);
            }}
            />: null
          }
          {isShowBarCodeVip ?
            <ScannerQRVip
            onCancel={() => {
              this.setState({isShowBarCodeVip: false});
            }}
            onSelect={(QRCodeString) => {
              this._ApplyVipCard(QRCodeString);
            }}
            />: null
          }
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  pnbody: {
    justifyContent: "space-around",
    height: Bordy.height,
    width: Bordy.width,
    flex: 1,
  },
  Container: {
    height: Bordy.height,
    width: Bordy.width,
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
    paddingTop: Bordy.height * 0.045 - ITEM_FONT_SIZE - 5,
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
    borderTopWidth: 1,
  },
});
