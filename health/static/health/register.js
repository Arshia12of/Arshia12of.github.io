const register_form  = document.querySelector("#register_form");
let error = document.querySelector("#error")
register_form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".overlay").style.display = "flex";
    let height = Number(document.querySelector("#height").value);
    let weight = Number(document.querySelector("#weight").value);
    let age = Number(document.querySelector("#age").value);
    let gender = document.querySelector("input[name=\"gender\"]:checked").value;
    let activity = document.querySelector("#activity").value;
    var bmi = (weight / Math.pow((height / 100), 2)).toFixed(1);
    if (gender == "Male") {
        var bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        var bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    if (activity == "1") {
        bmr = (bmr * 1.2).toFixed(1);
    } else if (activity == "2") {
        bmr = (bmr * 1.375).toFixed(1);
    } else if (activity == "3") {
        bmr = (bmr * 1.55).toFixed(1);
    } else if (activity == "4") {
        bmr = (bmr * 1.725).toFixed(1);
    } else if (activity == "5") {
        bmr = (bmr * 1.9).toFixed(1);
    } else {
        bmr = bmr.toFixed(1);
    }

    let error_check;
    fetch("/sign_up/health_register", {
        method: "POST",
        body: JSON.stringify({
            height: height,
            weight: weight,
            age: age,
            gender: gender,
            activity: activity,
            bmi: bmi,
            bmr: bmr
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