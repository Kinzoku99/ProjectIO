#include "../src/num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cstdint>


double test_func(double x) { return 2 * x; }

int main(){

    FILE *output = fopen("tests/rk4_test_output.txt", "w+");

    solver_out_t out = des_runge_kutta(test_func, 1, 1e-3, 1, 3, 4);
    
    for (uint64_t i = 0; i < out.numOfPoints; ++i)
        fprintf(output, "%.15lf %.15lf\n", out.points[i].x, out.points[i].y);

    delete[] out.points;
    
    fclose(output);    

}