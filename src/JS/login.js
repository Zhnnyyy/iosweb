import config from "../config/config.development.js";
import { Fetch } from "./model/bridge.js";
import { showMessage, loading } from "./model/MyAlert.js";
$(() => {
  const validator = navigator.userAgent;
   if (!validator.match(/iPhone/i)) {
    window.location.href = "page.html";
   return;
   }
  if (localStorage.getItem("isLoggedIn")) {
    window.location.href = "dashboard.html";
    return;
  }
  doLogin();

  $("#forgotmypassword").click(() => {
    window.location.href = "forgotpassword.html";
  });
});

const doLogin = () => {
  $("#loginfrm").submit(function (e) {
    e.preventDefault();
    const input = new FormData(this);
    const data = {
      username: input.get("username"),
      password: input.get("password"),
    };
    Fetch(
      config.login,
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
            checkUserEmail(input.get("username"));
          });
        }
      },
      data
    );
  });
};

const checkUserEmail = (username) => {
  const data = {
    id: username,
  };
  Fetch(
    config.checkUserEmail,
    "POST",
    (result) => {
      if (!result.loading) {
        const res = result.data;
        if (res.Error) {
          showMessage("Error", "Please try again...", "error");
          return;
        }
        if (res.haveEmail) {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("UID", username);
          window.location.href = "dashboard.html";
        } else {
          localStorage.setItem("setEmail", true);
          localStorage.setItem("UID", username);
          window.location.href = "email.html";
        }
      }
    },
    data
  );
};
