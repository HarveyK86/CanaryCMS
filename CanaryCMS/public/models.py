from django.db import models
from django.utils import timezone

class Config(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    style = models.ForeignKey('public.Style', null=True, blank=True)
    header = models.ForeignKey('public.Header')
    left_sidebar = models.ForeignKey('public.Sidebar', related_name="left_sidebar", null=True, blank=True)
    right_sidebar = models.ForeignKey('public.Sidebar', related_name="right_sidebar", null=True, blank=True)
    footer = models.ForeignKey('public.Footer')
    def __str__(self):
        return self.name

class Header(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    pages = models.ManyToManyField('public.Page')
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Sidebar(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    widgets = models.ManyToManyField('public.Widget')
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Widget(models.Model):
    class Meta:
        ordering = ['priority']
    name = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Page(models.Model):
    class Meta:
        ordering = ['priority']
    name = models.CharField(max_length=200)
    hidden = models.BooleanField(default=False)
    paginator = models.ForeignKey('public.Paginator', null=True, blank=True)
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Post(models.Model):
    class Meta:
        ordering = ['-created_datetime']
    user = models.ForeignKey('auth.User')
    title = models.CharField(max_length=200)
    created_datetime = models.DateTimeField(default=timezone.now)
    content = models.TextField()
    videos = models.ManyToManyField('public.Video', blank=True)
    categories = models.ManyToManyField('public.Category', blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.title

class PostResponse(models.Model):
    count = models.IntegerField()
    posts = models.ManyToManyField('public.Post')

class Video(models.Model):
    class Meta:
        ordering = ['title']
    owner = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=200)
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.title

class Category(models.Model):
    class Meta:
        verbose_name_plural = "categories"
        ordering = ['name']
    name = models.CharField(max_length=200)
    priority = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Paginator(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Footer(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Style(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    template = models.ForeignKey('public.Template')
    controller = models.ForeignKey('public.Controller')
    def __str__(self):
        return self.name

class Template(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    directory = models.CharField(max_length=200)
    parameters = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.name

class Controller(models.Model):
    class Meta:
        ordering = ['name']
    name = models.CharField(max_length=200)
    file = models.CharField(max_length=200)
    def __str__(self):
        return self.name