var userID = 3;
var lorry = [];
var Jresult = [];


$(".select2").select2();
$("#datetime").daterangepicker();

var DTtable = $("#tblODR").DataTable({
    scrollX:true,
    data:Jresult,
    columns:[
        {data:"InvoiceNumber",
        render: function (data, type, row, meta) {
          return (
              '<a data-record-id="1" href="/odr-wf.html?headerid=' +
              row.ODRHeaderID +
              '">' +
              data +
              "</a>"
          );
        },
      },
        {data:"Status"},
        {data:"LevelName"},        
        {data:"SalesCode"},
        {data:"AreaName"},
        {data:"CustomerCode"},
        {data:"CustomerName"},
        {data:"LorryNumber"},
        {data:"UploadedLocation"},
        {data:"ODRCreatedDate"},
        {data:"ODRCompletedDate"},
        
    ]
});

$(document).ready(function(){
    LoadLorryNumbers();
});

function LoadLorryNumbers(){
    fire_async_api_get("ODR/GetMasterLorryByUserID?userid=" + userID).then(
        (response) => {
          response.result.forEach((element) => {
            lorry.push({
              id: element.LorryID,
              text: element.LorryNumber,
            });
          });
          $("#drpLorry").select2({
            data: lorry,
          });
          LoadTable();
        }
    );
}

$("#btnsearch").click(function(){
    LoadTable();
  });

function LoadTable(){
    var mdate = $("#datetime").val();
    var dtfrom = mdate.split('-')[0].trim();
    var dtto = mdate.split('-')[1].trim();
    var lorryid = $("#drpLorry").val();
    var statusid = $("#drpStatus").val();
    fire_async_api_get("ODR/GetCreatedODRs?lorryid=" + lorryid+"&dtfrom="+dtfrom+"&dtto="+dtto+"&userid="+userID+"&status="+statusid).then(
        (response) => {
          if(response != "No Data"){
            Jresult = response.result;
            console.log(Jresult);
            DTtable.clear().draw();
            DTtable.rows.add(Jresult).draw();
          }
        }
    );
}