
var squareMesh;

// var gui;
// ar options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-20, 0, 0],
    axesHeight: 0,
    controls: true,
    displayStats: true
});
console.log(scene.camera.position);
// global vars
var PARTICLE_COUNT = 500;
var ELEV = 25;
var DELTA_ELEV = 10;
var FLOOR_REPEAT = 5;
var clock;
var particleSystem;
var cannon = null; // texture, paint or wire
var beachBall = null;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){
    clock = new THREE.Clock(true); // control degree of motion in particle sprites

    // create a wire-frame box mesh for visual reference
    var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
    var cubeMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xff0000
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    // add floor
    addFloor();

    // create particle system
    particleSystem = createParticleSystem(PARTICLE_COUNT);
    scene.add(particleSystem);
}

function addFloor() {
    var floorTexture = new THREE.ImageUtils.loadTexture('images/waves-01.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.MirroredRepeatWrapping;
    floorTexture.repeat.set(FLOOR_REPEAT, FLOOR_REPEAT);

    // DoubleSide: render texture on both sides of mesh
    var floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.x = 0.0;
    floor.position.y = 0.0;
    floor.rotation.z = Math.PI / 2;
    scene.add(floor);
}

function createParticleSystem(particle_count) {
    // allocate a plain geometry that will hold all of the vertices which are
    // the 'particles'
    var particles = new THREE.Geometry();
    // create the vertices and add them to the particle's geometry
    var DISTRIBX = 20;
    var DISTRIBY = 20;
    for (var p = 0; p < particle_count; p++) {
        var z = Math.random() * ELEV - DELTA_ELEV;
        var x = Math.random() * DISTRIBX - FLOOR_REPEAT * 2;
        var y = Math.random() * DISTRIBY - FLOOR_REPEAT * 2;

        var particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
    }

    var particleMaterial = new THREE.PointsMaterial({
        color:0xffffff,
        size: 0.4,
        map: THREE.ImageUtils.loadTexture('images/snowflake.png'),
        transparent: true
    });
    particleSystem = new THREE.Points(particles, particleMaterial);
    return particleSystem;
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}
