from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^config$', views.config, name='config'),
    url(r'^user/(?P<pk>[0-9]+)$', views.user, name='user'),
    url(r'^datetime/(?P<timestamp>[\w\-:]+)$', views.datetime_func, name='datetime'),
    url(r'^header/(?P<pk>[0-9]+)$', views.header, name='header'),
    url(r'^left_sidebar/(?P<pk>[0-9]+)$', views.sidebar, name='left_sidebar'),
    url(r'^right_sidebar/(?P<pk>[0-9]+)$', views.sidebar, name='right_sidebar'),
    url(r'^page/(?P<pk>[0-9]+)$', views.page, name='page'),
    url(r'^post$', views.post, name='post'),
    url(r'^footer/(?P<pk>[0-9]+)$', views.footer, name='footer'),
    url(r'^template/(?P<pk>[0-9]+)$', views.template, name='template'),
    url(r'^controller/(?P<pk>[0-9]+)$', views.controller, name='controller'),
]
