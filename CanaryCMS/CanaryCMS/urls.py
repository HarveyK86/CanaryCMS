from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin
from django.views.generic import RedirectView

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='core/')),
    url(r'^admin/', admin.site.urls),
    url(r'^core/', include('core.urls')),
]
