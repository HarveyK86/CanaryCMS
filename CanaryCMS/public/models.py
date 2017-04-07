from django.db import models
from django.utils import timezone

class Config(models.Model):
    name = models.CharField(max_length=200)
    header = models.ForeignKey('public.Header')
    footer = models.ForeignKey('public.Footer')
    def __str__(self):
        return "Config: " + self.name

class Header(models.Model):
    name = models.CharField(max_length=200)
    pages = models.ManyToManyField('public.Page')
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return "Header: " + self.name

class Page(models.Model):
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return "Page: " + self.name

class Template(models.Model):
    name = models.CharField(max_length=200)
    file = models.CharField(max_length=200)
    def __str__(self):
        return "Template: " + self.name

class Controller(models.Model):
    name = models.CharField(max_length=200)
    file = models.CharField(max_length=200)
    def __str__(self):
        return "Controller: " + self.name

class Footer(models.Model):
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return "Footer: " + self.name

class Post(models.Model):
    author = models.ForeignKey('auth.User')
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return "Post: " + self.title