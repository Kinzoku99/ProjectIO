cmake_minimum_required(VERSION 3.4)

project(IntegralsLib CXX)

# Wywołujemy CMake w backendzie
add_subdirectory(../backend ../backend EXCLUDE_FROM_ALL)



file (GLOB MAIN_HEADER_FILES
    "../backend/src/MainHeaders/*.hpp"
)
file (GLOB NUM_INT_TRAPEZOID_MODULE_FILES
    "../backend/src/NumInt/*"
)

file (GLOB NUM_ODE_RUNGEKUTTA_MODULE_FILES
    "../backend/src/NumODE/*"
)

message(STATUS "MY FILES")
message(STATUS ${MAIN_HEADER_FILES})

add_subdirectory(pybind11)

pybind11_add_module(NumIntTrapezoid ${NUM_INT_TRAPEZOID_MODULE_FILES} ${MAIN_HEADER_FILES})
pybind11_add_module(NumODERungeKutta ${NUM_ODE_RUNGEKUTTA_MODULE_FILES} ${MAIN_HEADER_FILES})
