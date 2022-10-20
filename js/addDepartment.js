let userTitle = document.getElementById("userTitle");
let name = document.getElementById("name");
let departmentid = document.getElementById("departmentid");
let managerid = document.getElementById("managerid");

function user_title() {
  let username = localStorage["userTitle"];
  userTitle.innerText = ` ${username}`;
}
user_title();

//get input values

function get_input_data() {
  let obj = {
    name: name.value,
    department_id: departmentid.value,
    employee_id: managerid.value,
    employees: "",
  };
  console.log(obj);
  return obj;
}

async function addDepartment() {
  let obj = get_input_data();

  let res = await fetch(`http://localhost:5000/departments`, {
    method: "POST",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let department = await res.json();
  alert(department);
  window.location.href = "departments.html";
}

function cancel() {
  window.location.href = `departments.html`;
}
