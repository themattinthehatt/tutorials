cmake_minimum_required(VERSION 3.2)
project(playground)

set(CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake")

set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS} -g -std=c++11 -O3")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS} -g -std=c++11")

set(SOURCE_FILES main.cpp loadShader.cpp Camera.cpp loadTextures.cpp
                 loadCubemap.cpp Skybox.cpp)

add_executable(playground ${SOURCE_FILES})

find_package(GLEW REQUIRED)
find_package(OpenGL REQUIRED)
find_package(PkgConfig REQUIRED)

pkg_search_module(GLFW REQUIRED glfw3)

include_directories(
    ${GLEW_INCLUDE_DIRS}
    ${OpenGL_INCLUDE_DIRS}
    ${GLFW_INCLUDE_DIRS}
)

target_link_libraries(playground
    ${GLEW_LIBRARIES}
    ${OpenGL_LIBRARIES}
    ${GLFW_STATIC_LIBRARIES}
)