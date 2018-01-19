# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers

from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse

from quavergame.models import *
from quavergame.forms import *
import json


# Create your views here.
def home(request):
    if request.user.is_authenticated():
        return redirect('index')
    else:
        login_form = UserLoginForm()
        context = {'form': login_form}
        return render(request, 'quavergame/instruction.html', context)


def welcome(request):
    return render(request, 'quavergame/welcome.html', {})


@login_required
def index(request):
    test(request)
    info = Info.objects.get(user=User.objects.get(username=request.user.username))

    username = request.user.username[:5]
    context = {'user': request.user, 'username': username, 'info': info}
    return render(request, 'quavergame/index.html', context)


def set_cover(request):
    login_form = UserLoginForm()
    context = {'form': login_form}
    return render(request, 'quavergame/topbar_login.html', context)


def set_rank(request):

    key_list = Game.objects.filter(mode=True).order_by('-score')[:10]
    voice_list = Game.objects.filter(mode=False).order_by('-score')[:10]

    context = {'key_list': key_list, 'voice_list': voice_list}
    return render(request, 'quavergame/rank_global.html', context)


@login_required
def get_list(request):
    user = request.user

    info = Info.objects.get(user=user)
    key_list = Game.objects.filter(mode=True).filter(user=user).order_by('-score')[:3]
    voice_list = Game.objects.filter(mode=False).filter(user=user).order_by('-score')[:3]

    context = {'info': info, 'key_list': key_list, 'voice_list': voice_list}
    return render(request, 'quavergame/best_matches_list.html', context)


def set_signup(request):
    return render(request, 'quavergame/topbar_signup.html')


def user_login(request):
    context = {}

    if request.method == 'GET':
        context['form'] = UserLoginForm()
        return render(request, 'quavergame/instruction.html', context)

    if request.method == "POST":
        login_form = UserLoginForm(request.POST)

        login_form.username = request.POST['username']
        login_form.password = request.POST['password']

        if not login_form.is_valid():
            return JsonResponse({
                'success': False,
                'err_code': 'invalid_form',
                'err_msg': login_form.errors,
            })

        user = authenticate(username=login_form.cleaned_data['username'],
                            password=login_form.cleaned_data['password'])

        if user is not None:
            login(request, user)
            info = Info.objects.get(user=User.objects.get(username=login_form.cleaned_data['username']))
            context = {'user': user, 'info': info}

            highest_score = Game.objects.filter(user=request.user).order_by('-score')
            if highest_score:
                context['highest_score'] = highest_score.first().score
            else:
                context['highest_score'] = "You have no record yet."
            return redirect('index')
        else:
            print ("user is none")
            return render(request, 'quavergame/instruction.html', context)



@csrf_exempt
def user_signup(request):
    if request.method == 'POST':

        form = RegistrationForm(request.POST)
        form.username = request.POST['username']
        form.password1 = request.POST['password1']
        form.password2 = request.POST['password2']

        if not form.is_valid():
            print ("signup form not valid")
            return JsonResponse({
                'success': False,
                'err_code': 'invalid_form',
                'err_msg': form.errors,
            })

        new_user = User.objects.create_user(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        new_user.save()

        new_user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        login(request, new_user)

        new_info = Info(user=new_user, icon=request.POST['imgURL'])
        new_info.save()
        context = {'user': new_user, 'info': new_info}

        highest_score = Game.objects.filter(user=request.user).order_by('-score')
        if highest_score:

            context['highest_score'] = highest_score.first().score
        else:
            context['highest_score'] = "You have no record yet."
        return render(request, 'quavergame/index.html', context)


def getmap(request):
    return render(request, 'quavergame/map.json', {})


def get_photo(request, username):

    info = get_object_or_404(Info, user=User.objects.get(username=username))

    if not info.icon:
        print ("cannot get info")
        raise Http404

    return HttpResponse(info.icon)


@login_required
def test(request):
    try:
        Info.objects.get(user=request.user)
    except ObjectDoesNotExist:
        new_info = Info(user=request.user, icon="/static/img/google.png")
        new_info.save()



@login_required
def start(request, mode):
    # newGame = Game(user = request.user)
    print(type(int(mode)))

    newGame = Game(user = request.user, mode = (int(mode) == 1))
    newGame.game_id = newGame.id
    newGame.save()
    return HttpResponse(newGame.id)


@login_required
def save(request):
    game = Game.objects.get(id = int(request.POST['id']))
    x_path = game.x_path
    y_path = game.y_path
    for ele in request.POST.getlist('x_coordinates[]'):
        x_path += ele + ','
    for ele in request.POST.getlist('y_coordinates[]'):
        y_path += ele + ','
    game.x_path = x_path
    game.y_path = y_path
    game.score = request.POST['score']
    game.time = request.POST['time']
    game.game_id = game.id
    # print(game.game_id)
    if request.POST['finished'] == 'true':
        game.finished = True
    game.save()
    return HttpResponse("success")


def set_buttons(request):
    if request.user.is_authenticated():
        return HttpResponse("Success")

@login_required
def resume(request, mode):
    return Game.get_newest(request.user, int(mode))

# @login_required
# def replay(request, matchid):
#     return HttpResponse(serializers.serialize('json', Game.objects.filter(id=matchid)))

