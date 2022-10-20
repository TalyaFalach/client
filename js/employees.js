let navbar = document.getElementById("navbar");
let tbody = document.getElementById("tbody");
let userTitle = document.getElementById("userTitle");
let dropdown = document.getElementById("dropdown");
let token = localStorage.getItem("token");

//!clear localStorage
localStorage.removeItem("user_id_to_edit");
localStorage.removeItem("department_id_to_edit");
sessionStorage.removeItem("user_id_to_edit");
sessionStorage.removeItem("department_id_to_edit");

//! get user name
async function user_title() {
  let userId = localStorage.getItem("user_id");
  let res = await fetch(`http://localhost:5000/employees/${userId}`, {
    method: "GET",
    headers: { "x-access-token": token },
  });

  let data = await res.json();
  let employee = data.employees[0];

  if (data == null) {
    window.location.href = "login.html";
    alert("User does not exist ");
  } else {
    let username = employee.firstName + " " + employee.lastName;
    localStorage.setItem("userTitle", username);
    userTitle.innerText = ` ${username}`;
  }
}
user_title();

//! get employees data
async function get_employees_data() {
  if (token != null) {
    let res = await fetch(`http://localhost:5000/employees`, {
      method: "GET",
      headers: { "x-access-token": token },
    });
    let data = await res.json();
    let employees = data.employees;
    return employees;
  }
}
//! get departments data
async function get_department_data() {
  if (token != null) {
    let res = await fetch(`http://localhost:5000/departments`, {
      method: "GET",
      headers: { "x-access-token": token },
    });
    let departments = await res.json();

    return departments;
  }
}

//! create employees table
async function create_employees_table() {
  if (token != null) {
    let employees = await get_employees_data();

    tbody.innerHTML = ``;
    for (let i = 0; i < employees.length; i++) {
      
      let employee = `<tr>
    <td class="text-center ">
      <a href="#" class="link " onclick="get_chosen_employee(event)">${
        employees[i].firstName + " " + employees[i].lastName
      }
      </a>
    </td>
    <td class="text-center "><a href="#" class="link" onclick="get_chosen_department(event)">${
      employees[i].department_name
    }</a></td>
    <td>    
    `;

      for (let x = 0; x < employees[i].shifts.length; x++) {
        
        let shifts = ` <ul class="mx-auto text-center">
      <li>
       date: ${employees[i].shifts[x].date}
      </li>
      <li>
       start_hour: ${employees[i].shifts[x].start_hour}
      </li>
      <li>
       end_hour: ${employees[i].shifts[x].end_hour}
       </ul></li>
      
      `;
        employee += shifts;
      }
      tbody.innerHTML += employee;
    }
  } else {
    window.location.href = "error404.html";
  }
}
create_employees_table();

async function create_dropdown() {
  let res = await fetch(`http://localhost:5000/departments`, {
    method: "GET",
    headers: { "x-access-token": token },
  });
  let departments = await res.json();

  departments.forEach((x) => {
    dropdown.innerHTML += `
       <li class="dropdown-item" onclick="get_chosen_department_name(event)">${x.name}</li>`;
  });
  let departments_name = [];
  departments.forEach((x) => departments_name.push(x.name));

  return departments_name;
}
create_dropdown();

async function get_chosen_department_name(event) {
  let name = event.target.innerText;
  let employees = await get_employees_data();

  tbody.innerHTML = ``;
  let sorted_arr = employees.filter((x) => x.department_name == name);
  console.log("sorted_arr", sorted_arr);
  for (let i = 0; i < sorted_arr.length; i++) {
    let employee = `<tr>
    <td>
      <a href="#" class="link" onclick="get_chosen_employee(event)">${
        sorted_arr[i].firstName + " " + sorted_arr[i].lastName
      }
      </a>
    </td>
    <td><a href="#" class="link">${sorted_arr[i].department_name}</a></td>
    <td>    
    `;

    for (let x = 0; x < sorted_arr[i].shifts.length; x++) {
      let shifts = ` <ul class="mx-auto text-center">
      <li>
       date: ${sorted_arr[i].shifts[x].date}
      </li>
      <li>
       start_hour: ${sorted_arr[i].shifts[x].start_hour}
      </li>
      <li>
       end_hour: ${sorted_arr[i].shifts[x].end_hour}
       </ul></li>
      
      `;
      employee += shifts;
    }
    tbody.innerHTML += employee;
  }
}

async function get_chosen_employee(event) {
  let employees = await get_employees_data();
  let user_full_name = event.target.innerText.split(" ");
  console.log(user_full_name);

  for (let i = 0; i < employees.length; i++) {
    if (
      employees[i].firstName == user_full_name[0] &&
      employees[i].lastName == user_full_name[1]
    ) {
      localStorage.setItem("user_id_to_edit", employees[i].employee_id);
      console.log(employees[i].employee_id);
    }
  }
  window.location.href = "editEmployee.html";
}

async function get_chosen_department(event) {
  let departments = await get_department_data();

  let department_name = event.target.innerText;
  console.log(department_name);
  let department_to_edit = departments.filter((x) => x.name == department_name);
  localStorage.setItem(
    "department_id_to_edit",
    department_to_edit[0].department_id
  );

  window.location.href = "editDepartment.html";
}

//! log out
function logOut() {
  sessionStorage["token"] = null;
  window.location = "login.html";
}
