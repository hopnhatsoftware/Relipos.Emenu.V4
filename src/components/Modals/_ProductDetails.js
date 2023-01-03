import React from "react";
import {View, Text, TouchableOpacity, ImageBackground, ScrollView,Dimensions, Image} from "react-native";
import colors from "../../config/colors";
import {ITEM_FONT_SIZE,H1FontSize, H2FontSize, H3FontSize, H4FontSize  } from "../../config/constants";
import * as Font from "expo-font";
import { formatCurrency, getTableColor } from "../../services/util";
import Question from '../../components/Question';
import { Colors } from "react-native/Libraries/NewAppScreen";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
export class ProductDetails extends React.Component {
  state = {
    isPostBack:true
  };
  async componentDidMount() {
    try {
    await this._BindingFont();
  } catch (ex) {
    console.log('ProductDetails componentDidMount Error :' + ex)
  }
}
  _BindingFont = async () => {
    try {
      await Font.loadAsync({
        RobotoBlack: require("../../../assets/fonts/Roboto-Black.ttf"),
        RobotoBlackItalic: require("../../../assets/fonts/Roboto-BlackItalic.ttf"),
        RobotoBold: require("../../../assets/fonts/Roboto-Bold.ttf"),
        RobotoBoldCondensed: require("../../../assets/fonts/Roboto-BoldCondensed.ttf"),
        RobotoBoldItalic: require("../../../assets/fonts/Roboto-BoldItalic.ttf"),
        RobotoItalic: require("../../../assets/fonts/Roboto-Italic.ttf"),
        RobotoThinItalic: require("../../../assets/fonts/Roboto-ThinItalic.ttf"),
        RobotoThin: require("../../../assets/fonts/Roboto-Thin.ttf"),
        RobotoMedium: require("../../../assets/fonts/Roboto-Medium.ttf"),
        RobotoRegular: require("../../../assets/fonts/Roboto-Regular.ttf"),
        RobotoBoldCondensedItalic: require("../../../assets/fonts/Roboto-BoldCondensedItalic.ttf"),
        RobotoCondensed: require("../../../assets/fonts/Roboto-Condensed.ttf"),
        RobotoCondensedItalic: require("../../../assets/fonts/Roboto-CondensedItalic.ttf"),
        RobotoLightItalic: require("../../../assets/fonts/Roboto-LightItalic.ttf"),
        RobotoMediumItalic: require("../../../assets/fonts/Roboto-MediumItalic.ttf"),
        RobotoLight: require("../../../assets/fonts/Roboto-Light.ttf"),
      });
    } catch (ex) {
      
    }
    return true;
  };
  _ProductDetailsCheckDetail = async (item, index) => {
    const { CartItemHandle} = this.props;
    let currentIndex=-1;
    CartItemHandle.subItems.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        currentIndex=index
        return currentIndex;
      }}); 
if (currentIndex<0) 
CartItemHandle.subItems.push(item);
else  
CartItemHandle.subItems.splice(currentIndex, 1);
if (!('Json' in CartItemHandle) ) 
CartItemHandle.Json = '';
if (CartItemHandle.subItems.length>0)
if (CartItemHandle.subItems.length>0)
CartItemHandle.Json = JSON.stringify(CartItemHandle.subItems);

this.setState({ CartItemHandle });
  };
  render() {
    const { iProduct,CartItemHandle,CartProductIndex,ProductDetailsAccept,translate,ChoisetDetails,endpoint,onRollBack,ProductChoiseIndex} = this.props;
    //console.log('ProductDetails ProductChoiseIndex:'+ProductChoiseIndex);
    let pnBottonHeight=SCREEN_HEIGHT*0.15;
    if (ChoisetDetails.length<=0)
    pnBottonHeight=pnBottonHeight-H4FontSize;
    let pnBottonCenterHeight=pnBottonHeight-H3FontSize-20;
    if (ChoisetDetails.length>0)
    pnBottonCenterHeight=pnBottonCenterHeight-H4FontSize;
    let SubWidth=(SCREEN_WIDTH*0.7)/ChoisetDetails.length;
    let SubContentWidth=SubWidth-H3FontSize;
    let pnBottonRightWidth=SCREEN_WIDTH*0.2;
  
    return (
      <View  style={{  position: "absolute", right: 0,  top: 0, alignContent: "center", justifyContent: "center",  width: SCREEN_WIDTH, height: SCREEN_HEIGHT,  backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
        <ScrollView horizontal={true} scrollEventThrottle={16}  scrollEnabled={true}  style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, }]}
          onScrollBeginDrag={() => {
            onRollBack(CartItemHandle, CartProductIndex,iProduct, ProductChoiseIndex, 1);
          }} >
          <View  style={{  justifyContent: "center",  alignItems: "center", flexDirection: "column", width: SCREEN_WIDTH,height: SCREEN_HEIGHT,backgroundColor: colors.white, }}>
            <ImageBackground resizeMode='contain' 
              source={ iProduct.PrdImageUrl ? { uri:  endpoint + iProduct.PrdImageUrl, } : require("../../../assets/icons/ReliposEmenu_4x.png")
              }
              style={[{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}/>
              {iProduct.SttId && iProduct.SttId == 3 ?
                <View style={{ position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 5, right: 5,  paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%' }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_like.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
                </View>
                : null}
              {iProduct.SttId && iProduct.SttId == 2 ?
                <View style={{ position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 5, right: 5, paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%' }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_new.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
                </View>
                : null}
              <View style={{ position: "absolute", left: 0, height: SCREEN_HEIGHT,  justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: Platform.OS === "android" ? 10 : 20, }}>
                <TouchableOpacity style={{ height: SCREEN_HEIGHT, width: '50%', justifyContent: "center", alignItems: "center" }}
                  onPress={() => {
                    onRollBack(CartItemHandle, CartProductIndex,iProduct, ProductChoiseIndex, 2);
                     }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_left.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                </TouchableOpacity>
              </View>
              <View style={{ position: "absolute", right: 0, height: SCREEN_HEIGHT, justifyContent: "flex-end", alignItems: "flex-end", paddingRight: Platform.OS === "android" ? 10 : 20, }}>
                <TouchableOpacity style={{ height: SCREEN_HEIGHT, width: '50%', justifyContent: "center", alignItems: "center" }}
                  onPress={() => {  
                    onRollBack(CartItemHandle, CartProductIndex,iProduct, ProductChoiseIndex, 1);
                   }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_right.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                </TouchableOpacity>
              </View>
              <View  name='pnCenter' style={{ flexDirection: 'row', flexWrap: "wrap", height: pnBottonHeight, width: '100%',  position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', overflow: "hidden", }}>
                <ImageBackground resizeMode="stretch" source={require("../../../assets/icons/v2/GradientView.png")} style={[{ width: '100%', height: '100%', flexDirection: 'row' }]}>
                  <View style={{  padding: 10, width: "100%", height:pnBottonHeight, }}>
                  <View style={{ flexDirection: 'row', height: H3FontSize, width:'100%', }}>
                          <Text numberOfLines={5} style={{  color: "#FFFFFF", width: "80%",  fontSize: H3FontSize, fontFamily: "RobotoBold",}} numberOfLines={3}>
                            {iProduct.PrdName} 
                          </Text>
                         <Text style={{ color: "#FFFFFF", fontFamily: "RobotoBold", width: "20%",textAlign:'right',fontSize: H3FontSize,paddingLeft: ITEM_FONT_SIZE}} numberOfLines={3}>
                        {translate.Get('Price') + ': ' + formatCurrency(iProduct.UnitPrice, "")}
                      </Text>
                        </View>
                        <View style={{ flexDirection: 'row', height: pnBottonHeight-H3FontSize, width:'100%'}}>
                        <View style={{  width:SCREEN_WIDTH-pnBottonRightWidth-10, height: '100%'}}>
                        <View style={{  width: '100%',height:pnBottonCenterHeight}}>
                        <Text style={{  color: "#FFFFFF", fontSize: H4FontSize}} numberOfLines={4}>
                          {iProduct.PrdDescription}
                        </Text>
                        </View>
                       {(ChoisetDetails&&ChoisetDetails.length>0)?
                        <View style={{ width: '100%',flexDirection: 'row',height:H4FontSize }}>
                              { 
                                ChoisetDetails.map((item, index) => {
                                  let subExists = false;
                                  if (CartItemHandle!=null&&CartItemHandle.subItems!=undefined&&CartItemHandle.subItems!=null) {
                                    CartItemHandle.subItems.forEach((detail, index) => {
                                      if (detail.PrdId==item.PrdId) {
                                        subExists=true;
                                        return subExists;
                                      }
                                    });
                                  }
                                  return (
                                    <View style={{ width:SubWidth,flexDirection: 'row', justifyContent: "flex-start", alignItems:"flex-start" }}>
                                       <View style={{ width: H4FontSize,justifyContent: "center", alignItems: "center" }}>
                                    {subExists ?
                                      <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" ,width:H4FontSize}}
                                        onPress={() => {
                                          this._ProductDetailsCheckDetail(item, index);
                                        }}>
                                        <Image resizeMode="stretch" source={require('../../../assets/icons/v2/iconCheckOn.png')}
                                          style={{ width: H4FontSize, height: H4FontSize, }} />
                                      </TouchableOpacity>
                                      :
                                      <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" ,width:H4FontSize}}
                                        onPress={() => {
                                          this._ProductDetailsCheckDetail(item, index);
                                        }}>
                                        <Image resizeMode="stretch" source={require('../../../assets/icons/v2/iconCheckOff.png')}
                                          style={{ width: H4FontSize, height: H4FontSize, }} />
                                      </TouchableOpacity>
                                    }
                                    </View>
                                    <TouchableOpacity style={{ width: SubContentWidth, justifyContent: "center", alignItems: "center" }}
                                    onPress={() => {
                                      this._ProductDetailsCheckDetail(item, index);
                                    }}>
                                    <View style={{ width: '100%', justifyContent: "center", alignItems: "center" }}>
                                      <Text style={{ width: '100%',height:H4FontSize,fontSize: H4FontSize, color: 'white',textAlign:'left',paddingLeft:5 }}>{item.PrdName}</Text>
                                    </View>
                                  </TouchableOpacity>
                                  </View>
                                  );
                                })
                              }
                            </View> 
                       :null
                      }
                       </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',width:pnBottonRightWidth }}>
                        {CartItemHandle && CartItemHandle.OrddQuantity > 0 ?
                          <TouchableOpacity style={{  justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                              CartItemHandle.OrddQuantity--;
                              if (CartItemHandle.OrddQuantity < 0) 
                              CartItemHandle.OrddQuantity = 0;
                              this.setState({ CartItemHandle });
                            }}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/IconDelete.png')}
                              style={{ width: H1FontSize*1.2 , height: H1FontSize*1.2, }} />
                          </TouchableOpacity>
                          :
                          <View style={{justifyContent: "center", alignItems: "center" }}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_btnGiamGrey.png')}
                              style={{ width: H1FontSize*1.2, height: H1FontSize*1.2, }} />
                          </View>
                        }
                        <Text style={{ width:pnBottonRightWidth-(H1FontSize*1.2*3+10), color: "#FFFFFF", fontSize: H1FontSize, textAlign: "center", fontFamily: "RobotoBold"}}>
                          {CartItemHandle ? CartItemHandle.OrddQuantity : '0'}
                        </Text>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                          onPress={() => {
                            CartItemHandle.OrddQuantity++;
                            this.setState({ CartItemHandle }); 
                          }} >
                          <Image resizeMode="stretch" source={require('../../../assets/icons/IconAdd.png')}
                            style={{ width: H1FontSize*1.2, height: H1FontSize*1.2, }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                          onPress={() => {
                            if (iProduct.PrdViewSetMenuType && iProduct.PrdViewSetMenuType == 2&&CartItemHandle.OrddQuantity>0) 
                              if (CartItemHandle.subItems==undefined||CartItemHandle.subItems==null||CartItemHandle.subItems.length<=0) {
                                Question.alert( translate.Get("Thông Báo"), translate.Get("Vui lòng chọn chi tiết món!") );
                                return;
                              }
                             // console.log('ProductDetails CartItemHandle:'+JSON.stringify(CartItemHandle));
                              //console.log('ProductDetails CartProductIndex:'+JSON.stringify(CartProductIndex));
                              ProductDetailsAccept(CartItemHandle, CartProductIndex,true);
                          }}>
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View5.png')}
                            style={{ width: H1FontSize*1.2, height: H1FontSize*1.2, }} />
                        </TouchableOpacity>
                      </View>
                          </View>
                       
                  </View>
                  
                </ImageBackground>
              </View>

          </View>
        </ScrollView>
      </View>
    )
  }
}
