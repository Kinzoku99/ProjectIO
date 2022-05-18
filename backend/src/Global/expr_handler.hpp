#ifndef EXPR_HANDLE_HEADER
#define EXPR_HANDLE_HEADER

#include <main_definitions.hpp>


typedef struct {
    real_function t_func;
    bool left_infinite, right_infinite;
} handler_out;

/**
 * Przekazuje pośrednik między zadaną całką z funkcji a całką po przedziale 0-1
 */
handler_out get_handler(double interval_begin, double interval_end, expr_t &expr, double &var);

/**
 * @brief Inicjalizuje wyrażenie względem podanej zmiennej i jej referencji
 */
void initialize_expression(const std::string &func_expr, const std::string &var_name,
                           expr_t &expr, double &variable);



#endif  /* EXPR_HANDLE_HEADER */