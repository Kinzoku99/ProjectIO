#include "../../src/num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cstdint>
#include <cmath>

#include "tester.hpp"

//TEST:   num   input       result


TESTS_TO_RUN = {
    MAKE_TEST(2*x,        pow(x,2)),
    MAKE_TEST(3*pow(x,2), pow(x,3)),
    MAKE_TEST(exp(x),     exp(x)),
    MAKE_TEST(1/(2*sqrt(x)),sqrt(x)),
};

int main(){
    int test_number = 3;
    FILE *output = fopen("tests/outputs/rk4_test_output.txt", "w+");
    solver_out_t out = des_runge_kutta(TEST(test_number).input, TEST(test_number).result(0.1), 0.000001, 0.1, 5, 4);

    double error2 = 0;
    for (uint64_t i = 0; i < out.numOfPoints; ++i){
        error2 += (TEST(test_number).result(out.points[i].x) - out.points[i].y)*(TEST(test_number).result(out.points[i].x) - out.points[i].y);
        fprintf(output, "%.15lf %.15lf\n", out.points[i].x, out.points[i].y);
    }
    error2 = std::sqrt(error2);

    printf("ERROR := %.15lf\n", error2);

    delete[] out.points;
    
    fclose(output);    

}