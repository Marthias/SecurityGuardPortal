// Password Toggle
const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const spinner = document.getElementById("spinner");

const buttonText = document.getElementById("buttonText");

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

const message = document.getElementById("message");

loginForm.addEventListener("submit", (event) => {

    // Stop the browser from refreshing
    event.preventDefault();

    // Remove extra spaces
    const emailValue = email.value.trim();

    const passwordValue = password.value.trim();

    // Validation
    if (emailValue === "" || passwordValue === "") {

       message.className = "message error";

       message.innerText = "Please fill in all fields.";

        return;
       
    }
    buttonText.innerText = "Logging in...";

    spinner.classList.add("spin");

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

    buttonText.innerText = "Login";

    spinner.classList.remove("spin");

    loginButton.disabled = false;

    if (data.success) {

        // Save logged in user
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = "/pages/dashboard.html";

    } else {

        message.className = "message error";

        message.innerText = data.message;

    }

})
.catch(error => {

    console.error(error);

    buttonText.innerText = "Login";

    spinner.classList.remove("spin");

    loginButton.disabled = false;

   

    message.className = "message error";

    message.innerText = "Something went wrong.";

});

});