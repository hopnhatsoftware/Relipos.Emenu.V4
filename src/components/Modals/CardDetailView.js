import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Animated, Platform, FlatList, ActivityIndicator, KeyboardAvoidingView, Keyboard,
  Dimensions
} from "react-native";
import { Audio } from 'expo-av';
import colors from "../../config/colors";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import { _retrieveData, _storeData, _remove } from "../../services/storages";
import { H1FontSize,H2FontSize,H3FontSize,H4FontSize,H3_FONT_SIZE } from "../../config/constants";
import { formatCurrency, formatNumber } from "../../services/util";
import Question from '../Question';

const Bordy={
  width:Dimensions.get("window").width,
  height:Dimensions.get("window").height //- Constants.statusBarHeight
} 
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
      IsLoaded:false,
      KeyCode:'',
      showCall:false,
      sound:null,
      showS_CodeHandleData:false
    }
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
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        
        this.setState({ showCall:false })
      }
    }
  };
  _LoadSound= async () => {
    try{
      const { state} = this.props;
      let { sound} = this.state;
      if (sound==null) {
      sound= new Audio.Sound();
    await sound.loadAsync({uri:state.endpoint+ '/Resources/Sound/RingSton.mp3'});
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
    try{
        let { showCall,sound } = this.state;
        if (sound==null) 
        sound=  await this._LoadSound();
        const { onCallServices } = this.props; 
      if (sound==null)
          return;
        if (showCall) 
        {
          await sound.stopAsync();
          this.setState({ showCall: false })
        }  
        else {
          onCallServices(); 
          this.setState({ showCall: true });
          sound.setPositionAsync(0);
        await sound.playAsync();
     }
    }catch(ex){
      this.setState({ showCall:false })
      console.log('_HandleSound Error :'+ex)
    }
    }
  componentWillUnmount= async () => 
  {
    let { sound} = this.state;
    if (sound!=null) {
      await sound.unloadAsync();
        this.setState({ showCall: false,sound:null})
    }
  }
    componentDidMount= async () => {
      this.setState({IsLoaded:true ,KeyCode:''});
      await this._LoadSound();
      
    };
  _HandleQuantity = async (item,OrddQuantity,isReplace) => {
    try {
      const { HandleQuantity,state  } = this.props;
      HandleQuantity(item,OrddQuantity,isReplace);
      state.iLoadNumber=state.iLoadNumber+1;
     setState({state });
    } catch (error) {
      console.log('AddQuantity Error:'+error);
      return null;
    } 
  };
  onPressNext = async () => {
    this.props.onPressNext();
  }
  
  _AcceptCode= async () => {
    let { setState, onSendOrder, translate, settings} = this.props;
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
    }
  // Đã Order
  
  renderOrdered= ({ item, RowIndex }) => {
    const { BookingsStyle, ProductsOrdered} = this.props;
    console.log(ProductsOrdered)
    if (item.TkdQuantity <= 0&&item.TksdQuantity<=0)
    return null;
      return (
        <View style={{ width: Contentcf.width, justifyContent:'flex-start', borderBottomColor: colors.grey5, borderBottomWidth: 1,paddingTop:1,paddingBottom:1, marginLeft: 2 }}>
       
       {item.TkdType==0||item.TkdType==1?
        <View style={{ width: Contentcf.width, flexDirection: "row"}}> 
            <Text  style={{  color: "#000000", width: Contentcf.width * 0.05, fontSize: H3_FONT_SIZE,textAlign:'right',paddingRight:5  }} >
              {formatNumber(item.TkdQuantity)}
            </Text>
            <Text  style={[ BookingsStyle.left_menu_Item,
                {
                  color: "#000000",
                  marginRight: 10,
                  width: Contentcf.width-(Contentcf.width * 0.05+Contentcf.width*0.1*2+20),
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: H3_FONT_SIZE,
                }
              ]}
            >
              {item.PrdName}
            </Text>
            <Text style={{
                color: "#000000",
                width:Contentcf.width*0.1,
                justifyContent: 'center',
                fontSize: H3_FONT_SIZE,
                textAlign: "right"
              }}>
              {formatCurrency(item.TkdBasePrice, "")}
            </Text>
            <Text style={{
                color: "#000000",
                width:Contentcf.width*0.1,
                justifyContent: 'center',
                fontSize: H3_FONT_SIZE,
                textAlign: "right"
              }}>
              {formatCurrency(item.TkdItemAmount, "")}
            </Text>
          </View>
          :
          <View style={{ width: Contentcf.width, flexDirection: "row"}}> 
         
          <Text  style={[ BookingsStyle.left_menu_Item,
              {
                color: "#000000",
                marginRight: 10,
               width: Contentcf.width-(Contentcf.width*0.1*2+20),
                justifyContent: "center",
                alignItems: "center",
                fontSize: H4FontSize,
                paddingLeft: Bordy.width * 0.03
              }
            ]}
          >
            {'  #'+formatNumber(item.TksdQuantity)} {item.PrdName}
          </Text>
          <Text style={{
                color: "#000000",
                width:Contentcf.width*0.1,
                justifyContent: 'center',
                fontSize: H3FontSize,
                textAlign: "right"
              }}>
              {formatCurrency(item.TkdBasePrice, "")}
            </Text>
          <Text style={{
              color: "#000000",
              width:Contentcf.width*0.1,
              justifyContent: 'center',
              fontSize: H4FontSize,
             
              textAlign: "right"
            }}>
            {formatCurrency(item.TkdBasePrice*item.TksdQuantity, "")}
          </Text>
        </View>}
        </View>
      ); 
  };
  // Đang Order
  renderOrder = ({ item, RowIndex }) => {
    let {_addExtraRequestToItem} = this.props;
    const Column1=Contentcf.width* 0.17;
    const QuantityWidth=Column1-H2FontSize*3;-2
    return (
      <View style={{ width: Contentcf.width,height:'auto', justifyContent:'flex-start', borderBottomColor: colors.grey5, borderBottomWidth: 1, marginLeft: 1 }}>
        <View style={{ width: Contentcf.width, paddingTop:1,paddingBottom:1}}> 
        <View style={{ width: Contentcf.width, flexDirection: "row"}}> 
        <View style={{  flexDirection: "row",  justifyContent: "center", width: Column1 }} >
         { (!item.PrdIsSetMenu) ?
            <TouchableOpacity  style={{width: H2FontSize, justifyContent: "center", alignItems: 'flex-start'  }} onPress={() => this._HandleQuantity(item, -1, false)}>
              <Image resizeMode="stretch" source={require('../../../assets/icons/IconDelete.png')} 
              style={{ width: H2FontSize,height: H2FontSize,  }} />
            </TouchableOpacity>:   
            <TouchableOpacity style={{ width: H2FontSize,justifyContent: "center", alignItems: "flex-start" }}  onPress={() => { this._HandleQuantity(item,-1,false) }}>
            <Icon name="close"  type="antdesign" size={H2FontSize}  iconStyle={{ color: colors.red,  fontFamily: "RobotoBold",height:H2FontSize}} />
          </TouchableOpacity> 
          }
            <View style={{ width: QuantityWidth,marginLeft:2,  height: 'auto',  justifyContent: 'center', alignItems: 'center'}}>
              <TextInput ref={input => this.textInput = input}  style={{  color: "#af3037", width: '100%',  fontSize: H3FontSize, textAlign:'center',fontFamily: "RobotoBold",}}
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
           
           <TouchableOpacity name='btnAddQuantity' style={{width: H2FontSize, height: H2FontSize, justifyContent: "center", alignItems: "center" }} onPress={() =>{
               if (item.PrdIsSetMenu)
               return;
               this._HandleQuantity(item, 1, false)
               }}>
            {!item.PrdIsSetMenu ? 
            <Image resizeMode="stretch" source={require('../../../assets/icons/IconAdd.png')} 
            style={{ width: H2FontSize, height: H2FontSize, }} />
           : null
          }
           </TouchableOpacity>
           <TouchableOpacity style={{ width: H2FontSize,justifyContent: "center", alignItems: "flex-start" }}  onPress={() => { 
            _addExtraRequestToItem(item, RowIndex);
              }}>
            <Icon name='edit'  type="antdesign" size={H2FontSize}  iconStyle={{ color: colors.red,  fontFamily: "RobotoBold",height:H2FontSize}} />
          </TouchableOpacity> 
            </View>

          <View style={{ width: Contentcf.width* 0.555, justifyContent:'center', }}>
            <Text style={{  width: Contentcf.width* 0.555, fontSize: H3_FONT_SIZE,  flexWrap: "wrap",textAlign:'left', }} numberOfLines={5}>
              {item.PrdName}
            </Text> 
            {item.OrddDescription?
            <Text style={{  width: Contentcf.width* 0.555, fontSize: H3_FONT_SIZE,  flexWrap: "wrap",textAlign:'left', }} numberOfLines={5}>
               {item.OrddDescription}
            </Text> 
            :null
            }
           
          </View>
          <View style={{  justifyContent:'center',width: Contentcf.width* 0.1 ,}}>
            <Text style={{ fontSize: H3_FONT_SIZE ,textAlign:'right' }}>
             {(item.OrddTotalChoiseAmount&&item.OrddTotalChoiseAmount>0)?
              formatCurrency(item.OrddTotalChoiseAmount, ""):
              formatCurrency(item.UnitPrice, "")
               }
            </Text>
          </View>
          <View style={{  justifyContent: "center",width: Contentcf.width* 0.15 ,}}>
            <Text style={{  fontSize: H3_FONT_SIZE,fontWeight:'bold',textAlign:'right' }}>
            {formatCurrency(item.TkdItemAmount, "")}
            </Text>
          </View>
          </View>
        {item.PrdIsSetMenu == true&&item.subItems&&item.subItems?
          <View style={{ width: Bordy.width * 0.75 - 13, flexDirection: "row", }}>
            <FlatList keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={item.subItems && typeof item.subItems != 'undefined' ? item.subItems : []}
              renderItem={this.RenderSubItem}
              contentContainerStyle={{ backgroundColor: colors.white, borderColor: colors.grey4 }}
            />
          </View>:null
        }
      </View>
      </View>
    );
  };
  RenderSubItem = ({ item, RowIndex }) => {
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
          <Text style={{  fontSize: H4FontSize,textAlign:'left'}}>
           {item.TksdQuantity}
            </Text> 
            <Text style={{  fontSize: H4FontSize,textAlign:'left',textAlignVertical:'bottom'}}>
            {'# '}
            </Text> 
            <Text style={{ fontSize: H4FontSize,  flexWrap: "wrap",textAlign:'left'}}>
         {item.PrdName}
            </Text> 
          </View>
          <View style={{  justifyContent:'center',width: Contentcf.width* 0.1 ,}}>
            <Text style={{ fontSize: H4FontSize ,textAlign:'right' }}>
              {formatCurrency(item.TksdPrice, "")}
            </Text>
          </View>
          <View style={{ justifyContent: "center",width: Contentcf.width* 0.15 ,}}>
           
          </View>
          </View>
      )};
  render() {
    let { state,setState, onSendOrder, BookingsStyle, CartToggleHandle,onPressNext, translate, settings, ProductsOrdered} = this.props;
    console.log(ProductsOrdered)
    if (!this.state.IsLoaded) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      );
    }
    if(typeof(state.isHavingOrder)==undefined||state.isHavingOrder ==null)
    state.isHavingOrder=true; 
    return ( 
      <View name='vwMash' style={{ position: "absolute", right: 0, top: 0,flexDirection: "row",
          justifyContent: "space-between",width: Bordy.width, height: Bordy.height*2,
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}
      > 
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
          <View  name='pnContent' style={{ width: Bordy.width * 0.75, flexDirection: "column", height: Bordy.height }}>
            <View style={{  height: Titlecf.height,  borderBottomColor: colors.grey3,  borderBottomWidth: 1,
                backgroundColor: colors.Header,  width: "100%", justifyContent: "center",   alignItems: "center",  flexDirection: "row"
              }}
            >
              <Text style={{ fontSize: H2FontSize, fontFamily: "RobotoBold", color: "white",  textAlign: "center" }}>
                {translate.Get("Giỏ Hàng")}
              </Text>
            </View>
            <View style={{ width: Bordy.width * 0.75, height: TabTitle.height, flexDirection: "row" }}>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 0, backgroundColor: state.isHavingOrder?  '#dc7d46': colors.grey3,width: "50%"
            }}
            onPress={() => {
                setState({ isHavingOrder: true,iLoadNumber:state.iLoadNumber+1 });
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Đang Order")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 0, backgroundColor: !state.isHavingOrder ? '#dc7d46': colors.grey3,width: "50%"
            }}
            onPress={() => {
              setState({isHavingOrder:false, iLoadNumber:state.iLoadNumber+1 });
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Đã Order")}
              </Text>
            </TouchableOpacity>
             
            </View>
            <View style={{ width: "100%",marginTop:1, 
            height:Bordy.height-(Titlecf.height+TabTitle.height+(state.isHavingOrder ?TabTitle.height*2:0))
            }}>
            <FlatList
              keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={state.isHavingOrder ? state.CartInfor.items : ProductsOrdered }
              extraData={state.iLoadNumber}
              renderItem={state.isHavingOrder ? this.renderOrder : this.renderOrdered}
              contentContainerStyle={BookingsStyle.item_order}
            /> 
            </View>
            {state.isHavingOrder ? (
            <View style={{ height: TabTitle.height*2, width: "100%",  flexDirection: "column" }}>
              <View style={{ width: "100%", height: TabTitle.height, flexDirection: "row", backgroundColor: colors.grey5 }}>
             
                  <View style={[styles.button_end_left_order, { width: "50%",textAlign:'left',paddingTop:(TabTitle.height-H2FontSize)/2  }]}> 
                    <Text style={{ fontSize: H3FontSize, color: "#af3037",paddingLeft:10 }}>
                      {translate.Get("Số lượng")}: 
                      <Text style={{ fontSize: H3FontSize, color: "black" }}>
                      {state.CartInfor.TotalQuantity}
                    </Text>
                      </Text>
                  </View>
                  <View style={[styles.button_end_left_order, { width: "50%",textAlign:'left',paddingTop:(TabTitle.height-H2FontSize)/2  }]}> 
                    <Text style={{ fontSize: H3FontSize, color: "#af3037",paddingLeft:H2FontSize*0.2 }}>
                    {translate.Get("Thành tiền")}:
                      <Text style={{ fontSize: H3FontSize, color: "black",paddingLeft:5 }}>
                      {formatCurrency(state.CartInfor.TotalAmount, "")}
                    </Text>
                      </Text>
                  </View>
              </View>
              <View style={[BookingsStyle.bottombar, { width: "100%", flexDirection: "row" ,height:TabTitle.height}]}>
              <TouchableOpacity style={{justifyContent:'center', borderRadius: 0, backgroundColor:'#dc7d46',width: "50%"
            }}
            onPress={() => {
              CartToggleHandle(false);
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Đặt thêm")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent:'center', borderRadius: 0, backgroundColor:!state.CartInfor.TotalQuantity||state.CartInfor.TotalQuantity <= 0 ?colors.grey0: '#af3037',width: "50%"
            }}
            onPress={() => {
             if(!state.CartInfor.TotalQuantity||state.CartInfor.TotalQuantity <= 0 )
             return;
             if (settings.B_CustomerSendOrder != true) 
             {
               this.setState({ showS_CodeHandleData: true });
              } else {
               Question.alert(translate.Get("Notice"),
                 translate.Get("Bạn có muốn gọi order không?"),
                 [
                   { text: translate.Get('BỎ QUA'), onPress: () => { } },
                   {
                     text: translate.Get('OK'),
                     onPress: () => {
                       onSendOrder();
                     }
                   }
                 ]
               );

             }
            }} >
             <Text style={{ fontSize: H2FontSize,  color: "white",  textAlign: "center" }}>
                {translate.Get("Gửi Order")}
              </Text>
            </TouchableOpacity>

              </View>
            </View>
          ) : (
            <View  style={{height:H2FontSize*2,width: "100%",
                position: "absolute", flexDirection: "row",
                bottom: 0,right: 0,borderTopColor: colors.grey5,
                borderTopWidth: 1,backgroundColor: colors.grey5,
                alignContent:'center',justifyContent:'space-between'
              }}>
                <View style={{width:'50%',flexDirection: "row",alignItems: "center"}}>
                <Text style={{ fontSize: H2FontSize,marginLeft:10 }}>
                      {translate.Get("Tạm tính")}:
                      </Text>
                    <Text style={{ fontSize: H2FontSize, color: colors.red,marginLeft:10 }}>
                    {state.table.Ticket ? formatCurrency(state.table.Ticket.TkItemAmout, "") : ""}
                  </Text>
                </View>
                <TouchableOpacity 
                onPress={()=>{this.onPressNext()}} 
             style={{  height: "100%", width: "50%",shadowColor: "#000",shadowOffset: {width: 0,height: 3},shadowOpacity: 0.27,shadowRadius: 4.65,elevation: 6,justifyContent: "center", alignItems: "center", backgroundColor: '#00adee' }}>
              <Text style={{ textAlign: "center",color:'#FFFFFF',fontFamily: "RobotoBold", width: "100%", fontSize: H2FontSize}}>Thanh toán</Text>
            </TouchableOpacity>
            </View>
          )}
          </View>
          {this.state.showS_CodeHandleData ?
            <View style={{
              backgroundColor: "rgba(98,98,98,0.6)", height: Bordy.height ,
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
                <View style={[{ borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth: 1, borderColor: '#333D4C', backgroundColor: '#333D4C', width: Bordy.width*0.4}]}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333D4C', width: '100%',
                    height: H2FontSize * 2, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderColor: '#333D4C', borderRadius: 2, borderWidth: 2,
                  }}>
                    <Text style={{ fontSize: H3FontSize, color: colors.white, textAlign: 'center' }}>{translate.Get("NHẬP CODE")}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', height: H1FontSize * 2.5, width: '100%', paddingTop: 5, }}>
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
                  <View style={{  width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: H1FontSize * 2.5, backgroundColor: colors.white }}>
                      <View style={{ flexDirection: 'column', width: '30%', justifyContent: "center", alignItems: 'center'}}>
            <TouchableOpacity style={{ width: '100%', justifyContent: "center", alignItems: 'center',backgroundColor:'#333D4C', borderWidth: 1, borderRadius: 5, borderColor: "#333D4C" }}
                onPress={() => {  this._HandleSound();
                }}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ this.state.showCall==false?require('../../../assets/icons/IconCall.png'):require('../../../assets/icons/iconCall_While.png') }
                style={[ BookingsStyle.header_logo,{ maxWidth: '20%',  height:H1FontSize*1.2,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontSize: H2FontSize * 0.6 }]}> {this.state.showCall==false?translate.Get("Gọi nhân viên"):translate.Get("Đang gọi ..")} </Text>
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