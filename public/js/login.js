// Password Toggle
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// Form Validation

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", (event) => {

    // Stop the browser from refreshing
    event.preventDefault();

    // Remove extra spaces
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // Validation
    if (emailValue === "" || passwordValue === "") {

        alert("Please fill in all fields.");

        return;
       
    }
    loginButton.innerText = "Logging in...";
loginButton.disabled = true;

//The Fetch API Initialization
fetch("/api/login", {

    method: "POST",

    headers: {

        "Content-Type": "application/json"

    },

    body: JSON.stringify({

        email: emailValue,

        password: passwordValue

    })

})
.then(response => response.json())

.then(data => {

    loginButton.innerText = "Login";
    loginButton.disabled = false;

    alert(data.message);

})
.catch(error => {

    console.error(error);

    loginButton.innerText = "Login";
    loginButton.disabled = false;

    alert("Something went wrong.");

});

});