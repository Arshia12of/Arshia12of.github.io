from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("food_selecting/", views.food_selecting, name="food_selecting"),
    path("sign_up/", views.sign_up, name="sign_up"),
    path("sign_up/health_register", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("profile/", views.profile, name="profile"),
    path("logout", views.logout_view, name="logout"),
    path("change_health_register", views.change_register, name="change_register"),
    path("change_password", views.change_password, name="change_password"),
    path("profile/history", views.history_view, name="history"),
    path("about_us", views.about_us, name="about_us")
]