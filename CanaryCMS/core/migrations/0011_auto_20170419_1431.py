# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 14:31
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20170419_1335'),
    ]

    operations = [
        migrations.AlterField(
            model_name='config',
            name='left_sidebar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='left_sidebar', to='core.Sidebar'),
        ),
        migrations.AlterField(
            model_name='config',
            name='right_sidebar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='right_sidebar', to='core.Sidebar'),
        ),
    ]
