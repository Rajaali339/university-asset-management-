import {
    auth,
    signInWithEmailAndPassword
} from "./firebase.js";


const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

const loginMessage =
document.getElementById("loginMessage");


loginBtn.addEventListener("click", async () => {

    const email =
    emailInput.value.trim();

    const password =
    passwordInput.value;


    if (!email || !password) {

        loginMessage.textContent =
        "Please enter email and password.";

        loginMessage.style.color = "red";

        return;
    }


    loginBtn.disabled = true;

    loginMessage.textContent =
    "Logging in...";

    loginMessage.style.color =
    "#2563eb";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        loginMessage.textContent =
        "Login successful!";

        loginMessage.style.color =
        "green";


        setTimeout(() => {

            window.location.href =
            "dashboard.html";

        }, 500);


    } catch (error) {

        console.error(error);

        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            loginMessage.textContent =
            "Wrong email or password.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            loginMessage.textContent =
            "Invalid email.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            loginMessage.textContent =
            "User does not exist.";

        }

        else {

            loginMessage.textContent =
            error.message;
        }


        loginMessage.style.color =
        "red";

        loginBtn.disabled = false;
    }

});