import React from "react";
import { View, TouchableOpacity, Text,  FlatList,  Dimensions
} from "react-native";
import colors from "../../config/colors";
import Constants from "expo-constants";
import { H1FontSize,H2FontSize,H3FontSize,H4FontSize} from "../../config/constants";
import * as Font from "expo-font";
const SCREEN_HEIGHT =  Dimensions.get("window").height - Constants.statusBarHeight;

export class _ProductGroup extends React.Component {
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
    let { ProductGroupList, _GroupClick, SelectedGroupIndex,pnheight} = this.props;
    return ( 
      <View style={[{ height:pnheight,width:'99%' }]}>
        <FlatList data={ProductGroupList} renderItem={({ item, index }) => 
        <TouchableOpacity  key={index} style={{  width: '100%', justifyContent: 'center', alignItems: 'center',borderTopWidth:1,borderTopColor:colors.grey5  }}
            onPress={() => { _GroupClick(index) }}> 
            <View style={{ flexDirection: 'row', width: '100%', 
              justifyContent: 'flex-start', alignItems:'center', 
              borderRadius: 1, borderWidth: 1, borderColor: index == SelectedGroupIndex ? '#F87D26' : '#333D4C',
              height: SCREEN_HEIGHT * 0.08, backgroundColor: index == SelectedGroupIndex ? '#F87D26' : '#333D4C',
            }}> 
              <Text style={{ fontSize: H3FontSize, textAlign:'center',width:'100%', color: index == SelectedGroupIndex ? colors.white : colors.grey4,
                fontFamily: index == SelectedGroupIndex ? 'RobotoBold' : 'RobotoRegular',
              }}>{item.PrgName}</Text>
            </View>
          </TouchableOpacity>}
        />
      </View>
    );
  }
}
