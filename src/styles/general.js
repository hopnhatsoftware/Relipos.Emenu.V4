
import {
    StyleSheet, Dimensions} from 'react-native';
import { BACKGROUND_COLOR } from '../config/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default styles = StyleSheet.create({
    container: {
      flex:1,
      width: "100%" ,
      height: "100%",
      backgroundColor: BACKGROUND_COLOR
    },
    topPanel:{ 
      width: SCREEN_WIDTH - 40,
      marginTop:SCREEN_HEIGHT- 500,
      alignItems:"center"
    },
    buttonPanel:{ 
      width: SCREEN_WIDTH - 40,
      marginTop:20,
      borderRadius : 10,
      borderColor: "grey",
      borderWidth: 0.5,
      backgroundColor:"white",
      padding:5,
    },
    buttonPanelWithoutTop:{ 
      width: SCREEN_WIDTH - 40,
      marginTop:SCREEN_HEIGHT /2- 100,
      borderRadius : 5,
      borderColor: "grey",
      backgroundColor:"white",
      justifyContent:"space-between",
      padding:5,
      paddingRight:7,
    },
    buttonContainer:{
        borderWidth: 0,
        margin: 5,
        borderRadius:5,
    },
    button :{
      borderWidth:0,
      paddingHorizontal:20,
    },
    buttonText:{
      fontFamily:"bold",
      fontSize:14
    },
    inputText:{
      fontSize: 14,
      marginLeft: 10
    }
  });