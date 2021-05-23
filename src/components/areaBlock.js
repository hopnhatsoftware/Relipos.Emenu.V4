
import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo';
import {BACKGROUND_COLOR, MARGIN_TOP} from '../config/constants';
export default AreaBlock = ({
  data, onPress, selectedIndex,allArea,
  leftComponent,rightComponent,...props}) => (
    <ScrollView  style={ styles.container} horizontal={true}>
    <TouchableOpacity key={0} onPress={()=>onPress.apply(null,[0])}>
    <LinearGradient
      colors={0==selectedIndex ?['#FCEAE5', '#EA5C33', '#E53400']:['#E5EAFC', '#1676b9', '#1159FD']} style={styles.item}>
      <Text style={{color:"white"}}>{allArea}</Text>
      </LinearGradient>
    </TouchableOpacity>
    {data.map((item, i) =>{
      return( 
        <TouchableOpacity key={item.AreID} onPress={()=>onPress.apply(null,[item.AreID])}>
        <LinearGradient
          colors={item.AreID==selectedIndex ?['#FCEAE5', '#EA5C33', '#E53400']:['#E5EAFC', '#1676b9', '#1159FD']} style={styles.item}>
          <Text style={{color:"white"}}>{item.AreName}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    } )}
    </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    height:30,
    maxHeight:37,
    marginBottom: 5,
    width:"100%",
    backgroundColor:"white",
  },
  item: {
    padding:5,
    height:30,
    borderWidth:0.5,
    borderColor:"white"
  },
  selectedItem: {
    fontSize:14,
    padding:5,
    height:30,
    borderWidth:0.5,
    color:"white",
    borderColor:"white"
  }
});
