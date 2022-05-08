/**
 * @file main_definitions.hpp
 * @author Hubert Lubański (h.lubanski@student.uw.edu.pl)
 * Plik zawierający głowne definicje i procedury tworzące podstawowy interfejs
 * dla metod całkowania numerycznego
 * @version 1
 * @date 2022-05-03
 * 
 */
#ifndef MAIN_DEFINITIONS_H
#define MAIN_DEFINITIONS_H

#include <functional>
#include <cmath>
#include "exprtk.hpp"
#include "../../../pybind/pybind11/include/pybind11/pybind11.h"
#include "../../../pybind/pybind11/include/pybind11/stl.h"

using real_function = std::function<double(double)>;

typedef exprtk::expression<double> expr_t;
typedef exprtk::symbol_table<double> symbol_table;
typedef exprtk::parser<double> parser_t;

// Jeszcze nie w użyciu
enum integration_methods {
    trapezoidal,
    complex_trapezoidal,
    rombergs_method,
    gauss_legrende
};

// Wyjątek rzucany przez program, gdy nastąpi błąd parsowania wyrażenia
// Wyjątek ten będzie zawierał wiadomość od parsera
class ParserCompilationError : public std::exception {
        private:
        const std::string expr;
        public:
        ParserCompilationError() = delete;
        explicit ParserCompilationError(const std::string &f_expr)
          : expr("Wystąpił błąd przy odczytywaniu wyrażenia funkcji. Wyrażenie: " + f_expr + ".")
        {}


        const char *what() const throw() override {
            return expr.c_str();
        }
    };
/**
 * Przekazuje pośrednik między zadaną całką z funkcji a całką po przedziale 0-1
 */
inline real_function get_handler(double interval_begin, double interval_end, expr_t &expr, double &var){

    if (std::isfinite(interval_begin) && std::isfinite(interval_end)){

        return [&var, &expr, interval_end, interval_begin]
            (double u){
                var = u * (interval_end - interval_begin) + interval_begin;
                return expr.value() * (interval_end - interval_begin);
            };
    }
    else
        // TODO przekształcenie nieskończonych przedziałów
        assert(0 && "WIP. Nieskończone przedziały całkowania.");
    
}
/**
 * @brief Inicjalizuje wyrażenie względem podanej zmiennej i jej referencji
 */
inline void initialize_expression(const std::string &func_expr, const std::string &var_name,
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

#endif /* MAIN_DEFINITIONS_H */