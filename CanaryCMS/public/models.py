from django.db import models
from django.utils import timezone

class Config(models.Model):
    name = models.CharField(max_length=200)
    header = models.ForeignKey('public.Header')
    left_sidebar = models.ForeignKey('public.Sidebar', related_name="left_sidebar", null=True, blank=True)
    right_sidebar = models.ForeignKey('public.Sidebar', related_name="right_sidebar", null=True, blank=True)
    footer = models.ForeignKey('public.Footer')
    def __str__(self):
        return self.name

class Header(models.Model):
    name = models.CharField(max_length=200)
    pages = models.ManyToManyField('public.Page')
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Sidebar(models.Model):
    name = models.CharField(max_length=200)
    widgets = models.ManyToManyField('public.Widget')
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Widget(models.Model):
    name = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Page(models.Model):
    name = models.CharField(max_length=200)
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Post(models.Model):
    user = models.ForeignKey('auth.User')
    title = models.CharField(max_length=200)
    created_datetime = models.DateTimeField(default=timezone.now)
    content = models.TextField()
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.title

class Template(models.Model):
    name = models.CharField(max_length=200)
    file = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Controller(models.Model):
    name = models.CharField(max_length=200)
    file = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Footer(models.Model):
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name