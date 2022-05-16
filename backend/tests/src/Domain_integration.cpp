#include <tester.hpp>
#include <cstring>


Tester ONE_TO_INF_TESTS {
    Testing_unit("1/x^2", "-1/x", "x"),
    Testing_unit("1/(x^3)", "-1/x", "x"),
    Testing_unit("e^(-x)", "-e^(-x)", "x"),
};

Tester MINF_TO_ZERO_TESTS {
    Testing_unit("exp(q)", "exp(q)", "q"),
    Testing_unit("exp(-a^2)", "non_elementary", "a"),
};

Tester MINF_TO_INF_TESTS {

};

const double one_inf_integrals[] = {
    1.0,        /*  1/(x^2)  */
    0.5,        /*  1/(x^3)  */
    1.0/exp(1), /*  exp(-x)  */
};

const double minf_zero_integrals[] = {
    1.0,            /* exp(-q)   */
    sqrt(M_PI)/2.0, /* exp(-a^2) */
};

void check_trap_romb(size_t nod, double tol,
                     const double *truths, Tester &tests,
                     double a, double b){
    for (size_t i = 0; i < tests.size(); ++i){
        auto &test = tests[i];
        printf("\n\tTEST[%zu]: %s -- %s (%s).\n\n", i,
                test.input_name.c_str(),
                test.result_name.c_str(),
                test.variable_name.c_str()
        );
        
        double calc = integrate_trapezoid(test.input_name, test.variable_name, a, b, nod);

        print_integration_test("trapezów", test.input_name, a, b, truths[i], calc);

        assert_printf(
            fabs(calc - truths[i]) <= tol,
            "Dokładność [%e] nieosiągnięta.\nPoprawny: %.12f\tUzyskany: %.12f\n",
            tol, truths[i], calc
        );

        calc = integrate_romberg(test.input_name, test.variable_name,
                                 a, b, nod, tol);
        
        print_integration_test("romberga", test.input_name, a, b, truths[i], calc);

        assert_printf(
            fabs(calc - truths[i]) <= tol,
            "Dokładność [%e] nieosiągnięta.\nPoprawny: %.12f\tUzyskany: %.12f\n",
            tol, truths[i], calc
        );
    }
}

int main(){
    size_t nod = 1e6;
    double h = 1.0 / nod;
    double tol = 1e-5;

    double a = -4;
    double b = 7;
    
    check_trap_romb(nod, tol, one_inf_integrals, ONE_TO_INF_TESTS, 1.0, INFINITY);
    check_trap_romb(nod, tol, minf_zero_integrals, MINF_TO_ZERO_TESTS, -INFINITY, 0.0);


    

}