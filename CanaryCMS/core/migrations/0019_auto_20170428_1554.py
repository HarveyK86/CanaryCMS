# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-28 15:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_auto_20170428_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='categories',
            field=models.ManyToManyField(blank=True, to='core.Category'),
        ),
    ]