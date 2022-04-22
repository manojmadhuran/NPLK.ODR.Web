Cookies.remove("UserID");

function getuserdetail() {
  var uname = $("#txtuname").val();
  var pwd = $("#txtpwd").val();
  fire_async_api_get(
    "ODR/GetUserDetailUser?uname=" + uname + "&pwd=" + pwd + ""
  ).then((response) => {
    console.log(response);
    if (response !== "No Data") {
        var Jresult = response.result;
      Cookies.set("UserID", Jresult.UserID);
      Cookies.set("UserName", Jresult.UserName);
      Cookies.set("RoleName", Jresult.UserRole);
      Cookies.set("LevelID", Jresult.Level);
      Cookies.set("Role", Jresult.RoleName);
      Cookies.set("Level", Jresult.LevelName);
      Cookies.set("Name",Jresult.FullName);

      location.replace('./mytask.html');
    }else{
      Swal.fire({
        title: "Error",
        text: "Invalid UserName or Password",
        type:"error"  
      });
    }
  });
}
