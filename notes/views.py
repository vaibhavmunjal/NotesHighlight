from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Highlight_Notes

from django.core import serializers

def home(request):
    return render(request, 'notes/article1.html')


def get_ajax_call(request):
    return HttpResponse('<h1>got the call</h1>')


def create_new_note(request):
    content = request.POST.get("content")
    content_range = request.POST.get("contentRange")
    notes = request.POST.get("note")
    print(content)
    print(content_range)
    print(notes)

    # text_range = Highlight_Notes.objects.all().values('content_range')
    # print(text_range)
    # start = end = []
    data = {'created': False}
    # print(text_range.values())
    # for i in text_range.values():
    #     i_range = i.split(":")
    #     start.append(i_range[0])
    #     end.append(i_range[1])
    # if content_range in start or content_range in end:
    #     return JsonResponse(data)
    # try:
    #     Highlight_Notes.objects.create(content=content,
    #                            content_range=content_range,
    #                            notes=notes)
    #     data = {'created':True}
    # except:
    #     pass
    return JsonResponse(data)


def update_note(request, method=["POST"]):
    content_range = request.POST.get("content_range")
    try:
        # update_note = Highlight_Notes.objects.filter(content_range=content_range)
        update_note = Highlight_Notes.objects.get(content_range=content_range)
        update_note.notes = request.POST.get("notes")
        update_note.save()
    except Highlight_Notes.DoesNotExist:
        data = {'updated':False}
        return JsonResponse(data)
    data = {'updated':True}
    return JsonResponse(data)


def all_notes(request):
    # data = Highlight_Notes.objects.order_by('-content_range').values('content')
    # print(data)
    # # data = {
    # #     'notes': Highlight_Notes.objects.order_by('-content_range')
    # # }
    # # return JsonResponse(data)
    # data = {'notes':serializers.serialize('json', data)}
    # return JsonResponse(data)


    data = (Highlight_Notes.objects.order_by('-content_range')
                                            .values('content',
                                                'content_range',
                                                'notes'
                                                   ))
    data_list = list(data)
    return JsonResponse(data_list, safe=False)





def all_ranges(request):
    all_range = (Highlight_Notes.objects.order_by('-content_range')
                                       .values('content_range'))
    range_list = list(all_range)
    return JsonResponse(range_list, safe=False)


def delete_note(request):
    content_range = request.POST.get("contentRange")
    del_note = Highlight_Notes.objects.get(content_range=content_range)
    try:
        del_note.delete()
    except:
        data = {'deleted':False}
        return JsonResponse(data)
    data = {'deleted':True}
    return JsonResponse(data)
