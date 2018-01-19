# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

from django.http import HttpResponse
import json
from django.core import serializers

class Info(models.Model):
    user = models.ForeignKey(User, null=True, blank=True)
    icon = models.ImageField(blank=True)

    # last_game = models.ForeignKey(Game, related_name='game', null=True)
    def __unicode__(self):
        return self.user.username


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    game_id = models.IntegerField(null=True)
    user = models.ForeignKey(User, null=True, blank=True)

    score = models.IntegerField(default = 0, null=True)
    # True = keyboard
    # False = voice
    mode = models.BooleanField(default=True)
    x_path = models.TextField(default='100,', null=True)
    y_path = models.TextField(default='400,', null=True)
    finished = models.BooleanField(default=False)
    time = models.IntegerField(default = 0, null=True)

    def __unicode__(self):
        return self.x_path + " " + self.y_path

    @staticmethod
    def get_newest(user, mode):
        games = Game.objects.filter(user=user, mode = (mode == 1)).order_by('-id')
        if not games or games[0].finished:
            return HttpResponse()
        data = serializers.serialize('json', games)
        return HttpResponse(data, content_type='application/json')