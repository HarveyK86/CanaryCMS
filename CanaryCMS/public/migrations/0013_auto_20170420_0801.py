# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-20 08:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('public', '0012_auto_20170420_0753'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sidebar',
            old_name='widget',
            new_name='widgets',
        ),
    ]
