#include "num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cmath>

#include <pybind11/pybind11.h>

namespace py = pybind11;


void rk1(const real_function &func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    if (step > 1) {
        double tmpx = points[0].first, tmpy = points[0].second;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += h*func(tmpx);
                tmpx += h;
            }
            points.push_back(point(tmpx, tmpy));
            // points[i].first = tmpx;
            // points[i].second = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            points.push_back(
                {points[i-1].first + h, points[i-1].second + h*func(points[i-1].first)}
            );
            // points[i].second += h*func(points[i].first);
            // points[i].first += h;
        }
    }
}

void rk2(const real_function &func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    if (step > 1) {
        double tmpx = points[0].first, tmpy = points[0].second;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += (h/2.0)*(func(tmpx) + func(tmpx + h));
                tmpx += h;
            }
            points.push_back(point(tmpx, tmpy));
            // points[i].first = tmpx;
            // points[i].second = tmpy;
            
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].first;
            old_y = points[i-1].second;
            
            points.push_back(
                {old_x + h, old_y + (h/2.0)*(func(old_x) + func(old_x + h))}
            );
            // points[i].second += (h/2.0)*(func(points[i].first) + func(points[i].first + h));
            // points[i].first += h;
        }
    }
}

void rk3(const real_function &func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    double k1, k2, k3;
    if (step > 1) {
        double tmpx = points[0].first, tmpy = points[0].second;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                k1 = func(tmpx);
                k2 = func(tmpx + h/2.0);
                k3 = func(tmpx + h);
                tmpy += (h/6.0)*(k1 + 4*k2 + k3);
                tmpx += h;
            }
            points.push_back(point(tmpx, tmpy));
            // points[i].first = tmpx;
            // points[i].second = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].first;
            old_y = points[i-1].second;

            k1 = func(old_x);
            k2 = func(old_x + h/2.0);
            k3 = func(old_x + h);

            points.push_back(
                {old_x + h, old_y + (h/6.0)*(k1 + 4*k2 + k3)}
            );
            // points[i].second += (h/6.0)*(k1 + 4*k2 + k3);
            // points[i].first += h;
        }
    }
}

void rk4(const real_function &func, double h, uint64_t step, uint16_t numOfPoints, solver_out_t &points){
    double k1, k2, k3, k4;
    if (step > 1) {
        double tmpx = points[0].first, tmpy = points[0].second;
        for (uint64_t i = 1; i < numOfPoints; ++i){

            for (uint64_t j = 0; j < step; ++j){
                k1 = func(tmpx);
                k2 = func(tmpx + h / 2.0);
                k3 = k2;
                k4 = func(tmpx + h);

                tmpy = tmpy + h * (k1 + 2.0*k2 + 2.0*k3 + k4)/6.0;
                tmpx = tmpx + h;
            }
            points.push_back(point(tmpx, tmpy));
            // points[i].second = tmpy;
            // points[i].first = tmpx;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            double old_x, old_y;
            old_x = points[i-1].first;
            old_y = points[i-1].second;

            k1 = func(old_x);
            k2 = func(old_x + h / 2.0);
            k3 = k2;
            k4 = func(old_x + h);

            points.push_back(
                {old_x + h, old_y + (h/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4)}
            );
            // points[i].second = tmpy;
            // points[i].first = tmpx;
        }
    }
}


solver_out_t des_runge_kutta(const std::string &func_expr, const std::string &var_name, double x0, double h, double t0, double T, uint16_t rank = 4){
    expr_t expression;
    double variable;

    initialize_expression(func_expr, var_name, expression, variable);
    real_function func = [&](double x){
        variable = x;
        return expression.value();
    };

    uint64_t n = ((std::abs(T - t0)) + h )/ h;
    T = t0 + n * h;
    
    uint64_t step = n / MAX_POINTS_ON_PLOT;
    step += (step == 0);
    uint64_t numOfPoints = n / step;

    solver_out_t points;
    points.reserve(numOfPoints);
    points.push_back({t0, x0});

    switch (rank){
        case 1:
            rk1(func, h, step, numOfPoints, points);
            break;
        case 2:
            rk2(func, h, step, numOfPoints, points);
            break;
        case 3:
            rk3(func, h, step, numOfPoints, points);
            break;
//      case 4:
        default:
            rk4(func, h, step, numOfPoints, points);
            break;
        case 5:
            break;
        case 6:
            break;
    }

    return points;
}

PYBIND11_MODULE(NumODERungeKutta, handle) {
     handle.doc() = "";
     handle.def("des_runge_kutta", &des_runge_kutta);
}