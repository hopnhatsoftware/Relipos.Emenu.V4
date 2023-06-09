
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  FlatList,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import colors from '../../config/colors';
import { _retrieveData, _storeData } from '../../services/storages';
import { FormInputText, Button } from '../../components';
import { Icon } from "react-native-elements";
import { LOGIN_INPUT_FONT_SIZE, ITEM_FONT_SIZE, BACKGROUND_COLOR, H2FontSize ,H3FontSize,H4_FONT_SIZE,H3_FONT_SIZE, H2_FONT_SIZE, H1_FONT_SIZE} from '../../config/constants';
import styles from '../../styles/general'
import Question from '../../components/Question';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export class _TableInfo extends React.Component {
  CustomerId = null;
  textInputCustomquantity = null;
  textInputDeviceName = null;
  textInputDescription = null;
  textInputMaleQuantity = null;
  textInputFemaleQuantity = null;
  textInputChildrenQuantity = null;
  textInputForeignQuantity = null;
  textInputCustomerName = null;
  state = {
    keysearch: '',
      isColor:false,
      top: 0,
  };
  async componentDidMount() {
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    this.setState({isColor: isColor});
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
    const { onClose, onPressAc, onPressShow, translate, isLoading,backgroundColor,TicketInfor } = this.props;
    let {isColor}=this.state;
    return (
      <View style={{backgroundColor: "rgba(98,98,98,0.6)", position: "absolute", width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', height: SCREEN_HEIGHT}}>
        <View style={[{backgroundColor:this.state.isColor == true ? "#222222" : colors.white, borderWidth: 1, position: "absolute",  width: SCREEN_WIDTH*0.65,height:SCREEN_HEIGHT*0.6, borderColor: backgroundColor},]}>
            <KeyboardAvoidingView behavior='position'>
            <ScrollView style={{ width: '100%', }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderColor: backgroundColor,marginTop:-1,marginRight:-1,marginLeft:-1,
          backgroundColor: backgroundColor, height: SCREEN_HEIGHT*0.6*0.1,paddingTop:10,paddingBottom:10 }}> 
            <Text style={{ height: 35, fontSize:H2FontSize, color: colors.white, textAlign: 'center', fontFamily: 'RobotoBold' }}>{translate.Get("ticket_info")}</Text>
          </View>
                <View style={{ backgroundColor: this.state.isColor == true ? "#222222" :'white', height:SCREEN_HEIGHT*0.6*0.7,flexDirection:'column'}}>
                  <View style={{flexDirection:'row',width: '100%', height:SCREEN_HEIGHT*0.6*0.15, justifyContent:'space-evenly'}}>
                  <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Khách nam')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.TkMaleQuantity ? TicketInfor.TkMaleQuantity.toString() : ''}
                        placeholder={translate.Get('Số lượng khách nam')}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        keyboardType="numeric" 
                        onChangeText={(textInput) => { TicketInfor.TkMaleQuantity= textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                    <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Khách nữ')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.TkFemaleQuantity ? TicketInfor.TkFemaleQuantity.toString() : ''}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        keyboardType="number-pad" 
                        placeholder={translate.Get('Số lượng khách nữ')}
                        onChangeText={(textInput) => {TicketInfor.TkFemaleQuantity = textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',width: '100%', height:SCREEN_HEIGHT*0.6*0.15, justifyContent:'space-evenly'}}>
                  <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Trẻ em')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.TkChildrenQuantity ? TicketInfor.TkChildrenQuantity.toString() : ''}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        keyboardType="number-pad" 
                        placeholder={translate.Get('Số lượng trẻ em')}
                        onChangeText={(textInput) => { TicketInfor.TkChildrenQuantity= textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                    <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Khách nước ngoài')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.TkForeignQuantity ? TicketInfor.TkForeignQuantity.toString() : ''}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        keyboardType="number-pad" 
                        placeholder={translate.Get('SL khách nước ngoài')}
                        onChangeText={(textInput) => {TicketInfor.TkForeignQuantity = textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',width: '100%', height:SCREEN_HEIGHT*0.6*0.15, justifyContent:'space-evenly'}}>
                  <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Số lượng khách')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.TkCustomerQuantity ? TicketInfor.TkCustomerQuantity.toString() : ''}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        autoFocus={true}
                        keyboardType="number-pad" 
                        placeholder={translate.Get('Số lượng khách')}
                        onChangeText={(textInput) => { TicketInfor.TkCustomerQuantity= textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                    <View style={{height:'100%',width:'49%',justifyContent:'center',alignItems:'center'}}>
                      <View style={{position:'absolute',top:'5%',left:'10%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Khách hàng')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'60%',width:'90%',borderWidth:0.5,borderRadius:8,paddingHorizontal:5, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.CustomerName}
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        placeholder={translate.Get('Dạng khách')}
                        onChangeText={(textInput) => {TicketInfor.CustomerName = textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                    </View>
                  </View>
                  <View style={{ position: 'absolute', right: '4%', top: '48%', }}>
                          <TouchableOpacity onPress={() => { Keyboard.dismiss(); onPressShow.apply(null, []); }}>
                            <Icon name="contacts" type="antdesign" color={this.state.isColor == true ? "#FFFFFF" : '#000000'} size={H1_FONT_SIZE} />
                          </TouchableOpacity>
                        </View>
                 <View style={{ backgroundColor: this.state.isColor == true ? "#222222" :'white', height:SCREEN_HEIGHT*0.6*0.25, justifyContent:'center',alignItems:'center'}}>
                    <View style={{position:'absolute',top:'0%',left:'5%',zIndex:101}} >
                        <Text style={{backgroundColor:isColor == true ?'#222222':'#FFFFFF',height:'100%',width:'100%',fontSize:H4_FONT_SIZE, color:isColor == true ? '#FFFFFF': '#000000'}}>{translate.Get('Ghi chú')}</Text>                      
                      </View>
                      <TextInput
                        style={{height:'80%',width:'94%',borderWidth:0.5,borderRadius:8,paddingHorizontal:8, borderColor:isColor == true ? '#FFFFFF': '#000000',color:isColor == true ? '#FFFFFF': '#000000'}}
                        value={TicketInfor.Description}
                        multiline={true} 
                        placeholderTextColor={isColor == true ? '#B9B0B0': '#B9B0B0'}
                        numberOfLines={10} 
                        placeholder={translate.Get('Diễn giải thông tin khách hàng')}
                        onChangeText={(textInput) => {TicketInfor.Description = textInput; this.setState({ TicketInfor }) }}>
                      </TextInput>
                 </View>
                </View>
                <View style={{ width: '100%', justifyContent:'center',height:SCREEN_HEIGHT*0.6*0.08}}> 
            <Text style={{color: this.state.isColor == true ? "#FFFFFF" : "red",textAlign:'center' ,fontSize:H2_FONT_SIZE*0.9}}>Sau khi vào bàn, bạn hãy khóa bàn trước khi giao cho khách</Text>
            </View>
            <View style={{
            width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: SCREEN_HEIGHT*0.6*0.12,
          }}>
              <Button
                containerStyle={{ backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center', 
                width: '48%',borderBottomLeftRadius: 6,height:'85%',}}
                title={translate.Get('Bỏ qua')} 
                titleStyle={{ color: colors.white, fontSize: H3FontSize }}
                onPress={() => onClose.apply(null, [])}
                disabled={isLoading} />
             
              <Button
                containerStyle={{ backgroundColor: BACKGROUND_COLOR, justifyContent: 'center',
                 alignItems: 'center', width: '48%',height:'85%', borderBottomRightRadius: 6,}}
                title={translate.Get('Chấp nhận')}
                titleStyle={{ color: colors.white, fontSize: H3FontSize, }}
                onPress={() => onPressAc.apply(null, [])}
                disabled={isLoading} />
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
          
        </View>
      </View>
    );
  };
}