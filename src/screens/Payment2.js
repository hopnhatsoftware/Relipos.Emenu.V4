import React, { Component } from "react";
import { AppState,TouchableOpacity, Dimensions, Image, ActivityIndicator, UIManager, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Text, View, TextInput,Alert} from "react-native";
import Constants from "expo-constants";
import Modal from "react-native-modal";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import StepIndicator from 'react-native-step-indicator';
import { _CallOptions, _HeaderNew, _ProductGroup, _Infor, _TotalInfor,} from "../components";
import { ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, H1_FONT_SIZE,H2_FONT_SIZE,H3_FONT_SIZE,H4_FONT_SIZE,H5_FONT_SIZE} from "../config/constants";
import translate from "../services/translate";
import {SearchTaxInfor,FlushInvoiceInfor, getinvoiceInfor,API_Print,CancelOrder } from "../services";
import colors from "../config/colors";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ScreenHeight } from "react-native-elements/dist/helpers";
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("window").height; //- Constants.statusBarHeight;
const pnLeft = { width: SCREEN_WIDTH * 0.17, height: SCREEN_HEIGHT };
const Center = { width: SCREEN_WIDTH - pnLeft.width, height: SCREEN_HEIGHT};

const Booton = { width: Center.width, height: Center.height * 0.07 };
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
      appState: AppState.currentState,
      alertt:false,
      isColor:false,
      value :'',
      currentPosition: 1,
      showCall: false,
      isRenderProduct: true,
      selectedType: null,
      isPostBack: false,
      isPostBack2: true,
      isShowMash: false,
      language: 1,
      call: 1,
      data: [],
      Tax:{
        Name:'',
        TaxCode:'',
        TkeCompany:'',
        Address:'',
        Email:'',
        Phone:'',
      },
      Ticket: {},
      Description:'',
      lockTable:false,
      ModalCallStaff:false,
      table: {},
      settings: {},
      buttontext: props.defaultValue,
      endpoint: "",
      Config: {},
    };
    this.translate = new translate();
  }
  componentWillUnmount = async () => {
    this.appStateSubscription.remove();
    clearInterval(this.interval);
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
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    this.translate = await this.translate.loadLang();
    await this._setConfig();
    await this._getinvoiceInfor();
    this.setState({ isPostBack: true ,isColor});
    }catch{((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    })};
  };
  _CancelOrder = async() => {
    let{appState,Ticket}= this.state;
    if(appState == 'background'){
      await CancelOrder(Ticket.OrderId);
    }
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

  //Load thông tin xuất hoá đơn (Nếu có)
  _getinvoiceInfor = async () => {
    let{Tax,Ticket} =  this.state;
    if(Tax.TaxCode != ''){
      getinvoiceInfor(null, Ticket.TicketID, true).then(res => {
        console.log(res.Data)
          Tax.TaxCode = res.Data.ReiTaxId;
          Tax.Name = res.Data.CustomerName;
          Tax.TkeCompany = res.Data.CompanyName;
          Tax.Address = res.Data.ReiAddress;
          Tax.Email = res.Data.ReiEmail;
          Tax.Phone = res.Data.ReiPhone;
          this.setState({Tax});
      })
    }
    else{
      return;
    }
  }

  //Tìm thông tin theo mã số thuế (button)
  _SearchTaxInfor = async (item) => {
    let{Tax} =  this.state;
    if (Tax.TaxCode == '' || Tax.TaxCode == undefined) {
      Alert.alert(this.translate.Get("Thông báo"),'Vui lòng nhập mã số thuế')
    }else{
    this.setState({ isPostBack: false });
    SearchTaxInfor( item ).then(res => {
    if(res.Status === 1){
        if(res.Data === ""){
          this.setState({ isPostBack: true });
          Alert.alert(this.translate.Get("Thông báo"),'Mã số thuế không tồn tại')
        }
        else{
          this.setState({ isPostBack: true });
          Tax.Name = res.Data.CustomerName;
          Tax.TkeCompany = res.Data.CompanyName; 
          Tax.Address = res.Data.ReiAddress;
        }
      }
      else {
        this.setState({ isPostBack: true });
      }
        this.setState({Tax});
      }).catch((error) => {
        Alert.alert(this.translate.Get('Thông báo'),this.translate.Get('Lỗi hệ thống !'),
        [
          {
            text: "OK", onPress: () => {
            }
          }
        ])
  })}
  }
  //Tìm thông tin theo mã số thuế (onBlur)
  _SearchTaxInfor2 = async () => {
    let{Tax} =  this.state;
    if (Tax.TaxCode == '' || Tax.TaxCode == undefined) {
      return;
    }else{
      this.setState({ isPostBack: false });
    SearchTaxInfor( Tax.TaxCode ).then(res => {
    if(res.Status === 1){
        if(res.Data === ""){
          this.setState({ isPostBack: true });
          Alert.alert(this.translate.Get("Thông báo"),'Mã số thuế không tồn tại',
          )
        }
        else{
          this.setState({ isPostBack: true });
          Tax.Name = res.Data.CustomerName;
          Tax.TkeCompany = res.Data.CompanyName; 
          Tax.Address = res.Data.ReiAddress;
        }
      }
      else {
        this.setState({ isPostBack: true });
      }
        this.setState({Tax});
      })  }
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.navigation.getParam('lockTable', state.lockTable) != state.lockTable) {
      return {
        lockTable: props.navigation.getParam('lockTable', state.lockTable),
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  
  onPressBack = () => {
    let {lockTable} = this.state;
    this.props.navigation.navigate('Payment',{lockTable})
  };

  onPressNext = () => {
    let { Ticket,lockTable} = this.state;
    let a = Ticket
    _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
        this.props.navigation.navigate('Payment3',{lockTable});
    });
  };

  //Lưu thông tin hoá đơn
  _FlushInvoiceInfor = async () => {
    try{
    let{Ticket,Tax,lockTable} =  this.state;
    console.log(Ticket);
    let a = Ticket
    if (Tax.TaxCode === undefined || Tax.TaxCode === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Mã số thuế không được để trống')
    }else if(Tax.TkeCompany === undefined || Tax.TkeCompany === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Tên công ty không được để trống')
    }else if(Tax.Address === undefined || Tax.Address === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Địa chỉ không được để trống')
    }else if(Tax.Email === undefined || Tax.Email === ''){
      Alert.alert(this.translate.Get("Thông báo"),'Email không được để trống')
    }else{
      FlushInvoiceInfor( Ticket.TicketID,Tax.TaxCode,Tax.Name, Tax.TkeCompany, Tax.Address, Tax.Email, Tax.Phone).then(res => {
      if(res.Status === 1){
        _storeData('APP@BACKEND_Payment', JSON.stringify(a), () => {
            this.props.navigation.navigate('Payment3',{lockTable});
        });
      }
    })}}catch{((error) => {
      Question.alert( 'System Error',error, [
        {
          text: "OK", onPress: () => {
          }
        }
      ]);
    })};
    }
  
  onPressHome = async () => {
    this.props.navigation.navigate("OrderView");
};

//Gọi nhân viên
_AcceptCallStaff = async (Description,typeView) => {
  let{Ticket,settings,ModalCallStaff} = this.state;
  API_Print (settings.I_BranchID, Ticket.TicketID,typeView, Description).then(res => {
    if (res.Status == 1){
      this.setModalCallStaff(!ModalCallStaff)
      this.setState({ isPostBack: true});
      Alert.alert( this.translate.Get('Notice'),"Quý khách vui lòng đợi trong giây lát", [
        {
          text: "OK", onPress: () => {
            this.setState({ isPostBack: true});
          }
        }
      ]);
    }else{
      this.setState({ isPostBack: true});
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
  }); 
}
//Mở modal gọi nhân viên
setModalCallStaff = (visible) => {
  this.setState({ ModalCallStaff: visible });
}

addNote = (item) => {
  let {Description} = this.state;
  const isExists = Description.includes(item);
  if(isExists){
    return;
  }else{
    this.setState({Description: this.state.Description + item +' '})
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
    const labels = [this.translate.Get("Thông tin đơn hàng"),this.translate.Get("Xuất hóa đơn"),this.translate.Get("Thanh toán")];
    const { lockTable,isColor,ModalCallStaff} = this.state;
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
    return (
      <View style={[styles.Container,{backgroundColor:isColor == true ? '#333333' : '#FFFFFF', }]}>
      
           {/* <ScrollView style={{flex:1}}> */}
          <View style={{ flexDirection: "row", height: '8%', width: '100%', backgroundColor:isColor == true ? '#111111' :'#333d4c',alignItems:'center'}}>
          <TouchableOpacity onPress={this.onPressBack} style={{justifyContent: 'center', width:'12%',height:'100%',alignItems:'center',flexDirection:'row'}}>
               <Image style={{height: "55%", width: "30%",}} resizeMode='contain' source={require("../../assets/icons/IconBack.png")}/>
               <Text style={{color:'white', fontSize:H2_FONT_SIZE,fontFamily: "RobotoBold"}}>{this.translate.Get("Trở lại")}</Text>
            </TouchableOpacity>
            <View style={{width:'62%'}}>
              <Text style={{fontSize:H1_FONT_SIZE,fontFamily: "RobotoBold", textAlign: "center", color:'#fff'}}>{this.translate.Get('Thông tin hóa đơn của bạn')}</Text>
            </View>
            <TouchableOpacity onPress={() => this.setModalCallStaff(!ModalCallStaff)} style={{ backgroundColor: '#fff', height: "60%", width: "19%", borderRadius: 25, }}>
              <View style={{backgroundColor:isColor == true ? '#DAA520' :'#33FF33',height:'100%',justifyContent: "center",borderRadius: 25, flexDirection: "row", alignItems: "center", }}>
                <View style={{ width: "25%", alignItems:'center'}}>
                <Image style={{height: "70%", width: "70%"}} resizeMode='contain' source={require("../../assets/icons/IconCall-11.png")}/>
              </View>
              <Text style={{ color:'#333d4c',textAlign: "left", width: "75%", fontSize: H2_FONT_SIZE }}>{this.translate.Get("Gọi nhân viên")}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onPressHome}
              style={{ justifyContent: "center", width:'7%',alignItems:'center'}}>
              <Image style={{height: "55%", width: "55%",}} resizeMode='contain' source={require("../../assets/icons/IconHome-11.png")}/>
            </TouchableOpacity>
          </View>
          <View
          style={{height: '69%', width: '100%',}}
        
        >
          <View style={{height: '100%', width: '80%', marginHorizontal: "10%",paddingTop:5,}}>
            <KeyboardAvoidingView style={{ height: "74%",}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center"}}>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "51%", color: isColor == true ? '#FFFFFF' : '#000000' }}>{this.translate.Get('Mã số thuế')}:</Text>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "49%", color: isColor == true ? '#FFFFFF' : '#000000' }}>{this.translate.Get('Người nhận')}:</Text>
              </View>
              <View style={{ height: "11%", flexDirection: "row"}}>
                <TextInput 
                  value={this.state.Tax.TaxCode}
                  onBlur={this._SearchTaxInfor2}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , TaxCode : item}, }) } 
                  keyboardType="number-pad" 
                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "44%",  backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
                <TouchableOpacity onPress={()=>this._SearchTaxInfor(this.state.Tax.TaxCode) } style={{height: "100%", width: "5%",marginRight: "2%",backgroundColor:isColor == true ? '#333d4c' :'#333d4c', justifyContent:'center',alignItems:'center'}}>
                  <Image style={{height: "80%", width: "80%"}} resizeMode='contain' source={require("../../assets/icons/iconNew/IconFind-06.png")}/>
                </TouchableOpacity>
                <TextInput 
                  value={this.state.Tax.Name}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Name : item}, }) } 

                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "49%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1 }}>
                </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%'}}>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "51%", height: "100%", color: isColor == true ? '#FFFFFF' : '#000000'}}>Email:</Text>
                <Text style={{ fontSize: H3_FONT_SIZE, width: "49%" , color: isColor == true ? '#FFFFFF' : '#000000'}}>{this.translate.Get('SĐT')}:</Text>
              </View>
              <View style={{ height: "11%", flexDirection: "row"}}>
                <TextInput
                value={this.state.Tax.Email}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Email : item}, }) } 
                keyboardType="email-address" 
                style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "49%", marginRight: "2%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
                <TextInput 
                value={this.state.Tax.Phone}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Phone : item}, }) } 
                keyboardType="phone-pad" 
                style={{ paddingHorizontal:8,fontSize:H3_FONT_SIZE,width: "49%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%' }}>
                <Text style={{ fontSize: H3_FONT_SIZE, color: isColor == true ? '#FFFFFF' : '#000000' }}>{this.translate.Get('Tên công ty')}:</Text>
              </View>
              <View style={{ height: "21%", flexDirection: "row"}}>
                <TextInput 
                  value={this.state.Tax.TkeCompany}
                  onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , TkeCompany : item}, }) }  
                  multiline={true} 
                  numberOfLines={10} 
                  style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "100%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
                </TextInput>
              </View>
              <View style={{ height: "7%", flexDirection: "row", alignItems: "center",marginTop:'0.7%'}}>
                <Text style={{ fontSize: H3_FONT_SIZE, color: isColor == true ? '#FFFFFF' : '#000000' }}>{this.translate.Get('Địa chỉ')}:</Text>
              </View>
              <View style={{ height: "21%", flexDirection: "row"}}>
                <TextInput 
                value={this.state.Tax.Address}
                onChangeText={(item) => this.setState({Tax :{ ...this.state.Tax , Address : item}, }) }
                multiline={true} 
                numberOfLines={10} 
                style={{paddingHorizontal:8,fontSize:H3_FONT_SIZE, width: "100%", backgroundColor:'#FFFFFF', borderColor: "#BBBBBB", borderWidth: 1}}>
              </TextInput>
              </View>
            </KeyboardAvoidingView>
            <View style={{  backgroundColor: isColor == true ? '#D4AF37' : "#FFCCCC", opacity: 0.8, borderWidth: 1, borderColor:isColor == true ? '#D2691E' : "#FF3333", width: "100%", paddingLeft: 5, paddingTop: 5,}} >
              <Text style={{fontSize: H3_FONT_SIZE }}>• Quý Khách vui lòng cung cấp thông tin xuất hóa đơn tài chính ngay tại thời điểm thanh toán.</Text>
              <Text style={{fontSize: H3_FONT_SIZE }}>• Trường hợp Quý khách không cung cấp thông tin xuất hóa đơn tài chính tại thời điểm thanh toán:</Text>
              <Text style={{ fontSize: H4_FONT_SIZE, paddingLeft: 8,}}>• Công ty sẽ xuất hóa đơn KHÁCH LẺ</Text>
              <Text style={{ fontSize: H4_FONT_SIZE, paddingLeft: 8 }}>• Công ty KHÔNG xuất lại hóa đơn trong mọi trường hợp sau khi xuất hóa đơn KHÁCH LẺ trên đây</Text>
              <Text style={{ fontSize: H2_FONT_SIZE}}>Xin cảm ơn quý khách</Text>
            </View>
          </View>
          </View>
          <View style={{ height: '23%', width: '100%', justifyContent: "center", alignItems: "center"}}>
            <View style={{ height: "25%", justifyContent: "center", alignItems: "center"}}>
              <Text style={{ fontSize: H2_FONT_SIZE ,color: isColor == true ? '#FFFFFF' : '#000000' }}>{this.translate.Get("Chọn bỏ qua nếu bạn không xuất hóa đơn VAT")}</Text>
            </View>
            <View style={{ height: "30%", flexDirection: "row" }}>
              <TouchableOpacity
                onPress={()=>this.onPressNext()}
                style={{ backgroundColor: "#DDDDDD", height: "75%", width: "22%",borderRadius:35,marginRight:'2%', justifyContent: "center", alignItems: "center"}}>
                <Text style={{ textAlign: "center", width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2,}}>{this.translate.Get('Bỏ qua')}</Text>
              </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._FlushInvoiceInfor()} style={{ backgroundColor:isColor == true ? '#DAA520' :'#009900', borderWidth: 1,height: '75%',borderRadius:35,width:'22%',shadowColor: "#000", justifyContent: "center", alignItems: "center"}}>
              <Text style={{ textAlign: "center",color:isColor == true ? '#000000' :'#FFFFFF', width: "100%", fontSize: BUTTON_FONT_SIZE / 1.2}}>{this.translate.Get('Xác nhận')}</Text>
            </TouchableOpacity>
            </View>
            <View style={{height:'45%', width: '90%', justifyContent:'center'}}>
            <StepIndicator
              customStyles={customStyles}
              stepCount={3}
              currentPosition={1}
              labels={labels}/>
            </View>
          </View>
          {/* </ScrollView> */}
          {ModalCallStaff ?
          <ScrollView>
          <Modal
          // onBackdropPress={() => this.setModalCallStaff(!ModalCallStaff)}
          isVisible={true}
          visible={ModalCallStaff}>
          <View style={{top: '20%', left: '30%', width: '40%', height: '35%',borderRadius:10, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:0.5,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,height:'20%',width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold",textAlign:'center'}}>{this.translate.Get("Gọi nhân viên")}</Text>
            </View>
            <View style={{height:'18%',width:'100%', justifyContent:'space-evenly',alignItems:'center',flexDirection:'row'}}>
              <Text style={{fontSize:H3_FONT_SIZE, color:isColor==true?'#FFFFFF':'#000000'}}>{this.translate.Get("Keywords")}:</Text>
                <Text onPress={() => this.addNote(this.translate.Get("Gọi nhân viên"))}  style={{fontSize:H3_FONT_SIZE*0.9, color:isColor==true?'#FFFFFF':'#000000',textDecorationLine: 'underline',}}>{this.translate.Get("Gọi nhân viên")}</Text>
                <Text onPress={() => this.addNote(this.translate.Get("Gọi thanh toán"))} style={{fontSize:H3_FONT_SIZE*0.9, color:isColor==true?'#FFFFFF':'#000000',textDecorationLine: 'underline',}}>{this.translate.Get('Gọi thanh toán')}</Text>
            </View>
            <View style={{height: '42%',justifyContent:'center',alignItems:'center'}}>
              <TextInput
                  placeholder={this.translate.Get("Nhập yêu cầu...")}
                  placeholderTextColor={isColor == true ? '#808080' : "#777777"}
                  value={this.state.Description}
                  onChangeText={(item) => this.setState({Description : item})}  
                  multiline={true} 
                  numberOfLines={10} 
                  style={[{width:'95%',height:'80%',paddingHorizontal:12,borderWidth:0.5,borderRadius:10,fontSize: H3_FONT_SIZE,color:isColor == true ? '#ffffff' : "#000000", backgroundColor: isColor == true ? '#333333':'#FFFFFF',}]}>
              </TextInput>
            </View>
            
            <View style={{height:'20%',width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'space-evenly',flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.setModalCallStaff(!ModalCallStaff)} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:'#af3037',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{this.translate.Get("Trở lại")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this._AcceptCallStaff(this.state.Description,2)}} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:isColor == true ? '#DAA520' :'#009900',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{this.translate.Get('Gửi yêu cầu')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </ScrollView>
          : null}
         {!this.state.isPostBack ?
          <View style={{height: ScreenHeight,
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
          : null}
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pnbody: {
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  BackgroundMash: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "#EEEEEE",
    zIndex: 99,
    opacity: 0.1,
  },
  Container: {
    flex:1,
    justifyContent: "center",
    zIndex: 1,
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
    paddingTop: SCREEN_HEIGHT* 0.045 - ITEM_FONT_SIZE - 5,
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
    height: SCREEN_HEIGHT+ Constants.statusBarHeight,
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
