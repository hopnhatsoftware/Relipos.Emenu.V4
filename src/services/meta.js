
import { _retrieveData, _clearData } from './storages';
import { ENDPOINT_URL } from '../config/constants';

export const GetPosList = async () => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  const URL = endpoint + "/Config/PosList";
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    });
}
export const loadPosConfig = async (posId) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  const URL = endpoint + "/Config/getAllConfig?posId=" + posId;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    });
}


export const checkCashierIn = async (data) => {
  const URL = '/Config/CheckCasherIn';
  return await execFetch(URL, 'GET', data);
}

export const sendData = async (url, data) => {
  var formData = new FormData();
  for (var name in data) {
    formData.append(name, data[name]);
  }
  fetch(url, {
    method: 'POST',
    body: formData
  }).then((res) => {
    return res.json();
  });
}
