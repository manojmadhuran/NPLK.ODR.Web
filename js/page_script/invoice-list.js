var userID = 1;

var lorry = [];
$(".select2").select2();
$("#datetime").daterangepicker();
$("#tblInvoices").DataTable();

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
        }
    );
}

$("#btnsearch").click(function(){
    var mdate = $("#datetime").val();
    var dtfrom = mdate.split('-')[0].trim();
    var dtto = mdate.split('-')[1].trim();
    var lorryid = $("#drpLorry").val();
    fire_async_api_get("ODR/GetUploadedInvocesByLorryAndDate?lorryid=" + lorryid+"&dtfrom="+dtfrom+"&dtto="+dtto).then(
        (response) => {
          console.log(response.result);
        }
    );


});
