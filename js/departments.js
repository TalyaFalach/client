let userTitle = document.getElementById("userTitle");
let tbody = document.getElementById("tbody");
const token = localStorage.getItem("token");

function user_title() {
  let username = localStorage["userTitle"];
  userTitle.innerText = ` ${username}`;
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
//! get departments data
async function create_departments_table() {
    let departments = await get_department_data()
  if (token != null) {
    
    console.log(departments);
    for (let i = 0; i < departments.length; i++) {
      let department = `<tr>
        <td>
        <a href="#" onclick="get_chosen_department(event)">${
          departments[i].name
        }</a>
        </td>
            <td> <a href="#" onclick="get_chosen_employee(event)">${
              departments[i].manager.firstName +
              " " +
              departments[i].manager.lastName
            }</a></td>
            <td>
        `;
      for (let x = 0; x < departments[i].employees.length; x++) {
        let employees = `<ul class="mx-auto text-center">
        <li>Name: <a href="#" onclick="get_chosen_employee(event)">${
          departments[i].employees[x].firstName +
          " " +
          departments[i].employees[x].lastName
        }</a> </li>
       
        <li>ID: ${departments[i].employees[x].employee_id}</li> 
        <hr>       
        </ul>`;
        department += employees
      }
      tbody.innerHTML += department
    }
  }
}
create_departments_table();




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

//! get chosen department
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