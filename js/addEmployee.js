let nav = document.getElementById("navbar");
let fname = document.getElementById("firstName");
let lname = document.getElementById("lastName");
let employeeId = document.getElementById("employeeId");
let startWorkYear = document.getElementById("startWorkYear");
let departmentId = document.getElementById("departmentId");

let userTitle = document.getElementById("userTitle");

function user_title() {
  let username = localStorage["userTitle"];
  userTitle.innerText = ` ${username}`;
}
user_title();


function get_input_data() {
  let obj = {
    firstName: fname.value,
    lastName: lname.value,
    employee_id: employeeId.value,
    department_id: departmentId.value,
    start_work_year: startWorkYear.value,
    shifts: ""
    
  };
  console.log(obj);
  return obj;
}

async function addEmployee() {
  let obj = get_input_data();

  let res = await fetch(`http://localhost:5000/employees`, {
    method: "POST",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let employee = await res.json();
  alert(employee);
  window.location.href = "employees.html";
}

function cancel() {
  window.location.href = 'employees.html'
}
//! log out
function logOut() {
  sessionStorage["token"] = null;
  window.location = "login.html";
}
