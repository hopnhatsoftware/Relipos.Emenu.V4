
import { _retrieveData, _storeData, _clearData } from './storages';
import { execFetch,execFetch_NoAuthor, fetchFile, execFormData } from './services';



//CheckCasherIn: Kiểm tra quây vào ca chưa
export const CheckCasherIn = async (Config) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/MainView/CheckCasherIn';
  return await execFetch(URL, 'GET', {
    CoutId: Config.I_Counter,
    BranchId:Config.I_BranchId,
  });
}


export const ListArea = async (Config) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Area/Filter';
  return await execFetch(URL, 'GET', {
    listOrgId: Config.I_BranchId,
    BustId: Config.I_BusinessType ? Config.I_BusinessType : 1, CoutId: Config.I_Counter, Culture: culture,
  });
}

export const ListTables = async (settings, AreaId, Status) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/getTable';
  return await execFetch(URL, 'GET', {
    lstOrgId: settings.I_BranchId,
    BustId: settings.I_BusinessType ? settings.I_BusinessType : 1, AreId: AreaId, Status: Status, CounterId: settings.I_Counter
  });
}

export const CancelOrder = async (OrderId) => { 
  const URL = '/OrderView/CancelOrder';
   return await execFetch(URL, 'GET', { OrderId:OrderId });
}
export const CheckAndGetOrder = async (item, OrdPlatform) => { //////////////////////// dư tham số: OrdPlatform
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/CheckAndGetOrder';
  return await execFetch(URL, 'GET', { TicketId: item.TicketID, Culture: culture, OrdPlatform: OrdPlatform });
}

export const GetViewGroup = async (Config, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/GetViewGroup';
  return await execFetch(URL, 'GET', {
    TicketID: item.TicketID, PosID: Config.PosId ? Config.PosId : 1, AreaID: item.AreaID,
    Culture: culture, BranchId: Config.I_BranchId, BustId: Config.I_BusinessType ? Config.I_BusinessType : 1,
    PrgLevel: Config.I_ItemGroupLevel
  });
}
export const getLanguage = async ( IsActive) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Global/getAllCulture';
  return await execFetch_NoAuthor(URL, 'GET', {
    IsActive:IsActive
  });
}
export const getMasterData = async ( TicketId,Config, I_Currency) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/PaymentView/getMasterData';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, I_Currency: I_Currency,
    Culture: culture, BranchId: Config.I_BranchId,
  });
}
export const getPaymentAmount = async ( TicketId, I_Currency) => {
  const URL = '/PaymentView/getPaymentAmount';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, I_Currency: I_Currency,
  });
}
export const getLinkQrBank = async ( TicketId, BillContent) => {
  const URL = '/Ticket/getLinkQrBank';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, BillContent: BillContent,
  });
}
export const getQrCode = async ( TicketId, QRType) => {
  const URL = '/Ticket/getQrCode';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId,QRType:QRType
  });
}
export const getinvoiceInfor = async (ReiId, TicketId, ReiIsEInvoice) => {
  const URL = '/Ticket/getInvoiceInfor';
  return await execFetch(URL, 'GET', {
    ReiId:ReiId, TicketId: TicketId,ReiIsEInvoice:ReiIsEInvoice
  });
}
export const SearchTaxInfor = async ( TaxCode) => {
  const URL = '/PaymentView/SearchTaxInfor';
  return await execFetch(URL, 'GET', {
    TaxCode: TaxCode
  });
}
export const FlushInvoiceInfor = async ( TicketId, TaxCode, CustomerName, Company, Address, Email, Phone ) => {
  const URL = '/Ticket/FlushInvoiceInfor';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, TaxCode: TaxCode==null? '':TaxCode, CustomerName: CustomerName==null? '':CustomerName, Company: Company==null? '':Company, Address: Address==null? '':Address, Email: Email==null? '':Email, Phone: Phone==null? '':Phone
  });
}
export const HandleTip = async ( TicketId, TkTipAmount,IsInvoiceTip) => {
  const URL = '/Ticket/HandleTip';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, TkTipAmount: TkTipAmount, IsInvoiceTip: IsInvoiceTip
  });
}
export const ApplyVoucher = async ( TicketId, settings,VoucherCode) => {
  const URL = '/Crm/ApplyVoucher';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId, BustId: settings.I_BusinessType ? settings.I_BusinessType : 1,VoucherCode:VoucherCode
  });
}
export const ApplyVipCard = async ( TicketId, Vipcode) => {
  const URL = '/Crm/ApplyVipCard';
  return await execFetch(URL, 'GET', {
    TicketId: TicketId,Vipcode:Vipcode
  });
}
export const getVipCardInfor = async ( Vipcode) => {
  const URL = '/Crm/getVipCardInfor';
  return await execFetch(URL, 'GET', {
    Vipcode:Vipcode
  });
}
export const SearchTaxCode = async (TaxCode) => {
  const endpoint = _retrieveData('APP@BACKEND_ENDPOINT2', JSON.stringify(endpoint));
  JSON.parse(endpoint)
  return await execSearchTaxCode(endpoint, 'GET', { TaxCode: TaxCode });
}
export const GetPrdChildGroups = async (settings, item, group) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/LoadGroupChild';
  return await execFetch(URL, 'GET', {
    TicketID: item.TicketID, AreaId: item.AreaID, ParentId: group.PrgId, CurrencyId: settings.I_Currency, BustId: settings.I_BusinessType ? settings.I_BusinessType : 1,
    BranchId: settings.I_BranchId, PrgPath: group.PrgPath == null ? '' : group.PrgPath,
    PrgLevel: group.PrgLevel == null ? 0 : group.PrgLevel, Culture: culture
  });
}
export const getProductByGroup = async (Config,settings, TicketID,AreaID, PrgId, KeySearch) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Product/Emenu_getProductByGroup';
  
  return await execFetch(URL, 'GET', {
    BustId: Config.I_BusinessType ? Config.I_BusinessType : 1 , 
    TicketID: TicketID, 
    PrdId: -1, 
    KeySearch: KeySearch, 
    PrgId: PrgId, 
    AreaId: AreaID,
    BranchId: Config.I_BranchId, 
    PosId: settings.PosId ,
     Culture: culture
  });
}
export const loadOrderInformation = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/getOrderInformation';
  return await execFetch(URL, 'GET', {
    OrderId: item.OrderId, TicketID: item.TicketID, PosId: settings.PosId ? settings.PosId : 1,
    BranchId: settings.I_BranchId, Culture: culture
  });
}

export const sendOrder = async (settings, table, OrdPlatform, details) => {
 try{
  const culture = await _retrieveData('culture', 1);
  let OrderDetails = [];
  details.forEach((product, index) => {
    if (typeof product.Json == 'undefined') 
      product.Json = '';
    if (typeof product.subItems == 'undefined') 
    product.Json = JSON.stringify(product.subItems);
    if (typeof product.OrddDescription == 'undefined' || product.OrddDescription==null) 
    product.OrddDescription = '';
    OrderDetails.push({
      ...product,
      OrddVatPercent: typeof product.PrdVatPercent != 'undefined' && product.PrdVatPercent ? product.PrdVatPercent : 0 ,
      OrddQuantity: product.OrddQuantity,
      OrddPrice: product.UnitPrice,
      UomId: product.UnitId
    });
    //console.log("product"+JSON.stringify(product));
    
  });
  //console.log("OrderDetails"+JSON.stringify(OrderDetails))
  let ParramOrders = {
    OrdId: table.OrderId,
    TicketID: table.TicketID,
    PosId: settings.PosId ? settings.PosId : 1,
    BranchId: settings.I_BranchId,
    Culture: culture,
    BustId: 1,
    CurId: settings.I_Currency,
    OrdPlatform: OrdPlatform,  
    OrderDetails:OrderDetails
  }
  console.log("ParramOrders"+JSON.stringify(ParramOrders))
  //const URL = '/Emenu/Post'; Hàm cũ
  const URL = '/OrderDetail/Post';
  //console.warn('Data', ParramOrders);
  //console.warn('URL', URL);
  return await execFetch(URL, 'POST', ParramOrders);
}catch(ex)
{
  console.log("sendOrder Error"+ex);
   
}
}

export const UploadFile = async (file) => {
  const URL = '/Emenu/UploadFile';
  return await fetchFile(URL, file);
}

export const getTicketInfor = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/getTicketInfor';
  return await execFetch(URL, 'POST', {
    BranchId: settings.I_BranchId, TabId: item.TabId, TicketId: item.TicketID,
    PosId: settings.PosId ? settings.PosId : 1, Culture: culture, IsGroupView: 1
  });
}
export const getTicketInforOnTable = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/getTicketInforOnTable';
  return await execFetch(URL, 'GET', {
    TicketID: item.TicketID, BranchId: settings.I_BranchId,  Culture: culture,
    PosId: settings.PosId ? settings.PosId : 1, isGroup: 1
  });
}
export const UpdateStatus_TicketDetail = async (item, TkdStatus, table,) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/UpdateStatus_TicketDetail';
  return await execFetch(URL, 'GET', {
    TkdId:item.TkdId,
    TicketID: table.TicketID,
    TkdStatus: TkdStatus,
    PrdId: item.PrdId,
    TkdUnitId: item.TkdUnitId,
    PrdNo: item.PrdNo,
    PrdName: item.PrdName,
    TksdId: null,
    AtdId: null,
  });
}

//SetMenu
export const LoadChoiceByProduct = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/LoadChoiceByProduct';
  return await execFetch(URL, 'GET', {
    PrdId: 0, chsId: item.chsId, BranchId: settings.I_BranchId,
    Culture: culture, PosId: settings.PosId ? settings.PosId : 1, TkdBasePrice: item.TkdBasePrice
  });
}

export const SetMenu_gettemDefault = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/SetMenu_gettemDefault';
  return await execFetch(URL, 'GET', { PrdId: item.PrdId, BranchId: settings.I_BranchId, Culture: culture, TkdBasePrice: item.TkdBasePrice });
}

export const getByChoiceId = async (chsId, settings, item, KeySearch) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Product/getByChoiceId';
  return await execFetch(URL, 'GET', {
    chsId, BranchId: settings.I_BranchId, Culture: culture, PosId: settings.PosId ? settings.PosId : 1,
    TkdBasePrice: item.TkdBasePrice, KeySearch: KeySearch,
  });
}
/**
 * Gọi dịch vụ 
 * @param {*} OrgId : Mã chi nhánh
 * @param {*} TabId : mã bàn
 * @param {*} TicketId :mã phiếu
 * @param {*} AppType : loại 
 * @param {*} ObjCreateBy : người Thực hiện
 * @returns : true
 */
export const CallServices = async (OrgId,TabId,TicketId,AppType,ObjCreateBy) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/TableView/CallServices';
  return await execFetch(URL, 'GET', {OrgId,TabId,TicketId,AppType,ObjCreateBy,Culture:culture });
}
export const SetMenu_getChoiceCategory = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/SetMenu_getChoiceCategory';
  return await execFetch(URL, 'GET', { PrdId: item.PrdId, BranchId: settings.I_BranchId, Culture: culture });
}
export const SetMenu_getExtraRequestFromProductId = async (PrdId) => {
  const URL = '/Emenu/SetMenu_getExtraRequestFromProductId';
  return await execFetch(URL, 'GET', { PrdId });
}

export const SetMenu_getAllInfor = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/SetMenu_getAllInfor';
  return await execFetch(URL, 'GET', {
    PrdId: item.PrdId, BranchId: settings.I_BranchId, Culture: culture,
    PrdName: item.PrdName, UnitName: item.UnitName, UnitId: item.UnitId, TkdBasePrice: item.TkdBasePrice
  });
}

export const Object_Search = async (ObjType, KeySearch, OgId, isGetOrg) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Object/Filter';
  return await execFetch(URL, 'GET', { ObjType: ObjType, KeySearch: KeySearch, OgId: OgId, isGetOrg: isGetOrg });
}

export const Ticket_getById = async (TicketID) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/getById';
  return await execFetch(URL, 'GET', { TicketID: TicketID });
}
export const getFromTicketInfor = async (TicketID) => {
  const URL = '/CheckOrderView/getFromTicketInfor';
  return await execFetch(URL, 'GET', { TicketID:TicketID});
  
}
export const CheckProductManyPrice = async (PrdId,ReaId,BusinessType) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/OrderView/CheckProductManyPrice';
  return await execFetch(URL, 'GET', { PrdId: PrdId, ReaId:ReaId,BusinessType:BusinessType,Culture:culture});
}

export const Ticket_Flush = async (settings,TicketId, B_UseOrderDefault, sItemTable, group, users, TicketInfor) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/Flush';
  return await execFetch(URL, 'GET', {
    BranchId: settings.I_BranchId,
    BusinessType: settings.I_BusinessType,
    I_Counter: settings.I_Counter,
    PosId: settings.PosId,
    B_UseOrderDefault: B_UseOrderDefault,
    TicketId: TicketId,
    ButId: 1,
    AreId: sItemTable.AreaID,
    TabId: sItemTable.TabId,
    OGroupId: group.OGroupId != null ? group.OGroupId : '',
    CreateBy: users.ObjId,
    CreatebyName: users.ObjName,
    ObjWaiter: group.ObjWaiter != null ? group.ObjWaiter : '',
    ObjWaiterName: group.ObjWaiterName != null ? group.ObjWaiterName : '',
    CustomerId: TicketInfor.CustomerId != null ? TicketInfor.CustomerId : '',
    Customquantity: TicketInfor.TkCustomerQuantity != null ? TicketInfor.TkCustomerQuantity : 1,
    DeviceName: TicketInfor.DeviceName != null ? TicketInfor.DeviceName : '',
    Description: TicketInfor.Description != null ? TicketInfor.Description : '',
    MaleQuantity: TicketInfor.TkMaleQuantity != null ? TicketInfor.TkMaleQuantity : 0,
    FemaleQuantity: TicketInfor.TkFemaleQuantity != null ? TicketInfor.TkFemaleQuantity : 0,
    ChildrenQuantity: TicketInfor.TkChildrenQuantity != null ? TicketInfor.TkChildrenQuantity : 0,
    ForeignQuantity: TicketInfor.TkForeignQuantity != null ? TicketInfor.TkForeignQuantity : 0,
    CustomerName: TicketInfor.CustomerName != null ? TicketInfor.CustomerName : '',
  });
}
/**
 * Gọi hàm yêu cầu in thanh toán 
 * @param {*} OrgId 
 * @param {*} TicketId 
 * @param {*} PrintType 
 * @returns 
 */
export const API_Print = async (OrgId,TicketId,PrintType,Description) => {
  const URL = '/Ticket/API_Print';
  return await execFetch(URL, 'GET', { OrgId: OrgId,TicketId:TicketId, PrintType: PrintType ,Description:Description });
}
