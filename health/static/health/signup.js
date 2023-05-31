const signup_form  = document.querySelector("#signup_form");
let error = document.querySelector("#error")
signup_form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".overlay").style.display = "flex";
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#psw").value;
    let confirmation = document.querySelector("#confirmation").value;
    if (username != "" && email != "" && password != "" && confirmation != "") {
        if (password === confirmation) {
            let error_check;
            fetch("/sign_up/", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(re => {
                if (re.status == 203) {
                    error_check = false;
                    return re.json();
                } else {
                    error_check = true;
                    return re.json();
                }
            })
            .then(data => {
                if (error_check) {
                    error.innerHTML = data.error;
                    error.style.display = "block";
                    document.querySelector(".overlay").style.display = "none";
                } else {
                    window.location.replace(data.url);
                }
            })
        } else {
            error.innerHTML = "The confirm password does not look like your password!";
            error.style.display = "block";
            document.querySelector(".overlay").style.display = "none";
        }
    } else {
        error.innerHTML = "Please fill out all required fields!";
        error.style.display = "block";
        document.querySelector(".overlay").style.display = "none";
    }
})