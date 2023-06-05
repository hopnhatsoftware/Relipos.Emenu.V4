import React from "react";
import {ActivityIndicator,FlatList, View, TouchableOpacity, TextInput, StyleSheet, Text,Image,Dimensions,Alert} from "react-native";
import colors from "../config/colors";
import Modal from "react-native-modal";
import { Button, Icon } from "react-native-elements";
import Constants from "expo-constants";
import {ITEM_FONT_SIZE, BUTTON_FONT_SIZE,H1_FONT_SIZE,H3_FONT_SIZE ,H2_FONT_SIZE,H4_FONT_SIZE} from "../config/constants";
import { Audio } from 'expo-av';
import translate from '../services/translate';
import {_retrieveData, _storeData } from "../services/storages";
import {API_Print} from "../services";
import { ScrollView } from "react-native-gesture-handler";
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("window").height; //- Constants.statusBarHeight;
const Bordy={width:SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT,height:SCREEN_HEIGHT < SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_WIDTH};
export class _HeaderNew extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      IsLoaded:false,
      isColor:false,
      Description:'',
      modalLanguage : false,
      ModalCallStaff: false,
      settings: {},
      Config: {},
    }
    this.translate = new translate();
  }
  setModalLanguage = (visible) => {
    this.setState({ modalLanguage: visible });
  }
  componentDidMount= async () => {
    let isColor = await _retrieveData('APP@Interface', JSON.stringify({}));
    isColor = JSON.parse(isColor);
    let settings = await _retrieveData('settings', JSON.stringify({}));
  if (settings!='{}') 
  settings = JSON.parse(settings);
  let Config = await _retrieveData('APP@CONFIG', JSON.stringify({
        'PosId':settings.PosId,
        'I_BusinessType':1
        }));
  Config = JSON.parse(Config);
    this.setState({IsLoaded:true ,isColor,settings,Config});
  };
  _AcceptPayment = async (Description,typeView) => {
    let{ticketId}=this.props;
    let{settings,ModalCallStaff} = this.state;
    API_Print (settings.I_BranchID, ticketId,typeView, Description).then(res => {
      if (res.Status == 1){
        this.setModalCallStaff(!ModalCallStaff)
        this.setState({ isPostBack: true});
        Alert.alert( 'thông báo',"Quý khách vui lòng đợi trong giây lát", [
          {
            text: "OK", onPress: () => {this.setState({ isPostBack: true});
            }
          }
        ]);
      }
    }).catch((error) => {
      Alert.alert( this.translate.Get('Notice'),"Máy in lỗi,KHÔNG THỂ in thông báo tự động đến quầy", [
        {
          text: "OK", onPress: () => {
            this.setState({ isPostBack: true});
          }
        }
      ]);
    }); 
  }
  setModalCallStaff = (visible) => {
    this.setState({ ModalCallStaff: visible });
  }
  render() {
   
    const { state, table, BookingsStyle, _searchProduct, onPressBack, translate, name, titleSet, setState,backgroundColor,changeLanguage,data,listLanguage,listLanguage2,languageText,languageImg} = this.props;
    const{modalLanguage,isColor,ModalCallStaff}=this.state
    if (state.showCall==undefined||state.showCall==null) {
      state.showCall=false;
    }
    if (!this.state.IsLoaded) {
      return (
        <View style={[styles.pnbody, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff"
          />
        </View>
      );
    }
    return (
      <View style={[BookingsStyle.header,{ backgroundColor: backgroundColor, width: '100%', }]}>
        {ModalCallStaff ?
        <ScrollView>
          <Modal
          // onBackdropPress={() => this.setModalCallStaff(!ModalCallStaff)}
          isVisible={true}
          visible={ModalCallStaff}>
          <View style={{top: Bordy.height*0.15, left: Bordy.width*0.275, width: Bordy.width *0.35, height: Bordy.height*0.35,borderRadius:10, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:0.5,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{borderTopLeftRadius:10,borderTopRightRadius:10,height:Bordy.height*0.35*0.2,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold",textAlign:'center'}}>{translate.Get("Gọi nhân viên")}</Text>
            </View>
            <View style={{height:Bordy.height*0.35*0.18,width:'100%', justifyContent:'space-evenly',alignItems:'center',flexDirection:'row'}}>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + translate.Get("Gọi nhân viên") +' '})} style={{width:'45%', height:'75%',borderRadius:10, backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{translate.Get("Gọi nhân viên")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({Description: this.state.Description + translate.Get("Gọi thanh toán") +' '})}style={{width:'45%', height:'75%',borderRadius:10,backgroundColor:'#BBBBBB',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H3_FONT_SIZE, color:'#000000'}}>{translate.Get('Gọi thanh toán')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: Bordy.height*0.35*0.42,justifyContent:'center',alignItems:'center'}}>
              <TextInput
                  placeholder={translate.Get("Nhập yêu cầu...")}
                  placeholderTextColor={isColor == true ? '#808080' : "#777777"}
                  value={this.state.Description}
                  onChangeText={(item) => this.setState({Description : item})}  
                  multiline={true} 
                  numberOfLines={10} 
                  style={[{width:'95%',height:Bordy.height*0.35*0.38,paddingHorizontal:12,borderWidth:0.5,borderRadius:10,fontSize: H3_FONT_SIZE,color:isColor == true ? '#ffffff' : "#000000", backgroundColor: isColor == true ? '#333333':'#FFFFFF',}]}>
              </TextInput>
            </View>
            
            <View style={{height:Bordy.height*0.35*0.195,width:'100%',borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'space-evenly',flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.setModalCallStaff(!ModalCallStaff)} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:'#af3037',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get("Trở lại")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this._AcceptPayment(this.state.Description,2)}} style={{width:'47%', height:'80%',borderRadius:8, backgroundColor:isColor == true ? '#DAA520' :'#009900',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:H2_FONT_SIZE, color:'#FFFFFF'}}>{translate.Get('Xác nhận')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </ScrollView>
          : null}
        {modalLanguage ?
          <Modal
          onBackdropPress={() => this.setModalLanguage(!modalLanguage)}
          isVisible={true}
          visible={modalLanguage}>
          <View style={{top: Bordy.height*0.2, left: Bordy.width*0.28, width: Bordy.width *0.36, height: Bordy.height*0.4, zIndex: 2, position: 'absolute',backgroundColor:isColor==true?'#444444':'white',borderWidth:0.5,borderColor:isColor==true?'#DAA520':'#000000'}}>
            <View style={{height:Bordy.height*0.4*0.15,width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity><Icon name="close" iconStyle={{ color: isColor==true?'#111111':'#257DBC', left:5 }} fontSize={H1_FONT_SIZE} type="antdesign"/></TouchableOpacity>
            <Text style={{fontSize:H2_FONT_SIZE, color:isColor==true?'#DAA520':'white',fontFamily: "RobotoBold"}}>{translate.Get('language')}</Text>
            <TouchableOpacity onPress={() => this.setModalLanguage(!modalLanguage)}>
              <Icon name="close" iconStyle={{ color: isColor==true?'#DAA520':'white',  right:5 }} fontSize={H1_FONT_SIZE} type="antdesign"/>
            </TouchableOpacity>
            </View>
            <View style={{height: Bordy.height*0.4*0.70}}>
            <FlatList
            data={data}
            renderItem={({ item, index }) =>
              <TouchableOpacity onPress={() => { changeLanguage(item.LgId, item) &&  this.setModalLanguage(!modalLanguage )}}
                style={{ width: '100%',justifyContent:'center',borderBottomWidth:0.5,paddingVertical:20}}>
                <View style={{width:'100%',flexDirection: "row",alignItems:'center'}}>
                  <Image resizeMode="contain" source={item.LgClsIco == 'icon-flagvn' ? require('../../assets/icons/icon-flagvn.png'): item.LgClsIco == 'icon-flagus' ? require('../../assets/icons/icon-flagus.png'):item.LgClsIco == 'icon-flagcn' ? require('../../assets/icons/icon-flagcn.png'): null} style={{ width: '20%',height:"100%", }}></Image>
                  <Text style={{width:state.language == item.LgId ? '70%' : "80%",justifyContent:'center',textAlign:'left',fontSize:H3_FONT_SIZE*1.2,color: isColor==true?'#FFFFFF':'#000000'}} >{item.LgName}</Text>
                  {state.language == item.LgId ?
                    <Icon  name="check" type="entypo" style={{left: 2, color:isColor==true?'#DAA520': '#009900',fontSize: H2_FONT_SIZE,}}/>
                    :null
                  }
                </View>
              </TouchableOpacity>}
            />
            </View>
            <View style={{height:Bordy.height*0.4*0.14, justifyContent:'center',width:'100%',backgroundColor:isColor==true?'#111111':'#257DBC',}}> 
              <Text style={{color: isColor==true?'#FFFFFF':'#000000',fontSize: H2_FONT_SIZE,textAlign:'center',fontFamily: "RobotoBold"}}>{this.translate.Get("Power by Relisoft")}</Text>
            </View>
          </View>
        </Modal>
          : null}
        <View style={{ paddingTop: 1, width: "20%", flexDirection: 'row', justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => { onPressBack.apply(null, []); }}
            style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
            <Image   resizeMode="contain"  source={require('../../assets/icons/IconBack.png')}
              style={[  BookingsStyle.header_logo, { maxWidth: '42%',  height: Bordy.height * 0.085,  justifyContent: "center", alignItems: "center"  }
              ]}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', width: '60%', justifyContent: "center", alignItems: 'center', }}>
            <View style={{ flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontFamily: "RobotoBold", fontSize: ITEM_FONT_SIZE }]}> {table.TbNo} </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column', width: '60%', justifyContent: "center", alignItems: 'center', }}>
            <TouchableOpacity style={{ width: '100%', justifyContent: "center", alignItems: 'center', }}
               onPress={() => this.setModalCallStaff(!ModalCallStaff)} >
             {(state.showCall==false)?
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ require('../../assets/icons/IconCall.png') }
                style={[ BookingsStyle.header_logo,
                  {
                    maxWidth: '20%',
                    height: Bordy.height * 0.025,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
              <Text style={[{ color: "#FFFFFF", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Gọi nhân viên")} </Text>
            </View>
             :
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: "center", alignItems: 'center', }}>
              <Image  resizeMode="contain" source={ require('../../assets/icons/iconCall_While.png') }
                style={[ BookingsStyle.header_logo,
                  {
                    maxWidth: '20%',
                    height: Bordy.height * 0.025,
                    justifyContent: "center",
                    alignItems: "center"
                  }
                ]}
              />
             <Text style={[{ color: "#FF7E27", textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.6 }]}> {translate.Get("Đang gọi ..")} </Text>
            </View>
            }
             </TouchableOpacity>
            </View>
            </View>
        <View style={{ width: "68%", flexDirection: "row", justifyContent: "center", alignItems: 'center', }}>
          <View style={[BookingsStyle.header_search, { flexDirection: "row" }]}>
            {name == 'OrderView' ?
              <TextInput
                style={[BookingsStyle.item_search, styles.item_Search]}
                keyboardAppearance="light"
                placeholder={translate.Get("Nhập tên món...")}
                fontStyle="italic"
                autoFocus={false}
                value={state.keysearch}
                onChangeText={keysearch => setState({ keysearch })}
                onSubmitEditing={() => { _searchProduct(); }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              :
              <View style={{ flexDirection: 'column', width: '75%', justifyContent: "center", alignItems: 'center', }}>
                <View style={{ flexDirection: 'column', width: '100%', justifyContent: "center", alignItems: 'center', }}>
                  <Text style={{ color: "#FFFFFF", textAlign: 'center', fontFamily: 'RobotoBold', fontSize: ITEM_FONT_SIZE }}>{titleSet.PrdName ? titleSet.PrdName : ""}</Text>
                </View>
              </View>
            }
            {name == 'OrderView' ?
              <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => { _searchProduct(); }}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_Find.png')}
                  style={{ width: ITEM_FONT_SIZE * 1.4, height: ITEM_FONT_SIZE * 1.4, }} />
              </TouchableOpacity>
              : <View style={{ width: ITEM_FONT_SIZE * 2, }}>
              </View>}
            {!state.lockTable ?
              <TouchableOpacity style={{ paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => {
                  setState({ lockTable: true })
                }}>
                <Icon name="unlock" iconStyle={{ color: colors.white, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </TouchableOpacity>
              : <View style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}>
                <Icon name="lock" iconStyle={{ color: colors.red, paddingLeft: ITEM_FONT_SIZE * 1, }} fontSize={ITEM_FONT_SIZE * 1.4} type="antdesign"></Icon>
              </View>}
              {state.language == 1 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => this.setModalLanguage(!modalLanguage )} >
                  <Image resizeMode="stretch" source={require('../../assets/icons/icon-flagvn.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                state.language == 2 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => this.setModalLanguage(!modalLanguage )} >
                  <Image resizeMode="stretch" source={require('../../assets/icons/icon-flagus.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :
                state.language == 5 ?
                <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 5, paddingTop: 2, justifyContent: 'center', alignItems: 'center', }}
                onPress={() => this.setModalLanguage(!modalLanguage )} >
                  <Image resizeMode="stretch" source={require('../../assets/icons/icon-flagcn.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.4, }} />
                </TouchableOpacity>
                :null
            }
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  item_Search: {
    width: "70%",
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50
  },
  item_language: {
    flexDirection: "row"
  },
});