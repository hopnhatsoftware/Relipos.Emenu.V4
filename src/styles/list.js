
import {
    StyleSheet, Dimensions} from 'react-native';
import {BACKGROUND_COLOR,ITEM_FONT_SIZE} from '../config/constants';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default ListStyles = StyleSheet.create({
  item:{
    padding:4,
  },
  selectedItem:{
    padding:4,
    backgroundColor:BACKGROUND_COLOR,
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:"white"
  },
  title:{
    fontSize:ITEM_FONT_SIZE
  },
  subtitle:{
    color:"grey",
    fontSize:12,
  },
  selectedTitle:{
    color:"white",
  },
  selectedSubtitle:{
    color:"white",
    fontSize:12,
  }
  });