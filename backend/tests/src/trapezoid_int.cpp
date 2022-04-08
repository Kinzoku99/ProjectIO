#include <cmath>
#include "../../src/num.Integrals.hpp"
#include "tester.hpp"


TESTS_TO_RUN = {
    MAKE_TEST(2*x,        pow(x,2)),
    MAKE_TEST(3*pow(x,2), pow(x,3)),
    MAKE_TEST(exp(x),     exp(x)),
};

int main(){
    double f_0, f_1, integral;
    double h = 1e-6;
    double tol = 1e-5;
    printf("********************************************************************************\n");
    for (size_t i = 0; i < TESTS_SIZE; ++i){
        f_0 = TEST(i).result(0);
        f_1 = TEST(i).result(1);
        integral = trapezoid_quadrature_01(TEST(i).input, h);
        printf("Całka numeryczna z z funkcji %s od 0 do 1:\n\tPrawdziwy: %.12f\tObliczony: %.12f\n", TEST(i).name_input, f_1 - f_0, integral);
        assert_printf(
            fabs((f_1 - f_0) - integral) <= tol,
            "Dokładność, nieosiągnięta.\n Poprawny: %.12f\tUzyskany: %.12f\n", f_1 - f_0, integral
            );
    }
}