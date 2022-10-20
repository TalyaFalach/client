let nav = document.getElementById("navbar");
let departmentName = document.getElementById("departmentName");
let departmentId = document.getElementById("departmentId");
let employeeId = document.getElementById("employeeId");
let userTitle = document.getElementById("userTitle");
const token = localStorage.getItem("token");

function user_title() {
  let username = localStorage.getItem("userTitle");
  userTitle.innerText = ` ${username}`;
}
user_title();

//fill form
async function fill_form() {
  if (sessionStorage["token"] != null) {
    let department_id_to_edit = localStorage["department_id_to_edit"];
    console.log(department_id_to_edit);
    let res = await fetch(
      `http://localhost:5000/departments/${department_id_to_edit}`
    );
    data = await res.json();
    let department = data[0];

    departmentName.value = department.name;
    departmentId.value = department.department_id;
    employeeId.value = department.employee_id;
  }
}
fill_form();

function get_input_data() {
  let obj = {
    name: departmentName.value,
    department_id: departmentId.value,
    employee_id: employeeId.value,
  };
  console.log(obj);
  return obj;
}

async function editDepartment() {
  let obj = get_input_data();
  let department_id_to_edit = localStorage["department_id_to_edit"];
  let res = await fetch(
    `http://localhost:5000/departments/${department_id_to_edit}`,
    {
      method: "PUT",

      headers: {
        "x-access-token": sessionStorage["token"],
        "Content-type": "application/json",
      },
      body: JSON.stringify(obj),
    }
  );

  let department = await res.json();
  alert(department);
  window.location.href = "employees.html";
}

async function get_employees_data() {
  if (token != null) {
    let res = await fetch(`http://localhost:5000/employees`, {
      method: "GET",
      headers: { "x-access-token": token },
    });
    let data = await res.json();
    let employees = data.employees;
    console.log(employees);
    return employees;
  }
}

async function create_table() {
  let employees = await get_employees_data();
  let department_id = localStorage.getItem("department_id_to_edit");
  let arr = employees.filter((x) => x.department_id != department_id);
  arr.forEach((x) => {
    document.getElementById("tbody").innerHTML += `
  <tr>
  <td>${x.firstName + " " + x.lastName}</td>
  <td> id: ${x.department_id} <br> Name: ${x.department_name}</td>
  <td>  ${x.employee_id}</td>
  <td><button class="btn btn-success" id="${
    x.employee_id
  }" onclick="switch_department(event)">Add</button></td>
  
  `;
  });
}
create_table();

async function switch_department(event) {
  let employee_id = event.target.id;
  let res = await fetch(`http://localhost:5000/employees/${employee_id}`, {
    method: "GET",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
  });
  let data = await res.json();
  let employee = data.employees[0];

  let obj = {
    firstName: employee.firstName,
    lastName: employee.lastName,
    employee_id: employee.employee_id,
    start_work_year: employee.start_work_year,
    department_id: localStorage.getItem("department_id_to_edit"),
  };

  let put_res = await fetch(`http://localhost:5000/employees/${employee_id}`, {
    method: "PUT",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  window.location.href='employees.html'
  return put_res.json()
}

// async function editEmployee() {
//   let obj = get_input_data();
//   let user_id_to_edit = localStorage.getItem("user_id_to_edit");
//   let res = await fetch(`http://localhost:5000/employees/${user_id_to_edit}`, {
//     method: "PUT",
//     headers: {
//       "x-access-token": sessionStorage["token"],
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify(obj),
//   });

//! log out
function logOut() {
  sessionStorage["token"] = null;
  window.location = "login.html";
}
