var userID = 3;

var lorry = [];
var Jresult = [];

$(".select2").select2();
$("#datetime").daterangepicker();
var DTtable = $("#tblInvoices").DataTable({
  scrollX:true,
  data: Jresult,
  columns:[
    {data:"InvoiceNumber",
    render: function (data, type, row, meta) {
      return (
        '<a data-record-id="1" title="View records" href="#">' +
        data +
        "</a>"
      );
    },
    },
    {data:"SalesCode"},
    {data:"AreaName"},
    {data:"CustomerCode"},
    {data:"CustomerName"},
    {data:"LorryNumber"},
    {data:"IsODR", 
    render: function (data, type, row, meta) {
      if(data == 1){
        return 'YES'
      }else{
        return 'NO'
      }
    },
    },
    {data:"UploadedLocation"},
    {data:"UploadedDate"},
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
  fire_async_api_get("ODR/GetUploadedInvocesByLorryAndDate?lorryid=" + lorryid+"&dtfrom="+dtfrom+"&dtto="+dtto).then(
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