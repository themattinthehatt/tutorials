//
// Created by mattw on 8/14/16.
//
// "A cubemap used to texture a 3D cube can be sampled using the positions
// of the cube as the texture coordinates. When a cube is centered at the
// origin each of its position vectors is also a direction vector from the
// origin. This direction vector is exactly what we need to get the
// corresponding texture value at the specific cube's position. For this
// reason we only need to supply position vectors and don't need texture
// coordinates" - learnopengl.com/#!Advanced-OpenGL/Cubemaps

#include <cmath>
#include <GL/glew.h>
#include <GLFW/glfw3.h>

#include "loadShader.h"
#include "loadTextures.h"
#include "Skybox.h"
#include "Camera.h"

Skybox::Skybox(std::vector<const GLchar*> files_, GLfloat multiplier_) {

    // multiplier sets bounds of skybox
    multiplier = multiplier_;

    // load images that will serve as skybox textures
    texture = Skybox::loadCubemap(files_);

    // create and compile shader programs for skybox
    shaderID = loadShader("SkyboxTextureShader.vert",
                          "SkyboxTextureShader.frag");

    // get a handle for our "skyboxSampler" uniform
    textureID = glGetUniformLocation(shaderID, "skyboxSampler");

    // view matrix will keep skybox centered
    viewMatrixID = glGetUniformLocation(shaderID, "viewMatrix");

    // create VAO for skybox to store:
    // - calls to glEnableVertexAttribArray or glDisableVertexAttribArray
    // - vertex attribute configurations via glVertexAttribPointer
    // - VBOs assocatiated with vertex attributes by calls to glVertexAttribPointer
    glGenVertexArrays(1, &vertexArrayID);
    // use a VAO by binding it
    glBindVertexArray(vertexArrayID);
    // from here we bind/config corresponding VBO(s) and attribute pointers

    // COPY SKYBOX VERTEX ARRAY INTO A BUFFER
    // specify model coordinates
    GLfloat g_skybox_vert_buffer_data[3*numVertices];
    // populate g_skybox_vert_buffer_data
    for (int i = 0; i < numVertices; ++i) {
        for (int j = 0; j < 3; ++j) {
            g_skybox_vert_buffer_data[3*i + j] = multiplier *
                     skyboxModelCoordinates[3*i + j];
        }
    }
    // generate 1 buffer, put the resulting identifier in vertexBufferID
    glGenBuffers(1, &vertexBufferID);
    // bind newly created buffer to GL_ARRAY_BUFFER target
    glBindBuffer(GL_ARRAY_BUFFER, vertexBufferID);
    // copy data into buffer's memory
    glBufferData(GL_ARRAY_BUFFER, sizeof(g_skybox_vert_buffer_data),
                 g_skybox_vert_buffer_data, GL_STATIC_DRAW);

    glVertexAttribPointer(
            0,         // attribute 0; must match "layout" in shader
            3,         // size (# vertices)
            GL_FLOAT,  // type
            GL_FALSE,  // normalized?
            0,         // stride
            (GLvoid*)0 // array buffer offset
    );
    // enable vertex attribute 0 (stored in the VAO)
    glEnableVertexAttribArray(0);
    // break buffer binding
    glBindBuffer(GL_ARRAY_BUFFER, 0);

    // unbind the VAO
    glBindVertexArray(0);

}

void Skybox::update(const Camera &cam) {
    // remove translations from view matrix
    viewMatrix = cam.Projection * glm::mat4(glm::mat3(cam.View));
}
void Skybox::draw() {

    // disable depth writing so skybox will be drawn on the background
    glDepthMask(GL_FALSE);

    // use our shader
    glUseProgram(shaderID);

    // send our transformation to the currently bound shader
    glUniformMatrix4fv(viewMatrixID, 1, GL_FALSE, &viewMatrix[0][0]);

    // Activate the texture unit first before binding texture
    glActiveTexture(GL_TEXTURE0);
    // binds texture to the currently active texture unit
    glBindTexture(GL_TEXTURE_CUBE_MAP, texture);
    // puts the texture in texture unit 0
    glUniform1i(textureID, 0);

    // bind vertex array
    glBindVertexArray(vertexArrayID);
    // draw the square!
    glDrawArrays(GL_TRIANGLES, 0, numVertices);
    // break vertex array object binding
    glBindVertexArray(0);

    // re-enable depth writing for rest of scene
    glDepthMask(GL_TRUE);
}

void Skybox::clean() {
    glDeleteProgram(shaderID);
    glDeleteVertexArrays(1, &vertexArrayID);
    glDeleteTextures(1, &textureID);
    glDeleteBuffers(1, &vertexBufferID);

}
Skybox::~Skybox() {

}

GLuint Skybox::loadCubemap(std::vector<const GLchar*> files) {

    // create 1 OpenGL texture
    GLuint textureID;
    glGenTextures(1, &textureID);
    glActiveTexture(GL_TEXTURE0);

    // "Bind" the newly created texture: all future texture functions will
    // modify this texture
    glBindTexture(GL_TEXTURE_CUBE_MAP, textureID);

    int width, height;
    for (GLuint i = 0; i < files.size(); ++i) {
        unsigned char *image = loadBMP(files[i], &width, &height);
        glTexImage2D(
                GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, 0,
                GL_RGB, width, height, 0, GL_BGR, GL_UNSIGNED_BYTE, image
        );
        delete[] image;
    }

    // specify the wrapping and filtering methods for the texture
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_R, GL_CLAMP_TO_EDGE);
    glEnable(GL_TEXTURE_CUBE_MAP_SEAMLESS);
    glBindTexture(GL_TEXTURE_CUBE_MAP, 0);

    // unbind the texture object
    glBindTexture(GL_TEXTURE_CUBE_MAP, 0);

    return textureID;

}

GLfloat Skybox::skyboxModelCoordinates[] = {
        // Positions
        -1.0f,  1.0f, -1.0f,
        -1.0f, -1.0f, -1.0f,
         1.0f, -1.0f, -1.0f,
         1.0f, -1.0f, -1.0f,
         1.0f,  1.0f, -1.0f,
        -1.0f,  1.0f, -1.0f,

        -1.0f, -1.0f,  1.0f,
        -1.0f, -1.0f, -1.0f,
        -1.0f,  1.0f, -1.0f,
        -1.0f,  1.0f, -1.0f,
        -1.0f,  1.0f,  1.0f,
        -1.0f, -1.0f,  1.0f,

         1.0f, -1.0f, -1.0f,
         1.0f, -1.0f,  1.0f,
         1.0f,  1.0f,  1.0f,
         1.0f,  1.0f,  1.0f,
         1.0f,  1.0f, -1.0f,
         1.0f, -1.0f, -1.0f,

        -1.0f, -1.0f,  1.0f,
        -1.0f,  1.0f,  1.0f,
         1.0f,  1.0f,  1.0f,
         1.0f,  1.0f,  1.0f,
         1.0f, -1.0f,  1.0f,
        -1.0f, -1.0f,  1.0f,

        -1.0f,  1.0f, -1.0f,
         1.0f,  1.0f, -1.0f,
         1.0f,  1.0f,  1.0f,
         1.0f,  1.0f,  1.0f,
        -1.0f,  1.0f,  1.0f,
        -1.0f,  1.0f, -1.0f,

        -1.0f, -1.0f, -1.0f,
        -1.0f, -1.0f,  1.0f,
         1.0f, -1.0f, -1.0f,
         1.0f, -1.0f, -1.0f,
        -1.0f, -1.0f,  1.0f,
         1.0f, -1.0f,  1.0f
};