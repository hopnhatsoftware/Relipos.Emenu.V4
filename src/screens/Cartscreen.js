import React, { Component } from 'react';
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  separators,
  GeneralStatusBarColor ,
  ImageBackground,
  UIManager,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import {_retrieveData, _storeData,_remove} from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import { Input, Button, Icon } from 'react-native-elements';
import {  BUTTON_FONT_SIZE } from '../config/constants';
import t from '../services/translate';
import Question from '../components/Question';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Cartscreen extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    //const data = Array.apply(null, {length: 20}).map(Number.call, Number);

    this.state = {
      isLoading: false,
      selectedType: null,
      fontLoaded: false,
      accessible: !!props.accessible,
      loading: !props.options,
      clicks: 0,
      show: true,
      selectedId:-1,isAdding:false,showMenu:false,
      item: '',
      language: 1,
      dictionary:[],
      data:[],
      areasList:[],
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
      
    };
    this.t=new t();
    this.SearchItem = this.SearchItem.bind(this);
  }
  
  IncrementItem = () => {
    this.setState({ clicks: this.state.clicks + 1 });
  }
  DecreaseItem = () => {
    this.setState({ clicks: this.state.clicks - 1 });
  }
  ToggleClick = () => {
    this.setState({ show: !this.state.show });
  }


  async componentDidMount() {
    await cacheFonts({
      light: require('../../assets/fonts/Ubuntu-Light.ttf'),
      bold: require('../../assets/fonts/Ubuntu-Bold.ttf'),
      lightitalic: require('../../assets/fonts/Ubuntu-Light-Italic.ttf'),
    }); 
    let language = await _retrieveData('culture',1);
    this.setState({ fontLoaded: true, language:language,dictionary:dictionary });
    StatusBar.setHidden(true);
  }
  
  SearchItem = () => this.setState({item : !item})

  _Delete(){
    Question.alert(
      'Thông báo',
      'Bạn có muốn xóa không?',
      [
        {
          text: 'Cancel',onPress: () => {

          }
        },
        {
          text: 'OK', onPress: () => {

          }
        },
      ],
      { cancelable: false }
    )
  }
  _Payment(){

  }

  render() {
    console.log('width', SCREEN_WIDTH);
    const {
      count,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.toolbar}>
          <Text  style={{textAlign:'center',  fontWeight: "bold", fontSize: 30}}>Bàn 1</Text>
        </View>
        <View style={styles.mainContainer}>   
            <View style={{width: '100%'}}>
                  <FlatList
                  data={[{key: 'Món Tôm Yum My'}, {key: 'Cá viên chiên'}, {key: 'Súp Tom Yum My'}, {key: 'Súp Tom'}, {key: 'Bánh bột lọc'}, {key: 'Bánh đa cua'}, {key: 'Bánh bèo'}]}
                  numColumns={2}
                  renderItem={({item}) =>  
                  <TouchableHighlight style={{height: SCREEN_HEIGHT *0.272, borderWidth:2,borderColor:"white",  width: "50%"}}>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width:"100%"}}>
                          <View style={{backgroundColor:"grey",width:"50%"}}>
                            <ImageBackground   resizeMode="cover"  source={require('../../assets/images/monot.png')} style={{backgroundColor:"grey",height: SCREEN_HEIGHT * 0.272, width:"100%"}}>
                              <View style={{position: 'absolute', paddingTop: 90.5,paddingLeft:60, right: -12}}>
                                  <Icon
                                        name='caretleft'
                                        type='antdesign'
                                        iconStyle={{justifyContent:"space-between", color:"#EEEEEE", fontSize: 32}}
                                      />    
                                </View>
                            </ImageBackground>
                          </View>
                          <View style={{flexDirection: 'column', flexWrap: 'wrap', width: "50%", backgroundColor: "#EEEEEE", paddingLeft: 15, paddingBottom: 10}}>
                            <View style={{position: 'absolute', top: 0, right: 0, height: '30%',width:"15%", paddingTop: 5}}>
                              <Icon
                                name='closecircle'
                                type='antdesign'
                                iconStyle={{ height:'80%', width:'80%', color:'red'}}
                                onPress={this._Delete}
                              />
                            </View>
                            <Text style={{color:'#000000' ,height: '30%', width: SCREEN_WIDTH * 0.13, paddingTop: 15, fontWeight:'bold'}}>{item.key}</Text>
                            <Text style={{color:'#FF0000' ,height: '45%', width: SCREEN_WIDTH * 0.2}}>15.000đ</Text> 
                            <View  style={{ flexDirection: 'row', height: '15%'}}>
                              <TouchableHighlight
                                  style={{backgroundColor:'#C0C0C0', justifyContent: 'center', alignItems: 'center', width: '15%', borderRadius: 2}}
                                  onPress={this.DecreaseItem}
                              >
                                <Text testID="subtract" style={{color:'#FFFFFF', width: '100%', textAlign: 'center'}}>-</Text>
                              </TouchableHighlight>
                              <Text style={{color: '#000000' ,width: '20%',paddingTop: 8, textAlign: 'center'}}>
                                { this.state.clicks }
                              </Text>
                              <TouchableHighlight
                                  style={{backgroundColor:'#FF0000', justifyContent: 'center', alignItems: 'center', width: '15%', borderRadius: 2}}
                                  onPress={this.IncrementItem}
                              >
                                <Text style={{color:'#FFFFFF', width: '100%', textAlign: 'center'}}>+</Text>
                              </TouchableHighlight>
                            </View> 
                          </View>
                        </View>
                    </TouchableHighlight>}
                  />
            </View>
        </View>
        <View style={styles.navigationBar} >
          <View style={{paddingLeft: 5, height:SCREEN_HEIGHT * 0.11, color: '#FFFFFF', backgroundColor: '#29ade3', textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH * 0.25 }}>
            <Text style={{height:SCREEN_HEIGHT * 0.04, color: '#FFFFFF', width: SCREEN_WIDTH * 0.25}}>TỔNG TIỀN: <Text style={{color:'#FF0000'}}>105.000đ</Text></Text>
            <Text style={{height:SCREEN_HEIGHT * 0.04, color: '#FFFFFF', width: SCREEN_WIDTH * 0.25}}>TỔNG SỐ LƯỢNG: <Text style={{color:'#FF0000'}}>35</Text></Text>
          </View>
          <Button 
            titleStyle={{paddingBottom: 20}} 
            buttonStyle={{backgroundColor: '#FF0000', height:SCREEN_HEIGHT * 0.11,color: '#FFFFFF', textAlign: 'center', width: SCREEN_WIDTH * 0.25}} title='THANH TOÁN'
            onPress={this._Payment}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
    justifyContent: 'space-around',
    height: "100%",
  },
  navigationBar:{
    height:'8%' ,
    position: 'absolute', 
    flexDirection: 'row',
    bottom: 0,
    right: 0,
  },
  toolbar: {
    backgroundColor:'#FFFFFF',
    alignItems: "center", 
    justifyContent: "center",
    height: "10%", 
  },
  toolbarButton: {
    width: 100,               
    color:'#fff',
    height: 30,
    textAlign:'center',        //Step 2
  },
  toolbarSearch: {
    borderRadius : 5,
    borderColor: "black",
    borderWidth: 1.2,
    backgroundColor:"white",
    textAlign:'center',
    fontWeight:'bold',
    flex: 1,                   //Step 3
  },
  mainContainer: {
    backgroundColor:'#FFFFFF',
    flexDirection:'row',
    height: "90%", 

  },
  header: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 10,
    backgroundColor:'#FF0000',
    height:10,
    color:'#000000',
  },
  buttonText: {
    alignItems: 'center',
    fontSize: BUTTON_FONT_SIZE,
    color:'#000000',
  },
});
