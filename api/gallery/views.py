from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from calculate_graph import calculate_graph

test_elements = [
    {"formula": "sin(x)", "tex": "\\sin{x}"},
    {"formula": "cos(x)", "tex": "\\cos{x}"}
]

# Create your views here.
@api_view(['GET'])
def get_all(request):
    if len(test_elements) < 12:
        for i in range(10):
            formula = "x^" + str(i + 1)
            tex = "x^{" + str(i + 1) + "}"
            test_elements.append({"formula": formula, "tex": tex})

    for element in test_elements:
        graph_points = calculate_graph(element['formula'], -40, 40, 0.2)
        element['x_values'] = graph_points['x_values']
        element['y_values'] = graph_points['y_values']

    return Response({"elements": test_elements})
