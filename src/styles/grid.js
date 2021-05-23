
import {
    StyleSheet, Dimensions} from 'react-native';
import {BACKGROUND_COLOR} from '../config/constants';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default GridStyles = StyleSheet.create({
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
    border:{
      paddingLeft:2,
      borderRightWidth:0.5,
      borderColor:"grey",
    }
  });