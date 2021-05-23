export const getCurrentDay = () =>{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  
  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  } 
  if(mm<10){
      mm='0'+mm;
  } 
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
}
  export const formatNumber = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  export const formatCurrency = (num, symbol ='$') => {
    if (num == null){
      return ''
    }
    let number = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    if (number.trim() == "") {
    }
    return  number.toString()+""+symbol;
  };
export const formatDate =(date)=>{
    // var monthNames = [
    //     "January", "February", "March",
    //     "April", "May", "June", "July",
    //     "August", "September", "October",
    //     "November", "December"
    // ];
    
    var day = date.getDate();
    var monthIndex = date.getMonth()+1;
    var year = date.getFullYear();
    
    return day + '/'+ monthIndex + '/' + year;
}
export const formatDate2 =(date)=>{
    // var monthNames = [
    //     "January", "February", "March",
    //     "April", "May", "June", "July",
    //     "August", "September", "October",
    //     "November", "December"
    // ];
    
    var day = date.getDate();
    var monthIndex = date.getMonth()+1;
    var year = date.getFullYear();
    
    return monthIndex + '/' + day + '/'+  year;
}
export const formatDate3 =(date)=>{
    // var monthNames = [
    //     "January", "February", "March",
    //     "April", "May", "June", "July",
    //     "August", "September", "October",
    //     "November", "December"
    // ];
    
    var day = date.getDate();
    var monthIndex = date.getMonth()+1;
    var year = date.getFullYear();
    
    return year + '-' + monthIndex + '-'+  day;
}
export const formatTime =(dateStr) =>{
    let date = new Date(dateStr);
    let timestamp= date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    return timestamp;
}
export const serialize = (obj) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  export const validUrl = (url) => {
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (pattern.test(url)) {
        return true;
    } 
    return false;
  }
  export const numberWithCommas = (x) => {
      if(!x){
          return '';
      }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const formatDate1 = (dateObj, format) => {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var curr_date = dateObj.getDate();
  var curr_month = dateObj.getMonth();
  curr_month = curr_month + 1;
  var curr_year = dateObj.getFullYear();
  var curr_min = dateObj.getMinutes();
  var curr_hr = dateObj.getHours();
  var curr_sc = dateObj.getSeconds();
  if (curr_month.toString().length == 1)
    curr_month = '0' + curr_month;
  if (curr_date.toString().length == 1)
    curr_date = '0' + curr_date;
  if (curr_hr.toString().length == 1)
    curr_hr = '0' + curr_hr;
  if (curr_min.toString().length == 1)
    curr_min = '0' + curr_min;

  if (format == 1) //dd-mm-yyyy
  {
    return curr_date + "-" + curr_month + "-" + curr_year;
  }
  else if (format == 2) //yyyy-mm-dd
  {
    return curr_year + "-" + curr_month + "-" + curr_date;
  }
  else if (format == 3) //dd/mm/yyyy
  {
    return curr_date + "/" + curr_month + "/" + curr_year;
  }
  else if (format == 4)// dd/MM/yyyy HH:mm
  {
    return curr_date + "/" + curr_month + "/" + curr_year + " " + curr_hr + ":" + curr_min;
  }
  else if (format == 5)// dd/MM/yyyy HH:mm:ss
  {
    return curr_date + "/" + curr_month + "/" + curr_year + " " + curr_hr + ":" + curr_min + ":" + curr_sc;
  }
  else if (format == 6)// HH:mm
  {
    return curr_hr + ":" + curr_min;
  }
  else if (format == 7)// HH:mm
  {
    return curr_hr + " G" + curr_min + "P";
  }
  else if (format == 8)// ddMMyyyyHHmmss
  {
    return curr_date + "" + curr_month + "" + curr_year + "" + curr_hr + "" + curr_min + "" + curr_sc;
  }
}

export const getTableColor = (status)=>{
    let color ='#EEEEEE';
    switch (status) {
          case 1:
              color='#0097ab';
            break;
        case 2:
            color='#ffa500';
          break;
          case 3:
              color='#ea4cf4';
            break;
      case 4:
          color='#c40707';
        break;
        case 5:
            color='#46cb04';
          break;
          case 6:
              color='#9f7343';
            break;
      default:
      color='#CCCCCC';
    }
    return color;
  }