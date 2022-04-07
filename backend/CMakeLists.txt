# Plik do CMake

# Dla każdego pliku ".cpp" ".c" ".cxx" w folderze backend/tests/src tworzy
# plik wykonywalny w folderze backend/tests/ o takiej samej nazwie jak
# plik źródłowy (bez rozszerzenia) odpowiednio go kompilując.

cmake_minimum_required(VERSION 3.23)
project(ProjectIO)

# Domyślny tryb wywołania CMake
if (NOT CMAKE_BUILD_TYPE)
    message(STATUS "Nie wybrano typu kompilacji, ustawienie domyślne to Release")
    set(CMAKE_BUILD_TYPE "Release")
endif (NOT CMAKE_BUILD_TYPE)

# Czy widzieć polecenie wywoływane przez make
set(CMAKE_VERBOSE_MAKEFILE OFF)

set(DEFAULT_CXX_FLAGS "-O2 -std=c++20 -Wall -Wextra -pedantic")
set(CMAKE_CXX_FLAGS ${DEFAULT_CXX_FLAGS})

set(CMAKE_CXX_FLAGS_DEBUG "-ggdb -Og")
set(CMAKE_CXX_FLAGS_RELEASE "-O3")


set(CMAKE_RUNTIME_OUTPUT_DIRECTORY tests)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY tests/libraries)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY tests/libraries)

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
    add_executable(${testname} ${testsourcefile})
    message(STATUS "Tworzenie pliku wykonywalnego: " ${testname})
    target_link_libraries(${testname} testing_lib)
endforeach(testsourcefile ${TEST_FILES})

# Szuakmy Doxygena i tworzymy make doc, do stworzenia dokumentacji
find_package(Doxygen)
if (DOXYGEN_FOUND)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/Doxyfile.in ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile @ONLY)

    add_custom_target(doc
        ${DOXYGEN_EXECUTABLE} ${CMAKE_CURRENT_BINARY_DIR}/Doxyfile
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
        COMMENT "Tworzenie dokumentacji przy pomocy programu Doxygen"
        )
endif()