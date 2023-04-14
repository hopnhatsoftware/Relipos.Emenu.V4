import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback, Text, Keyboard, KeyboardAvoidingView } from 'react-native';
import { AntDesign, } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { _retrieveData, _storeData } from '../services/storages';
import Question from '../components/Question';
import translate from '../services/translate';
import {Icon, Button} from 'react-native-elements';
import { H3_FONT_SIZE,H1_FONT_SIZE } from '../config/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
export class ScannerQR extends Component {
  props: any;
  Search = null;
  txtQuantity = null;
  txtBarCode = null;
  treeView = null;
  state = {
    hasCameraPermission: null,
    scanned: false,
    Quantity: 1,
    BarCode:'',
    IsHaveCamera: false,
    isViewCamera: false,
  };
  constructor(props) {
    super(props);
    this.translate = new translate();
  }
  
  async componentDidMount() {
    this.translate = await this.translate.loadLang();
    let language = await _retrieveData('culture', 1);
    this.getPermissionsAsync();
    this.setState({ language: language , isViewCamera: true,});
  }
  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
  };
    handleBarCodeScanned = (data) => {
      const { onSelect } = this.props;
       try {
          if(data.data!=null&&data.data!='')
          { this.setState({isViewCamera : false});
          onSelect(data.data);}
      }
      catch (ex) {
        Question.alert('System Error',ex,[
          {
            text: "Ok", onPress: () => {
              this.setState({ IsScaned: false })
              return;
            }
          }
        ],
        );
      } 
       }
  ReturnScreenScanBarcode = async () => {
    const { onSelect } = this.props;
    const { Quantity,BarCode } = this.state;
    if(Quantity>0&&BarCode!=null&&BarCode!='')
     onSelect(BarCode, Quantity);
  }
  render() {
    const { hasCameraPermission, IsScaned, isViewCamera } = this.state;
    if (hasCameraPermission === null) {
              return <Text style={{ paddingTop: Constants.statusBarHeight, textAlign: 'center' }}>Requesting for camera permission</Text>;
            }
            if (hasCameraPermission === false) {
              return <Text style={{ paddingTop: Constants.statusBarHeight, textAlign: 'center' }}>No access to camera</Text>;
            }
    return ( 
      <View style={{backgroundColor: "black",height: Bordy.height, width: Bordy.width, position: 'absolute', bottom: 0, right: 0}}>
        {isViewCamera ?  
        <View style={{flex : 1}}>
          <View style={{position: 'absolute', right: 12, top: 5, backgroundColor: "transpanent", zIndex: 10,flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', }}>
            <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: 5 }}onPress={() => this.props.onCancel()}>
              <AntDesign name='close' size={Bordy.width * 0.08} color='#FFFFFF'></AntDesign>
            </TouchableOpacity>
          </View>
          <View style={{width:"100%",position: 'absolute', bottom:25, backgroundColor: "transpanent", zIndex: 10,justifyContent:'center', alignItems: 'center', }}>
            <Text style={{backgroundColor:'black',textAlign:'center',fontSize: H1_FONT_SIZE,color:'#FFFFFF',paddingHorizontal:10}}>{this.translate.Get("Di chuyển camera đến vùng có mã QR để quét")}</Text>
          </View>
        <BarCodeScanner
          onBarCodeScanned={ IsScaned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {IsScaned && (
          <Button title={'Tap to Scan Again'} onPress={() => this.setState({ IsScaned: false })} />
        )}
        </View>
        :null }
      </View> 
    );
  }
  
     }

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
});