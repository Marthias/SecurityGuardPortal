// Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
let editingGuardId = null;

if (!user) {
    window.location.href = "/login.html";
}

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
});

// Form
const guardForm = document.getElementById("guardForm");

const message = document.getElementById("message");

guardForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const email = document.getElementById("email").value.trim();

    const address = document.getElementById("address").value.trim();

    const status = document.getElementById("status").value;

const url = editingGuardId
    ? `/api/guards/${editingGuardId}`
    : "/api/guards";

const method = editingGuardId ? "PUT" : "POST";

fetch(url, {

    method,

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        fullName,
        phone,
        email,
        address,
        status
    })

})

    .then(response => response.json())

    .then(data => {

        if (data.success) {

            message.style.color = "green";

            message.innerText = data.message;

            guardForm.reset();

            editingGuardId = null;

            document.querySelector("button[type='submit']").innerText = "Add Guard";

            loadGuards();

        } else {

            message.style.color = "red";

            message.innerText = data.message;

        }

    })

    .catch(error => {

        console.error(error);

    });

});

function loadGuards() {

    fetch("/api/guards")

    .then(response => response.json())

    .then(data => {

        const tbody = document.querySelector("#guardTable tbody");

        tbody.innerHTML = "";

        data.guards.forEach((guard, index) => {

            tbody.innerHTML += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${guard.full_name}</td>

                    <td>${guard.phone}</td>

                    <td>
                        <span class="${guard.status}">
                            ${guard.status}
                        </span>
                    </td>

                    <td>

                        <button class="editBtn"
                            onclick="editGuard(${guard.id},
                            '${guard.full_name}',
                            '${guard.phone}',
                            '${guard.email}',
                            '${guard.address}',
                            '${guard.status}')">

                            Edit

                        </button>

                        <button class="deleteBtn"
                            onclick="deleteGuard(${guard.id})">

                            Delete

                        </button>

                    </td>

                </tr>
            `;

        });

    });

}

// Load immediately when page opens
loadGuards();

function editGuard(id, fullName, phone, email, address, status){

    editingGuardId = id;

    document.getElementById("fullName").value = fullName;

    document.getElementById("phone").value = phone;

    document.getElementById("email").value = email;

    document.getElementById("address").value = address;

    document.getElementById("status").value = status;

    document.querySelector("button[type='submit']").innerText = "Update Guard";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

function deleteGuard(id){

    const confirmed = confirm("Are you sure you want to delete this guard?");

    if(!confirmed){
        return;
    }

    fetch(`/api/guards/${id}`,{

        method:"DELETE"

    })

    .then(response=>response.json())

    .then(data=>{

        message.style.color="green";

        message.innerText=data.message;

        loadGuards();

    })

    .catch(error=>{

        console.error(error);

    });

}