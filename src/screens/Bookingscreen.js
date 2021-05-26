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
  ScrollView,
  Animated,
  Easing,
  Text,
  View,
  TextInput
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { _retrieveData, _storeData, _remove } from "../services/storages";
import { cacheFonts } from "../helpers/AssetsCaching";
import { FlatList } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { setCustomText } from "react-native-global-props";
import { ProductDetails, _Cart, _BellOptions, _CallOptions, _HeaderNew, _PrdGroup, _Infor, _TotalInfor } from '../components';
import {
  ENDPOINT_URL,
  BUTTON_FONT_SIZE,
  ITEM_FONT_SIZE
} from "../config/constants";
import t from "../services/translate";
import {
  GetPrdGroups,
  GetPrdChildGroups,
  GetProductByGroupParent,
  getTicketInfor,
  sendOrder,
  getOrderId,
  SetMenu_getChoiceCategory,
  getAllItembyChoiceId,
} from "../services";
import { formatCurrency, getTableColor } from "../services/util";
import colors from "../config/colors";
import BookingsStyle from "../styles/bookings";
import Question from '../components/Question';
import vi from "../../locales/vi";
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT =
  Dimensions.get("window").height - Constants.statusBarHeight;

export default class Bookingscreen extends Component {
  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.flatListRef = null;
    this.textInput = null;
    //const data = Array.apply(null, {length: 20}).map(Number.call, Number);

    this.state = {
      isLoading: false,
      selectedType: null,
      fontLoaded: false,
      clicks: 0,
      show: true,
      selectedId: -1,
      language: 1,
      call: 1,
      data: [],
      PrdGroups: [],
      PrdSetGroups: [],
      SelectedGroupIndex: -1,
      PrdChildGroups: [],
      SelectedChildGroupIndex: -1,
      Products: [],
      Histories: [],
      isWorking: false,
      Ticket: {},
      table: {},
      settings: {},
      showDropdown: false,
      buttontext: props.defaultValue,
      keysearch: "",
      ShowFullCart: true,
      ShowCartDetail: false,
      FullCartWidth: new Animated.Value(0),
      CartWidth: new Animated.Value(SCREEN_WIDTH * 0.82),
      tableStatus: -1,
      isBooking: true,
      showFilterBell: false,
      showCall: false,
      SelectedProduct: null,
      SelectedProductIndex: -1,
      TimeToNextBooking: 0,
      Cart: {
        items: [],
        Qty: 0,
        Amount: 0,
        itemIsSet: [],
        isSetQty: 0,
        isSetAmount: 0
      },
      showtextInput: false,
      CurrentSet: [],
      PrdSetData: [],
      lockTable: false,
      iconCheck: false,
      iSelectPrd: -1,
      SelectediPrd: null,
      SelectedIndex: -1,
      ShowFeesInfo: false,
      OrdPlatform: 1,
      endpoint: "",
      showSetInCart: false,
      ShowTotalInfo: false,
      ProductImagePrefix: "",
    };
    this.t = new t();
  }


  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.interval);
  }

  componentDidMount = async () => {
    this.t = await this.t.loadLang();
    StatusBar.setHidden(true);
    that = this;
    let state = await _retrieveData("BOOKINGSCREEN@STATE", "");
    if (state != "") {
      _storeData("BOOKINGSCREEN@STATE", "", async () => {
        state = JSON.parse(state);
        state.Product = that.state.Product;
        state.FullCartWidth = new Animated.Value(0);
        state.CartWidth = new Animated.Value(SCREEN_WIDTH * 0.82);
        let Cart = await _retrieveData(
          "APP@CART",
          JSON.stringify({
            items: [],
            Qty: 0,
            Amount: 0,
            itemIsSet: [],
            isSetQty: 0,
            isSetAmount: 0
          })
        );
        Cart = JSON.parse(Cart);
        state.Cart = Cart;
        that.setState(state);
        return false;
      });
    } else {
      await this._getInfor();
      await this.fetchData();
    }
    this.interval = setInterval(() => {
      console.log('TimeToNextBooking', this.state.TimeToNextBooking);
      this.setState({ TimeToNextBooking: this.state.TimeToNextBooking - 1 });
    }, 1000);
  };

  onPressBack = () => {
    let { lockTable } = this.state;
    if (lockTable == true) {
      this.props.navigation.navigate("Logout", { lockTable });
    }
    else {
      _remove('APP@TABLE', () => {
        _remove('APP@CART', () => {
          this.props.navigation.navigate("Areas");
        });
      });
    }
  }


  _loadProductsIsSet = async (item) => {
    let language = await _retrieveData('culture', 1);
    let { settings, SelectedProduct, } = this.state;
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    item.TkdBasePrice = ('TkdBasePrice' in item) ? item.TkdBasePrice : item.UnitPrice;
    await SetMenu_getChoiceCategory(Config, item).then(async (res) => {
      if (res.Data.Table.length > 0) {
        let PrdSetGroups = res.Data.Table;
        let itemSetGroups = res.Data.Table[0];
        await getAllItembyChoiceId(itemSetGroups.chsId, Config, item, '', language).then(res => {
          if ("Table" in res.Data && res.Data.Table.length > 0) {
            let PrdSetData = res.Data.Table;
            console.log('PrdSetData', PrdSetData);
            this.setState({ PrdSetGroups, PrdSetData, isWorking: false, fontLoaded: true });
          }
          else {
            this.setState({ PrdSetGroups, PrdSetData: [], isWorking: false, fontLoaded: true });
          }
        }).catch(async (error) => {
          console.log(error);
          this.setState({ PrdSetData: [], isWorking: false, fontLoaded: true });
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
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };

  _loadProductsByGroup = async group => {
    let { table, keysearch } = this.state;
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
    GetProductByGroupParent(Config, table, group, keysearch).then(res => {
      if ("Table" in res.Data) {
        let Products = res.Data.Table;
        let ProductImagePrefix = res.Data1;
        this.setState({ Products, ProductImagePrefix, isWorking: false });
      }
    });
  };

  _searchProduct = () => {
    let {
      SelectedGroupIndex,
      PrdGroups,
      PrdChildGroups,
      SelectedChildGroupIndex
    } = this.state;
    if (SelectedChildGroupIndex > -1 && PrdChildGroups.length > 0) {
      this._loadProductsByGroup(PrdChildGroups[SelectedChildGroupIndex]);
    } else if (SelectedGroupIndex > -1 && PrdGroups.length > 0) {
      this._loadProductsByGroup(PrdGroups[SelectedGroupIndex]);
    }
  };

  _loadChildGroups = async SelectedGroupIndex => {
    let { table, PrdGroups, SelectedChildGroupIndex } = this.state;
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
    if (SelectedGroupIndex >= 0) {
      let group = PrdGroups[SelectedGroupIndex];
      if (group) {
        GetPrdChildGroups(Config, table, group).then(res => {
          if ("Table" in res.Data && res.Data.Table.length > 0) {
            let PrdChildGroups = res.Data.Table;
            SelectedChildGroupIndex =
              SelectedChildGroupIndex < 0 ? 0 : SelectedChildGroupIndex;
            console.log(SelectedChildGroupIndex);

            group = PrdChildGroups[SelectedChildGroupIndex];
            this.setState(
              { PrdChildGroups, SelectedChildGroupIndex, isWorking: true },
              () => this._loadProductsByGroup(group)
            );
          } else {
            this.setState(
              { PrdChildGroups: [], SelectedChildGroupIndex: -1 },
              () => this._loadProductsByGroup(group)
            );
          }
        })
          .catch(error => {
            this._loadProductsByGroup(group);
          });
      }
    }
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };

  fetchData = async () => {
    let {
      table,
      SelectedGroupIndex,
      OrdPlatform
    } = this.state;
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
    let endpoint = await _retrieveData(
      "APP@BACKEND_ENDPOINT",
      JSON.stringify(ENDPOINT_URL)
    );
    if (!("TicketId" in table)) {
      table = await _retrieveData("APP@TABLE", JSON.stringify({}));
      table = JSON.parse(table);
    }
    console.log("table", table);
    let settings = await _retrieveData('settings', JSON.stringify({}));
    if (settings == '{}') {
      settings = { "PosId": 1, "PosIdName": "Thu ngân" };
    }
    else {
      settings = JSON.parse(settings);
    }
    let Cart = await _retrieveData(
      "APP@CART",
      JSON.stringify({
        items: [],
        Qty: 0,
        Amount: 0,
        itemIsSet: [],
        isSetQty: 0,
        isSetAmount: 0
      })
    );
    Cart = JSON.parse(Cart);
    console.warn('Cart', Cart);

    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    let now = JSON.stringify(new Date().getTime());
    // let TimeToNextBooking = 0;
    let TimeToNextBooking = await _retrieveData("APP@TimeToNextBooking", "0");
    if (TimeToNextBooking == '0')
      TimeToNextBooking = 0;
    else {
      TimeToNextBooking = parseFloat(TimeToNextBooking);
      console.log('APP@before', TimeToNextBooking, now, settings.I_Limit_Booking_Time);
      TimeToNextBooking = parseInt((TimeToNextBooking + parseFloat(settings.I_Limit_Booking_Time) * 1000 - parseFloat(now)) / 1000);
      console.log('APP@TimeToNextBooking', TimeToNextBooking, now, settings.I_Limit_Booking_Time);
      if (TimeToNextBooking < 0) {
        TimeToNextBooking = 0;
      }
    }
    endpoint = JSON.parse(endpoint);
    endpoint = endpoint.replace("api/", "");
    let language = await _retrieveData("culture", 1);
    if ("TicketID" in table && table.TicketID > 0) {
      getOrderId(table, OrdPlatform).then(res => {
        table.OrderId = res.Data;
        console.log("setstate", table);
        _storeData("APP@TABLE", JSON.stringify(table), () => {
          GetPrdGroups(Config, table).then(res => {
            console.log(res, "res");
            if (res.Data.Table.length > 0) {
              let PrdGroups = res.Data.Table;
              SelectedGroupIndex = SelectedGroupIndex < 0 ? 0 : SelectedGroupIndex;
              this.setState(
                {
                  TimeToNextBooking,
                  language,
                  endpoint,
                  Config,
                  settings,
                  table,
                  PrdGroups,
                  Cart,
                  SelectedGroupIndex,
                  fontLoaded: true
                },
                () => {
                  this._loadChildGroups(SelectedGroupIndex);
                  this.defaultFonts();
                }
              );
            }
          }).catch(error => {
            console.log("error group", error);

            Question.alert(
              this.t._("Thông báo"),
              this.t._(
                "Không thể truy cập dữ liệu, vui lòng kiểm tra kết nối!"
              ),
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.setState({
                      TimeToNextBooking,
                      language,
                      endpoint,
                      table,
                      settings,
                      empty: true,
                      isLoading: false,
                      fontLoaded: true,
                      Cart
                    });
                  }
                }
              ]
            );
          });
        });
      }).catch(error => {
        console.log("error", error);

        this.setState({
          TimeToNextBooking,
          language,
          endpoint,
          table,
          settings,
          empty: true,
          isLoading: false,
          fontLoaded: true,
          Cart
        });
      });
    }
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };
  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: "RobotoRegular"
      }
    };
    setCustomText(customTextProps);
  }

  _getInfor = async () => {
    let { table, Ticket, Histories } = this.state;
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
    if ("TicketID" in table && table.TicketID > 0) {
      getTicketInfor(Config, table).then(res => {
        if (!("Table" in res.Data) || res.Data.Table.length == 0) {
          // Question.alert(
          //   this.t._("Thông báo"),
          //   this.t._("Phiếu đã đóng, vui lòng mở bàn lại!"),
          //   [
          //     {
          //       text: "OK",
          //       onPress: () => {
          //         _remove("APP@CART", () => {
          //           _remove("APP@TABLE", () => { this.props.navigation.navigate("Areas", { settings }); }
          //           );
          //         });
          //       }
          //     }
          //   ]
          // );
        }
        if ("Table2" in res.Data) {
          Histories = res.Data.Table2;
        }
        if ("Table1" in res.Data) {
          if (res.Data.Table1.length > 0) {
            Ticket = res.Data.Table1[0];
          } else {
            Ticket = { TkTotalAmount: 0, TkNo: 0, TkServiceChargeAmout: 0 };
          }
        }
        table.Ticket = Ticket;
        _storeData("APP@TABLE", JSON.stringify(table), () => {
          this.setState({ Ticket, table, Histories, isBooking: false });
        });
      }).catch(error => {
        this.setState({ empty: true, isLoading: false, isWorking: false, fontLoaded: true, });
      });
    }
    this.setState({ isLoading: false, isWorking: false, fontLoaded: true, });
  };
  static getDerivedStateFromProps = (props, state) => {
    if (
      props.navigation.getParam("settings", state.settings) != state.settings ||
      props.navigation.getParam("lockTable", state.lockTable) != state.lockTable ||
      props.navigation.getParam("table", state.table) != state.table
    ) {
      console.log("new props", state);

      return {
        settings: props.navigation.getParam("settings", state.settings),
        lockTable: props.navigation.getParam("lockTable", state.lockTable),
        table: props.navigation.getParam("table", state.table)
      };
    }
    console.log("from set", {
      SelectedGroupIndex: props.navigation.getParam(
        "SelectedGroupIndex",
        state.SelectedGroupIndex
      ),
      SelectedChildGroupIndex: props.navigation.getParam(
        "SelectedChildGroupIndex",
        state.SelectedChildGroupIndex
      ),
      SelectedProductIndex: props.navigation.getParam(
        "SelectedProductIndex",
        state.SelectedProductIndex
      )
    });
    if (
      props.navigation.getParam(
        "SelectedGroupIndex",
        state.SelectedGroupIndex
      ) != state.SelectedGroupIndex ||
      props.navigation.getParam(
        "SelectedChildGroupIndex",
        state.SelectedChildGroupIndex
      ) != state.SelectedChildGroupIndex ||
      props.navigation.getParam(
        "SelectedProductIndex",
        state.SelectedProductIndex
      ) != state.SelectedProductIndex
    ) {
      return {
        SelectedGroupIndex: props.navigation.getParam(
          "SelectedGroupIndex",
          state.SelectedGroupIndex
        ),
        SelectedChildGroupIndex: props.navigation.getParam(
          "SelectedChildGroupIndex",
          state.SelectedChildGroupIndex
        ),
        SelectedProductIndex: props.navigation.getParam(
          "SelectedProductIndex",
          state.SelectedProductIndex
        )
      };
    }

    // Return null if the state hasn't changed
    return null;
  };

  _deleteItemCart = async (item, index) => {
    if (index < 0) return;
    let { Cart } = this.state;
    let existed = false;
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        existed = true;
        Cart.Qty = Cart.Qty - item.Qty;
        Cart.Amount = Cart.Amount - (parseFloat(item.UnitPrice) * item.Qty);
        Cart.items.splice(index, 1);
        return existed;
      }
    });
    if (Cart.Qty <= 0) {
      Cart.Qty = 0;
      Cart.Amount = 0;
    }
    this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  }

  IncrementQty = async (item, index) => {
    if (index < 0) return;
    let { Cart, CurrentSet, settings } = this.state;
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
      item.Qty = item && item.Qty > 0 ? item.Qty : 1;
      Cart.items.push(item);
    }
    Cart.Qty++;
    Cart.Amount += parseFloat(item.UnitPrice);
    this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };

  DecreaseQty = (item, index) => {
    if (index < 0) return;
    let { Cart } = this.state;
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

    this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };

  IncrementSetQty = async (item, index, setProduct, setProductIndex) => {
    if (index < 0) return;
    let { Cart, settings } = this.state;
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    if (Config.I_LimitQuntityBooking > 0) {
      if (Cart.Qty >= Config.I_LimitQuntityBooking) {
        Question.alert(
          this.t._("Limited Quantity!"),
          this.t._("Your quantity is limited, Please check in!")
        );
        return;
      }
    }
    setProduct.Details[index].Qty++;
    setProduct.Qty++;
    Cart.Qty++;
    Cart.Amount += parseFloat(item.OrddTotalChoiseAmount);
    this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };

  DecreaseSetQty = (item, index, setProduct, setProductIndex) => {
    if (index < 0) return;
    let { Cart } = this.state;
    Cart.Amount -= parseFloat(setProduct.Details[index].OrddTotalChoiseAmount);
    Cart.Qty--;
    if (item.Qty <= 1) {
      if (setProduct.Details.length == 1) {
        Cart.items.splice(setProductIndex, 1);
        this.setState({ Cart, SelectedProductIndex: -1, SelectedProduct: null });
        return;
      }
      setProduct.Details.splice(index, 1);
    }
    else {
      setProduct.Details[index].Qty--;
    }
    setProduct.Qty--;
    Cart.items[setProductIndex] = setProduct;
    if (isNaN(Cart.Amount) || Cart.Amount < 0) {
      Cart.Amount = 0;
    }
    this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
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
    this.setState({ language: lang });
  };

  _selectGroup = index => {
    this.setState(
      {
        SelectedGroupIndex: index,
        SelectedChildGroupIndex: -1,
        isWorking: true
      },
      () => {
        this._loadChildGroups(index);
      }
    );
  };
  _selectChildGroup = (item, index) => {
    this.setState({ SelectedChildGroupIndex: index, isWorking: true }, () => {
      this._loadProductsByGroup(item);
    });
  };

  _sendOrder = async () => {
    let { table, Cart, OrdPlatform } = this.state;
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
    if (Cart.Qty == 0) {
      return;
    }
    this.setState({ isWorking: true });
    await sendOrder(Config, table, OrdPlatform, Cart.items).then(async res => {
      if (res.Status == 1) {
        await _remove("APP@CART", async () => {
          await this.setState({ Cart: { items: [], Qty: 0, Amount: 0 } }, async () => {
            await getOrderId(table, OrdPlatform).then(async res => {
              table.OrderId = res.Data;
              await _storeData("APP@TABLE", JSON.stringify(table), async () => {
                _storeData('APP@TimeToNextBooking', JSON.stringify(new Date().getTime()), async () => {
                  await this.setState({
                    table: table, isWorking: false,
                    TimeToNextBooking: Config.I_Limit_Booking_Time ? Config.I_Limit_Booking_Time : 5
                  }, async () => {
                    await this.toggleCartWidth(false);
                    this._getInfor();
                  });
                });
              }
              );
            });
          }
          );
        });
      } else {
        await getOrderId(table, OrdPlatform).then(async res => {
          table.OrderId = res.Data;
          await _storeData("APP@TABLE", JSON.stringify(table), async () => {
            await this.setState({ table: table, isWorking: false }, async () => {
              this._getInfor();
            });
          }
          );
        });
      }
    }).catch(error => {
      console.log(error);
      Question.alert(
        this.t._("Notice"),
        this.t._("No connection to the server, please check again!"),
        [
          {
            text: "OK",
            onPress: () => {
              this.setState({ isLoading: false });
            }
          }
        ],
        { cancelable: false }
      );
      this.setState({ isWorking: false, isLoading: false }, async () => {
        await this.toggleCartWidth(false);
        this._getInfor();
      });
    });
  };

  _showQty = item => {
    let { Cart } = this.state;
    let qty = 0;
    Cart.items.forEach(product => {
      if (product.PrdId == item.PrdId) {
        qty = product.Qty;
        return qty;
      }
    });
    return qty;
  };

  _getItemFromCart = item => {
    let { Cart } = this.state;
    let prd = null;
    let ind = -1;
    Cart.items.forEach((product, index) => {
      if (product.PrdId == item.PrdId && product.Qty > 0) {
        prd = product;
        ind = index;
        return prd;
      }
    });

    return { prd, ind };
  };

  _showIsSetQty = item => {
    let { Cart } = this.state;
    let isSetQty1 = 0;
    Cart.itemIsSet.forEach(product => {
      if (product.PrdId == item.PrdId) {
        isSetQty1 = product.isSetQty;
        return isSetQty1;
      }
    });
    return isSetQty1;
  };

  toggleWidth(isShow) {
    const endWidth = !this.state.ShowFullCart
      ? SCREEN_WIDTH * 0.4
      : SCREEN_HEIGHT * 0.11 - 20;
    if (isShow) {
      this.setState({ ShowFullCart: isShow });
    }
    Animated.timing(this.state.CartWidth, {
      toValue: endWidth,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ ShowFullCart: isShow }));
  }
  toggleCartWidth(isShow) {
    const endWidth = !this.state.ShowCartDetail ? SCREEN_WIDTH * 0.75 : 0;
    if (isShow) {
      this.setState({ ShowCartDetail: isShow, isBooking: true });
    }
    Animated.timing(this.state.FullCartWidth, {
      toValue: endWidth,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ ShowCartDetail: isShow }));
  }

  _buy = item => {
    this.setState({ SelectedProduct: null, SelectedProductIndex: -1 }, () =>
      this.toggleCartWidth(true)
    );
  };
  _addExtraRequestToItem = (item) => {
    if (item == null) {
      return;
    }
    var res = this._getItemFromCart(item)
    let state = this.state;
    state.SelectedProductIndex = res.ind;
    _storeData("BOOKINGSCREEN@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('Request', { ReturnScreen: "Booking", Product: res.prd, UpdateDescription: async (item) => this._updateItemDescription(item) });
    });
  };

  _addExtraRequestToSetItemDetail = (item, ind, cartDetailIndex) => {
    if (item == null) {
      return;
    }
    let state = this.state;
    state.Product = item;
    state.selectedItemIndex = ind;
    state.cartDetailIndex = cartDetailIndex;
    _storeData("BOOKINGSCREEN@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('Request', { ReturnScreen: "Booking", Product: item, UpdateDescription: async (item) => this._updateSubItemDetailDescription(item) });
    });
  }

  _updateSubItemDetailDescription = async (Product) => {
    let state = await _retrieveData('BOOKINGSCREEN@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.SelectedProduct.Details[state.cartDetailIndex].subItems[state.selectedItemIndex] = Product;
      state.Cart.items[state.SelectedProductIndex] = state.SelectedProduct;
      _storeData("APP@CART", JSON.stringify(state.Cart));
    }
  }

  _updateItemDetailDescription = async (Product) => {
    let state = await _retrieveData('BOOKINGSCREEN@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.SelectedProduct.Details[state.selectedItemIndex] = Product;
      state.Cart.items[state.SelectedProductIndex] = state.SelectedProduct;
      _storeData("APP@CART", JSON.stringify(state.Cart));
    }
  }

  _updateItemDescription = async (Product) => {
    let state = await _retrieveData('BOOKINGSCREEN@STATE', '');
    if (state != '') {
      state = JSON.parse(state);
      state.Cart.items[state.SelectedProductIndex] = Product;
      _storeData("APP@CART", JSON.stringify(state.Cart));
    }
  }

  _addExtraRequestToSet = (item, ind) => {
    let state = this.state;
    state.selectedItemIndex = ind;
    _storeData("BOOKINGSCREEN@STATE", JSON.stringify(state), async () => {
      this.props.navigation.navigate('Request', { ReturnScreen: "Booking", Product: item, UpdateDescription: async (item) => this._updateItemDetailDescription(item) });
    });
  }

  sendNotice = status => {
    this.setState({ showCall: false, showFilterBell: false, isWorking: false, tableStatus: status });
  };

  ProductSetMenuId = async (item, index) => {
    let { Cart, settings, lockTable } = this.state;
    let Config = await _retrieveData('APP@CONFIG', JSON.stringify({}));
    Config = JSON.parse(Config);
    Config.PosId = settings.PosId;
    Config.I_BusinessType = 1;
    if (Config.I_LimitQuntityBooking > 0) {
      if (Cart.Qty >= Config.I_LimitQuntityBooking) {
        Question.alert(
          this.t._("Limited Quantity!"),
          this.t._("Your quantity is limited, Please check in!")
        );
        return;
      }
    }
    if (Config.I_LimitTypeBooking > 0) {
      if (Cart.items.length >= Config.I_LimitTypeBooking) {
        Question.alert(
          this.t._("Limited Products!"),
          this.t._("Your products number is limited, Please check in!")
        );
        return;
      }
    }
    _storeData("BOOKINGSCREEN@STATE", JSON.stringify(this.state), () => {
      this.props.navigation.navigate("BookingSet", { item, index, lockTable });
    });
  };



  CheckIconSet = async (item, index) => {
    let { iSelectPrd, SelectediPrd, SelectedIndex } = this.state;
    if (item.PrdId == iSelectPrd) {
      iSelectPrd = -1;
      SelectedIndex = -1;
      SelectediPrd = null;
    }
    else {
      iSelectPrd = item.PrdId;
      SelectediPrd = item;
      SelectedIndex = index;
    }
    this.setState({ iSelectPrd, fontLoaded: true, SelectediPrd, SelectedIndex, isWorking: false });
  };


  AcceptSet = async (ite, ind) => {
    let { Cart, settings, CurrentSet, SelectediPrd, SelectedIndex } = this.state;
    if (SelectediPrd == null) {
      this.setState({ SelectedIndex: -1, SelectediPrd: null, SelectedProduct: null, SelectedProductIndex: -1, fontLoaded: true, isWorking: false });
      return;
    }
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
    let existedSet = false;
    CurrentSet.forEach((product, index) => {
      if (product.PrdId != SelectediPrd.PrdId) {
        CurrentSet.splice(index, 1);
        this.setState({ CurrentSet });
      }
    });
    if (!existedSet) {
      CurrentSet.push({
        SmnIsChange: true,
        PrdId: SelectediPrd.PrdId,
        PrdNo: SelectediPrd.PrdNo,
        PrdName: SelectediPrd.PrdName,
        TksdUnitId: SelectediPrd.UnitId,
        chsId: ('chsId' in SelectediPrd) ? SelectediPrd.chsId : null,
        TksdPrice: ('TksdPrice' in SelectediPrd) ? SelectediPrd.TksdPrice : 0,
        OdsdDescription: ('OdsdDescription' in SelectediPrd) ? SelectediPrd.OdsdDescription : '',
        TksdQuantity: SelectediPrd.chsQuantity ? SelectediPrd.chsQuantity : 1,
      });
      if (!('Json' in ite) || ite.Json == '') {
        ite.Json = JSON.stringify(CurrentSet);
      }
      Cart.items.forEach((product, index) => {
        if (product.PrdId == ite.PrdId) {
          if (ite.Qty == 0) {
            Cart.Qty = Cart.Qty - product.Qty;
            Cart.Amount = Cart.Amount - (product.Qty * parseFloat(product.UnitPrice));
            Cart.items.splice(index, 1);
            existed = true;
            return existed;
          }
          else {
            Cart.Qty = Cart.Qty - product.Qty;
            Cart.Amount = Cart.Amount - (product.Qty * parseFloat(product.UnitPrice));
            Cart.items.splice(index, 1);
          }
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
        SelectediPrd.Qty = SelectediPrd && SelectediPrd.Qty > 0 ? SelectediPrd.Qty : 1;
        SelectediPrd.subItems = CurrentSet;
        var Prd = JSON.parse(JSON.stringify(ite));
        Prd.Details = [SelectediPrd];
        Prd.OrddTotalChoiseAmount = ite.UnitPrice * SelectediPrd.Qty;
        // this.IncrementQty(Prd, ind);
        ite.Qty = ite.Qty > 0 ? ite.Qty : 0
        Prd.Qty = ite && ite.Qty > 0 ? ite.Qty : 0;
        if (ite.Qty > 0) {
          Cart.items.push(Prd);
        }
        Cart.Qty = Cart.Qty + ite.Qty;
        Cart.Amount = Cart.Amount + (ite.Qty * parseFloat(ite.UnitPrice));
      }
    }
    this.setState({ Cart, CurrentSet, SelectedProduct: null, SelectedProductIndex: -1, fontLoaded: true, isWorking: false }, () => _storeData("APP@CART", JSON.stringify(Cart)));
  };


  _loadProductsByRollBack = async group => {
    let { table, keysearch, SelectedProduct } = this.state;
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
    GetProductByGroupParent(Config, table, group, keysearch).then(res => {
      if ("Table" in res.Data) {
        let Products = res.Data.Table;
        SelectedProduct = Products[0];
        let ProductImagePrefix = res.Data1;
        this.setState({ SelectedProduct, SelectedProductIndex: 0, Products, ProductImagePrefix, fontLoaded: true, isWorking: false });
      }
    });
  };

  _onRollBack = async (ite, ind, type) => {
    if (type == 1) {
      return this._onRollBackRight(ite, ind);
    }
    return this._onRollBackLeft(ite, ind);
  }

  _onRollBackRight = async (item, index) => {
    let { PrdGroups, SelectedGroupIndex, Products, SelectedProduct, SelectedProductIndex } = this.state;
    let lengthGroup = PrdGroups.length - 1;
    let lengthPrd = Products.length - 1;
    if (lengthPrd == SelectedProductIndex) {
      if (lengthGroup == SelectedGroupIndex && lengthPrd == SelectedProductIndex) {
        this.setState({ fontLoaded: true, isWorking: false, SelectedGroupIndex, SelectedProduct: null, SelectedProductIndex: -1, });
      }
      else {
        SelectedGroupIndex++;
        let groupRollBack = PrdGroups[SelectedGroupIndex];
        this.setState({ fontLoaded: false, isWorking: true, SelectedGroupIndex }, () => {
          this._loadProductsByRollBack(groupRollBack);
        });
      }
    }
    Products.forEach((ite, ind) => {
      if (ite.PrdId == item.PrdId) {
        ind = ind + 1;
        SelectedProduct = Products[ind];
        SelectedProductIndex = ind;
        return;
      }
    });
    this.setState({ SelectedProduct, SelectedProductIndex, showSetInCart: false, }, () => {
      // if (SelectedProduct.PrdIsSetMenu == true) {
      this._loadProductsIsSet(SelectedProduct);
      // }
    });
  }

  _onRollBackLeft = async (item, index) => {
    let { PrdGroups, SelectedGroupIndex, Products, SelectedProduct, SelectedProductIndex } = this.state;
    if (SelectedProductIndex == 0) {
      SelectedGroupIndex--;
      let groupRollBack = PrdGroups[SelectedGroupIndex];
      this.setState({ fontLoaded: false, isWorking: true, SelectedGroupIndex }, () => {
        this._loadProductsByRollBack(groupRollBack);
      });
    }
    Products.forEach((ite, ind) => {
      if (ite.PrdId == item.PrdId) {
        ind = ind - 1;
        SelectedProduct = Products[ind];
        SelectedProductIndex = ind;
        return;
      }
    });
    this.setState({ SelectedProduct, SelectedProductIndex, showSetInCart: false, }, () => {
      // if (SelectedProduct.PrdIsSetMenu == true) {
      this._loadProductsIsSet(SelectedProduct);
      // }
    });
  }

  deleteCartSetItem = async (cartItem, index) => {
    if (index < 0) return;
    Question.alert(
      this.t._("Thông báo"),
      this.t._(
        "Do you really want to delete it?!"
      ),
      [
        { text: t._('BỎ QUA'), onPress: () => { } },
        {
          text: this.t._('OK'),
          onPress: () => {
            let { Cart, SelectedProduct, SelectedProductIndex } = this.state;
            SelectedProduct = Cart.items[SelectedProductIndex];
            Cart.Qty -= SelectedProduct.Details[index].Qty;
            Cart.Amount -= parseFloat(SelectedProduct.Details[index].OrddTotalChoiseAmount) * SelectedProduct.Details[index].Qty;
            if (SelectedProduct.Details.length == 1) {
              Cart.items.splice(SelectedProductIndex, 1);
              SelectedProductIndex = -1;
              SelectedProduct = null;
            }
            else {
              SelectedProduct.Qty -= SelectedProduct.Details[index].Qty;
              SelectedProduct.Details.splice(index, 1);
              Cart.items[SelectedProductIndex] = SelectedProduct;
            }

            if (isNaN(Cart.Amount) || Cart.Amount < 0) {
              Cart.Amount = 0;
            }
            this.setState({ Cart, SelectedProductIndex, SelectedProduct }, () => _storeData("APP@CART", JSON.stringify(Cart)));
          }
        },
      ]
    );
  };

  renderGroupItem = ({ item, index }) => {
    const {
      SelectedGroupIndex,
      PrdChildGroups,
      SelectedChildGroupIndex
    } = this.state;
    if (this.state.PrdGroups[index].PrgId < 0) {
      return null;
    }
    if (index == SelectedGroupIndex) {
      return (
        <View>
          <View
            key={index}
            style={[BookingsStyle.left_menu_Item, styles.left_menu_group, { backgroundColor: "#367AC8" }]}
            onPress={() => { this._selectGroup(index); }}
          >
            <View>
              <Text style={[BookingsStyle.header_label_selected, { textAlign: "left", fontSize: ITEM_FONT_SIZE * 1.3 }]} numberOfLines={2} >
                {item.PrgName}
              </Text>
            </View>
          </View>
          {PrdChildGroups.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.left_menu_group_item, headerleft_menu_Item, { backgroundColor: SelectedChildGroupIndex == index ? colors.orange3 : colors.background }]}
                onPress={() => { this._selectChildGroup(value, index); }}
              >
                <View>
                  <Text style={{ color: SelectedChildGroupIndex == index ? colors.white : colors.white, textAlign: "left", width: SCREEN_WIDTH * 0.2 - 6, fontSize: ITEM_FONT_SIZE }} numberOfLines={2} >
                    {value.PrgName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return (
      <TouchableOpacity
        key={index}
        style={[BookingsStyle.left_menu_Item, styles.left_menu_group, { backgroundColor: colors.background }]}
        onPress={() => { this._selectGroup(index); }}
      >
        <View>
          <Text style={[{ color: "white", textAlign: "left", fontSize: ITEM_FONT_SIZE * 1.3 }]} numberOfLines={2} >
            {item.PrgName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderCartSetDetail = (CartItem, ind) => {
    console.log("cart set item", CartItem);
    console.log('CartItem.subItems', CartItem.subItems);

    return (
      <View style={{ paddingBottom: ITEM_FONT_SIZE }}>
        <View style={{ borderColor: colors.grey5, borderWidth: 1, borderRadius: 4, width: SCREEN_WIDTH / 1.4 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: colors.grey5, height: ITEM_FONT_SIZE * 3 }}>
            <View style={{ position: "absolute", left: ITEM_FONT_SIZE * 1.5, flexDirection: "row" }}>
              <Text style={{ color: colors.primary, textAlign: "center", paddingRight: 5, fontFamily: "RobotoBold", fontSize: ITEM_FONT_SIZE }}>
                {CartItem.PrdName}:
              </Text>
              <Text style={{ color: colors.primary, textAlign: "center", paddingLeft: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>
                {CartItem.PrdSize != null ? (<Text> ({CartItem.PrdSize} {this.t._("person")}) </Text>) : null}
              </Text>
            </View>
            <View style={{ position: "absolute", right: ITEM_FONT_SIZE * 1.5, borderRadius: ITEM_FONT_SIZE }}>
              <Text style={{ color: colors.red, paddingRight: 5, textAlign: "center", fontSize: ITEM_FONT_SIZE }}>
                {"OrddTotalChoiseAmount" in CartItem && CartItem.OrddTotalChoiseAmount != null ? formatCurrency(CartItem.OrddTotalChoiseAmount, "") : "0"}
              </Text>
            </View>
          </View>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={CartItem.subItems}
            extraData={this.state}
            renderItem={({ item, index }) =>
              this.renderCartSubItemOfSet(item, index, ind)
            }
          />
          <View style={{ flexDirection: "row", backgroundColor: colors.grey5, height: ITEM_FONT_SIZE * 3, justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row", position: "absolute", backgroundColor: colors.grey5, left: ITEM_FONT_SIZE * 1.5, }}>
              <View style={{ flexDirection: 'row', paddingLeft: 5, }}>
                {CartItem.itemDescription != null ? <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: ITEM_FONT_SIZE }}>#</Text> : null}
                <FlatList
                  horizontal={true}
                  data={CartItem.itemDescription}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: ITEM_FONT_SIZE }}>{item.MrqDescription}</Text>}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", position: "absolute", backgroundColor: colors.grey5, right: ITEM_FONT_SIZE * 1.5, }} >
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => this.DecreaseSetQty(CartItem, ind, this.state.SelectedProduct, this.state.SelectedProductIndex)}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_View3.png')}
                  style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
              </TouchableOpacity>
              <Text style={{ color: "#af3037", width: ITEM_FONT_SIZE * 3, fontSize: ITEM_FONT_SIZE * 2.2, textAlign: "center", fontFamily: "RobotoBold" }}>
                {CartItem.Qty}
              </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => this.IncrementSetQty(CartItem, ind, this.state.SelectedProduct, this.state.SelectedProductIndex)}>
                <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_View4.png')}
                  style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 2, }} />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{ width: ITEM_FONT_SIZE * 2.5, paddingRight: 5 }}
                onPress={() => this.ProductSetMenuId(CartItem, ind)}
              >
                <Icon
                  name="edit"
                  type="antdesign"
                  containerStyle={{
                    justifyContent: "center"
                  }}
                  iconStyle={{
                    fontSize: ITEM_FONT_SIZE * 1.5,
                    color: colors.yellow1,
                    fontFamily: "RobotoBold"
                  }}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{ width: ITEM_FONT_SIZE * 2.5 }}
                onPress={() => this.deleteCartSetItem(CartItem, ind)}
              >
                <Icon
                  name="close"
                  type="antdesign"
                  containerStyle={{ justifyContent: "center" }}
                  size={ITEM_FONT_SIZE * 2.5}
                  iconStyle={{ color: colors.red, fontFamily: "RobotoBold" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _changeQty = (cartItem, cartIndex, type) => {
    if (type == 1) {
      return this.IncrementQty(cartItem, cartIndex);
    }
    return this.DecreaseQty(cartItem, cartIndex);
  }

  renderCartSubItemOfSet = (item, index, cartDetailIndex) => {
    return (
      <View style={{ paddingVertical: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderRadius: 1, borderColor: colors.grey4 }}>
        <View style={{ flexDirection: "row", left: ITEM_FONT_SIZE * 1.5 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#000000", paddingLeft: 5, paddingRight: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>
              {item.TksdQuantity}
            </Text>
            <Text style={{ color: "#000000", paddingLeft: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>
              {item.PrdName}
            </Text>
            <View style={{ flexDirection: 'row', paddingLeft: 5, }}>
              {item.itemDescription != null ? <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>#</Text> : null}
              <FlatList
                horizontal={true}
                data={item.itemDescription}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <Text style={{ color: '#2285BE', paddingLeft: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>{item.MrqDescription}</Text>}
              />
            </View>
          </View>
          <View style={{ position: "absolute", right: ITEM_FONT_SIZE * 3, flexDirection: "row" }}>
            <Text style={{ color: "#000000", paddingRight: 5, fontSize: ITEM_FONT_SIZE * 0.8 }}>
              {item.TksdPrice > 0 ? (<Text>+{formatCurrency(item.TksdPrice, "")}</Text>) : null}{" "}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderProductModal = (item, index) => {
    let { PrdSetData, iSelectPrd, CurrentSet } = this.state;
    if (item == null) {
      return null;
    }
    let res = this._getItemFromCart(item);
    if (!this.state.showSetInCart) {
      return (
        <ProductDetails
          itemPrd={item}
          endpoint={this.state.ProductImagePrefix == '' ? this.state.endpoint + '/Resources/Images/Product/' : this.state.ProductImagePrefix}
          indexPrd={index}
          cart={res}
          t={this.t}
          iSelectPrd={iSelectPrd}
          CurrentSet={CurrentSet}
          CheckIconSet={(item, index) => this.CheckIconSet(item, index)}
          AcceptSet={(item, index) => this.AcceptSet(item, index)}
          PrdSetData={PrdSetData != null ? PrdSetData : []}
          onRollBack={(item, index, type) => this._onRollBack(item, index, type)}
          ProductSetMenuId={this.ProductSetMenuId}
          onChangeQty={(item, index, type) => this._changeQty(item, index, type)}
          setState={(state) => this.setState(state)}
          BookingsStyle={BookingsStyle}
        />
      );
    }
    else {
      return null;
    }
  };

  renderProduct = ({ item, index }) => {
    let { Cart, showtextInput } = this.state;
    let res = this._getItemFromCart(item);
    console.log('Render Product',
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
    );
    let cartItem = res.prd, cartIndex = res.ind;
    return (
      <TouchableHighlight style={[BookingsStyle.table_image, {
        borderBottomWidth: 1, borderLeftWidth: 1, borderTopWidth: 1, borderColor: colors.grey5,
        width: SCREEN_WIDTH * 0.41,
      }]}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%", height: '100%' }}>
          <View style={{ backgroundColor: "grey", width: "60%", height: '100%' }}>
            <TouchableOpacity style={{ flexDirection: "row", width: '100%', height: '100%' }}
              onPress={() => {
                if (item.PrdIsSetMenu == true) {
                  console.log('item.PrdId', item.PrdId);
                  if (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) {
                    this._loadProductsIsSet(item);
                    if (cartItem != null) {
                      item.Qty = cartItem && cartItem.Qty > 0 ? cartItem.Qty : (item.Qty ? item.Qty : 0);
                      this.setState({
                        showSetInCart: false, CurrentSet: [],
                        SelectedIndex: -1, SelectediPrd: null,
                        SelectedProduct: item, SelectedProductIndex: index
                      });
                    }
                    else {
                      item.Qty = item.Qty ? item.Qty : 0;
                      this.setState({
                        showSetInCart: false, CurrentSet: [],
                        iSelectPrd: -1, SelectedIndex: -1, SelectediPrd: null,
                        SelectedProduct: item, SelectedProductIndex: index
                      });
                    }
                  }
                  else {
                    this.ProductSetMenuId(item, index);
                  }
                }
                else {
                  this.setState({
                    showSetInCart: false, CurrentSet: [],
                    iSelectPrd: -1, SelectedIndex: -1, SelectediPrd: null,
                    SelectedProduct: item, SelectedProductIndex: index
                  });
                }
              }}>
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
            </TouchableOpacity>
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
                  {this.t._("Giá")}:{" "}
                  <Text style={{ fontFamily: "RobotoItalic" }}>
                    {formatCurrency(item.UnitPrice, "")}
                  </Text>
                </Text>
              </View>
            </View>
            {item.PrdIsSetMenu == true ? (
              <View style={{
                position: "absolute", bottom: 0, right: 0, width: "100%",
                height: ITEM_FONT_SIZE * 1.8, flexDirection: "row"
              }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'space-evenly',
                    width: "100%",
                    height: ITEM_FONT_SIZE * 1.6
                  }}>
                  {cartItem != null ?
                    <View style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }}>
                      {item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2 ?
                        <View></View>
                        :
                        <TouchableOpacity onPress={() => {
                          this.setState({ showSetInCart: true, SelectedProduct: cartItem, SelectedProductIndex: cartIndex })
                        }}>
                          <Icon
                            name="edit"
                            type="antdesign"
                            containerStyle={{ justifyContent: "center" }}
                            size={ITEM_FONT_SIZE * 1.4}
                            iconStyle={{ color: colors.yellow1, fontFamily: "RobotoBold" }}
                          />
                        </TouchableOpacity>
                      }
                    </View>
                    :
                    <View style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }}></View>}
                  <View style={{ height: ITEM_FONT_SIZE * 1.6, justifyContent: 'center' }}>
                    <Text
                      style={{
                        color: "#af3037",
                        width: 'auto',
                        fontSize: ITEM_FONT_SIZE * 0.8,
                        textAlign: "center",
                        fontFamily: "RobotoBold"
                      }}>
                      {cartItem != null ? cartItem.Qty : 0}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => this.setState(() => {
                    if (item.PrdViewSetMenuType && item.PrdViewSetMenuType == 2) {
                      this._loadProductsIsSet(item);
                      if (cartItem != null) {
                        item.Qty = cartItem && cartItem.Qty > 0 ? cartItem.Qty : (item.Qty ? item.Qty : 0);
                        this.setState({
                          showSetInCart: false, CurrentSet: [],
                          SelectedIndex: -1, SelectediPrd: null,
                          SelectedProduct: item, SelectedProductIndex: index
                        });
                      }
                      else {
                        item.Qty = item.Qty ? item.Qty : 0;
                        this.setState({
                          showSetInCart: false, CurrentSet: [],
                          iSelectPrd: -1, SelectedIndex: -1, SelectediPrd: null,
                          SelectedProduct: item, SelectedProductIndex: index
                        });
                      }
                    }
                    else {
                      this.ProductSetMenuId(item, index);
                    }
                  })}>
                    <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/IconTangSL-10.png')}
                      style={{ width: ITEM_FONT_SIZE * 1.6, height: ITEM_FONT_SIZE * 1.6, }} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: ITEM_FONT_SIZE * 1.8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'space-evenly',
                    width: "100%",
                    height: ITEM_FONT_SIZE * 1.6
                  }}
                >
                  {this._showQty(item) > 0 ?
                    <TouchableOpacity onPress={() => this.DecreaseQty(item, index)} >
                      <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/IconGiamSL-10.png')}
                        style={{ width: ITEM_FONT_SIZE * 1.6, height: ITEM_FONT_SIZE * 1.6, }} />
                    </TouchableOpacity>
                    :
                    <View style={{
                      width: ITEM_FONT_SIZE * 1.6, height: ITEM_FONT_SIZE * 1.6,
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      {/* <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_btnGiamGrey.png')}
                          style={{ width: ITEM_FONT_SIZE * 2, height: ITEM_FONT_SIZE * 1.6, }} /> */}
                    </View>
                  }
                  <View style={{ height: ITEM_FONT_SIZE * 1.6, justifyContent: 'center' }}>
                    {/* {!showtextInput ? */}
                      <TextInput
                        ref={input => this.textInput = input}
                        style={{
                          color: "#af3037",
                          width: 'auto',
                          fontSize: ITEM_FONT_SIZE * 0.8,
                          textAlign: "center",
                          fontFamily: "RobotoBold",
                        }}
                        autoFocus={false}
                        autoCapitalize="none"
                        keyboardAppearance="dark"
                        keyboardType="numeric"
                        returnKeyType='default'
                        blurOnSubmit={false}
                        onBlur={() => { this.setState({ Cart }); }}
                        value={item.Qty ? item.Qty.toString() : '0'}
                        onChangeText={(textInput) => {
                          item.Qty = textInput;
                        }}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          let existed = false;
                          Cart.items.forEach(product => {
                            if (product.PrdId == item.PrdId) {
                              existed = true;
                              if (item.Qty <= 0) {
                                state.Cart.items.splice(index, 1);
                              }
                              return existed;
                            }
                          });
                          if (!existed) {
                            item.Qty = item && item.Qty > 0 ? item.Qty : 1;
                            Cart.items.push(item);
                          }
                          Cart.Qty = 0;
                          Cart.Amount = 0;
                          Cart.items.forEach(product => {
                            Cart.Qty = parseFloat(Cart.Qty) + parseFloat(product.Qty);
                            Cart.Amount = Cart.Amount + (parseFloat(product.UnitPrice) * product.Qty);
                          });
                          this.setState({ Cart }, () => _storeData("APP@CART", JSON.stringify(Cart)));
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {/* :
                      null} */}
                    {/* {showtextInput ?
                      <TouchableOpacity onPress={() => {
                        this.setState({ showtextInput: false });
                      }}>
                        <Text
                          style={{
                            color: "#af3037",
                            width: 'auto',
                            fontSize: ITEM_FONT_SIZE * 0.8,
                            textAlign: "center",
                            fontFamily: "RobotoBold"
                          }}
                        >
                          {item.Qty ? item.Qty : 0}
                        </Text>
                      </TouchableOpacity>
                      : null} */}
                  </View>
                  <TouchableOpacity style={{}} onPress={() => this.IncrementQty(item, index)}>
                    <Image resizeMode="stretch" source={require('../../assets/icons/iconNew/IconTangSL-10.png')}
                      style={{ width: ITEM_FONT_SIZE * 1.6, height: ITEM_FONT_SIZE * 1.6, }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  render() {
    const {
      PrdGroups,
      Products,
      PrdChildGroups,
      SelectedChildGroupIndex,
      SelectedProduct,
      SelectedProductIndex,
      showFilterBell,
      showCall,
      ShowFeesInfo,
      ShowTotalInfo,
      isLoading,
      Cart,
      table,
      endpoint,
      SelectedGroupIndex,
      Config,
      lockTable,
      Ticket } = this.state;
    if (!this.state.fontLoaded) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            onLayout={() => {
              this.setState({ fontLoaded: false });
            }}
          />
        </View>
      );
    }
    console.log('SelectedProduct', SelectedProduct, SelectedProductIndex);

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {/* <View style={{ height:SCREEN_HEIGHT*0.085,}}></View> */}

        <View style={styles.Container}>
          <View style={[styles.mainContainer1, { backgroundColor: "#333D4C", }]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: SCREEN_WIDTH * 0.18, }}>
              <Image resizeMode="stretch" source={require('../../assets/icons/relipos_logo_1024_bg_white1.png')}
                style={{ width: "100%", height: "100%", }} />
            </View>
            <_PrdGroup
              state={this.state}
              t={this.t}
              PrdGroups={PrdGroups}
              SelectedGroupIndex={SelectedGroupIndex}
              _selectGroup={(index) => this._selectGroup(index)}
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH * 0.002, backgroundColor: '#FFFFFF' }}></View>
          <View style={styles.mainContainer2}>
            <_HeaderNew
              state={this.state}
              table={this.state.table}
              onPressBack={() => { this.onPressBack(); }}
              _searchProduct={(val) => this._searchProduct(val)}
              t={this.t}
              name={'Booking'}
              lockTable={lockTable}
              language={this.state.language}
              setState={(state) => this.setState(state)}
              BookingsStyle={BookingsStyle}
            />
            <View style={{ width: "100%" }}>
              <FlatList
                data={Products}
                numColumns={2}
                extraData={this.state}
                renderItem={this.renderProduct}
                contentContainerStyle={{ paddingBottom: SCREEN_HEIGHT * 0.08 }}
              />
            </View>
          </View>
        </View>

        {!this.state.ShowCartDetail ? (
          <Animated.View style={[styles.navigationBar, { width: this.state.CartWidth }]}>
            {this.state.ShowFullCart ? (
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={[{
                  flexDirection: "row",
                  backgroundColor: "#333D4C",
                  justifyContent: "center",
                  alignItems: "center",
                  width: SCREEN_WIDTH * 0.4,
                }]}>
                  <View style={{ width: SCREEN_WIDTH * 0.4, justifyContent: 'center', alignItems: 'center' }}>
                    <Image resizeMode="contain" style={{ width: SCREEN_WIDTH * 0.35, maxWidth: 442 }}
                      source={require('../../assets/icons/iconNew/PhatTrien2-10.png')} ></Image>
                  </View>
                </View>

                <View style={[BookingsStyle.bottombar, styles.item_menu_order, { width: SCREEN_WIDTH * 0.21, flexDirection: "row" }]}>
                  <View style={{ position: 'absolute', left: 10, paddingTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_TongTien.png')}
                      style={{ width: ITEM_FONT_SIZE * 1.3, height: ITEM_FONT_SIZE * 1.3, }} />
                  </View>
                  <Text style={[{ fontSize: ITEM_FONT_SIZE, fontFamily: "RobotoBold", color: '#FFFFFF', paddingLeft: 10 }]}>
                    {formatCurrency(Cart.Amount, "")}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.toggleCartWidth(true)}>
                  <View style={[BookingsStyle.bottombar, {
                    width: SCREEN_WIDTH * 0.21, flexDirection: "row", color: "white",
                    alignItems: "center", justifyContent: "center", backgroundColor: "#0D66CE"
                  }]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Image resizeMode="stretch" source={require('../../assets/icons/v2/icon_GioHang.png')}
                        style={{ width: ITEM_FONT_SIZE * 1.3, height: ITEM_FONT_SIZE * 1.3, }} />
                    </View>
                    <Text style={[{ color: "white", fontSize: ITEM_FONT_SIZE, fontFamily: "RobotoBold", paddingLeft: 10 }]}>
                      {this.t._("Giỏ hàng")}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.toggleWidth(true)}
                style={[BookingsStyle.bottombar, { backgroundColor: "#29ade3", width: SCREEN_HEIGHT * 0.08 }]}>
                <Icon
                  name="cart-outline"
                  type="material-community"
                  containerStyle={[BookingsStyle.bottombar, { paddingLeft: SCREEN_HEIGHT * 0.005, justifyContent: "center" }]}
                  iconStyle={{ fontSize: ITEM_FONT_SIZE * 2, color: "white" }}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          <_Cart
            state={this.state}
            toggleCartWidth={(val) => this.toggleCartWidth(val)}
            t={this.t}
            deleteItemCart={(item, index) => { this._deleteItemCart(item, index) }}
            onChangeQty={(item, index, type) => this._changeQty(item, index, type)}
            setState={(state) => this.setState(state)}
            settings={Config}
            BookingsStyle={BookingsStyle}
            onGetInfor={() => this._getInfor()}
            onSendOrder={() => this._sendOrder()}
          />
        )}
        {this.renderProductModal(SelectedProduct, SelectedProductIndex)}
        {showFilterBell ? (<_BellOptions
          table={this.state.table}
          BookingsStyle={BookingsStyle}
          settings={Config}
          endpoint={this.state.endpoint}
          language={this.state.language}
          changeLanguage={(lang) => this.changeLanguage(lang)}
          sendNotice={(status) => this.sendNotice(status)}
          setState={(state) => this.setState(state)}
          t={this.t}
          tableStatus={this.state.tableStatus}
        />
        ) : null}
        {showCall ? (<_CallOptions
          table={this.state.table}
          BookingsStyle={BookingsStyle}
          settings={Config}
          endpoint={this.state.endpoint}
          call={this.state.call}
          setState={(state) => this.setState(state)}
          t={this.t}
          tableStatus={this.state.tableStatus}
        />
        ) : null}
        {ShowFeesInfo ? (<_Infor
          table={this.state.table}
          BookingsStyle={BookingsStyle}
          settings={Config}
          endpoint={this.state.endpoint}
          language={this.state.language}
          changeLanguage={(lang) => this.changeLanguage(lang)}
          sendNotice={(status) => this.sendNotice(status)}
          setState={(state) => this.setState(state)}
          t={this.t}
          tableStatus={this.state.tableStatus}
        />
        ) : null}
        {ShowTotalInfo ? (<_TotalInfor
          table={this.state.table}
          BookingsStyle={BookingsStyle}
          settings={Config}
          endpoint={this.state.endpoint}
          language={this.state.language}
          changeLanguage={(lang) => this.changeLanguage(lang)}
          sendNotice={(status) => this.sendNotice(status)}
          setState={(state) => this.setState(state)}
          t={this.t}
          tableStatus={this.state.tableStatus}
        />
        ) : null}
        {SelectedProduct != undefined &&
          SelectedProduct != null &&
          SelectedProductIndex >= 0 &&
          SelectedProduct.PrdIsSetMenu &&
          this.state.showSetInCart
          ? (
            <View
              style={{
                backgroundColor: "rgba(98,98,98,0.6)",
                position: "absolute",
                width: SCREEN_WIDTH,
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}
            >
              <View
                style={[{
                  position: "absolute",
                  top: 6,
                  borderColor: "black",
                  backgroundColor: colors.white,
                  borderWidth: 2,
                  borderRadius: 6,
                  width: SCREEN_WIDTH / 1.2
                }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    backgroundColor: "#008bc5",
                    height: BUTTON_FONT_SIZE * 2.5
                  }}
                >
                  <Text style={{ height: ITEM_FONT_SIZE * 2, fontSize: ITEM_FONT_SIZE * 1.6, color: colors.white, textAlign: "center" }}>
                    {this.t._("Food details")}
                  </Text>
                  <View style={{ position: "absolute", right: ITEM_FONT_SIZE * 3, borderRadius: ITEM_FONT_SIZE }}>
                    <TouchableOpacity style={{ width: ITEM_FONT_SIZE * 1.5, height: ITEM_FONT_SIZE * 1.5 }}
                      onPress={() =>
                        this.setState({
                          showSetInCart: false,
                          SelectedProduct: null,
                          SelectedProductIndex: -1
                        })
                      }
                    >
                      <Icon
                        name="close"
                        type="antdesign"
                        containerStyle={{ borderRadius: ITEM_FONT_SIZE, width: ITEM_FONT_SIZE * 2.4, height: ITEM_FONT_SIZE * 1.5 }}
                        iconStyle={{ color: "white", fontWeight: "bold", fontSize: ITEM_FONT_SIZE * 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    height: SCREEN_HEIGHT / 1.23,
                    backgroundColor: colors.white,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: ITEM_FONT_SIZE,
                    paddingBottom: ITEM_FONT_SIZE
                  }}
                >
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={Cart.items[SelectedProductIndex].Details}
                    extraData={this.state}
                    renderItem={({ item, index }) =>
                      this.renderCartSetDetail(item, index)
                    }
                  />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: ITEM_FONT_SIZE }}>
                  <View style={{ justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        width: SCREEN_WIDTH / 6,
                        borderWidth: 1,
                        borderColor: "#0176cd",
                        backgroundColor: "#008bc5"
                      }}
                      onPress={() => this.setState({ showSetInCart: false, SelectedProduct: null, SelectedProductIndex: -1, })}
                    >
                      <Text style={{ textAlign: "center", padding: 5, color: colors.white, fontSize: ITEM_FONT_SIZE }}>
                        {this.t._("Accept")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: 10 }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        width: SCREEN_WIDTH / 6,
                        borderWidth: 1,
                        borderColor: "#0176cd",
                        backgroundColor: "#008bc5"
                      }}
                      onPress={() => this.ProductSetMenuId(SelectedProduct, SelectedProductIndex)}
                    >
                      <Text style={{ textAlign: "center", padding: 5, color: colors.white, fontSize: ITEM_FONT_SIZE }}>
                        {this.t._("Choose add")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
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
  container1: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    justifyContent: "space-around",
    padding: 10
  },
  container: {
    backgroundColor: "#E3E3E3",
    // alignItems: 'center',
    justifyContent: "space-around",
    height: SCREEN_HEIGHT,
    flex: 1
  },
  navigationBar: {
    height: SCREEN_HEIGHT * 0.07,
    width: SCREEN_WIDTH * 0.818,
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    right: 0,
    paddingTop: 5,
    paddingLeft: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  Container: {
    backgroundColor: "#E3E3E3",
    flexDirection: "row",
    height: "87%",
    width: "100%"
  },
  mainContainer1: {
    flexDirection: "column",
    height: "94%",
    width: SCREEN_WIDTH * 0.18
  },
  mainContainer2: {
    backgroundColor: "#E3E3E3",
    flexDirection: "column",
    height: "88%",
    width: SCREEN_WIDTH * 0.82
  },
  item_Table: {
    color: "#c00003",
    maxHeight: SCREEN_HEIGHT * 0.16
  },
  left_menu_group: {
    paddingLeft: 12,
    height: ITEM_FONT_SIZE * 3.5,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center",
    backgroundColor: "#234f6c"
  },
  left_menu_group_item: {
    paddingLeft: 12,
    color: colors.grey2
  },
  left_menu_group_item: {
    borderColor: colors.grey3,
    borderRadius: 1,
    justifyContent: "center",
    color: colors.grey2,
    paddingLeft: 16,
    height: ITEM_FONT_SIZE * 3
  },
  item_Search: {
    width: "90%",
    fontSize: ITEM_FONT_SIZE,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: colors.white,
    maxHeight: 50
  },
  item_language: {
    flexDirection: "row"
  },
  item_menu_order: {
    paddingTop: SCREEN_HEIGHT * 0.045 - ITEM_FONT_SIZE - 5,
    fontSize: ITEM_FONT_SIZE * 1.3,
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    backgroundColor: "#CC6300",
    justifyContent: "center",
    alignItems: "center"
  },
  item_menu_cart: {
    fontFamily: "RobotoBold",
    textAlign: "center",
    color: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#0176cd"
  },
  buttontext: {
    alignItems: "center",
    fontSize: BUTTON_FONT_SIZE / 1.2
  },
  button_order: {
    color: colors.grey1,
    fontSize: BUTTON_FONT_SIZE,
    fontFamily: "RobotoBold"
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
