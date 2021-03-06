/*Globel Value */
var ctsappversion = "07022022"; //Replace this for any Deployment xxxxxxx.js?v=04052021
var auth = "Basic V29sZkFwcDpjRzl5ZEd0bGVRPT0=";

//var apiURL = "http://localhost/NPLK.WebAPI/ODRService/";

var apiURL = "http://192.168.101.3:99/ODRService/";

//var apiURL = "http://192.168.1.20/NPLK.WebAPI/ODRService/";
//var appurl = "https://staging-cts.nipsea.com.sg/";
var _user = "";

/* API GET Method */
function fire_async_api_get(urlParam) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "GET",
      url: apiURL + urlParam,
      contentType: "application/json",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        }).then(()=>{
          location.replace("./userlogin.html");
        });
      },
    });
  });
}

/* API POST Method */
function fire_async_api_post(urlParam, res) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST",
      url: apiURL + urlParam,
      contentType: "application/json",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      data: JSON.stringify(res),
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        });
      },
    });
  });
}

/* API Upload files */
function fire_async_api_upload_file(formdata, userid) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url:
        apiURL +
        "ODR/uploadinvoices?userid="+userid+"",
      type: "POST",
      headers: {
        Authorization: auth,
      },
      beforeSend: function () {
        Swal.fire({
          title: "Please wait..!",
          text: "Working on your request.",
          onBeforeOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
      },
      data: formdata,
      contentType: false,
      processData: false,
      success: function (data) {
        resolve(data);
        Swal.close();
      },
      error: function (xhr, status, errorThrown) {
        reject(xhr);
        Swal.fire({
          type: "error",
          title: "Oops!",
          text: xhr.responseJSON.Message,
        });
      },
    });
  });
}



function setUserInfo(){
  document.getElementById("lbluname").innerHTML = Cookies.get('Name');
  document.getElementById("lbluemail").innerHTML = Cookies.get('Level');
  document.getElementById("lblurole").innerHTML = Cookies.get('Role');
}


var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

/* format currency */
function Currency_Formatter(val) {
  return parseFloat(val, 2)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    .toString();
}

function validateInput(input,e) {
  var specialKeys = new Array();
  specialKeys.push(8); //Backspace
  if (!$(input).val().includes("-") && $(input).val() == "") {
  specialKeys.push(45); //sustract
  }
  if (!$(input).val().includes(".")) {
  specialKeys.push(46); //decimal
  }
  var keyCode = e.which ? e.which : e.keyCode;
  var ret =
  (keyCode >= 48 && keyCode <= 57) ||
  specialKeys.indexOf(keyCode) != -1;
  return ret;
}

$('.input').on('keydown', function(e){ if (e.keyCode == 9)  e.preventDefault() });