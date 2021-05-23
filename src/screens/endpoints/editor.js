
import React, { Component } from 'react';
import {
  View,
  Alert,
  LayoutAnimation,
  KeyboardAvoidingView,
  
} from 'react-native';
import * as Font from 'expo-font';
import { Button } from 'react-native-elements'


import {_retrieveData, _storeData} from '../../services/storages';
import {  ENDPOINT_URL } from '../../config/constants';
import {MyHeader} from '../../components/header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import t from '../../services/translate';
import styles from '../../styles/general';
import FormStyles from '../../styles/form';
import {FormInput} from '../../components/formControls';
import {validUrl} from '../../services/util';
import Question from '../../components/Question';

export default class EndpointEditor extends Component {
  constructor(props) {
    super(props);
    this.state ={
      data:[]
      ,id:props.selectedId > -1? props.selectedId: -1
      ,name:''
      ,endpoint:"http://"
      ,isNameValid:true
      ,isEndpointValid:true
      ,isLoading:false
    };
    this.t=new t();
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
  }
  getEndpointList = async()=>{
    let res =  await _retrieveData('EndpointsList');
    let language = await _retrieveData('culture',1);
    if(!res || res.length==0){
      res = [{id:0, name:this.t._('default'), endpoint: ENDPOINT_URL}];
    }
    else{
      res = JSON.parse(res);
    }
    let id= this.state.id;
    if(id > -1 && id in res){
      this.setState({fontLoaded: true, language:language,data:res,name: res[id].name,endpoint: res[id].endpoint});
    }
    else{
      this.setState({fontLoaded: true, language:language,data: res});
    }
  }
  updateEndpoint = ()=>{
    if(this.validateEndpoint() && this.validateName()){
      const {name,endpoint,id} = this.state;
      let data = this.state.data;
      if(id == -1){
        data.push({id:data.length,name:name,endpoint:endpoint});
      }
      else{
        data[id].name = name;
        data[id].endpoint = endpoint;
      }
      _storeData('EndpointsList',JSON.stringify(data),()=>{this.props.onBack.apply(null,[data])});
    }
  }
  delete = ()=>{
    let data = this.state.data;
    if(this.state.id ==0){
      alert(this.t._('endpoints.cannot_delete_default'));
    }
    else if(this.state.id > -1 && this.state.id in data){
      Question.alert(
        this.t._('alert'),
        this.t._('alert.delete'),
        [
          {
            text: 'Cancel', onPress: () => { }
          },
          {
            text: 'OK', onPress: () => {
              data.splice(this.state.id, 1);
              _storeData('EndpointsList',JSON.stringify(data),()=>{this.props.onBack.apply(null,[data])});
            }
          },
        ],
        { cancelable: false }
      )
    }
    else{
      this.props.onBack.apply(null,[data]);
    }
  }
  validateName() {
    const { name } = this.state;
    const isNameValid = name.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ isNameValid });
    isNameValid || this.nameInput.shake();
    return isNameValid;
  }
  validateEndpoint() {
    const { endpoint } = this.state
    const isEndpointValid = endpoint.length > 0 && validUrl(endpoint);
    LayoutAnimation.easeInEaseOut();
    this.setState({ isEndpointValid });
    isEndpointValid || this.endpointInput.shake();
    return isEndpointValid;
  }
  render(){
    const{name, endpoint,isLoading,isNameValid,isEndpointValid} = this.state;
    return (
      <View style={[styles.container,{alignItems:"center"}]}>
        <MyHeader leftComponent={
          <MaterialCommunityIcons color="white" size={20} name="arrow-left-bold" onPress={()=>this.props.onBack.apply(null,[this.state.data])}></MaterialCommunityIcons>
        }
         title={this.t._('endpoint.add')}/>
        <KeyboardAvoidingView behavior='position'>
          <View style={FormStyles.formContainer}>
          <FormInput
            refInput={input => (this.nameInput = input)}
            icon="info" 
            value={name}
            onChangeText={name => this.setState({ name })}
            inputStyle={FormStyles.inputText}
            placeholder={this.t._('name')}
            returnKeyType="next"
            errorMessage={isNameValid ? null : this.t._('login.fail.missing_name')}
            onSubmitEditing={() => {
              this.validateName()
              this.endpointInput.focus()
            }}
          />
          <FormInput
            refInput={input => (this.endpointInput = input)}
            icon="link" 
            value={endpoint}
            placeholder={this.t._('endpoint')}
            returnKeyType="next"
            keyboardType="url"
            inputStyle={FormStyles.inputText}
            onChangeText={endpoint => this.setState({ endpoint })}
            errorMessage={isEndpointValid ? null : this.t._('login.fail.wrong_endpoint')}
            onSubmitEditing={this.updateEndpoint}
          />
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <Button
                icon={{name:"input", color:"white"}}
                title={this.t._('save')}
                onPress = {this.updateEndpoint}
                buttonStyle={FormStyles.button} 
                containerStyle={FormStyles.buttonContainer}
                titleStyle={FormStyles.buttonText}
                loading={isLoading}
                disabled={isLoading}
              />
              <Button
                icon={{name:"close", color:"white"}}
                title={this.state.id >=0? this.t._('delete') : this.t._('cancel')}
                onPress={this.delete}
                buttonStyle={FormStyles.button}
                containerStyle={FormStyles.buttonContainer}
                titleStyle={FormStyles.buttonText}
                loading={isLoading}
                disabled={isLoading}
              />
          </View>
          </View>
        </KeyboardAvoidingView>
      </View>);
  }
  
}

