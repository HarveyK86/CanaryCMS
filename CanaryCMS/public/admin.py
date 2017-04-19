from django.contrib import admin
from . import models

admin.site.register(models.Config)
admin.site.register(models.Header)
admin.site.register(models.Sidebar)
admin.site.register(models.Page)
admin.site.register(models.Template)
admin.site.register(models.Controller)
admin.site.register(models.Footer)
admin.site.register(models.Post)