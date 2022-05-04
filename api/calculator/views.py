from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from math import sin, cos, tan
from rest_framework.status import HTTP_400_BAD_REQUEST
from calculate_graph import calculate_graph

import numIntTrapezoidQ
import numDESolvers

@api_view(['POST'])
def trapezoid_quadrature_01(request):
    try:
        result = numIntTrapezoidQ.trapezoid_quadrature_01(request.data["function"], float(request.data["step_size"]))
        return Response({'result': result})
    except Exception:
        return Response(status=HTTP_400_BAD_REQUEST, data={})

@api_view(['POST'])
def romberg_quadrature_01(request):
    try:
        result = numIntTrapezoidQ.romberg_quadrature_01(request.data["function"], int(request.data["num_of_divisions"]), float(request.data["tol"]))
        return Response({'result': result})
    except Exception:
        return Response(status=HTTP_400_BAD_REQUEST, data={})

@api_view(['POST'])
def des_runge_kutta(request):
    try:
        result = numDESolvers.des_runge_kutta(
            request.data["function"],
            float(request.data["initial_value"]),
            float(request.data["step_size"]),
            float(request.data["begin_of_integrating_interval"]),
            float(request.data["end_of_integrating_interval"]),
            int(request.data["rank_of_solver"])
        )

        x_values = []
        y_values = []

        for val in result:
            x_values.append(val[0])
            y_values.append(val[1])

        return Response({'x_values': x_values, 'y_values': y_values})
    except Exception:
        return Response(status=HTTP_400_BAD_REQUEST, data={})

@api_view(['POST'])
def graph(request):
    function = request.data["function"]
    beg_x = float(request.data["beg_x"])
    end_x = float(request.data["end_x"])
    step = float(request.data["step_size"])

    result = calculate_graph(function, beg_x, end_x, step)

    return Response({'x_values': result['x_values'], 'y_values': result['y_values']})
