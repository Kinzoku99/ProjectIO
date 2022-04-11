#include "num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>

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

solver_out_t des_runge_kutta(real_function func, double x0, double h, double t0, double T, uint16_t rank = 4){
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

