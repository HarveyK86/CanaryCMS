# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-04 10:03
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Controller',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('controller', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('template', models.CharField(max_length=200)),
            ],
        ),
        migrations.RenameField(
            model_name='config',
            old_name='title',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='footer',
            old_name='title',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='header',
            old_name='title',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='page',
            old_name='title',
            new_name='name',
        ),
        migrations.AddField(
            model_name='page',
            name='controller',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Controller'),
        ),
        migrations.AddField(
            model_name='page',
            name='template',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Template'),
        ),
    ]
