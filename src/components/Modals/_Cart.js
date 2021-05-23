import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableHighlight, Image,
  Animated, Platform, FlatList, ActivityIndicator, KeyboardAvoidingView, Alert, Keyboard,
  Dimensions
} from "react-native";
import colors from "../../config/colors";
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import {
  ITEM_FONT_SIZE, BUTTON_FONT_SIZE
} from "../../config/constants";
import { _storeData } from "../../services/storages";
import { formatCurrency } from "../../services/util";
import Question from '../../components/Question';
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_BARHEIGHT = Dimensions.get("window").height;
const SCREEN_HEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: ITEM_FONT_SIZE / 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#5FA323',
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE * 0.8,
    fontFamily: "RobotoBold"
  },
  button_end_left_order: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: BUTTON_FONT_SIZE * 0.25
  },
  button_end_right_order: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: BUTTON_FONT_SIZE * 0.25
  },
  item_text_end: {
    height: SCREEN_HEIGHT * 0.08
    // paddingTop:BUTTON_FONT_SIZE * 0.12,
  },
  item_text_right_end: {
    height: SCREEN_HEIGHT * 0.08
    // paddingTop:BUTTON_FONT_SIZE * 0.12,
  },
  item_text_center: {
    width: "40%",
    justifyContent: "center"
  },
  CurrentItemItemContainer: { width: '100%', flexDirection: "row", justifyContent: "space-around", height: 25, },
  CurrentItemItemBox: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  CurrentItemItemText: { color: "#000000", fontSize: ITEM_FONT_SIZE * 0.8, textAlign: 'center' },
});
export class _Cart extends React.Component {
  textInput = null;
  state = {
    showS_CodeHandleData: false,
    KeyCode: '',
    TimeToNextBooking: 0,
  };

  renderHistory = ({ item, index }) => {
    const { BookingsStyle } = this.props;
    if (item.TkdQuantity > 0) {
      return (
        <View
          style={{
            width: SCREEN_WIDTH * 0.75,
            justifyContent: 'center',
            height: SCREEN_HEIGHT * 0.08,
            borderBottomColor: colors.grey5,
            borderBottomWidth: 1,
            paddingTop: 2,
            paddingLeft: 13
          }}
        >
          <View style={{ width: SCREEN_WIDTH * 0.75, flexDirection: "row", }}>
            <Text
              style={{
                color: "#000000",
                width: SCREEN_WIDTH * 0.05,
                fontSize: ITEM_FONT_SIZE,
              }}
            >
              {item.TkdQuantity}
            </Text>
            <Text
              style={[
                BookingsStyle.left_menu_Item,
                {
                  color: "#000000",
                  marginRight: 10,
                  width: SCREEN_WIDTH * 0.5 - 25,
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: ITEM_FONT_SIZE,
                  height: 'auto',
                }
              ]}
            >
              {item.PrdName}
            </Text>
            <Text
              style={{
                color: "#000000",
                width: SCREEN_WIDTH * 0.2,
                justifyContent: 'center',
                fontSize: ITEM_FONT_SIZE,
                paddingRight: 15,
                textAlign: "right"
              }}
            >
              {formatCurrency(item.TkdTotalAmount, "")}
            </Text>
          </View>
        </View>
      );
    }
  };

  renderCartItem = ({ item, index }) => {
    const { state, setState, onChangeQty, deleteItemCart, t } = this.props;

    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.75 - 10,
          // height: item.PrdIsSetMenu == true && (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) ? SCREEN_HEIGHT * 0.18 : SCREEN_HEIGHT * 0.08,
          justifyContent: "center",
          borderBottomColor: colors.grey5,
          borderBottomWidth: 1,
          marginLeft: 3
        }}
      >
        <View style={{ width: SCREEN_WIDTH * 0.75 - 13, flexDirection: "row", }}>
          <View style={{ height: SCREEN_HEIGHT * 0.08, justifyContent: "center", paddingLeft: 10, }}>
            <Text
              style={{
                color: "#000000",
                width: SCREEN_WIDTH * 0.46 - 15,
                fontSize: ITEM_FONT_SIZE,
                flexWrap: "wrap"
              }}
            >
              {item.PrdName}
            </Text>
          </View>

          <View style={{ height: SCREEN_HEIGHT * 0.08, justifyContent: "center", }}>
            <Text
              style={{
                color: "#FF0000",
                width: SCREEN_WIDTH * 0.14,
                fontSize: ITEM_FONT_SIZE
              }}
            >
              {formatCurrency(item.UnitPrice, "")}
            </Text>
          </View>
          {!item.PrdIsSetMenu ?
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: SCREEN_WIDTH * 0.17,
                paddingRight: ITEM_FONT_SIZE,
                paddingTop: SCREEN_HEIGHT * 0.04 - ITEM_FONT_SIZE * 1.3,
              }}
            >
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => onChangeQty(item, index, 2)}>
                <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View3.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.8, height: ITEM_FONT_SIZE * 1.8, }} />
              </TouchableOpacity>
              <View style={{
                width: ITEM_FONT_SIZE * 2.6,
                height: SCREEN_HEIGHT * 0.07,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TextInput
                  ref={input => this.textInput = input}
                  style={{
                    color: "#af3037",
                    width: 'auto',
                    fontSize: ITEM_FONT_SIZE * 0.8,
                    textAlign: "center",
                    fontFamily: "RobotoBold",
                  }}
                  autoFocus={false}
                  autoCapitalize="none"
                  keyboardAppearance="dark"
                  keyboardType="numeric"
                  returnKeyType='default'
                  blurOnSubmit={false}
                  onBlur={() => { setState({ state }); }}
                  value={item.Qty ? item.Qty.toString() : '0'}
                  onChangeText={(textInput) => {
                    item.Qty = textInput;
                  }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    let existed = false;
                    state.Cart.items.forEach(product => {
                      if (product.PrdId == item.PrdId) {
                        existed = true;
                        if (item.Qty <= 0) {
                          state.Cart.items.splice(index, 1);
                        }
                        return existed;
                      }
                    });
                    if (!existed) {
                      item.Qty = item && item.Qty > 0 ? item.Qty : 1;
                      state.Cart.items.push(item);
                    }
                    state.Cart.Qty = 0;
                    state.Cart.Amount = 0;
                    state.Cart.items.forEach(product => {
                      state.Cart.Qty = parseFloat(state.Cart.Qty) + parseFloat(product.Qty);
                      state.Cart.Amount = state.Cart.Amount + (parseFloat(product.UnitPrice) * product.Qty);
                    });
                    setState({ state }, () => _storeData("APP@CART", JSON.stringify(state.Cart)));
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {/* <Text style={{ color: "#af3037", fontSize: ITEM_FONT_SIZE * 1.2, fontFamily: "RobotoBold" }}>
                  {item.Qty}
                </Text> */}

              </View>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => onChangeQty(item, index, 1)}>
                <Image resizeMode="stretch" source={require('../../../assets/icons/v2/icon_View4.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.6, height: ITEM_FONT_SIZE * 1.8, }} />
              </TouchableOpacity>
            </View>
            :

            <View
              style={{
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: 'center',
                height: SCREEN_HEIGHT * 0.07,
                width: SCREEN_WIDTH * 0.21
              }}>
              <Text style={{ color: "#af3037", fontSize: ITEM_FONT_SIZE * 1.2, fontFamily: "RobotoBold" }}>
                {item.Qty}
              </Text>
              <TouchableOpacity style={{ paddingLeft: ITEM_FONT_SIZE * 0.8, alignItems: "flex-end" }}
                onPress={() => { deleteItemCart(item, index) }}>
                <Icon
                  name="close"
                  type="antdesign"
                  size={ITEM_FONT_SIZE * 1.8}
                  iconStyle={{
                    color: colors.red,
                    fontFamily: "RobotoBold"
                  }}
                />
              </TouchableOpacity>
            </View>
          }
        </View>
        {item.PrdIsSetMenu == true && (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) ?
          <View style={{ width: SCREEN_WIDTH * 0.75 - 13, flexDirection: "row", }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={item.Details[0].subItems && typeof item.Details[0].subItems != 'undefined' ? item.Details[0].subItems : []}
              renderItem={this.renderCurrentItem}
              contentContainerStyle={{ backgroundColor: colors.white, borderColor: colors.grey4 }}
            />
          </View>
          : null}
      </View>
    );
  };

  renderCurrentItem = ({ item, index }) => {
    const { t, _deleteCurrentItem } = this.props;
    console.log('item', item);
    return (
      <View style={styles.CurrentItemItemContainer}>
        <View key={index} style={[styles.CurrentItemItemBox, { width: SCREEN_WIDTH * 0.18 - 30, }]}>
          <Text style={styles.CurrentItemItemText} numberOfLines={2}>
            {item.TksdQuantity} {t._('X  ')}
          </Text>
          <Text style={[{ color: "#000000", width: '100%', fontSize: ITEM_FONT_SIZE * 0.8, textAlign: 'left', }]} numberOfLines={5}>
            {t._('#')}{item.PrdName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.45, paddingRight: 5, }}>
          <Text style={{ textAlign: 'right', fontSize: ITEM_FONT_SIZE * 0.8, color: "#FF0000", fontFamily: "RobotoBold" }}>{formatCurrency(item.TksdPrice, '')}</Text>
        </View>
      </View>
    )
  }

  render() {
    let { showS_CodeHandleData, KeyCode } = this.state;
    const { state, onGetInfor, onSendOrder, BookingsStyle, toggleCartWidth, t, setState, settings, } = this.props;
    return (
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT * 2,
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}
      >
        <TouchableOpacity
          onPress={() => toggleCartWidth(false)}
          style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH * 0.25 }}
        ></TouchableOpacity>
        <Animated.View
          style={{
            height:
              Platform.OS === "android"
                ? SCREEN_HEIGHT * 1.08
                : SCREEN_HEIGHT,
            width: state.FullCartWidth,
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.grey3
          }}
        >
          <View style={{ width: SCREEN_WIDTH * 0.75, flexDirection: "column", height: SCREEN_HEIGHT - BUTTON_FONT_SIZE * 4 }}>
            <View
              style={{
                height: BUTTON_FONT_SIZE * 2.4,
                paddingTop: 0,
                borderBottomColor: colors.grey3,
                borderBottomWidth: 1,
                backgroundColor: colors.primary,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <View style={{ width: "10%", height: 3, backgroundColor: colors.white }}></View>
              <Text style={{ fontSize: BUTTON_FONT_SIZE * 0.9, fontFamily: "RobotoBold", color: "white", textAlign: "center", paddingHorizontal: 4 }}>
                {t._("GIỎ HÀNG")}
              </Text>
              <View style={{ width: "10%", height: 3, backgroundColor: colors.white }}></View>
            </View>
            <View style={{ width: "100%", height: BUTTON_FONT_SIZE * 1.82, flexDirection: "row" }}>
              <Button
                onPress={() => setState({ isBooking: true })}
                title={t._("Đang order")}
                containerStyle={{ width: "50%" }}
                titleStyle={styles.button_order}
                buttonStyle={{
                  padding: BUTTON_FONT_SIZE * 0.25,
                  backgroundColor: state.isBooking
                    ? colors.white
                    : colors.grey3
                }}
              ></Button>
              <Button
                onPress={() => onGetInfor()}
                title={t._("Đã order")}
                containerStyle={{ width: "50%" }}
                titleStyle={styles.button_order}
                buttonStyle={{
                  padding: BUTTON_FONT_SIZE * 0.25,
                  borderRadius: 0,
                  backgroundColor: !state.isBooking
                    ? colors.white
                    : colors.grey3
                }}
              ></Button>
            </View>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={
                state.isBooking
                  ? state.Cart.items
                  : state.Histories
              }
              extraData={state}
              renderItem={
                state.isBooking
                  ? this.renderCartItem
                  : this.renderHistory
              }
              contentContainerStyle={BookingsStyle.item_order}
            />
          </View>
          {state.isBooking ? (
            <View style={{ height: BUTTON_FONT_SIZE * 4, width: "100%", position: "absolute", flexDirection: "column", bottom: 0, right: 0 }}>
              <View style={{ width: "100%", height: BUTTON_FONT_SIZE * 2, flexDirection: "row", backgroundColor: colors.grey5 }}>
                <View style={[BookingsStyle.item_booking_order, styles.item_text_end]}>
                  <View style={[styles.button_end_left_order, { width: "50%" }]}>
                    <Text style={{ fontSize: BUTTON_FONT_SIZE * 0.8, color: "#af3037" }}>
                      {t._("Số lượng")}:
                      </Text>
                  </View>
                  <View style={[styles.button_end_right_order, { width: "50%" }]}>
                    <Text style={{ fontSize: BUTTON_FONT_SIZE * 0.8, color: "black" }}>
                      {state.Cart.Qty}
                    </Text>
                  </View>
                </View>

                <View style={[BookingsStyle.item_booking_order, styles.item_text_end, { borderLeftColor: "#000000", borderLeftWidth: 2 }]}>
                  <View style={[styles.button_end_left_order, { width: "40%" }]}>
                    <Text style={{ fontSize: BUTTON_FONT_SIZE * 0.8, color: colors.primary }}>
                      {t._("Tiền")}:
                      </Text>
                  </View>
                  <View style={[styles.button_end_right_order, { width: "60%" }]}>
                    <Text style={{ fontSize: BUTTON_FONT_SIZE * 0.8, color: "black" }}>
                      {" "} {formatCurrency(state.Cart.Amount, "")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[BookingsStyle.bottombar, { width: "100%", flexDirection: "row" }]}>
                <Button
                  onPress={() => toggleCartWidth(false)}
                  title={t._("Đặt thêm")}
                  containerStyle={{ backgroundColor: "#dc7d46", width: "50%" }}
                  titleStyle={{ fontSize: BUTTON_FONT_SIZE * 0.8 }}
                  buttonStyle={{ backgroundColor: "#dc7d46", padding: BUTTON_FONT_SIZE * 0.25 }}
                ></Button>
                <Button
                  onPress={() => {
                    let now = (new Date()).getTime();
                    if (state.TimeToNextBooking > 0) {
                      return;
                    }
                    else {
                      if (settings.B_CustomerSendOrder == true) {
                        Question.alert(
                          t._("Notice"),
                          t._("Bạn có muốn gọi order không?"),
                          [
                            { text: t._('BỎ QUA'), onPress: () => { } },
                            {
                              text: t._('OK'),
                              onPress: () => {
                                onSendOrder();
                              }
                            }
                          ],
                          { cancelable: false }
                        );

                      }
                      else {
                        this.setState({ showS_CodeHandleData: true });
                      }
                      // onSendOrder();
                    }
                  }}
                  disabled={
                    state.Cart.Qty == 0 || state.isWorking || state.TimeToNextBooking > 0
                  }
                  titleStyle={{ fontSize: BUTTON_FONT_SIZE * 0.8 }}
                  buttonStyle={{ backgroundColor: "#af3037", padding: BUTTON_FONT_SIZE * 0.25 }}
                  title={state.TimeToNextBooking > 0 ? state.TimeToNextBooking + ' s' : t._("Gọi order")}
                  containerStyle={{ backgroundColor: "#af3037", width: "50%" }}
                ></Button>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: (!isNaN(state.table.Ticket.TkServiceChargeAmout) && state.table.Ticket.TkServiceChargeAmout > 0) ? SCREEN_HEIGHT * 0.16 : SCREEN_HEIGHT * 0.08,
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
                  <View style={{ width: "100%", height: SCREEN_HEIGHT * 0.08, flexDirection: "row" }}>
                    <View style={[styles.item_text_right_end,
                    { paddingLeft: BUTTON_FONT_SIZE * 0.25, width: "60%", justifyContent: "center", alignItems: "flex-start" }]}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: BUTTON_FONT_SIZE, color: colors.orange4 }}>
                          {t._("Thuế và Phí")}
                        </Text>
                        <TouchableOpacity onPress={() => setState({ ShowFeesInfo: true })}>
                          <Icon
                            name="questioncircle"
                            type="antdesign"
                            containerStyle={{
                              marginLeft: ITEM_FONT_SIZE * 0.5,
                              justifyContent: "center"
                            }}
                            size={ITEM_FONT_SIZE}
                            iconStyle={{
                              color: colors.primary,
                              fontFamily: "RobotoBold"
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.item_text_right_end, styles.item_text_center, { paddingRight: BUTTON_FONT_SIZE * 0.25, alignItems: "flex-end" }]}>
                      <Text style={{ fontSize: BUTTON_FONT_SIZE, color: colors.orange4 }}>
                        {state.table.Ticket ? formatCurrency(state.table.Ticket.TkServiceChargeAmout, "") : ""}
                      </Text>
                    </View>
                  </View>
                  : null
              }
              <View style={{ width: "100%", height: SCREEN_HEIGHT * 0.08, flexDirection: "row", borderTopColor: colors.white, borderTopWidth: 1 }}>
                <View style={[styles.item_text_right_end, styles.item_text_center, { width: "50%", paddingLeft: BUTTON_FONT_SIZE * 0.25, justifyContent: 'center', alignItems: "center" }]}>
                  <View style={{ flexDirection: "row", width: '100%', }}>
                    <Text style={{ fontSize: BUTTON_FONT_SIZE, color: colors.red }}>
                      {t._("Tạm tính")}:
                      </Text>
                    <TouchableOpacity style={{ paddingTop: 5 }} onPress={() => setState({ ShowTotalInfo: true })}>
                      <Icon
                        name="questioncircle"
                        type="antdesign"
                        containerStyle={{
                          marginLeft: ITEM_FONT_SIZE * 0.5,
                          justifyContent: "center"
                        }}
                        size={ITEM_FONT_SIZE}
                        iconStyle={{
                          color: colors.primary,
                          fontFamily: "RobotoBold"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.item_text_right_end, styles.item_text_center,
                {
                  width: "50%", paddingRight: BUTTON_FONT_SIZE * 0.25,
                  alignItems: "flex-end"
                }]}>
                  <Text style={{ fontSize: BUTTON_FONT_SIZE, color: colors.red }}>
                    {state.table.Ticket ? formatCurrency(state.table.Ticket.TkTotalAmount, "") : ""}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {showS_CodeHandleData ?
            <View style={{
              backgroundColor: "rgba(98,98,98,0.6)", height: SCREEN_HEIGHT + Constants.statusBarHeight + 100,
              width: SCREEN_WIDTH,
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
                <View style={[{ borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 2, borderColor: '#5FA323', backgroundColor: '#5FA323', width: SCREEN_WIDTH / 2 }]}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5FA323', width: '100%',
                    height: BUTTON_FONT_SIZE * 2.5, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderColor: '#5FA323', borderRadius: 2, borderWidth: 2,
                  }}>
                    <Text style={{ fontSize: 18, color: colors.white, textAlign: 'center' }}>{t._("NHẬP CODE")}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', height: BUTTON_FONT_SIZE * 2.5, width: '100%', paddingTop: 5, }}>
                    <TextInput
                      ref={input => this.InputCode = input}
                      style={[{ fontSize: 16, paddingLeft: 10, paddingVertical: 5, backgroundColor: colors.white, textAlign: 'left', borderColor: '#5FA323', width: '90%', borderWidth: 1, borderRadius: 4, }]}
                      autoFocus={false}
                      autoCapitalize="none"
                      placeholder={t._("Nhập mã ...")}
                      keyboardAppearance="dark"
                      keyboardType="default"
                      returnKeyType='done'
                      autoCorrect={false}
                      blurOnSubmit={false}
                      numberOfLines={5}
                      onChangeText={(KeyCode) => {
                        this.setState({ KeyCode })
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
                    alignItems: 'center', height: BUTTON_FONT_SIZE * 2.5, backgroundColor: colors.white,
                  }}>
                    <View style={{ width: '40%', paddingVertical: 10 }}>
                      <LinearGradient
                        colors={["#EB353B", "#ED1E24", "#ED131A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderWidth: 1, borderRadius: 16, borderColor: "#ED1E24", height: 32, alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => { this.setState({ showS_CodeHandleData: false, }) }} style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                          <Text style={{ textAlign: 'center', width: '100%', color: 'white', }}>{t._('BỎ QUA')}</Text>
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
                              this.setState({ showS_CodeHandleData: false, }, () => {
                                onSendOrder();
                              });
                            }
                            else {
                              this.setState({ showS_CodeHandleData: true, }, () => {
                                Question.alert(
                                  t._("Thông báo"),
                                  t._("Bạn đã nhập code sai, vui lòng liên hệ với nhân viên!")
                                )
                              });
                            }
                          }
                          else {
                            this.setState({ showS_CodeHandleData: true, }, () => {
                              Question.alert(
                                t._("Thông báo"),
                                t._("Bạn không có quyền gọi order, vui lòng liên hệ với nhân viên!")
                              )
                            });
                          }
                        }} style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                          <Text style={{ textAlign: 'center', width: '100%', color: 'white', }}>{t._('CHẤP NHẬN')}</Text>
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
  }
}