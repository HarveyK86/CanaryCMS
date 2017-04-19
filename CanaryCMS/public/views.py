from . import models
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse
from django.utils.dateparse import parse_datetime

import datetime
import json

def index(request):
    return render(request, 'public/index.html', {})

def config(request):
    config = models.Config.objects.get(pk=settings.CONFIG_PK)
    json_obj = serializers.serialize('json', [config])
    return HttpResponse(json_obj, content_type='application/json')

def user(request, pk):
    user = User.objects.get(pk=pk)
    json_obj = json.dumps([{
        "model": "auth.User",
        "pk": pk,
        "fields": {
            "username": user.get_username(),
        },
    }])
    return HttpResponse(json_obj, content_type='application/json')

def datetime_func(request, timestamp):
    datetime_obj = parse_datetime(timestamp)
    epoch = datetime.datetime(1970, 1, 1, 0, 0, 0, 0, tzinfo=datetime.timezone.utc)
    epoch_time = datetime_obj - epoch
    epoch_time = epoch_time.total_seconds()
    epoch_time = int(epoch_time * 1000)
    json_obj = json.dumps([{
        "model": "datetime.datetime",
        "timestamp": timestamp,
        "fields": {
            "epoch_time": epoch_time,
        },
    }])
    return HttpResponse(json_obj, content_type='application/json')

def header(request, pk):
    header = models.Header.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [header])
    return HttpResponse(json_obj, content_type='application/json')

def sidebar(request, pk):
    sidebar = models.Sidebar.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [sidebar])
    return HttpResponse(json_obj, content_type='application/json')

def page(request, pk):
    page = models.Page.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [page])
    return HttpResponse(json_obj, content_type='application/json')

def post(request):
    posts = models.Post.objects.all()
    json_obj = serializers.serialize('json', posts)
    return HttpResponse(json_obj, content_type='application/json')

def footer(request, pk):
    footer = models.Footer.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [footer])
    return HttpResponse(json_obj, content_type='application/json')

def template(request, pk):
    template = models.Template.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [template])
    return HttpResponse(json_obj, content_type='application/json')

def controller(request, pk):
    controller = models.Controller.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [controller])
    return HttpResponse(json_obj, content_type='application/json')