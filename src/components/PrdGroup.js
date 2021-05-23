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

export class _PrdGroup extends React.Component {
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
      <View style={[{ backgroundColor: "#333D4C", paddingTop: 2, }]}>
        <FlatList
          // horizontal={true}
          data={PrdGroups}
          renderItem={({ item, index }) => <TouchableOpacity
            key={index}
            style={{
              // width: SCREEN_WIDTH * 0.1655,
              // height: SCREEN_HEIGHT * 0.075,
              justifyContent: 'center', alignItems: 'center',
            }}
            onPress={() => { _selectGroup(index) }}>
            <View style={{
              flexDirection: 'row', width: '100%',
              justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop:10, paddingLeft:10, 
              borderRadius: 1, borderWidth: 1, borderColor: index == SelectedGroupIndex ? '#F87D26' : '#333D4C',
              height: SCREEN_HEIGHT * 0.08, backgroundColor: index == SelectedGroupIndex ? '#F87D26' : '#333D4C',
            }}>
              <Text style={{
                fontSize: ITEM_FONT_SIZE, textAlign:'center', color: index == SelectedGroupIndex ? colors.white : colors.grey4,
                fontFamily: index == SelectedGroupIndex ? 'RobotoBold' : 'RobotoRegular',
              }}>{item.PrgName}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
    );
  }
}
