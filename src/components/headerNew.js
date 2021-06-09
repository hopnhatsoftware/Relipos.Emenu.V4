import React from "react";
import { View, TouchableOpacity, TextInput, StyleSheet, Text,Image,Dimensions} from "react-native";
import colors from "../config/colors";
import { Button, Icon } from "react-native-elements";
//import { Sound} from "react-native-sound";
import Constants from "expo-constants";
import {ITEM_FONT_SIZE, BUTTON_FONT_SIZE} from "../config/constants";

import { _storeData } from "../services/storages";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT =
  Dimensions.get("window").height - Constants.statusBarHeight;

export class _HeaderNew extends React.Component {
  componentDidMount() {
  };
  _CallServices= async () => {
    setState({ showCall: !state.showCall })
//    // var Sound = require('react-native-sound');
// // Enable playback in silence mode
// Sound.setCategory('Playback');
// var whoosh = new Sound('whoosh.mp3', Sound.MAIN_BUNDLE, (error) => {
//   if (error) {
//     console.log('failed to load the sound', error);
//     return;
//   }
//   // loaded successfully
//   console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
 
//   // Play the sound with an onEnd callback
//   whoosh.play((success) => {
//     if (success) {
//       console.log('successfully finished playing');
//     } else {
//       console.log('playback failed due to audio decoding errors');
//     }
//   });
// });
 
// // Reduce the volume by half
// whoosh.setVolume(0.5);
 
// // Position the sound to the full right in a stereo field
// whoosh.setPan(1);
 
// // Loop indefinitely until stop() is called
// whoosh.setNumberOfLoops(-1);
 
// // Get properties of the player instance
// console.log('volume: ' + whoosh.getVolume());
// console.log('pan: ' + whoosh.getPan());
// console.log('loops: ' + whoosh.getNumberOfLoops());
 
// // Seek to a specific point in seconds
// whoosh.setCurrentTime(2.5);
 
// // Get the current playback point in seconds
// whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));
 
// // Pause the sound
// whoosh.pause();
 
// // Stop the sound and rewind to the beginning
// whoosh.stop(() => {
//   // Note: If you want to play a sound after stopping and rewinding it,
//   // it is important to call play() in a callback.
//   whoosh.play();
// });
 
// // Release the audio player resource
// whoosh.release();
    try{
  }catch(ex){
    console.log('_BindingMeta Error :'+ex)
  }
  }
  render() {
    const { state, language, table, BookingsStyle, _searchProduct, onPressBack, translate, name, titleSet, setState, lockTable,backgroundColor } = this.props;
    
    return (
      <View style={[BookingsStyle.header,{ backgroundColor: backgroundColor, width: '100%' }]}>
        <View style={{ paddingTop: 1, width: "20%", flexDirection: 'row', justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => { onPressBack.apply(null, []); }}
            style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
            <Image   resizeMode="contain"  source={require('../../assets/icons/IconBack.png')}
              style={[  BookingsStyle.header_logo, { maxWidth: '42%',  height: SCREEN_HEIGHT * 0.085,  justifyContent: "center", alignItems: "center"  }
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
              onPress={() => { this._CallServices(); }}>
            
             {(state.showCall==false)?
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ require('../../assets/icons/IconCall.png') }
                style={[ BookingsStyle.header_logo,
                  {
                    maxWidth: '20%',
                    height: SCREEN_HEIGHT * 0.025,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Gọi nhân viên")} </Text>
            </View>
             :
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ require('../../assets/icons/iconCall_While.png') }
                style={[ BookingsStyle.header_logo,
                  {
                    maxWidth: '20%',
                    height: SCREEN_HEIGHT * 0.025,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
             <Text style={[{ color: "#FF7E27", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Đang gọi ..")} </Text>
            </View>
            }
             </TouchableOpacity>
            </View>
            </View>
        <View style={{ width: "68%", flexDirection: "row", justifyContent: "center", alignItems: 'center', }}>
          <View style={[BookingsStyle.header_search, { flexDirection: "row" }]}>
            {name == 'OrderView' ?
              <TextInput
                style={[BookingsStyle.item_search, styles.item_Search]}
                keyboardAppearance="light"
                placeholder={translate.Get("Nhập tên món...")}
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
            {name == 'OrderView' ?
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
                  onPress={() => setState({ IsShowCustomerSendNotification: !state.IsShowCustomerSendNotification })}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/TiengViet-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => setState({ IsShowCustomerSendNotification: !state.IsShowCustomerSendNotification })}>
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