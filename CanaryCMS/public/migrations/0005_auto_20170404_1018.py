# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-04 10:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('public', '0004_auto_20170404_1018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='footer',
            name='controller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Controller'),
        ),
        migrations.AlterField(
            model_name='footer',
            name='template',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Template'),
        ),
        migrations.AlterField(
            model_name='header',
            name='controller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Controller'),
        ),
        migrations.AlterField(
            model_name='header',
            name='template',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Template'),
        ),
    ]