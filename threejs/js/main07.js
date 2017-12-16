// Global scene object
var scene;
// Global camera object
var camera;


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
var texture;
var textureSize = 1024;
var textureFilter = 0;
var filter = [ THREE.NearestFilter,
               THREE.LinearFilter,
               THREE.NearestMipMapNearestFilter,
               THREE.LinearMipMapLinearFilter ];
var filterType = ["Nearest",
                  "Linear",
                  "NearestMipMapNearest",
                  "LinearMipMapLinear"];

// Flag for toggling light
var ambientLight;
var directionalLight;
var intensity = 1;

// Global mesh object of the cube; need to access some of the properties of
// the mesh in our key handlers
var cubeMesh;

var renderer;

// Initialize the scene
initializeScene();
// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the scene.
 */
function initializeScene(){

    // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
    // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
    // antialiasing by default.
    // The approach of multiple renderers is quite nice, because your scene can also be
    // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
    // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
    // difference.
    renderer = new THREE.WebGLRenderer({antialias:true});
    // Set the background color of the renderer to black, with full opacity
    renderer.setClearColor(0x000000, 1);
    // Get the size of the inner window (content area) to create a full size renderer
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    // Set the renderers size to the content areas size
    renderer.setSize(canvasWidth, canvasHeight);
    // Get the DIV element from the HTML document by its ID and append the renderers DOM
    // object to it
    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
    document.getElementById("overlaytext").innerHTML += "WebGL Renderer";

    // Create the scene, in which all objects are stored (e. g. camera, lights,
    // geometries, ...)
    scene = new THREE.Scene();
    // Now that we have a scene, we want to look into it. Therefore we need a camera.
    // Three.js offers three camera types:
    //  - PerspectiveCamera (perspective projection)
    //  - OrthographicCamera (parallel projection)
    //  - CombinedCamera (allows to switch between perspective / parallel projection
    //    during runtime)
    // In this example we create a perspective camera. Parameters for the perspective
    // camera are ...
    // ... field of view (FOV),
    // ... aspect ratio (usually set to the quotient of canvas width to canvas height)
    // ... near and
    // ... far.
    // Near and far define the clipping planes of the view frustum. Three.js provides an
    // example (http://mrdoob.github.com/three.js/examples/
    // -> canvas_camera_orthographic2.html), which allows to play around with these
    // parameters.
    // The camera is moved 10 units towards the z axis to allow looking to the center of
    // the scene.
    // After definition, the camera has to be added to the scene.
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    // add texture-mapped cube
    var cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    // load texture
    var texture = new THREE.ImageUtils.loadTexture("images/img2.png");
    var cubeMaterial = new THREE.MeshLambertMaterial({
        map:texture,
        side:THREE.DoubleSide
    });

    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(0.0, 0.0, 0.0);
    scene.add(cubeMesh);

    ambientLight = new THREE.AmbientLight(0x010101, 1.0);
    directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionalLight.position.set(0, 0, 6).normalize();
    scene.add(directionalLight);

    // Add a listener for 'keydown' events. By this listener, all key events will be
    // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
    // It will report only the visible characters like 'a', but not the function keys
    // like 'cursor up'.
    document.addEventListener("keydown", onDocumentKeyDown, false);

}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // At first, we increase the y rotation of the triangle mesh and decrease the x
    // rotation of the square mesh.

    xRotation += xSpeed;
    yRotation += ySpeed;

    cubeMesh.rotation.set(xRotation, yRotation, 0.0);
    cubeMesh.position.z = zTranslation;

    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    renderScene();
}

/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
function renderScene(){
    renderer.render(scene, camera);
}

/**
 * This function is called, when a key is pushed down.
 */
function onDocumentKeyDown(event) {
    var keyCode = event.which;

    if (keyCode == 70) {            // 'F' - Toggle through the texture filters
        updateFilter();
    }
    else if (keyCode == 76) {       // 'L' - Toggle light
        intensity = intensity > 0 ? 0 : 1;
        directionalLight.intensity = ambientLight.intensity = intensity;
    }
    else if (keyCode == 38) {       // Cursor up
        xSpeed -= 0.005;
    }
    else if (keyCode == 40) {       // Cursor down
        xSpeed += 0.005;
    }
    else if (keyCode == 37) {       // Cursor left
        ySpeed -= 0.005;
    }
    else if (keyCode == 39) {       // Cursor right
        ySpeed += 0.005;
    }
    else if (keyCode == 33) {       // Page up
        zTranslation -= 0.2;
    }
    else if (keyCode == 34) {       // Page down
        zTranslation += 0.2;
    }
    else if (keyCode == 84) {       // 'T' switch textures
        // textureSize = textureSize == 1024 ? 256 : textureSize == 256 ? 64 : 1024;
        // cubeMesh.material.map = new
        // THREE.ImageUtils.loadTexture("StoneWall-"+textureSize+".png");
        //
        // textureFilter = ++textureFilter % 4;
        //
        // updateFilter();
        //
        // cubeMesh.material.needsUpdate = true;
        // document.getElementById("textureSize").innerHTML =
        //     "Texture Size: " + textureSize;
    }

    event.stopPropagation();
}

function updateFilter() {
    textureFilter = ++textureFilter % 4;

    cubeMesh.material.map.minFilter = filter[textureFilter];
    cubeMesh.material.map.magFilter = filter[textureFilter % 2];
    cubeMesh.material.map.needsUpdate = true;

    document.getElementById("minFilterType").innerHTML = filterType[textureFilter];
    document.getElementById("magFilterType").innerHTML = filterType[textureFilter % 2];
}
