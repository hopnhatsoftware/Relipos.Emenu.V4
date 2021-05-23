
import React, { Component } from 'react';
import {
  Dimensions,
  
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ModalDropdown extends Component {
  constructor(props) {
    super(props);
  }
  render() {
              <ModalDropdown
              ref={ref => {
                this.ColorPicker = ref;
              }}
              renderRow={this._dropdown_renderRow}
              defaultValue={
                (this.state.CurrentItem.ColName == null
                || this.state.CurrentItem.ColNo == null)
                  ? i18n.t("please_select_colors") :this.state.CurrentItem.ColName +
                    " - " +
                    this.state.CurrentItem.ColNo
              }
              renderButtonText={rowData =>
              (this.state.CurrentItem.ColName == null
                || this.state.CurrentItem.ColNo == null)
                  ? i18n.t("please_select_colors") :this.state.CurrentItem.ColName +
                    " - " +
                    this.state.CurrentItem.ColNo
              }
              options={this.state.itemColors}
              onSelect={(index, item) => {
                if (item.ColID == null) {
                  return false;
                }
                this.setItem(item, "Color");
                this.setState({ showDatePicker: true });
              }}
              textStyle={[
                FormStyle.inputContainer,
                FormStyle.inputStyle,
                {
                  marginLeft: 10,
                  paddingLeft: 25,
                  paddingTop: 10,
                  width: (SCREEN_WIDTH / 3) * 1.5 - 20
                }
              ]}
              dropdownStyle={[
                FormStyle.inputStyle,
                {
                  height: 350,
                  margin: 10,
                  borderColor: "rgba(110, 120, 170, 1)",
                  width: (SCREEN_WIDTH / 3) * 1.5 - 20
                }
              ]}
              style={{
                height: 30,
                borderRadius: 20,
                backgroundColor: "white",
                zIndex: 10
              }}
            />
  }
}