var userID = Cookies.get('UserID');
var userlevelID = Cookies.get('LevelID');
var Jresult = [];
var reasons = [];
var attachmentURL = "";
var headerid = "";

var odrLevelID = 0;
var odrStatusID = 0;
var CanComplete = 0;

$(".select2").select2();

var DTtable = $("#tblWF").DataTable({
  paging: false,
  lengthChange: false,
  searching: false,
  ordering: false,
  info: false,
  scrollX: true,
  data: Jresult,
  columns: [
    { data: "UserName" },
    { data: "Reason" },
    { data: "ActionRemark" },
    { data: "Status" },
    { data: "CreatedDate" },
    { data: "Level" },
  ],
});

$(document).ready(function () {
  headerid = getUrlParameter("headerid");
  setUserInfo();
  LoadHeader(headerid);
  LoadReasons();
  LoadTable();
});

function LoadTable() {
  fire_async_api_get("ODR/GetODRWorkFlowComments?odrHeaderid=" + headerid).then(
    (response) => {
      if (response != "No Data") {
        Jresult = response.result;
        console.log(Jresult);
        DTtable.clear().draw();
        DTtable.rows.add(Jresult).draw();
      }
    }
  );
}

function LoadReasons() {
  fire_async_api_get("ODR/GetMasterReasons?Type=Driver").then((response) => {
    response.result.forEach((element) => {
      reasons.push({
        id: element.ReasonID,
        text: element.Reason,
      });
    });
    $("#drpReason").select2({
      data: reasons,
    });
    LoadTable();
  });
}

function LoadHeader(headerid) {
  fire_async_api_get("ODR/GetODRHeaderDetail?headerid=" + headerid).then(
    (response) => {
      if (response != "No Data") {
        Jresult = response.result;
        console.log(Jresult);
        odrLevelID = Jresult.LevelID;
        odrStatusID = Jresult.StatusID;
        CanComplete = Jresult.CanComplete;
        $("#txtinvoice").val(Jresult.InvoiceNumber);
        $("#txtstatus").val(Jresult.Status);
        $("#txtlevel").val(Jresult.LevelName);
        $("#txtcuscode").val(Jresult.CustomerCode);
        $("#txtcusname").val(Jresult.CustomerName);
        $("#txtscode").val(Jresult.SalesCode);
        $("#txtarea").val(Jresult.AreaName);
        $("#txtodrdate").val(Jresult.ODRCreatedDate);
        $("#txtlorry").val(Jresult.LorryNumber);

        SetModuleAccess();
      }
    }
  );

  fire_async_api_get("ODR/GetODRAttachments?odrHeaderID=" + headerid).then(
    (response) => {
      if (response != "No Data") {
        Jresult = response.result;
        console.log(Jresult);
        attachmentURL = Jresult[0].FilePath;
      }
    }
  );
}

function ViewImage() {
  window.open(attachmentURL, "_blank").focus();
}

function approve() {
  var reasonid = $("#drpReason").val();
  var remark = $("#txtremark").val();
  SetODRWorkFlowLine(reasonid, remark, 2);
}

function reject() {
  var reasonid = $("#drpReason").val();
  var remark = $("#txtremark").val();
  SetODRWorkFlowLine(reasonid, remark, 3);
}

function complete() {
  var reasonid = $("#drpReason").val();
  var remark = $("#txtremark").val();
  SetODRWorkFlowLine(reasonid, remark, 5);
}

function SetODRWorkFlowLine(reasonid, remark, statusid) {
  jobj = {
    ODRHeaderID: headerid,
    LevelID: userlevelID,
    StatusID: statusid,
    ReasonID: reasonid,
    ActionRemark: remark,
    CreatedBy: userID,
  };
  fire_async_api_post("ODR/SetODRWorkFlowLine", jobj).then((response) => {
    console.log(response);
    try {
      if (response.result > 0) {
        Swal.fire("Done", "Successfully submit the comment.", "success").then(
          () => {
            location.reload();
            $("#txtremark").val();
            $("#drpReason").val(0).trigger("change");
          }
        );
      }
    } catch {}
  });
}

function SetModuleAccess() {
  if (odrLevelID == userlevelID && (odrStatusID != 5 && odrStatusID != 3)) {
    if (userlevelID == 3) {
      $("#divremark").show();
      $("#divdipo").show();

      if(CanComplete > 0){
          $("#btncomplete").show();
          $("#btnforward").hide();
      }


    } else if (userlevelID == 4) {
      $("#divremark").show();
      $("#divlogistic").show();
    }
  }
}
