#include "num.Integrals.hpp"
#include <cstdbool>
#include <cmath>

#include <cstdio>
#include <cassert>

#define MAX_ROMBERG_STEPS 5

#if MAX_ROMBERG_STEPS < 1
#error "Zła maksymalna wartość kroków metody Romberga"
#endif


double trapezoid_quadrature_01(
  double (*function)(double),       /**< Funkcja przyjmująca i przekazująca
                                         parametr typu double.               */
  double h                          ///< Długość pojedynczego podziału
){
    double evaluation = 0;
    double x = 0;

    evaluation += function(0) / 2.0;
    x += h;
    while (x < 1.0){
        evaluation += function(x);
        x += h;
    }
    x -= h;
    evaluation -= function(x) / 2.0;
    evaluation *= h;
    evaluation += (function(1) + function(x)) * (1.0 - x) / 2.0;

    return evaluation;
}

/**
 * @brief Procedura licząca całkę przy pomocy metody Romberga
 *        dla złożonej kwadratury trapezów
 */
double romberg_quadrature_01(
  double (*function)(double),       /**< Funkcja przyjmująca i przekazująca
                                         parametr typu double.               */
  size_t num_of_divisions,          ///< Liczba wstępnych podziałów do wykonania
  double tol                        ///< Oczekiwana tolerancja końcowa
){
    // h to długość pojedynczego podziału
    double h = 1.0 / num_of_divisions;
    // Pozycja elementu o najmniejej długości podziału
    size_t current_position = MAX_ROMBERG_STEPS - 1;
    // Tablica wyliczonych wartości
    double romberg_evals[MAX_ROMBERG_STEPS];
    // Czy osiągneliśmy oczekiwaną tolerancję?
    bool accuracy_achieved = false;
    // Iteracja algorytmu, mam odgórny limit 
    size_t iteration = 0;
    // Funkcja trapezoid_quadrature_01 oblicza złożoną kwadraturę trapezów
    romberg_evals[MAX_ROMBERG_STEPS-1] = trapezoid_quadrature_01(function, h);

    while((iteration < MAX_ROMBERG_STEPS -1) && !accuracy_achieved){
        
        
        // Aby porównać czy osiągneliśmy wystarczającą dokładność
        // zapamiętujemy, poprzednie najlepsze przybliżenie
        double last_best_approximation = romberg_evals[MAX_ROMBERG_STEPS - 1];
        // Dodając nowe przybliżenie, musimy zaktualizować "current_position"
        current_position = current_position - 1;
        // Nowe przybliżenie, musi być obliczone z h o połowę mniejszym
        h = h / 2.0;
        // Obliczamy i zapisujemy, nowe przybliżenie
        romberg_evals[current_position] = trapezoid_quadrature_01(function, h);
        // W metodzie Romberga, ważne są współczynniki, które zależą od
        // "iteracji poprawki". Dodając nowe przybliżenie, jego "iteracja"
        // to 0. Aby obliczyć kolejną iterację przybliżenia, musimy mieć
        // przybliżenie o mniejszym "h" o tej samej iteracji.
        // Zatem iteracje będą się kaskadowo dodawać:
        // Def. Przybliżenie o długości podziału h i iteracji j := p(h, j)
        // Zasada obliczania:
        // p(h/2, j) & p(h, j) --> p(h, j + 1)

        // Pierwszy wykładnik to 0, wartość początkowej iteracji
        double exponent = 1;
        for (size_t i = current_position + 1; i < MAX_ROMBERG_STEPS; ++i){
            // Obliczamy współczynnik przy nowo obliczonym przybliżeniu
            double coefficient_new = pow(4, exponent) / (pow(4, exponent) - 1);
            // oraz współczynnik przy ostatnim przybliżeniu
            double coefficient_prev = 1 / (pow(4,exponent) - 1);
            // Metoda Romberga
            romberg_evals[i] =  romberg_evals[i-1] * coefficient_new
                                - romberg_evals[i] * coefficient_prev;
            
            // Zwiększamy wykładni, ponieważ zwiększyła się też
            // iteracja poprawki
            exponent += 1.0;
        }
        
        // romberg_evals[MAX_ROMBER_STEPS-1] to najlepsze przybliżenie
        
        accuracy_achieved =
          ((last_best_approximation - romberg_evals[MAX_ROMBERG_STEPS-1]) < tol);
        // Przechodzimy do następnej iteracji metody
        ++iteration;
    }
    // Na wyjściu z pętli while, przekazujemy na wyjście wartośc
    // najelpszego przybliżenia
    return romberg_evals[MAX_ROMBERG_STEPS - 1];
}