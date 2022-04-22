cmake_minimum_required(VERSION 3.4)

project(NumInt CXX)
add_subdirectory(pybind11)
pybind11_add_module(NumInt NumInt.cpp exprtk.hpp)