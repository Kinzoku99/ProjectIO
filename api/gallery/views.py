from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from calculate_graph import calculate_graph

from .models import GalleryEntry
from .serializers import GalleryEntrySerializer

import NumIntTrapezoid
import NumODERungeKutta

from default_calculator_params import calculator_params

# Create your views here.
@api_view(['GET'])
def get_all(request):
    elements = GalleryEntry.objects.all()
    serializer = GalleryEntrySerializer(elements, many=True)

    graph_values = []

    for element in serializer.data:
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

    return Response({"elements": graph_values})


