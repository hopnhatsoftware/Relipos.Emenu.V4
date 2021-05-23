import {LinearGradient} from 'expo';
import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BACKGROUND_COLOR,MAIN_COLOR, SCREEN_WIDTH, SCREEN_HEIGHT,TABLE_HEADER_COLOR, THIRD_COLOR} from '../config/constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {numberWithCommas} from '../services/util';
export default UsingGrid = ({
  data, onPress, selectedId, t,
  leftComponent,rightComponent,...props}) => (
  <View>
  <LinearGradient
    colors={TABLE_HEADER_COLOR} style={styles.tableTitle}>
    <View style={[styles.id, styles.border]}>
      <Text style={[ styles.headerText]} numberOfLines={1}>{t._('no')}</Text>
      </View>
    <View style={[styles.table, styles.border]}>
      <Text style={[styles.headerText]} numberOfLines={1}>{t._('table')}</Text>
      </View>
    <View style={[styles.number, styles.border]}>
      <Text style={[styles.headerText]} numberOfLines={1}>{t._('no_of_customer')}</Text>
      </View>
    <View style={[styles.time, styles.border]}>
      <Text style={[styles.headerText]} numberOfLines={1}>{t._('time')}</Text>
      </View>
    <View style={[styles.amount, styles.border]}>
      <Text style={[styles.headerText]} numberOfLines={1}>{t._('amount')}</Text>
      </View>
    </LinearGradient>
    <ScrollView style={styles.container}>
      {
        data.map((item,i)=>{
          let color = getColor(item.Status);
          return(
            <LinearGradient key={item.TabId}
              colors={ selectedId ==item.TabId? ['#1e93e4', '#1676b9', '#11598c']:[color,color]}>
            <TouchableOpacity style={[styles.item,{backgroundColor:item.Title?"#FFCA7A":""}]} onPress={()=>onPress.apply(null,[item])}>
            <View style={[styles.id,styles.border]}>
                  <Text style={styles.itemText} numberOfLines={1}>{item.STT}</Text>
                  </View>
            <View style={[styles.table, styles.border]}>
                  <Text style={styles.itemText} >{item.TbNo}</Text>
                  </View>

            <View style={[styles.number, styles.itemText, styles.border]}>
                  <Text style={styles.itemText} >{item.TkCustomerQuantity}</Text>
                  </View>

            <View style={[styles.time, styles.itemText, styles.border]}>
                  <Text style={styles.itemText} numberOfLines={1}>{item.TkCreateTime}</Text>
                  </View>

            <View style={[styles.amount, styles.itemText, styles.border]}>
                  <Text style={styles.itemText} numberOfLines={1}>{numberWithCommas(item.TkPaymentAmount)}</Text>
                  </View>

            </TouchableOpacity>
            </LinearGradient>
            );
        })
      }
    </ScrollView>
  </View>
);
const getColor =(status)=>{
  let color ='#0097ab';
  switch (status) {
    case 1:
        color='#0097ab';
      break;
    case 2:
        color='#ffa500';
      break;
    case 4:
        color='#c40707';
      break;
    case 5:
        color='#46cb04';
      break;
    default:
    color='#9f7343';
  }
  return color;
}
const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT- 110,
    backgroundColor:"white", 
  },
  tableTitle: {
    height:30,
    backgroundColor:BACKGROUND_COLOR, 
    flexDirection:"row",
    justifyContent:"space-between"
  },
  headerText:{
    paddingVertical: 5,
    fontWeight:"bold",
    color:"white",
  },
  item: {
    flexDirection:"row",
    backgroundColor:"#0097ab",
    justifyContent:"space-between",
    borderBottomWidth:0.5,
    borderBottomColor:"grey"
  },
  itemText:{
    color:"white",
    paddingVertical:5,
  },
  id:{
    width:30,
  },
  number:{
    textAlign: "right",
    width:80,
  },
  time:{
    textAlign: "right",
    width:80,
  },
  table:{
    textAlign: "left",
    width:60,
  },
  amount:{
    textAlign: "right",
    width:SCREEN_WIDTH - 260,
  },
  border:{
    paddingLeft:2,
    borderRightWidth:0.5,
    borderColor:"grey",
  }
});
