#include <tester.hpp>
#include <cstring>

Tester TESTS_TO_RUN {
    Testing_unit("2*x", "x^2", "x"),
    Testing_unit("3*x^2", "x^3", "x"),
    Testing_unit("exp(t)", "exp(t)", "t"),
    Testing_unit("sin(hello)", "-cos(hello)", "hello"),
    Testing_unit("x^3/sqrt(1 - x^2)", "-1/3*sqrt(1 - x^2)(x^2 + 2)", "x"),
    // Testing_unit("sin(x)/x", "0", "x")
};

int main(){
    size_t nod = 1e6;
    double h = 1.0 / nod;
    double tol = 1e-6;

    double a = -1;
    double b = 1;
    
    printf("Liczba podziałów :=\t%zu\nKrok :=\t\t%f\nTolerancja :=\t%f\n", nod, h, tol);
    printf("Test metody trapezów:\n****************************");
    for (auto &test : TESTS_TO_RUN){
        expr_t test_expr;
        double variable;

        initialize_expression(test.result_name, test.variable_name, test_expr, variable);
        real_function res_func = [&](double x){
            variable = x;
            return test_expr.value();
        };

        double calculated = integrate_trapezoid(test.input_name, test.variable_name, a, b, nod);
        double true_result = res_func(b) - res_func(a);
        print_integration_test("trapezów", test.input_name, a, b, true_result, calculated);
        check_integration_test(true_result, calculated);

    }
    printf("Test metody Romberga\n*****************************\n");
    for (auto &test : TESTS_TO_RUN){
        expr_t test_expr;
        double variable;

        initialize_expression(test.result_name, test.variable_name, test_expr, variable);
        real_function res_func = [&](double x){
            variable = x;
            return test_expr.value();
        };

        double calculated = integrate_romberg(test.input_name, test.variable_name, a, b, nod, tol);
        double true_result = res_func(b) - res_func(a);
        print_integration_test("trapezów", test.input_name, a, b, true_result, calculated);
        check_integration_test(true_result, calculated);
    }
    // size_t tid = 0;
    // auto errors = TESTS_TO_RUN.apply_all_tests(
    //     +[](const Testing_unit&test, double h, double t0, double T, size_t rank, size_t *tid)
    //     ->  double {
    //          expr_t test_expr;
    //          double variable;

    //          initialize_expression(test.result_name, test.variable_name, test_expr, variable);
    //          real_function res_func = [&](double x){
    //             variable = x;
    //             return test_expr.value();
    //          };

    //           auto result = des_runge_kutta(
    //               test.input_name, test.variable_name, res_func(t0), h, t0, T, rank
    //           );
            
    //           std::string file_str = __TESTS_OUTPUT_DIRECTORY__ "/rk_out" + std::to_string(*tid) + ".txt";
    //           std::fstream output(file_str, std::ios_base::out);

    //           double error2 = 0;
    //           for (const point &p : result){
    //               error2 += pow(functionDiff(res_func, p), 2);
    //               output << p << "\n";
    //           }
    //           error2 = std::sqrt(error2);

    //           output.close();
    //           ++(*tid);
    //           return error2;
    //         },
    //     1e-6, 1.69, 4.55, (size_t)4, &tid
    // );

    // for (size_t i = 0; i < errors.size(); ++i){
    //     printf("RK_TEST for:\nf(x) = %s,\tF(x) = %s\n[ERROR := %.15lf]\n\n",get_allocator
    //            TESTS_TO_RUN[i].input_name.c_str(),
    //            TESTS_TO_RUN[i].result_name.c_str(),
    //            errors[i]
    //     );

    //     assert_printf(
    //         errors[i] < 1e-3,
    //         "Dokładność [%e] nieosiągnięta! Należy zmniejszyć krok metody lub zwiększyć rząd.", 1e-3
    //         );
    // }
    return 0;
}