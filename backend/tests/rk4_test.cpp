#include "../src/num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cstdint>
#include <cmath>

double test_func(double x) { return 2 * x; }
double result(double x) { return x * x; }

int main(){

    FILE *output = fopen("tests/rk4_test_output.txt", "w+");

    solver_out_t out = des_runge_kutta(test_func, 0, 1e-3, -10, 10, 4);
    double error2 = 0;
    for (uint64_t i = 0; i < out.numOfPoints; ++i){
        error2 += (result(out.points[i].x) - out.points[i].y)*(result(out.points[i].x) - out.points[i].y);
        fprintf(output, "%.15lf %.15lf\n", out.points[i].x, out.points[i].y);
    }
    error2 = std::sqrt(error2);
    delete[] out.points;
    
    fclose(output);    

}