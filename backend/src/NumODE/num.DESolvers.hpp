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
#include <iostream>

#include <iomanip>
#include <string>
#include <cmath>



// Definicja real_function
#include <main_definitions.hpp>

#define MAX_POINTS_ON_PLOT 2000


using point = std::pair<double, double>;
using solver_out_t = std::vector<point>;

inline std::ostream &operator<<(std::ostream &stream, const point &p){
    std::streamsize ss = stream.precision();
        return stream << std::setprecision(15) <<
               std::fixed << p.first << " " << p.second <<
               std::setprecision(ss) << std::defaultfloat;
}

inline double graphDiff(double value, const point &p){
    return fabs(p.second - value);
}

inline double functionDiff(real_function function, const point &p){
    return fabs(function(p.first) - p.second);
}


/**
 * @brief Traktując zadanie całkowania jak proste RRZ, znajduje jego trajektorię.
 * 
 * @param function_expression   - Napis zawierający definicję funkcji
 * @param variable_name         - Napis zawierający nazwę zmiennej
 * @param initial_value         - Wartość początkowa (całka jest +C)
 * @param step_size             - Krok metody
 * @param begin_of_integrating_interval - Początek przedziału całkowania
 * @param end_of_integrating_interval   - Koniec przedziału całkowania
 * @param rank_of_solver                - Ranga metody (RK to cała klasa metod)
 * @return solver_out_t         - std::vector par liczby typu double
 */
solver_out_t des_runge_kutta(
    const std::string &function_expression,
    const std::string &variable_name,
    double initial_value,
    double step_size,
    double begin_of_integrating_interval,
    double end_of_integrating_interval,
    uint16_t rank_of_solver
);

solver_out_t des_adams_bashforth(real_function func, double x0, double h, double t0, double T);

solver_out_t des_FEM(real_function func, double x0, double h, double t0, double T);



#endif /* NUM_DESOLVERS_H */
