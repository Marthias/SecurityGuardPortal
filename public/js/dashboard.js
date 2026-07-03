// Get logged in user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    // If no login session → go back to login
    window.location.href = "/login.html";
}

// Show welcome message
document.getElementById("welcome").innerText = `Welcome ${user.name}`;

fetch("/api/dashboard/stats")
    .then(response => response.json())
    .then(data => {

        document.getElementById("guardsCount").innerText =
            data.stats.totalGuards;

        document.getElementById("activeCount").innerText =
            data.stats.activeGuards;

        document.getElementById("incidentCount").innerText =
            data.stats.totalIncidents;

    })
    .catch(error => {

        console.error(error);

    });

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
});