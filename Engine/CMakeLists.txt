cmake_minimum_required(VERSION 3.10)
project(iLGE_Engine C)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Werror -Wall")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Werror -Wall")

find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK3 REQUIRED gtk+-3.0)

find_package(PkgConfig REQUIRED)
pkg_check_modules(WEBKITGTK REQUIRED webkit2gtk-4.1)

find_package(PkgConfig REQUIRED)
pkg_check_modules(GLIB REQUIRED glib-2.0)

include_directories(${GTK3_INCLUDE_DIRS} ${WEBKITGTK_INCLUDE_DIRS} ${GLIB_INCLUDE_DIRS})
link_directories(${GTK3_LIBRARY_DIRS} ${WEBKITGTK_LIBRARY_DIRS} ${GLIB_LIBRARY_DIRS})

if(WIN32)
    set(CMAKE_EXECUTABLE_SUFFIX ".exe")
else()
    set(CMAKE_EXECUTABLE_SUFFIX ".run")
endif()

file(GLOB_RECURSE SOURCES "*.c")

add_executable(iLGE_Engine ${SOURCES})
target_link_libraries(iLGE_Engine ${GTK3_LIBRARIES} ${WEBKITGTK_LIBRARIES})
