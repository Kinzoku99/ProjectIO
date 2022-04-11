#include <cmath>
#include "../../src/num.Integrals.hpp"
#include "tester.hpp"


Tester TESTS_TO_RUN {
    MAKE_TEST(2*x,        pow(x,2)),
    MAKE_TEST(3*pow(x,2), pow(x,3)),
    MAKE_TEST(exp(x),     exp(x)),
};

int main(){
    double f_0, f_1, integral;
    double h = 1e-4;
    double tol = 1e-6;
    printf("********************************************************************************\n");
    for (const auto &test : TESTS_TO_RUN){
        f_0 = test.result(0);
        f_1 = test.result(1);

        integral = trapezoid_quadrature_01(test.input, h);
        printf("Całka numeryczna z z funkcji %s od 0 do 1:\n\tPrawdziwy: %.12f\tObliczony: %.12f\n",
                test.input_name.c_str(), f_1 - f_0, integral);
        assert_printf(
            fabs((f_1 - f_0) - integral) <= tol,
            "Dokładność [%e] nieosiągnięta.\n Poprawny: %.12f\tUzyskany: %.12f\n", tol, f_1 - f_0, integral
            );
    }
}