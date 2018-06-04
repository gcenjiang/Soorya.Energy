// Globar Variable

var token = "";

var webAPIUrl = "https://api.soorya.energy/api/"
//var webAPIUrl = "http://localhost:56588/api/"

var ACTION_SUCCESS_TITLE = "Pesan";
var ACTION_SUCCESS_SAVE_MESSAGE = "Data berhasil disimpan.";

var ACTION_WARNING_TITLE = "Peringatan";
var NO_DATA_DELETED = "Tidak ada data yang akan dihapus. Centang kotak pada data yang akan dihapus."
var ACTION_ERROR_TITLE = "Error";

var ACTION_DELETE_TITLE = "Hapus Data ?";
var ACTION_DELETE_CONFIRM_MESSAGE = "Data yang sudah dihapus tidak dapat dikembalikan. Apakah anda yakin ingin menghapus data ?";
var ACTION_DELETE_MESSAGE = "Data berhasil dihapus.";

// Table Search
var EMPTY_DATA_TABLE = "Tidak ada data.";
var NUMBER_OF_ROW = 15;

//Validation Message
var REQUIRED_MESSAGE = "Wajib diisi.";
var DATE_MESSAGE = "Format tanggal tidak sesuai.";
var DIGIT_ONLY_MESSAGE = "Nilai harus berupa digit.";
var NUMBER_ONLY_MESSAGE = "Nilai harus berupa angka.";
var LOOKUP_MESSAGE = "Data tidak ditemukan.";

var Service = {};

Service.callService = function (method, url) {
    return $.ajax({
        type: method,
        url: url,
        dataType: "json",
        headers: { "Content-Type": "application/json", "Token": token }
    })
}

Service.callService = function (method, url, param) {
    return $.ajax({
        type: method,
        url: url,
        data: JSON.stringify(param),
        dataType: "json",
        headers: { "Content-Type": "application/json", "Token": token }
    })
}

Service.callServiceWithUriParameter = function (method, url, param) {
    return $.ajax({
        type: method,
        url: url,
        data: param,
        dataType: "json",
        headers: { "Content-Type": "application/json", "Token": token }
    })
}

Service.callBinaryService = function (method, url) {
    return $.ajax({
        type: method,
        url: url,
        dataType: "binary",
        headers: { 'Content-Type': 'application/json', "Token": token }
    })
}

Service.callBinaryService = function (method, url, param) {
    return $.ajax({
        type: method,
        url: url,
        data: param,
        dataType: "binary",
        headers: { 'Content-Type': 'application/json', "Token": token }
    })
}

var ProgressBar = {};

ProgressBar.showLoading = function () {
    $('body').modalmanager('loading');
}

ProgressBar.closeLoading = function () {
    $('body').modalmanager('loading');
    $('body').modalmanager('removeLoading');
}

var Dialog = {};

Dialog.showActionModal = function (title, message) {
    $("#messageModal .modal-title").text(title);
    $("#messageModal .modal-body").empty();
    $("#messageModal .modal-body").append("<p class='modal-message'></p>");
    $("#messageModal .modal-message").text(message);
    $("#messageModal").modal('show');
}

Dialog.showActionModal = function (title, message, callback) {
    $("#messageModal .modal-title").text(title);
    $("#messageModal .modal-message").text(message);
    $("#messageModal").modal('show');
    $("#messageModal .modal-footer").find("button").click(callback);
}

var Utils = {};

Utils.checkType = function (variable, type) {
    return (variable != null && typeof variable == type);
}

Utils.addCommaSeparator = function (value) {
    value += '';
    x = value.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

Utils.removeCommaSeparator = function (value) {
    return value.toString().replace(/,/g, '');
}

Utils.convertDisplayDateToSqlDate = function (value) {
    var date = new Date(value);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

Utils.convertSqlDateToDisplayDate = function (value) {
    return $.format.date(new Date(value), "dd MMM yyyy");
}

Utils.convertSqlDateTimeToDisplayDateTime = function (value) {
    return $.format.date(new Date(value), "dd MMM yyyy HH:mm:ss");
}

Utils.getFirstDateOfMonth = function () {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

Utils.getCurrentDate = function () {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

Utils.getLastDateOfMonth = function (value) {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
