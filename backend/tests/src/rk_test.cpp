#include "../../src/num.DESolvers.hpp"
#include <cstdlib>
#include <cinttypes>
#include <cstdio>
#include <cstdint>
#include <cmath>
#include <atomic>

#include "tester.hpp"

Tester TESTS_TO_RUN
{
    //        INPUT         RESULT
    MAKE_TEST(2*x,          pow(x,2)),
    MAKE_TEST(3*pow(x,2),   pow(x,3)),
    MAKE_TEST(exp(x),       exp(x)),
    MAKE_TEST(1/(2*sqrt(x)),sqrt(x)),
};

int main(){
    double int_start = 0.01;
    double int_end = 10;
    double step = 1e-6;
    size_t test_num = 0;
    size_t rank = 4;

    auto results = TESTS_TO_RUN.apply_all_tests(
        +[](const Testing_unit&test, double h, double t0, double T, size_t rank, size_t *tid)
        ->  double {
              auto result = des_runge_kutta(test.input, test.result(t0), h, t0, T, rank);

              std::string file = "tests/outputs/rk_test_" + std::to_string(*tid) + ".txt";
              FILE *output = fopen(file.c_str(), "w+");

              double error2 = 0;
              for (const point_t &p : result){
                  error2 += pow((test.result(p.x) - p.y),2);
                  fprintf(output, "%.15lf %.15lf\n", p.x, p.y);
              }
              error2 = std::sqrt(error2);

              fclose(output);
              ++(*tid);
              return error2;
            },
        step, int_start, int_end, rank, &test_num
    );

    for (size_t i = 0; i < results.size(); ++i){
        printf("RK_TEST for:\nf(x) = %s,\tF(x) = %s\n[ERROR := %.15lf]\n\n",
               TESTS_TO_RUN[i].input_name.c_str(),
               TESTS_TO_RUN[i].result_name.c_str(),
               results[i]
        );

        assert_printf(
            results[i] < 1e-3,
            "Dokładność [%e] nieosiągnięta! Należy zmniejszyć krok metody lub zwiększyć rząd.", 1e-3
            );
    }
}