import React from "react";
import {
  AppState,View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Animated, Platform, FlatList, ActivityIndicator, KeyboardAvoidingView, Keyboard,
  Dimensions,Alert
} from "react-native";
import Modal from "react-native-modal";
import colors from "../../config/colors";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from "react-native-elements";
import { _retrieveData, _storeData, _remove } from "../../services/storages";
import {SetMenu_getExtraRequestFromProductId,API_Print,CancelOrder,UpdateStatus_TicketDetail,UpdateNote_TicketDetail} from '../../services';
import { H1FontSize,H2FontSize,H3FontSize,H4FontSize,H3_FONT_SIZE,H1_FONT_SIZE,H2_FONT_SIZE ,H4_FONT_SIZE, SCREEN_WIDTH} from "../../config/constants";
import { formatCurrency,formatTime } from "../../services/util";
import Question from '../Question';
import { ScrollView } from "react-navigation";

const width = Dimensions.get("window").width;
 const height = Dimensions.get("window").height //- Constants.statusBarHeight;
 const Bordy={width:width > height ? width : height,height:height < width ? height : width};
const Titlecf={
  width:0,
  height:Bordy.height*0.06
}
const Footercf={  
  width:0,  
  height:Bordy.height*0.05
}
const Contentcf={  
  width:Bordy.width * 0.75,  
  height:0
}
const ContentRowcf={  
  width:Bordy.width * 0.75,  
  height:Bordy.height * 0.06
}
const TabTitle={
  width:0,
  height:Bordy.height*0.06
}
export class CardDetailView extends React.Component {
  textInput = null; 
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      ProductsOrdered:[],
      
      isColor:false,
      ModalCallStaff: false,
      IsLoaded:false,
      KeyCode:'',
      showS_CodeHandleData:false,
      modalNote : false,
      TksdNote:'',
      Description:'',
      DescriptionUp:'',
      Products:[],
      Products1:[],
      Products2:[],
      textModal:'',
      item:{}
    }
  }
  componentWillUnmount = async () => {
    this.appStateSubscription.remove();
  };
  componentDidMount= async () => {
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
    this.setState({IsLoaded:true ,KeyCode:'',isColor});
    
  };
  _CancelOrder = async() => {
    let{appState}= this.state;
    let{table}=this.props;
    if(appState == 'background'){
      await CancelOrder(table.OrderId);
    }
  }
  //danh sách yêu cầu thêm
  _loadExtraRequest = async (item) =>{
    try{
    let{modalNote,TksdNote}=this.state;
    this.setState({textModal: item.PrdNameUi,item:item, TksdNote: item.OrddDescription})
    if(item.OrddDescription == undefined || item.OrddDescription == ''){
      this.setState({TksdNote: ''})
    }
    this.setModalNote(!modalNote )
    SetMenu_getExtraRequestFromProductId(item.PrdId).then((res) => {
      if ("Table" in res.Data) {
        let Products1 = res.Data.Table;
        this.setState({ Products1 });
      }
      if ("Table1" in res.Data) {
        let Products2 = res.Data.Table1;
        this.setState({ Products2 });
      }
    }).catch((error)=>{
      Question.alert(
        this.translate.Get('Notice'),
        this.translate.Get("ServerError"+':'+error),[
          {text:"OK", onPress: () =>{
            this.setState({isLoading: false, fontLoaded:true, });
          }}
        ],
        { cancelable: false }
      )
      this.setState({isLoading: false });
    });
  }catch (error) {
    console.log('_loadExtraRequest Error:'+error);
    return null;
  } 
  }

  IncrementDescription = (item,index) => {
    let {TksdNote} = this.state;
    this.setState({TksdNote: TksdNote + item.MrqDescription +' '})
  };

  //Tăng giảm số lượng món
  _HandleQuantity = async (item,OrddQuantity,isReplace) => {
    try {
      const { HandleQuantity,state  } = this.props;
      
      HandleQuantity(item,OrddQuantity,isReplace);
      state.iLoadNumber=state.iLoadNumber+1;

    } catch (error) {
      console.log('AddQuantity Error:'+error);
      return null;
    } 
  };

  //Yêu cầu thêm
  _Addnote = async () =>{
    try{
    let {HandleDescription} = this.props;
    let { item,TksdNote,modalNote} = this.state;
    HandleDescription(item,TksdNote)
    this.setModalNote(!modalNote )
    } catch (error) {
      console.log('Addnote Error:'+error);
      return null;
    }
  }

  //Modal yêu cầu thêm
  setModalNote = (visible) => {-
    this.setState({ modalNote: visible });
  }

  onPressNext = async () => {
    this.props.onPressNext();
  }
  
  //Gửi order
  _AcceptCode= async () => {
    try{
    let {  onSendOrder, translate, settings} = this.props;
    Keyboard.dismiss();
    this.setState({ showS_CodeHandleData: false});
    if (this.state.KeyCode==null||this.state.KeyCode=='') 
    { 
      Question.alert( translate.Get("Thông báo"),
      translate.Get("Vui lòng nhập mã trước khi gửi Order !"),
      [
        {
          text: "OK",
          onPress: () => {
            this.setState({ showS_CodeHandleData: true});
          }
        }
      ]
    );
    return;
    }
      if (settings.S_CodeHandleData != this.state.KeyCode) 
      {
        Question.alert( translate.Get("Thông báo"),
        translate.Get("Bạn đã nhập code sai, vui lòng liên hệ với nhân viên!"),
        [
          {
            text: "OK",
            onPress: () => {
              this.setState({ showS_CodeHandleData: true});
            }
          }
        ]
      );
      return;
      }
      onSendOrder();
    } catch (error) {
      console.log('_AcceptCode Error:'+error);
      return null;
    }
  }
  _UpdateStatus_TicketDetail = async(item,TkdStatus) => {
    try{
    let {table}= this.props;
    UpdateStatus_TicketDetail(item,TkdStatus,table).then(res => {
      if(res.Status == 1)
      this.props._getTicketInforOnTable();
    })}
    catch(error){
      Alert.alert(translate.Get("Thông báo"),translate.Get("Lỗi hệ thống, UpdateStatus"), [
        {
          text: "OK", onPress: () => { }
        }
      ]);
      return null;
    }
  }
  _NoticeHT = async() => {
    const { translate } = this.props;
    Alert.alert(translate.Get("Thông báo"),translate.Get("Note: cooking"), [
      {
        text: "OK", onPress: () => {}
      }
    ]);
  }
  
  _UpdateNote_TicketDetail = async(item) => {
    try{
    let{DescriptionUp} = this.state;
    let{ticketId,translate}=this.props;
    const a = '(Lên món)'
    if(item.TkdNote.includes(a)){
      Alert.alert(translate.Get("Thông báo"),translate.Get("Món đã được nhắc lên món, quý khách vui lòng chờ trong ít phút"), [
        {
          text: "OK", onPress: () => { }
        }
      ]);
      return;
    }
    DescriptionUp = '(Lên món) ' + item.TkdNote 
    UpdateNote_TicketDetail(item,ticketId,DescriptionUp).then(res => {
      if(res.Status == 1)
      this.props._getTicketInforOnTable();
    })}
    catch(error){
      Alert.alert(translate.Get("Thông báo"),translate.Get("Lỗi hệ thống, UpdateNote"), [
        {
          text: "OK", onPress: () => { }
        }
      ]);
      return null;
    }
  }
  // Đã Order
  renderOrdered= ({ item, RowIndex }) => {
    const { BookingsStyle,translate} = this.props;
    const {isColor} = this.state;
    if (item.TkdQuantity <= 0&&item.TksdQuantity<=0)
    return null;
      return (
        <View style={{width:'100%', flexDirection:'row',backgroundColor: isColor == true ? '#333333' :'#EEEEEE',}}>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.06,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.STT}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'left',width:Bordy.width * 0.75*0.42,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:5}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.PrdNameUi ? item.PrdNameUi : item.PrdName}</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.1,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.UnitName}</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.1,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdQuantity}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.2,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',backgroundColor:item.Color}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdStatusName ? item.TkdStatusName : ''}</Text>
                  </View>
                  <View style={{width:Bordy.width * 0.75*0.3,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingVertical:5,flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{item.TkdStatus != 6? this._UpdateNote_TicketDetail(item) : null}} style={{backgroundColor:item.TkdStatus != 6 ?'#66ccff': '#dddddd',borderRadius:3,borderWidth:0.5, height:H1_FONT_SIZE,paddingHorizontal:8,justifyContent:'center', marginHorizontal:5,width:Bordy.width * 0.75*0.3*0.38}}>
                      <Text style={{fontSize:H3_FONT_SIZE,color: item.TkdStatus == 6 ? "#808080" : '#000000',textAlign:'center'}}>{translate.Get("Lên món")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{item.IsUseKitchenScreen == true ? (item.TkdStatus == 2 ? this._UpdateStatus_TicketDetail(item,6) : item.TkdStatus == 6 ? null : this._NoticeHT() ):item.TkdStatus == 6 ? null : this._UpdateStatus_TicketDetail(item,6)}} style={{backgroundColor:item.IsUseKitchenScreen == true ? (item.TkdStatus == 2 ? '#009900' :'#dddddd' ): item.TkdStatus == 6 ? '#dddddd' :'#009900',borderRadius:3,borderWidth:0.5, height:H1_FONT_SIZE,paddingHorizontal:8,justifyContent:'center',width:Bordy.width * 0.75*0.3*0.55}}>
                      <Text style={{fontSize:H3_FONT_SIZE,color:item.TkdStatus == 6? "#808080" : '#000000',textAlign:'center'}}>{translate.Get("Hoàn thành")}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.25,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'left'}}>{item.TkdNote? item.TkdNote : ''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdOrderTime ? formatTime(item.TkdOrderTime):''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'right'}}>{formatCurrency(this.props.state.Config.B_ViewUnitPriceBefor ? item.TkdItemAmount : item.TkdTotalAmount, "")}</Text>
                  </View>
                </View>
      ); 
  };
  // Đang Order
  renderOrder = ({ item, RowIndex }) => {
    let {_addExtraRequestToItem,translate} = this.props;
    let{isColor,modalNote}=this.state
    const Column1=Contentcf.width* 0.17;
    const QuantityWidth=Column1-H2FontSize*3
    return (
      <View style={{backgroundColor: isColor == true ? '#333333' :'#FFFFFF',width: Contentcf.width, borderBottomColor: colors.grey5, borderBottomWidth: 1,}}>
        <View style={{ width: Contentcf.width, paddingTop:1,paddingBottom:1}}> 
        <View style={{ width: Contentcf.width, flexDirection: "row"}}> 
        <View style={{ flexDirection: "row", width: Column1}} >
         { (!item.PrdIsSetMenu) ?
            <TouchableOpacity  style={{width: Column1 * 0.3, justifyContent: "center", alignItems: 'center'  }} onPress={() => this._HandleQuantity(item, -1, false)}>
              <Image resizeMode='contain' source={require('../../../assets/icons/IconDelete.png')} 
              style={{ width: H2_FONT_SIZE,height: H2_FONT_SIZE,  }} />
            </TouchableOpacity>:   
            <TouchableOpacity style={{ width: Column1 * 0.3, justifyContent: "center", alignItems: 'center' }}  onPress={() => { this._HandleQuantity(item,-1,false) }}>
            <Icon name="close" type="antdesign" size={H2FontSize} iconStyle={{ color: colors.red, fontFamily: "RobotoBold",height:H2FontSize}} />
          </TouchableOpacity> 
          }
            <View style={{ width: Column1 * 0.4,justifyContent: 'center', alignItems: 'center'}}>
              <TextInput ref={input => this.textInput = input} style={{  color:isColor == true ? "#FFFFFF" : "#af3037", width: '100%',  fontSize: H3FontSize, textAlign:'center',fontFamily: "RobotoBold",}}
                autoFocus={false}  autoCapitalize="none" autoCorrect={false} keyboardAppearance="dark"
                keyboardType='numeric' autoCompleteType='off' returnKeyType='done' blurOnSubmit={true}
                defaultValue={item.OrddQuantity ? item.OrddQuantity.toString() : ''}
                Value={item.OrddQuantity>0 ? item.OrddQuantity.toString() : '' }
                onChangeText={(textInput) => {
                  item.OrddQuantity = textInput;
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  this._HandleQuantity(item, item.OrddQuantity, true);
                }}
              />
            </View>
           
           <TouchableOpacity name='btnAddQuantity' style={{width: Column1 * 0.3, justifyContent: "center", alignItems: "center" }} onPress={() =>{
               if (item.PrdIsSetMenu)
               return;
               this._HandleQuantity(item, 1, false)
               }}>
            {!item.PrdIsSetMenu ? 
            <Image resizeMode="contain" source={require('../../../assets/icons/IconAdd.png')} 
            style={{ width: H2_FONT_SIZE,height: H2_FONT_SIZE, }} />
           : null
          }
           </TouchableOpacity>
            </View>

          <TouchableOpacity onPress={()=>this._loadExtraRequest(item)} style={{width: Contentcf.width* 0.55,paddingLeft:5, justifyContent:'center', }}>
          {!item.PrdIsSetMenu ? 
            <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", width: Contentcf.width* 0.555, fontSize: H3_FONT_SIZE,  flexWrap: "wrap",textAlign:'left',paddingBottom:3 }} numberOfLines={5}>
             {item.PrdNameUi} ({item.UnitName})
            </Text> 
            :
            <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", width: Contentcf.width* 0.555, fontSize: H3_FONT_SIZE,  flexWrap: "wrap",textAlign:'left',paddingBottom:3 }} numberOfLines={5}>
             {item.PrdName}
            </Text> 
            }
            <View style={{flexDirection:'row',width: Contentcf.width* 0.5, borderTopWidth:0.55,borderColor:isColor ==true ? '#FFFFFF':"#000000",paddingVertical:3}}>
              <Text style={{ color: isColor ==true ? item.OrddDescription?'#FFFFFF':'#777777':item.OrddDescription?"#000000":'#777777', fontSize: H4_FONT_SIZE*0.8,  flexWrap: "wrap",textAlign:'left',marginLeft:3 }} numberOfLines={5}>
              {translate.Get("Ghi chú")} 
              </Text>
              <Icon name='edit'  type="antdesign" size={H4_FONT_SIZE}  iconStyle={{ color: colors.red,  fontFamily: "RobotoBold",height:H4_FONT_SIZE}} />
              {item.OrddDescription?
              <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H4_FONT_SIZE*0.8,  flexWrap: "wrap",textAlign:'left',marginLeft:5 }} numberOfLines={5}>
               {item.OrddDescription}
              </Text> 
              :null
            }
            </View>
          </TouchableOpacity>
          <View style={{  justifyContent:'center',width: Contentcf.width* 0.14 ,}}>
            <Text style={{color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H3_FONT_SIZE ,textAlign:'center' }}>
            {formatCurrency(this.props.state.Config.B_ViewUnitPriceBefor ? item.UnitPrice : item.UnitPriceAfter, "")}
            </Text>
          </View>
          <View style={{  justifyContent: "center",width: Contentcf.width* 0.14 ,}}>
            <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H3_FONT_SIZE,fontWeight:'bold',textAlign:'center' }}>
            {formatCurrency(this.props.state.Config.B_ViewUnitPriceBefor ? item.TkdItemAmount : item.TkdTotalAmount, "")}
            </Text>
          </View>
          </View>
        {item.PrdIsSetMenu == true&&item.subItems&&item.subItems?
          <View style={{ width: Bordy.width * 0.75 - 13, flexDirection: "row", }}>
            <FlatList keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={item.subItems && typeof item.subItems != 'undefined' ? item.subItems : []}
              renderItem={this.RenderSubItem}
              contentContainerStyle={{color: isColor ==true ? '#FFFFFF':"#000000", backgroundColor: colors.white, borderColor: colors.grey4 }}
            />
          </View>:null
        }
      </View>
      </View>
    );
  };

  RenderSubItem = ({ item, RowIndex }) => {
    let{isColor}=this.state;
    const { translate } = this.props;
    return (
        <View style={{ width: Contentcf.width, flexDirection: "row",paddingBottom:2,paddingTop:2 }}>
        <View style={{  flexDirection: "row",  justifyContent: "center", width: Contentcf.width* 0.17 }} >
            <View style={{ width: Contentcf.width*0.07,  justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{  width: '100%', fontSize: H4FontSize,  flexWrap: "wrap",textAlign:'left'}}>
            </Text> 
            </View>
          </View>
          <View style={{ width: Contentcf.width* 0.555,flexDirection: "row",alignContent:'center', justifyContent:'flex-start', marginLeft: Contentcf.width* 0.005, }}>
          <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H4FontSize,textAlign:'left'}}>
           {item.TksdQuantity}
            </Text> 
            <Text style={{ color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H4FontSize,textAlign:'left',textAlignVertical:'bottom'}}>
            {'# '}
            </Text> 
            <Text style={{color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H4FontSize,  flexWrap: "wrap",textAlign:'left'}}>
         {item.PrdName}
            </Text> 
          </View>
          <View style={{  justifyContent:'center',width: Contentcf.width* 0.1 ,}}>
            <Text style={{color: isColor ==true ? '#FFFFFF':"#000000", fontSize: H4FontSize ,textAlign:'right' }}>
              {formatCurrency(item.TksdPrice, "")}
            </Text>
          </View>
          <View style={{ justifyContent: "center",width: Contentcf.width* 0.15 ,}}>
           
          </View>
          </View>
      )};
      setModalCallStaff = (visible) => {
        this.setState({ ModalCallStaff: visible });
      }
      _AcceptPayment = async (Description,typeView) => {
        let{ticketId,BranchID}=this.props;
        let{ModalCallStaff} = this.state;
        API_Print (BranchID, ticketId,typeView, Description).then(res => {
          if (res.Status == 1){
            this.setModalCallStaff(!ModalCallStaff)
            this.setState({ isPostBack: true});
            Alert.alert( 'thông báo',"Quý khách vui lòng đợi trong giây lát", [
              {
                text: "OK", onPress: () => {this.setState({ isPostBack: true});
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
          Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
            {
              text: "OK", onPress: () => {
                this.setState({ isPostBack: true});
              }
            }
          ]);
        }); 
      }
  render() {
    let { state,setState, onSendOrder,lockTable, BookingsStyle, CartToggleHandle, translate,_getTicketInforOnTable,ProductsOrdered,TicketHitory} = this.props;
    let {isColor,modalNote,Products1,Products2,ModalCallStaff,}= this.state;
    let HeightHistory = Bordy.height-(Titlecf.height+TabTitle.height)
    let HeightOrdered = Bordy.height-(Titlecf.height+TabTitle.height*2)
    if (!this.state.IsLoaded) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      );
    }
    const titleProductsOrdered = [
      {Name: 'Stt',widthTitle:Bordy.width * 0.75*0.06},
      {Name: translate.Get("Tên hàng"),widthTitle:Bordy.width * 0.75*0.42},
      {Name: translate.Get("ĐVT"),widthTitle:Bordy.width * 0.75*0.1},
      {Name: translate.Get("SL"),widthTitle:Bordy.width * 0.75*0.1},
      {Name: translate.Get("Trạng thái bếp"),widthTitle:Bordy.width * 0.75*0.2},
      {Name: translate.Get("Thao tác"),widthTitle:Bordy.width * 0.75*0.3},
      {Name: translate.Get("Ghi chú"),widthTitle:Bordy.width * 0.75*0.25},
      {Name: translate.Get("Giờ order"),widthTitle:Bordy.width * 0.75*0.15},
      {Name: translate.Get("Tổng tiền"),widthTitle:Bordy.width * 0.75*0.15},
    ]
    const titleHitory = [
      {Name: 'Stt',widthTitle:Bordy.width * 0.75*0.06},
      {Name: translate.Get("Tên hàng"),widthTitle:Bordy.width * 0.75*0.42},
      {Name: translate.Get("ĐVT"),widthTitle:Bordy.width * 0.75*0.1},
      {Name: translate.Get("SL"),widthTitle:Bordy.width * 0.75*0.1},
      {Name: translate.Get("Trạng thái bếp"),widthTitle:Bordy.width * 0.75*0.2},
      {Name: translate.Get("Ghi chú"),widthTitle:Bordy.width * 0.75*0.25},
      {Name: translate.Get("Lý do trả"),widthTitle:Bordy.width * 0.75*0.2},
      {Name: translate.Get("Giờ order"),widthTitle:Bordy.width * 0.75*0.15},
      {Name: translate.Get("Bắt đầu làm"),widthTitle:Bordy.width * 0.75*0.15},
      {Name: translate.Get("Làm xong"),widthTitle:Bordy.width * 0.75*0.15},
      {Name: translate.Get("Tổng TG làm"),widthTitle:Bordy.width * 0.75*0.15},
      {Name: translate.Get("Nhân viên"),widthTitle:Bordy.width * 0.75*0.2},
      {Name: translate.Get("Tổng tiền"),widthTitle:Bordy.width * 0.75*0.15},
    ]
    if(typeof(state.isHavingOrder)==undefined||state.isHavingOrder ==null)
    state.isHavingOrder=1; 
    return ( 
      <View name='vwMash' style={{ position: "absolute", right: 0, top: 0,flexDirection: "row",
          justifyContent: "space-between",width: Bordy.width, height: Bordy.height*2,
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}
      >
      {ModalCallStaff ?
        <ScrollView>
          <Modal
          // onBackdropPress={() => this.setModalCallStaff(!ModalCallStaff)}
          isVisible={true}
          visible={ModalCallStaff}>
          <View style={{top: Bordy.height*0.15, left: Bordy.width*0.275, width: Bordy.width *0.35, height: Bordy.height*0.35,borderRadius:10, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:0.5,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,height:Bordy.height*0.35*0.2,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold",textAlign:'center'}}>{translate.Get("Gọi nhân viên")}</Text>
            </View>
            <View style={{height:Bordy.height*0.35*0.18,width:'100%', justifyContent:'space-evenly',alignItems:'center',flexDirection:'row'}}>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + translate.Get("Gọi nhân viên") +' '})} style={{width:'45%', height:'75%',borderRadius:10, backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{translate.Get("Gọi nhân viên")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + translate.Get("Gọi thanh toán") +' '})}style={{width:'45%', height:'75%',borderRadius:10,backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{translate.Get('Gọi thanh toán')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: Bordy.height*0.35*0.42,justifyContent:'center',alignItems:'center'}}>
              <TextInput
                  placeholder={translate.Get("Nhập yêu cầu...")}
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
                <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get("Trở lại")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this._AcceptPayment(this.state.Description,2)}} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:isColor == true ? '#DAA520' :'#009900',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get('Xác nhận')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </ScrollView>
          : null}
      {modalNote ?
          <Modal
          // onBackdropPress={() => this.setModalNote(!modalNote)}
          isVisible={true}
          visible={modalNote}>
          <View style={{top: Bordy.height*0.2, left: Bordy.width*0.2, width: Bordy.width *0.5, height: Bordy.height*0.6,borderRadius:10, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:1,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{height:Bordy.height*0.6*0.1,borderTopLeftRadius:9,borderTopRightRadius:9,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
              <ScrollView >
                <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold",textAlign:'center'}}>{this.state.textModal}</Text>
              </ScrollView>
            </View>
            <View style={{height: Bordy.height*0.4*0.12,justifyContent:'center',alignItems:'center',marginVertical:5}}>
            <TextInput
                  placeholder={translate.Get("Nhập yêu cầu...")}
                  placeholderTextColor={isColor == true ? '#808080' : "#777777"}
                  value={this.state.TksdNote}
                  multiline={true} 
                  onChangeText={(number) => this.setState({TksdNote : number})}
                  style={[{width:'95%',height:Bordy.height*0.4*0.12,paddingLeft:12,paddingRight:Bordy.height*0.4*0.12+5,borderWidth:0.5,borderRadius:10,fontSize: H3_FONT_SIZE,color:isColor == true ? '#ffffff' : "#000000", backgroundColor: isColor == true ? '#333333':'#FFFFFF',}]}>
                </TextInput>
                <TouchableOpacity style={{position:'absolute',width: Bordy.height*0.4*0.12, height: Bordy.height*0.4*0.12,right:15}} 
                  onPress={()=> this.setState({TksdNote : ''})} >
                  <Icon
                    name="close"
                    type="antdesign"
                    containerStyle={{
                      borderRadius:10,
                      width: Bordy.height*0.4*0.12, 
                      height: Bordy.height*0.4*0.12,
                    }}
                    iconStyle={{ 
                      color: 'red',
                      fontWeight:'bold',
                      fontSize: Bordy.height*0.4*0.12,
                    }}
                  />
                </TouchableOpacity>
            </View>
            
            <View style={{height: Bordy.height*0.6*0.68+7,flexDirection:'row', width:Bordy.width *0.5,}}>
                    <FlatList
                      keyExtractor={(item, RowIndex) => RowIndex.toString()}
                      numColumns={3}
                      data={Products1}
                      extraData={this.state.selectedIndex}
                      style={{width:Bordy.width *0.5/2}}
                      renderItem={({item, index}) =>
                      <TouchableOpacity
                      onPress={() => this.IncrementDescription(item, index)}
                      style={{width: Bordy.width *0.5 * 0.1655 ,  backgroundColor: index == this.state.selectedIndex?'#ea6721':item.StlBgColor.trim(), justifyContent:"center",alignItems:'center',  borderRadius: 2, borderWidth:0.5, borderColor: 'white',}}>
                        <View style={{ justifyContent:"center",alignItems:'center', height: Bordy.height * 0.1, borderRadius: 2,  borderColor: 'white',}}>
                          <Text style={{ color: item.StlFontColor ? item.StlFontColor.trim(): '#000000', width: '100%',  textAlign: "center", fontSize: item.StlFontSize ? item.StlFontSize: H3_FONT_SIZE, }}>{item.MrqDescription}</Text>
                        </View>
                      </TouchableOpacity>}
                    />
                    <FlatList
                      keyExtractor={(item, RowIndex) => RowIndex.toString()}
                      numColumns={3}
                      data={Products2}
                      extraData={this.state.selectedIndex}
                      style={{width:Bordy.width *0.5/2}}
                      renderItem={({item, index}) =>
                      <TouchableOpacity
                      onPress={() => this.IncrementDescription(item, index)}
                      style={{width: Bordy.width *0.5 * 0.1655, backgroundColor: index == this.state.selectedIndex?'#ea6721':item.StlBgColor.trim(), justifyContent:"center",alignItems:'center', borderRadius: 2, borderWidth:0.5, borderColor: 'white',}}>
                        <View style={{ justifyContent:"center",alignItems:'center', height: Bordy.height * 0.1, borderRadius: 2,  borderColor: 'white',}}>
                          <Text style={{ color: item.StlFontColor ? item.StlFontColor.trim(): '#000000', width: '100%',  textAlign: "center", fontSize: item.StlFontSize ? item.StlFontSize: H3_FONT_SIZE, }}>{item.MrqDescription}</Text>
                        </View>
                      </TouchableOpacity>}
                    />
            </View>
            <View style={{height:Bordy.height*0.6*0.1,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',borderBottomLeftRadius:10,borderBottomRightRadius:10,justifyContent:'space-evenly',flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.setModalNote(!modalNote)} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:'#af3037',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get("Trở lại")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this._Addnote()} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:isColor == true ? '#DAA520' :'#009900',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get('Xác nhận')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
          : null}
        <TouchableOpacity
          onPress={() => CartToggleHandle(false)}
          style={{ height: Bordy.height, width: Bordy.width * 0.25 }}
        ></TouchableOpacity>
        <Animated.View
          style={{height:Platform.OS === "android"? Bordy.height * 1.08: Bordy.height,
            width: state.FullCartWidth,
            backgroundColor: colors.white,
            borderColor: colors.grey3
          }}
        > 
          <View  name='pnContent' style={{ width: Bordy.width * 0.75,backgroundColor: isColor == true ? '#333333': 'white', flexDirection: "column", height: Bordy.height }}>
            <View style={{  height: Titlecf.height,  borderBottomColor: colors.grey3,  borderBottomWidth: 1,backgroundColor: colors.Header,  width: "100%", justifyContent: "center",   alignItems: "center",  flexDirection: "row" }}>
              <Text style={{ fontSize: H2FontSize, fontFamily: "RobotoBold", color: "white",  textAlign: "center" }}>
                {translate.Get("Giỏ hàng")}
              </Text>
            </View>
            <View style={{backgroundColor: isColor == true ? '#333333': '#cccccc', width: Bordy.width * 0.75, height: TabTitle.height, flexDirection: "row" ,justifyContent:'space-evenly',alignItems:'center'}}>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 20, backgroundColor: state.isHavingOrder == 1?  '#dc7d46': colors.grey3,width: '32%',height:'90%'
            }}
            onPress={() => {
                setState({ isHavingOrder: 1,iLoadNumber:state.iLoadNumber+1 });
            }} >
             <Text style={{ fontSize: H2FontSize,  color:"white",  textAlign: "center" }}>
                {translate.Get("Đang order")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 20, backgroundColor: state.isHavingOrder == 2 ? '#dc7d46': colors.grey3,width: '32%',height:'90%'
            }}
            onPress={() => {
              setState({isHavingOrder:2, iLoadNumber:state.iLoadNumber+1 });
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Đã order")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 20, backgroundColor: state.isHavingOrder == 3? '#dc7d46': colors.grey3,width: '32%',height:'90%'
            }}
            onPress={() => {
                setState({isHavingOrder:3,iLoadNumber:state.iLoadNumber+1 });
            }} >
             <Text style={{ fontSize: H2FontSize,  color:"white",  textAlign: "center" }}>
                {translate.Get("Lịch sử gọi món")}
              </Text>
            </TouchableOpacity>
            </View>
            <View style={{backgroundColor: isColor == true ? '#444444' :'#FFFFFF',  width: "100%",marginTop:1, height:Bordy.height-(Titlecf.height+TabTitle.height)
            }}>
            {state.isHavingOrder == 3 ?
            <ScrollView horizontal={true}>
              <View style={{flexDirection:'column',height:HeightHistory,width:Bordy.width * 0.75*2.28 }}>
              <View style={{flexDirection:'row',height:HeightHistory*0.05,width:Bordy.width * 0.75*2.28 }}>
                <FlatList
                numColumns={14}
                data={titleHitory}
                keyExtractor={(item, Index) => Index.toString()}
                renderItem={({ item, index })=>
                <View style={{backgroundColor:isColor == true ? '#232323' :'#C0C0C0', width:item.widthTitle, justifyContent:'center',alignItems:'center',height:HeightHistory*0.05,borderBottomWidth:0.5,borderRightWidth:0.5,borderTopWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                  <Text style={{fontSize:H3_FONT_SIZE*1.1,color:isColor == true ? '#FFFFFF' :'black',}}>{item.Name}</Text>
                </View>
                }
                />
                </View>
                <View style={{flexDirection:'row',height:HeightHistory*0.95,width:Bordy.width * 0.75*2.28}}>
                <FlatList
                refreshing={this.props.refreshing}
                onRefresh={_getTicketInforOnTable}
                data={TicketHitory}
                keyExtractor={(item, Index) => Index.toString()}
                renderItem={({ item, index })=>
                <View style={{width:'100%', flexDirection:'row',backgroundColor:item.TkdStatus == 3 ? '#AA0000':isColor == true ? '#333333' :'#EEEEEE',}}>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.06,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.STT}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'left',width:Bordy.width * 0.75*0.42,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:5}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.PrdNameUi ? item.PrdNameUi : item.PrdName}</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.1,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.UnitName}</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.1,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdQuantity}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.2,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',backgroundColor:item.TkdStatus == 3 ? '#AA0000':item.Color}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdStatusName ? item.TkdStatusName : ''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.25,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'left'}}>{item.TkdNote}</Text>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.2,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'left'}}>{item.TkdReason}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdOrderTime ? formatTime(item.TkdOrderTime):''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdStartCook ? formatTime(item.TkdStartCook):''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TkdFinishTime ? formatTime(item.TkdFinishTime):''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',alignItems:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',}}>{item.TotalTime ? formatTime(item.TotalTime):''}</Text>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.2,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'left'}}>{item.ObjOrderName}</Text>
                  </View>
                  <View style={{ justifyContent:'center',width:Bordy.width * 0.75*0.15,borderBottomWidth:0.5,borderRightWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',paddingHorizontal:8}}>
                    <Text style={{fontSize:H3_FONT_SIZE,color:isColor == true ? '#FFFFFF' :'black',textAlign:'right'}}>{formatCurrency(this.props.state.Config.B_ViewUnitPriceBefor ? item.TkdItemAmount : item.TkdTotalAmount, "")}</Text>
                  </View>
                </View>
                }
                />
                </View>
                </View>
            </ScrollView>
            :null
            }
            {state.isHavingOrder == 1 ? (
              <View style={{flexDirection:'column',height:HeightHistory,width:Bordy.width * 0.75}}>
              <View style={{flexDirection:'row',height:HeightHistory-(TabTitle.height*2.4 ),width:Bordy.width * 0.75}}>
              <FlatList
              keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={state.CartInfor.items}
              extraData={state.iLoadNumber}
              renderItem={this.renderOrder }
            /> 
              </View>
              <View style={{ height: TabTitle.height, width: "100%",  flexDirection: "column" }}>
              <View style={{ width: "100%", height: TabTitle.height, flexDirection: "row", backgroundColor:isColor == true ? '#222222' : colors.grey5 }}>
             
                  <View style={[styles.button_end_left_order, { width: "50%",textAlign:'left',paddingTop:(TabTitle.height-H2FontSize)/2  }]}> 
                    <Text style={{ fontSize: H3FontSize, color: isColor == true ? '#DAA520' : "#af3037",paddingLeft:10 }}>
                      {translate.Get("Số lượng")}: 
                      <Text style={{ fontSize: H3FontSize, color: isColor == true ? '#FFFFFF' :"black" }}>
                      {state.CartInfor.TotalQuantity}
                    </Text>
                      </Text>
                  </View>
                  <View style={[styles.button_end_left_order, { width: "50%",textAlign:'left',paddingTop:(TabTitle.height-H2FontSize)/2  }]}> 
                    <Text style={{ fontSize: H3FontSize, color:isColor == true ? '#DAA520' : "#af3037",paddingLeft:H2FontSize*0.2 }}>
                    {translate.Get("Thành tiền")}:
                      <Text style={{ fontSize: H3FontSize, color: isColor == true ? '#FFFFFF' :"black",paddingLeft:5 }}>
                      {formatCurrency(state.Config.B_ViewUnitPriceBefor ? state.CartInfor.ItemAmount : state.CartInfor.TotalAmount, "")}
                    </Text>
                      </Text>
                  </View>
              </View>
              <View style={{ backgroundColor: isColor == true ? '#444444' :'#FFFFFF',width: "100%", flexDirection: "row" ,height:TabTitle.height*1.4, justifyContent:'space-evenly',alignItems:'center'}}>
              <TouchableOpacity style={{justifyContent:'center', borderRadius: 8, backgroundColor:isColor == true ?'#009900':'#dc7d46',width: "48%",height:"80%"
            }}
            onPress={() => {
              CartToggleHandle(false);
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Đặt thêm")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 8, backgroundColor:!state.CartInfor.TotalQuantity||state.CartInfor.TotalQuantity <= 0 ?colors.grey0: '#af3037',width: "48%",height:"80%"
            }}
            onPress={() => {
             if(!state.CartInfor.TotalQuantity||state.CartInfor.TotalQuantity <= 0 )
             return;
             if (lockTable == true) 
             {
               this.setState({ showS_CodeHandleData: true });
              } else {
                Alert.alert(translate.Get("Notice"), translate.Get("Bạn có muốn gọi order không?"), [
                  {
                    text: translate.Get("BỎ QUA"),
                  },
                  {text: translate.Get("AlertOK"), onPress: () => onSendOrder(),}
                ]);
               

             }
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Gửi order")}
              </Text>
            </TouchableOpacity>

              </View>
            </View>
            </View>
            
          ) :null}
          { state.isHavingOrder == 2 ?
          (
            <ScrollView horizontal={true}>
            <View style={{flexDirection:'column',height:HeightOrdered,width:Bordy.width * 0.75*1.73 }}>
              <View style={{flexDirection:'row',height:HeightOrdered*0.055,width:Bordy.width * 0.75*1.73 }}>
              <FlatList
                numColumns={14}
                data={titleProductsOrdered}
                keyExtractor={(item, Index) => Index.toString()}
                renderItem={({ item, index })=>
                <View style={{backgroundColor:isColor == true ? '#232323' :'#C0C0C0', width:item.widthTitle, justifyContent:'center',alignItems:'center',height:HeightHistory*0.05,borderBottomWidth:0.5,borderRightWidth:0.5,borderTopWidth:0.5,borderColor:isColor == true ? '#FFFFFF' :'black',}}>
                  <Text style={{fontSize:H3_FONT_SIZE*1.1,color:isColor == true ? '#FFFFFF' :'black',}}>{item.Name}</Text>
                </View>
                }
                />
              </View>
              <View style={{flexDirection:'row',height:HeightOrdered*0.945,width:Bordy.width * 0.75*1.73}}>
              <FlatList
              keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={ProductsOrdered}
              extraData={state.iLoadNumber}
              refreshing={this.props.refreshing}
              onRefresh={_getTicketInforOnTable}
              renderItem={this.renderOrdered }
            /> 
              </View>
            </View>
            </ScrollView>
          ):null}
            {state.isHavingOrder == 2 ?
               <View  style={{bottom:0,position:'absolute',height:TabTitle.height,width: '100%',borderTopColor: isColor == true ? '#222222' :colors.grey5,
               borderTopWidth: 1,backgroundColor:isColor == true ? '#222222' : colors.grey5,
             }}>
               <View style={{width:'100%',alignItems: "left",flexDirection: "row",}}>
                <Text style={{color:isColor == true ? '#FFFFFF' : '#000000', fontSize: H2FontSize,marginLeft:10 }}>
                     {translate.Get("Tạm tính")}:
                     </Text>
                   <Text style={{ fontSize: H2FontSize, color:isColor == true ? '#DAA520' : colors.red,marginLeft:10 }}>
                   {formatCurrency(this.props.state.Config.B_ViewUnitPriceBefor ? state.table.Ticket.TkItemAmout : state.table.Ticket.TkTotalAmount, "")}
                 </Text>
                </View>
                <TouchableOpacity onPress={()=>{this.props._getTicketInforOnTable();}} style={{position:'absolute',right:5,height:'90%',width:'10%',backgroundColor:'#0099FF', borderWidth:0.5, borderRadius:5, justifyContent:'space-evenly',alignItems:'center',flexDirection:'row'}}>
                  <Icon name="reload1" type="antdesign" size={H1_FONT_SIZE} iconStyle={{ color: 'black', fontFamily: "RobotoBold",height:'100%'}} />
                  <Text style={{fontSize:H2_FONT_SIZE}}>{translate.Get("Tải lại")}</Text>
                </TouchableOpacity>
           </View>:null
            }
            </View>
            
          </View>
          {this.state.showS_CodeHandleData ?
            <View style={{
              backgroundColor:"rgba(98,98,98,0.6)", height: Bordy.height ,
              width: Bordy.width,
              position: 'absolute',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bottom: 0,
              right: 0
            }}>
              <KeyboardAvoidingView
                keyboardType='light'
                behavior="position"
                contentContainerStyle={styles.formContainer}
              >
                <View style={[{ borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth: 1, borderColor:isColor==true?'#DAA520': '#333D4C', backgroundColor:isColor==true?'#111111': '#333D4C', width: Bordy.width*0.4}]}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: isColor==true?'#111111':'#333D4C', width: '100%',
                    height: H2FontSize * 2, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderColor: '#333D4C', borderRadius: 2,
                  }}>
                    <Text style={{ fontSize: H3FontSize, color: colors.white, textAlign: 'center' }}>{translate.Get("NHẬP CODE")}</Text>
                  </View>
                  <View style={{ backgroundColor: isColor == true ? '#444444' : colors.white, justifyContent: 'center', alignItems: 'center', height: H1FontSize * 2.5, width: '100%', paddingTop: 5, }}>
                    <TextInput
                      ref={input => this.InputCode = input}
                      style={[{ fontSize: 16, paddingLeft: 10, paddingVertical: 5, backgroundColor: colors.white, textAlign: 'left', borderColor: '#5FA323', width: '90%', borderWidth: 1, borderRadius: 4, }]}
                      autoFocus={false}
                      autoCapitalize="none"
                      placeholder={translate.Get("Nhập mã ...")}
                      keyboardAppearance="dark"
                      keyboardType="default"
                      returnKeyType='done'
                      autoCorrect={false}
                      blurOnSubmit={false}
                      numberOfLines={5}
                      onChangeText={(Values) => {
                       this.setState({ KeyCode :Values})
                      }}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      value={this.state.KeyCode}
                      placeholderTextColor="#7384B4"
                    />
                  </View>
                  <View style={{  width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: H1FontSize * 2.5, backgroundColor:isColor == true ? '#444444' : colors.white }}>
                      <View style={{ flexDirection: 'column', width: '30%', justifyContent: "center", alignItems: 'center'}}>
            <TouchableOpacity style={{ width: '100%', justifyContent: "center", alignItems: 'center',backgroundColor:'#333D4C', borderWidth: 1, borderRadius: 5, borderColor: "#333D4C" }}
                onPress={() => this.setModalCallStaff(!ModalCallStaff)}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ this.state.showCall==false?require('../../../assets/icons/IconCall.png'):require('../../../assets/icons/iconCall_While.png') }
                style={[ BookingsStyle.header_logo,{ maxWidth: '20%',  height:H1FontSize*1.2,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontSize: H2FontSize * 0.6 }]}> {translate.Get("Gọi nhân viên")} </Text>
            </View>
             </TouchableOpacity>
            </View>
                    <View style={{ width:'30%', paddingVertical: 5 }}>
                      <LinearGradient
                        colors={["#EB353B", "#ED1E24", "#ED131A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderWidth: 1, borderRadius: 5, borderColor: "#ED1E24", height:  H1FontSize*1.2, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => {this.setState({ showS_CodeHandleData: false, }) }} style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                          <Text style={{ textAlign: 'center', width: '100%', color: 'white', }}>{translate.Get('BỎ QUA')}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    <View style={{ width:'30%', paddingVertical: 5 }}>
                      <LinearGradient
                        colors={["#5FA323", "#5FA323", "#5FA323"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderWidth: 1, borderRadius: 5, borderColor: "#5FA323", height: H1FontSize*1.2, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity  style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}
                        onPress={() => {
                          this._AcceptCode();
                       }} >
                          <Text style={{ textAlign: 'center', width: '100%', color: 'white', }}>{translate.Get('AlertOK')}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            : null}

          {state.isWorking ? (
            <View style={styles.item_view_text}>
              <ActivityIndicator
                color={colors.primary}
                size="large"
              ></ActivityIndicator>
            </View>
          ) : null}
        </Animated.View>
      </View>
    );
  };

 styles = StyleSheet.create({
  formContainer: {
    marginTop: H2FontSize / 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#5FA323',
  },
  button_order: {
    color: colors.grey1,
    fontSize: H1FontSize * 0.8,
    fontFamily: "RobotoBold"
  },
  button_end_left_order: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: H1FontSize * 0.25
  },
  button_end_right_order: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: H1FontSize * 0.25
  },
  item_text_end: {
    height: Bordy.height * 0.08
  },
  item_text_right_end: {
    height: Bordy.height * 0.08
  },
  item_text_center: {
    width: "40%",
    justifyContent: "center"
  },
  CurrentItemItemContainer: { width: '100%', flexDirection: "row", justifyContent: "space-around", height: 25, },
  CurrentItemItemBox: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  CurrentItemItemText: { color: "#000000", fontSize: H2FontSize * 0.8, textAlign: 'center' },
});
}