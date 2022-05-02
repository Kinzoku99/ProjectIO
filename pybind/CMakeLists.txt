cmake_minimum_required(VERSION 3.4)

project(IntegralsLib CXX)
add_subdirectory(pybind11)
pybind11_add_module(numIntTrapezoidQ numInt.TrapezoidQ.cpp exprtk.hpp num.Integrals.hpp conventions.hpp)
pybind11_add_module(numDESolvers num.DESolvers.cpp exprtk.hpp num.DESolvers.hpp conventions.hpp)