var userID = 0;
var userEmail = "";

var country = [];
var year = [];
var month = [];

var dtTable;
var JsonResult = [];

/*
Load Countries, Years, Months
 */
function LoadCountries() {
  userID = Cookies.get('UserID');
  fire_async_api_get("NPSIReport/GetMasterCountries/" + userID).then(
    (response) => {
      response.forEach((element) => {
        country.push({
          id: element.CountryID,
          text: element.CountryName,
        });
      });
      $("#drpCountry").select2({
        data: country,
      });
      //initially load Product Details...
      LoadNPSIProductDetail();
    }
  );
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

function LoadNPSIProductDetail() {
  var country = $("#drpCountry").val();
  var yearmonth = $("#drpYear").val() + "-" + $("#drpMonth").val() + "-01";
  fire_async_api_get(
    "NPSIReport/GetNPSIReportProductDetails/" + country + "/" + yearmonth
  ).then((response) => {
    if(response !== "No Data"){
      JsonResult = response.result;
      dtTable.clear().draw();
      dtTable.rows.add(JsonResult).draw();
    }else{
      dtTable.clear().draw();
    }
  });
}

$("#btnSearch").click(function (event) {
  LoadNPSIProductDetail();
});

$(document).ready(function () {
  $(".select2").select2();
  //GetUserDetail();

  dtTable = $("#dtProducts").DataTable({
    dom: "Bfrtip",
    autoWidth: false,
    data: JsonResult,
    scrollX: true,
    fixedColumns: {
      leftColumns: 4,
    },
    pageLength: 10,
    order: [7, "desc"],
    columns: [
      { data: "Group" },
      { data: "Country" },
      {
        data: "FinishProductCode",
        render: function (data, type, row, meta) {
          return (
            '<a data-record-id="1" title="View records" href="#">' +
            data +
            "</a>"
          );
        },
      },
      { data: "ProductName" },
      { data: "FinishPrdPlatform" },
      { data: "SemiPrdPlatform" },
      { data: "PPMProjectCodeName" },
      {
        data: "NewPrdCodeGenDate",
        render: function (data, type, row) {
          return moment(data.substring(0, 10)).format("D-MMM-YYYY");
        },
      },
      {
        data: "NewPrdCodeStartDate",
        render: function (data, type, row) {
          return moment(data.substring(0, 10)).format("D-MMM-YYYY");
        },
      },
      { data: "NewProductCategory" },
      { data: "TechnicalTeam" },
    ],
  });

  LoadCountries();
  LoadYear();
  setUserInfo();
});
