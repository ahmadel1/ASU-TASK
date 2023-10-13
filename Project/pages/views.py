from django.shortcuts import render, redirect
from .models import Login
# Create your views here.
from django.http import JsonResponse


def game(request):
    request.session.set_expiry(0)
    username = request.session.get('username')
    if username is None:
        print("username is None")
        return redirect('login')
    user = Login.objects.get(username=username)
    print(f"username: {username}")
    if request.method == 'POST':
        score = request.POST.get('score')
        print(f"score: {score}")
        username = request.session.get('username')
        user.score = score
        user.save()
        return JsonResponse({'message': 'Score updated successfully'})
    
    allusers = Login.objects.all().order_by('-highestScore')
    if len(allusers) > 10:
        allusers = allusers[:10]
        
    x = {'score' : user.highestScore,
         'username' : user.username,
         'allusers' : allusers,}
    return render(request, 'pages/game.html', x)

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        data = Login(username=username)
        if Login.objects.filter(username=username).exists():
            request.session['username'] = username
            return redirect('/')
        else:
            request.session['username'] = username
            data.save()
            return redirect('/')
        
    return render(request, 'pages/login.html')

def sendScore(request):
    if request.method == 'POST':
        score = int(request.POST.get('score'))
        timeElapsed = int(request.POST.get('timeElapsed'))
        questionsSolved = int(request.POST.get('questionsSolved'))
        if score is None:
            return JsonResponse({'message': 'Score not sent'})
        print(f"score: {score}")
        username = request.session.get('username')
        user = Login.objects.get(username=username)
        if(user.highestScore < score):
            user.highestScore = score
            user.timeElapsed = timeElapsed
            user.questionsSolved = questionsSolved
            user.save()
        return JsonResponse({'message': 'Score updated successfully'})
    
    return render(request, 'pages/game.html')
