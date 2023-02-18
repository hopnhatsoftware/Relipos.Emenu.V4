/**
 * @providesModule Constants
 */
import {Platform, Dimensions} from 'react-native';
import Constants from 'expo-constants';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;

export const HEADER_MARGIN_TOP = Constants.statusBarHeight ;

export const MARGIN_TOP = Platform.OS =='ios'?  Constants.statusBarHeight    :10 ;

export const TITLE_FONT_SIZE= SCREEN_HEIGHT*0.06>32?32: SCREEN_HEIGHT*0.06;

export const HEADER_HEIGHT = Constants.statusBarHeight + TITLE_FONT_SIZE + 8;
 export const ENDPOINT_URL="http://demo.relipos.com";
//export const ENDPOINT_URL="http://192.168.1.102:8081/api/";
export const IMAGE_MAP_LOCATION ="../../resources/";
export const ICON_SIZE = 10;
export const LOGIN_INPUT_FONT_SIZE = SCREEN_HEIGHT > 640?(SCREEN_HEIGHT >= 1024?32:21) : 11 ;

export const BACKGROUND_COLOR='#29ade3';
export const MAIN_COLOR='#29ade3';
export const SUB_COLOR='#334f80';
export const YELLOW_COLOR='#e3bb29';
export const RED_COLOR='#e32951'; 
export const GREEN_COLOR='#88e834';
export const TABLE_HEADER_COLOR =['#1e93e4','#1676b9','#11598c']; 

export const ITEM_FONT_SIZE= SCREEN_HEIGHT*0.03>24?24: SCREEN_HEIGHT*0.03;
export const BUTTON_FONT_SIZE= SCREEN_HEIGHT*0.04>36?36: SCREEN_HEIGHT*0.04;
export const FontSize={
    H1:SCREEN_HEIGHT*0.06>32?32: SCREEN_HEIGHT*0.06,
    H2:SCREEN_HEIGHT*0.03>24?24: SCREEN_HEIGHT*0.03
};
export const H1FontSize=SCREEN_HEIGHT*0.06>32?32:SCREEN_HEIGHT*0.06;
export const H2FontSize=SCREEN_HEIGHT*0.045>24?24:SCREEN_HEIGHT*0.045;
export const H3FontSize=SCREEN_HEIGHT*0.0351>18.72?18.72:SCREEN_HEIGHT*0.0351;
export const H4FontSize=SCREEN_HEIGHT*0.03>16?16:SCREEN_HEIGHT*0.03; 
export const H5FontSize=SCREEN_HEIGHT*0.02>13.28?13.28:SCREEN_HEIGHT*0.02;

export const H6_FONT_SIZE = SCREEN_HEIGHT > 640?(SCREEN_HEIGHT >= 1024?32:21) : 15 ;
export const H2_FONT_SIZE = SCREEN_HEIGHT > 640?(SCREEN_HEIGHT >= 1024?36:36) : 18 ;
