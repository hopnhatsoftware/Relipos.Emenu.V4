
import { _retrieveData, _storeData, _clearData } from './storages';
import { execFetch, fetchFile, execFormData } from './services';



//CheckCasherIn: Kiểm tra quây vào ca chưa
export const CheckCasherIn = async () => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/CheckCasherIn';
  return await execFetch(URL, 'GET', {});
}


export const ListArea = async (settings) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Area/Filter';
  return await execFetch(URL, 'GET', {
    listOrgId: settings.I_BranchId,
    BustId: settings.I_BusinessType ? settings.I_BusinessType : 1, CoutId: settings.I_Counter, Culture: culture,
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

export const getOrderId = async (item, OrdPlatform) => { //////////////////////// dư tham số: OrdPlatform
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/CheckAndGetOrder';
  return await execFetch(URL, 'GET', { TicketId: item.TicketID, Culture: culture, OrdPlatform: OrdPlatform });
}

export const GetPrdGroups = async (settings, item) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/GetViewGroup';
  return await execFetch(URL, 'GET', {
    TicketID: item.TicketID, PosID: settings.PosId ? settings.PosId : 1, AreaID: item.AreaID,
    Culture: culture, BranchId: settings.I_BranchId, BustId: settings.I_BusinessType ? settings.I_BusinessType : 1,
    PrgLevel: settings.I_ItemGroupLevel
  });
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

export const GetProductByGroupParent = async (settings, item, group, KeySearch) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/getProductByGroupParent';
  return await execFetch(URL, 'GET', {
    TicketID: item.TicketID, PrdId: 0, KeySearch: KeySearch, PrgId: group.PrgId, AreaId: item.AreaID,
    BustId: settings.I_BusinessType ? settings.I_BusinessType : 1, BranchId: settings.I_BranchId, PosId: settings.PosId ? settings.PosId : 1, Culture: culture
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

export const sendOrder = async (settings, item, OrdPlatform, details) => {
  const culture = await _retrieveData('culture', 1);
  let TicketDetails = [];
  details.forEach((product, index) => {
    if (typeof product.Details != 'undefined' && product.Details) {
      product.Details.forEach((item, index) => {
        product.Json = JSON.stringify(item.subItems);
        if (typeof product.Json == 'undefined') {
          product.Json = '';
        }
      });
    }
    product.OrddDescription = '';
    if (typeof product.itemDescription != 'undefined' && product.itemDescription) {
      product.itemDescription.forEach((item, index) => {
        product.OdsdDescription += item.MrqDescription + ' ';
      });
    }
    TicketDetails.push({
      ...product,
      OrddVatPercent: typeof product.PrdVatPercent != 'undefined' && product.PrdVatPercent ? product.PrdVatPercent : 0 ,
      OrddQuantity: product.Qty,
      OrddPrice: product.UnitPrice,
      UomId: product.UnitId
    });
  });

  let Data = {
    OrdId: item.OrderId,
    TicketID: item.TicketID,
    PosId: settings.PosId ? settings.PosId : 1,
    BranchId: settings.I_BranchId,
    Culture: culture,
    BustId: 1,
    CurId: settings.I_Currency,
    OrdPlatform: OrdPlatform,
    TicketDetails
  }
  const URL = '/Emenu/Post';

  console.warn('Data', Data);
  console.warn('URL', URL);
  return await execFetch(URL, 'POST', Data);
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

export const getAllItembyChoiceId = async (chsId, settings, item, KeySearch) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Emenu/getAllItembyChoiceId';
  return await execFetch(URL, 'GET', {
    chsId, BranchId: settings.I_BranchId, Culture: culture, PosId: settings.PosId ? settings.PosId : 1,
    TkdBasePrice: item.TkdBasePrice, KeySearch: KeySearch,
  });
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


export const Ticket_Flush = async (settings, B_UseOrderDefault, sItemTable, group, users, TicketInfor) => {
  const culture = await _retrieveData('culture', 1);
  const URL = '/Ticket/Flush';
  return await execFetch(URL, 'GET', {
    BranchId: settings.I_BranchId,
    BusinessType: settings.I_BusinessType,
    I_Counter: settings.I_Counter,
    PosId: settings.PosId,
    B_UseOrderDefault: B_UseOrderDefault,
    TicketId: 0,
    ButId: 1,
    AreId: sItemTable.AreaID,
    TabId: sItemTable.TabId,
    OGroupId: group.OGroupId != null ? group.OGroupId : '',
    CreateBy: users.ObjId,
    CreatebyName: users.ObjName,
    ObjWaiter: group.ObjWaiter != null ? group.ObjWaiter : '',
    ObjWaiterName: group.ObjWaiterName != null ? group.ObjWaiterName : '',
    CustomerId: TicketInfor.CustomerId != null ? TicketInfor.CustomerId : '',
    Customquantity: TicketInfor.Customquantity != null ? TicketInfor.Customquantity : 1,
    DeviceName: TicketInfor.DeviceName != null ? TicketInfor.DeviceName : '',
    Description: TicketInfor.Description != null ? TicketInfor.Description : '',
    MaleQuantity: TicketInfor.MaleQuantity != null ? TicketInfor.MaleQuantity : 0,
    FemaleQuantity: TicketInfor.FemaleQuantity != null ? TicketInfor.FemaleQuantity : 0,
    ChildrenQuantity: TicketInfor.ChildrenQuantity != null ? TicketInfor.ChildrenQuantity : 0,
    ForeignQuantity: TicketInfor.ForeignQuantity != null ? TicketInfor.ForeignQuantity : 0,
    CustomerName: TicketInfor.CustomerName != null ? TicketInfor.CustomerName : '',
  });
}