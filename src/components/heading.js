import React from 'react';
import { Header } from 'react-native-elements'
import {HEADER_HEIGHT, HEADER_MARGIN_TOP, TITLE_FONT_SIZE} from '../config/constants';
import colors from '../config/colors';
export default ({rightComponent,
  title, leftComponent}) => (
  <Header
  rightComponent={rightComponent}
  leftComponent={leftComponent}
  containerStyle={{marginTop:HEADER_MARGIN_TOP,marginBottom:2, paddingTop:0, 
  height:HEADER_HEIGHT, backgroundColor:"transparent",
  borderBottomWidth:2, borderTopWidth: 2, borderColor: colors.primary,borderBottomColor:colors.primary}}
  backgroundColor={colors.grey1}
  statusBarProps={{translucent:true}}
  centerComponent={{ text: title.toUpperCase(), style: {  color: colors.primary, fontSize: TITLE_FONT_SIZE,fontWeight:"bold"} }} />
);