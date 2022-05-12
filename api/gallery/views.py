from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import GalleryEntry
from .serializers import GalleryEntrySerializer

import NumIntTrapezoid
import NumODERungeKutta

from default_calculator_params import calculator_params

import random

def generate_get_response(data):
    graph_values = []

    for element in data:
        initial_value = NumIntTrapezoid.integrate_romberg(
            element['function_expression'],
            element['variable_name'],
            0,
            calculator_params['beg_x'],
            calculator_params['num_of_divisions'],
            calculator_params['tol']
        )

        graph_points = NumODERungeKutta.des_runge_kutta(
            element['function_expression'],
            element['variable_name'],
            initial_value,
            calculator_params['step_size'],
            calculator_params['beg_x'],
            calculator_params['end_x'],
            calculator_params['rank_of_solver']
        )

        x_values = []
        y_values = []

        for val in graph_points:
            x_values.append(val[0])
            y_values.append(val[1])

        graph_values.append({
            'id': element['id'],
            'tex_string': element['tex_string'],
            'variable_name': element['variable_name'],
            'x_values': x_values,
            'y_values': y_values
        })

    return graph_values

# Create your views here.
@api_view(['GET'])
def get_gallery_elements(request):
    elements = GalleryEntry.objects.all()
    serializer = GalleryEntrySerializer(elements, many=True)

    return Response({"elements": generate_get_response(serializer.data)})

@api_view(['GET'])
def get_random_gallery_elements(request, pk):
    if int(pk) < 0:
        return Response(status=HTTP_400_BAD_REQUEST, data={})

    elements = GalleryEntry.objects.all()
    serializer = GalleryEntrySerializer(elements, many=True)

    if int(pk) > len(serializer.data):
        return Response(status=HTTP_400_BAD_REQUEST, data={})

    data = []
    random_elements = random.sample(range(len(serializer.data)), int(pk))

    for i in random_elements:
        data.append(serializer.data[i])

    return Response({"elements": generate_get_response(data)})

@api_view(['POST'])
def create_gallery_element(request):
    serializer = GalleryEntrySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=HTTP_400_BAD_REQUEST, data={})
