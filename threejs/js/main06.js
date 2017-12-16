// Global scene object
var scene;
// Global camera object
var camera;
// Global mesh object of the square
var cubeMesh;
// x, y and z rotation
var xRotation = 0.0;
var yRotation = 0.0;
var zRotation = 0.0;

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
    var cubeMaterial = new THREE.MeshBasicMaterial({
        map:texture,
        side:THREE.DoubleSide
    });
    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(0.0, 0.0, 0.0);
    scene.add(cubeMesh);
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // At first, we increase the y rotation of the triangle mesh and decrease the x
    // rotation of the square mesh.

    xRotation += 0.03;
    yRotation += 0.02;
    zRotation += 0.04;

    cubeMesh.rotation.set(xRotation, yRotation, zRotation);

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