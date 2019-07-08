from django.urls import path
from .views import *


urlpatterns = [
    path('', home, name='home'),
    path('call/', get_ajax_call, name='call'),
    path('new/', create_new_note, name='new_note'),
    path('update/', update_note, name='update_note'),
    path('notes/', all_notes, name='all_notes'),
    path('all_range/', all_ranges, name='all_range'),
    path('delete/', delete_note, name='delete_note'),
]