import React from "react";
import { View, TouchableOpacity, Text,  FlatList,  Dimensions,Image} from "react-native";
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
    let { ProductGroupList,PrdChildGroups, _GroupClick,_selectChildGroup,SelectedChildGroupIndex, SelectedGroupIndex,pnheight} = this.props;
    return ( 
      <View style={[{ height:'83%',width:'100%' }]}>
        <FlatList data={ProductGroupList} renderItem={({ item, index }) => 
        <View>
        <TouchableOpacity  key={index} style={{  width: '100%', justifyContent: 'center', alignItems: 'center',borderTopWidth:1,borderTopColor:colors.grey5  }}
            onPress={() => { _GroupClick(index) }}> 
            <View style={{ flexDirection: 'row', width: '100%',  justifyContent: 'flex-start', alignItems:'center', 
              borderRadius: 1, borderWidth: 1, borderColor: index == SelectedGroupIndex ? '#990000' : '#333D4C',
              height: H3FontSize*2.5, backgroundColor: index == SelectedGroupIndex ? '#990000' : '#333D4C',
            }}> 
              <Text style={{ fontSize: H4FontSize,marginLeft:1, textAlign:'left',width:'89%', 
              color: index == SelectedGroupIndex ? colors.white : colors.grey4,
                fontWeight: index == SelectedGroupIndex ? 'bold': 'normal',
              }}>{item.PrgName}</Text>
              {index == SelectedGroupIndex ?
               <Image resizeMode='center' source={require('../../../assets/icons/IconDown.png')}
                      style={{ width: '10%',paddingRight:2 }} /> :null
              }
            </View>
          </TouchableOpacity>
          {SelectedGroupIndex== index ? 
          PrdChildGroups.map((ChildItem, Childindex) => { 
            return ( 
              <TouchableOpacity key={Childindex}  style={{ width: '100%', justifyContent: 'center', alignItems: 'center',backgroundColor: Childindex == SelectedChildGroupIndex ? '#BB0000' : '#48515E', }}
                onPress={() => { _selectChildGroup(ChildItem, Childindex); }}  >
              <View style={{ flexDirection: 'row', width: '100%',marginLeft:H4FontSize, justifyContent: 'flex-start', alignItems:'center', 
              height: H4FontSize*2.5, 
              borderTopWidth:1,borderTopColor:colors.grey4
            }}>  
              <Text style={{ fontSize: H4FontSize*0.9,textAlign:'left', 
              color: Childindex == SelectedChildGroupIndex ? colors.white : colors.grey4,
                fontFamily: Childindex == SelectedChildGroupIndex ? 'RobotoBold' : 'RobotoRegular',
              }}>{ChildItem.PrgName}</Text>
            </View>
              </TouchableOpacity>
            );
          }):null
        } 
          </View>
          }
          >
       
          </FlatList>
      </View>
    );
  }
}
