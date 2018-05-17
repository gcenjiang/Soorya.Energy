$(document).ready(function () {
    $("#btnLogin").click(function () {
        var userID = $("#txtUserID").val().trim();
        var password = $("#txtPassword").val().trim();

        var url = webAPIUrl + "Account/Login";
		//var url = "http://localhost:56588/api/Account/Login";

        var o = {};
        o.UserID = userID;
        o.Password = sha256(password);

        ProgressBar.showLoading();
        Service.callService("POST", url, o).then(
            function (data) {
				console.log(data);
                ProgressBar.closeLoading();
                if (data == "1") {
					//$(location).attr('href','/Soorya/Admin/dashboard.html');
					$(location).attr('href','dashboard.html');
                }
                else {
                    $("#errormessage").html("Invalid username or password");
                    $("div.alert").show();
                }
            },
            function (jqXHR, textStatus, errorThrown) {
                ProgressBar.closeLoading();
                Dialog.showActionModal(ACTION_ERROR_TITLE, errorThrown);
            });
    });

    $("#txtUserID").keypress(function (e) {
        if (e.which == 13) {
            $("#btnLogin").click();
        }
    });

    $("#txtPassword").keypress(function (e) {
        if (e.which == 13) {
            $("#btnLogin").click();
        }
    });
});
