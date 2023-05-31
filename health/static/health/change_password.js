const change_form  = document.querySelector("#change_form");
let error = document.querySelector("#error")
change_form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".overlay").style.display = "flex";
    let current_password = document.querySelector("#current_password").value;
    let new_password = document.querySelector("#new_password").value;
    let confirm_new_password = document.querySelector("#confirm_new_password").value;
    if (current_password != "" && new_password != "" && confirm_new_password != "") {
        if (new_password === confirm_new_password) {
            let error_check;
            fetch("/change_password", {
                method: "POST",
                body: JSON.stringify({
                    password: current_password,
                    new_password: new_password
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