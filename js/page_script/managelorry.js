var userID = Cookies.get('UserID');
$(".select2").select2();

var lorry = [];
var driver = [];

var Jresult = [];

var DTtable = $("#tbllorrydriver").DataTable({
    data:Jresult,
    columns:[
        {data:"Plant"},
        {data:"LocationName"},
        {data:"LorryNumber"},
        {data:"FullName"},
        {data:"WorkingFrom"},
        {data:"WorkingTo"}
    ],

});

$(document).ready(function(){
    LoadLorryNumbers();
    setUserInfo();
    LoadTable();
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
          $("#drpLorryNumber").select2({
            data: lorry,
          });
          LoadDrivers();
        }
    );
}

function LoadDrivers(){
    fire_async_api_get("ODR/GetMasterDrivers").then(
        (response) => {
          response.result.forEach((element) => {
            driver.push({
              id: element.DriverID,
              text: element.DriverName,
            });
          });
          $("#drpDriverName").select2({
            data: driver,
          });          
        }
    );
}


function LoadTable(){
    fire_async_api_get("ODR/GetAssignedLorryDriver").then(
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

function SetMasterLorryDriver(){
    var lorry = $("#drpLorryNumber").val();
    var driver = $("#drpDriverName").val();

    fire_async_api_get("ODR/SetMasterLorryDriver?user="+driver+"&lorry="+lorry+"&createdby="+userID).then(
        (response) => {
          if(response.result > 0){           
            console.log(response);
            Swal.fire("Done", "Update Lorry + Driver Success.", "success").then(
                () => {
                  location.reload();
                }
              );
          }else{
            Swal.fire("Error", "Error on your request.", "error")
          }
        }
    );
}

function ClickSet(){
    SetMasterLorryDriver();
}