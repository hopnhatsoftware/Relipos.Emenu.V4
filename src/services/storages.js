import { AsyncStorage } from "react-native";
import {Util} from 'expo';
 export const _storeData = async (key, value, callback) => {
    try {
      await AsyncStorage.setItem('@LKI:'+ key, value,callback);
    } catch (error) {
      // Error saving data
       console.error(error);
    }
  }
  export const _retrieveData = async (key, def) => {
    try {
      const value = await AsyncStorage.getItem('@LKI:'+ key);
      if(value != null){
        return value;
      }
      else{
        return def;
      }
     } catch (error) {
       // Error retrieving data
       console.log(error);
       return null;
     }
  }
  export const _logout = async(callback) =>{
    try {
      AsyncStorage.removeItem('@LKI:user',callback);
     } catch (error) {
       // Error retrieving data
       console.log(error);
       return null;
     }
  }
  export const _remove = async(key, callback) =>{
    try {
      AsyncStorage.removeItem('@LKI:'+ key,callback);
     } catch (error) {
       // Error retrieving data
       console.log(error);
       return null;
     }
  }
  export const _clearData = async(_clearData) =>{
    try {
      const value = await AsyncStorage.clear(_clearData);
     } catch (error) {
       // Error retrieving data
       console.log(error);
       return null;
     }
  }