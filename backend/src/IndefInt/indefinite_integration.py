from sympy import *
from sympy.parsing.sympy_parser import T

def parse_and_integrate(func_expr = "0", var_expr = "x"):
    func = parse_expr(func_expr.replace("^", "**"), transformations=T[:6])
    Symbol(var_expr)
    int = integrate(func)
    return latex(int)
    # return int

expr = input("Podaj funkcję: ")
variable = input("Podaj zmienną: ")

print (parse_and_integrate(expr, variable))

