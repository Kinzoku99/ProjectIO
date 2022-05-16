#include "num.Integrals.hpp"

#include <vector>
#include <stdlib.h>
#include <algorithm>

#define M_SQRT_PIl __f64(1.77245385090551602729816748334114518279L)

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
            qn.at(i).node = diag[i];
            qn.at(i).weight = pow(vects[i*n], 2.0);
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
            qn.at(i).node = diag[i];
            qn.at(i).weight = moment * pow(vects[i*n], 2.0);
        }
    }
    else
        return info;
    return 0;
}


qnodes get_gauss_hermite_qnodes(size_t rank){
    qnodes result;
    result.reserve(rank);
    // H_{n+1}(x) = 2x * H_{n}(x) - 2n * H_{n-1}(x)
    // H_{n+1}(x) = (x - a_n)H_n(x) - b_n*H_{n-1}(x)
    // a_i = 0, b_i = 2i => sqrt(b_i) sqrt(2 * i)
    double *diagonal = (double *)calloc(sizeof(double), 2*rank);
    double *subdiag = diagonal + rank;

    for (size_t i = 1; i < rank; ++i)
        subdiag[i - 1] = M_SQRT2f64 * sqrt(i);
    
    golub_welsch(rank, subdiag, diagonal, result, M_SQRT_PIl);

    return result;
}

qnodes get_gauss_chebyshev_qndoes(size_t rank){
    qnodes result;
    result.reserve(rank);

    for (size_t i = 0; i < rank; ++i){
        result.at(i).node = cos((double)(2*i - 1) / (2*rank) * M_PI);
        result.at(i).weight = (double)M_PI / rank;
    }
    return result;
}


qnodes get_gqdrtr_qnodes(gauss_quadrature_type type, size_t rank){
    switch (type){

    }
}