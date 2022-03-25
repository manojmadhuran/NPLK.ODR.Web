var myDropzone;
var userID = 0;
var userEmail = "";

var country = [];
var year = [];
var month = [];

Dropzone.autoDiscover = false;
var mDropZone = new Dropzone(".dropzone", {
  url: "/dummy",
  autoProcessQueue: false,
  maxFiles: 1,
  init: function () {
    this.on("maxfilesexceeded", function (file) {
      console.log(mDropZone.files[0].name);
      mDropZone.removeFile(file);
    });
  },
  acceptedFiles:
    ".xlsx, .csv",
  addRemoveLinks: true,
  "error": function(file, message, xhr) {
       if (xhr == null) this.removeFile(file); // perhaps not remove on xhr errors
       Swal.fire("Error", message, "error");
    }
});

$(document).ready(function () {
  $(".select2").select2();

  //GetUserDetail();
});

/*
Load Countries, Years, Months
 */
function LoadCountries() {
  userID = Cookies.get('UserID');
  fire_async_api_get("NPSIReport/GetMasterCountries/"+userID).then((response) => {
    response.forEach((element) => {
      country.push({
        id: element.CountryID,
        text: element.CountryName,
      });
    });
    $("#drpCountry").select2({
      data: country,
    });
  });
}

function LoadYear() {
  var currYear = new Date().getFullYear();
  var month_ = new Date().getMonth() + 1;

  for (var i = currYear; i >= 2020; i--) {
    year.push({
      id: i,
      text: i,
    });
  }
  $("#drpYear").select2({
    data: year,
  });

  $("#drpMonth").val(("0" + month_).slice(-2));
  $("#drpMonth").trigger("change");
}

$("#btnUploadReport").click(function (event) {
  var DZfile = mDropZone.files[0];
  if (DZfile == undefined) {
    Swal.fire("Error", "No files selected", "error");
  } else {
    UploadNPSIReport(1,1);
  }
});

//set warning when skipping next month
function CheckMonthDiffernt(country, yearmonth) {
  fire_async_api_get(
    "NPSIReport/CheckMonthDifferent/" + country + "/" + yearmonth
  ).then((response) => {
    var diff = response;
    if (diff == 1) {
      IsDataAvailable(country, yearmonth);
    } else {
      Swal.fire({
        title: "Warning",
        text: "You are going to skip the next latest month. Are you sure you want to continue ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          IsDataAvailable(country, yearmonth);
        }
      });
    }
  });
}

function IsDataAvailable(country, yearmonth) {
  fire_async_api_get(
    "NPSIReport/CheckDataAvailableForCountryAndMonth/" +
      country +
      "/" +
      yearmonth
  ).then((response) => {
    var dataRows = response;
    if (dataRows > 0) {
      Swal.fire({
        title: "Data already available",
        text: "Are you sure you want to upload this report ? (Old data will be replaced from the latest report)",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          DeleteAvailableDataForCountryAndMonth(country, yearmonth);
        }
      });
    } else {
      UploadNPSIReport(yearmonth, country);
    }
  });
}

function DeleteAvailableDataForCountryAndMonth(country, yearmonth) {
  fire_async_api_get(
    "NPSIReport/DeleteAvailableDataForCountryAndMonth/" +
      country +
      "/" +
      yearmonth
  ).then((response) => {
    var dataRows = response;
    if (dataRows > 0) {
      UploadNPSIReport(yearmonth, country);
    } else {
      Swal.fire(
        "Unable to proceed",
        "Replace old data failed, please ask for administrator support.",
        "error"
      );
    }
  });
}

function UploadNPSIReport(yearMonth, country) {
  try {
    var DZfile = mDropZone.files[0];
    if (DZfile == undefined) {
      Swal.fire("Error", "No files selected", "error");
    } else {
      Swal.fire({
        title: "Upload NPSI Report",
        text: "Are you sure you want to upload this report ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          if (DZfile.status == "queued") {
            var formdata = new FormData();
            formdata.append("file", DZfile);
            fire_async_api_upload_file(formdata, yearMonth, userID, country).then(
              (response) => {
                var message = response;
                if (message !== "") {
                  var title = message.split("|")[0];
                  var txt = message.split("|")[1];
                  if (title === "error") {
                    Swal.fire("Error", txt, "error").then(() => {
                      mDropZone.removeAllFiles();
                      location.replace("reportdata-listing.html");
                    });
                  } else if (title === "Done") {
                    Swal.fire(
                      "Done",
                      "Report uploaded successfully",
                      "success"
                    ).then(() => {
                      mDropZone.removeAllFiles();
                      location.replace("reportdata-listing.html");
                    });
                  } else if (title === "warning") {
                    Swal.fire("Error", txt, "warning").then(() => {
                      mDropZone.removeAllFiles();
                      KTUtil.btnRelease(btn);
                      location.replace("budget-listing.html");
                    });
                  }
                } else {
                  Swal.fire({
                    title: "Error on upload NPSI Report",
                    text: "Please check your data and upload format",
                    type: "error",
                  }).then(() => {
                    mDropZone.removeAllFiles();
                  });
                }
              }
            );
          }
        }
      });
    }
  } catch (err) {}
}
