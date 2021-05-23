

import {
  StyleSheet, Dimensions} from 'react-native';
import colors from '../config/colors';
import Constants from 'expo-constants'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
formContainer:{ 
  width: SCREEN_WIDTH - 40,
  borderRadius : 10,
  borderColor: "grey",
  borderWidth: 0.5,
  backgroundColor:"white",
  padding:5,
},
checkboxContainer:{
  borderWidth:0,
  backgroundColor:"transparent"
},
buttonContainer:{
    borderWidth: 0,
    margin: 1,
    borderRadius:5,
    width:"100%",
},

button :{
  borderWidth:0,
  paddingHorizontal:20,
  paddingVertical:20,
  backgroundColor: "transparent",
  justifyContent:"flex-start"
},

buttonOneThird :{
  width:"30%",
  borderWidth:0,
  padding:20,
  backgroundColor: "transparent",
  justifyContent:"flex-start"
},

buttonHaft :{
  width:"50%",
  borderWidth:0,
  paddingTop:20,
  paddingBottom:20,
  paddingHorizontal: 40,
  backgroundColor: "transparent",
  justifyContent:"flex-start"
},

errorInputStyle: {
  marginTop: 0,
  textAlign: 'center',
  color: '#F44336',
},

container: {
  flex: 1,
  paddingBottom: 20,
  paddingTop: 20,
  backgroundColor: '#FFFFFF',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  alignItems: 'center',
  justifyContent: 'space-around',
  marginTop: Constants.statusBarHeight,
},
formContainer: {
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
},
signUpText: {
  color: 'white',
  fontSize: 28,
  fontFamily: 'light',
},
whoAreYouText: {
  color: '#7384B4',
  fontFamily: 'bold',
  fontSize: 14,
},
userTypesContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: SCREEN_WIDTH,
  alignItems: 'center',
},
userTypeItemContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.5,
},
userTypeItemContainerSelected: {
  opacity: 1,
},
userTypeMugshot: {
  margin: 4,
  height: 70,
  width: 70,
},
userTypeMugshotSelected: {
  height: 100,
  width: 100,
},
userTypeLabel: {
  color: 'yellow',
  fontFamily: 'bold',
  fontSize: 11,
},
inputContainer: {
  paddingLeft: 8,
  borderWidth: 1,
  borderColor: 'rgba(110, 120, 170, 1)',
  height: 45,
  marginVertical: 10,
},
inputStyle: {
  fontFamily: 'light',
  fontSize: 16,
},
signUpButtonText: {
  fontFamily: 'bold',
  fontSize: 13,
},
signUpButton: {
  width: 250,
  borderRadius: 10,
  height: 45,
  backgroundColor: '#034e7d',
},
loginHereContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
alreadyAccountText: {
  fontFamily: 'lightitalic',
  fontSize: 12,
},
loginHereText: {
  color: '#FF9800',
  fontFamily: 'lightitalic',
  fontSize: 12,
},
primaryButton :{
  borderWidth:0,
  paddingHorizontal:20,
  justifyContent:"flex-start",
  backgroundColor:colors.blue,
  borderColor: colors.blue2
},
successButton :{
  borderWidth:0,
  paddingHorizontal:20,
  justifyContent:"flex-start",
  backgroundColor:colors.green,
  borderColor: colors.green2
},
warningButton :{
  borderWidth:0,
  paddingHorizontal:20,
  justifyContent:"flex-start",
  backgroundColor:colors.orange,
  borderColor: colors.orange
},
dangerButton :{
  borderWidth:0,
  paddingHorizontal:20,
  justifyContent:"flex-start",
  backgroundColor:colors.red,
  borderColor: colors.red2
},

buttonText:{
  fontFamily:"bold",
  fontSize:14,
},
inputText:{
  fontSize: 14,
  marginLeft: 10,
},
overlay: {
  flex: 1,
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0.5,
  backgroundColor: 'black',
}  ,

});