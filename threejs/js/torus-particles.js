
// var gui;
// ar options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-150, 0, 0],
    axesHeight: 0,
    controls: true,
    displayStats: true,
    skybox: false
});

var torus = true;

// particle dynamics info
var PARTICLE_COUNT = 5000;
var particleSystem;
var loc = [];
var vel = [];
var acc = [];

// particle initialization info
var ELEV = 25;

// gravity info
var gravCenter;
// torus knot parameters
var phi;
var RADIUS = 20.0;
var radius = 2.0;
var r;
var p = 3.0;
var q = 2.0;

var clock;

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

    // add torus knot for visual guide
    if (torus) {
        var geometry = new THREE.TorusKnotGeometry(RADIUS, radius, 256, 8, p, q);
        var material = new THREE.MeshPhongMaterial({
            color: 0xaa0000,
            side: THREE.DoubleSide
        });
        var torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);
    }

    // create center of gravity
    gravCenter = new THREE.Vector3(0, 0, 0);
}

function createParticleSystem(particle_count) {
    // allocate a plain geometry that will hold all of the vertices which are
    // the 'particles'
    var particles = new THREE.Geometry();
    // create the vertices and add them to the particle's geometry
    for (var p = 0; p < particle_count; p++) {
        var z = Math.random() * ELEV - ELEV / 2.0;
        var x = 2.0 * Math.random() * RADIUS - RADIUS;
        var y = 2.0 * Math.random() * RADIUS - RADIUS;

        var particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
        loc.push(particle);
        vel.push(new THREE.Vector3(0, 0, 0));
        acc.push(new THREE.Vector3(0, 0, 0));
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
function animateScene() {

    // update center of gravity
    updateGravity();

    // let particles fall
    animateParticles();

    // Define the function, which is called by the browser supported timer loop.
    // If the browser tab is not visible, the animation is paused. So
    // 'animateScene()' is called in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}

function updateGravity() {
    // gravCenter = new THREE.Vector3(0, 0, 10.0*Math.cos(0.1 * clock.getElapsedTime()));

    phi = 0.1 * clock.getElapsedTime();
    // var cu = Math.cos(phi);
    // var su = Math.sin(phi);
    // var qOverP = q / p * phi;
    r = 2.0 + Math.cos(q * phi);
    gravCenter.x = RADIUS * r * 0.5 * Math.cos(p * phi);
    gravCenter.y = RADIUS * r * 0.5 * Math.sin(p * phi);
    gravCenter.z = 0.5 * RADIUS * Math.sin(q * phi);

    // update camera
    // update heading information - tangent of curve
    var heading = new THREE.Vector3(
        -1.0 * p * RADIUS * r * 0.5 * Math.sin(p * phi),
        p * RADIUS * r * 0.5 * Math.cos(p * phi),
        q * 0.5 * RADIUS * Math.cos(q * phi)
    );
    scene.camera.position.set(gravCenter.x, gravCenter.y, gravCenter.z);
    // this.camera.up.set(this.up.x, this.up.y, this.up.z);
    scene.camera.lookAt(scene.camera.position.clone().add(heading));

}

function animateParticles() {

    // NEW WAY
    // var deltaT = 1.0; //clock.getDelta();
    var verts = particleSystem.geometry.vertices;
    for (var i = 0; i < verts.length; i++) {

        var vert = verts[i];
        var force = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, vert);
        var len = force.length();
        if (len > 0.05) {
            force.normalize().multiplyScalar(0.1 / (Math.pow(len, 1.0)));
        } else {
            force.multiplyScalar(0.0);
        }
        // if (len > 0.05) {
        //     acc[i].addScaledVector(dir, 1.0 / (len * len));
        // }
        acc[i].add(force);
        vel[i].add(acc[i]);
        loc[i].add(vel[i]);
        vert.set(loc[i].x, loc[i].y, loc[i].z);
        acc[i].multiplyScalar(0.0); // clear out acceleration
    }

    // OLD WAY
    // var verts = particleSystem.geometry.vertices;
    // // var zeros = new THREE.Vector3(0, 0, 0);
    // for (var i = 0; i < verts.length; i++) {
    //     var vert = verts[i];
    //     var dir = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, vert);
    //     var len = dir.length();
    //     dir.normalize();
    //     if (len > 0.05) {
    //         vert.addScaledVector(dir, 1.0 / (len * len));
    //     }
    // }

    particleSystem.geometry.verticesNeedUpdate = true;
}