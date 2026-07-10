// Authentication

if(localStorage.getItem("loggedIn") !== "true"){

    window.location.href="/Pages/login.html";

}

// Load Report Statistics

fetch("/api/dashboard/stats")

.then(response=>response.json())

.then(data=>{

    document.getElementById("reportGuards").innerText =
    data.stats.totalGuards;

    document.getElementById("reportIncidents").innerText =
    data.stats.totalIncidents;

    document.getElementById("reportActive").innerText =
    data.stats.activeGuards;

    document.getElementById("reportInactive").innerText =
    data.stats.inactiveGuards;

})

.catch(error=>{

    console.error(error);

});

// Logout

document.getElementById("logoutBtn")

.addEventListener("click",()=>{

    localStorage.removeItem("loggedIn");

    window.location.href="/Pages/login.html";

});

document.getElementById("exportGuards")

.addEventListener("click", () => {

    window.open("/api/reports/guards");

});

document.getElementById("exportIncidents")

.addEventListener("click", () => {

    window.open("/api/reports/incidents");

});