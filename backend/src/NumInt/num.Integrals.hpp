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

#define M_SQRT_PIl __f64(1.77245385090551602729816748334114518279L)

typedef struct {
    double node, weight;
} weighted_node_t;

using qnodes = std::vector<weighted_node_t>;

/**
 * @brief Rodzaje kwadratur Gaussa-<...>
 */
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

/**
 * @brief Całkowanie numeryczne z użyciem jednej z kwadratur typu Gaussa
 * 
 * @attention Ta procedura sztucznie mnoży i dzieli podaną funkcję przez
 *            funkcję wagową. Dla szybko rosnących funkcji wagowych
 *            (np. kwadratura Gaussa-Hermite'a) prowadzi to szybko
 *            do błędu obliczeń (niesk. / niesk. lub 0 / 0). Jeżeli 
 *            funkcja wagowa jest już podana, powinno się używać procedury
 *            @ref integrate_gauss_weight_provided
 * 
 * @param function_expression   Napis zawierający definicję funkcji
 * @param variable_name         Napis zawierający nazwę zmiennej
 * @param q_type                Typ kwadratury (Gaussa-?)
 * @param rank                  Rząd kwadratury
 * @return double               Aproksymacja całki z podanej funkcji
 */
double integrate_gauss(
    const std::string &function_expression,
    const std::string &variable_name,
    gauss_quadrature_type q_type,
    size_t rank
);
/**
 * @brief Całkowanie numeryczne z użyciem jednej z kwadratur typu Gaussa
 * 
 * @attention Zakładamy, że wprowadzana funkcja jest w odpowiedniej postaci
 *            w(x) * f(x), gdzie w(x) to odpowiednia funkcja wagowa, 
 *            zależna od wybranej kwadratury.
 * 
 * @param function_expression   Napis zawierający definicję funkcji
 * @param variable_name         Napis zawierający nazwę zmiennej
 * @param q_type                Typ kwadratury (Gaussa-?)
 * @param rank                  Rząd kwadratury
 * @return double               Aproksymacja całki z podanej funkcji
 */
double integrate_gauss_weight_provided(
    const std::string &function_expression,
    const std::string &variable_name,
    gauss_quadrature_type q_type,
    size_t rank
);

/*
 * Poniżej znajdują się nagłówki procedur liczących.
 * Uwaga! procedury te liczą całki TYLKO na przedziale 0-1.
 * 
 * Niektóre, może i poradziłby sobie z dowolnym przedziałe, ale
 * w celach ujednolicenia dostępu, należy konstruować funkcję : [0,1] -> R
 */


/**
 * Procedura licząca całkę między 0-1 przy pomocy złożonej kwadratury trapezów
 * @attention z dostatecznie gładkiej funkcji bez punktów osobliwych
 */
double trapezoid_quadrature_01(const real_function &function, size_t num_of_divisions, intrvl_ends_t ends_info);

/**
 * Procedura licząca całkę między 0-1 przy pomocy metody Romberga
 * dla złożonej kwadratury trapezów
 * @attention z dostatecznie gładkiej funkcji bez punktów osobliwych
 */
double romberg_quadrature_01(const real_function &function, size_t num_of_divisions, double tol, intrvl_ends_t ends_info);


namespace tester {


double __raw_integrate_gauss(
    gauss_quadrature_type q_type,
    size_t rank,
    real_function integrand
);

qnodes get_gqdrtr_qnodes(gauss_quadrature_type type, size_t rank);

}

#endif /* NUM_INTEGRAL_H */
