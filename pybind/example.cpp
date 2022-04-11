#include <pybind11/pybind11.h>

namespace py = pybind11;

int multiply_example(int a, int b) {
    return a * b;
}

PYBIND11_MODULE(demo, handle) {
    handle.doc() = "Module docs here.";
    handle.def("multiply_from_cpp", &multiply_example);
}