import React from "react";
import {ActivityIndicator, View, TouchableOpacity, TextInput, StyleSheet, Text,Image,Dimensions} from "react-native";
import colors from "../config/colors";
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import {ITEM_FONT_SIZE, BUTTON_FONT_SIZE} from "../config/constants";
import { Audio } from 'expo-av';
import { _storeData } from "../services/storages";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT =
  Dimensions.get("window").height - Constants.statusBarHeight;

export class _HeaderNew extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      IsLoaded:false,
      sound:null
    }
  }
  _onPlaybackStatusUpdate = playbackStatus => {
    if (!playbackStatus.isLoaded) {
     ;
    } else {
      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
      } else 
      {
        // Update your UI for the paused state
      }
      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }
      if (playbackStatus.didJustFinish) {
        this.props.setState({ showCall:false })
      }
    }
  };
  componentWillUnmount= async () => 
  {
    let { sound} = this.state;
    if (sound!=null) {
      await sound.unloadAsync();
        this.setState({sound:null})
    }
  }
  componentDidMount= async () => {
   
    await this._LoadSound();
    this.setState({IsLoaded:true });
  };
 _LoadSound= async () => {
  try
  {
    const { state} = this.props;
    let { sound} = this.state;
    if (sound==null) {
    sound= new Audio.Sound();
    await sound.loadAsync({uri:state.endpoint+ '/Resources/Sound/RingSton.mp3'});
    await sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
    this.setState({ sound})
  return sound;
    }
  }
  catch(ex){
    console.log('_LoadSound Error :'+ex)
    this.setState({ sound:null})
    
  }
  return null;
}
  _HandleSound= async () => {
    let { sound } = this.state;
    try{
      if (sound==null) 
         sound=  await this._LoadSound();
      const { onCallServices } = this.props; 
    if (sound==null)
         return;
      if (this.props.state.showCall) 
      {
        await sound.stopAsync();
        this.props.setState({ showCall: false });
        return;
      }  
      this.props.setState({ showCall: true  });
         await sound.setPositionAsync(0);
         await sound.playAsync();
         await onCallServices(); 
  }catch(ex){
    this.props.setState({ showCall:false })
   console.log('_HandleSound Error :'+ex)
  }
  }
  render() {
   
    const { state, table, BookingsStyle, _searchProduct, onPressBack, translate, name, titleSet, setState,backgroundColor,changeLanguage } = this.props;
    if (state.showCall==undefined||state.showCall==null) {
      state.showCall=false;
    }
    if (!this.state.IsLoaded) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"
          />
        </View>
      );
    }
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
              onPress={() => { 
              this._HandleSound(); }}>
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
            {!state.lockTable ?
              <TouchableOpacity style={{ paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  setState({ lockTable: true })
                }}>
                <Icon name="unlock" iconStyle={{ color: colors.white, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </TouchableOpacity>
              : <View style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}>
                <Icon name="lock" iconStyle={{ color: colors.red, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </View>}
            {state.language == 1 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => changeLanguage(2)}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/TiengViet-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => changeLanguage(1)}>
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