import React from "react";
import {
  View, Text, TouchableOpacity, ImageBackground, ScrollView,
  Dimensions, Image, TouchableHighlight, FlatList, Alert
} from "react-native";
import colors from "../../config/colors";
import { Button, Icon, CheckBox } from "react-native-elements";
import Constants from "expo-constants";
import {
  ITEM_FONT_SIZE
} from "../../config/constants";
import * as Font from "expo-font";
import { formatCurrency, getTableColor } from "../../services/util";
import Question from '../../components/Question';
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_BARHEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;

export class ProductDetails extends React.Component {
  state = {
    top: 0,
  };
  async componentDidMount() {
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
  }

  render() {
    const { itemPrd, indexPrd, cart, BookingsStyle, ProductSetMenuId, setState, t, onChangeQty, onRollBack, CurrentSet, CheckIconSet, iSelectPrd, AcceptSet, endpoint, PrdSetData } = this.props;
    let CartIndex = cart.ind;
    let CartItem = cart.prd;
    console.log('PrdSetData', PrdSetData);
    console.log('Product Image',
      itemPrd.PrdImageUrl
        ? {
          uri:
            endpoint +
            itemPrd.PrdImageUrl,
        }
        : require("../../../assets/icons/ReliposEmenu_4x.png")
    );
    return (
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          alignContent: "center",
          justifyContent: "center",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}>
        <ScrollView horizontal={true}
          scrollEventThrottle={16}
          scrollEnabled={true}
          onScrollBeginDrag={() => {
            onRollBack(itemPrd, indexPrd, 1)
          }}
          style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, }]}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              backgroundColor: colors.white,
            }}>
            <ImageBackground
              resizeMode="stretch"
              // source={itemPrd.PrdImage ? { uri: `data:image/gif;base64,${itemPrd.PrdImage}` } : { uri: link + '/Images/NoImage.jpg' }}
              source={
                itemPrd.PrdImage ? { uri: `data:image/gif;base64,${itemPrd.PrdImage}` } : (
                  itemPrd.PrdImageUrl
                    ? {
                      uri:
                        endpoint +
                        itemPrd.PrdImageUrl,
                    }
                    : require("../../../assets/icons/ReliposEmenu_4x.png")
                )
              }
              style={[{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
              {itemPrd.SttId && itemPrd.SttId == 3 ?
                <View style={{
                  position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 10, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%'
                }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_like.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
                </View>
                : null}
              {itemPrd.SttId && itemPrd.SttId == 2 ?
                <View style={{
                  position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 10, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%'
                }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_new.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
                </View>
                : null}
              <View style={{
                position: "absolute", left: 0, height: SCREEN_HEIGHT,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: Platform.OS === "android" ? 10 : 20,
              }}>
                <TouchableOpacity style={{ height: SCREEN_HEIGHT, width: '50%', justifyContent: "center", alignItems: "center" }}
                  onPress={() => { onRollBack(itemPrd, indexPrd, 2) }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_left.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                </TouchableOpacity>
              </View>
              <View style={{
                position: "absolute", right: 0, height: SCREEN_HEIGHT,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                paddingRight: Platform.OS === "android" ? 10 : 20,
              }}>
                <TouchableOpacity style={{ height: SCREEN_HEIGHT, width: '50%', justifyContent: "center", alignItems: "center" }}
                  onPress={() => { onRollBack(itemPrd, indexPrd, 1) }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_right.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                </TouchableOpacity>
              </View>

              <View style={{
                flexDirection: 'row', flexWrap: "wrap", height: '20%', width: '100%',
                position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center',
                overflow: "hidden",
              }}>
                <ImageBackground
                  resizeMode="stretch"
                  source={require("../../../assets/icons/v2/GradientView.png")}
                  style={[{ width: '100%', height: '100%', flexDirection: 'row' }]}>
                  <View style={{ flexDirection: "row", justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 10, width: "70%", height: '100%', }}>
                    <View style={{
                      flexDirection: "column", justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 10,
                      width: '100%', paddingTop: 10,
                      height: '100%',
                    }}>
                      <View style={{
                        flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', height: '40%',
                        width: '100%',
                      }}>
                        <View style={{
                          flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%',
                          width: itemPrd.PrdIsSetMenu == true && (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2) ? '50%' : '100%',
                        }}>
                          <Text numberOfLines={5} style={{
                            color: "#FFFFFF", width: "95%", paddingTop: 10,
                            fontSize: ITEM_FONT_SIZE * 1.15, fontFamily: "RobotoBold",
                          }} numberOfLines={3}>
                            {itemPrd.PrdName}
                          </Text>
                        </View>
                        {itemPrd.PrdIsSetMenu == true && (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2) ?
                          <View style={{
                            flexDirection: "row", justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 10,
                            width: "50%",
                            height: '100%',
                          }}>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: "center" }}>
                              {
                                PrdSetData.map((item, index) => {
                                  let subExists = iSelectPrd == item.PrdId;
                                  return (
                                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                                      <View style={{ width: '100%', flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                                        <View style={{ width: '15%', justifyContent: "center", alignItems: "center" }}>
                                          {subExists ?
                                            <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                                              onPress={() => {
                                                CheckIconSet(item, index);
                                              }}>
                                              <Image resizeMode="stretch" source={require('../../../assets/icons/v2/iconCheckOn.png')}
                                                style={{ width: ITEM_FONT_SIZE, height: ITEM_FONT_SIZE, }} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                                              onPress={() => {
                                                CheckIconSet(item, index);
                                              }}>
                                              <Image resizeMode="stretch" source={require('../../../assets/icons/v2/iconCheckOff.png')}
                                                style={{ width: ITEM_FONT_SIZE, height: ITEM_FONT_SIZE, }} />
                                            </TouchableOpacity>
                                          }
                                        </View>
                                        <TouchableOpacity style={{ width: '85%', justifyContent: "center", alignItems: "center" }}
                                          onPress={() => {
                                            CheckIconSet(item, index);
                                          }}>
                                          <View style={{ width: '100%', justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontSize: ITEM_FONT_SIZE * 0.8, color: 'white', }}>{item.PrdName}</Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  );
                                })
                              }
                            </View>
                          </View>
                          : null}
                      </View>
                      <View style={{
                        justifyContent: 'flex-start', alignItems: 'flex-start', height: '60%',
                        width: itemPrd.PrdIsSetMenu == true ? (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2 ? "50%" : '100%') : '100%',
                      }}>
                        <Text style={{
                          color: "#FFFFFF",
                          width: itemPrd.PrdIsSetMenu == true ? (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2 ? SCREEN_WIDTH * 0.7 : '95%') : '95%',
                          fontSize: ITEM_FONT_SIZE * 0.8
                        }} numberOfLines={4}>
                          {itemPrd.PrdDescription}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: "column", justifyContent: 'flex-end', alignItems: 'flex-end', width: "30%", height: '100%', paddingTop: 10, }}>
                    <View style={{ position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingRight: 15 }}>
                      <Text style={{
                        color: "#FFFFFF", fontFamily: "RobotoBold", width: "100%",
                        fontSize: ITEM_FONT_SIZE * 1.2, paddingLeft: ITEM_FONT_SIZE
                      }} numberOfLines={3}>
                        {t._('Price') + ': ' + formatCurrency(itemPrd.UnitPrice, "")}
                      </Text>
                    </View>
                    {itemPrd.PrdIsSetMenu == true ? (
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {itemPrd && itemPrd.Qty > 0 ?
                          <TouchableOpacity style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
                            onPress={() => {
                              itemPrd.Qty--;
                              if (itemPrd.Qty < 0) {
                                itemPrd.Qty = 0;
                              }
                              setState({ itemPrd });
                            }}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View3.png')}
                              style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                          </TouchableOpacity>
                          :
                          <View style={{ padding: 15, justifyContent: "center", alignItems: "center" }}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_btnGiamGrey.png')}
                              style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                          </View>
                        }
                        <Text style={{
                          color: "#FFFFFF", paddingTop: SCREEN_HEIGHT * 0.005, paddingRight: 5,
                          fontSize: ITEM_FONT_SIZE * 1.5, textAlign: "center", fontFamily: "RobotoBold"
                        }}>
                          {itemPrd ? itemPrd.Qty : '0'}
                        </Text>
                        <TouchableOpacity style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
                          onPress={() => {
                            if (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2) {
                              itemPrd.Qty++;
                              setState({ itemPrd });
                            }
                            else {
                              ProductSetMenuId(itemPrd, indexPrd)
                            }
                          }}
                        >
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View4.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                          onPress={() => {
                            if (itemPrd.PrdViewSetMenuType && itemPrd.PrdViewSetMenuType == 2) {
                              if (iSelectPrd < 0) {
                                Question.alert(
                                  t._("Thông Báo"),
                                  t._("Vui lòng chọn chi tiết món!")
                                );
                                setState({ itemPrd });
                                return;
                              }
                              else {
                                AcceptSet(itemPrd, indexPrd);
                              }
                            }
                            else {
                              ProductSetMenuId(itemPrd, indexPrd)
                            }
                          }}>
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View5.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity>
                      </View>
                    )
                      :
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {CartItem && CartItem.Qty > 0 ?
                          <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                            onPress={() => onChangeQty(itemPrd, indexPrd, 2)}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View3.png')}
                              style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                          </TouchableOpacity>
                          :
                          <View style={{ padding: 10, justifyContent: "center", alignItems: "center" }}>
                            <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_btnGiamGrey.png')}
                              style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                          </View>
                        }
                        <Text style={{ color: "#FFFFFF", paddingTop: SCREEN_HEIGHT * 0.005, fontSize: ITEM_FONT_SIZE * 1.5, textAlign: "center", fontFamily: "RobotoBold" }}>
                          {CartItem ? CartItem.Qty : 0}
                        </Text>
                        <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                          onPress={() => onChangeQty(itemPrd, indexPrd, 1)}>
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View4.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                          onPress={() => setState({ SelectedProduct: null, SelectedProductIndex: -1 })}>
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View5.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                </ImageBackground>
              </View>

            </ImageBackground>
          </View>
        </ScrollView>
      </View>
    )
  }
}