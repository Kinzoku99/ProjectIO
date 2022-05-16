file (GLOB INT_SRC_FILES
    "NumInt/*.cpp"
    "NumInt/*.hpp"
    
)
file (GLOB ODE_SRC_FILES
    "NumODE/*.cpp"
    "NumODE/*.hpp"
)

file (GLOB GLOBAL_SRC_FILES
    "Global/*.cpp"
    "Global/*.hpp"
)

file (GLOB HEADER_SRC_FILES
    "Mainheaders/*.hpp"
)

find_package(LAPACK)
if (NOT LAPACK_FOUND)
    message(FATAL_ERROR "Nie odnaleziono pakietu LAPACK.")
endif (NOT LAPACK_FOUND)

# Ustawiamy globalną zmienną SOURCE_FILES
set (SOURCE_FILES
        ${INT_SRC_FILES}
        ${ODE_SRC_FILES}
        ${HEADER_SRC_FILES}
        ${GLOBAL_SRC_FILES}
    PARENT_SCOPE
)

# ExprTK library
add_library(exprtk_header_lib INTERFACE)
target_include_directories(exprtk_header_lib INTERFACE "MainHeaders")

# Global library
add_library(global_lib ${GLOBAL_SRC_FILES})
target_include_directories(global_lib PUBLIC "Global")
target_link_libraries(global_lib exprtk_header_lib)

add_library(num_int_lib ${INT_SRC_FILES})
target_include_directories(num_int_lib PUBLIC "NumInt")
target_link_libraries(num_int_lib exprtk_header_lib global_lib ${LAPACK_LIBRARIES})

add_library(num_ode_lib ${ODE_SRC_FILES})
target_include_directories(num_ode_lib PUBLIC "NumODE")
target_link_libraries(num_ode_lib exprtk_header_lib global_lib)