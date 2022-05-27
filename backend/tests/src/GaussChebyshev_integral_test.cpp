#include <tester.hpp>
#include <num.Integrals.hpp>

Tester GAUSS_CHEBYSHEV_READY {
    Testing_unit("x^3/sqrt(1 - x^2)", "-1/3*sqrt(1 - x^2)(x^2 + 2)", "x"),
};

Tester GAUSS_CHEBYSHEV_TESTS {
    Testing_unit("sin(x) / sqrt(1-x^2)", "non elementary", "x"),
    Testing_unit("3x^2", "x^3", "x"),
    Testing_unit("1/(x+5)", "ln(x + 5)", "x"),
    Testing_unit("3x^2 + 4x + 1", "x^3 + 2x^2 + x", "x")
};

int main(){
    double a = -1, b = 1;
    for (auto &test : GAUSS_CHEBYSHEV_READY){
        expr_t expr;
        double var;

        initialize_expression(test.input_name, test.variable_name, expr, var);
        real_function accesor = get_function(expr, var);

        double calculated = __raw_integrate_gauss(Chebyshev, 2, accesor);
        expr_t test_expr;
        double test_var;
        initialize_expression(test.result_name, test.variable_name, test_expr, test_var);

        real_function test_func = [&](double x){
                test_var = x;
                return test_expr.value();
            };
        print_integration_test("Gaussa-Chebysheva", test.input_name, -1 + __FLT_EPSILON__, 1 - __FLT_EPSILON__, test_func(1) - test_func(-1), calculated);
        
        check_integration_test(test_func, calculated, -1 + __FLT_EPSILON__, 1 - __FLT_EPSILON__);
    }

    for (auto &test : GAUSS_CHEBYSHEV_TESTS){
        double calculated = integrate_gauss(test.input_name, test.variable_name, Chebyshev, 1e6);

        if (test.result_name != "non elementary"){
            expr_t test_expr;
            double test_var;

            initialize_expression(test.result_name, test.variable_name, test_expr, test_var);
            real_function test_func = [&](double x){
                test_var = x;
                return test_expr.value();
            };
            print_integration_test("Gaussa-Chebysheva", test.input_name, -1, 1, test_func(1) - test_func(-1), calculated);
            check_integration_test(test_func, calculated, -1, 1);
        }
        else {
            print_integration_test("Gaussa-Chebysheva", test.input_name, -1, 1, 0, calculated);
        }

    }
}