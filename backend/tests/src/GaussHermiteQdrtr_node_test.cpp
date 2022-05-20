#include <tester.hpp>
#include <num.Integrals.hpp>
#include <cmath>

#define GLOBAL_TOLERANCE 1e-10

const size_t number_of_nodes[] = {
    1, 5, 10
};

// Hermite weight
double hermite_weight(size_t n, double root){
    return (pow(2.0, n-1) / (double)n) *
            tgamma(n) * M_SQRT_PIl /
            pow(std::hermite(n-1, root), 2);
}


// H_1(x) = 2x
const double hermite_roots_order1[] = {
    0.0
};

// H_5(x) = 32x^5 -160x^3 + 120x
const double hermite_roots_order5[] = {
    -2.02018287045609,
    -0.9585724646138185071127706,
    0,
    0.9585724646138185071127706,
    2.02018287045609
};

const double hermite_roots_order10[] = {
    -3.4361591188377376033,
    -2.5327316742327897964,
    -1.75668364929988177345,
    -1.03661082978951365418,
    -0.34290132722370460879,
    0.34290132722370460879,
    1.03661082978951365418,
    1.75668364929988177345,
    2.5327316742327897964,
    3.4361591188377376033,
};

qnodes get_hardcoded_nodes(const double roots[], size_t rank){
    qnodes result;
    result.reserve(rank);

    for (size_t i = 0; i < rank; ++i){
        weighted_node_t tmp;
        tmp.node = roots[i];
        tmp.weight = hermite_weight(rank, roots[i]);
        result.push_back(tmp);
    }
    return result;
}

void printf_nodes(const qnodes &comp, const qnodes &truth){
    assert(comp.size() == truth.size());
    printf("\n***********************\n");
    for (size_t i = 0; i < comp.size(); ++i){
        printf("T: (%.12lf, %.12lf)\tC:(%.12lf,%.12lf)\n",
                truth[i].node, truth[i].weight ,comp[i].node, comp[i].weight);
    }
    for (size_t i =0; i < comp.size(); ++i){
        assert(fabs(truth[i].node - comp[i].node) <= GLOBAL_TOLERANCE);
        assert(fabs(truth[i].weight - comp[i].weight) <= GLOBAL_TOLERANCE);
    }
    printf("***********************\n");
}

int main(){
    double tol = 1e-8;
    qnodes nodes = get_gqdrtr_qnodes(Hermite, 1);

    assert(fabs(nodes.at(0).node - hermite_roots_order1[0]) <= tol);
    assert(fabs(nodes.at(0).weight - hermite_weight(1, nodes.at(0).node)) <= tol);
    qnodes comp = nodes;
    qnodes truth;
    truth.push_back({0, hermite_weight(1, 0)});

    printf_nodes(comp, truth);
    
    comp = get_gqdrtr_qnodes(Hermite, 5);
    truth = get_hardcoded_nodes(hermite_roots_order5, 5);

    printf_nodes(comp, truth);

    comp = get_gqdrtr_qnodes(Hermite, 10);
    truth = get_hardcoded_nodes(hermite_roots_order10, 10);

    printf_nodes(comp, truth);

    return 0;
}