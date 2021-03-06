// x and y rotation
var xRotation = 0.0;
var yRotation = 0.0;
// Rotation speed around x and y axis
var xSpeed = 0.0;
var ySpeed = 0.0;
// Translation along the z axis
var zTranslation = 0.0;
// The x and y speed is controlled by the cursor keys.
// The translation on the z axis by 'Page up / down'.
// 'crateTexture' is the texture object. We set it global, to modify it's attributes
// later on.

// 'textureFilter' will have three states (0, 1 or 2), controlling the current texture
// filtering (nearest, linear or mipmapped).
// The next two objects hold two different kinds of light: Ambient and directional light.
// 'enableLights' is the flag, which is switched by the key 'f'.
// Texture and flag for current texture filter
var filter = [ THREE.NearestFilter,
    THREE.LinearFilter,
    THREE.NearestMipMapNearestFilter,
    THREE.LinearMipMapLinearFilter ];
var filterType = ["Nearest",
    "Linear",
    "NearestMipMapNearest",
    "LinearMipMapLinear"];

// Global mesh object of the cube; need to access some of the properties of
// the mesh in our key handlers
var cubeMesh;

var gui;
var options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({cameraPos:[0, 0, 6]});

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

    // add texture-mapped cube
    var cubeGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);

    // load texture
    var texture = new THREE.ImageUtils.loadTexture("images/img2.png");
    var cubeMaterial = new THREE.MeshLambertMaterial({
        map: texture,               // texture to use
        side: THREE.DoubleSide,     // no back face culling
        depthWrite: true,          //
        transparent: true,          // needed even if opacity < 1
        opacity: 0.9,
        combine: THREE.MixOperation // mix foreground and background
    });

    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(0.0, 0.0, 0.0);
    scene.add(cubeMesh);

    // Add a listener for 'keydown' events. By this listener, all key events will be
    // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
    // It will report only the visible characters like 'a', but not the function keys
    // like 'cursor up'.
    document.addEventListener('keydown', onDocumentKeyDown, false);

}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // At first, we increase the y rotation of the triangle mesh and decrease the x
    // rotation of the square mesh.

    if (options.rotating) {
        xRotation += xSpeed;
        yRotation += ySpeed;
    }

    cubeMesh.rotation.set(xRotation, yRotation, 0.0);
    cubeMesh.position.z = zTranslation;

    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}

/**
 * This function is called, when a key is pushed down.
 */
function onDocumentKeyDown(event) {
    var key = event.key;
    key = key.toLowerCase();

    if (key === 'f') {            // 'F' - Toggle through the texture filters
        updateFilter();
    } else if (key === 'l') {       // 'L' - Toggle light
        intensity = intensity > 0 ? 0 : 1;
        //directionalLight.intensity = ambientLight.intensity = intensity;
        directionalLight.intensity = intensity;
    } else if (key === 'arrowup') {       // Cursor up
        xSpeed -= 0.005;
    } else if (key === 'arrowdown') {       // Cursor down
        xSpeed += 0.005;
    } else if (key === 'arrowleft') {       // Cursor left
        ySpeed -= 0.005;
    } else if (key === 'arrowright') {       // Cursor right
        ySpeed += 0.005;
    } else if (key === 'w') {
        zTranslation -= 0.2;
    } else if (key === 's') {       // Page down
        zTranslation += 0.2;
    }

    event.stopPropagation();
}

function updateFilter() {
    cubeMesh.material.map.minFilter = filter[options.nFilter];
    cubeMesh.material.map.magFilter = filter[options.nFilter % 2];
    cubeMesh.material.map.needsUpdate = true;
}

function setupDataGUI() {

    var options = [];
    options.rotating = false;
    options.nFilter = 0;
    options.textureFilter = filterType[options.nFilter];

    gui = new dat.GUI();

    gui.add(options, 'rotating').onChange(function() {
        //
        // if (options.rotating === false) {
        //     // xRotation = 0;
        //     // yRotation = 0;
        //     xSpeed = 0;
        //     ySpeed = 0;
        // }
    });

    gui.add(options, "textureFilter",
            [filterType[0], filterType[1], filterType[2], filterType[3]]).onChange(function() {

        options.nFilter = filterType.indexOf(options.textureFilter);
        updateFilter();
    });

    return options
}