
import React, { Component } from 'react';
import { TextInput, Text, View } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { LOGIN_INPUT_FONT_SIZE } from '../config/constants';
import colors from '../config/colors';
export class FormInputText extends React.Component {
  render() {
    let { icon, nameText, type, inputStyle, textStyle, refInput, secureTextEntry, leftIcon, iconRight, color, rightIcon, inputContainerStyle } = this.props;
    return (
      <View style={[{
        flexDirection: 'row',
        height: 'auto',
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: 'transparent', paddingHorizontal: 0
      }, inputContainerStyle]}>
        <View style={{ position: 'absolute', top: -12, left: 20, backgroundColor: colors.white }}>
          <Text style={[{ fontSize: LOGIN_INPUT_FONT_SIZE / 1.3 }, textStyle]}>{nameText ? nameText : ''}</Text>
        </View>
        <TextInput
          secureTextEntry={typeof secureTextEntry == 'undefined' ? false : secureTextEntry}
          ref={refInput}
          style={[{
            width: '100%', borderBottomWidth: 0,
            paddingLeft: leftIcon || icon ? LOGIN_INPUT_FONT_SIZE / 1.4 : 5,
            paddingRight: rightIcon || iconRight ? LOGIN_INPUT_FONT_SIZE : 0, color: color ? color : colors.grey1
          }, inputStyle]}
          autoFocus={false}
          autoCapitalize="none"
          keyboardAppearance="dark"
          autoCorrect={false}
          blurOnSubmit={false}
        />
        {rightIcon ?
          <View style={{ position: 'absolute', right: 4 }}>{rightIcon}</View>
          :
          <AntDesign name={iconRight} style={{ position: 'absolute', right: 0 }}
            color='rgba(0, 0, 0, 0.38)' size={LOGIN_INPUT_FONT_SIZE} />
        }
      </View>
    )
  }
}