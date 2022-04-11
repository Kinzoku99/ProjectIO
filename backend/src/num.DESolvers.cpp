#include "num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>

void rk1(double (*func)(double), double h, uint64_t step, uint16_t numOfPoints, ptout_t *points){
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += h*func(tmpx);
                tmpx += h;
            }
            points[i].x = tmpx;
            points[i].y = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            points[i].y += h*func(points[i].x);
            points[i].x += h;
        }
    }
}

void rk2(double (*func)(double), double h, uint64_t step, uint16_t numOfPoints, ptout_t *points){
    if (step > 1) {
        double tmpx = points[0].x, tmpy = points[0].y;
        for (uint64_t i = 1; i < numOfPoints; ++i){
            for (uint64_t j = 0; j < step; ++j){
                tmpy += (h/2.0)*(func(tmpx) + func(tmpx + h));
                tmpx += h;
            }
            points[i].x = tmpx;
            points[i].y = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            points[i].y += (h/2.0)*(func(points[i].x) + func(points[i].x + h));
            points[i].x += h;
        }
    }
}

void rk3(double (*func)(double), double h, uint64_t step, uint16_t numOfPoints, ptout_t *points){
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
            points[i].x = tmpx;
            points[i].y = tmpy;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            k1 = func(points[i].x);
            k2 = func(points[i].x + h/2.0);
            k3 = func(points[i].x + h);
            points[i].y += (h/6.0)*(k1 + 4*k2 + k3);
            points[i].x += h;
        }
    }
}

void rk4(double (*func)(double), double h, uint64_t step, uint16_t numOfPoints, ptout_t *points){
    double tmpx = points[0].x, tmpy = points[0].y;
    double k1, k2, k3, k4;
    if (step > 1) {
        for (uint64_t i = 1; i < numOfPoints; ++i){

            for (uint64_t j = 0; j < step; ++j){
                k1 = func(tmpx);
                k2 = func(tmpx + h / 2.0);
                k3 = k2;
                k4 = func(tmpx + h);

                tmpy = tmpy + h * (k1 + 2.0*k2 + 2.0*k3 + k4)/6.0;
                tmpx = tmpx + h;
            }
            points[i].y = tmpy;
            points[i].x = tmpx;
        }
    } else {
        for (uint64_t i = 1; i < numOfPoints; ++i){
            k1 = func(tmpx);
            k2 = func(tmpx + h / 2.0);
            k3 = k2;
            k4 = func(tmpx + h);

            tmpy = tmpy + h * (k1 + 2.0*k2 + 2.0*k3 + k4)/6.0;
            tmpx = tmpx + h;

            points[i].y = tmpy;
            points[i].x = tmpx;
        }
    }
}

solver_out_t des_runge_kutta(double (*func)(double), double x0, double h, double t0, double T, uint16_t rank = 4){
    uint64_t n = ((std::abs(T - t0)) + h )/ h;
    T = t0 + n * h;
    
    uint64_t step = n / MAX_POINTS_ON_PLOT;
    step += (step == 0);
    uint64_t numOfPoints = n / step;
    
    printf("step = %lu\t numOfPoints = %lu\t allpoints = %lu\n", step, numOfPoints, n);

    ptout_t *points = new ptout_t[numOfPoints];
    points[0].x = t0;
    points[0].y = x0;

    
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
    solver_out_t output = {points, numOfPoints};

    return output;
}

