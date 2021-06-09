import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from '../config/colors';
import { ITEM_FONT_SIZE } from "../config/constants";

export class Button extends React.Component {

    render() {
        const { title, titleStyle, containerStyle, disabled, onPress, icon } = this.props;
        let iconSize = this.props.iconSize;
        iconSize = iconSize ? iconSize : ITEM_FONT_SIZE;

        if (disabled) {
            return (<View style={[{ padding: 10, backgroundColor: colors.white, justifyContent:'center', alignItems:'center', borderRadius: 5, flexDirection: 'row' }, containerStyle]}>
                {icon ?
                    <Entypo name={icon} style={{ fontSize: iconSize, marginRight: iconSize * 0.5 }} color={colors.white} />
                    : null}
                <Text style={[{ color: colors.primary, textAlign: 'center' }, titleStyle]}>
                    {title}
                </Text>
            </View>);
        }
        return (
            <TouchableOpacity onPress={onPress} style={[{ padding: 10, borderRadius: 5, flexDirection: 'row', }, containerStyle]}>
                {icon ?
                    <Entypo name={icon} style={{ fontSize: iconSize, marginRight: iconSize * 0.5 }} color={colors.white} />
                    : null}
                <Text style={[{ color: colors.primary, textAlign: 'center' }, titleStyle]}>
                    {title}
                </Text>
            </TouchableOpacity>)
    }
}