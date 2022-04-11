#include "src/num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cstdint>
#include <cmath>

#include <tests/src/tester.hpp>

//TEST:   num   input       result
MAKE_TEST(0,    2*x,        pow(x,2))
MAKE_TEST(1,    3*pow(x,2), pow(x,3))
MAKE_TEST(2,    exp(x),     exp(x))
MAKE_TEST(3,    sqrt(x),    1/(2*sqrt(x)))

TESTS_TO_RUN = {
    ADD_TEST(0),
    ADD_TEST(1),
    ADD_TEST(2),
    ADD_TEST(3)
};

int main(){
    FILE *output = fopen("tests/outputs/rk4_test_output.txt", "w+");
    solver_out_t out = des_runge_kutta(TEST(1).input_function, 0, 0.000001, 0, 1, 4);
    for (size_t i = 0; i < 10; ++i){
        printf("%15lf, %15lf\n", TEST(1).input_function(i), TEST(1).result_function(i));
    }

    double error2 = 0;
    for (uint64_t i = 0; i < out.numOfPoints; ++i){
        error2 += (TEST(1).result_function(out.points[i].x) - out.points[i].y)*(TEST(1).result_function(out.points[i].x) - out.points[i].y);
        fprintf(output, "%.15lf %.15lf\n", out.points[i].x, out.points[i].y);
    }
    error2 = std::sqrt(error2);

    printf("ERROR := %.15lf\n", error2);

    delete[] out.points;
    
    fclose(output);    

}