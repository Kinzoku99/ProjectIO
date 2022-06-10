#include "num.Integrals.hpp"

#include <vector>
#include <stdlib.h>
#include <algorithm>

#include <pybind11/pybind11.h>

namespace py = pybind11;


#define GET_WEIGHT_INTEGRAL(w)  \
        trapezoid_quadrature_01(w, 1e10, 1, 1)


/* LAPACK DSTEQR */
extern "C" void dsteqr_(const char *, const int *, double *, double *,
                        double *, const int *, double *, int *);


int golub_welsch(int n, double *subd, double *diag, qnodes &qn){
    if (n < 0)
        return n;
    
    double *vects = (double *)malloc(sizeof(double) * n * n);
    double *work = (double *)malloc(sizeof(double) * std::max(1, 2*n - 1));

    int info = 0;
    dsteqr_("I", &n, diag, subd, vects, &n, work, &info);

    if (info == 0) {
        for (int i = 0; i < n; ++i){
            qn.push_back({
                diag[i],
                pow(vects[i*n], 2.0)
            });
        }
    }
    else
        return info;
    return 0;
}

int golub_welsch(int n, double *subd, double *diag, qnodes &qn, double moment){
    if (n < 0)
        return n;
    
    double *vects = (double *)malloc(sizeof(double) * n * n);
    double *work = (double *)malloc(sizeof(double) * std::max(1, 2*n - 1));

    int info = 0;
    dsteqr_("I", &n, diag, subd, vects, &n, work, &info);

    if (info == 0) {

        for (int i = 0; i < n; ++i){
            qn.push_back(
                {
                    diag[i],
                    moment * pow(vects[i*n], 2.0)
                }
            );
        }
    }
    else
        return info;
    return 0;
}

real_function hermite_weight_function = [](double x){return exp(-pow(x,2));};
qnodes get_gauss_hermite_qnodes(size_t rank){
    qnodes result;
    result.reserve(rank);
    // if (rank == 1){
    //     result   
    // }
    // H_{n+1}(x) = 2x * H_{n}(x) - 2n * H_{n-1}(x)
    // H_{n+1}(x) = (x - a_n)H_n(x) - b_n*H_{n-1}(x)
    // a_i = 0, b_i = 2i => sqrt(b_i) sqrt(2 * i)
    double *diagonal = (double *)calloc(sizeof(double), rank);
    double *subdiag = (double *)malloc(sizeof(double) * (rank - 1));

    for (size_t i = 1; i < rank; ++i)
        subdiag[i - 1] = M_SQRT1_2f64 * sqrt(i);
    
    golub_welsch(rank, subdiag, diagonal, result, M_SQRT_PIl);

    return result;
}

real_function chebyshev_weigth_function = [](double x){return 1.0 / sqrt(1 - pow(x,2));};
qnodes get_gauss_chebyshev_qndoes(size_t rank){
    qnodes result;
    result.reserve(rank);

    for (size_t i = 1; i <= rank; ++i){
        result.push_back(
            {
                cos((double)(2*i - 1) / (2*rank) * M_PI),
                (double)M_PI / rank
            }
        );
    }
    return result;
}


qnodes get_gqdrtr_qnodes(gauss_quadrature_type type, size_t rank){
    switch (type){
        case Chebyshev:
            return get_gauss_chebyshev_qndoes(rank);
            break;
        case Hermite:
            return get_gauss_hermite_qnodes(rank);
            break;
        case Laugerre:
            std::__throw_invalid_argument("Not implemented.");
            break;
    //  case Legrende:
        default:
            std::__throw_invalid_argument("Not implemented.");
            break;
    }
}

const real_function &get_weight(gauss_quadrature_type type){
    switch (type){
        case Hermite:
            return hermite_weight_function;
            break;
        case Chebyshev:
            return chebyshev_weigth_function;
            break;
        default:
            throw std::invalid_argument("Not implemented.");
            break;
    }
}

inline double apply_quadrature(qnodes nodes, real_function f){
    double sum = 0.0;

    for (auto &node : nodes)
        sum += f(node.node) * node.weight;
    
    return sum;
}

inline double apply_quadrature(qnodes nodes, real_function g, real_function w){
    double sum = 0.0;

    for (auto &node : nodes)
        sum += g(node.node) * (node.weight / w(node.node));
    
    return sum;
}

double integrate_gauss(const std::string &fe, const std::string &vn, gauss_quadrature_type t, size_t n){
    expr_t expression;
    double variable;

    initialize_expression(fe, vn, expression, variable);

    qnodes nodes = get_gqdrtr_qnodes(t, n);

    return apply_quadrature(nodes,
                            get_function(expression,
                                         variable
                                        ),
                            get_weight(t)
                           );

}

double integrate_gauss_weight_provided(
    const std::string &fe,
    const std::string &vn,
    gauss_quadrature_type t,
    size_t n
){
    expr_t expression;
    double variable;

    initialize_expression(fe, vn, expression, variable);

    qnodes nodes = get_gqdrtr_qnodes(t, n);
    
    return apply_quadrature(nodes,
                            get_function(expression,
                                         variable
                                        )
                           );

}
double __raw_integrate_gauss(gauss_quadrature_type t, size_t n, real_function func){
    qnodes nodes = get_gqdrtr_qnodes(t, n);

    return apply_quadrature(nodes, func);

}

PYBIND11_MODULE(NumIntGauss, handle) {
     handle.doc() = "";

    py::enum_<gauss_quadrature_type>(handle, "gauss_quadrature_type")
        .value("Hermite", gauss_quadrature_type::Hermite)
        .value("Chebyshev", gauss_quadrature_type::Chebyshev)
        .value("Laugerre", gauss_quadrature_type::Laugerre)
        .value("Legrende", gauss_quadrature_type::Legrende)
        .export_values();

     handle.def("integrate_gauss_weight_provided", &integrate_gauss_weight_provided);
     handle.def("integrate_gauss", &integrate_gauss);
}