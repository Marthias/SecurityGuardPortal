// ===============================
// Authentication Check
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/pages/login.html";

}

// ===============================
// Global Variables
// ===============================

const searchGuard = document.getElementById("searchGuard");

const toast = document.getElementById("toast");

const guardForm = document.getElementById("guardForm");

const message = document.getElementById("message");

let editingGuardId = null;

// ===============================
// Add / Update Guard
// ===============================

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

    showToast(data.message);

    guardForm.reset();

    editingGuardId = null;

    document.querySelector("button[type='submit']").innerText = "Add Guard";

    loadGuards();

} else {

    message.style.color = "red";
    message.innerText = data.message;

    showToast(data.message, false);

}

    })

    .catch(error => {

        console.error(error);

        showToast("Something went wrong!", false);

    });

});

// ===============================
// Load Guards
// ===============================

function loadGuards() {

    fetch("/api/guards")

    .then(response => response.json())

    .then(data => {

        const tbody = document.querySelector("#guardTable tbody");

        tbody.innerHTML = "";

        const keyword = searchGuard.value.toLowerCase();

        const filteredGuards = data.guards.filter((guard) => {

            return guard.full_name
                .toLowerCase()
                .includes(keyword);

        });

        filteredGuards.forEach((guard, index) => {

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

                    onclick="editGuard(

                    ${guard.id},

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


loadGuards();

// ===============================
// Edit Guard
// ===============================

function editGuard(id, fullName, phone, email, address, status) {

    editingGuardId = id;

    document.getElementById("fullName").value = fullName;

    document.getElementById("phone").value = phone;

    document.getElementById("email").value = email;

    document.getElementById("address").value = address;

    document.getElementById("status").value = status;

    document.querySelector("button[type='submit']").innerText = "Update Guard";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



// ===============================
// Delete Guard
// ===============================

function deleteGuard(id) {

    if (!confirm("Are you sure you want to delete this guard?")) {

        return;

    }

    fetch(`/api/guards/${id}`, {

        method: "DELETE"

    })

    .then(response => response.json())

    .then(data => {

        showToast(data.message);

        loadGuards();

    })

    .catch(error => {

        console.error(error);

        showToast("Delete failed!", false);

    });

    
loadGuards();


}

// ===============================
// Search
// ===============================

searchGuard.addEventListener("keyup", () => {

    loadGuards();

});

// ===============================
// Toast Notification
// ===============================

function showToast(message, success = true) {

    toast.innerText = message;

    toast.className = "";

    if (success) {

        toast.classList.add("show");

    } else {

        toast.classList.add("show", "error");

    }

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}