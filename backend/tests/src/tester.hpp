#ifndef TESTER_HEADER
#define TESTER_HEADER

#include <cassert>
#include <cstdio>
#include <functional>
#include <vector>
#include <string>
#include <algorithm>

#include <main_definitions.hpp>
#include <expr_handler.hpp>
#include <num.DESolvers.hpp>
#include <num.Integrals.hpp>

#define GLOBAL_TOLERANCE 1e-6

/** @brief Assert z wypisaniem wiadomości na STDERR */
#define assert_printf(expr, fmtStr, ...)    \
    for (; static_cast<bool> (!(expr))      \
         ; __assert_fail(#expr, __FILE__, __LINE__, __ASSERT_FUNCTION))\
        fprintf(stderr, fmtStr, ##__VA_ARGS__)

/**
 * @brief Klasa pojdeynczego testu.
 * 
 * Zawiera nazwy dwóch funkcji oraz nazwę zmiennej jaka występuje w tych
 * funkcjach
 * @param input funkcja wejściowa double -> double, integrowana
 * @param result funkcja wyjściowa double -> double, pierwotna
 * Oraz ich opisy słowne, najczęście używane wraz z makrem @ref MAKE_TEST
 */
class Testing_unit {
    public:
    // Testy są niezmienialne, po utworzeniu
    const std::string input_name, result_name;
    const std::string variable_name;
    

    Testing_unit(
        const std::string &name_i,
        const std::string &name_r,
        const std::string &var_name
    )
      : input_name(name_i),
        result_name(name_r),
        variable_name(var_name)
    {}
};
/**
 * @brief Klasa agregatora testów.
 * 
 */
class Tester {
private:
    std::vector<Testing_unit> tests_to_do;
public:
    // Konstruktor z listy testów
    explicit Tester(std::initializer_list<Testing_unit> list)
      :  tests_to_do(list)
    {}

    // Odwołanie do konkretnego testu
    const Testing_unit &operator[](size_t index){
        return tests_to_do.at(index);
    }

    size_t size() const {
        return tests_to_do.size();
    }

    /**
     * Umożliwiamy użycie pętli for each
     */ 

    std::vector<Testing_unit>::const_iterator begin(){
        return tests_to_do.begin();
    }

    std::vector<Testing_unit>::const_iterator end(){
        return tests_to_do.end();
    }

    /**
     * Templatki pozwalające na wywołanie dowolnej metody na testach
     * lub na poszczególnym teście.
     * 
     * Użycie, przykład: Ewluacja funkcji całkowanych w punkcie.
     *  Tester T = {Testing_unit("2*x", "x^2", "x")};
     *  my_val = 2;
     *  std::vector<double> eval_input_at_my_val =
     *  T.apply_all_tests(
     *      [](const Testing_unit &test, double my_val))
     *      -> double {
     *          return test.input(my_val);
     *      },
     *      my_val
     *  );
     */

    template <typename R, typename... Args>
    std::vector<R> apply_all_tests(std::function<R(const Testing_unit&, Args...)> method, Args... params){
        std::vector<R> results;
        results.reserve(tests_to_do.size());
        
        for (const Testing_unit &test : tests_to_do)
            results.push_back(method(test, params...));
        
        return results;
    }

    template <typename R, typename... Args>
    std::vector<R> apply_all_tests(R(*method)(const Testing_unit&, Args...), Args... params){
        std::vector<R> results;
        results.reserve(tests_to_do.size());
        
        for (const Testing_unit &test : tests_to_do)
            results.push_back(method(test, params...));
        
        return results;
    }


    template <typename R, typename... Args>
    R apply_to_test(size_t index, std::function<R(const Testing_unit&, Args...)> method, Args... params){
        return method(tests_to_do.at(index), params...);
    }

    template <typename R, typename... Args>
    R apply_to_test(size_t index,R(*method)(const Testing_unit&, Args...), Args... params){
        return method(tests_to_do.at(index), params...);
    }
};

/**
 * @brief Makro tworzące obiekt testowy.
 * Wykorzytsujemy możliwość castowania capture-less wyrażeń lambda na 
 * wskaźniki do funkcji lub do obiektu typu std::function<double(double)>
 */
#define MAKE_TEST(input, result, variable) Testing_unit(#input, #result, #variable)


                        /* FUNKCJE TESTOWE */


inline void check_integration_test(double result, double calc){
    if (fabs(result) <= __DBL_EPSILON__ / GLOBAL_TOLERANCE)
        assert(fabs(result - calc) <= GLOBAL_TOLERANCE);
    else
        assert(fabs(result - calc) <= fabs(result) * GLOBAL_TOLERANCE);
}

inline void check_integration_test(real_function resultf, double calc, double a, double b){
    double truth = resultf(b) - resultf(a);
    check_integration_test(truth, calc);
}

inline double soft_check_integration_test(double result, double calc){
    if (!std::isfinite(calc))
        return false;
    if (fabs(result) <= __DBL_EPSILON__ / GLOBAL_TOLERANCE)
        return(fabs(result - calc) <= GLOBAL_TOLERANCE);
    else
        return(fabs(result - calc) <= fabs(result) * GLOBAL_TOLERANCE);
}

inline double soft_integration_test(real_function resultf, double calc, double a, double b){
    double truth = resultf(b) - resultf(a);
    return soft_check_integration_test(truth, calc);
}

inline void print_integration_test(const char * mehtod_name, const std::string &int_name, double a, double b, double true_res, double calc_res){
    fprintf(stderr, "Całka numeryczna z funkcji:\t%s\nna przedziale (%f, %f) metodą %s \n\tPrawdziwy: %.12f\tObliczony: %.12f\n",
            int_name.c_str(),
            a, b,
            mehtod_name,
            true_res, calc_res
        );
}

inline void print_handler_out(real_function handler, size_t steps){
    printf("Handler debug print:\n");
    for (size_t i  = 0 ; i < steps; ++i){
        printf("\tEval at (%lf) := %lf\n",
            (double)i / steps,
            handler((double)i / steps));
    }
}


inline void print_qdrtr_nodes(gauss_quadrature_type type, size_t rank){
    qnodes nodes = get_gqdrtr_qnodes(type, rank);
    printf("  Point\t  Weight\n");
    for (auto &node : nodes){
        printf("%08.08lf\t%08.08lf\n", node.node, node.weight);
    }
}




#endif /* TESTER_HEADER */