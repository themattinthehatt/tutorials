#version 330 core

// input vertex data
layout(location = 0) in vec3 vertexPosition_modelspace; // will contain position of vertex
layout(location = 1) in vec2 vertexUV;

// output data
out vec2 UV;

// values that stay constant for the whole mesh
uniform mat4 MVP;

void main() // main function
{
    // sets the vertex position to whatever was in the buffer
    gl_Position = MVP * vec4(vertexPosition_modelspace, 1);

    // the color of each vertex will be interpolated to produce
    // the color of each fragment
    UV = vertexUV;
}