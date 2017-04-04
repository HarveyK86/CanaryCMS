from django.db import models

class Config(models.Model):
    name = models.CharField(max_length=200)
    header = models.ForeignKey('public.Header')
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

class Page(models.Model):
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

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