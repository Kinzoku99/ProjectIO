#ifndef TESTER_HEADER
#define TESTER_HEADER

#include <cassert>
#include <cstdio>
#include <functional>

#define assert_printf(expr, fmtStr, ...)    \
    for (; static_cast<bool> (!(expr)); __assert_fail(#expr, __FILE__, __LINE__, __ASSERT_FUNCTION))\
        fprintf(stderr, fmtStr, __VA_ARGS__)

/**
 * @brief Makro tworzące obiekt testowy.
 * Wykorzytsujemy możliwość castowania capture-less wyrażeń lambda na 
 * wskaźniki do funkcji
 */
#define MAKE_TEST(input, result)    \
    {[](double x){return (input);}, \
     [](double x){return (result);}}

/**
 * @brief Struktura na potrzeby testowania kalkulatorów
 */
typedef struct {
    double (*input)(double), (*result)(double);
} test_and_result_t;


/**
 * @brief Makro służace do "ładowania" testów do wykonania
 */
#define TESTS_TO_RUN test_and_result_t __tester_struct[]


/**
 * @brief Odwołanie do struktury przechowującej testy
 */
#define TESTS   __tester_struct

/**
 * @brief Odwołanie od @p x -tego testu, względem kolejności ładowania!
 */
#define TEST(x) __tester_struct[x]

/**
 * @brief Makro pomagające w ustaleniu liczby testów
 */
#define TESTS_SIZE sizeof(__tester_struct)/sizeof(test_and_result_t)



#endif /* TESTER_HEADER */