import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Dimensions,Alert,
  Platform,
} from "react-native";
import { WebView } from 'react-native-webview';
import colors from "../../config/colors";
import Constants from "expo-constants";
import { ITEM_FONT_SIZE, BUTTON_FONT_SIZE } from "../../config/constants";
import {sendNotification} from '../../services/emenu';
import Question from '../../components/Question';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;

export class _Infor extends React.Component {
  state = { showAbout: false };
  componentDidMount() {
    this.state={
      showAbout: false,
      lastBookingTime: (new Date()).getTime()
    };
  }
  renderAbout = () => {
    const { manifest } = Constants;
    const { endpoint,settings, BookingsStyle, t } = this.props;
    let FontSize= ITEM_FONT_SIZE*0.9;
    return (
      <TouchableWithoutFeedback
        onPress={()=>{return;}}
      >
      <View
        style={{
          position: "absolute",
          left: SCREEN_WIDTH / 4,
          top: SCREEN_HEIGHT * 0.2,
          width: SCREEN_WIDTH / 2,
          height: SCREEN_HEIGHT /2,
          borderColor: colors.grey3,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white"
        }}>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: "#008bc5", 
        width:'100%', height: BUTTON_FONT_SIZE * 2.5 }}>
          <Text style={{ height: ITEM_FONT_SIZE * 2, fontSize: ITEM_FONT_SIZE * 1.6, color: colors.white, textAlign: "center" }}>
          { translate.Get("Thuế và Phí").toUpperCase()} 
          </Text>
        </View>
        <View style={{flexDirection:'row', height: SCREEN_HEIGHT /2 - BUTTON_FONT_SIZE * 2.5 - ITEM_FONT_SIZE, width:'100%',justifyContent:'center'}}>
          <WebView
          originWhitelist={['*']}
          source={{ uri: endpoint.replace("api/", "") +'/EmenuHtml/TicketInfo' }}
          style={{ marginTop: 20 }}
        />
        </View>
        <View style={{height:ITEM_FONT_SIZE, justifyContent:'center', width:'100%', textAlign:'center'}}>
          <Text style={{color:colors.grey5, fontSize:ITEM_FONT_SIZE*0.6, textAlign:'center'}}>{translate.Get("@Copyright 2019 Hop Nhat Software All Rights Reserved")}</Text>
        </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  sendNotice = (type) =>{
    const {table,setState, sendNotice,t } = this.props;
    this.setState({isWorking:true});
    let now = (new Date()).getTime();
    if((now - this.state.lastBookingTime)/1000 < 60){
      this.setState({lastBookingTime: now},()=>{
        Question.alert(translate.Get('notice'),translate.Get('Cảm ơn bạn đã gọi, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất!'),[
          {
            text:'OK',
            onPress:()=>sendNotice(type)
          }
        ])
      });
      return;
    }
    let title = 'Bạn nhận được lời yêu cầu '+(type==1?'thanh toán ':'hỗ trợ')+'từ bàn ' + table.TbNo;
    sendNotification(type,title,title,table).then((res)=>{
      if(res.Status == 1){
        Question.alert(translate.Get('notice'),translate.Get('Cảm ơn bạn đã gọi, chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất!'),[
          {
            text:'OK',
            onPress:()=>sendNotice(type)
          }
        ])
      }
      
    }).catch((error)=>{
      console.log('sendNotice error:',error);
    });
  }
  render() {
    const {
      setState
    } = this.props;
    let that = this;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setState({ ShowFeesInfo: false });
        }}
      >
      <View 
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: SCREEN_WIDTH,
          height: '100%',
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        }}>
        {this.renderAbout()}
      </View>
      </TouchableWithoutFeedback>
    );
  }
}
