from django.db import models

# Create your models here.

class Player(models.Model):
    userName = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    
class Login(models.Model):
    username = models.CharField(max_length=100)
    highestScore = models.IntegerField(default=0)
    timeElapsed = models.IntegerField(default=0)
    questionsSolved = models.IntegerField(default=0)
    def __str__(self):
        return self.username