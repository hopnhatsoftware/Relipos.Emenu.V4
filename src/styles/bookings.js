

import {
  StyleSheet, Dimensions
} from 'react-native';
import colors from '../config/colors';
import Constants from 'expo-constants';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
  header: {
    
    // backgroundColor: "#333D4C",
    width: SCREEN_WIDTH * 0.818,
    flexDirection: "row", //Step 1
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  header_logo: {
    width: SCREEN_WIDTH * 0.12,
  },
  header_search: {
    paddingHorizontal: 10,
  },
  item_search: {
    height: SCREEN_HEIGHT * 0.052,
  },
  header_label: {
    color: '#d0cfcf',
    fontFamily: "RobotoMedium",
  },
  header_label_selected: {
    fontFamily: "RobotoMedium",
    color: 'white',
  },
  left_menu: {
    width: SCREEN_WIDTH * 0.16,
    borderRightWidth: 1,
    borderRightColor: 'white'
  },
  left_menu_subitem: { //con
    paddingLeft: SCREEN_WIDTH * 0.0025
  },
  left_menu_label: { //text
    fontSize: SCREEN_HEIGHT * 0.001,
    color: 'white',
  },
  left_menu_subitem_label: {
    fontSize: SCREEN_HEIGHT * 0.0008,
    color: 'white',
  },
  left_menu_item: { // cha
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: SCREEN_WIDTH * 0.002,
    height: SCREEN_HEIGHT * 0.08,
    backgroundColor: '#2599aa',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white'
  },
  left_table_box: { // table
    padding: SCREEN_WIDTH * 0.0025,
    backgroundColor: 'white'
  },
  items_box: { //1 item
    backgroundColor: "white"
  },
  item: { // item
    height: SCREEN_HEIGHT * 0.28,
    width: SCREEN_WIDTH * 0.42,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 3,
    borderBottomColor: 'white'
  },
  item_image: {
    height: SCREEN_HEIGHT * 0.28,
    width: SCREEN_WIDTH * 0.28,
  },
  item_info: {
    padding: SCREEN_HEIGHT * 0.015,
  },
  bottombar: {
    height: SCREEN_HEIGHT * 0.08,
  },
  item_Toobal: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#2599aa',
  },
  item_order: {
    backgroundColor: 'white',
    borderBottomColor: '#bdc6cf',
    borderTopColor: 'white',
  },
  left_menu_Item: {
    width: SCREEN_WIDTH * 0.2,
  },
  table_image: {
    height: SCREEN_HEIGHT * 0.254,
  },
  item_booking_order: {
    paddingRight: SCREEN_HEIGHT * 0.01,
    width: '50%',
    justifyContent: "center",
    flexDirection: 'row',
  },

});