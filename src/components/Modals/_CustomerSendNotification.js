import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions, Alert,
  Platform
} from "react-native";
import { Icon } from "react-native-elements";
import colors from "../../config/colors";
import Constants from "expo-constants";
import { ITEM_FONT_SIZE, BUTTON_FONT_SIZE } from "../../config/constants";
import { getTableColor } from "../../services/util";
import { sendNotification } from '../../services/emenu';
import Question from '../Question';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;
/*Gửi thông báo tới App */
export class _CustomerSendNotification extends React.Component {
  state = { showAbout: false };
  componentDidMount() {
    this.state = {
      showAbout: false,
      lastBookingTime: (new Date()).getTime()
    };
  }
  renderAbout = () => {
    const { manifest } = Constants;
    const { endpoint, settings, BookingsStyle, t } = this.props;
    let FontSize = ITEM_FONT_SIZE * 0.9;
    return (
      <View
        style={{
          position: "absolute",
          left: SCREEN_WIDTH / 4,
          top: SCREEN_HEIGHT * 0.2,
          width: SCREEN_WIDTH / 2,
          height: FontSize * 8 + ITEM_FONT_SIZE * 9.3 + BUTTON_FONT_SIZE,
          borderColor: colors.grey3,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white"
        }}
      >
        <View style={{
          flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: "#008bc5",
          width: '100%', height: BUTTON_FONT_SIZE * 2.5
        }}>
          <Text style={{ height: ITEM_FONT_SIZE * 2, fontSize: ITEM_FONT_SIZE * 1.6, color: colors.white, textAlign: "center" }}>
            {translate.Get("About").toUpperCase()}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', height: FontSize * 8 + ITEM_FONT_SIZE * 6.3, width: '100%', justifyContent: 'center' }}>
          <View style={{ width: "35%", alignItems: "center", flexDirection: 'column', justifyContent: 'center' }}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/icons/LogoeMenu.png')}
              style={[{ width: SCREEN_WIDTH * 0.15, maxHeight: SCREEN_WIDTH * 0.15, alignItems: "center" }]}
            />
          </View>
          <View style={{ width: "65%", alignItems: "flex-start", flexDirection: 'column', padding: FontSize * 0.3, justifyContent: 'center' }}>
            <View style={{ paddingBottom: FontSize * 0.1, flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: ITEM_FONT_SIZE * 1.5, fontWeight: 'bold' }}>{translate.Get("Relipos")} </Text>
                <Text style={{ fontSize: ITEM_FONT_SIZE * 1.5, color: colors.grey3 }}>{translate.Get("menu")}</Text>
              </View>
              <Text style={{ paddingLeft: FontSize, paddingTop: FontSize * 0.1, fontSize: ITEM_FONT_SIZE * 0.8, color: colors.grey3 }}>{translate.Get("Version")}: {manifest.version} - {translate.Get("Build")}: {Platform.OS == 'ios' ? manifest.ios.buildNumber : manifest.android.versionCode}</Text>
            </View>
            {'S_DepartmentName' in settings && settings.S_DepartmentName != '' ?
              <Text style={{ paddingTop: FontSize * 0.4, fontSize: FontSize, fontWeight: 'bold' }}>{translate.Get('Restaurant') + ' ' + settings.S_DepartmentName}</Text>
              : <Text style={{ paddingTop: FontSize * 0.4, fontSize: FontSize, fontWeight: 'bold' }}>{translate.Get("Hop Nhat Software")}</Text>}
            <View style={{ flexDirection: 'row', paddingTop: FontSize * 0.4, }}>
              <Text style={{ fontSize: FontSize, fontWeight: 'bold' }}>{translate.Get("Support platform:")} </Text>
              <Text style={{ fontSize: FontSize, color: colors.grey3 }}>{translate.Get("Android/IOS")}</Text>
            </View>
            <View style={{ paddingBottom: FontSize * 0.2, flexDirection: 'column' }}>
              <Text style={{ paddingTop: FontSize * 0.4, fontSize: FontSize, fontWeight: 'bold' }}>{translate.Get("Product features: ")}</Text>
              <Text style={{ paddingLeft: FontSize * 0.2, paddingTop: FontSize * 0.2, fontSize: FontSize, color: colors.grey3 }}>- {translate.Get("Customers take the initiative of ordering.")}</Text>
              <Text style={{ paddingLeft: FontSize * 0.2, paddingTop: FontSize * 0.2, fontSize: FontSize, color: colors.grey3 }}>- {translate.Get("Reviews ordered.")}</Text>
              <Text style={{ paddingLeft: FontSize * 0.2, paddingTop: FontSize * 0.2, fontSize: FontSize, color: colors.grey3 }}>- {translate.Get("Easy to order more items.")}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: ITEM_FONT_SIZE, justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <Text style={{ color: colors.grey5, fontSize: ITEM_FONT_SIZE * 0.6, textAlign: 'center' }}>{translate.Get("@Copyright 2019 Hop Nhat Software All Rights Reserved")}</Text>
        </View>
      </View>
    );
  };
  sendNotice = (type) => {
    const { table, setState, sendNotice, t } = this.props;
    this.setState({ isWorking: true });
    let now = (new Date()).getTime();
    if ((now - this.state.lastBookingTime) / 1000 < 60) {
      this.setState({ lastBookingTime: now }, () => {
        Question.alert(translate.Get('notice'), translate.Get('Cảm ơn bạn đã gọi, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất!'), [
          {
            text: 'OK',
            onPress: () => sendNotice(type)
          }
        ])
      });
      return;
    }
    let title = 'Bạn nhận được lời yêu cầu ' + (type == 1 ? 'thanh toán ' : 'hỗ trợ') + 'từ bàn ' + table.TbNo;
    sendNotification(type, title, title, table).then((res) => {
      if (res.Status == 1) {
        Question.alert(translate.Get('notice'), translate.Get('Cảm ơn bạn đã gọi, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất!'), [
          {
            text: 'OK',
            onPress: () => sendNotice(type)
          }
        ])
      }

    }).catch((error) => {
      console.log('sendNotice error :', error);
    });
  }
  render() {
    const {
      changeLanguage,
      t,
      tableStatus,
      language,
      setState
    } = this.props;
    let that = this;
    return (
      <TouchableOpacity  onPress={() => {
          if (this.state.showAbout) {
            this.setState({ showAbout: false });
          }
          else {
            setState({ IsShowCustomerSendNotification: false });
          }
        }}
        style={{  position: "absolute",  right: 0,  top: 0,  width: SCREEN_WIDTH,  height: '100%',  backgroundColor: "rgba(0, 0, 0, 0.4)"
        }}
      >
        {this.state.showAbout ? (
          this.renderAbout()
        ) : (
          <View  style={{
              position: "absolute",
              right: 5,
              backgroundColor:'#333D4C',
              top: SCREEN_HEIGHT * 0.01,
              width: SCREEN_WIDTH / 13,
              height: ITEM_FONT_SIZE * 1.8,
              justifyContent:'center', alignItems:'center',
            }}
          >
            {
              language != 1 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => {changeLanguage(1); setState({ IsShowCustomerSendNotification: false }); }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/iconNew/TiengViet-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => {changeLanguage(2); setState({ IsShowCustomerSendNotification: false }); }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/iconNew/TiengAnh-10.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
            }
            {/* <FlatList
                data={[
                  // { ID: 2, text: translate.Get("Call for services") },
                  // { ID: 1, text: translate.Get("Call for payment") },
                  language != 1
                    ? {
                      ID: 4,
                      text: translate.Get("Tiếng Việt"),
                      onPress: () => {
                        changeLanguage(1);
                      }
                    }
                    : {
                      ID: 5,
                      text: translate.Get("English"),
                      onPress: () => {
                        changeLanguage(2);
                      }
                    },
                  {
                    ID: 3,
                    text: translate.Get("About"),
                    onPress: () => {
                      console.log('show About');
                      that.setState({ showAbout: true });
                    }
                  }
                ]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      borderColor: colors.white,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                      backgroundColor: getTableColor(item.ID)
                    }}
                    onPress={() => {
                      if ("onPress" in item) {
                        item.onPress();
                      }
                      else {
                        this.sendNotice(item.ID);
                      }
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: ITEM_FONT_SIZE,
                          fontFamily:
                            item.ID == tableStatus
                              ? "RobotoBold"
                              : "RobotoRegular"
                        }}
                      >
                        {item.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
