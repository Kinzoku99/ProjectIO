#ifndef TESTER_HEADER
#define TESTER_HEADER

/**
 * @brief Makro tworzące obiekt testowy.
 */
#define MAKE_TEST(n, input, result)      \
    double test##n(double x) {return input;}     \
    double r_test##n(double x) {return result;}   \

/**
 * @brief Struktura na potrzeby testowania kalkulatorów
 */
typedef struct {
    double (*input_function)(double);
    double (*result_function)(double);
} test_and_result_t;


/**
 * @brief Makro służace do "ładowania" testów do wykonania
 */
#define TESTS_TO_RUN test_and_result_t __tester_struct[]

/**
 * @brief Makro pomagające w czytelności inicjalizacji testów
 */
#define ADD_TEST(x) {test##x, r_test##x}

/**
 * @brief Odwołanie do struktury przechowującej testy
 */
#define TESTS   __tester_struct

/**
 * @brief Odwołanie od @p x -tego testu, względem kolejności ładowania!
 */
#define TEST(x) __tester_struct[x]

#endif /* TESTER_HEADER */