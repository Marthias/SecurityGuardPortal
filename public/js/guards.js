// Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));

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

    fetch("/api/guards", {

        method: "POST",

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
                    data-id="${guard.id}">
                     Edit
                </button>

                <button class="deleteBtn"
                    data-id="${guard.id}">
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