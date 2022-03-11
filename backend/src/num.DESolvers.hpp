/**
 * @file num.DESolvers.hpp
 * @author Hubert Lubański
 * @brief Plik nagłówkowy zawierający interfejs do numerycznych metod roziwązywania równań różniczkowych
 * @version 0.1
 * @date 2022-03-07
 * 
 */
#ifndef NUM_DESOLVERS_H
#define NUM_DESOLVERS_H
#include <cinttypes>

#define MAX_POINTS_ON_PLOT 1000


typedef struct point_output_struct{
    double x, y;
} ptout_t;

typedef struct solver_output_struct{
    ptout_t *points;
    uint64_t numOfPoints;
} solver_out_t;

solver_out_t des_runge_kutta(double (*func)(double), double x0, double h, double t0, double T, uint16_t rank);
solver_out_t des_adams_bashforth(double (*func)(double), double x0, double h, double t0, double T);
solver_out_t des_FEM(double (*func)(double), double x0, double h, double t0, double T);



#endif /* NUM_DESOLVERS_H */
