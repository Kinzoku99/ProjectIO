from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from math import sin, cos, tan


@api_view(['POST'])
def trapezoid_quadrature_01(request):
    result = 1
    return Response({'result': result})


@api_view(['POST'])
def romberg_quadrature_01(request):
    result = 1
    return Response({'result': result})


@api_view(['POST'])
def graph(request):
    function = request.data["function"]
    beg_x = float(request.data["beg_x"])
    end_x = float(request.data["end_x"])
    step = float(request.data["step"])

    prev_char = ''
    i = 0

    while i < len(function):
        if prev_char.isnumeric() and function[i].isalpha():
            function = function[:i] + '*' + function[i:]
            i += 1
        prev_char = function[i]
        i += 1

    function = function.replace("^", " ** ")

    x_values = []
    y_values = []

    while beg_x <= end_x:
        x_values.append(beg_x)
        x = beg_x
        y_values.append(eval(function))
        beg_x += step

    return Response({'x_values': x_values, 'y_values': y_values})
