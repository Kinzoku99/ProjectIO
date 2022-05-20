import math

from sympy import *
from sympy.parsing.sympy_parser import T

from calculator_functions.default_calculator_params import calculator_params
import custom_exceptions

def parse_to_latex(func_expr):
    func = parse_expr(func_expr.replace("^", "**"), transformations=T[:6, 10])
    return latex(func)

def round_float(number):
    factor = math.pow(10, calculator_params['float_precision'])
    return str(round(number * factor) / factor)

def generate_float_string(number):
    if math.isinf(number) and number > 0:
        return '\infty'
    elif math.isinf(number) and number < 0:
        return '-\infty'
    elif math.isnan(number):
        raise custom_exceptions.FloatNanError
    else:
        return round_float(number)

def generate_float_arrays(array):
    x_values = []
    y_values = []

    for val in array:
        if math.isinf(val[0]) or math.isinf(val[1]):
            raise custom_exceptions.FloatInfError
        elif math.isnan(val[0]) or math.isnan(val[1]):
            raise custom_exceptions.FloatNanError

        x_values.append(val[0])
        y_values.append(val[1])

    return {'x_values': x_values, 'y_values': y_values}
