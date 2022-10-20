let errorMsg = document.getElementById("errorMsg");

function clearToken() {
  sessionStorage.clear();
  localStorage.clear();
}
clearToken();

async function login() {
  let username = document.getElementById("userName").value;
  let email = document.getElementById("email").value;
  let obj = { username: username, email: email };

  let res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json" },
  });

  let data = await res.json();
  // save the token
  sessionStorage["token"] = data.token["token"];
  sessionStorage["user_id"] = data.token["user_id"];
  localStorage["token"] = data.token["token"];
  localStorage["user_id"] = data.token["user_id"];

  if (data.token["token"] != null) {
    window.sessionStorage.setItem("token", data.token["token"]);
    window.localStorage.setItem("user_id", data.token["user_id"]);
    window.location.href = "employees.html";
  } else {
    errorMsg.style.visibility = "visible";
  }
}
