from sympy import *
from sympy.parsing.sympy_parser import T


def parse_to_latex(func_expr):
    func = parse_expr(func_expr.replace("^", "**"), transformations=T[:6, 10])
    return latex(func)
