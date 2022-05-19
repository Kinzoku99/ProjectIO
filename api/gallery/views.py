from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import GalleryEntry
from .serializers import GalleryEntrySerializer

import NumIntTrapezoid
import NumODERungeKutta

from calculator_functions.default_calculator_params import calculator_params
from calculator_functions.other_functions import parse_to_latex

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
    argument = int(pk)

    if argument < 0:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': 'Argument mniejszy od 0'})

    elements = GalleryEntry.objects.all()
    serializer = GalleryEntrySerializer(elements, many=True)

    if argument > len(serializer.data):
        argument = len(serializer.data)

    data = []
    random_elements = random.sample(range(len(serializer.data)), argument)

    for i in random_elements:
        data.append(serializer.data[i])

    return Response({"elements": generate_get_response(data)})

@api_view(['POST'])
def create_gallery_element(request):
    try:
        data_to_serialize = request.data

        if 'tex_string' not in request.data:
            data_to_serialize['tex_string'] = parse_to_latex(request.data['function_expression'])

        serializer = GalleryEntrySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            raise Exception
    except Exception:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': 'Zły obiekt'})
