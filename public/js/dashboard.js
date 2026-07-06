if(localStorage.getItem("loggedIn") !== "true"){

   window.location.href = "/Pages/login.html";


}


// Show welcome message

document.getElementById("welcome").innerText =
"Welcome Administrator";

fetch("/api/dashboard/stats")
    .then(response => response.json())
    .then(data => {

        document.getElementById("guardsCount").innerText =
            data.stats.totalGuards;

        document.getElementById("activeCount").innerText =
            data.stats.activeGuards;

        document.getElementById("incidentCount").innerText =
            data.stats.totalIncidents;

        document.getElementById("inactiveCount").innerText =
            data.stats.inactiveGuards;

    })
    .catch(error => {

        console.error(error);

    });


function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleString();

}

updateClock();
setInterval(updateClock,1000);

// Logout

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if(!confirmLogout){
        return;
    }

    localStorage.removeItem("loggedIn");

    window.location.href = "/pages/login.html";

});
