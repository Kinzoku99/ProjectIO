import math

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from calculator_functions.calculate_graph import calculate_graph
from calculator_functions.indefinite_integration import parse_and_integrate
from calculator_functions.other_functions import parse_to_latex
from calculator_functions.other_functions import generate_float_string
from calculator_functions.other_functions import generate_float_arrays

import NumIntTrapezoid
import NumODERungeKutta

@api_view(['POST'])
def integrate_trapezoid(request):
    try:
        result = NumIntTrapezoid.integrate_trapezoid(
            request.data['function_expression'],
            request.data['variable_name'],
            float(request.data['interval_begin']),
            float(request.data['interval_end']),
            float(request.data['step_size'])
        )
        return Response({
            'tex_function': parse_to_latex(request.data['function_expression']),
            'result': generate_float_string(result)
        })
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': str(e)})

@api_view(['POST'])
def integrate_romberg(request):
    try:
        if int(request.data['num_of_divisions']) < 0: raise Exception
        result = NumIntTrapezoid.integrate_romberg(
            request.data['function_expression'],
            request.data['variable_name'],
            float(request.data['interval_begin']),
            float(request.data['interval_end']),
            int(request.data['num_of_divisions']),
            float(request.data['tol'])
        )
        return Response({
            'tex_function': parse_to_latex(request.data['function_expression']),
            'result': generate_float_string(result)
        })
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': str(e)})

@api_view(['POST'])
def des_runge_kutta1(request):
    try:
        if int(request.data['rank_of_solver']) < 0: raise Exception
        result = NumODERungeKutta.des_runge_kutta(
            request.data['function_expression'],
            request.data['variable_name'],
            float(request.data['initial_value']),
            float(request.data['step_size']),
            float(request.data['begin_of_integrating_interval']),
            float(request.data['end_of_integrating_interval']),
            int(request.data['rank_of_solver'])
        )

        return Response(generate_float_arrays(result))
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': str(e)})

@api_view(['POST'])
def des_runge_kutta2(request):
    try:
        if int(request.data['rank_of_solver']) < 0: raise Exception
        if int(request.data['num_of_divisions']) < 0: raise Exception

        initial_value = NumIntTrapezoid.integrate_romberg(
            request.data['function_expression'],
            request.data['variable_name'],
            0,
            float(request.data['begin_of_integrating_interval']),
            int(request.data['num_of_divisions']),
            float(request.data['tol'])
        )

        result = NumODERungeKutta.des_runge_kutta(
            request.data['function_expression'],
            request.data['variable_name'],
            initial_value,
            float(request.data['step_size']),
            float(request.data['begin_of_integrating_interval']),
            float(request.data['end_of_integrating_interval']),
            int(request.data['rank_of_solver'])
        )

        return Response(generate_float_arrays(result))
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': str(e)})

@api_view(['POST'])
def indefinite_integration(request):
    try:
        if 'variable_name' in request.data:
            return Response({
                'tex_function': parse_to_latex(request.data['function_expression']),
                'tex_result': parse_and_integrate(request.data['function_expression'], request.data['variable_name'])
            })
        else:
            return Response({
                'tex_function': parse_to_latex(request.data['function_expression']),
                'tex_result': parse_and_integrate(request.data['function_expression'])
            })
    except Exception as e:
        return Response(status=HTTP_400_BAD_REQUEST, data={'message': str(e)})

@api_view(['POST'])
def graph(request):
    function = request.data['function_expression']
    beg_x = float(request.data['beg_x'])
    end_x = float(request.data['end_x'])
    step = float(request.data['step_size'])

    result = calculate_graph(function, beg_x, end_x, step)

    return Response({'x_values': result['x_values'], 'y_values': result['y_values']})
