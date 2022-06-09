/**
 * @file main_definitions.hpp
 * @author Hubert Lubański (h.lubanski@student.uw.edu.pl)
 * Plik zawierający główne definicje i polecenie #include
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

#ifndef NDEBUG
    #pragma message ( "DEBUG IS ON" )
    #define debugf(fmt, ...)    \
    fprintf(stderr, fmt, ##__VA_ARGS__)
#else
    #define debugf(fmt, ...)
#endif

#define GLOBAL_TOLERANCE 1e-6

using real_function = std::function<double(double)>;

typedef exprtk::expression<double> expr_t;
typedef exprtk::symbol_table<double> symbol_table;
typedef exprtk::parser<double> parser_t;


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

#endif /* MAIN_DEFINITIONS_H */