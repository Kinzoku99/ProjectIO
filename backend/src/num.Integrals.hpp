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

/**
 * @brief Procedura licząca całkę przy pomocy złożonej kwadratury trapezów
 * 
 */
double trapezoid_quadrature_01(double (*function)(double), double h);
/**
 * @brief Procedura licząca całkę przy pomocy metody Romberga
 *        dla złożonej kwadratury trapezów
 */
double romberg_quadrature_01(double (*function)(double), size_t num_of_divisions, double tol);

double nint_gaussian(double (*func)(double), double x0, double n);
double nint_QMC(double (*func)(double), double x0, double n);


#endif /* NUM_INTEGRAL_H */
