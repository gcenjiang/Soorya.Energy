var tableSearch;

$(document).ready(function () {

	$.fn.dataTable.moment('DD MMM YYYY HH:mm:ss');
	
    tableSearch = $('#tblSearch').DataTable({
        data: [],
        "oLanguage": {
            "sEmptyTable": "No Data is Found."
        },
        searching: false,
        lengthChange: false,
        pageLength: 15,
        order: [[0, "asc"]],
		columnDefs: [{
			orderable: false,
			targets: "no-sort"
		}],
        scrollX: true,
        scrollCollapse: true,
		fixedColumns: {
			leftColumns: 4
		},
        columns: [
			{ data: "trxDate", class:"text-center" },
            { data: "name" },
            { data: "phone" },
            { data: "email" },
			{ data: "address"},
            { data: "buildingType" },
            { data: "monthlyElectricityBill"},
            { data: "power" },
            { data: "roofPitch" },
            { data: "roofOrientationText" },
            { data: "paybackPeriod" },
            { data: "solarSystemCost" },
            { data: "systemSize" },
			{ data: "lifetimeCostOfElectricity"},
            { data: "annualSavings" },
            { data: "lifetimeSavings" },
			{ data: "returnOnInvestment" },
        ]
    });

    $('#tblSearch').on('draw.dt', function () {
        $('#tblSearch tbody').children('tr').each(function () {
			$(this).children('td').eq(6).attr('align', 'right');
			$(this).children('td').eq(7).attr('align', 'right');
			$(this).children('td').eq(8).attr('align', 'right');
			$(this).children('td').eq(10).attr('align', 'right');
			$(this).children('td').eq(11).attr('align', 'right');
			$(this).children('td').eq(12).attr('align', 'right');
			$(this).children('td').eq(13).attr('align', 'right');
			$(this).children('td').eq(14).attr('align', 'right');
			$(this).children('td').eq(15).attr('align', 'right');
			$(this).children('td').eq(16).attr('align', 'right');
        });
    });
	
	$('#txtStartDate').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd M yy",
        onSelect: function (date) {
            $("#txtEndDate").datepicker("option", "minDate", date);
        }
    });

    $('#txtStartDate').datepicker('setDate', Utils.getFirstDateOfMonth());

    $('#spnStartDate').click(function () {
        $('#txtStartDate').focus();
    });

    $('#txtEndDate').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd M yy",
        onSelect: function (date) {
            $("#txtStartDate").datepicker("option", "maxDate", date);
        }
    });

    $('#spnEndDate').click(function () {
        $('#txtEndDate').focus();
    });

    $('#txtEndDate').datepicker('setDate', Utils.getLastDateOfMonth());

    $("#txtAddress").keypress(function (e) {
        if (e.which == 13) {
            $("#btnSearch").click();
        }
    });

    $("#btnSearch").click(function () {
        searchData();
    });

    $(window).resize(function () {
        $("#tblSearch").DataTable().columns.adjust().draw();
    });
});

var searchData = function () {

 var startDate = Utils.convertDisplayDateToSqlDate($('#txtStartDate').datepicker("getDate"));
	var endDate = Utils.convertDisplayDateToSqlDate($('#txtEndDate').datepicker("getDate"));
	var address = $('#txtAddress').val().trim();

	var obj = {};
	obj.startDate = startDate;
	obj.endDate = endDate;
	obj.address = address == "" ? null : address;

    var url = webAPIUrl + "CalculationResult";

    ProgressBar.showLoading();
    Service.callServiceWithUriParameter("GET", url, obj).then(
        function (data) {
            $(data).each(function (i, row) {
                data[i].trxDate = Utils.convertSqlDateTimeToDisplayDateTime(row.trxDate);
				data[i].monthlyElectricityBill = Utils.addCommaSeparator(row.monthlyElectricityBill);
				data[i].power = Utils.addCommaSeparator(row.power);
				data[i].paybackPeriod = Utils.addCommaSeparator(row.paybackPeriod);
				data[i].solarSystemCost = Utils.addCommaSeparator(row.solarSystemCost);
				data[i].systemSize = Utils.addCommaSeparator(row.systemSize);
				data[i].lifetimeCostOfElectricity = Utils.addCommaSeparator(row.lifetimeCostOfElectricity);
				data[i].annualSavings = Utils.addCommaSeparator(row.annualSavings);
				data[i].lifetimeSavings = Utils.addCommaSeparator(row.lifetimeSavings);
				data[i].returnOnInvestment = Utils.addCommaSeparator(row.returnOnInvestment);
            })
            tableSearch.clear().rows.add(data).draw();
            ProgressBar.closeLoading();
        },
        function (jqXHR, textStatus, errorThrown) {
            ProgressBar.closeLoading();
            Dialog.showActionModal(ACTION_ERROR_TITLE, errorThrown);
        });
}