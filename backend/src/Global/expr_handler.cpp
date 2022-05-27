#include "expr_handler.hpp"


intrvl_ends_t check_func_at_ends(real_function f){
    intrvl_ends_t result;
    try {
        result.allow_eval_at_left = std::isfinite(f(0));
        result.allow_eval_at_right = std::isfinite(f(1));
    } catch (...){
        result = {false, false};
    }
    return result;
}

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

real_function get_handler(double interval_begin, double interval_end, expr_t &expr, double &var){
    real_function result;
    if (std::isfinite(interval_begin) && std::isfinite(interval_end)){
        result =
            _get_handler_FF(interval_begin, interval_end, expr, var);
        
    }
    else if (std::isinf(interval_begin) && std::isfinite(interval_end)){
        // (+- nieskończoność) do b
        if (interval_begin == INFINITY){
            // przedział odwrócony
            real_function _tmp_handler = _get_handler_FpI(interval_end, expr, var);
            result =
            [=] (double u){
                    return -(_tmp_handler(u)); // zmiana znaku
                };
        }

        result = _get_handler_mIF(interval_end, expr, var);
    }
    else if (std::isfinite(interval_begin) && std::isinf(interval_end)){
        // a do (+- nieskończoność)
        if (interval_end == -INFINITY){
            // przedział odwrócony
            real_function _tmp_handler = _get_handler_mIF(interval_begin, expr, var);
            result =
            [=] (double u){
                    return -(_tmp_handler(u)); // zmiana znaku
                };
        }

        result = _get_handler_FpI(interval_begin, expr, var);
    }
    else {
        result = _get_handler_mIpI(expr, var);
    }
    return result;
}


void expression_infix_operator_replace(
        std::string &expr,
        const std::string (&infrep)[3]
){
    const std::string &&tmp_replace = infrep[2] + "(";
    std::string::size_type beg = -1, end = -1;
    bool both_found = true;
    auto rep_first = tmp_replace.begin();
    auto rep_second = tmp_replace.end();
    while (both_found){
        if ((beg = expr.find(infrep[0], end+1)) != std::string::npos
        &&  (end = expr.find(infrep[1], beg+1)) != std::string::npos){
            auto first = expr.begin() + beg;
            auto second = first + infrep[0].size();

            expr.replace(first, second, rep_first, rep_second);


            first = expr.begin() + tmp_replace.size() - infrep[0].size() + end;
            second = first + infrep[1].size();
            expr.replace(first, second, ")");

        }
        else
            both_found = false;
    }                                           
}

#define REPLACE_INFIX_WITH(infix_S, infix_E, replacement)   \
    {infix_S, infix_E, replacement}

/**
 * UZUPEŁNIANIE TEJ TABLICY MUSI BYĆ WYKONYWANE ZE SZCZEGÓLNĄ UWAGĄ
 *  zamiana operatora infiksowego a<coś>b na f(<coś>) jest wykonywana
 *  sekwencyjnie, więc operacje mogą się na siebie nałożyć.
 * Dla przykładu:
 *  W tablicy znajdują się wpisy:
 *      1.) REPLACE_INFIX_WITH("a", "b", "c")
 *      2.) REPLACE_INFIX_WITH("c", "d", "e")
 *  Przekształcanym napisem jest:
 *      "Spójrz 3a+ 2b = 3, jednak 3c + 2d = 5"
 *  Może zostać zamieniony najpierw na:
 *      Spójrz 3c(+2) = 3, jednak 3c + 2d = 5
 *  A POTEM na:
 *      Spójrz 3e((+2) = 3, je)nak3e(+2) = 5
 *  Co może nie być zgodne intuicją.
 */ 

static const std::string __infix_operators_replaces[][3] = {
    REPLACE_INFIX_WITH("|", "|", "abs"),
};

template <typename T>
inline T custom_ln(T x){
    return log(x);
}

void initialize_expression(const std::string &orig_func_expr, const std::string &var_name,
                           expr_t &expr, double &variable){
    symbol_table sym_tab;
    parser_t parser;
    std::string func_expr = orig_func_expr;
    
    for (auto &infrep : __infix_operators_replaces)
        expression_infix_operator_replace(func_expr, infrep);
    

    sym_tab.add_variable(var_name, variable);
    sym_tab.add_pi();
    sym_tab.add_constant("e", exp(1));
    sym_tab.add_infinity();
    sym_tab.add_function("ln", custom_ln);

    expr.register_symbol_table(sym_tab);

    if(!parser.compile(func_expr, expr)){            
        throw ParserCompilationError(func_expr + "\n" + parser.error());
    }
}


real_function get_function(expr_t &expr, double &var){
    return [&](double x){
        var = x;
        return expr.value();
    };
}

real_function get_deweighted_function(expr_t &expr, double &var, const real_function &w){
    return [&](double x){
        var = x;
        return expr.value() / w(x);
    };
}