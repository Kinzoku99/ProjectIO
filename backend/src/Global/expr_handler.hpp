#ifndef EXPR_HANDLE_HEADER
#define EXPR_HANDLE_HEADER

#include <main_definitions.hpp>


typedef struct {
    bool allow_eval_at_left;
    bool allow_eval_at_right;
} intrvl_ends_t;


/**
 * Sprawdza czy ewaluacja na krańcach jest dozwolona.
 * (Czy nie występuje błąd lub wynik ewaluacji jest skończony)
 */ 
intrvl_ends_t check_func_at_ends(real_function func);

/**
 * Przekazuje pośrednik między zadaną całką z funkcji a całką po przedziale 0-1
 */
real_function get_handler(double interval_begin, double interval_end, expr_t &expr, double &var);

real_function get_function(expr_t &expr, double &var);
real_function get_deweighted_function(expr_t &expr, double &var, const real_function &w);

void expression_infix_operator_replace(std::string &expr,
                                       const std::string &inf_beg,
                                       const std::string &inf_end,
                                       const std::string &replace
                                       );

/**
 * @brief Inicjalizuje wyrażenie względem podanej zmiennej i jej referencji
 */
void initialize_expression(const std::string &func_expr, const std::string &var_name,
                           expr_t &expr, double &variable);



#endif  /* EXPR_HANDLE_HEADER */