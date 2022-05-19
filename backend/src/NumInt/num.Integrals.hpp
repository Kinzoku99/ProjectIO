/**
 * @file num.Integrals.hpp
 * @author Hubert Lubański
 * @brief Plik nagłówkowy zawierający interfejs do numerycznych metod całkowania
 * @version 0.1
 * @date 2022-03-07
 * 
 */
#ifndef NUM_INTEGRALS_H
#define NUM_INTEGRALS_H

#include <cstdlib>
#include <string>
#include <main_definitions.hpp>
#include <expr_handler.hpp>

typedef struct {
    double node, weight;
} weighted_node_t;

using qnodes = std::vector<weighted_node_t>;

typedef enum __gauss_who_qdrtr {
    Hermite,
    Chebyshev,
    Laugerre,
    Legrende
} gauss_quadrature_type;


/**
 * @brief Całkowania numeryczne z użyciem złożonej kwadratury trapezów
 * 
 * @param function_expression   Napis zawierający definicję funkcji
 * @param variable_name         Napis zawierający nazwę zmiennej
 * @param interval_begin        Początek przedziału całkowania
 * @param interval_end          Koniec przedzialu całkowania
 * @param num_of_divisions      Liczba podziałów odnicka
 * @return double               Aproksymacja całki z podanej funkcji
 */
double integrate_trapezoid(
  const std::string &function_expression,
  const std::string &variable_name,
  double interval_begin,
  double interval_end,
  size_t num_of_divisions
);

/**
 * @brief Całkowanie numeryczne z użyciem metody Romberga
 * 
 * @param function_expression   Napis zawierający definicję funkcji
 * @param variable_name         Napis zawierający nazwę zmiennej
 * @param interval_begin        Początek przedziału całkowania
 * @param interval_end          Koniec przedzialu całkowania
 * @param num_of_divisions      Liczba podziałów odnicka
 * @param tol                   Tolerancja, którą pragniemy osiągnąć
 * @return double               Aproksymacja całki z podanej funkcji
 */
double integrate_romberg(
  const std::string &function_expression,
  const std::string &variable_name,
  double interval_begin,
  double interval_end,
  size_t num_of_divisions,
  double tol
);



/*
 * Poniżej znajdują się nagłówki procedur liczących.
 * Uwaga! procedury te liczą całki TYLKO na przedziale 0-1.
 */

/**
 * Procedura licząca całkę między 0-1 przy pomocy złożonej kwadratury trapezów
 * @attention z dostatecznie gładkiej funkcji bez punktów osobliwych
 * 
 */
double trapezoid_quadrature_01(const real_function &function, size_t num_of_divisions, bool exclude_left, bool exclude_right);

/**
 * Procedura licząca całkę między 0-1 przy pomocy metody Romberga
 * dla złożonej kwadratury trapezów
 * @attention z dostatecznie gładkiej funkcji bez punktów osobliwych
 */
double romberg_quadrature_01(const real_function &function, size_t num_of_divisions, double tol, bool exclude_left, bool exclude_right);





#endif /* NUM_INTEGRAL_H */
