# Plik do CMake

# Dla każdego pliku ".cpp" ".c" ".cxx" w folderze backend/tests/src tworzy
# plik wykonywalny w folderze backend/tests/ o takiej samej nazwie jak
# plik źródłowy (bez rozszerzenia) odpowiednio go kompilując.

cmake_minimum_required(VERSION 3.18)

project(ProjectIO)

# Testowanie przy pomocy make test lub ctest
include(CTest)

# Domyślny tryb wywołania CMake
if (NOT CMAKE_BUILD_TYPE)
    message(STATUS "Nie wybrano trybu kompilacji. Ustawienie domyślne to Release")
    set(CMAKE_BUILD_TYPE "Release")
else (NOT CMAKE_BUILD_TYPE)
    message(STATUS "Wybrano tryb kompilacji: " ${CMAKE_BUILD_TYPE} )
endif (NOT CMAKE_BUILD_TYPE)

# Dodatkowe kolorowane wyjścia
string(ASCII 27 Esc)
set(ColorReset "${Esc}[m")
set(ColorBold  "${Esc}[1m")
set(Red         "${Esc}[31m")
set(Green       "${Esc}[32m")
set(Yellow      "${Esc}[33m")
set(Blue        "${Esc}[34m")
set(Magenta     "${Esc}[35m")
set(Cyan        "${Esc}[36m")
set(White       "${Esc}[37m")
set(BoldRed     "${Esc}[1;31m")
set(BoldGreen   "${Esc}[1;32m")
set(BoldYellow  "${Esc}[1;33m")
set(BoldBlue    "${Esc}[1;34m")
set(BoldMagenta "${Esc}[1;35m")
set(BoldCyan    "${Esc}[1;36m")
set(BoldWhite   "${Esc}[1;37m")



find_package(PythonLibs)

include_directories(${PYTHON_INCLUDE_DIRS} ${PYBIND_INCL_DIR})
link_libraries(${PYTHON_LIBRARIES})

# Czy widzieć polecenie wywoływane przez make
set(CMAKE_VERBOSE_MAKEFILE OFF)

set(DEFAULT_CXX_FLAGS "-O2 -std=c++20 -Wall -Wextra -pedantic")
set(CMAKE_CXX_FLAGS ${DEFAULT_CXX_FLAGS})

set(CMAKE_CXX_FLAGS_DEBUG "-ggdb -Og")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")

find_package(LAPACK)
if (NOT LAPACK_FOUND)
    message(FATAL_ERROR "Nie odnaleziono pakietu LAPACK.")
endif (NOT LAPACK_FOUND)

add_subdirectory(pybind11)

# ExprTK library
add_library(exprtk_header_lib INTERFACE)
target_include_directories(exprtk_header_lib INTERFACE "src/MainHeaders")

# Global library
add_library(global_lib)
target_sources(global_lib PUBLIC "src/Global/expr_handler.cpp" "src/Global/expr_handler.hpp")
target_include_directories(global_lib PUBLIC "src/Global")
target_link_libraries(global_lib exprtk_header_lib)

pybind11_add_module(NumIntGauss)
target_sources(NumIntGauss PRIVATE "src/NumInt/NumInt.Gauss.cpp" "src/NumInt/num.Integrals.hpp")
target_include_directories(NumIntGauss PUBLIC "src/NumInt")
target_link_libraries(NumIntGauss PRIVATE exprtk_header_lib global_lib ${LAPACK_LIBRARIES})

pybind11_add_module(NumIntTrapezoid)
target_sources(NumIntTrapezoid PRIVATE "src/NumInt/NumInt.TrapezoidQ.cpp" "src/NumInt/num.Integrals.hpp")
target_include_directories(NumIntTrapezoid PUBLIC "src/NumInt")
target_link_libraries(NumIntTrapezoid PRIVATE exprtk_header_lib global_lib ${LAPACK_LIBRARIES})

pybind11_add_module(NumODERungeKutta)
target_sources(NumODERungeKutta PRIVATE "src/NumODE/num.DESolvers.cpp" "src/NumODE/num.DESolvers.hpp")
target_include_directories(NumODERungeKutta PUBLIC "src/NumODE")
target_link_libraries(NumODERungeKutta PRIVATE exprtk_header_lib global_lib)
