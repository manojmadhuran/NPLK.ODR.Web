var userID = 4;
var statusid = 1;

var lorry = [];
var Jresult = [];

$(".select2").select2();

var DTtable = $("#tblMyTask").DataTable({
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
    $("#drpStatus").val(1).trigger('change');
    LoadTable();
});

$("#btnsearch").click(function(){    
    LoadTable();
});

function LoadTable(){
    var statusid = $("#drpStatus").val();
    
    fire_async_api_get("ODR/GetMyTasks?userid="+userID+"&status="+statusid).then(
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