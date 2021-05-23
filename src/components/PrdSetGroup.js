import React from "react";
import {
  View, TouchableOpacity, TextInput, StyleSheet, Text,
  Image, FlatList,
  Dimensions
} from "react-native";
import colors from "../config/colors";
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import {
  ITEM_FONT_SIZE, BUTTON_FONT_SIZE
} from "../config/constants";
import * as Font from "expo-font";
import { formatCurrency } from "../services/util";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT =
  Dimensions.get("window").height - Constants.statusBarHeight;

export class _PrdSetGroup extends React.Component {
  flatListRef = null;
  async componentDidMount() {
    await Font.loadAsync({
      RobotoBlack: require("../../assets/fonts/Roboto-Black.ttf"),
      RobotoBlackItalic: require("../../assets/fonts/Roboto-BlackItalic.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoBoldCondensed: require("../../assets/fonts/Roboto-BoldCondensed.ttf"),
      RobotoBoldItalic: require("../../assets/fonts/Roboto-BoldItalic.ttf"),
      RobotoItalic: require("../../assets/fonts/Roboto-Italic.ttf"),
      RobotoThinItalic: require("../../assets/fonts/Roboto-ThinItalic.ttf"),
      RobotoThin: require("../../assets/fonts/Roboto-Thin.ttf"),
      RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
      RobotoBoldCondensedItalic: require("../../assets/fonts/Roboto-BoldCondensedItalic.ttf"),
      RobotoCondensed: require("../../assets/fonts/Roboto-Condensed.ttf"),
      RobotoCondensedItalic: require("../../assets/fonts/Roboto-CondensedItalic.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoMediumItalic: require("../../assets/fonts/Roboto-MediumItalic.ttf"),
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
    });
  }

  render() {
    let { state, BookingsStyle, PrdGroups, _selectGroup, SelectedGroupIndex, t, setState } = this.props;
    return (
      <View style={[BookingsStyle.header, { backgroundColor: "#E3E3E3", paddingTop: 2, }]}>
        <FlatList
          horizontal={true}
          data={PrdGroups}
          renderItem={({ item, index }) => <TouchableOpacity
            key={index}
            style={{
              width: SCREEN_WIDTH * 0.1655,
              height: SCREEN_HEIGHT * 0.085,
              justifyContent: 'center', alignItems: 'center',
            }}
            onPress={() => { _selectGroup(item, index) }}>
            <View style={{
              flexDirection: 'row', width: SCREEN_WIDTH * 0.1655, borderRadius: 4, borderWidth: 1, borderColor: colors.grey4,
              height: SCREEN_HEIGHT * 0.08, justifyContent: 'center', alignItems: 'center', backgroundColor: index == SelectedGroupIndex ? '#39ADFF' : 'white',
            }}>
              <Text style={{
                fontSize: ITEM_FONT_SIZE * 0.9, color: index == SelectedGroupIndex ? colors.white : colors.grey4,
                fontFamily: index == SelectedGroupIndex ? 'RobotoBold' : 'RobotoRegular',
              }} numberOfLines={3}>{item.ChcgName}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item_Search: {
    width: "85%",
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50
  },
  item_language: {
    flexDirection: "row"
  },
  left_menu_group: {
    paddingLeft: 12,
    height: ITEM_FONT_SIZE * 3.5,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center",
    backgroundColor: "#234f6c"
  },
  left_menu_group_item: {
    paddingLeft: 12,
    color: colors.grey2
  },
  left_menu_group_item: {
    borderColor: colors.grey3,
    borderRadius: 1,
    justifyContent: "center",
    color: colors.grey2,
    paddingLeft: 16,
    height: ITEM_FONT_SIZE * 3
  },
});