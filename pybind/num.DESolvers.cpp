#include "num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <iostream>

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

void rk1(real_function func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += h*func(tmpx);
                tmpx += h;
            }
            points.push_back({tmpx, tmpy});
            // points[i].x = tmpx;
            // points[i].y = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            points.push_back(
                {points[i-1].x + h, points[i-1].y + h*func(points[i-1].x)}
            );
            // points[i].y += h*func(points[i].x);
            // points[i].x += h;
        }
    }
}

void rk2(real_function func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += (h/2.0)*(func(tmpx) + func(tmpx + h));
                tmpx += h;
            }
            points.push_back({tmpx, tmpy});
            // points[i].x = tmpx;
            // points[i].y = tmpy;
            
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].x;
            old_y = points[i-1].y;
            
            points.push_back(
                {old_x + h, old_y + (h/2.0)*(func(old_x) + func(old_x + h))}
            );
            // points[i].y += (h/2.0)*(func(points[i].x) + func(points[i].x + h));
            // points[i].x += h;
        }
    }
}

void rk3(real_function func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    double k1, k2, k3;
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                k1 = func(tmpx);
                k2 = func(tmpx + h/2.0);
                k3 = func(tmpx + h);
                tmpy += (h/6.0)*(k1 + 4*k2 + k3);
                tmpx += h;
            }
            points.push_back({tmpx, tmpy});
            // points[i].x = tmpx;
            // points[i].y = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].x;
            old_y = points[i-1].y;

            k1 = func(old_x);
            k2 = func(old_x + h/2.0);
            k3 = func(old_x + h);

            points.push_back(
                {old_x + h, old_y + (h/6.0)*(k1 + 4*k2 + k3)}
            );
            // points[i].y += (h/6.0)*(k1 + 4*k2 + k3);
            // points[i].x += h;
        }
    }
}

void rk4(real_function func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    double k1, k2, k3, k4;
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){

            for (uint64_t j = 0; j < step; ++j){
                k1 = func(tmpx);
                k2 = func(tmpx + h / 2.0);
                k3 = k2;
                k4 = func(tmpx + h);

                tmpy = tmpy + h * (k1 + 2.0*k2 + 2.0*k3 + k4)/6.0;
                tmpx = tmpx + h;
            }
            points.push_back({tmpx, tmpy});
            // points[i].y = tmpy;
            // points[i].x = tmpx;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].x;
            old_y = points[i-1].y;

            k1 = func(old_x);
            k2 = func(old_x + h / 2.0);
            k3 = k2;
            k4 = func(old_x + h);

            points.push_back(
                {old_x + h, old_y + (h/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4)}
            );
            // points[i].y = tmpy;
            // points[i].x = tmpx;
        }
    }
}

std::vector<std::pair<double, double>> des_runge_kutta(std::string integrand, double initial_value,
                             double step_size, double begin_of_integrating_interval,
                             double end_of_integrating_interval, uint16_t rank_of_solver = 4) {
    uint64_t n = ((std::abs(end_of_integrating_interval - begin_of_integrating_interval)) + step_size ) / step_size;
    end_of_integrating_interval = begin_of_integrating_interval + n * step_size;
    
    uint64_t step = n / MAX_POINTS_ON_PLOT;
    step += (step == 0);
    uint64_t numOfPoints = n / step;

    double x = 0;
    symbol_table_t symbol_table;
    symbol_table.add_variable("x", x);
    symbol_table.add_constants();

    expression_t expression;
    expression.register_symbol_table(symbol_table);

    parser_t parser;
    if (!parser.compile(integrand, expression)) throw std::exception();

    real_function function = [&](double a) -> double {
        x = a;
        return expression.value();
    };

    solver_out_t points;
    points.reserve(numOfPoints);
    points.push_back({begin_of_integrating_interval, initial_value});

    switch (rank_of_solver){
        case 1:
            rk1(function, step_size, step, numOfPoints, points);
            break;
        case 2:
            rk2(function, step_size, step, numOfPoints, points);
            break;
        case 3:
            rk3(function, step_size, step, numOfPoints, points);
            break;
//      case 4:
        default:
            rk4(function, step_size, step, numOfPoints, points);
            break;
        case 5:
            break;
        case 6:
            break;
    }

    std::vector<std::pair<double, double>> result;

    for (auto a: points) {
        result.emplace_back(a.x, a.y);
    }

    return result;
}

PYBIND11_MODULE(numDESolvers, handle) {
    handle.doc() = "";
    handle.def("des_runge_kutta", &des_runge_kutta);
}
