cmake_minimum_required(VERSION 3.4)
project(demo)
add_subdirectory(pybind11)
pybind11_add_module(demo example.cpp)
