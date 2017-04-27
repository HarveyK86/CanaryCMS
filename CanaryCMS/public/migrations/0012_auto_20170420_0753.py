# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-20 07:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('public', '0011_auto_20170419_1431'),
    ]

    operations = [
        migrations.CreateModel(
            name='Widget',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('content', models.TextField()),
                ('controller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Controller')),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='public.Template')),
            ],
        ),
        migrations.AddField(
            model_name='sidebar',
            name='widget',
            field=models.ManyToManyField(to='public.Widget'),
        ),
    ]
