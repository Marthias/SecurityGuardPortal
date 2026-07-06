// Authentication
if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/Pages/login.html";

}

const incidentForm = document.getElementById("incidentForm");
const message = document.getElementById("message");
const searchIncident = document.getElementById("searchIncident");
const toast = document.getElementById("toast");

let editingIncidentId = null;

incidentForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const incidentDate = document.getElementById("incidentDate").value;
    const status = document.getElementById("status").value;

    const url = editingIncidentId
        ? `/api/incidents/${editingIncidentId}`
        : "/api/incidents";

    const method = editingIncidentId ? "PUT" : "POST";

    fetch(url, {

        method,

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            title,
            description,
            location,
            incidentDate,
            status

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.success) {

            message.style.color = "green";
            message.innerText = data.message;

            showToast(data.message);

            incidentForm.reset();

            editingIncidentId = null;

            document.querySelector("button[type='submit']").innerText = "Add Incident";

            loadIncidents();

        } else {

            message.style.color = "red";
            message.innerText = data.message;

            showToast(data.message, false);

        }

    })

    .catch(error => {

        console.error(error);

    });

});

function loadIncidents() {

    fetch("/api/incidents")

    .then(response => response.json())

    .then(data => {

        const tbody = document.querySelector("#incidentTable tbody");

        tbody.innerHTML = "";

        const keyword = searchIncident.value.toLowerCase();

        const filteredIncidents = data.incidents.filter((incident) => {

            return incident.title
                .toLowerCase()
                .includes(keyword);

        });

        let html = "";

        filteredIncidents.forEach((incident, index) => {

            html += `

            <tr>

                <td>${index + 1}</td>

                <td>${incident.title}</td>

                <td>${incident.location}</td>

                <td>${incident.incident_date}</td>

                <td>

                    <span class="${incident.status}">
                        ${incident.status}
                    </span>

                </td>

                <td>

                    <button class="editBtn"

                        onclick="editIncident(

                        ${incident.id},

                        '${incident.title}',

                        '${incident.description}',

                        '${incident.location}',

                        '${incident.incident_date}',

                        '${incident.status}')">

                        Edit

                    </button>

                    <button class="deleteBtn"

                        onclick="deleteIncident(${incident.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        tbody.innerHTML = html;

    })

    .catch(error => {

        console.error(error);

    });

}

loadIncidents();

function editIncident(
    id,
    title,
    description,
    location,
    incidentDate,
    status
){

    editingIncidentId = id;

    document.getElementById("title").value = title;

    document.getElementById("description").value = description;

    document.getElementById("location").value = location;

    document.getElementById("incidentDate").value = incidentDate;

    document.getElementById("status").value = status;

    document.querySelector("button[type='submit']").innerText =
    "Update Incident";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

function deleteIncident(id){

    if(!confirm("Delete this incident?")){

        return;

    }

    fetch(`/api/incidents/${id}`,{

        method:"DELETE"

    })

    .then(response=>response.json())

    .then(data=>{

        message.style.color="green";

        message.innerText=data.message;

        showToast(data.message);

        loadIncidents();

    })

    .catch(error=>{

        console.error(error);

        showToast("Delete failed!",false);

    });

}

searchIncident.addEventListener("keyup", () => {

    loadIncidents();

});

function showToast(message, success=true){

    toast.innerText=message;

    toast.className="";

    if(success){

        toast.classList.add("show");

    }else{

        toast.classList.add("show","error");

    }

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    localStorage.removeItem("loggedIn");

    window.location.href = "/Pages/login.html";

});





