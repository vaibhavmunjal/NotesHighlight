# Generated by Django 2.2 on 2019-06-04 03:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Highlight_Notes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('content_range', models.CharField(max_length=10)),
                ('notes', models.TextField()),
            ],
        ),
    ]
