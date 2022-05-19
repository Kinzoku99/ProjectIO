
# Dodajemy pliki testowe
file (GLOB TEST_SOURCE_FILES CMAKE_CONFIGURE_DEPENDS
    "src/*.cpp"
)

file (GLOB TEST_HEADER_FILES CMAKE_CONFIGURE_DEPENDS
    "src/tester.hpp"
)


# Tworzymy bibliotekę testową, która udostępnia podstawowy interfejs do testów
add_library(testing_lib INTERFACE)
target_include_directories(testing_lib INTERFACE "src")
target_link_libraries(testing_lib INTERFACE num_int_lib num_ode_lib)

# Tworzymy test z każdego pliku źródłowego w tests/src
foreach(testsourcefile ${TEST_SOURCE_FILES})
    string(REGEX REPLACE ".*/" "" testname1 ${testsourcefile})
    string(REPLACE ".cpp" "" testname ${testname1})

    message(STATUS "Tworzenie testu: " ${testname})
    add_executable(${testname} ${testsourcefile})
    target_link_libraries(${testname} testing_lib)

    add_test(NAME ${testname} COMMAND ${testname})    
endforeach(testsourcefile ${TEST_FILES})