import {Modal, View, Alert,Dimensions} from 'react-native';
import React, {Component} from 'react';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const minDate = ()=> {
    let now = new Date();
    var fiftyYearAgo = new Date();
    fiftyYearAgo.setFullYear(now.getFullYear -50);
    return fiftyYearAgo;
}
const twentyYearAgo = ()=> {
    let now = new Date();
    var twentyYearAgo = new Date();
    twentyYearAgo.setFullYear(now.getFullYear -20);
    return twentyYearAgo;
}
export class DatePicker extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View  style={{marginTop: SCREEN_HEIGHT/2 - 100}}>
        <Modal
         style={{marginTop: 100}}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}><DatePickerIOS mode="date" setDate={(newDate) =>this.props.setDate(newDate)} date={new Date()} maximumDate={new Date()} minimumDate={new Date()}/>
        </Modal>
      </View>
    
    );
  }
}