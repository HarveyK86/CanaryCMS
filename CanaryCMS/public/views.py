from . import models
from csscompressor import compress
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse
from django.utils.dateparse import parse_datetime
from jsmin import jsmin

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

def widget(request, pk):
    widget = models.Widget.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [widget])
    return HttpResponse(json_obj, content_type='application/json')

def page(request, pk):
    page = models.Page.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [page])
    return HttpResponse(json_obj, content_type='application/json')

def post(request):
    categories = request.GET.get("categories")
    categories = categories.split(",")
    categories = models.Category.objects.filter(name__in=categories)
    posts = models.Post.objects.filter(categories__in=categories)
    posts = posts.order_by("-created_datetime")
    count = len(posts)
    page = request.GET.get("page")
    page_size = request.GET.get("page-size")
    if page and page_size:
        page = int(page)
        page_size = int(page_size)
        start_inclusive = (page - 1) * page_size
        end_exclusive = start_inclusive + page_size
        posts = posts[start_inclusive: end_exclusive]
    response = models.PostResponse.objects.create(count=count)
    response.posts = posts
    json_obj = serializers.serialize('json', [response])
    return HttpResponse(json_obj, content_type='application/json')

def get_post(request, pk):
    post = models.Post.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [post])
    return HttpResponse(json_obj, content_type='application/json')

def video(request, pk):
    video = models.Video.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [video])
    return HttpResponse(json_obj, content_type='application/json')

def category(request, pk):
    category = models.Category.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [category])
    return HttpResponse(json_obj, content_type='application/json')

def paginator(request, pk):
    paginator = models.Paginator.objects.get(pk=pk)
    json_obj = serializers.serialize('json', [paginator])
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

def css(request, file):
    response = render(request, "public/" + file + ".css", content_type='text/css')
    response.content = compress(response.content.decode("UTF-8"))
    return response

def html(request, file):
    return render(request, "public/" + file + ".html")

def js(request, file):
    response = render(request, "public/" + file + ".js", content_type='application/javascript')
    #response.content = jsmin(response.content.decode("UTF-8"), quote_chars="'\"`")
    return response