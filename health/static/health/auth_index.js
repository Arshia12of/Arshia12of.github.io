const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let left_cal = document.querySelector("#left_cal");
var date = new Date();
setInterval(() => {
    var now = new Date();
    if (date.getDate() != now.getDate() || date.getMonth() != now.getMonth() || date.getFullYear() != now.getFullYear()) {
        date = new Date();
        show_left_cal();
    }
}, 1000)
show_left_cal();

function show_left_cal() {
    fetch("/", {
        method: "PUT",
        body: JSON.stringify({
            timezone: timezone
        })
    })
    .then(re => {
        if (re.status == 203) {
            return re.json();
        } else {
            window.location.reload();
        }
    })
    .then(data => {
        const left_cal_div = document.querySelector("#left_cal");
        var left_cal = data.left_cal;
        var bmr = data.bmr;
        left_cal_div.children[0].innerHTML = `Calories left over from the day: ${left_cal.toFixed(1)} kcal`;
        var r = 100;
        let consumed = document.querySelector("#consumed");
        let remaining = document.querySelector("#remaining");
        let consumed_per = document.querySelector("#consumed_per");
        var used = bmr - left_cal;
        var d = (used * 180) / bmr;
        var d_per = (d / 180 * 100).toFixed(1);
        consumed_per.innerHTML = `${d_per}%`;
        if (left_cal <= 0) {
            consumed_per.innerHTML = "+100%";
            consumed_per.style.fill = "red";
            consumed.style.stroke = "url(#pppa)";
            const att = document.createAttribute("d");
            const att_remaining = document.createAttribute("d");
            att.value = `M 40 140
            A ${r} ${r}, 0, 0, 1, 240 140`;
            att_remaining.value = "";
            consumed.setAttributeNode(att);
            remaining.setAttributeNode(att_remaining);
            return true;
        } else {
            consumed.style.stroke = "red";
        }
        var rad = (Math.PI * d) / 180;
        var x = r * (1 - Math.cos(rad));
        var y = r * (1 - Math.sin(rad));
        const att = document.createAttribute("d");
        const att_remaining = document.createAttribute("d");
        att.value = `M 40 140
        A ${r} ${r}, 0, 0, 1, ${40 + x} ${40 + y}`;
        att_remaining.value = `M 240 140
        A ${r} ${r}, 0, 0, 0, ${40 + x} ${40 + y}`;
        consumed.setAttributeNode(att);
        remaining.setAttributeNode(att_remaining);
    })
}

subtract.addEventListener("click", () => {
    fetch("/", {
        method: "POST",
        body: JSON.stringify({
            timezone: timezone,
            food: document.querySelector("#path").innerHTML,
            calorie: Number(calories.innerHTML.slice(0, -5)).toFixed(1)
        })
    })
    .then(re => {
        if (re.status == 203) {
            data.style.display = "block";
            data.dataset.show = "food";
            document.querySelector("#path").style.display = "none";
            food_list.style.display = "none";
            if (subtract) {
                subtract.style.display = "none";
            }
            document.querySelector("#calories").style.display = "none";
            show_food();
            show_left_cal();
        }
    })
})