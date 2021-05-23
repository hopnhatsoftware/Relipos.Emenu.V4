import React, { Component } from "react";
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  separators,
  RideItem,
  RideItemDetail,
  GeneralStatusBarColor,
  UIManager,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  EndpointEditor,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Text,
  View,
  TextInput
} from "react-native";
import * as Font from "expo-font";
import Constants from 'expo-constants';
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { cacheFonts } from "../helpers/AssetsCaching";
import { FlatList } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { setCustomText } from 'react-native-global-props';
import { ProductSetDetails, _BellOptions, _Header, _PrdSetGroup } from '../components';
import {
  ENDPOINT_URL,
  BUTTON_FONT_SIZE,
  ITEM_FONT_SIZE,
  TABLE_HEADER_COLOR
} from "../config/constants";
import t from "../services/translate";
import {
  sendOrder,
  getOrderId,
  SetMenu_getChoiceCategory,
  getAllItembyChoiceId,
  SetMenu_gettemDefault,
} from "../services";
import { formatCurrency, getTableColor } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from '../components/Question';
import { ScrollView } from "react-native-gesture-handler";
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height - Constants.statusBarHeight;

export default class BookingSetscreen extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      isLoading: false,
      selectedType: null,
      fontLoaded: false,
      accessible: !!props.accessible,
      loading: !props.options,
      clicks: 0,
      show: true,
      selectedId: -1,
      language: 1,
      data: [],
      PrdGroups: [],
      PrdChildGroups: [],
      SelectedGroupIndex: -1,
      SelectedChildGroupIndex: -1,
      SelectedProductIndex: -1,
      Products: [],
      Histories: [],
      isWorking: false,
      Ticket: {},
      table: {},
      settings: {},
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
      keysearch: "",
      ShowFullCurrentItem: true,
      ShowCurrentItemDetail: false,
      FullCurrentItemWidth: new Animated.Value(0),
      CurrentItemWidth: new Animated.Value(SCREEN_WIDTH * 0.82),
      tableStatus: -1,
      isBooking: true,
      showFilterBell: false,
      IsSetProduct: {
        Product: {},
        itemDescription: [],
        SelectedItem: 0,
        MrqDescription: '',
      },
      Product: {},
      OrderDescription: '',
      CurrentItem: {
        data: {
          PrdId: 0,
          PrdNo: '',
          PrdName: '',
          UomId: 0,
          OrddQuantity: 0,
          OrddVatPercent: 0,
          ObjRelate: 0,
          ObjRelateName: '',
          OrddIsPromotion: 0,
          OrddDescription: '',
          RtkdParentId: 0,
          ObjManager: 0,
          ObjManagerName: '',
          IcsId: 0,
          Qty: 1,
          Description: '',
          OrddType: 0,
          OrddPosition: 0,
          PrdSize: null,
        },
        Qty: 0,
        Amount: 0,
        items: [],
        quantity: 0,
        finalAmount: null,
      },
      Cart: {
        items: [],
        Qty: 0,
        Amount: 0,
        itemIsSet: [],
        isSetQty: 0,
        isSetAmount: 0
      },
      selectedItemIndex: 0,
      index: 0,
      endpoint: '',
      lockTable: false,
      lastBookingTime: null,
      SelectedProduct: null,
      BookingSelectedGroupIndex: -1,
      BookingSelectedChildGroupIndex: -1,
    };
    this.t = new t();
  }

  static getDerivedStateFromProps = (props, state) => {
    if (
      props.navigation.getParam("settings", state.settings) != state.settings ||
      props.navigation.getParam("lockTable", state.lockTable) != state.lockTable ||
      props.navigation.getParam("item", state.item) != state.item ||
      props.navigation.getParam("index", state.index) != state.index
    ) {
      let CurrentItem = state.CurrentItem;
      let item = props.navigation.getParam("item", state.item);
      _storeData('SETSCREEN@STATE', '', () => {
        CurrentItem.data = {
          PrdId: item.PrdId,
          PrdNo: item.PrdNo,
          PrdName: item.PrdName,
          UomId: item.UnitId,
          PrdIsSetMenu: item.PrdIsSetMenu,
          OrddQuantity: 0,
          OrddVatPercent: null,
          ObjRelate: null,
          ObjRelateName: null,
          OrddIsPromotion: null,
          OrddDescription: null,
          RtkdParentId: null,
          ObjManager: null,
          ObjManagerName: null,
          IcsId: null,
          OrddType: 0,
          OrddPosition: 0,
          Qty: 1,
          Description: '',
          TksdPrice: ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice,
          TkdBasePrice: ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice,
          PrdSize: item.PrdSize,
        };
        if (CurrentItem.finalAmount == null) {
          CurrentItem.finalAmount = ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice;
        }
        return {
          CurrentItem,
          settings: props.navigation.getParam("settings", state.settings),
          lockTable: props.navigation.getParam("lockTable", state.lockTable),
          index: props.navigation.getParam("index", state.index),
        };
      });
    }
    // Return null if the state hasn't changed
    return null;
  };


  onPressBack = () => {
    let { lockTable } = this.state;
    this.props.navigation.navigate('Booking', { lockTable });
  }

  componentDidMount = async () => {
    this.t = await this.t.loadLang();
    StatusBar.setHidden(true);
    that = this;
    let state = await _retrieveData('SETSCREEN@STATE', '');
    if (state != '') {
      _storeData("SETSCREEN@STATE", '', () => {
        state = JSON.parse(state);
        if (state.Product != that.state.Product) {
          state.Product = that.state.Product;
          that.setState(state);
          return false;
        }
      });
    } else {
      await this.fetchData();
    }
  };

  _searchProduct = () => {
    let { SelectedGroupIndex, PrdGroups } = this.state;
    if (SelectedGroupIndex > -1 && PrdGroups.length > 0) {
      this._loadProductsIsSetByGroup(PrdGroups[SelectedGroupIndex]);
    }
  }

  _loadProductsIsSetByGroup = async group => {
    let language = await _retrieveData('culture', 1);
    const { CurrentItem, keysearch } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    await getAllItembyChoiceId(group.chsId, Config, CurrentItem.data, keysearch, language).then(res => {
      if ("Table" in res.Data) {
        let Products = res.Data.Table;
        this.setState({ Products, isWorking: false }, async () => {
          await this.SetMenu_gettemDefault();
        });
      }
    }).catch(async (error) => {
      console.log(error);
      await this.SetMenu_gettemDefault();
    });
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };

  _loadChildGroups = async SelectedGroupIndex => {
    let { PrdGroups } = this.state;
    if (SelectedGroupIndex >= 0) {
      let group = PrdGroups[SelectedGroupIndex];
      this.setState({ PrdGroups }, async () =>
        await this._loadProductsIsSetByGroup(group)
      );
    }
  };


  fetchData = async () => {
    await Font.loadAsync({
      RobotoBlack: require("../../assets/fonts/Roboto-Black.ttf"),
      RobotoBlackItalic: require("../../assets/fonts/Roboto-BlackItalic.ttf"),
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
      RobotoBoldCondensed: require("../../assets/fonts/Roboto-BoldCondensed.ttf"),
      RobotoBoldItalic: require("../../assets/fonts/Roboto-BoldItalic.ttf"),
      RobotoItalic: require("../../assets/fonts/Roboto-Italic.ttf"),
      RobotoThinItalic: require("../../assets/fonts/Roboto-ThinItalic.ttf"),
      RobotoThin: require("../../assets/fonts/Roboto-Thin.ttf"),
      RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
      RobotoRegular: require("../../assets/fonts/Roboto-Regular.ttf"),
      RobotoBoldCondensedItalic: require("../../assets/fonts/Roboto-BoldCondensedItalic.ttf"),
      RobotoCondensed: require("../../assets/fonts/Roboto-Condensed.ttf"),
      RobotoCondensedItalic: require("../../assets/fonts/Roboto-CondensedItalic.ttf"),
      RobotoLightItalic: require("../../assets/fonts/Roboto-LightItalic.ttf"),
      RobotoMediumItalic: require("../../assets/fonts/Roboto-MediumItalic.ttf"),
      RobotoLight: require("../../assets/fonts/Roboto-Light.ttf"),
    });
    await this.defaultFonts();
    await this.fetchDataSetMenu();

  };
  defaultFonts = async () => {
    const customTextProps = {
      style: {
        fontFamily: 'RobotoRegular',
      }
    }
    setCustomText(customTextProps)
  }

  fetchDataSetMenu = async () => {
    let { table, CurrentItem, SelectedGroupIndex } = this.state;
    let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));

    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    endpoint = JSON.parse(endpoint);
    endpoint = endpoint.replace('api/', '');
    let language = await _retrieveData('culture', 1);
    if (!("TicketId" in table)) {
      table = await _retrieveData("APP@TABLE", JSON.stringify({}));
      table = JSON.parse(table);
    }
    console.log("table", table);
    if ("PrdId" in CurrentItem.data && CurrentItem.data.PrdId > 0) {
      await SetMenu_getChoiceCategory(Config, CurrentItem.data).then(res => {
        if (res.Data.Table.length > 0) {
          let PrdGroups = res.Data.Table;
          SelectedGroupIndex = SelectedGroupIndex < 0 ? 0 : SelectedGroupIndex;
          this.setState({ table, language, endpoint, Config, SelectedGroupIndex, PrdGroups, },
            () => {
              this._loadChildGroups(SelectedGroupIndex);
            });
        }
        else {
          this.setState({ isLoading: false, fontLoaded: true, language, endpoint, Config, });
        }
      }).catch(error => {
        this.setState({
          language, endpoint, settings,
          isLoading: false,
          fontLoaded: true,
        });
      });
    }
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  }

  SetMenu_gettemDefault = async () => {
    let { CurrentItem } = this.state;
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    await SetMenu_gettemDefault(Config, CurrentItem.data).then(res => {
      if ("Table" in res.Data) {
        if (CurrentItem.items != undefined && CurrentItem.items.length > 0) {
          this.setState({ isLoading: false, fontLoaded: true, CurrentItem });
        }
        else {
          CurrentItem.items = res.Data.Table;
          CurrentItem.items.forEach((item, data) => {
            CurrentItem.finalAmount += item.TksdQuantity * item.TksdPrice;
          });
          this.setState({ isLoading: false, fontLoaded: true, CurrentItem });
        }
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isLoading: false,
        fontLoaded: true,
      });
    });
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };

  IncrementQty = async (item, index) => {
    if (index < 0) return;
    let { CurrentItem, settings, PrdGroups, SelectedGroupIndex } = this.state;
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    let existed = false;
    if (Config.I_LimitQuntityBooking > 0) {
      if (CurrentItem.quantity >= Config.I_LimitQuntityBooking) {
        Question.alert(
          this.t._("Limited Quantity!"),
          this.t._("Your quantity is limited, Please check in!")
        );
        return;
      }
    }
    let group = PrdGroups[SelectedGroupIndex];
    if (('quantity' in group && group.quantity == group.ChcgMaxQuantity) || group.ChcgMaxQuantity == 0) {
      Question.alert(
        this.t._("Limited Quantity!"),
        this.t._("Your quantity is limited, Please check in!")
      );
      return;
    }
    CurrentItem.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        if (product.TksdQuantity > 0) {
          product.TksdQuantity++;
        } else {
          product.TksdQuantity = 1;
        }
        return existed;
      }
    });

    if (!existed) {
      if (Config.I_LimitTypeBooking > 0) {
        if (CurrentItem.items.length >= Config.I_LimitTypeBooking) {
          Question.alert(
            this.t._("Limited Products!"),
            this.t._("Your products number is limited, Please check in!")
          );
          return;
        }
      }
      item.TksdQuantity = 1;
      CurrentItem.items.push({
        SmnIsChange: true,
        PrdId: item.PrdId,
        PrdNo: item.PrdNo,
        PrdName: item.PrdName,
        TksdUnitId: item.UnitId,
        chsId: ('chsId' in item) ? item.chsId : null,
        TksdPrice: ('TksdPrice' in item) ? item.TksdPrice : 0,
        OdsdDescription: ('OdsdDescription' in item) ? item.OdsdDescription : '',
        TksdQuantity: item.TksdQuantity,
      });
    }
    CurrentItem.quantity++;
    if (('chsId' in item) && item.chsId == group.chsId) {
      if ('quantity' in group) {
        group.quantity++;
      }
      else {
        group.quantity = 1;
      }
      PrdGroups[SelectedGroupIndex] = group;
    }
    CurrentItem.finalAmount += parseFloat(item.TksdPrice);
    console.log('IncrementQty: group ', group, CurrentItem, item);
    this.setState({ CurrentItem, PrdGroups });
  };

  DecreaseQty = async (item, index) => {
    if (index < 0) return;
    let { CurrentItem, PrdGroups, SelectedGroupIndex } = this.state;
    let existed = false;
    let group = PrdGroups[SelectedGroupIndex];
    CurrentItem.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        if (product.TksdQuantity > 1) {
          product.TksdQuantity--;
        } else {
          Question.alert(this.t._('notice'), this.t._('Bạn chắc chắn muốn bỏ sản phẩm này?'), [
            { text: t._('BỎ QUA'), onPress: () => { } },
            {
              text: this.t._('OK'),
              onPress: () => {
                CurrentItem.items.splice(index, 1);
                this.setState({ CurrentItem },);
              }
            },
          ])
        }
        return;
      }
    });

    if (!existed) {
      return;
    }
    CurrentItem.quantity--;
    if (('chsId' in item) && item.chsId == group.chsId) {
      group.quantity--;
      PrdGroups[SelectedGroupIndex] = group;
    }
    if (CurrentItem.quantity < 0) {
      CurrentItem.quantity = 0;
    }
    if (CurrentItem.finalAmount >= parseFloat(item.TksdPrice)) {
      CurrentItem.finalAmount -= parseFloat(item.TksdPrice);
    } else {
      CurrentItem.finalAmount = 0;
    }

    this.setState({ CurrentItem, PrdGroups },);
  };

  IncrementCurrentQty = async (item, index) => {
    if (index < 0) return;
    let { Cart, settings, CurrentItem } = this.state;
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    let existed = false;
    if (Config.I_LimitQuntityBooking > 0) {
      if (Cart.Qty >= Config.I_LimitQuntityBooking) {
        Question.alert(
          this.t._("Limited Quantity!"),
          this.t._("Your quantity is limited, Please check in!")
        );
        return;
      }
    }
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        if (product.Qty > 0) {
          product.Qty++;
        } else {
          product.Qty = 1;
        }
        return existed;
      }
    });

    if (!existed) {
      if (Config.I_LimitTypeBooking > 0) {
        if (Cart.items.length >= Config.I_LimitTypeBooking) {
          Question.alert(
            this.t._("Limited Products!"),
            this.t._("Your products number is limited, Please check in!")
          );
          return;
        }
      }
      item.Qty = item.Qty + 1;
      Cart.items.push(item);
    }
    Cart.Qty++;
    Cart.Amount += parseFloat(item.UnitPrice);
    CurrentItem.finalAmount += parseFloat(item.TksdPrice);
    this.setState({ Cart, CurrentItem }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };

  DecreaseCurrentQty = async (item, index) => {
    if (index < 0) return;
    let { Cart, CurrentItem } = this.state;
    let existed = false;
    Cart.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        if (product.Qty > 1) {
          product.Qty--;
        } else {
          Cart.items.splice(index, 1);
        }
        return;
      }
    });

    if (!existed) {
      return;
    }
    Cart.Qty--;
    if (Cart.Qty < 0) {
      Cart.Qty = 0;
    }
    if (Cart.Amount >= parseFloat(item.UnitPrice)) {
      Cart.Amount -= parseFloat(item.UnitPrice);
    } else {
      Cart.Amount = 0;
    }
    if (CurrentItem.finalAmount >= parseFloat(item.TksdPrice)) {
      CurrentItem.finalAmount -= parseFloat(item.TksdPrice);
    } else {
      CurrentItem.finalAmount = 0;
    }
    this.setState({ Cart, CurrentItem }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };

  _showCurrentQty = item => {
    let { Cart } = this.state;
    let qty = 1;
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        qty = product.Qty;
        return qty;
      }
    });
    return qty;
  };

  changeLanguage = async lang => {
    if (this.state.language != lang) {
      let that = this;
      await _storeData("culture", lang.toString(), async () => {
        console.log(this.state.language, lang);
        that.t = await this.t.loadLang();
        console.log(this.state.language, lang);
        that.setState({ language: lang }, () => that.fetchData());
      });
    }
  };

  _selectGroup = (item, index) => {
    this.setState({ SelectedGroupIndex: index, isWorking: true }, () => {
      this._loadProductsIsSetByGroup(item);
    });
  };

  sendOrderIsSet = async () => {
    let { CurrentItem, lockTable } = this.state;
    let Cart = await _retrieveData(
      "APP@CART",
      JSON.stringify({
        items: [],
        Qty: 0,
        Amount: 0,
        itemIsSet: [],
        isSetQty: 0,
        isSetAmount: 0,
      }));
    Cart = JSON.parse(Cart);

    let existed = false;
    let item = JSON.parse(JSON.stringify(CurrentItem.data));
    item.OrddChoiceAmount = CurrentItem.finalAmount;
    item.OrddTotalChoiseAmount = CurrentItem.finalAmount;
    item.OrddTotalAmount = CurrentItem.finalAmount;
    item.subItems = JSON.parse(JSON.stringify(CurrentItem.items));
    delete item.Details;
    if (!('Json' in item) || item.Json == '') {
      item.Json = JSON.stringify(CurrentItem.items);
    }
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        if (product.Qty > 0) {
          product.Qty++;
        } else {
          product.Qty = 1;
        }

        if ('Details' in product) {
          let subExists = false;
          product.Details.forEach((subPro, ind) => {
            if (subPro.Json == item.Json) {
              if (subPro.Qty > 0) {
                subPro.Qty++;
              } else {
                subPro.Qty = 1;
              }
              subExists = true;
              return true;
            }
          });

          if (!subExists) {
            item.Qty = 1;
            product.Details.push(item);
          }
        }
        else {
          product.Details = [item];
        }
        return existed;
      }
    });

    if (!existed) {
      var Prd = JSON.parse(JSON.stringify(CurrentItem.data));
      item.Qty = this._showCurrentQty(item);
      Prd.Details = [item];
      Prd.Qty = this._showCurrentQty(item);
      Cart.items.push(Prd);
    }
    console.log('set item', item);

    Cart.Qty++;
    Cart.Amount += parseFloat(item.OrddTotalChoiseAmount);
    console.log('cart booking set', Cart);

    _storeData("APP@CART", JSON.stringify(Cart), () => {
      this.props.navigation.navigate('Booking', { lockTable });
    });
  };

  _showQty = item => {
    let { CurrentItem } = this.state;
    let quantity = 0;
    CurrentItem.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        quantity = product.TksdQuantity;
        return quantity;
      }
    });
    return quantity;
  };

  _getProductInItems = item => {
    let { CurrentItem } = this.state;
    let prd = null;
    let ind = -1;
    CurrentItem.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId && product.TksdQuantity > 0) {
        prd = product;
        ind = index;
        return prd;
      }
    });
    return { prd, ind };
  };

  _deleteCurrentItem = (item, index) => {
    let { CurrentItem, PrdGroups, SelectedGroupIndex } = this.state;
    let group = PrdGroups[SelectedGroupIndex];
    let existed = false;
    CurrentItem.items.forEach(product => {
      if (product.PrdId == item.PrdId && product.TksdQuantity > 0) {
        existed = true;
        CurrentItem.items.splice(index, 1);
        return existed;
      }
    });
    if (('chsId' in item) && item.chsId == group.chsId) {
      group.quantity--;
      PrdGroups[SelectedGroupIndex] = group;
    }
    this.setState({ CurrentItem, PrdGroups });
  }

  toggleWidth(isShow) {
    const endWidth = !this.state.ShowFullCurrentItem
      ? SCREEN_WIDTH * 0.4
      : SCREEN_HEIGHT * 0.11 - 20;
    if (isShow) {
      this.setState({ ShowFullCurrentItem: isShow });
    }
    Animated.timing(this.state.CurrentItemWidth, {
      toValue: endWidth,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ ShowFullCurrentItem: isShow }));
  }
  toggleCurrentItemWidth(isShow) {
    const endWidth = !this.state.ShowCurrentItemDetail
      ? SCREEN_WIDTH * 0.5
      : 0;
    if (isShow) {
      this.setState({ ShowCurrentItemDetail: isShow, isBooking: true });
    }
    Animated.timing(this.state.FullCurrentItemWidth, {
      toValue: endWidth,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ ShowCurrentItemDetail: isShow }));
  }

  _buy = (item) => {
    this.setState({ SelectedProduct: null, SelectedProductIndex: -1 });
  }
  _updateDescription = async (Product) => {
    let state = await _retrieveData('SETSCREEN@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.CurrentItem.items[state.selectedItemIndex] = Product;
      _storeData("SETSCREEN@STATE", JSON.stringify(state));
    }
  }
  _updateSetDescription = async (data) => {
    let state = await _retrieveData('SETSCREEN@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.CurrentItem.data = data;
      _storeData("SETSCREEN@STATE", JSON.stringify(state));
    }
  }
  _addExtraRequestToItem = (item) => {
    if (item == null) {
      return;
    }
    let state = this.state;
    CurrentItem.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId) {
        state.Product = product;
        state.selectedItemIndex = index;
      }
    });
    _storeData("SETSCREEN@STATE", JSON.stringify(this.state), async () => {
      this.props.navigation.navigate('Request', { ReturnScreen: "BookingSet", Product: item, UpdateDescription: async (item) => this._updateDescription(item) });
    });
  }
  _addExtraRequestToSet = () => {
    let state = this.state;
    _storeData("SETSCREEN@STATE", JSON.stringify(this.state), async () => {
      this.props.navigation.navigate('Request', { ReturnScreen: "BookingSet", Product: this.state.CurrentItem.data, UpdateDescription: async (item) => this._updateSetDescription(item) });
    });
  }
  sendNotice = (status) => {
    this.setState({ showFilterBell: false, isWorking: false, tableStatus: status });
  }
  _Cancel = () => {
    let { lockTable } = this.state;
    _storeData("SETSCREEN@STATE", '', async () => {
      this.props.navigation.navigate('Booking', { lockTable });
    });
  };

  renderGroupItem = ({ item, index }) => {
    const {
      SelectedGroupIndex
    } = this.state;
    return (
      <TouchableOpacity
        key={index}
        style={[BookingsStyle.left_menu_Item, styles.left_menu_group, { backgroundColor: SelectedGroupIndex == index ? '#367AC8' : colors.background, }]}
        onPress={() => this._selectGroup(item, index)}
      >
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={[{ color: SelectedGroupIndex == index ? colors.white : colors.white, textAlign: "left", fontSize: ITEM_FONT_SIZE * 0.9 }]}
            numberOfLines={2}
          >
            {item.ChcgName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{ color: colors.white, textAlign: "center", fontSize: ITEM_FONT_SIZE * 0.7 }]}>{item.ChcgMin}</Text>
            <Text style={[{ color: colors.white, textAlign: "center", fontSize: ITEM_FONT_SIZE * 0.7 }]}>{this.t._('=>')}</Text>
            <Text style={[{ color: colors.white, textAlign: "center", fontSize: ITEM_FONT_SIZE * 0.7 }]}>{item.ChcgMax}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderCurrentItem = ({ item, index }) => {
    return (
      <View style={styles.CurrentItemItemContainer}>
        <View key={index} style={styles.CurrentItemItemBox}>
          <Text style={styles.CurrentItemItemText} numberOfLines={2}>
            {this._showQty(item)} {this.t._('X')}
          </Text>
        </View>
        <View style={styles.CurrentItemItemNameBox}>
          <View style={{
            flexDirection: "row", paddingRight: 5,
            justifyContent: "flex-start", alignContent: 'flex-start', alignItems: 'flex-start', width: '53%',
          }}>
            <Text style={[{ color: "#000000", width: '100%', fontSize: ITEM_FONT_SIZE * 0.6, textAlign: 'left', }]} numberOfLines={5}>
              {this.t._('#')}{item.PrdName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignContent: 'center', alignItems: 'center', width: '35%', paddingRight: 5, }}>
            <Text style={{ textAlign: 'right', fontSize: ITEM_FONT_SIZE * 0.6, color: "#000000", }}>{formatCurrency(item.TksdPrice, '')}</Text>
          </View>
          {item.SmnId && item.SmnId > 0 ?
            <View style={{ flexDirection: 'row', width: '12%', justifyContent: 'center', alignItems: 'center', }}>
            </View>
            :
            <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
              <TouchableOpacity onPress={() => { this._deleteCurrentItem(item, index); }}>
                <Icon
                  name="close"
                  type="closesquare"
                  color={'#FFFFFF'}
                />
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }

  _changeQty = (cartItem, cartIndex, type) => {
    if (type == 1) {
      return this.IncrementQty(cartItem, cartIndex);
    }
    return this.DecreaseQty(cartItem, cartIndex);
  }

  renderProductModal = (item, index) => {
    if (item == null) {
      return null;
    }
    let res = this._getProductInItems(item);
    return (
      <ProductSetDetails
        item={item}
        endpoint={this.state.endpoint}
        index={index}
        cart={res}
        t={this.t}
        onChangeQty={(item, index, type) => this._changeQty(item, index, type)}
        setState={(state) => this.setState(state)}
        BookingsStyle={BookingsStyle}
      />

    );
  };

  _getItemFromCart = item => {
    let { CurrentItem } = this.state;
    let prd = null;
    let ind = -1;
    CurrentItem.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId && product.TksdQuantity > 0) {
        prd = product;
        ind = index;
        return prd;
      }
    });

    return { prd, ind };
  };

  renderProduct = ({ item, index }) => {
    let res = this._getItemFromCart(item);
    let cartItem = res.prd, cartIndex = res.ind;
    return (
      <TouchableHighlight style={[BookingsStyle.table_image, {
        borderBottomWidth: 4, borderLeftWidth: 4, borderTopWidth: 4, borderColor: colors.grey5,
        width: SCREEN_WIDTH / 2.88,
      }]}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", height: '100%' }}>
          <View style={{ backgroundColor: "grey", width: "60%", height: '100%' }}>
            <ImageBackground
              resizeMode="stretch"
              source={
                item.PrdImage ? { uri: `data:image/gif;base64,${item.PrdImage}` } : (
                  item.PrdImageUrl
                    ? {
                      uri:
                        this.state.ProductImagePrefix == '' ?
                          this.state.endpoint +
                          "/Resources/Images/Product/" +
                          item.PrdImageUrl :
                          this.state.ProductImagePrefix + '/' + item.PrdImageUrl
                    }
                    : require("../../assets/icons/ReliposEmenu_4x.png")
                )
              }
              style={[{ width: '100%', height: '100%', backgroundColor: colors.grey1 }]}
            >
              {item.SttId && item.SttId == 3 ?
                <View style={{
                  position: "absolute", paddingTop: ITEM_FONT_SIZE, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%'
                }}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_like.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.2, height: ITEM_FONT_SIZE * 1.2, }} />
                </View>
                : null}
              {item.SttId && item.SttId == 2 ?
                <View style={{
                  position: "absolute", paddingTop: ITEM_FONT_SIZE, right: 0,
                  paddingRight: Platform.OS === "android" ? 13 : 26, width: '20%'
                }}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_new.png')}
                    style={{ width: ITEM_FONT_SIZE * 1.2, height: ITEM_FONT_SIZE * 1.2, }} />
                </View>
                : null}
              <View style={{ position: "absolute", paddingTop: SCREEN_HEIGHT * 0.136 - ITEM_FONT_SIZE, right: -15 }}>
                <Icon
                  name="caretleft"
                  type="antdesign"
                  iconStyle={{ justifyContent: "space-between", color: "#FFFFFF", fontSize: 36 }}
                />
              </View>
            </ImageBackground>
          </View>

          <View style={{ flexDirection: "column", flexWrap: "wrap", width: "40%", height: '100%', backgroundColor: "#EEEEEE" }}>
            <View style={{ flexDirection: "column", flexWrap: "wrap", width: "100%", backgroundColor: "#EEEEEE" }}>
              <View style={{ height: SCREEN_HEIGHT * 0.232 - ITEM_FONT_SIZE * 1.2 - ITEM_FONT_SIZE * 1.8, width: '100%', }}>
                <Text style={{
                  color: "#0d65cd", textAlign: 'center', width: '95%',
                  fontSize: ITEM_FONT_SIZE * 0.8, fontFamily: "RobotoBold"
                }} numberOfLines={5}>
                  {item.PrdNo}
                </Text>
                <Text style={{
                  color: "#000000", width: '100%',
                  paddingLeft: 5, fontSize: ITEM_FONT_SIZE * 0.8, flexWrap: "wrap"
                }} numberOfLines={5}>
                  {item.PrdName}
                </Text>
              </View>
              <View style={{ height: ITEM_FONT_SIZE * 1.2, width: '100%', paddingRight: 5 }}>
                <Text style={{ color: "#af3037", width: "100%", textAlign: 'right', fontSize: ITEM_FONT_SIZE * 0.8 }}>
                  {this.t._("Giá")}:{""}
                  <Text style={{ fontFamily: "RobotoItalic" }}>
                    {formatCurrency(item.TksdPrice, "")}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: ITEM_FONT_SIZE * 1.8, }}>
              <View style={{ flexDirection: "row", justifyContent: 'space-evenly', width: "100%", height: ITEM_FONT_SIZE * 1.6 }}>
                {this._showQty(item) > 0 ?
                  <TouchableOpacity onPress={() => this.DecreaseQty(item, index)} >
                    <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiam.png')}
                      style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }} />
                  </TouchableOpacity>
                  :
                  <View style={{
                    width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6,
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    {/* <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiamGrey.png')}
                      style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }} /> */}
                  </View>
                }
                <View style={{ height: ITEM_FONT_SIZE * 1.6, justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: "#af3037",
                      width: 'auto',
                      fontSize: ITEM_FONT_SIZE * 0.8,
                      textAlign: "center",
                      fontFamily: "RobotoBold"
                    }}
                  >
                    {this._showQty(item)}
                  </Text>
                </View>
                <TouchableOpacity style={{}} onPress={() => this.IncrementQty(item, index)}>
                  <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnTang.png')}
                    style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {
      PrdGroups,
      Products,
      SelectedProduct,
      SelectedProductIndex,
      SelectedGroupIndex,
      showFilterBell,
      item,
      index,
      CurrentItem,
      Config,
      lockTable,
      IsSetProduct
    } = this.state;

    console.log('this.state', this.state);
    if (!this.state.fontLoaded) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            size="large" color="#0000ff"
            onLayout={() => {
              this.setState({ fontLoaded: false });
            }}
          />
        </View>
      )
    }
    console.log('booking set render - item', item);

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <_Header
          state={this.state}
          table={this.state.table}
          onPressBack={() => { this.onPressBack(); }}
          _searchProduct={(val) => this._searchProduct(val)}
          t={this.t}
          name={'BookingSet'}
          language={this.state.language}
          lockTable={lockTable}
          titleSet={CurrentItem.data}
          setState={(state) => this.setState(state)}
          BookingsStyle={BookingsStyle}
        />
        <View style={styles.mainContainer}>
          <View style={[{ width: "30%", backgroundColor: '#FFFFFF' }]}>
            <View style={{ flexDirection: 'column', width: "100%", backgroundColor: colors.white, height: '70%' }}>
              <View style={[{ width: "100%", flexDirection: 'row', height: '10%', borderBottomColor: colors.grey4, borderBottomWidth: 0.5, borderBottomEndRadius: 1 }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.7, fontFamily: 'RobotoBold', color: '#000000' }}>{this._showCurrentQty(CurrentItem.data) > 0 ? this._showCurrentQty(CurrentItem.data) : '0'} {this.t._("X")}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '60%', }}>
                  <Text style={{ textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.7, fontFamily: 'RobotoBold', color: '#000000' }} numberOfLines={3}>{CurrentItem.data.PrdName}</Text>
                </View>
                <View style={{ position: 'absolute', right: 10, top: 10, paddingTop: 5, justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ textAlign: 'center', fontSize: ITEM_FONT_SIZE * 0.7, fontFamily: 'RobotoBold', color: '#000000' }}>{formatCurrency(CurrentItem.data.TksdPrice, '')}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", width: '100%', backgroundColor: colors.white, height: '90%', paddingBottom: 24 }}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.CurrentItem.items}
                  extraData={this.state}
                  renderItem={this.renderCurrentItem}
                  contentContainerStyle={{ backgroundColor: colors.white, borderColor: colors.grey4 }}
                />
              </View>
            </View>
            <View style={[{ width: "100%", backgroundColor: colors.white, flexDirection: 'column', height: '21%' }]}>
              <View style={{ width: '100%', height: '100%', borderColor: colors.white, borderRadius: 1, borderWidth: 1, backgroundColor: colors.grey5, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                  <View style={{ flexDirection: 'column', width: '90%', }}>
                    <Text style={{ color: '#000000', textAlign: 'left', fontSize: ITEM_FONT_SIZE * 0.8, }}>{this.t._('Số lượng')}:</Text>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", width: '100%', borderColor: colors.grey3, borderWidth: 1, }}>
                      <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", width: '78%', height: SCREEN_HEIGHT * 0.04, backgroundColor: colors.white, }}>
                        <Text style={{ paddingLeft: 10, fontSize: ITEM_FONT_SIZE / 1.2, width: '100%', textAlign: 'left', }}>
                          {this._showCurrentQty(CurrentItem.data) >= 1 ? this._showCurrentQty(CurrentItem.data) : '0'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", width: '22%', height: SCREEN_HEIGHT * 0.04, backgroundColor: colors.white, }}>
                        {this._showCurrentQty(CurrentItem.data) > 1 ?
                          <TouchableOpacity onPress={() => { this.DecreaseCurrentQty(CurrentItem.data, index) }} >
                            <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiam.png')}
                              style={{ width: ITEM_FONT_SIZE * 1.2, height: ITEM_FONT_SIZE * 1.2, }} />
                          </TouchableOpacity>
                          :
                          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiamGrey.png')}
                              style={{ width: ITEM_FONT_SIZE * 1.2, height: ITEM_FONT_SIZE * 1.2, }} />
                          </View>
                        }
                        <View style={{ width: '2%' }}></View>
                        <TouchableOpacity onPress={() => { this.IncrementCurrentQty(CurrentItem.data, index) }}>
                          <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnTang.png')}
                            style={{ width: ITEM_FONT_SIZE * 1.2, height: ITEM_FONT_SIZE * 1.2, }} />
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.navigationBar, { width: "100%", backgroundColor: colors.white, flexDirection: 'column', height: '9%' }]}>
              <View style={{ width: '100%', height: '100%', borderColor: colors.white, borderRadius: 1, borderWidth: 1, backgroundColor: '#dc7d46', flexDirection: 'row' }}>
                <View style={[styles.item_text_right_end, styles.item_text_center, { paddingLeft: BUTTON_FONT_SIZE * 0.25, alignItems: "flex-start" }]}>
                  <Text style={{ fontSize: ITEM_FONT_SIZE, color: colors.white, fontFamily: 'RobotoBold', }}>
                    {this.t._('Tổng tiền')}:
                    </Text>
                </View>
                <View style={[styles.item_text_right_end, styles.item_text_center, { paddingRight: BUTTON_FONT_SIZE * 0.25, alignItems: "flex-end" }]}>
                  <Text style={{ fontSize: ITEM_FONT_SIZE, color: colors.white }}>
                    {formatCurrency(this.state.CurrentItem.finalAmount, '')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[{ width: "70%", backgroundColor: '##FFFFFF' }]}>
            <_PrdSetGroup
              state={this.state}
              t={this.t}
              PrdGroups={PrdGroups}
              SelectedGroupIndex={SelectedGroupIndex}
              _selectGroup={(item, index) => this._selectGroup(item, index)}
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
            />
            <FlatList
              data={Products}
              numColumns={2}
              extraData={this.state}
              renderItem={this.renderProduct}
              contentContainerStyle={{ paddingBottom: SCREEN_HEIGHT * 0.08 }}
            />
            <View style={[styles.navigationBar, { width: "56%", backgroundColor: colors.white, flexDirection: 'column', height: '9%' }]}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <TouchableOpacity onPress={() => this._Cancel()}>
                  <View style={[BookingsStyle.bottombar, {
                    borderColor: colors.white, borderTopRightRadius: 1, borderWidth: 1, width: SCREEN_WIDTH * 0.21,
                    color: "white", alignItems: 'center', justifyContent: 'center', backgroundColor: '#c00003',
                  }]}>
                    <Text style={[styles.item_menu_order, { fontSize: ITEM_FONT_SIZE, fontFamily: 'RobotoBold', }]} >
                      {this.t._("Bỏ qua")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.sendOrderIsSet()} disabled={this.state.CurrentItem.quantity == 0 || this.state.isWorking}>
                  <View style={[BookingsStyle.bottombar, {
                    borderColor: colors.white, borderTopLeftRadius: 1, borderWidth: 1, width: SCREEN_WIDTH * 0.21,
                    color: "white", alignItems: 'center', justifyContent: 'center', backgroundColor: '#008bc5',
                  }]}>
                    <Text style={[styles.item_menu_order, { fontSize: ITEM_FONT_SIZE, fontFamily: 'RobotoBold', }]} >
                      {this.t._("Đồng ý")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
        </View>
        {/* {this.renderProductModal(SelectedProduct, SelectedProductIndex)} */}

        {showFilterBell ?
          <_BellOptions
            settings={Config}
            BookingsStyle={BookingsStyle}
            endpoint={this.state.endpoint}
            language={this.state.language}
            changeLanguage={(lang) => this.changeLanguage(lang)}
            sendNotice={(status) => this.sendNotice(status)}
            setState={(state) => this.setState(state)}
            t={this.t}
            tableStatus={this.state.tableStatus}
          /> : null}
        {this.state.isWorking ?
          <View style={styles.item_view_text}>
            <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
          </View>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  CurrentItemItemContainer: { height: SCREEN_HEIGHT * 0.04, width: '100%', flexDirection: "row", paddingLeft: 10, justifyContent: "space-around", borderBottomWidth: 0.5, borderBottomEndRadius: 1, borderBottomColor: colors.grey4 },
  CurrentItemItemBox: { width: '10%', justifyContent: 'center', alignItems: 'center', },
  CurrentItemItemText: { color: "#000000", width: '100%', fontSize: ITEM_FONT_SIZE * 0.6, textAlign: 'center' },
  CurrentItemItemNameBox: { width: '90%', flexDirection: "row", justifyContent: 'center', alignItems: 'center', },
  CurrentItemItemNameText: {
    color: "#000000",
    width: '40%',
    paddingTop: SCREEN_HEIGHT * 0.02,
    fontSize: ITEM_FONT_SIZE,
    textAlign: 'left',
  },
  itemQtyBtns: { fontSize: ITEM_FONT_SIZE * 1.5, fontFamily: 'RobotoBold', },
  container1: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    justifyContent: 'space-around',
    padding: 10
  },
  container: {
    backgroundColor: "#FFFFFF",
    // alignItems: 'center',
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    flex: 1
  },
  navigationBar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  mainContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    height: "92%",
    width: "100%"
  },
  item_Table: {
    color: '#008bc5',
    maxHeight: SCREEN_HEIGHT * 0.16,
  },
  left_menu_group: {
    paddingLeft: 12,
    height: ITEM_FONT_SIZE * 3.5,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center",
    backgroundColor: "#3275A1",
  },
  item_Search: {
    width: '90%',
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50,
  },
  item_language: {
    flexDirection: "row",
  },
  item_menu_order: {
    fontSize: ITEM_FONT_SIZE * 1.5,
    fontFamily: 'RobotoBold',
    textAlign: "center",
    color: "white",
  },
  item_menu_CurrentItem: {
    fontSize: ITEM_FONT_SIZE * 1.5,
    fontFamily: 'RobotoBold',
    textAlign: "center",
    color: "white",
    backgroundColor: "#008bc5",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#0176cd',
  },
  buttonText: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.2,
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE,
    fontFamily: 'RobotoBold'
  },
  button_end_left_order: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: BUTTON_FONT_SIZE * 0.25,
  },
  button_end_right_order: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: BUTTON_FONT_SIZE * 0.25,
  },
  item_text_end: {
    height: SCREEN_HEIGHT * 0.08,
    // paddingTop:BUTTON_FONT_SIZE * 0.12,
  },
  item_text_right_end: {
    height: SCREEN_HEIGHT * 0.08,
    // paddingTop:BUTTON_FONT_SIZE * 0.12,
  },
  item_text_center: {
    width: '50%',
    justifyContent: "center",
  },
  item_view_text: {
    height: SCREEN_HEIGHT + Constants.statusBarHeight,
    width: SCREEN_WIDTH,
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.grey1,
    opacity: 0.5,
    bottom: 0,
    right: 0,
    borderTopColor: colors.grey4,
    borderTopWidth: 1
  }
});
