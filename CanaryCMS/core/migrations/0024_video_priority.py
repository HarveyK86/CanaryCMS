# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-11 13:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_auto_20170511_1342'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='priority',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True),
        ),
    ]
