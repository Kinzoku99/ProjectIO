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
#include <functional>
#include <vector>

// Definicja real_function
#include "conventions.hpp"

#define MAX_POINTS_ON_PLOT 50000



class point_t {
    public:
    double x, y;
};
using solver_out_t = std::vector<point_t>;

std::vector<std::pair<double, double>> des_runge_kutta(
        std::string integrand,
        double initial_value,
        double step_size,
        double begin_of_integrating_interval,
        double end_of_integrating_interval,
        uint16_t rank_of_solver
);
solver_out_t des_adams_bashforth(real_function func, double x0, double h, double t0, double T);
solver_out_t des_FEM(real_function func, double x0, double h, double t0, double T);



#endif /* NUM_DESOLVERS_H */
