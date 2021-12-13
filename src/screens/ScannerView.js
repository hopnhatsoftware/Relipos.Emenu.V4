import * as React from 'react';
import {
  Text, View, StyleSheet, Button,
  Alert, Dimensions
} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import translate from '../services/translate';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { _retrieveData, _storeData } from '../services/storages';
import Question from '../components/Question';

export default class Scanner extends React.Component {
  state = {
    hasCameraPermission: null,
    IsScaned: false
  };
  constructor(props) {
    super(props);
    this.translate = new translate();
  }

  async componentDidMount() {
    this.translate = await this.translate.loadLang();
    let language = await _retrieveData('culture', 1);
    this.getPermissionsAsync();
    this.setState({ language: language });
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    const { hasCameraPermission, IsScaned } = this.state;
    const { height, width } = Dimensions.get('window');
    const maskRowHeight = Math.round((height ) / 20);
    const maskColWidth = (width ) / 2;

    if (hasCameraPermission === null) {
      return <Text style={{ paddingTop: Constants.statusBarHeight, textAlign: 'center' }}>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text style={{ paddingTop: Constants.statusBarHeight, textAlign: 'center' }}>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={IsScaned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {IsScaned && (
          <Button title={'Tap to Scan Again'} onPress={() => this.setState({ IsScaned: false })} />
        )}
      </View>
    );
  }
  handleBarCodeScanned = (data) => {
    try {
        let endpoint = data.data;
        endpoint = endpoint.replace("/api/", "").replace("/api", "");
        _storeData('APP@BACKEND_ENDPOINT', JSON.stringify(endpoint), () => {
          this.props.navigation.navigate('Settings');
        });
      }
      catch (ex) {
        Question.alert('System Error',ex,[
          {
            text: "Ok", onPress: () => {
              this.setState({ IsScaned: true })
            }
          }
        ],
        );
      }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
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
});