#include "expr_handler.hpp"



static real_function _get_handler_FpI(double finite, expr_t &e, double &v){
    printf("Finite -- +INF handler()\n");
    return [&v, &e, finite]
        (double u){
            v = finite + (u / (1 - u));
            // printf("Finite--+INF handler at %lf set x to %lf.\n", u, v);
            // printf("Expr eval at %lf returned %lf\n", v, e.value());
            // printf("Dividing by %lf gives %lf as a result.\n",
            //         pow(1 - u, 2), e.value() / pow(1 - u, 2));
            return e.value() / pow(1.0 - u, 2.0);
        };
}

static real_function _get_handler_mIF(double finite, expr_t &e, double &v){
    printf("-INF -- Finite handler()\n");
    return [&v, &e, finite]
        (double u){
            v = finite - ((1 - u) / u);
            return e.value() / pow(u, 2);
        };
}

static real_function _get_handler_mIpI(expr_t &e, double &v){
    real_function zero_inf_handler = _get_handler_FpI(0.0, e, v);
    real_function inf_zero_handler = _get_handler_mIF(0.0, e, v);
    printf("-INF -- +INF handler()\n");
    return [=]
        (double u){
            return zero_inf_handler(u) + inf_zero_handler(u);
        };
}

static real_function _get_handler_FF(double left, double right, expr_t &e, double &v){
    return [&v, &e, right, left]
            (double u){
                v = u * (right - left) + left;
                return e.value() * (right - left);
            };
}

handler_out get_handler(double interval_begin, double interval_end, expr_t &expr, double &var){
    handler_out result;
    if (std::isfinite(interval_begin) && std::isfinite(interval_end)){
        result.t_func =
            _get_handler_FF(interval_begin, interval_end, expr, var);
        result.left_infinite = false;
        result.right_infinite = false;
        
    }
    else if (std::isinf(interval_begin) && std::isfinite(interval_end)){
        // (+- nieskończoność) do b
        if (interval_begin == INFINITY){
            // przedział odwrócony
            real_function _tmp_handler = _get_handler_FpI(interval_end, expr, var);
            result.t_func =
            [=] (double u){
                    return -(_tmp_handler(u)); // zmiana znaku
                };
            result.left_infinite = false;
            result.right_infinite = true;
        }

        result.t_func = _get_handler_mIF(interval_end, expr, var);
        result.left_infinite = true;
        result.right_infinite = false;
    }
    else if (std::isfinite(interval_begin) && std::isinf(interval_end)){
        // a do (+- nieskończoność)
        if (interval_end == -INFINITY){
            // przedział odwrócony
            real_function _tmp_handler = _get_handler_mIF(interval_begin, expr, var);
            result.t_func =
            [=] (double u){
                    return -(_tmp_handler(u)); // zmiana znaku
                };
            result.left_infinite = true;
            result.right_infinite = false;
        }

        result.t_func = _get_handler_FpI(interval_begin, expr, var);
        result.left_infinite = false;
        result.right_infinite = true;
    }
    else {
        result.t_func = _get_handler_mIpI(expr, var);
        result.left_infinite = true;
        result.right_infinite = true;
    }
    return result;
}


void initialize_expression(const std::string &func_expr, const std::string &var_name,
                           expr_t &expr, double &variable){
    symbol_table sym_tab;
    parser_t parser;

    sym_tab.add_variable(var_name, variable);
    sym_tab.add_pi();
    sym_tab.add_constant("e", exp(1));
    sym_tab.add_infinity();

    expr.register_symbol_table(sym_tab);

    if(!parser.compile(func_expr, expr)){            
        throw ParserCompilationError(func_expr + "\n" + parser.error());
    }
}