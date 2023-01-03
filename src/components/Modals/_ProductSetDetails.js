import React from "react";
import {
  View, Text, TouchableOpacity,
  Dimensions, Image, TouchableHighlight, ImageBackground
} from "react-native";
import colors from "../../config/colors";
import Constants from "expo-constants";
import {
  ITEM_FONT_SIZE
} from "../../config/constants";
import { formatCurrency, getTableColor } from "../../services/util";
import Question from '../../components/Question';
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_BARHEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;

export class ProductSetDetails extends React.Component {
  componentDidMount() {
  }

  render() {
    const { item, index, cart, BookingsStyle, setState, translate, onChangeQty, endpoint } = this.props;
    CartIndex = cart.ind;
    CartItem = cart.prd;
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
        }}
      >
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
            // source={item.PrdImage ? { uri: `data:image/gif;base64,${item.PrdImage}` } : { uri: link + '/Images/NoImage.jpg' }}
            source={
              item.PrdImage ? { uri: `data:image/gif;base64,${item.PrdImage}` } : (
                item.PrdImageUrl
                  ? {
                    uri:
                      endpoint +
                      item.PrdImageUrl,
                  }
                  : require("../../../assets/icons/ReliposEmenu_4x.png")
              )
            }
            style={[{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
            {item.SttId && item.SttId == 3 ?
              <View style={{
                position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 10, right: 0,
                paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%'
              }}>
                <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_like.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
              </View>
              : null}
            {item.SttId && item.SttId == 2 ?
              <View style={{
                position: "absolute", paddingTop: ITEM_FONT_SIZE, top: 10, right: 0,
                paddingRight: Platform.OS === "android" ? 13 : 26, width: '10%'
              }}>
                <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_new.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
              </View>
              : null}
            {/* <View style={{
              position: "absolute", left: 0, height: SCREEN_HEIGHT,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: Platform.OS === "android" ? 10 : 20,
            }}>
              <TouchableOpacity style={{ height: SCREEN_HEIGHT, width: '50%', justifyContent: "center", alignItems: "center" }}
                onPress={() => { onRollBack(item, index, 2) }}>
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
                onPress={() => { onRollBack(item, index, 1) }}>
                <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_right.png')}
                  style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
              </TouchableOpacity>
            </View> */}

            <View style={{
              flexDirection: 'row', flexWrap: "wrap", height: '20%', width: '100%',
              position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center',
              overflow: "hidden",
              // backgroundColor: "rgba(0, 0, 0, 0.3)", 
            }}>
              <ImageBackground
                resizeMode="stretch"
                source={require("../../../assets/icons/v2/GradientView.png")}
                style={[{ width: '100%', height: '100%', flexDirection: 'row' }]}>
                <View style={{ flexDirection: "column", justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 10, width: "70%", height: '100%', }}>
                  <Text numberOfLines={5} style={{
                    color: "#FFFFFF", width: "95%",
                    fontSize: ITEM_FONT_SIZE * 1.2, fontFamily: "RobotoBold",
                  }} >
                    {item.PrdName}
                  </Text>
                  <Text style={{ color: "#FFFFFF", width: "95%", paddingTop: ITEM_FONT_SIZE / 2, fontSize: ITEM_FONT_SIZE }} numberOfLines={3}>
                    {item.PrdNo}
                  </Text>
                  <Text style={{ color: "#FFFFFF", width: "95%", paddingTop: ITEM_FONT_SIZE / 2, fontSize: ITEM_FONT_SIZE * 0.8 }} numberOfLines={6}>
                    {item.PrdDescription}
                  </Text>
                </View>

                <View style={{ flexDirection: "column", justifyContent: 'flex-end', alignItems: 'flex-end', width: "30%", height: '100%' }}>
                  <View style={{ position: 'absolute', top: 0, justifyContent: 'center', alignItems: 'center', paddingRight: 15 }}>
                    <Text style={{
                      color: "#FFFFFF", fontFamily: "RobotoBold", width: "100%",
                      fontSize: ITEM_FONT_SIZE * 1.2, paddingLeft: ITEM_FONT_SIZE
                    }} numberOfLines={3}>
                      {translate.Get('Price') + ': ' + formatCurrency(item.UnitPrice > 0 ? item.UnitPrice : 0, "")}
                    </Text>
                  </View>
                  {item.PrdIsSetMenu == true ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{
                        color: "#FFFFFF", paddingTop: SCREEN_HEIGHT * 0.005, paddingRight: 10,
                        fontSize: ITEM_FONT_SIZE * 1.5, textAlign: "center", fontFamily: "RobotoBold"
                      }}>
                        {CartItem ? CartItem.Quantity : '0'}
                      </Text>
                      {CartItem ?
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                          onPress={() =>
                            setState({
                              showSetInCart: true,
                              SelectedProduct: CartItem,
                              SelectedProductIndex: CartIndex
                            })
                          }>
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View4.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity> :
                        <TouchableOpacity style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
                          onPress={() => ProductSetMenuId(item, index)}
                        >
                          <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View4.png')}
                            style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                        </TouchableOpacity>
                      }
                      <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                        onPress={() => setState({ SelectedProduct: null, SelectedProductIndex: -1 })}>
                        <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View5.png')}
                          style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
                      </TouchableOpacity>
                    </View>
                  )
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      {CartItem && CartItem.Quantity > 0 ?
                        <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                          onPress={() => onChangeQty(item, index, 2)}>
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
                        {CartItem ? CartItem.TksdQuantity : 0}
                      </Text>
                      <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }}
                        onPress={() => onChangeQty(item, index, 1)}>
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
      </View>
    )
  }
}