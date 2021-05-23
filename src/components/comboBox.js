
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  FlatList

} from 'react-native';
import Constants from 'expo-constants';
import colors from '../config/colors';
import { AntDesign } from '@expo/vector-icons';
import { _retrieveData, _storeData } from '../services/storages';
import { MARGIN_TOP, ENDPOINT_URL, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, TITLE_FONT_SIZE } from '../config/constants';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export class ComboBox extends React.Component {
  render() {
    let { data, t, keyId, value, name, onCancel, onSelect, selectedId } = this.props;
    return (
      <View style={{ backgroundColor: "rgba(98,98,98,0.6)", position: "absolute", top: 0, left: 0, width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', height: SCREEN_HEIGHT + Constants.statusBarHeight }}>
        <View style={[{ borderColor: colors.grey3, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: colors.white, width: SCREEN_WIDTH / 1.1 },
        { height: SCREEN_HEIGHT * 0.5 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#008bc5', height: BUTTON_FONT_SIZE * 2.5, borderTopLeftRadius: 4, borderTopRightRadius: 4, }}>
            <Text style={{ height: 25, fontSize: TITLE_FONT_SIZE / 1.8, color: colors.white, textAlign: 'center' }}>{name}</Text>
            <View style={{ position: 'absolute', right: ITEM_FONT_SIZE, borderRadius: ITEM_FONT_SIZE, }}>
              <TouchableOpacity style={{ width: ITEM_FONT_SIZE * 1.5, height: ITEM_FONT_SIZE * 1.5, }}
                onPress={() => onCancel()} >
                <AntDesign name="close" color={colors.white} size={ITEM_FONT_SIZE * 1.5} />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList style={{ padding: '2%' }}
            data={data}
            renderItem={({ item, index }) => {

              let backgroundColor = item[keyId] == selectedId ? '#DFE8F6' : 'white';
              return (
                <TouchableOpacity key={index.toString()}
                  style={[styles.item, { backgroundColor }]}
                  onPress={() => onSelect(item)}
                ><Text style={styles.itemText}>{item[value]}</Text>
                </TouchableOpacity>
              )
            }} >
          </FlatList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: '5%', paddingRight: '10%'
  },
  item: {
    width: SCREEN_WIDTH / 1.1,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    height: ITEM_FONT_SIZE * 2.5,
    justifyContent: 'center'
  },
  button: {
    width: "50%",
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  itemText: {
    alignItems: 'center',
    fontSize: ITEM_FONT_SIZE,
  },
});