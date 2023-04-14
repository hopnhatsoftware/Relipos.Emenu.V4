/**
 * @providesModule Constants
 */
import {Platform, Dimensions} from 'react-native';
import Constants from 'expo-constants';

export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
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

export const H1_FONT_SIZE = Bordy.height > 640?(Bordy.height >= 1024?40:32) : Bordy.height < 450? 17 : 22 ;
export const H2_FONT_SIZE = Bordy.height > 640?(Bordy.height >= 1024?34:24) : Bordy.height < 450? 15 : 18 ;
export const H3_FONT_SIZE = Bordy.height > 640?(Bordy.height >= 1024?28:18) : Bordy.height < 450? 13 : 15 ;
export const H4_FONT_SIZE = Bordy.height > 640?(Bordy.height >= 1024?24:16) : Bordy.height < 450? 10 : 12 ;
export const H5_FONT_SIZE = Bordy.height > 640?(Bordy.height >= 1024?20:14) : Bordy.height < 450? 7 : 10 ;