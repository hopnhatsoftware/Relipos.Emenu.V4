import React from "react";
import {
  View, TouchableOpacity, TextInput, StyleSheet, Text,
  Image,
  Dimensions
} from "react-native";
import colors from "../config/colors";
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import {
  ITEM_FONT_SIZE, BUTTON_FONT_SIZE
} from "../config/constants";
import { formatCurrency } from "../services/util";
import { _storeData } from "../services/storages";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT =
  Dimensions.get("window").height - Constants.statusBarHeight;

export class _HeaderNew extends React.Component {
  componentDidMount() {
  }
  render() {
    const { state, language, table, BookingsStyle, _searchProduct, onPressBack, t, name, titleSet, setState, lockTable } = this.props;
    let settings = state.settings, endpoint = state.endpoint;
    console.log('logo', settings.URL_LOGO);
    return (
      <View style={[BookingsStyle.header,{ backgroundColor: "#333D4C", width: SCREEN_WIDTH * 0.818, }]}>
        <View style={{ paddingTop: 1, width: "20%", flexDirection: 'row', justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => { onPressBack.apply(null, []); }}
            style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              resizeMode="contain"
              source={require('../../assets/icons/v2/icon_Back.png')}
              style={[
                BookingsStyle.header_logo,
                {
                  maxWidth: '42%',
                  height: SCREEN_HEIGHT * 0.085,
                  justifyContent: "center",
                  alignItems: "center"
                }
              ]}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', width: '60%', justifyContent: "center", alignItems: 'center', }}>
            <View style={{ flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontFamily: "RobotoBold", fontSize: ITEM_FONT_SIZE }]}> {table.TbNo} </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column', width: '60%', justifyContent: "center", alignItems: 'center', }}>
            <TouchableOpacity style={{ width: '100%', justifyContent: "center", alignItems: 'center', }}
              onPress={() => { setState({ showCall: !state.showCall }) }}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
                <Image
                  resizeMode="contain"
                  source={
                    require('../../assets/icons/iconNew/IconGoiNhanVien2-10.png')
                  }
                  style={[
                    BookingsStyle.header_logo,
                    {
                      maxWidth: '20%',
                      height: SCREEN_HEIGHT * 0.025,
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  ]}
                />
                <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {t._("Gọi nhân viên")} </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: "68%", flexDirection: "row", justifyContent: "center", alignItems: 'center', }}>
          <View style={[BookingsStyle.header_search, { flexDirection: "row" }]}>
            {name == 'Booking' ?
              <TextInput
                style={[BookingsStyle.item_search, styles.item_Search]}
                keyboardAppearance="light"
                placeholder={t._("Nhập tên món...")}
                fontStyle="italic"
                autoFocus={false}
                value={state.keysearch}
                onChangeText={keysearch => setState({ keysearch })}
                onSubmitEditing={() => { _searchProduct(); }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              :
              <View style={{ flexDirection: 'column', width: '75%', justifyContent: "center", alignItems: 'center', }}>
                <View style={{ flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: 'center', }}>
                  <Text style={{ color: "#FFFFFF", textAlign: 'center', fontFamily: 'RobotoBold', fontSize: ITEM_FONT_SIZE }}>{titleSet.PrdName ? titleSet.PrdName : ""}</Text>
                </View>
              </View>
            }
            {name == 'Booking' ?
              <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => { _searchProduct(); }}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_Find.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.4, height: ITEM_FONT_SIZE * 1.4, }} />
              </TouchableOpacity>
              : <View style={{ width: ITEM_FONT_SIZE * 2, }}>
              </View>}
            {!lockTable ?
              <TouchableOpacity style={{ paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  setState({ lockTable: true })
                }}>
                <Icon name="unlock" iconStyle={{ color: colors.white, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </TouchableOpacity>
              : <View style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}>
                <Icon name="lock" iconStyle={{ color: colors.red, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </View>}
            {
              language == 1 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => setState({ showFilterBell: !state.showFilterBell })}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/TiengViet-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => setState({ showFilterBell: !state.showFilterBell })}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/TiengAnh-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item_Search: {
    width: "70%",
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50
  },
  item_language: {
    flexDirection: "row"
  },
});