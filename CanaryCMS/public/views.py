from . import models
from django.shortcuts import render
from django.conf import settings
from django.core import serializers
from django.http import HttpResponse

def index(request):
    return render(request, 'public/index.html', {})

def config(request):
    config = models.Config.objects.get(pk=settings.CONFIG_PK)
    json = serializers.serialize('json', [config])
    return HttpResponse(json, content_type='application/json')

def header(request, pk):
    header = models.Header.objects.get(pk=pk)
    json = serializers.serialize('json', [header])
    return HttpResponse(json, content_type='application/json')

def page(request, pk):
    page = models.Page.objects.get(pk=pk)
    json = serializers.serialize('json', [page])
    return HttpResponse(json, content_type='application/json')

def template(request, pk):
    template = models.Template.objects.get(pk=pk)
    json = serializers.serialize('json', [template])
    return HttpResponse(json, content_type='application/json')

def controller(request, pk):
    controller = models.Controller.objects.get(pk=pk)
    json = serializers.serialize('json', [controller])
    return HttpResponse(json, content_type='application/json')

def footer(request, pk):
    footer = models.Footer.objects.get(pk=pk)
    json = serializers.serialize('json', [footer])
    return HttpResponse(json, content_type='application/json')

def post(request):
    posts = models.Post.objects.all()
    json = serializers.serialize('json', posts)
    return HttpResponse(json, content_type='application/json')