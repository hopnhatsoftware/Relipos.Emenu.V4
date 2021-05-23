
import React from "react";
import { TextInput, View } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { LOGIN_INPUT_FONT_SIZE } from '../config/constants';
import colors from '../config/colors';
export const FormInput = props => {
  const { icon, type, inputStyle, refInput, secureTextEntry, leftIcon, iconRight, color, rightIcon, inputContainerStyle, ...otherProps } = props
  
  return (
    <View style={[{
      flexDirection: 'row',
      height: 'auto', borderColor: colors.grey3, borderRadius: 3, borderBottomWidth: 1,
      alignItems: 'center',
      backgroundColor: 'transparent', paddingHorizontal: 0
    }, inputContainerStyle]}>
      <TextInput
        secureTextEntry={typeof secureTextEntry == 'undefined' ? false : secureTextEntry}
        ref={refInput}
        // style={{ minHeight:0, height:'auto',paddingLeft:LOGIN_INPUT_FONT_SIZE*0.4,  fontSize: LOGIN_INPUT_FONT_SIZE/1.4, color:'#000' }}
        style={[{
          width: '100%', borderBottomWidth: 0, height: LOGIN_INPUT_FONT_SIZE * 3,
          paddingLeft: leftIcon || icon ? LOGIN_INPUT_FONT_SIZE * 1.5 : 5, fontSize: LOGIN_INPUT_FONT_SIZE* 1.1,
          paddingRight: rightIcon || iconRight ? LOGIN_INPUT_FONT_SIZE : 0, color: color ? color : colors.grey1
        }, inputStyle]}
        autoFocus={false}
        autoCapitalize="none"
        keyboardAppearance="dark"
        autoCorrect={false}
        blurOnSubmit={false}
        {...otherProps}
      />
      {leftIcon ? leftIcon : <AntDesign style={{ position: 'absolute', left: 0 }} name={icon} type={type}
        color='white' size={LOGIN_INPUT_FONT_SIZE} />}
      {rightIcon ?
        <View style={{ position: 'absolute', right: 0 }}>{rightIcon}</View>
        :
        <AntDesign name={iconRight} style={{ position: 'absolute', right: 0 }}
          color='rgba(0, 0, 0, 0.38)' size={LOGIN_INPUT_FONT_SIZE} />
      }
    </View>
  )
}