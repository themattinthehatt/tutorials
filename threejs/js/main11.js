
var squareMesh;

// var gui;
// ar options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-20, 0, 0],
    axesHeight: 5,
    controls: true,
    displayStats: true
});

var directionalLight = scene.directionalLights[0];
var ambientLight = scene.ambientLights[0];
var intensity = 1;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){

    // load texture
    // var texture = new THREE.ImageUtils.loadTexture("images/waves-01.jpg");
    var texture = new THREE.ImageUtils.loadTexture("images/sierra_in_snow.jpg");

    var squareGeometry = new THREE.ParametricGeometry(sineWave, 45, 45);
    var squareMaterial = new THREE.MeshLambertMaterial({
        map: texture,               // texture to use
        side: THREE.DoubleSide,     // no back face culling
    });
    squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    // squareMesh.position.set(0.0, 0.0, 0.0);
    scene.add(squareMesh);


    // Add a listener for 'keydown' events. By this listener, all key events will be
    // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
    // It will report only the visible characters like 'a', but not the function keys
    // like 'cursor up'.
    // document.addEventListener('keydown', onDocumentKeyDown, false);

}

/**
 * Simple callback for each vertex
 */
function sineWave(u, v) {
    var x = u * 9 - 4.5;
    var y = v * 9 - 4.5;
    var z = Math.sin(u * Math.PI * 2.0);
    return new THREE.Vector3(x, y, z);
}
function wiggleTheSurface() {
    vertices = squareMesh.geometry.vertices;
    var temp = vertices[0].z;
    for (var i = 1; i < vertices.length; i++) {
        vertices[i-1].z = vertices[i].z;
    }
    vertices[vertices.length-1].z = temp;
    squareMesh.geometry.verticesNeedUpdate = true;
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){


    wiggleTheSurface();

    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}
