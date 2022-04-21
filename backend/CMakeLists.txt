# Plik do CMake

# Dla każdego pliku ".cpp" ".c" ".cxx" w folderze backend/tests/src tworzy
# plik wykonywalny w folderze backend/tests/ o takiej samej nazwie jak
# plik źródłowy (bez rozszerzenia) odpowiednio go kompilując.

cmake_minimum_required(VERSION 3.23)
project(ProjectIO)

# Testowanie przy pomocy make test lub ctest
include(CTest)

# Domyślny tryb wywołania CMake
if (NOT CMAKE_BUILD_TYPE)
    message(STATUS "Nie wybrano typu kompilacji, ustawienie domyślne to Release")
    set(CMAKE_BUILD_TYPE "Release")
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

# Informacja o użyciu std::function vs wskaźnik na funkcję
if (NOT USE_FUNC_PTR)
    message("\n\tKompilowanie z użyciem${Green} std::function${ColorReset}"
            "\n\tzamiast ${Red}wskaźników na funkcje${ColorReset}.\n\n"
            "\tW celu zmiany, należy wywołać CMake z poleceniem ${Red}-DUSE_FUNC_PTR=1${ColorReset}\n")
else (NOT USE_FUNC_PTR)
    add_compile_definitions(USE_FUNC_PTR=1)
    message("\n\tKompilowanie z użyciem${Green} wskaźników na funkcje${ColorReset}"
            "\n\tzamiast ${Red}std::function${ColorReset}.\n\n"
            "\tW celu zmiany, należy wywołać CMake z poleceniem ${Red}-DUSE_FUNC_PTR=0${ColorReset}\n")
endif (NOT USE_FUNC_PTR)

# Czy widzieć polecenie wywoływane przez make
set(CMAKE_VERBOSE_MAKEFILE OFF)

set(DEFAULT_CXX_FLAGS "-O2 -std=c++20 -Wall -Wextra -pedantic")
set(CMAKE_CXX_FLAGS ${DEFAULT_CXX_FLAGS})

set(CMAKE_CXX_FLAGS_DEBUG "-ggdb -Og")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")


set(CMAKE_RUNTIME_OUTPUT_DIRECTORY tests)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY tests/libraries)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY tests/libraries)
set(CMAKE_TESTS_OUTPUT_DIRECTORY tests/outputs)
add_custom_target(clean_outputs ALL rm -f ${CMAKE_TESTS_OUTPUT_DIRECTORY}/*
                  COMMENT "Usuwanie danych wyjściowych testów")

file (GLOB SOURCE_FILES CONFIGURE_DEPENDS
    "src/*.hpp"
    "src/*.cpp"
)
    
file (GLOB TESTER_HEADER CONFIGURE_DEPENDS
    "tests/src/tester.hpp"
)
    
file(GLOB TEST_FILES CONFIGURE_DEPENDS
    "tests/src/*.cpp"
)
    
add_library(testing_lib ${SOURCE_FILES} ${TESTER_HEADER})


foreach(testsourcefile ${TEST_FILES})
    string(REGEX REPLACE ".*/" "" testname1 ${testsourcefile})
    string(REPLACE ".cpp" "" testname ${testname1})

    message(STATUS "Tworzenie testu: " ${testname})
    add_executable(${testname} ${testsourcefile})
    target_link_libraries(${testname} testing_lib)
    add_test(NAME ${testname} COMMAND ${testname})    
endforeach(testsourcefile ${TEST_FILES})

# TODO Doxygen
# # Szuakmy Doxygena i tworzymy make doc, do stworzenia dokumentacji
# find_package(Doxygen)
# if (DOXYGEN_FOUND)
#     configure_file(${CMAKE_CURRENT_SOURCE_DIR}/Doxyfile.in ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile @ONLY)

#     add_custom_target(doc
#         ${DOXYGEN_EXECUTABLE} ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile
#         WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
#         COMMENT "Tworzenie dokumentacji przy pomocy programu Doxygen"
#         )
# endif()