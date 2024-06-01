import config from "../config/config.development.js";
import { Fetch } from "./model/bridge.js";
import { showMessage, loading } from "./model/MyAlert.js";
$(() => {
  const validator = navigator.userAgent;
  if (!validator.match(/iPhone/i)) {
    window.location.href = "page.html";
   return;
   }
 
  
  $("#addEmailfrm").submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    const email = formData.get("email");
    const otpcode = formData.get("otp");
    const pass1 = formData.get("pass1");
    const pass2 = formData.get("pass2");
    const origCode = localStorage.getItem("OTP");
    if (origCode != otpcode) {
      showMessage("Warning", "Verification code is incorrect", "info");
      return;
    }
    if (pass1 != pass2) {
      showMessage("Warning", "Password doesn't match", "info");
      return;
    }
    const data = {
      id: localStorage.getItem("UID"),
      email: email,
      pass: pass1,
      deviceid: "",
    };
    Fetch(
      config.addEmail,
      "POST",
      (result) => {
        if (result.loading) {
          loading(true);
        }
        if (!result.loading) {
          loading(false);
          const res = result.data;
          if (res.Error) {
            showMessage("Error", res.Error, "error");
            return;
          }
          showMessage("Success", "Information has been added", "success").then(
            () => {
              localStorage.setItem("setEmail", false);
              localStorage.setItem("isLoggedIn", true);
              window.location.href = "dashboard.html";
            }
          );
        }
      },
      data
    );
  });

  $("#sendOTP").click(() => {
    const email = $("#email").val();
    const mcode = otpcode();
    localStorage.setItem("OTP", mcode);
    const data = {
      email: email,
      body: `You verification code: ${mcode}`,
    };
    if (email.length == 0) {
      showMessage("Warning", "Please enter email", "info");
      return;
    }
    Fetch(
      config.otp,
      "POST",
      (result) => {
        if (result.loading) {
          loading(true);
        }
        if (!result.loading) {
          loading(false);
          const res = result.data;
          if (res.Error) {
            showMessage("Error", res.Error, "error");
            return;
          }
          showMessage("Success", "Verification code has been sent", "success");
        }
      },
      data
    );
  });
});

function otpcode() {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return randomNumber;
}
