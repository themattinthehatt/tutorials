/**
 * http://htmlpreview.github.com/?https://github.com/themattinthehatt/tutorials/blob/master/index.html
 * TODO
 * Good parameter settings (5000 particles):
 * p = 3; q = 2; mass = 0.1; exponent = 0.2; speed = 0.92
 */

var SHOW_TORUS = true;
var P_INIT = 3.0;
var Q_INIT = 2.0;
var gui;
var options = setupDatGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-150, 0, 0],
    axesHeight: 0,
    controls: true,
    displayStats: true,
    skybox: false
});

// particle dynamics info
var PARTICLE_COUNT = 5000;
var particleSystem;
var loc = [];
var vel = [];
var acc = [];
var color = [];

// particle initialization info
var ELEV = 25;

// gravity info
var gravCenter;
// torus knot parameters
var phi;
var RADIUS = 20.0;
var radius = 2.0;
var r;

var torusKnot;

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
    particleSystem = createParticleSystem();
    scene.add(particleSystem);

    // add torus knot for visual guide
    if (options.torus) {
        addTorusKnot();
    }

    // create center of gravity
    gravCenter = new THREE.Vector3(0, 0, 0);
}

function createParticleSystem() {
    // allocate a plain geometry that will hold all of the vertices which are
    // the 'particles'
    var particles = new THREE.Geometry();
    // create the vertices and add them to the particle's geometry
    for (var i = 0; i < PARTICLE_COUNT; i++) {
        var z = Math.random() * ELEV - ELEV / 2.0;
        var x = 2.0 * Math.random() * RADIUS - RADIUS;
        var y = 2.0 * Math.random() * RADIUS - RADIUS;

        var particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
        loc.push(particle);
        vel.push(new THREE.Vector3(0, 0, 0));
        acc.push(new THREE.Vector3(0, 0, 0));
        var col = new THREE.Color(0, 0, 0);
        color.push(col.setHSL(0, 1, 0));
    }
    particles.colors = color;

    // var particleMaterial = new THREE.PointsMaterial({
    //     color:0xffff00,
    //     size: 0.4,
    //     map: THREE.ImageUtils.loadTexture('images/snowflake.png'),
    //     transparent: true
    // });
    var particleMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
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

    var p = options.p;
    var q = options.q;

    phi = options.speed * clock.getElapsedTime();
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
    var maxLen = 0.0;
    // NEW WAY
    // var deltaT = 1.0; //clock.getDelta();
    var verts = particleSystem.geometry.vertices;
    var cols = particleSystem.geometry.colors;
    for (var i = 0; i < verts.length; i++) {
        var force = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, verts[i]);
        var len = force.length();
        if (len > 0.05) {
            force.normalize().multiplyScalar(
                options.mass / (Math.pow(len, options.exponent)));
        } else {
            force.multiplyScalar(0.0);
        }
        acc[i].add(force);
        vel[i].add(acc[i]);
        loc[i].add(vel[i]);
        verts[i].set(loc[i].x, loc[i].y, loc[i].z);
        acc[i].multiplyScalar(0.0); // clear out acceleration

        // set color based on velocity
        var speed = vel[i].length() / 5.0;
        if (speed < 0.5) {
            // move color from red to yellow
            cols[i].setHSL(speed * 0.32, 1, 0.5);
        } else {
            cols[i].setHSL(0.16, 1, 0.5 + speed);
        }

        // if (vel[i].length() > maxLen) {maxLen = vel[i].length()}
    }
    console.log(maxLen);
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.geometry.colorsNeedUpdate = true;
}

function resetParticles() {
    for (var i = 0; i < PARTICLE_COUNT; i++) {
        // randomly initialize position
        var z = Math.random() * ELEV - ELEV / 2.0;
        var x = 2.0 * Math.random() * RADIUS - RADIUS;
        var y = 2.0 * Math.random() * RADIUS - RADIUS;
        // reset particle location/velocity/acceleration
        particleSystem.geometry.vertices[i].set(x, y, z);
        loc[i].set(x, y, z);
        vel[i].multiplyScalar(0.0);
        acc[i].multiplyScalar(0.0);
    }
}

/**
 * Specify parameters and user interface
 */
function setupDatGUI() {

    var options = [];

    options.torus = SHOW_TORUS;
    var pList = [1, 2, 3, 4, 5];
    options.p = P_INIT;
    var qList = [1, 2, 3, 4, 5];
    options.q = Q_INIT;
    options.mass = 0.1;
    options.exponent = 2.0;
    options.speed = 0.1;
    options.reset = function() {resetParticles()};

    gui = new dat.GUI();

    gui.add(options, 'torus').onChange(function() {
       if (options.torus) {
           addTorusKnot();
       } else {
           removeTorusKnot();
       }
    });
    gui.add(options, 'p', pList).onChange(function() {
        if (options.torus) {
            removeTorusKnot();
            addTorusKnot();
        }
    });
    gui.add(options, 'q', qList).onChange(function() {
        if (options.torus) {
            removeTorusKnot();
            addTorusKnot();
        }
    });
    gui.add(options, 'mass', 0.1, 10.0);
    gui.add(options, 'exponent', 0.1, 5.0);
    gui.add(options, 'speed', 0.01, 5.0);
    gui.add(options, 'reset');

    return options;
}

function addTorusKnot() {
    var geometry = new THREE.TorusKnotGeometry(
        RADIUS, radius, 256, 8, options.p, options.q);
    var material = new THREE.MeshPhongMaterial({
        color: 0xaa0000,
        side: THREE.DoubleSide
    });
    torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
}

function removeTorusKnot() {
    scene.remove(torusKnot);
}