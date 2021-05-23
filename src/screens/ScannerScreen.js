import * as React from 'react';
import {
  Text, View, StyleSheet, Button,
  Alert, Dimensions
} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import t from '../services/translate';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { _retrieveData, _storeData } from '../services/storages';
import Question from '../components/Question';

export default class Scanner extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    data: '',
  };
  constructor(props) {
    super(props);
    this.t = new t();
  }

  async componentDidMount() {
    this.t = await this.t.loadLang();
    let language = await _retrieveData('culture', 1);
    this.getPermissionsAsync();
    this.setState({ language: language });
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  render() {
    const { height, width } = Dimensions.get('window');
    const maskRowHeight = Math.round((height - 300) / 20);
    const maskColWidth = (width - 300) / 2;
    const { hasCameraPermission, scanned } = this.state;

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
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.maskOutter}>
          <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
          <View style={[{ flex: 30 }, styles.maskCenter]}>
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          </View>
          <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
        </View>
        {scanned && (
          <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
        )}
      </View>
    );
  }

  handleBarCodeScanned = (data) => {
    this.setState({ scanned: true, data }, () => {
      try {
        let settings = data.data;
        Question.alert(
          this.t._('Notice'),
          this.t._('Bạn có thật sự muốn sử dụng dữ liệu đã được quét không?'),
          [
            { text: 'Cancel', onPress: () => { this.setState({ scanned: false }) } },
            {
              text: 'OK', onPress: () => {
                _storeData('APP@BACKEND_ENDPOINT', JSON.stringify(settings), () => {
                  this.props.navigation.navigate('Settings');
                });
              }
            },
          ],
          { cancelable: false }
        );
      }
      catch (ex) {
        console.log('error', ex);
        console.log('data', data);
        Question.alert(
          this.t._('Notice'),
          this.t._('QR code không hợp lệ?'));
      }
    });
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