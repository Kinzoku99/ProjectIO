cmake_minimum_required(VERSION 3.4)

project(IntegralsLib CXX)

# Wywołujemy CMake w backendzie
add_subdirectory(../backend ../backend EXCLUDE_FROM_ALL)



file (GLOB MAIN_HEADER_FILES
    "../backend/src/MainHeaders/*.hpp"
    "../backend/src/Global/"
)
file (GLOB NUM_INT_TRAPEZOID_MODULE_FILES
    "../backend/src/NumInt/*"
)
file (GLOB NUM_INT_GAUSS_MODULE_FILES
    "../backend/src/NumInt/*"
)
file (GLOB NUM_ODE_RUNGEKUTTA_MODULE_FILES
    "../backend/src/NumODE/*"
)

# message(STATUS "MY FILES")
# message(STATUS ${MAIN_HEADER_FILES})

# ExprTK library
include_directories(exprtk_header_lib INTERFACE "../backend/src/MainHeaders")

# Global library
include_directories(global_lib PUBLIC "../backend/src/Global")

include_directories(num_int_lib PUBLIC "../backend/src/NumInt")

include_directories(num_ode_lib PUBLIC "../backend/src/NumODE")


add_subdirectory(pybind11)
pybind11_add_module(NumIntTrapezoid ${NUM_INT_TRAPEZOID_MODULE_FILES} ${MAIN_HEADER_FILES})
pybind11_add_module(NumIntGauss ${NUM_INT_GAUSS_MODULE_FILES} ${MAIN_HEADER_FILES})
pybind11_add_module(NumODERungeKutta ${NUM_ODE_RUNGEKUTTA_MODULE_FILES} ${MAIN_HEADER_FILES})
