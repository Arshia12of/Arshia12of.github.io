let action = document.querySelector("#home");
action.classList.add("active");

// slide show
var time;
var slideIndex = 1;
showSlides(slideIndex);

function check() {
    var x = document.getElementById("a").innerHTML;
    if (x == "pause_circle_filled") {
        document.getElementById("a").innerHTML = "play_circle_filled";
        showSlides();
    }

    else {
        document.getElementById("a").innerHTML = "pause_circle_filled";
        showSlides();
    }
}

function plusSlides(n) {
    if (document.getElementById("a").innerHTML == "pause_circle_filled") {
        if (n == -1) {
            n -= 1;
            var z = slideIndex;
            if ((z += n) == -1) {
                n = 1;
            }
        }
    }
    clearTimeout(time);
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    clearTimeout(time);
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1;}
    if (n < 1) {slideIndex = slides.length;}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    if (document.getElementById("a").innerHTML == "pause_circle_filled") {
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        time = setTimeout(showSlides, 6000);
    }
    else {
        clearTimeout(time);
    }
}

document.querySelector(".next").addEventListener("click", () => plusSlides(1))
document.querySelector(".prev").addEventListener("click", () => plusSlides(-1))
document.querySelector("#a").addEventListener("click", () => check())
document.querySelectorAll(".dot").forEach(a => {
    a.addEventListener("click", () => currentSlide(a.dataset.slide))
})

// food selection functions

const data = document.querySelector("#data")
const div4 = document.querySelector("#buttons_div")
const cal_number = document.querySelector("#cal_number")
const calorie = document.querySelector("#calorie")
const calorie_buttom = document.querySelector("#grams")
const error = document.querySelector("#error")
const food_list = document.querySelector("#food_list")
const subtract = document.querySelector("#subtract")

function show_food() {
    fetch("/food_selecting/")
    .then(re => re.json())
    .then(datas => {
        data.innerHTML = "";
        let option1 = document.createElement("option")
        option1.innerHTML = "Food";
        option1.value = '';
        option1.selected = true;
        option1.disabled = true;
        data.append(option1);
        datas.forEach(food => {
            let option2 = document.createElement("option")
            option2.innerHTML = food;
            option2.value = food;
            data.append(option2)
        })
    })
}

function show_food_type(food) {
    if (food != "") {    
        fetch("/food_selecting/", {
            method: "POST",
            body: JSON.stringify({
                food: food,
                food_type: null
            })
        })
        .then(re => re.json())
        .then(datas => {
            data.innerHTML = "";
            let option1 = document.createElement("option")
            option1.innerHTML = "Food Type";
            option1.value = '';
            option1.selected = true;
            option1.disabled = true;
            data.append(option1);
            datas.forEach(food => {
                let option2 = document.createElement("option")
                option2.innerHTML = food;
                option2.value = food;
                data.append(option2)
            })
            data.dataset.show = "food_type";
            div4.innerHTML = "";
            let button = document.createElement("button")
            button.dataset.selected_food = food
            button.className = "button2";
            button.title = "Click to back Food list";
            button.id = "select1";
            button.type = "button";
            button.innerHTML = `<span class="text2 span">${food}</span>
            <span class="icon span">
            <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>`
            div4.append(button)
            button.addEventListener("click", () => {
                data.style.display = "block";
                cal_number.style.display = "none";
                calorie.style.display = "none";
                calorie_buttom.style.display = "none";
                div4.innerHTML = "";
                data.dataset.show = "food";
                show_food();
            })
        })
    }
}

function show_title(food, food_type) {
    if (food_type != "") {
        fetch("/food_selecting/", {
            method: "POST",
            body: JSON.stringify({
                food: food,
                food_type: food_type
            })
        })
        .then(re => re.json())
        .then(datas => {
            data.innerHTML = "";
            let option1 = document.createElement("option")
            option1.innerHTML = "Title";
            option1.value = '';
            option1.selected = true;
            option1.disabled = true;
            data.append(option1);
            datas.forEach(food => {
                let option2 = document.createElement("option")
                option2.innerHTML = food.title;
                option2.value = food.calorie;
                data.append(option2)
            })
            data.dataset.show = "title";
            let button = document.createElement("button")
            button.dataset.selected_food_type = food_type
            button.className = "button2";
            button.title = "Click to back Food type list";
            button.id = "select2";
            button.type = "button";
            button.innerHTML = `<span class="text2 span">${food_type}</span>
            <span class="icon span">
            <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>`
            div4.append(button)
            button.addEventListener("click", () => {
                data.style.display = "block";
                cal_number.style.display = "none";
                calorie.style.display = "none";
                calorie_buttom.style.display = "none";
                data.dataset.show = "food_type";
                button.remove()
                show_food_type(food);
            })
        })
    }
}

function show_calorie(title_calorie) {
    if (title_calorie != "") {
        let title = data.options[data.selectedIndex]
        cal_number.style.display = "block";
        cal_number.value = "";
        calorie.style.display = "block";
        calorie_buttom.style.display = "inline";
        calorie.innerHTML = `Per gram contains ${title_calorie} calories`;
        data.dataset.show = "";
        data.style.display = "none";
        let button = document.createElement("button")
        button.dataset.selected_title = title.innerHTML;
        button.dataset.selected_calorie = title.value;
        button.className = "button2";
        button.title = "Click to back Title list";
        button.id = "select3";
        button.type = "button";
        button.innerHTML = `<span class="text2 span">${title.innerHTML}</span>
        <span class="icon span">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
        </svg>`
        div4.append(button)
        button.addEventListener("click", () => {
            data.style.display = "block";
            cal_number.style.display = "none";
            calorie.style.display = "none";
            calorie_buttom.style.display = "none";
            data.dataset.show = "title";
            button.remove()
            show_title(document.querySelector("#select1").dataset.selected_food, document.querySelector("#select2").dataset.selected_food_type);
            document.querySelector("#select2").remove()
        })
    }
}


// food selection

show_food()

data.addEventListener("blur", () => {
    if (data.dataset.show == "food") {
        show_food_type(data.value)
    } else if (data.dataset.show == "food_type") {
        let food = document.querySelector("#select1")
        show_title(food.dataset.selected_food, data.value)
    } else if (data.dataset.show == "title") {
        show_calorie(data.value)
    }
})
data.addEventListener("click", () => {
    if (data.dataset.show == "food") {
        show_food_type(data.value)
    } else if (data.dataset.show == "food_type") {
        let food = document.querySelector("#select1")
        show_title(food.dataset.selected_food, data.value)
    } else if (data.dataset.show == "title") {
        show_calorie(data.value)
    }
})
calorie_buttom.addEventListener("click", () => {
    if (cal_number.value >= 1) {
        let food = document.querySelector("#select1").dataset.selected_food
        let food_type = document.querySelector("#select2").dataset.selected_food_type
        let title = document.querySelector("#select3").dataset.selected_title

        var grams = Number(cal_number.value).toFixed(1);
        var calories = (grams * Number(document.querySelector("#select3").dataset.selected_calorie)).toFixed(2);
        document.querySelector("#path").innerHTML = `${food} -- ${food_type} -- ${title} -- ${grams} gr`;
        document.querySelector("#path").style.display = "inline";
        food_list.style.display = "inline";
        if (subtract) {
            subtract.style.display = "inline";
        }
        document.querySelector("#calories").innerHTML = `${calories} kcal`;
        document.querySelector("#calories").style.display = "block";
        error.style.display = "none";
        div4.innerHTML = "";
        cal_number.style.display = "none";
        calorie.style.display = "none";
        calorie_buttom.style.display = "none";
    } else {
        error.style.display = "block";
        error.innerHTML = "*Please enter weight of your food more than 1 gram!"
    }
})

food_list.addEventListener("click", () => {
    data.style.display = "block";
    data.dataset.show = "food";
    document.querySelector("#path").style.display = "none";
    food_list.style.display = "none";
    if (subtract) {
        subtract.style.display = "none";
    }
    document.querySelector("#calories").style.display = "none";
    show_food()
})
