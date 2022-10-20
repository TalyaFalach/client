let nav = document.getElementById("navbar");
let fname = document.getElementById("firstName");
let lname = document.getElementById("lastName");
let employeeId = document.getElementById("employeeId");
let startWorkYear = document.getElementById("startWorkYear");
let departmentId = document.getElementById("departmentId");
let userTitle = document.getElementById("userTitle");
let shifts_table = document.getElementById("shifts_table");
let shifts_to_connect = document.getElementById("shifts_to_connect");

function user_title() {
  let username = localStorage.getItem("userTitle");
  userTitle.innerText = ` ${username}`;
}
user_title();

async function fill_form_and_shifts_table() {
  let token = localStorage.getItem("token");
  let user_id_to_edit = localStorage.getItem("user_id_to_edit");

  let res = await fetch(`http://localhost:5000/employees/${user_id_to_edit}`, {
    method: "GET",
    headers: { "x-access-token": token },
  });
  let data = await res.json();
  let employee = data.employees[0];
  console.log("employee", employee);

  fname.value = employee.firstName;
  lname.value = employee.lastName;
  employeeId.value = employee.employee_id;
  startWorkYear.value = employee.start_work_year;
  departmentId.value = employee.department_id;

  let shifts = employee.shifts;
  shifts.forEach((x) => {
    shifts_table.innerHTML += `
    <tr>
    
    <td> ${x.date} </td>
    <td> ${x.start_hour} </td>
    <td> ${x.end_hour} </td>
    </tr>
    `;
  });
  return employee;
}

function get_input_data() {
  let obj = {
    firstName: fname.value,
    lastName: lname.value,
    employee_id: employeeId.value,
    department_id: departmentId.value,
    start_work_year: startWorkYear.value,
  };
  return obj;
}

async function editEmployee() {
  let obj = get_input_data();
  let user_id_to_edit = localStorage.getItem("user_id_to_edit");
  let res = await fetch(`http://localhost:5000/employees/${user_id_to_edit}`, {
    method: "PUT",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  if (
    localStorage.getItem("user_id") == localStorage.getItem("user_id_to_edit")
  ) {
    localStorage.removeItem("user_id_to_edit");
  }

  let employee = await res.json();
  window.location.href = "employees.html";

  return employee;
}

async function deleteEmployee() {
  let user_id_to_delete = localStorage.getItem("user_id_to_edit");

  let response = await fetch(
    `http://localhost:5000/employees/${user_id_to_delete}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  let data = await response.json();
  console.log(data);
  if (
    localStorage.getItem("user_id") == localStorage.getItem("user_id_to_edit")
  ) {
    alert(data);
    window.location.href = "login.html";
  } else {
    alert(data);
    window.location.href = "employees.html";
  }
}

async function get_all_shifts_data() {
  let response = await fetch(`http://localhost:5000/shifts`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  let current_employee = await fill_form_and_shifts_table();
  console.log("current_employee", current_employee);
  let existing_shifts = [];
  current_employee.shifts.forEach((x) => {
    existing_shifts.push(x.shift);
  });
  console.log(existing_shifts);

  let data = await response.json();
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    for (let x = 0; x < existing_shifts.length; x++) {
      if (data[i].shift_id == existing_shifts[x]) {
        data.splice(i, 1);
      }
    }
  }
  console.log(data);

  data.forEach((x) => {
    shifts_to_connect.innerHTML += `
    <tr>
    <td>${x.shift_id}</td>
    <td>${x.date}</td>
    <td>${x.start_hour}</td>
    <td>${x.end_hour}</td>
    <td> <button class="btn btn-success" id="${x.shift_id}" onclick="connect_new_shift(event)">Add Shift</button></td>
    </tr>
    `;
  });
}
get_all_shifts_data();

async function connect_new_shift(event)
{
  let shift = event.target.id
  let employee = localStorage.getItem("user_id_to_edit")
  let res = await fetch(
    `http://localhost:5000/employees/shift/${employee}/${shift}`,
    {
      method: "PUT",
      headers: {
        "x-access-token": sessionStorage["token"],
        "Content-type": "application/json",
      },
      
    }
  );
  let data = await res.json()
  alert(data)
  window.location.href = "employees.html"
}

function logOut() {
  window.location = "login.html";
}
