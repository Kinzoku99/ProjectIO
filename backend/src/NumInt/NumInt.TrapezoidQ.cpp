#include "num.Integrals.hpp"
#include <cstdbool>
#include <cmath>

#include <cstdio>
#include <cassert>

#include <pybind11/pybind11.h>

namespace py = pybind11;

/* Metoda Romberga oferuje zbieżność rzędu
 * O( h^(2 + 2*MAX_ROMBERG_STEPS) )
 */
#define MAX_ROMBERG_STEPS 5

#if MAX_ROMBERG_STEPS < 1
#error "Zła maksymalna wartość kroków metody Romberga"
#endif



double integrate_trapezoid(const std::string &func_expr, const std::string &var_name, double b, double e, size_t num_of_divisions){
    expr_t expression;
    double variable;

    initialize_expression(func_expr, var_name, expression, variable);

    real_function handler = get_handler(b, e, expression, variable);
    intrvl_ends_t ends = check_func_at_ends(handler);
    
    return  trapezoid_quadrature_01(
                handler,
                num_of_divisions,
                ends
            );
}

double integrate_romberg(const std::string &func_expr, const std::string &var_name, double b, double e, size_t num_of_divisions, double tol){
    expr_t expression;
    double variable;

    initialize_expression(func_expr, var_name, expression, variable);
    
    real_function handler = get_handler(b, e, expression, variable);
    intrvl_ends_t ends = check_func_at_ends(handler);

    return  romberg_quadrature_01(
                handler,
                num_of_divisions,
                tol,
                ends
            );
}

#define SINGULARITY_DIVISIONS 1e4

/**
 * Oblicza całkę metodą trapezów na przedziale [start, end] o kroku długości h.
 * Używa poprawki końca przedziału, czyli jeżeli ostatni trapez, nie mieścił
 * sie w przedziale i jego pole jest skończone, to jest on dodawany do wyniku.
 */
static double inner_trapezoid_quadrature(double start, double end, double h, real_function f){
    double result = 0;
    double x = start;

    result += f(x) / 2.0;       // Dodajemy pierwszy bok pierwszego trapezu
    x += h;

    // Dopóki ten *i następny* trapez są w zakresie,
    while (x + h < end){
        result += f(x);         // dodaj bok dwukrotnie (ten + następny)
        x += h;
    }
                                // Jeżeli już następny się nie mieści,
    result += f(x) / 2.0;       // dodaj bok ostatni, tylko raz
    result *= h;                // Wszystko ma podstawę = h

    double last_h = (end - x);
    double last_correction = 
        (f(end) + f(x)) * last_h / 2.0;

    if (std::isfinite(last_correction))
        result += last_correction;

    return result;
}

double trapezoid_quadrature_01(
  const real_function &function,    /**< Funkcja przyjmująca i przekazująca
                                         parametr typu double.           */
  size_t num_of_divisions,          ///< Liczba podziałów
  intrvl_ends_t allow_ends          ///< Czy ewaluacja na krańcach jest ok?
){
    double inner_evaluation = 0;
    double h = 1.0 / num_of_divisions;
    bool allow_left = allow_ends.allow_eval_at_left;
    bool allow_right = allow_ends.allow_eval_at_right;
    double first_piece = 0, last_piece = 0;


    if (allow_left)
        first_piece = (function(0) + function(h)) * h / 2.0;
    else {
        // W zerze jest prawdopodobnie osobliwość
        double hy = h / SINGULARITY_DIVISIONS;

        // Dodaj przybliżenie całki blisko osobliwości, czyli na [0 + hy, h] 
        first_piece = inner_trapezoid_quadrature(hy, h, hy, function);
    }
    
    if (allow_right)
        last_piece = (function(1) + function(1.0 - h)) * h / 2.0;
    else {
        // W jedynce jest prawdopodobnie osobliwość
        double hy = h / SINGULARITY_DIVISIONS;

        // Dodaj przybliżenie całki blisko osobliwości, czyli na [1 - h, 1 - hy]
        last_piece = inner_trapezoid_quadrature(1.0-h, 1.0-hy, hy, function);
    }

    inner_evaluation = inner_trapezoid_quadrature(h, 1.0 - h, h, function);
    
    return first_piece + inner_evaluation + last_piece;
}

/**
 * @brief Procedura licząca całkę przy pomocy metody Romberga
 *        dla złożonej kwadratury trapezów
 */
double romberg_quadrature_01(
  const real_function &function,    /**< Funkcja przyjmująca i przekazująca
                                         parametr typu double.           */
  size_t num_of_divisions,          ///< Liczba wstępnych podziałów do wykonania
  double tol,                       ///< Oczekiwana tolerancja końcowa
  intrvl_ends_t allow_ends          ///< Czy ewaluacja na krańcach jest ok?
){
    // Pozycja elementu o najmniejszej długości podziału
    size_t current_position = MAX_ROMBERG_STEPS - 1; 

    // Tablica wyliczonych wartości
    double romberg_evals[MAX_ROMBERG_STEPS];

    bool accuracy_achieved = false;
    size_t algorithm_iteration = 0;

    // Funkcja trapezoid_quadrature_01 oblicza złożoną kwadraturę trapezów
    romberg_evals[MAX_ROMBERG_STEPS-1] =
        trapezoid_quadrature_01(function, num_of_divisions, allow_ends);

    while((algorithm_iteration < MAX_ROMBERG_STEPS -1) && !accuracy_achieved){
        
        // Aby porównać czy osiągneliśmy wystarczającą dokładność
        // zapamiętujemy, poprzednie najlepsze przybliżenie
        double last_best_approximation = romberg_evals[MAX_ROMBERG_STEPS - 1];

        // Nowe przybliżenie, musi być obliczone z h o połowę mniejszym
        // czyli liczba podziałów musi się zwiększyć dwukrotnie
        num_of_divisions *= 2;
        // Obliczamy nowe przybliżenie i zapisujemy na lewo od już posiadanych
        romberg_evals[current_position - 1] =
            trapezoid_quadrature_01(function, num_of_divisions, allow_ends);

        /**********************************************************************
         * W metodzie Romberga, ważne są współczynniki, które zależą od
         * "iteracji poprawki".
         * Dodając nowe przybliżenie, jego "iteracja" to 0.
         * Aby obliczyć kolejną iterację przybliżenia, musimy mieć
         * przybliżenie o mniejszym "h" o tej samej iteracji.
         * 
         * Następnie iteracje będą się kaskadowo dodawać:
         * Def. Przybliżenie o długości podziału h i iteracji j := P(h, j)
         * Zasada obliczania:
         * P(h/2, j) & P(h, j) --> P(h, j + 1)
        **********************************************************************/

        // Pierwszy wykładnik to 1, wartość początkowej iteracji
        double exponent = 1;

        // Zaczynamy od elementu, który możemy poprawić
        // pod "current_position - 1" wpisaliśmy nowe przybliżenie
        size_t i = current_position;
        for (; i < MAX_ROMBERG_STEPS; ++i){
            // Obliczamy współczynnik przy nowo obliczonym przybliżeniu
            double coefficient_new = pow(4, exponent) / (pow(4, exponent) - 1);
            // oraz współczynnik przy ostatnim przybliżeniu
            double coefficient_prev = 1 / (pow(4,exponent) - 1);

            // Metoda Romberga
            romberg_evals[i] =  romberg_evals[i-1] * coefficient_new
                                - romberg_evals[i] * coefficient_prev;
            
            // Zwiększamy wykładnik, ponieważ zwiększyła się też
            // iteracja poprawki, więc możemy polepszyć kolejne przybliżenie
            exponent += 1.0;
        }
        
        // romberg_evals[MAX_ROMBER_STEPS-1] to najlepsze przybliżenie
        double current_best_approximation = romberg_evals[MAX_ROMBERG_STEPS-1];

        if (fabs(last_best_approximation - current_best_approximation) < tol)
            accuracy_achieved = true;
        // w.p.p. nic nie robimy, accuracy_achieved pozostaje false
        
        // Przechodzimy do następnej iteracji metody:
        // aktualizujemy akutalną pozycję
        --current_position;
        // oraz zwiększamy licznik iteracji
        ++algorithm_iteration;
    }
    // Na wyjściu z pętli while, przekazujemy na wyjście wartośc
    // najelpszego przybliżenia
    return romberg_evals[MAX_ROMBERG_STEPS - 1];
}

PYBIND11_MODULE(NumIntTrapezoid, handle){
    handle.doc() = "";
    handle.def("integrate_trapezoid", &integrate_trapezoid);
    handle.def("integrate_romberg", &integrate_romberg);
}
