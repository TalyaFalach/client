let shift_id = document.getElementById("shift_id");
let date = document.getElementById("date");
let start_hour = document.getElementById("start_hour");
let end_hour = document.getElementById("end_hour");
let employee = document.getElementById("employee");
let userTitle = document.getElementById("userTitle");
let tbody = document.getElementById("tbody");
let token = localStorage.getItem("token");
let emp_id = document.getElementById("emp_id");
let shift_id_to_add = document.getElementById("shift_id_to_add");

function user_title() {
  let username = localStorage["userTitle"];
  userTitle.innerText = ` ${username}`;
}
user_title();
function get_input_data() {
  let obj = {
    shift_id: shift_id.value,
    date: date.value,
    start_hour: start_hour.value,
    end_hour: end_hour.value,
    employee: employee.value,
  };
  return obj;
}

async function get_all_shifts() {
  let res = await fetch("http://localhost:5000/shifts");
  let data = await res.json();
  return data;
}

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
async function create_table() {
  let data = await get_all_shifts();
  let employees_data = await get_employees_data();
  let employees = [];
  employees_data.forEach((x) => {
    employees.push(x.employee_id);
  });

  options = `<input name='' type="number" min="${employees[-1]}" max="${
    employees.length
  }"">
    `;

  data.forEach((x) => {
    tbody.innerHTML += `
    <tr>
    <td>${x.shift_id}</td>
    <td>${x.date}</td>
    <td>${x.employee}</td>
    <td>${x.start_hour}</td>
    <td>${x.end_hour}</td>
    
    
    </tr>`;
  });
}
create_table();

async function add_employee_to_shift() {
  let res = await fetch(
    `http://localhost:5000/employees/shift/${emp_id.value}/${shift_id_to_add.value}`,
    {
      method: "PUT",
      headers: {
        "x-access-token": sessionStorage["token"],
        "Content-type": "application/json",
      },
    }
  );

  let data = await res.json();
  alert(data);
  window.location.href = "employees.html";
}

async function delete_employee_from_shift() {
  let emp_id_to_delete = document.getElementById("emp_id_to_delete");
  let shift_id_to_delete = document.getElementById("shift_id_to_delete");
  let res = await fetch(
    `http://localhost:5000/shifts/${emp_id_to_delete.value}/${shift_id_to_delete.value}`,
    {
      method: "DELETE",
      headers: {
        "x-access-token": sessionStorage["token"],
        "Content-type": "application/json",
      },
    }
  );

  let data = await res.json()
  alert(data)
  window.location.href = 'employees.html'
}

async function addShift() {
  let obj = get_input_data();

  let res = await fetch(`http://localhost:5000/shifts`, {
    method: "POST",
    headers: {
      "x-access-token": sessionStorage["token"],
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let shift = await res.json();
  alert(shift);
  window.location.href = "employees.html";
}
