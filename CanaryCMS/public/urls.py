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
    url(r'^widget/(?P<pk>[0-9]+)$', views.widget, name='widget'),
    url(r'^page/(?P<pk>[0-9]+)$', views.page, name='page'),
    url(r'^post$', views.post, name='post'),
    url(r'^post/(?P<pk>[0-9]+)$', views.get_post, name='get_post'),
    url(r'^video/(?P<pk>[0-9]+)$', views.video, name='video'),
    url(r'^category/(?P<pk>[0-9]+)$', views.category, name='category'),
    url(r'^paginator/(?P<pk>[0-9]+)$', views.paginator, name='paginator'),
    url(r'^footer/(?P<pk>[0-9]+)$', views.footer, name='footer'),
    url(r'^template/(?P<pk>[0-9]+)$', views.template, name='template'),
    url(r'^controller/(?P<pk>[0-9]+)$', views.controller, name='controller'),
    url(r'^(?P<file>[\w\-/]+).css$', views.css, name='css'),
    url(r'^(?P<file>[\w\-/]+).html$', views.html, name='html'),
    url(r'^(?P<file>[\w\-/]+).js$', views.js, name='js'),
]
