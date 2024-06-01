import config from "../config/config.development.js";
import { Fetch } from "./model/bridge.js";
import { showMessage, loading, showOptions } from "./model/MyAlert.js";
$(() => {
  const validator = navigator.userAgent;
   if (!validator.match(/iPhone/i)) {
     window.location.href = "page.html";
    return;
  }

  //HAHA
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "index.html";
    return;
  }
  btnAct();
  loadQRCode();
  $("#signoutBtn").click(() => {
    showOptions("Hey", "You want to logout?", "info", () => {
      //   localStorage.clear();
      const data = {
        ID: localStorage.getItem("UID"),
      };
      Fetch(
        config.logout,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            const res = result.data;
            if (res.Error) {
              showMessage("Error", res.msg, "error");
              return;
            }
            localStorage.clear();
            window.location.href = "index.html";
          }
        },
        data
      );
    });
  });
});

const btnAct = () => {
  $(".nav-btn").click(function (e) {
    e.preventDefault();
    $(".nav-btn").removeClass("active");
    $(this).addClass("active");
    menuBtn($(this).data("id"));
  });
};
const toggleContent = (data) => {
  $(".content").css("display", "none");
  $(data).css("display", "block");
};

const menuBtn = (data) => {
  switch (data) {
    case "attendance":
      toggleContent(".attendance");
      loadAttendance();
      break;
    case "payroll":
      toggleContent(".payroll");
      loadPayroll();
      break;
    case "qrcode":
      toggleContent(".qrcode");
      loadQRCode();
      break;
    case "request-history":
      toggleContent(".request-history");
      requestHistory();
      break;
    case "request":
      toggleContent(".request");
      request();
      break;
  }
};

const loadPayroll = () => {
  const tbl = $(".payroll .body-content").empty();
  const data = {
    id: localStorage.getItem("UID"),
  };
  Fetch(
    config.payrollCutoff,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        $.each(res, (i, data) => {
          tbl.append(
            `<details class="clickme" data-cutoff="${data.Cutoff}" data-created="${data.Created}">
            <summary> <div class="msummary">
                  <div class="sum1"><span>${data.Cutoff}</span><span>${data.Created}</span></div>
                </div></summary>
            <div class="payrolldetails"></div>
          </details>`
          );
        });
      }

      $(".clickme")
        .off("click")
        .on("click", function () {
          const cutoff = $(this).data("cutoff");
          const created = $(this).data("created");
          const element = $(this).find(".payrolldetails");
          loadDetails(cutoff, created, element);
        });
    },
    data
  );
};

const loadDetails = (cutoff, created, content) => {
  const tbl = content.empty();
  const data = {
    id: localStorage.getItem("UID"),
    cutoff: cutoff,
    date: created,
  };
  Fetch(
    config.cutoffdetails,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        const raw = res.details;
        tbl.append(
          `<div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Payment Date</h5>
                    <span>${raw.Created}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>Employee ID</h5>
                    <span>${raw.EmployeeID}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>Employee Name</h5>
                    <span>${res.name}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>Payroll Period</h5>
                    <span>${raw.Cutoff}</span>
                  </div>
                </div>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Rate</h5>
                    <span>${raw.Rate}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>WorkDays</h5>
                    <span>${raw.WorkDays}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>Leave</h5>
                    <span>${raw.TotalLeave}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>Undertime</h5>
                    <span>${raw.Undertime}</span>
                  </div>
                </div>
              </div>
              <div class="subtotal">
                <h4>Basic Pay: <span>${raw.BasicPay}</span></h4>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Overtime Hours</h5>
                    <span>${raw.OvertimeHrs}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>Rate per hour</h5>
                    <span>${res.OTRate}</span>
                  </div>
                </div>
              </div>
              <div class="subtotal">
                <h4>Overtime: <span>${raw.OvertimePay}</span></h4>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Regular Holiday</h5>
                    <span>${raw.RegularHoliday}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>Special Holiday</h5>
                    <span>${raw.SpecialHoliday}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>Regular Holiday Pay</h5>
                    <span>${raw.RegularHolidayPay}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>Special Holiday Pay</h5>
                    <span>${raw.SpecialHolidayPay}</span>
                  </div>
                </div>
              </div>
              <div class="subtotal">
                <h4>Holiday Pay: <span>${res.holidaypay}</span></h4>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Allowance</h5>
                    <span>${raw.Allowance}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>Salary Adjustment</h5>
                    <span>${raw.SalaryAdjustment}</span>
                  </div>
                </div>
              </div>
              <hr />
              <div class="subtotal">
                <h4>Total Earnings: <span>${raw.TotalEarnings}</span></h4>
              </div>
              <hr />
              <div class="subtotal">
                <h4>Gross Pay: <span>${raw.Grosspay}</span></h4>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>PhilHealth</h5>
                    <span>${raw.PHILHEALTH}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>SSS</h5>
                    <span>${raw.SSS}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="detailsbox">
                    <h5>HDMF</h5>
                    <span>${raw.PAGIBIG}</span>
                  </div>
                  <div class="detailsbox">
                    <h5>TAX</h5>
                    <span>${raw.TAX}</span>
                  </div>
                </div>
              </div>
              <div class="subtotal">
                <h4>Total: <span>${res.statutory}</span></h4>
              </div>
              <hr />
              <div class="b1">
                <div class="left">
                  <div class="detailsbox">
                    <h5>Deduction</h5>
                    <span>${raw.Deduction}</span>
                  </div>
                </div>
                <div class="right"></div>
              </div>
              <hr />
              <div class="subtotal">
                <h4>Total Deduction: <span>${raw.TotalDeduction}</span></h4>
              </div>
              <hr />
              <div class="subtotal">
                <h4>Net Pay: <span>${raw.Netpay}</span></h4>
              </div>`
        );
      }
    },
    data
  );
};

const loadQRCode = () => {
  const uid = localStorage.getItem("UID");
  const deviceID = "000000";
  const raw = btoa(`${uid}:${deviceID}`);
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: raw,
    image: "src/img/logo.png",
    dotsOptions: {
      color: "#000",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
    },
  });
  $("#qrbox").empty();
  qrCode.append(document.getElementById("qrbox"));
};
const loadAttendance = () => {
  const data = {
    uid: localStorage.getItem("UID"),
  };
  Fetch(
    config.attendance,
    "POST",
    (result) => {
      const tbl = $(".attendance .body-content").empty();
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        $.each(res, (i, data) => {
          const timein = data.TimeIn == null ? "--" : data.TimeIn;
          const timeout = data.TimeOut == null ? "--" : data.TimeOut;
          tbl.append(
            `<div class="attendancebox">
                <center><span>${data.Date}</span></center>
                <div class="time">
                  <h5>Time In</h5>
                  <h5>${timein}</h5>
                </div>
                <div class="time">
                  <h5>Time Out</h5>
                  <h5>${timeout}</h5>
                </div>
              </div>`
          );
        });
      }
    },
    data
  );
};
const requestHistory = () => {
  const data = {
    id: localStorage.getItem("UID"),
  };
  Fetch(
    config.showReqHistory,
    "POST",
    (result) => {
      const tbl = $(".request-history .body-content").empty();
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        $.each(res, (i, data) => {
          tbl.append(
            `<div class="requestbox">
            <div class="rbox1">
              <h5>Status: <span class="mvalue">${data.status}</span></h5>
              <h5>Date: <span class="mvalue">${data.Date}</span></h5>
            </div>
            <div class="rbox2">
              <h5>Type: <span class="mvalue">${data.Name}</span></h5>
            </div>
          </div>`
          );
        });
      }
    },
    data
  );
};
const request = () => {
  Fetch(config.loadItem, "GET", (result) => {
    if (!result.loading) {
      const res = result.data;
      const ele = $("#leavetype").empty();
      ele.append(`<option value="0" disabled selected>Type</option>`);
      $.each(res, (i, data) => {
        ele.append(`<option value="${data.key}">${data.value}</option>`);
      });
    }
  });

  $("#submitrequest")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      const data = {
        uid: localStorage.getItem("UID"),
        startdate: $("#startdate").val(),
        enddate: $("#enddate").val(),
        type: $("#leavetype").val(),
        reason: $("#reason").val(),
      };
      if ($("#startdate").val() == "" || $("#enddate").val() == "") {
        showMessage("Warning", "Date is required", "info");
        return;
      }
      if ($("#leavetype").val() == null) {
        showMessage("Warning", "Please select type", "info");
        return;
      }
      if ($("#startdate").val() > $("#enddate").val()) {
        showMessage("Warning", "Invalid set of date", "info");
        return;
      }
      if (
        $("#startdate").val() < currentDate() ||
        $("#enddate").val() < currentDate()
      ) {
        showMessage("Warning", "Date should be present", "info");
        return;
      }
      Fetch(
        config.sendRequest,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            const res = result.data;
            if (res.Error) {
              showMessage("Error", res.msg, "error");
              return;
            }
            showMessage("Success", res.msg, "success").then(() => {
              $("#sendRequest")[0].reset();
            });
          }
        },
        data
      );
    });

  // $("#submitrequest")
  //   .off("click")
  //   .on("click", function (e) {

  //   });
};

const currentDate = () => {
  return new Date().toISOString().substr(0, 10);
};
