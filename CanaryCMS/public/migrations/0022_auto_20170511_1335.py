# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-11 13:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('public', '0021_auto_20170508_1606'),
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.CharField(max_length=200)),
                ('title', models.CharField(max_length=200)),
                ('code', models.CharField(max_length=200)),
                ('controller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Controller')),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Template')),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='video',
            field=models.ManyToManyField(blank=True, to='public.Video'),
        ),
    ]
