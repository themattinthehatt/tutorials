
// var gui;
// ar options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-20, 0, 0],
    axesHeight: 0,
    controls: true,
    displayStats: true
});

// global vars
var PARTICLE_COUNT = 500;
var ELEV = 25;
var DELTA_ELEV = 10;
var FLOOR_REPEAT = 5;
var DISTRIBX = 20;
var DISTRIBY = 20;
var clock;
var particleSystem;
var gravCenter;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){
    // control degree of motion in particle sprites
    clock = new THREE.Clock(true);

    // create particle system
    particleSystem = createParticleSystem(PARTICLE_COUNT);
    scene.add(particleSystem);

    // create center of gravity
    gravCenter = new THREE.Vector3(0, 0, 0);
}

function createParticleSystem(particle_count) {
    // allocate a plain geometry that will hold all of the vertices which are
    // the 'particles'
    var particles = new THREE.Geometry();
    // create the vertices and add them to the particle's geometry
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

function animateParticles() {
    // var deltaTime = clock.getDelta();
    var verts = particleSystem.geometry.vertices;
    // var zeros = new THREE.Vector3(0, 0, 0);
    for (var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        var dir = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, vert);
        var len = dir.length();
        dir.normalize();
        if (len > 0.05) {
            vert.addScaledVector(dir, 1.0 / (len * len));
        }
    }
    particleSystem.geometry.verticesNeedUpdate = true;
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){

    // update center of gravity
    gravCenter = new THREE.Vector3(0, 0, 10.0*Math.cos(0.02 * clock.getElapsedTime()));

    // let particles fall
    animateParticles();

    // Define the function, which is called by the browser supported timer loop.
    // If the browser tab is not visible, the animation is paused. So
    // 'animateScene()' is called in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}
