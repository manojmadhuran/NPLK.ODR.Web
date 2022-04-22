var myDropzone;
var userID = Cookies.get('UserID');
var userEmail = Cookies.get('UserID');;

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
  setUserInfo();
  //GetUserDetail();
});


$("#btnUploadReport").click(function (event) {
  var DZfile = mDropZone.files[0];
  if (DZfile == undefined) {
    Swal.fire("Error", "No files selected", "error");
  } else {
    UploadReport();
  }
});


function UploadReport() {
  try {
    var DZfile = mDropZone.files[0];
    if (DZfile == undefined) {
      Swal.fire("Error", "No files selected", "error");
    } else {
      Swal.fire({
        title: "Upload Gatepass Report",
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
            fire_async_api_upload_file(formdata, userID).then(
              (response) => {
                var message = response;
                if (message !== "") {
                  var title = message.result.split("|")[0];
                  var txt = message.result.split("|")[1];
                  if (title === "error") {
                    Swal.fire("Error", txt, "error").then(() => {
                      mDropZone.removeAllFiles();                      
                    });
                  } else if (title === "Done") {
                    Swal.fire(
                      "Done",
                      "File uploaded successfully",
                      "success"
                    ).then(() => {
                      mDropZone.removeAllFiles();
                      location.replace("invoice-list.html");
                    });
                  } else if (title === "warning") {
                    Swal.fire("Error", txt, "warning").then(() => {
                      mDropZone.removeAllFiles();
                      KTUtil.btnRelease(btn);
                    });
                  }
                } else {
                  Swal.fire({
                    title: "Error on upload File",
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
