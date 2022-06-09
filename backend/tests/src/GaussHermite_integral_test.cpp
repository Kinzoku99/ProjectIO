#include <tester.hpp>
#include <num.Integrals.hpp>

// Najpierw dzielimy przez funkcję wagową (tutaj /exp(-x^2))
// potem licząc kwadraturę dzielimy przez tą funkcję
Tester GAUSS_HERMITE_TESTS {
    Testing_unit("exp(-f^2)", "non_elementary", "f"),
    Testing_unit("exp(-y^4)", "non elementary", "y"),

};

Tester GAUSS_HERMITE_READY {
    Testing_unit("sin(f)", "non_elementary", "f"),
    Testing_unit("cos(f)", "non_elementary", "f"),
    Testing_unit("exp(-y^2)", "non elementary", "y"),
    // Testing_unit("exp(-|x|)", "non elementary", "x") bardzo wolna zbieżność
};

const double minf_inf_integrals[] = {
    M_SQRT_PIl,
    1.8128049541109541559653425779338360014L,
    2,
    0.0,
    1.3803884470431429747734152467255912743L,
    1.2533141373155002512078826424055226265L
};

// To są wyniki całek z funkcji w testach GAUSS_HERMITE_READY
// całek uwzględnioną wagą. (Unikamy mnożenia i dzielenia przez wagę)
const double minf_inf_ready[] = {
    0.0,
    1.3803884470431429747734152467255912743L,
    1.2533141373155002512078826424055226265L,
    1.0912827215300940841987756547544238962L
};

#define MAX_QDRTR_RANK pow(2, 12)
#define INITIAL_QDRTR_RANK 2
#define WARNING_THRESHOLD pow(2, 9)

double hermite_weight(size_t n, double root){
    return (pow(2.0, n-1) / (double)n) *
            tgamma(n) * M_SQRT_PIl /
            pow(std::hermite(n-1, root), 2);
}


int main(){
    for (size_t i = 0; i < GAUSS_HERMITE_TESTS.size(); ++i){
        bool test_passed = false;
        size_t rank = INITIAL_QDRTR_RANK;
        auto &test = GAUSS_HERMITE_TESTS[i];
        for ( ; !test_passed && rank <= MAX_QDRTR_RANK; rank *= 2){
            debugf("%s", rank >= WARNING_THRESHOLD ? "SUSPICIOUSLY HIGH QUADRATURE RANK\n" : "");
            double calculated = integrate_gauss(test.input_name,
                                                test.variable_name,
                                                Hermite,
                                                rank);
                                                
            test_passed = soft_check_integration_test(minf_inf_integrals[i], calculated);
            if (test_passed)
                print_integration_test("Gaussa-Hermite'a", test.input_name,
                                    -INFINITY, INFINITY, minf_inf_integrals[i],
                                    calculated);
        }
        assert(test_passed);
        printf("Rank used := %zu\n", rank);
    }
    for (size_t i = 0; i < GAUSS_HERMITE_READY.size(); ++i){
        bool test_passed = false;
        size_t rank = INITIAL_QDRTR_RANK;
        auto &test = GAUSS_HERMITE_READY[i];
        for (; !test_passed && rank <= MAX_QDRTR_RANK; rank *= 2) {   

            debugf("%s", rank >= WARNING_THRESHOLD ? "SUSPICIOUSLY HIGH QUADRATURE RANK\n" : "");
            double calculated = integrate_gauss_weight_provided(test.input_name,
                                                test.variable_name,
                                                Hermite,
                                                rank);
            test_passed = soft_check_integration_test(minf_inf_ready[i], calculated);
                print_integration_test("Gaussa-Hermite'a", test.input_name + "(wyważona)",
                                    -INFINITY, INFINITY, minf_inf_ready[i],
                                    calculated);
        }
        assert(test_passed);
        printf("Rank used := %zu\n", rank);
    }
}