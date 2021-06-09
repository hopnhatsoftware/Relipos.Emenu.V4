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

export class _CallOptions extends React.Component {
  state = { showAbout: false };
  componentDidMount() {
    this.state = {
      showAbout: false,
      lastBookingTime: (new Date()).getTime()
    };
  }
  render() {
    const { translate,  call, BookingsStyle, setState } = this.props;
    let that = this;
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.state.showAbout) {
            this.setState({ showAbout: false });
          }
          else {
            setState({ showCall: false });
          }
        }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: SCREEN_WIDTH,
          height: '100%',
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        }}
      >
        {this.state.showAbout ? (
          null
        ) : (
          <View
            style={{
              position: "absolute",
              left: '28%',
              backgroundColor: '#333D4C',
              top: SCREEN_HEIGHT * 0.01,
              width: SCREEN_WIDTH / 6.4,
              height: ITEM_FONT_SIZE * 1.8,
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            {
              call != 1 ?
                <TouchableOpacity style={{ width: '100%', paddingLeft: 10, paddingRight: 5, paddingTop: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => { setState({ showCall: false, call: 2, }); }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/IconCall.png')}
                  style={[
                    BookingsStyle.header_logo,
                    {
                      maxWidth: '12%',
                      height: SCREEN_HEIGHT * 0.025,
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  ]}/>
                  <Text style={[{ color: "#FF7E27", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Đang gọi nhân viên")} </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}
                  onPress={() => { setState({ showCall: false, call: 1, }); }}>
                  <Image resizeMode="stretch" source={require('../../../assets/icons/iconCall_While.png')}
                    style={[
                    BookingsStyle.header_logo,
                    {
                      maxWidth: '12%',
                      height: SCREEN_HEIGHT * 0.025,
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  ]} />
                  <Text style={[{ color: "#FF7E27", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Đang gọi nhân viên")} </Text>
                </TouchableOpacity>
            }
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
