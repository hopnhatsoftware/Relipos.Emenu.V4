
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  
} from 'react-native';
import { ListItem } from 'react-native-elements'

import {_retrieveData, _storeData} from '../services/storages';
import { MARGIN_TOP, ENDPOINT_URL } from '../config/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class BranchesListCombo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const{data} = this.props;
    return (
      <FlatList style={styles.container} data={data} 
      renderItem={({ item,ind }) => (
        <ListItem key={item.ObjId}
          title={`${item.ObjName}`}
          containerStyle={styles.item}
          onPress={()=>this.props.onPress.apply(null,[item])}
        />
      )} >
      </FlatList>);
  }
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH ,
    height: SCREEN_HEIGHT,
    marginTop:MARGIN_TOP,
    backgroundColor: 'rgba(25, 133, 208, 1)'
  },
  item:{
    width:"100%"
  }
});