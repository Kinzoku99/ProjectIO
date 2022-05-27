
# Dodajemy pliki testowe
file (GLOB_RECURSE TEST_SOURCE_FILES
    "src/*.cpp"
)

file (GLOB_RECURSE TEST_HEADER_FILES
    "src/tester.hpp"
)


# Tworzymy bibliotekę testową, która udostępnia podstawowy interfejs do testów
add_library(testing_lib INTERFACE)
target_include_directories(testing_lib INTERFACE "src")
target_link_libraries(testing_lib INTERFACE num_int_lib num_ode_lib)

# Tworzymy test z każdego pliku źródłowego w tests/src
list(LENGTH TEST_SOURCE_FILES number_of_tests)
message(STATUS "Przeglądanie plików źródłowych testów (" ${number_of_tests} ")")
foreach(testsourcefile ${TEST_SOURCE_FILES})
    string(REGEX REPLACE ".*/" "" testname1 ${testsourcefile})
    string(REPLACE ".cpp" "" testname ${testname1})

    message(VERBOSE "\tTworzenie testu: " ${testname})
    add_executable(${testname} ${testsourcefile})
    target_link_libraries(${testname} testing_lib)

    add_test(NAME ${testname} COMMAND ${testname})    
endforeach(testsourcefile ${TEST_FILES})