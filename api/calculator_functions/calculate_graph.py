from math import sin, cos, tan

def calculate_graph(function, beg_x, end_x, step):
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

    return {'x_values': x_values, 'y_values': y_values}
