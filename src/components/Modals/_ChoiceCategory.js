import React from "react";
import {View, TouchableOpacity, TextInput, StyleSheet, Text, Image, FlatList, Dimensions} from "react-native";
import colors from "../../config/colors";
import Constants from "expo-constants";
import {H1FontSize, H2FontSize, H3FontSize, H4FontSize} from "../../config/constants";
import * as Font from "expo-font";
export class _ChoiceCategory extends React.Component {
  flatListRef = null;
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
    let { pnWidth,pnHeight,ItemWidth, BookingsStyle, ProductGroupList, _selectGroup, SelectedGroupIndex, setState } = this.props;
 // console.log('ItemWidth:'+ItemWidth);
    return (
      <View style={[BookingsStyle.header, { height:pnHeight, backgroundColor: "#E3E3E3", paddingTop: 2, }]}>
        <FlatList horizontal={true} data={ProductGroupList}   renderItem={({ item, index }) => 
        <TouchableOpacity  key={index}  style={{width:ItemWidth, height:'100%', justifyContent: 'center', alignItems: 'center',  }}
            onPress={() => { _selectGroup(item, index) }}>
            <View style={{  width:'100%',height:'100%', flexDirection: 'row', borderRadius: 4, borderWidth: 1, borderColor: colors.grey4,
               justifyContent: 'center', alignItems: 'center', backgroundColor: index == SelectedGroupIndex ? '#39ADFF' : 'white',
            }}>
              <Text style={{  fontSize: H2FontSize * 0.9, color: index == SelectedGroupIndex ? colors.white : colors.grey4,
                fontFamily: index == SelectedGroupIndex ? 'RobotoBold' : 'RobotoRegular',
              }} numberOfLines={3}>{item.ChcgName}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
    ); 
  }
}