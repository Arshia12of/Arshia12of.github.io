import json
from datetime import datetime
from pytz import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Calorie, Health_data, History

# Create your views here.
@csrf_exempt
def index(request):
    if "register_check" in request.session:
        if request.session["register_check"]:
            return HttpResponseRedirect(reverse("register"))

    if request.user.is_authenticated:
        user = request.user
        if request.method == "POST":
            data = json.loads(request.body)
            if data.get("timezone") and data.get("food") and data.get("calorie") != (None, None, None):
                date = datetime.now(timezone(data["timezone"]))
                food = data["food"]
                calorie = data["calorie"]
                history = History(user=user, food=food, calorie=calorie, date=date)
                history.save()
                return HttpResponse(status=203)
            else:
                return HttpResponse(status=400)

        elif request.method == "PUT":
            data = json.loads(request.body)
            if data.get("timezone") != None:
                today = datetime.now(timezone(data["timezone"])).strftime("%x")
                bmr = Health_data.objects.get(user=user).bmr
                calories = bmr
                history = user.user_history.all()
                cal_history = [cal.calorie for cal in history if cal.date.strftime("%x") == today]
                for calorie in cal_history:
                    calories -= calorie
                return JsonResponse({"left_cal":calories, "bmr":bmr}, status=203)

    return render(request, "health/index.html")

@csrf_exempt
def food_selecting(request):
    if request.method == "POST":
        body = json.loads(request.body)
        if body.get("food") is not None and body.get("food_type") is not None:
            datas = Calorie.objects.filter(food=body["food"], food_type=body["food_type"])
            data = []
            for i in datas:
                try:
                    if not i.title in data["title"]:
                        data.append({"title": i.title, "calorie": i.calorie})
                except:
                    data.append({"title": i.title, "calorie": i.calorie})
            return JsonResponse(data, safe=False)
        else:
            datas = Calorie.objects.filter(food=body["food"])
            data = []
            for i in datas:
                if not i.food_type in data:
                    data.append(i.food_type)
            return JsonResponse(data, safe=False)


    datas = Calorie.objects.all()
    data = []
    for i in datas:
        if not i.food in data:
            data.append(i.food)
    
    return JsonResponse(data, safe=False)

def profile(request):
    if request.user.is_authenticated:
        user = request.user
        health_data = Health_data.objects.get(user=user)
        if health_data.bmi < 18.5:
            message = "Underweight"
        elif health_data.bmi >= 18.5 and health_data.bmi <= 24.9:
            message = "Normal weight"
        elif health_data.bmi >= 25 and health_data.bmi <= 29.9:
            message = "Overweight"
        else:
            message = "Obesity"

        return render(request, "health/profile.html", {
            "health_data": health_data,
            "message": message
        })
    else:
        return HttpResponseRedirect(reverse("login"))

@csrf_exempt
def sign_up(request):
    if "register_check" in request.session:
        if request.session["register_check"]:
            return HttpResponseRedirect(reverse("register"))

    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("username") and data.get("email") and data.get("password") != (None, None, None):
            username = data["username"]
            email = data["email"]
            password = data["password"]
            usernames = [user.username for user in User.objects.all()]
            if username in usernames:
                return JsonResponse({"error":"Username already taken!"}, status=400)

            user = User.objects.create_user(username, email, password)
            user.save()
            login(request, user)
            request.session["register_check"] = True
            url = reverse("register")
            return JsonResponse({"url":url}, status=203)

        else:
            return JsonResponse({"error":"Please try again!"}, status=400)
    else:
        return render(request, "health/signup.html")

@csrf_exempt
def register(request):
    if "register_check" in request.session:
        if not request.session["register_check"]:
            return HttpResponseRedirect(reverse("index"))
    else:
        return HttpResponseRedirect(reverse("index"))

    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("weight") and data.get("height") and data.get("age") and data.get("gender") and data.get("activity") and data.get("bmi") and data.get("bmr") != (None, None, None, None, None, None, None):
            user = request.user
            weight = data["weight"]
            height = data["height"]
            age = data["age"]
            gender = data["gender"]
            activity = data["activity"]
            bmi = data["bmi"]
            bmr = data["bmr"]
            try:
                health_data = Health_data(user=user, weight=weight, height=height, age=age, gender=gender, activity=activity, bmi=bmi, bmr=bmr)
                health_data.save()
                url = reverse("index")
                request.session["register_check"] = False
                return JsonResponse({"url":url}, status=203)

            except:
                return JsonResponse({"error":"Please try again!"}, status=400)

        else:
            return JsonResponse({"error":"Please try again!"}, status=400)

    return render(request, "health/register.html")

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("username") and data.get("password") != (None, None):
            username = data["username"]
            password = data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                url = reverse("index")
                return JsonResponse({"url":url}, status=203)

            else:
                return JsonResponse({"error":"Invalid email and/or password!"}, status=400)

        else:
            return JsonResponse({"error":"Please try again!"}, status=400)
    return render(request, "health/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@login_required
@csrf_exempt
def change_register(request):
    user = request.user
    health_data = Health_data.objects.get(user=user)
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("weight") and data.get("height") and data.get("age") and data.get("gender") and data.get("activity") and data.get("bmi") and data.get("bmr") != (None, None, None, None, None, None, None):
            user = request.user
            weight = data["weight"]
            height = data["height"]
            age = data["age"]
            gender = data["gender"]
            activity = data["activity"]
            bmi = data["bmi"]
            bmr = data["bmr"]
            try:
                health_data.weight = weight
                health_data.height = height
                health_data.age = age
                health_data.gender = gender
                health_data.activity = activity
                health_data.bmi = bmi
                health_data.bmr = bmr
                health_data.save()
                url = reverse("profile")
                request.session["register_check"] = False
                return JsonResponse({"url":url}, status=203)

            except:
                return JsonResponse({"error":"Please try again!"}, status=400)

        else:
            return JsonResponse({"error":"Please try again!"}, status=400)
    return render(request, "health/change_register.html", {
        "health_data": health_data
    })

@login_required
@csrf_exempt
def change_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("password") and data.get("new_password") != (None, None):
            username = request.user.username
            password = data["password"]
            new_password = data["new_password"]
            user = authenticate(username=username, password=password)
            if user:
                user.set_password(new_password)
                user.save()
                login(request, user)
                url = reverse("profile")
                return JsonResponse({"url":url}, status=203)
            else:
                return JsonResponse({"error":"Current password is wrong!"}, status=400)

        else:
            return JsonResponse({"error":"Please try again!"}, status=400)
    return render(request, "health/change_password.html")

@login_required
def history_view(request):
    user = request.user
    all_history = user.user_history.order_by("-date").all()
    history = [{"date": f"{history.date.strftime('%Y')}-{history.date.strftime('%m')}-{history.date.strftime('%d')}", "time": f"{history.date.strftime('%H')}:{history.date.strftime('%M')}", "food": history.food, "calorie": history.calorie} for history in all_history]
    return render(request, "health/history.html", {
        "history": history
    })

def about_us(request):
    return render(request, "health/about_us.html")
