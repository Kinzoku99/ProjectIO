from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.

@api_view(['POST'])
def hello_world(request):
    result = int(request.data['a']) * int(request.data['b'])
    return Response({'result': result})
