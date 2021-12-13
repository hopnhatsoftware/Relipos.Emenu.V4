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
  UIManager,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList
} from 'react-native';
import {_retrieveData, _storeData,_remove,_clearData} from '../services/storages';
import { cacheFonts } from "../helpers/AssetsCaching";
import {SetMenu_getExtraRequestFromProductId} from '../services';
import translate from '../services/translate';
import {Icon, Button} from 'react-native-elements';
import {getTableColor} from '../services/util';
import { setCustomText } from 'react-native-global-props'
import colors from '../config/colors';

import { formatCurrency } from "../services/util";
import AreasStyle from "../styles/areas";
import { TITLE_FONT_SIZE ,BUTTON_FONT_SIZE,ITEM_FONT_SIZE} from '../config/constants';
import Constants from 'expo-constants';
import Question from '../components/Question';
import { ScrollView } from 'react-native-gesture-handler';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class RequestView extends Component {
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
      ReturnScreen:'',
      accessible: !!props.accessible,
      loading: !props.options,
      data:[],
      selectedIndex:-1,
      //dataSource: ds.cloneWithRows(data),
      AreasList:[],
      Products1:[],
      Products2:[],
      settings:{},
      PrdId:0,
      Product:{
        PrdId:0,
        itemDescription:[],
        Product:{},
        SelectedItem: 0,
        MrqDescription : '',
      },
      state:{},
      user:{},
      tableStatus:2,
      RowIndex:-1
    };
    this.translate=new translate();
  }
  
  async componentDidMount() {
    this.translate = await this.translate.loadLang();
    await cacheFonts({
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
    }); 
    let settings = await _retrieveData('settings');
    if(settings == undefined)
    {
      settings = {};
    }
    else{
      settings = JSON.parse(settings);
    }
    let user = await _retrieveData('APP@USER', JSON.stringify({}));
    user = JSON.parse(user);
    this.setState({settings, user, fontLoaded:true, isLoading:false,});
    StatusBar.setHidden(true);
 
    this.defaultFonts();
    this._loadExtraRequest();
  }
  _loadExtraRequest = () =>{
    let {Product } = this.state;
    SetMenu_getExtraRequestFromProductId(Product.PrdId).then((res) => {
      if ("Table" in res.Data) {
        let Products1 = res.Data.Table;
        this.setState({ Products1 });
      }
      if ("Table1" in res.Data) {
        let Products2 = res.Data.Table1;
        this.setState({ Products2 });
      }
    }).catch((error)=>{
      Question.alert(
        this.translate.Get('Notice'),
        this.translate.Get("ServerError"+':'+error),[
          {text:"OK", onPress: () =>{
            this.setState({isLoading: false, fontLoaded:true, });
          }}
        ],
        { cancelable: false }
      )
      this.setState({isLoading: false });
    });
  }
  defaultFonts(){
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }
  static getDerivedStateFromProps =  (props, state) =>{
    if (props.navigation.getParam('ReturnScreen', state.ReturnScreen) != state.ReturnScreen||
    props.navigation.getParam('Product', state.Product) != state.Product||
    props.navigation.getParam('Product', state.RowIndex) != state.RowIndex) {
      return {
        ReturnScreen: props.navigation.getParam('ReturnScreen', state.ReturnScreen),
        Product: props.navigation.getParam("Product", state.Product),
        Product: props.navigation.getParam("RowIndex", state.RowIndex)
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
 
  IncrementDescription = (item,index) => {
    if (index < 0) return;
    let { Product } = this.state;
    let existed = false;
    if(!('itemDescription' in Product))
    {
      Product.itemDescription =[];
    }
    Product.itemDescription.forEach(prd => {
      if (prd.MrqId == item.MrqId) {
        existed = true;
        if (prd.SelectedItem > 0) {
          prd.SelectedItem++;
        } else {
          Product.itemDescription.splice(index, 1);
        }
        return existed;
      }
    });
    if (!existed) {
      item.SelectedItem = 1;
      if(!('TksdNote' in Product) || Product.TksdNote == undefined){
        Product.TksdNote =item.MrqDescription + ' ';
      }
      else{
        Product.TksdNote +=item.MrqDescription + ' ';
      }
      Product.itemDescription.push({
        MrqId : item.MrqId,
        MrqDescription: item.MrqDescription,
        SelectedItem : item.SelectedItem,
      });
    }
    Product.SelectedItem++;
    this.setState({ Product });
  };
  RequestAdd = async() =>{
    const { Product, ReturnScreen } = this.state;
    this.props.navigation.state.params.UpdateDescription(Product);
    this.props.navigation.navigate(ReturnScreen);
  }
  deleteRequest = async() =>{
    let { Product } = this.state;
    Product.itemDescription.pop();
    this.setState({ Product });
  }
  onPressBack = ()=>{
    const { ReturnScreen } = this.state;
      this.props.navigation.navigate(ReturnScreen);
  }
  
  render() {
    const {
      Products1,
      Products2,
      Product,
    } = this.state;
    if ( !this.state.fontLoaded) {
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator
            size="large" color="#0000ff"

            onLayout={() => {
              this.setState({fontLoaded: false});
            }}
          /> 
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={{flex: 1, height:'100%'}}>
          <View style={[styles.toolbar,{height:'10%'}]}>
            <TouchableOpacity onPress={()=>this.onPressBack()} >
              <Icon name="arrowleft" iconStyle={{color:colors.white,paddingLeft: ITEM_FONT_SIZE * 1,}}  fontSize={TITLE_FONT_SIZE} type="antdesign"></Icon>        
            </TouchableOpacity> 
            <View style={{ color: colors.white, flex:1, justifyContent:"center", alignItems:"center", flexDirection:'row'}}>
              <View style={{width:'8%', height:3, backgroundColor: colors.white}}></View>
                <Text style={{fontSize:BUTTON_FONT_SIZE*1.5, fontFamily: 'RobotoBold',color: colors.white,textAlign:'center' , paddingHorizontal: 4 }}>
                  {this.translate.Get('YÊU CẦU THÊM')}
                </Text>
              <View style={{width:'8%', height:3, backgroundColor: colors.white}}></View>
            </View>
          </View>
          <View style={{backgroundColor:colors.white, height:'90%'}}>
            <View style={[styles.header,{flexDirection:'row', backgroundColor:colors.grey5, height:  '10%',}]}>
              <View style={{backgroundColor:colors.grey5, justifyContent:'flex-start', paddingTop: ITEM_FONT_SIZE/2,}}>
                {/* <FlatList
                  horizontal={true}
                  data={Product.itemDescription}
                  style={{width:SCREEN_WIDTH, height:  ITEM_FONT_SIZE*2}}
                  renderItem={({item, index}) =>
                  <Text style={{height:  ITEM_FONT_SIZE*2, fontSize: 17, paddingLeft:10, color:colors.primary, }}>{item.MrqDescription}</Text>}
                /> */}
              </View>
              <View style={{position:'absolute',right:ITEM_FONT_SIZE*3, borderRadius:ITEM_FONT_SIZE, paddingTop: ITEM_FONT_SIZE/2,}}> 
                <TouchableOpacity style={{width: ITEM_FONT_SIZE*1.5, height: ITEM_FONT_SIZE*2,}} 
                  onPress={this.deleteRequest} >
                  <Icon
                    name="close"
                    type="antdesign"
                    containerStyle={{
                      borderRadius:ITEM_FONT_SIZE,
                      width: ITEM_FONT_SIZE*2.4, 
                      height: ITEM_FONT_SIZE*1.5,
                    }}
                    iconStyle={{ 
                      color: 'red',
                      fontWeight:'bold',
                      fontSize: ITEM_FONT_SIZE*2,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:'80%'}}>
              <ScrollView  style={{flexDirection:'row', width:SCREEN_WIDTH, height:'100%'}}>
                  <View  style={{flexDirection:'row', width:SCREEN_WIDTH, height:'100%'}}>
                    <FlatList
                      numColumns={3}
                      data={Products1}
                      extraData={this.state.selectedIndex}
                      style={styles.footer1}
                      renderItem={({item, index}) =>
                      <TouchableOpacity
                      onPress={() => this.IncrementDescription(item, index)}
                      style={{width: SCREEN_WIDTH * 0.1655 ,  backgroundColor: index == this.state.selectedIndex?'#ea6721':item.StlBgColor.trim(), justifyContent:"center",alignItems:'center',  borderRadius: 2, borderWidth:0.5, borderColor: 'white',}}>
                        <View style={{ justifyContent:"center",alignItems:'center', height: SCREEN_HEIGHT * 0.18, borderRadius: 2,  borderColor: 'white',}}>
                          <Text style={{ color: item.StlFontColor ? item.StlFontColor.trim(): '#000000', width: '100%',  textAlign: "center", fontSize: item.StlFontSize ? item.StlFontSize: TITLE_FONT_SIZE/1.8, }}>{item.MrqDescription}</Text>
                        </View>
                      </TouchableOpacity>}
                    />
                    <FlatList
                      numColumns={3}
                      data={Products2}
                      extraData={this.state.selectedIndex}
                      style={styles.footer2}
                      renderItem={({item, index}) =>
                      <TouchableOpacity
                      onPress={() => this.IncrementDescription(item, index)}
                      style={{width: SCREEN_WIDTH * 0.1655, backgroundColor: index == this.state.selectedIndex?'#ea6721':item.StlBgColor.trim(), justifyContent:"center",alignItems:'center', borderRadius: 2, borderWidth:0.5, borderColor: 'white',}}>
                        <View style={{ justifyContent:"center",alignItems:'center', height: SCREEN_HEIGHT * 0.18, borderRadius: 2,  borderColor: 'white',}}>
                          <Text style={{ color: item.StlFontColor ? item.StlFontColor.trim(): '#000000', width: '100%',  textAlign: "center", fontSize: item.StlFontSize ? item.StlFontSize: TITLE_FONT_SIZE/1.8, }}>{item.MrqDescription}</Text>
                        </View>
                      </TouchableOpacity>}
                    />
                  </View>
                </ScrollView>
            </View>
            <View style={{position:'absolute', bottom:0, justifyContent:'center', alignItems:'center', paddingBottom:10}}>
              <View style={{justifyContent:'center', width:SCREEN_WIDTH, alignItems:'center',}}>
                <TouchableOpacity 
                  style={{
                    justifyContent:'center', 
                    alignItems:'center', 
                    width:SCREEN_WIDTH/6, 
                    borderRadius: 8, 
                    borderWidth:1, 
                    padding:5,
                    borderColor:'#005291', 
                    backgroundColor: '#0176cd',
                  }}  
                  onPress={this.RequestAdd}>
                  <Text style={{ textAlign:"center", color:colors.white, fontSize: TITLE_FONT_SIZE}}>{ this.translate.Get('Accept')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: SCREEN_WIDTH,
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  toolbar: {
    backgroundColor:colors.primary,
    paddingVertical: 10,
    flexDirection:'row',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:colors.primary,
           //Step 1
  },
  toolbarButton: {
    color:colors.primary,
    fontSize:TITLE_FONT_SIZE,
    textAlign:'center'        //Step 2
  },
  toolbarTitle: {
    color:colors.primary,
    fontSize: TITLE_FONT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center', 
    fontWeight:'bold',
    flex: 1,                   //Step 3
  },
  header: {
    paddingLeft: ITEM_FONT_SIZE * 0.2,
    paddingTop: ITEM_FONT_SIZE * 0.2,
  },
  footer1: {
    width: SCREEN_WIDTH/2,
    paddingLeft: ITEM_FONT_SIZE * 0.2,
  },
  footer2: {
    width: SCREEN_WIDTH/2,
    paddingLeft: ITEM_FONT_SIZE * 0.2,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemable: {
      backgroundColor: '#FFFFFF',
      margin: 3,
      height:100,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
  },
});
