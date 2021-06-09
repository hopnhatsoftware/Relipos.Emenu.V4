
import React, {Component} from 'react';
import {LinearGradient} from 'expo';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BACKGROUND_COLOR,THIRD_COLOR, SCREEN_WIDTH, SCREEN_HEIGHT,MARGIN_TOP, HEADER_HEIGHT,TABLE_HEADER_COLOR} from '../config/constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {formatTime,numberWithCommas} from '../services/util';
import translate from '../services/translate';
import GridStyles from '../styles/grid';
export default TableInfo = ({
  data, onPress, selectedId, translate, onClose, ticketInfo,
  leftComponent,rightComponent,...props}) => (
  <View style={[GridStyles.container,{height:SCREEN_HEIGHT-MARGIN_TOP-HEADER_HEIGHT}]}>
    <View style={styles.topPanel}>
      <View style={styles.rowItem}>
        <Text style={styles.itemLabel}>{translate.Get('ticket_no')}:</Text>
        <Text style={styles.itemValue}>{ticketInfo.TkNo}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.itemLabel}>{translate.Get('no_of_customer')}:</Text>
        <Text style={styles.itemValue}>{ticketInfo.TkCustomerQuantity}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.itemLabel}>{translate.Get('creater')}:</Text>
        <Text style={styles.itemValue}>{ticketInfo.ObjCreateName}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.itemLabel}>{translate.Get('total_amount')}:</Text>
        <Text style={styles.itemValue}>{ticketInfo.TkTotalAmount}</Text>
      </View>
    </View>
  <LinearGradient
    colors={TABLE_HEADER_COLOR} style={GridStyles.tableTitle}>
    <View style={[styles.id, GridStyles.border]}>
      <Text style={[styles.id, GridStyles.headerText]} numberOfLines={1}>{translate.Get('no')}</Text>
      </View>
    <View style={[styles.title, GridStyles.border]}>
      <Text style={[GridStyles.headerText]} numberOfLines={1}>{translate.Get('item_name')}</Text>
      </View>
    <View style={[styles.time, GridStyles.border]}>
      <Text style={[GridStyles.headerText]} numberOfLines={1}>{translate.Get('order_time')}</Text>
      </View>
    <View style={[styles.amount, GridStyles.border]}>
      <Text style={[GridStyles.headerText]} numberOfLines={1}>{translate.Get('total_amount')}</Text>
      </View>
    </LinearGradient>
    <ScrollView style={[GridStyles.container]}>
      {
        data.map((item,i)=>{
          return(
            <LinearGradient key={i}
              colors={ item.STT?["#0097ab","#0097ab"]:['#FFFFFF','#FFFFFF']}>
              <TouchableOpacity style={[GridStyles.item,{backgroundColor:item.STT?"#0097ab":"#FFFFFF"}]}>
    <View style={[styles.id, GridStyles.border]}>
                  <Text style={[GridStyles.itemText]} numberOfLines={1}>{item.STT}</Text>
      </View>
    <View style={[styles.title, GridStyles.border]}>
                  <Text textBreakStrategy="highQuality" style={[ GridStyles.itemText]}>{item.PrdName}</Text>
      </View>
    <View style={[styles.time, GridStyles.border]}>
                  <Text style={[ GridStyles.itemText]} numberOfLines={1}>{formatTime(item.TkdOrderTime)}</Text>
      </View>
    <View style={[styles.amount, GridStyles.border]}>
                  <Text style={[GridStyles.itemText]} numberOfLines={1}>{numberWithCommas(item.TkdTotalAmount)}</Text>
      </View>
              </TouchableOpacity>
            </LinearGradient>
            );
        })
      }
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  itemLabel:{
    width:120,
    fontWeight:"bold"
  },
  itemValue:{
    width:wp('100%')- 140,
  },
  topPanel:{
    width: SCREEN_WIDTH,
    paddingTop:10,
    alignItems:"center",
    backgroundColor:"white",
    marginVertical:5,

  },
  rowItem:{
    paddingLeft:20,
    height:30,
    flexDirection:"row",
    width:"100%",
    justifyContent:"space-between",
  },
  id:{
    width:30,
  },
  title:{
    width:wp("100%") - 220,
  },
  time:{
    width:60,
  },
  amount:{
    width:100,
  }
});
