
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
import { LOGIN_INPUT_FONT_SIZE, ITEM_FONT_SIZE, BACKGROUND_COLOR, H2FontSize ,H3FontSize,H4FontSize} from '../../config/constants';
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
  }
  state = {
    top: 0,
  };
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
    const { onClose, onPress, onPressShow, TicketInfor, translate, isLoading,backgroundColor,pnHeaderheight } = this.props;
    return (
      <View style={{ backgroundColor: "rgba(98,98,98,0.6)", position: "absolute", width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', height: SCREEN_HEIGHT + Constants.statusBarHeight }}>
        <View style={[{ backgroundColor: colors.white, borderWidth: 1, position: "absolute",  width: SCREEN_WIDTH*0.6,height:'60%', borderColor: backgroundColor},]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderColor: backgroundColor,marginTop:-1,marginRight:-1,marginLeft:-1,
          backgroundColor: backgroundColor, height: pnHeaderheight,paddingTop:10,paddingBottom:10 }}> 
            <Text style={{ height: 35, fontSize:H2FontSize, color: colors.white, textAlign: 'center', fontFamily: 'RobotoBold' }}>{translate.Get("Thông tin phiếu")}</Text>
          </View>
          <ScrollView style={{ width: '100%', }}> 
            <KeyboardAvoidingView behavior='position' style={{ paddingBottom: 70 }}>
             
                <View style={{ backgroundColor: 'white',borderRadius: 8, }}>
                  <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, width: '100%' }}>
                  </View>
                  <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, width: '100%' }}>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          nameText={translate.Get('Khách nam')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          keyboardType="numeric"
                          autoCorrect={false}
                          color='#000'
                          returnKeyType='next'
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          icon='user'
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Số lượng khách nam')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputMaleQuantity = input}
                          onChangeText={(textInputMaleQuantity) => { TicketInfor.TkMaleQuantity = textInputMaleQuantity; this.setState({ TicketInfor }) }}
                          value={TicketInfor.TkMaleQuantity ? TicketInfor.TkMaleQuantity.toString() : ''}
                          onSubmitEditing={() => {
                            setTimeout(() => this.textInputFemaleQuantity.focus(), 100)
                          }} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          nameText={translate.Get('Khách nữ')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          keyboardType="numeric"
                          autoCorrect={false}
                          color='#000'
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          returnKeyType='next'
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Số lượng khách nữ')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputFemaleQuantity = input}
                          onChangeText={(textInputFemaleQuantity) => { TicketInfor.TkFemaleQuantity = textInputFemaleQuantity; this.setState({ TicketInfor }) }}
                          value={TicketInfor.TkFemaleQuantity ? TicketInfor.TkFemaleQuantity.toString() : ''}
                          onSubmitEditing={() => {
                            setTimeout(() => this.textInputChildrenQuantity.focus(), 100)
                          }} />
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, width: '100%' }}>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          nameText={translate.Get('Trẻ em')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          autoCorrect={false}
                          keyboardType="numeric"
                          color='#000'
                          returnKeyType='next'
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Số lượng trẻ em')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputChildrenQuantity = input}
                          onChangeText={(textInputChildrenQuantity) => { TicketInfor.TkChildrenQuantity = textInputChildrenQuantity; this.setState({ TicketInfor }) }}
                          value={TicketInfor.TkChildrenQuantity ? TicketInfor.TkChildrenQuantity.toString() : ''}
                          onSubmitEditing={() => {
                            setTimeout(() => this.textInputForeignQuantity.focus(), 100)
                          }} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          value={TicketInfor.TkForeignQuantity ? TicketInfor.TkForeignQuantity.toString() : ''}
                          nameText={translate.Get('Khách nước ngoài')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          autoCorrect={false}
                          keyboardType="numeric"
                          color='#000'
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          returnKeyType='next'
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('SL khách nước ngoài')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputForeignQuantity = input}
                          onChangeText={(textInputForeignQuantity) => { TicketInfor.TkForeignQuantity = textInputForeignQuantity; this.setState({ TicketInfor }) }}
                          onSubmitEditing={() => {
                            setTimeout(() => this.textInputCustomquantity.focus(), 100)
                          }} />
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, width: '100%' }}>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          value={TicketInfor.TkCustomerQuantity ? TicketInfor.TkCustomerQuantity.toString() : '1'}
                          nameText={translate.Get('Số lượng khách')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          keyboardType="numeric"
                          autoCapitalize='none'
                          autoCorrect={false}
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          color='#000'
                          returnKeyType='next'
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Số lượng khách')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputCustomquantity = input}
                          onChangeText={(textInputCustomquantity) => { TicketInfor.TkCustomerQuantity = textInputCustomquantity; this.setState({ TicketInfor }); }}
                          onSubmitEditing={() => {
                            setTimeout(() => this.textInputCustomerName.focus(), 100);
                          }} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '50%', paddingRight: 5, }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          value={TicketInfor.CustomerName ? TicketInfor.CustomerName : ''}
                          nameText={translate.Get('Khách hàng')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          autoCorrect={false}
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          color='#000'
                          onFocus={() => { Keyboard.dismiss(); onPressShow.apply(null, []); }}
                          returnKeyType='next'
                          inputStyle={{ height: LOGIN_INPUT_FONT_SIZE * 2, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Dạng khách')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputCustomerName = input} />
                        <View style={{ position: 'absolute', right: '4%', top: '40%' }}>
                          <TouchableOpacity onPress={() => { Keyboard.dismiss(); onPressShow.apply(null, []); }}>
                            <Icon name="caretdown" type="antdesign" size={ITEM_FONT_SIZE} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10, paddingRight: 10, width: '100%' }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={[{ width: '100%', paddingTop: 10, }]}>
                        <FormInputText
                          value={TicketInfor.Description ? TicketInfor.Description.toString() : ''}
                          nameText={translate.Get('Ghi chú')}
                          keyboardAppearance='light'
                          autoFocus={false}
                          autoCapitalize='none'
                          autoCorrect={false}
                          color='#000'
                          inputContainerStyle={{ borderRadius: 4, borderColor: '#DEDEDE', backgroundColor: '#FFFFFF', }}
                          returnKeyType='next' 
                          inputStyle={{ height: H3FontSize * 5, paddingLeft: 10 }}
                          textStyle={{ color: '#000000' }}
                          placeholder={translate.Get('Diễn giải thông tin khách hàng')}
                          placeholderTextColor="#bdc6cf"
                          refInput={input => this.textInputDescription = input}
                          onChangeText={(textInputDescription) => { TicketInfor.Description = textInputDescription; this.setState({ TicketInfor }); }}
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                            this.setState({ TicketInfor });
                          }} />
                      </View>
                    </View>
                  </View>
                </View>
            
            </KeyboardAvoidingView>
          </ScrollView>
          <View style={{
            width: '100%', flexDirection: 'row',  position: 'absolute', bottom: 0, justifyContent: 'space-evenly', alignItems: 'center', height: pnHeaderheight,marginBottom:-1
          }}>
              <Button
                containerStyle={{ backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center', 
                width: '50%',borderBottomLeftRadius: 6,marginLeft:-1 }}
                title={translate.Get('Bỏ qua')} 
                titleStyle={{ color: colors.white, fontSize: H3FontSize }}
                onPress={() => onClose.apply(null, [])}
                disabled={isLoading} />
             
              <Button
                containerStyle={{ backgroundColor: BACKGROUND_COLOR, justifyContent: 'center',
                 alignItems: 'center', width: '50%', borderBottomRightRadius: 6,marginRight:-1 }}
                title={translate.Get('Chấp nhận')}
                titleStyle={{ color: colors.white, fontSize: H3FontSize, }}
                onPress={() => { onPress.apply(null, []); }}
                disabled={isLoading} />
            </View>
        </View>
      </View>
    );
  };
}