from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass


class Calorie(models.Model):
    food = models.CharField(max_length=100)
    food_type = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    calorie = models.FloatField()


class Health_data(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_health_data")
    height = models.IntegerField()
    weight = models.FloatField()
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    activity = models.CharField(max_length=2)
    bmi = models.FloatField()
    bmr = models.FloatField()


class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_history")
    date = models.DateTimeField()
    food = models.CharField(max_length=100)
    calorie = models.FloatField()