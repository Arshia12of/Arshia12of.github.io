const login_form  = document.querySelector("#login_form");
let error = document.querySelector("#error")
login_form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".overlay").style.display = "flex";
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#psw").value;
    fetch("/login/", {
        method: "POST",
        body: JSON.stringify({
            username: username,
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
})