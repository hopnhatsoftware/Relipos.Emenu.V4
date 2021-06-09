import React from "react";
import Constants from 'expo-constants';
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SCREEN_HEIGHT, BUTTON_FONT_SIZE, ITEM_FONT_SIZE, SCREEN_WIDTH } from '../config/constants';
import { ModalManager } from 'react-native-root-modal';

export default class Question extends React.Component {
  static modal = null;
  static alert(title, message, buttons = []) {
    if (Question.modal) {
      Question.modal.destroy();
    }
    Question.modal = new ModalManager(
      <View style={{
        backgroundColor: "rgba(98,98,98,0.6)",
        position: 'absolute',
        flexDirection: 'column',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT + Constants.statusBarHeight + 100,
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
        borderTopColor: '#ECECEC',
        borderTopWidth: 1
      }}>
        <View style={[{ borderColor: '#ECECEC', borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#FFFFFF', width: SCREEN_WIDTH / 2, },
        ]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#008bc5', height: BUTTON_FONT_SIZE * 2, borderTopLeftRadius: 4, borderTopRightRadius: 4, }}>
            <Text style={{ height: 25, fontSize: 18, color: '#FFFFFF', textAlign: 'center' }}>{title}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: '100%', paddingTop: 10, paddingLeft: 5, paddingRight: 5, justifyContent: 'space-between', }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: '#000000', fontSize: BUTTON_FONT_SIZE / 1.4, }}>{message}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '100%', paddingTop: 5, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, justifyContent: 'space-evenly', alignItems: 'center', }}>
            {buttons.length > 0 ?
              buttons.map((ele, index) => {
                return (<View style={{ width: '45%' }}>
                  <TouchableOpacity onPress={() => { ele.onPress.apply(null, []); Question.modal.destroy(); }}>
                    <LinearGradient
                      colors={["#0AA5E8", "#0AA5E8", "#0AA5E8"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={[{
                        borderWidth: 4,
                        borderRadius: 1,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center', borderColor: "#ffffff", paddingHorizontal: 20
                      }]}>
                      <Text style={{ textAlign: 'center', fontSize: ITEM_FONT_SIZE / 1.2, width: '100%', color: 'white', }}>{ele.text}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>);
              })
              :
              <View style={[{ width: '45%' }]}>
                <TouchableOpacity onPress={() => Question.modal.destroy()}>
                  <LinearGradient
                    colors={["#0AA5E8", "#0AA5E8", "#0AA5E8"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[{
                      borderWidth: 4,
                      borderRadius: 1,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center', borderColor: "#ffffff",
                    }]}>
                    <Text style={{ textAlign: 'center', fontSize: ITEM_FONT_SIZE / 1.2, width: '100%', color: 'white', }}>OK</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
      </View>
    );
    return Question.modal;
  }
}