/*Header của Form */
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

export class _Header extends React.Component {
  componentDidMount() {
  }
  render() {
    const {isShowBack, state, table, language, BookingsStyle, _searchProduct, onPressBack, translate, name, titleSet, setState, lockTable,islockTable,backgroundColor,iheight,isShowFlag } = this.props;
    
    return (
      <View style={[BookingsStyle.header,{  backgroundColor: backgroundColor, width:SCREEN_WIDTH,height:iheight }]}>
        <View style={{ height:iheight,paddingTop: 1, width: "20%", flexDirection: 'row', justifyContent: "space-between" }}>
        {(isShowBack==true)? 
          <TouchableOpacity  onPress={() => { onPressBack.apply(null, []); }}  style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
            <Image  resizeMode="contain" 
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
          </TouchableOpacity> :null
         }
          <Image resizeMode="contain" 
          source={require('../../assets/LogoSos.jpg')}
          //source={ require('../../assets/icons/logo1_ngang.png')  }
            style={[
              BookingsStyle.header_logo,
              {
                maxWidth: '56%',
                height:iheight*0.98, 
                justifyContent: "center", 
                alignItems: "center"
              }
            ]} />
          <View style={{ flexDirection: 'column', width: '60%', justifyContent: "center", alignItems: 'center', }}>
            <View style={{ flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontFamily: "RobotoBold", fontSize: ITEM_FONT_SIZE }]}> {table.TbNo} </Text>
              <Text style={{ color: "#FFFFFF", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }}>{table.Ticket ? table.Ticket.TkNo : ""}</Text>
            </View>
          </View>
          {(islockTable==true)? 
          <View style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}>
          {!lockTable ?
            <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
              onPress={() => {
                setState({ lockTable: true })
              }}>
              <Icon name="unlock" iconStyle={{ color: colors.white, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
            </TouchableOpacity>
            : 
            <View style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}>
              <Icon name="lock" iconStyle={{ color: colors.red, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
            </View>
              }:null
              </View> :null
            }
        </View>

        <View style={{ height:iheight,width: "68%", flexDirection: "row", justifyContent: "center", alignItems: 'center', }}>
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
              <View style={{ flexDirection: 'column', width: '85%', justifyContent: "center", alignItems: 'center', }}>
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
});