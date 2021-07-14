import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Animated, Platform, FlatList, ActivityIndicator, KeyboardAvoidingView, Keyboard,
  Dimensions
} from "react-native";
import colors from "../../config/colors";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import { H1FontSize,H2FontSize,H3FontSize,H4FontSize } from "../../config/constants";
import { _storeData } from "../../services/storages";
import { formatCurrency } from "../../services/util";
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
  // Đã Order
  renderOrdered= ({ item, RowIndex }) => {
    const { BookingsStyle } = this.props;
    console.log('Render renderOrdered'+JSON.stringify(item))
    if (item.TkdQuantity <= 0)
    return null;
      return (
        <View style={{ width: Contentcf.width, justifyContent:'flex-start', borderBottomColor: colors.grey5, borderBottomWidth: 1,paddingTop:1,paddingBottom:1, marginLeft: 2 }}>
        <View style={{ width: Contentcf.width, flexDirection: "row"}}> 
            <Text  style={{  color: "#000000", width: Bordy.width * 0.05, fontSize: H2FontSize,  }} >
              {item.TkdQuantity}
            </Text>
            <Text  style={[ BookingsStyle.left_menu_Item,
                {
                  color: "#000000",
                  marginRight: 10,
                  width: Bordy.width * 0.5 - 25,
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: H2FontSize
                }
              ]}
            >
              {item.PrdName}
            </Text>
            <Text style={{
                color: "#000000",
                width: Bordy.width * 0.2,
                justifyContent: 'center',
                fontSize: H3FontSize,
                paddingRight: 15,
                textAlign: "right"
              }}>
              {formatCurrency(item.TkdTotalAmount, "")}
            </Text>
          </View>
        </View>
      ); 
  };
  // Đang Order
  renderOrder = ({ item, RowIndex }) => {
    const Column1=Contentcf.width* 0.17;
    const ImageWidth=Column1*0.3;
    const QuantityWidth=Column1*0.4;
    return (
      <View style={{ width: Contentcf.width,height:'auto', justifyContent:'flex-start', borderBottomColor: colors.grey5, borderBottomWidth: 1, marginLeft: 1 }}>
        <View style={{ width: Contentcf.width, flexDirection: "row", paddingTop:1,paddingBottom:1}}> 
        <View style={{  flexDirection: "row",  justifyContent: "center", width: Column1 }} >
         { (!item.PrdIsSetMenu) ?
            <TouchableOpacity  style={{width: ImageWidth, justifyContent: "center", alignItems: 'flex-start'  }} onPress={() => this._HandleQuantity(item, -1, false)}>
              <Image resizeMode="stretch" source={require('../../../assets/icons/IconDelete.png')} 
              style={{ width: ImageWidth*0.7,height: ImageWidth*0.7,  }} />
            </TouchableOpacity>:   
            <TouchableOpacity style={{ width: ImageWidth,justifyContent: "center", alignItems: "flex-start" }}  onPress={() => { this._HandleQuantity(item,-1,false) }}>
            <Icon name="close"  type="antdesign" size={ImageWidth*0.7}  iconStyle={{ color: colors.red,  fontFamily: "RobotoBold",width:ImageWidth*0.7,height:ImageWidth*0.7}} />
          </TouchableOpacity> 
          }
            <View style={{ width: QuantityWidth,  height: 'auto',  justifyContent: 'center', alignItems: 'center'}}>
          
              <TextInput ref={input => this.textInput = input}  style={{  color: "#af3037", width: '100%',  fontSize: H3FontSize, textAlign:'left',fontFamily: "RobotoBold",}}
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
          
            <TouchableOpacity name='btnAddQuantity' style={{width: ImageWidth, height: ImageWidth, justifyContent: "center", alignItems: "center" }} onPress={() =>{
               if (item.PrdIsSetMenu)
               return;
               this._HandleQuantity(item, 1, false)
               }}>
            {!item.PrdIsSetMenu ? 
            <Image resizeMode="stretch" source={require('../../../assets/icons/IconAdd.png')} 
            style={{ width: ImageWidth*0.7, height: ImageWidth*0.7, }} />
           : null
          }
           </TouchableOpacity>
            
          </View>
          <View style={{ width: Contentcf.width* 0.555, justifyContent:'center', }}>
            <Text style={{  width: Contentcf.width* 0.555, fontSize: H3FontSize,  flexWrap: "wrap",textAlign:'left', }} numberOfLines={5}>
              {item.PrdName}
            </Text> 
          </View>
          <View style={{  justifyContent:'center',width: Contentcf.width* 0.1 ,}}>
            <Text style={{ fontSize: H3FontSize ,textAlign:'right' }}>
             {(item.OrddTotalChoiseAmount&&item.OrddTotalChoiseAmount>0)?
              formatCurrency(item.OrddTotalChoiseAmount, ""):
              formatCurrency(item.UnitPrice, "")
               }
            </Text>
          </View>
          <View style={{  justifyContent: "center",width: Contentcf.width* 0.15 ,}}>
            <Text style={{  fontSize: H3FontSize,fontWeight:'bold',textAlign:'right' }}>
            {formatCurrency(item.TkdTotalAmount, "")}
            </Text>
          </View>
          </View>
        {item.PrdIsSetMenu == true&&item.subItems&&item.subItems?
          <View style={{ width: Bordy.width * 0.75 - 13, flexDirection: "row", }}>
            <FlatList keyExtractor={(item, RowIndex) => RowIndex.toString()}
              data={item.subItems && typeof item.subItems != 'undefined' ? item.subItems : []}
              renderItem={this.renderCurrentItem}
              contentContainerStyle={{ backgroundColor: colors.white, borderColor: colors.grey4 }}
            />
          </View>:null
        }
      </View>
    );
  };
  renderCurrentItem = ({ item, RowIndex }) => {
    const { translate } = this.props;
    return (
        <View style={{ width: Contentcf.width, flexDirection: "row",paddingBottom:2,paddingTop:2 }}>
        <View style={{  flexDirection: "row",  justifyContent: "center", width: Contentcf.width* 0.17 }} >
            <View style={{ width: Contentcf.width*0.07,  justifyContent: 'center', alignItems: 'center'}}>
           
            </View>
          </View>
          <View style={{ width: Contentcf.width* 0.555, justifyContent:'center', marginLeft: Contentcf.width* 0.005, }}>
            <Text style={{  width: '100%', fontSize: H4FontSize,  flexWrap: "wrap",textAlign:'left'}}>
           {item.TksdQuantity}{translate.Get('.')}{item.PrdName}
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
  componentDidMount(){
    console.log('componentDidMount');
  };
  render() {
    
    let { state,setState, onGetInfor, onSendOrder, BookingsStyle, CartToggleHandle, translate, settings, ProductsOrdered} = this.props;
   
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
            <View style={{ width: "100%", height: TabTitle.height, flexDirection: "row" }}>
              <Button title={translate.Get("Đang Order")}
                containerStyle={{ width: "50%" }}
                titleStyle={styles.button_order,{fontSize: H2FontSize}}
                buttonStyle={{  borderRadius: 0, backgroundColor: state.isHavingOrder?  '#dc7d46': colors.grey3 }}
                onPress={() =>{
                 setState({ isHavingOrder: true,iLoadNumber:state.iLoadNumber+1 });
                  console.log('state.isHavingOrder:'+state.isHavingOrder)
                } } />
              <Button
                onPress={() => {
                  setState({isHavingOrder:false, iLoadNumber:state.iLoadNumber+1 } ,() => {
                    onGetInfor();
                    console.log('state.isHavingOrder:'+state.isHavingOrder)
                  });
                }}
                title={translate.Get("Đã Order")}
                containerStyle={{ width: "50%" }}
                titleStyle={styles.button_order,{fontSize: H2FontSize}}
                buttonStyle={{ borderRadius: 0, backgroundColor: !state.isHavingOrder ? '#dc7d46': colors.grey3  }}
              />
            </View>
            <View style={{ width: "100%",marginTop:1, height:Bordy.height-(Titlecf.height+TabTitle.height+(state.isHavingOrder ?TabTitle.height*2:0))}}>
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
                    <Text style={{ fontSize: H2FontSize, color: "#af3037",paddingLeft:H2FontSize*0.2 }}>
                      {translate.Get("Số lượng")}: 
                      <Text style={{ fontSize: H2FontSize, color: "black" }}>
                      {state.CartInfor.TotalQuantity}
                    </Text>
                      </Text>
                  </View>
                  <View style={[styles.button_end_left_order, { width: "50%",textAlign:'left',paddingTop:(TabTitle.height-H2FontSize)/2  }]}> 
                    <Text style={{ fontSize: H2FontSize, color: "#af3037",paddingLeft:H2FontSize*0.2 }}>
                    {translate.Get("Thành tiền")}:
                      <Text style={{ fontSize: H2FontSize, color: "black",paddingLeft:5 }}>
                      {formatCurrency(state.CartInfor.TotalAmount, "")}
                    </Text>
                      </Text>
                  </View>
              </View>
              <View style={[BookingsStyle.bottombar, { width: "100%", flexDirection: "row" ,height:TabTitle.height}]}>
                <Button
                  onPress={() => CartToggleHandle(false)}
                  title={translate.Get("Đặt thêm")}
                  containerStyle={{ backgroundColor: "#dc7d46", width: "50%" }}
                  titleStyle={{ fontSize: H2FontSize }}
                  buttonStyle={{ backgroundColor: "#dc7d46", padding: H1FontSize * 0.25 }}
                ></Button>
                <Button  disabled={ !state.CartInfor.TotalQuantity||state.CartInfor.TotalQuantity <= 0   }
                  titleStyle={{ fontSize: H2FontSize }}
                  buttonStyle={{ backgroundColor: "#af3037", padding: H1FontSize * 0.25 }}
                  title={translate.Get("Gửi Order")}
                  containerStyle={{ backgroundColor: "#af3037", width: "50%" }}
                  onPress={() => {
                    if (settings.B_CustomerSendOrder == true) {
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
                        ],
                        { cancelable: false }
                      );

                    }
                    else {
                     setState({ showS_CodeHandleData: true });
                    }
                  }}
                 
                ></Button>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: (!isNaN(state.table.Ticket.TkServiceChargeAmout) && state.table.Ticket.TkServiceChargeAmout > 0) ? Bordy.height * 0.16 : Bordy.height * 0.08,
                width: "100%",
                position: "absolute",
                flexDirection: "column",
                bottom: 0,
                right: 0,
                borderTopColor: colors.grey5,
                borderTopWidth: 1,
                backgroundColor: colors.grey5
              }}
            >
              {
                (!isNaN(state.table.Ticket.TkServiceChargeAmout) && state.table.Ticket.TkServiceChargeAmout > 0) ?
                  <View style={{ width: "100%", height: Bordy.height * 0.08, flexDirection: "row" }}>
                    <View style={[styles.item_text_right_end,
                    { paddingLeft: H1FontSize * 0.25, width: "60%", justifyContent: "center", alignItems: "flex-start" }]}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: H1FontSize, color: colors.orange4 }}>
                          {translate.Get("Thuế và Phí")}
                        </Text>
                        <TouchableOpacity onPress={() => setState({ ShowFeesInfo: true })}>
                          <Icon
                            name="questioncircle"
                            type="antdesign"
                            containerStyle={{
                              marginLeft: H2FontSize ,
                              justifyContent: "center"
                            }}
                            size={H2FontSize}
                            iconStyle={{
                              color: colors.primary,
                              fontFamily: "RobotoBold"
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.item_text_right_end, styles.item_text_center, { paddingRight: H1FontSize * 0.25, alignItems: "flex-end" }]}>
                      <Text style={{ fontSize: H1FontSize, color: colors.orange4 }}>
                        {state.table.Ticket ? formatCurrency(state.table.Ticket.TkServiceChargeAmout, "") : ""}
                      </Text>
                    </View>
                  </View>
                  : null
              }
              <View style={{ width: "100%", height: H2FontSize*1.5, flexDirection: "row", borderTopColor: colors.white, borderTopWidth: 1 }}>
                <View style={[styles.item_text_right_end, styles.item_text_center, { width: "50%", paddingLeft: H2FontSize * 0.25, justifyContent: 'center', alignItems: "center" }]}>
                  <View style={{ flexDirection: "row", width: '100%', }}>
                    <Text style={{ fontSize: H2FontSize }}>
                      {translate.Get("Tạm tính")}:
                      </Text>
                    <Text style={{ fontSize: H2FontSize, color: colors.red,marginLeft:10 }}>
                    {state.table.Ticket ? formatCurrency(state.table.Ticket.TkTotalAmount, "") : ""}
                  </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          </View>
         

          {state.showS_CodeHandleData ?
            <View style={{
              backgroundColor: "rgba(98,98,98,0.6)", height: Bordy.height + Constants.statusBarHeight + 100,
              width: Bordy.width,
              position: 'absolute',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bottom: 0,
              right: 0,
              borderTopColor: '#5FA323',
              borderTopWidth: 1
            }}>
              <KeyboardAvoidingView
                keyboardType='light'
                behavior="position"
                contentContainerStyle={styles.formContainer}
              >
                <View style={[{ borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 2, borderColor: '#5FA323', backgroundColor: '#5FA323', width: Bordy.width / 2 }]}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FA323', width: '100%',
                    height: H1FontSize * 2.5, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderColor: '#5FA323', borderRadius: 2, borderWidth: 2,
                  }}>
                    <Text style={{ fontSize: 18, color: colors.white, textAlign: 'center' }}>{translate.Get("NHẬP CODE")}</Text>
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
                      onChangeText={(KeyCode) => {
                       setState({ KeyCode })
                      }}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      value={KeyCode}
                      placeholderTextColor="#7384B4"
                    />
                  </View>
                  <View style={{
                    width: '100%', flexDirection: 'row', justifyContent: 'space-evenly',
                    alignItems: 'center', height: H1FontSize * 2.5, backgroundColor: colors.white,
                  }}>
                    <View style={{ width: '40%', paddingVertical: 10 }}>
                      <LinearGradient
                        colors={["#EB353B", "#ED1E24", "#ED131A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderWidth: 1, borderRadius: 16, borderColor: "#ED1E24", height: 32, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => {setState({ showS_CodeHandleData: false, }) }} style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                          <Text style={{ textAlign: 'center', width: '100%', color: 'white', }}>{translate.Get('BỎ QUA')}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    <View style={{ width: '40%', paddingVertical: 10 }}>
                      <LinearGradient
                        colors={["#5FA323", "#5FA323", "#5FA323"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderWidth: 1, borderRadius: 16, borderColor: "#5FA323", height: 32, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => {
                          if (settings.S_CodeHandleData) {
                            if (settings.S_CodeHandleData == KeyCode) {
                             setState({ showS_CodeHandleData: false, }, () => {
                                onSendOrder();
                              });
                            }
                            else {
                             setState({ showS_CodeHandleData: true, }, () => {
                                Question.alert(
                                  translate.Get("Thông báo"),
                                  translate.Get("Bạn đã nhập code sai, vui lòng liên hệ với nhân viên!")
                                )
                              });
                            }
                          }
                          else {
                           setState({ showS_CodeHandleData: true, }, () => {
                              Question.alert(
                                translate.Get("Thông báo"),
                                translate.Get("Bạn không có quyền gọi order, vui lòng liên hệ với nhân viên!")
                              )
                            });
                          }
                        }} style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
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