let userTitle = document.getElementById("userTitle");
let nav = document.getElementById("navbar");
let usersTable = document.getElementById("usersTable");

function user_title() {
  let username = localStorage["userTitle"];
  userTitle.innerText = ` ${username}`;
}
user_title();




async function get_users_data()
{
    let res = await fetch('http://localhost:5000/usersdb')
    let data = await res.json()
    console.log(data);

    data.forEach(e => {
        usersTable.innerHTML += `
        <tr>
        <td>${e.fullName}</td>
        <td>${e.num_of_actions}</td>
        <td>${'current actions...'}</td>
       
        </tr>
        `
    });
}

get_users_data();






// logout
function logOut() {
  window.location = "login.html";
}