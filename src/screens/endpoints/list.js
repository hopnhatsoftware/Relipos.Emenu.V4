import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,Alert,
} from 'react-native';
import * as Font from 'expo-font';
import { Util } from 'expo';
import { ListItem } from 'react-native-elements'

import Icon from '@expo/vector-icons/Entypo'
import {_retrieveData, _storeData} from '../../services/storages';
import { MARGIN_TOP, ENDPOINT_URL } from '../../config/constants';
import {MyHeader} from '../../components/header';
import EndpointEditor from './editor';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import t from '../../services/translate';
import styles from '../../styles/general';
import ListStyles from '../../styles/list';
import Question from '../../components/Question';


export default class EndpointsList extends Component {
  constructor(props) {
    super(props);
    this.state ={data:[],selectedId:-1,isAdding:false,showMenu:false,selectedName:''};
    this.t = new t();
  }
  async componentDidMount() {
    this.t = await this.t.loadLang();
    await Font.loadAsync({
      'georgia': require('../../../assets/fonts/Georgia.ttf'),
      'regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
      'bold': require('../../../assets/fonts/Ubuntu-Bold.ttf'),
      'light': require('../../../assets/fonts/Montserrat-Light.ttf'),
    });
    this.getEndpointList();
    let language = await _retrieveData('culture',1);
    this.setState({ fontLoaded: true, language:language });
  }
  deleteEndpoint = ()=>{
    let data = this.state.data;
    if(this.state.id ==0){
      alert(this.t._('endpoints.cannot_delete_default'));
    }
    else if(this.state.selectedId > -1 && this.state.selectedId in data){
      Question.alert(
        this.t._('alert'),
        this.t._('alert.delete'),
        [
          {
            text: 'Cancel', onPress: () => { }
          },
          {
            text: 'OK', onPress: () => {
              data.splice(this.state.selectedId, 1);
              _storeData('EndpointsList',JSON.stringify(data),()=>{this.setState({data:data,selectedId:-1,showMenu:false,isAdding:false})});
            }
          },
        ],
        { cancelable: false }
      )
    }
    else{
      this.setState({data:data,selectedId:-1,showMenu:false,isAdding:false});
    }
  }
  getEndpointList = async()=>{
    let res =  await _retrieveData('EndpointsList');
    if(res){
      res = JSON.parse(res);
    }
    else{
      res = [{id:0, name:this.t._('default'), endpoint: ENDPOINT_URL}];
    }
    this.setState({data: res});
  }
  selectEndpoint = () =>{
    if(this.state.selectedId>-1 && this.state.data.length>0 && this.state.selectedId in this.state.data){
      let endpoint =this.state.data[this.state.selectedId];
      endpoint.id = this.state.selectedId;
      this.props.onSelected.apply(null,[endpoint]);
    }
    else{
      alert(this.t._('endpoint.please_select'));
    }
  }
  renderMenu(){
    if(this.state.showMenu)
    {    
      return(
      <TouchableOpacity style={{top:MARGIN_TOP+30,position:"absolute",height:"100%",width:"100%",zIndex:100}} onPress={()=>this.setState({showMenu:!this.state.showMenu})}>
          <View style={{backgroundColor:"grey", opacity:0.1,position:"absolute",top:0,left:0,height:"100%",width:"100%",zIndex:100}}>
            </View>
            {this.state.selectedId > -1 ?
            <View style={{ right:0,width:"80%",position:"absolute",zIndex:1000}}>
                {this.state.selectedId>0?
                <ListItem 
                    leftIcon={{name:"create"}}
                    chevron={true}
                    bottomDivider={true}
                    containerStyle={ListStyles.item}
                    titleStyle={ListStyles.item}
                    subtitleStyle={ListStyles.item}
                    title={this.t._('edit')}
                    onPress={()=>{ this.setState({isAdding:true})}}
                  />:<View/>}
                  {this.state.selectedId>0?
                  <ListItem 
                      leftIcon={{name:"delete"}}
                      chevron={true}
                      bottomDivider={true}
                      containerStyle={ListStyles.item}
                      titleStyle={ListStyles.item}
                      subtitleStyle={ListStyles.item}
                      title={this.t._('delete')}
                      onPress={()=>{this.deleteEndpoint()}}
                      />:<View/>}
                    <ListItem
                        leftIcon={{name:"done"}}
                        chevron={true}
                        bottomDivider={true}
                        containerStyle={ListStyles.item}
                        titleStyle={ListStyles.item}
                        subtitleStyle={ListStyles.item}
                        title={this.t._('select')}
                        onPress={()=>{this.selectEndpoint()}}
                      />
            </View>:
            <View style={{ right:0,width:"80%",position:"absolute",zIndex:100}}>
              <ListItem 
                  leftIcon={{name:"add"}}
                  chevron={true}
                  bottomDivider={true}
                  containerStyle={ListStyles.item}
                  titleStyle={ListStyles.item}
                  subtitleStyle={ListStyles.item}
                  title={this.t._('add')}
                  onPress={()=>{ this.setState({isAdding:true})}}
                />
            </View>
            }
        </TouchableOpacity>
        );
    }
    return (<View></View>);
  } 
  render() {
    const {isAdding,data} = this.state;
    if(isAdding){
      return (<EndpointEditor selectedId={this.state.selectedId} onBack={(data)=>{
        this.setState({isAdding:false,showMenu:false, selectedId:-1,data:data});}}/>);
    }
    return (
      <View style={{flex:1}}>
      {this.renderMenu()}
        <View style={[styles.container]}>
          <MyHeader leftComponent={
            this.state.selectedId> -1?<MaterialCommunityIcons color="white" size={20} name="check" onPress={this.selectEndpoint}></MaterialCommunityIcons>:
            <MaterialCommunityIcons color="white" size={20} name="arrow-left-bold" onPress={this.props.onCancel}></MaterialCommunityIcons>
          } rightComponent={
            <MaterialCommunityIcons name="menu" color="white" size={20} onPress={()=>this.setState({showMenu:!this.state.showMenu})}></MaterialCommunityIcons>
          }
          title={ this.state.selectedId ==-1?this.t._('endpoint.list'): this.t._('selected',[this.state.selectedName])}
          />
          <FlatList data={data}
          renderItem={({ item, index }) => (
            <ListItem key={index}
              chevron={true}
              bottomDivider={true}
              containerStyle={index==this.state.selectedId?ListStyles.selectedItem: ListStyles.item}
              titleStyle={index==this.state.selectedId?ListStyles.selectedTitle: ListStyles.title}
              subtitleStyle={index==this.state.selectedId?ListStyles.selectedSubtitle: ListStyles.subtitle}
              title={item.name?item.name:'null'}
              subtitle={item.endpoint?item.endpoint:'null'}
              onPress={()=>{this.setState({selectedId:index==this.state.selectedId?-1:index, selectedName:item.name})}}
            />
          )} >
          </FlatList>
        </View>
      </View>);
  }
}


export const FormInput = props => {
  const { icon, type, refInput, ...otherProps } = props
  return (
    <Input
      {...otherProps}
      ref={refInput}
      leftIcon={<Icon name={icon} type={type} 
      color='rgba(0, 0, 0, 0.38)' size={25} />}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      autoCorrect={false}
      blurOnSubmit={false}
    />
  )
}