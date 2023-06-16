import Constants from 'expo-constants';
import { _retrieveData, _storeData, _clearData } from './storages';
import { NetInfo, Platform, Alert } from 'react-native';
import { ENDPOINT_URL } from '../config/constants';
import { serialize } from '../services/util';
import Base64 from './base64';

export const fetchFile = async (Path, Data) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  let user = await _retrieveData('APP@USER', JSON.stringify({}));
  endpoint = JSON.parse(endpoint);
  endpoint = endpoint.replace("/api/", "").replace("/api", "");
  endpoint=endpoint+'/api'
  user = JSON.parse(user);

  return new Promise((resolve, reject) => {
    const URL = endpoint + '/' + Path;
    // 1. initialize request
    const xhr = new XMLHttpRequest();
    // 2. open request
    xhr.open('POST', URL);
    // 3. set up callback for request
    xhr.onerror = e => {
      return {
        "Status": 2,
        "Type": "",
        "Exception_Title": "",
        "Exception_Message": e,
        "Data": "",
        "Data1": "",
        "RowVersion": 0
      };
    };

    xhr.addEventListener('load', resolve);
    xhr.addEventListener('error', reject);
    // 4. catch for request timeout
    xhr.ontimeout = e => {
      return {
        "Status": 2,
        "Type": "",
        "Exception_Title": "timeout",
        "Exception_Message": e,
        "Data": "",
        "Data1": "",
        "RowVersion": 0
      };
    };
    // 4. create formData to upload
    let formdata = new FormData();

    for (var property in Data) {
      if (Data.hasOwnProperty(property)) {
        formdata.append(property, Data[property]);
      }
    }
    var auth_key = 'Basic ' + Base64.btoa(user.UserName + ':' + user.PassWord + ':' + user.BranchId);

    // 6. upload the request

    //xhr.setRequestHeader("Authorization", auth_key); 
    xhr.send(formdata);
    // 7. track upload progress
    if (xhr.upload) {
      // track the upload progress
      xhr.upload.onprogress = ({ total, loaded }) => {
        const uploadProgress = (loaded / total);
      };
    }
    // 4. catch for request error
  }).then((res) => {
    return JSON.parse(res.currentTarget._response);
  });
}

export const execFetch = async (Path, Method, Data) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  endpoint = endpoint.replace("/api/", "").replace("/api", "");
  endpoint=endpoint+'/api'
  let user = await _retrieveData('APP@USER', JSON.stringify({}));
  user = JSON.parse(user);
  let JwtToken = await _retrieveData('APP@JWT', JSON.stringify({}));
  JwtToken = JSON.parse(JwtToken);
  let URL = endpoint +'/'+ Path;
  if (Method == 'GET') {
    URL = URL + '?' + serialize(Data);
    // console.log('URL:',URL)
    return fetch(URL, {
      method: Method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JwtToken ' + JwtToken
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.Status == 2 || data.Status == 3) { //   if (data.Status != 1) {
        if (data.Status == 3) {
          data.Exception_Message = URL + " - " + data.Exception_Message;
        }
        Alert.alert(
          data.Exception_Title,
          data.Exception_Message,
        )
      }
      return data;
    }).catch(async (error) => {
      Alert.alert( "System Error",error+Path,
      )
    });
  }

  return fetch(URL, {
    method: Method, 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'JwtToken ' + JwtToken
    },
    body: JSON.stringify(Data),
  }).then((res) => {
    return res.json();
  }).then((data) => {
    if (data.Status == 2 || data.Status == 3) {  //   if (data.Status != 1) {
      if (data.Status == 3) {
        data.Exception_Message = URL + " - " + data.Exception_Message;
      }
      Alert.alert(
        data.Exception_Title,
        data.Exception_Message,
      )
    }
    return data;
  }).catch(async (error) => {
    Alert.alert(
      "Error",error+Path,
    )
  });
}
export const execFetch2 = async (Path, Method, Data) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  endpoint = endpoint.replace("/api/", "").replace("/api", "");
  endpoint=endpoint+'/api'
  let user = await _retrieveData('APP@USER', JSON.stringify({}));
  user = JSON.parse(user);
  let JwtToken = await _retrieveData('APP@JWT', JSON.stringify({}));
  JwtToken = JSON.parse(JwtToken);
  let URL = endpoint +'/'+ Path;
  if (Method == 'GET') {
    URL = URL + '?' + serialize(Data);
    // console.log('URL:',URL)
    return fetch(URL, {
      method: Method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JwtToken ' + JwtToken
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      return data;
    }).catch(async (error) => {
      Alert.alert( "System Error",error+Path,
      )
    });
  }

  return fetch(URL, {
    method: Method, 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'JwtToken ' + JwtToken
    },
    body: JSON.stringify(Data),
  }).then((res) => {
    return res.json();
  }).then((data) => {
    return data;
  }).catch(async (error) => {
    Alert.alert(
      "Error",error+Path,
    )
  });
}
/**
 * Chạy không cần 
 * @param {*} Path 
 * @param {*} Method 
 * @param {*} Data 
 * @returns 
 */
export const execFetch_NoAuthor = async (Path, Method, Data) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  endpoint = endpoint.replace("/api/", "").replace("/api", "");
  endpoint=endpoint+'/api'
  let URL = endpoint +'/'+ Path;
  if (Method == 'GET') {
    URL = URL + '?' + serialize(Data);
   // console.log('URL:',URL)
    return fetch(URL, {
      method: Method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.Status == 2 || data.Status == 3) { //   if (data.Status != 1) {
        if (data.Status == 3) {
          data.Exception_Message = URL + " - " + data.Exception_Message;
        }
        Alert.alert(
          data.Exception_Title,
          data.Exception_Message,
        )
      }
      return data;
    }).catch(async (error) => {
      Alert.alert( "System Error",error+Path,
      )
    });
  }

  return fetch(URL, {
    method: Method, 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Data),
  }).then((res) => {
    return res.json();
  }).then((data) => {
    if (data.Status == 2 || data.Status == 3) {  //   if (data.Status != 1) {
      if (data.Status == 3) {
        data.Exception_Message = URL + " - " + data.Exception_Message;
      }
      Alert.alert(
        data.Exception_Title,
        data.Exception_Message,
      )
    }
    return data;
  }).catch(async (error) => {
    Alert.alert(
      "Error",error+Path,
    )
  });
}


export const execFetchNoMessenger = async (Path, Method, Data) => {
  let endpoint = await _retrieveData('APP@BACKEND_ENDPOINT', JSON.stringify(ENDPOINT_URL));
  endpoint = JSON.parse(endpoint);
  endpoint = endpoint.replace("/api/", "").replace("/api", "");
  endpoint=endpoint+'/api'
  let user = await _retrieveData('APP@USER', JSON.stringify({}));
  user = JSON.parse(user);
  let JwtToken = await _retrieveData('APP@JWT', JSON.stringify({}));
  JwtToken = JSON.parse(JwtToken);
  let URL = endpoint + '/' + Path;
  if (Method == 'GET') {
    URL = URL + '?' + serialize(Data);
    return fetch(URL, {
      method: Method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JwtToken ' + JwtToken
      },
    }).then((res) => {
      return res.json();
    }).then((data) => {
      return data;
    }).catch(async (error) => {
      Alert.alert(
        "Error",error,
      )
    });
  }
  return fetch(URL, {
    method: Method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'JwtToken ' + JwtToken
    },
    body: JSON.stringify(Data),
  }).then((res) => {
    return res.json();
  }).then((data) => {
    return data;
  }).catch(async (error) => {
    Alert.alert(
      "Error",error+Path,
    )
  });
}