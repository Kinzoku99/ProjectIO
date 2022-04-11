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

double nint_trapezoids(double (*func)(double), double x0, double n);
double nint_gaussian(double (*func)(double), double x0, double n);
double nint_QMC(double (*func)(double), double x0, double n);


#endif /* NUM_INTEGRAL_H */
