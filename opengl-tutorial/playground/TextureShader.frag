#version 330 core

// interpolated values from the vertex shaders
//in vec3 fragmentColor;
in vec2 UV;

// output data
out vec3 color;

// values that stay constant for the whole mesh
uniform sampler2D myTextureSampler;

void main() {
    // output color = color of the texture at the specified UV
    color = texture(myTextureSampler, UV).rgb;
}