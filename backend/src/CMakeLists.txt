file (GLOB INT_SRC_FILES CMAKE_CONFIGURE_DEPENDS
    "NumInt/*.cpp"
    "NumInt/*.hpp"
    
)
file (GLOB ODE_SRC_FILES CMAKE_CONFIGURE_DEPENDS
    "NumODE/*.cpp"
    "NumODE/*.hpp"
)

file (GLOB HEADER_SRC_FILES CMAKE_CONFIGURATION_DEPENDS
    "Mainheaders/*.hpp"
)
# Ustawiamy globalną zmienną SOURCE_FILES
set (SOURCE_FILES ${INT_SRC_FILES} ${ODE_SRC_FILES} ${HEADER_SRC_FILES} PARENT_SCOPE)
# set (NUM_INT_TRAPEZOID_MODULE_FILES ${INT_SRC_FILES} ${HEADER_SRC_FILES} CACHE FILEPATH "pliki dla modułu pybind11" FORCE)
# set (NUM_ODE_RUNGEKUTTA_MODULE_FILES ${ODE_SRC_FILES} ${HEADER_SRC_FILES} CACHE FILEPATH "pliki dla modułu pybind11" FORCE)

# ExprTK library
add_library(main_header_lib INTERFACE)
target_include_directories(main_header_lib INTERFACE "MainHeaders")

add_library(num_int_lib ${INT_SRC_FILES})
target_include_directories(num_int_lib PUBLIC "NumInt")
target_link_libraries(num_int_lib main_header_lib)

add_library(num_ode_lib ${ODE_SRC_FILES})
target_include_directories(num_ode_lib PUBLIC "NumODE")
target_link_libraries(num_ode_lib main_header_lib)