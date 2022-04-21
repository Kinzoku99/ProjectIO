#ifndef CONVENTIONS_H
#define CONVENTIONS_H

#include <functional>
/**
 * Zależenie od ustawień kompliacji, używamy wskaźników na funkcję
 * lub objektów std::function.
 * 
 * @attention Testy zostały przygotowane tak, by współpracować z każdą wersją. 
 */
#ifdef USE_FUNC_PTR
#warning "Compilation with function pointers instead of std::function<double(double)>."
typedef double(*real_function)(double);
#else
using real_function = std::function<double(double)>;
#endif

#endif /* CONVENTIONS_H */