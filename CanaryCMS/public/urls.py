from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^config$', views.config, name='config'),
    url(r'^header/(?P<pk>[0-9])$', views.header, name='header'),
    url(r'^page/(?P<pk>[0-9])$', views.page, name='page'),
    url(r'^template/(?P<pk>[0-9])$', views.template, name='template'),
    url(r'^controller/(?P<pk>[0-9])$', views.controller, name='controller'),
    url(r'^footer/(?P<pk>[0-9])$', views.footer, name='footer'),
]
