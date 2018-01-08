/**
 * http://htmlpreview.github.com/?https://github.com/themattinthehatt/tutorials/blob/master/threejs/tutorial08.html
 * TODO
 * Good parameter settings (5000 particles):
 * p = 3; q = 2; mass = 0.1; exponent = 0.2; speed = 0.92
 * p = 3; q = 2; mass = 0.1; exponent = 0.2; speed = 0.01
 * p = 3; q = 2; mass = 0.62; exponent = 0.57; speed = 0.54
 */

var SHOW_TORUS = false;
var P_INIT = 3.0;
var Q_INIT = 2.0;
var MASS = 0.1;
var EXPONENT = 0.2;
var SPEED = 0.92;
var USE_CONTROLLER = true;
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
var PARTICLE_COUNT = 100000;
var particleSystem;
var loc_og = [];
var loc = [];
var vel = [];
var acc = [];
var color = [];
var maxLen = 5.0;

// particle initialization info
var INIT_SHAPE = 'sphere';

// dynamics controller

var frameCount = 0;
var freeFrames = 400;
var regFrames = 100;
var frac = 0.4; // perceptually nice setting

// gravity info
var gravCenter;
// torus knot parameters
var phi;
var RADIUS = 10.0; // 20.0
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
        if (INIT_SHAPE === 'box') {
            var z = 2.0 * Math.random() * RADIUS - RADIUS;
            var x = 2.0 * Math.random() * RADIUS - RADIUS;
            var y = 2.0 * Math.random() * RADIUS - RADIUS;
        } else if (INIT_SHAPE === 'sphere') {
            var phi = Math.random() * Math.PI;
            var theta = Math.random() * 2.0 * Math.PI;
            var z = RADIUS * Math.cos(phi);
            var x = RADIUS * Math.sin(phi) * Math.cos(theta);
            var y = RADIUS * Math.sin(phi) * Math.sin(theta);
        }

        var particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
        loc_og.push(new THREE.Vector3(x, y, z));
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

    if (options.useController) {
        if (frameCount > freeFrames) {
            if (frameCount < (freeFrames + regFrames * frac)) {
                // first 80% of coalescence; go as sqrt (slow)
                options.decay =
                    Math.sqrt(1.0 - (frameCount - freeFrames) / regFrames / 5.0);
                currDecay = options.decay;
            } else {
                // last 20% of coalescence; go as linear (fast)
                options.decay = currDecay *
                    (1.0 - (frameCount - freeFrames - regFrames * frac) /
                        (regFrames * (1.0 - frac)));
            }

            // options.decay = Math.sqrt(1.0 - (frameCount - freeFrames) / regFrames);
        }
        if (frameCount === (freeFrames + regFrames)) {
            frameCount = 0;
            options.decay = 1.0;
            maxLen = 5.0;
        } else {
            frameCount += 1;
        }
        // options.decay = 0.5 + 0.5 * Math.cos(0.1 * clock.getElapsedTime());
    }

    var maxLenNew = 0.0;
    // var deltaT = 1.0; //clock.getDelta();
    var verts = particleSystem.geometry.vertices;
    var cols = particleSystem.geometry.colors;
    for (var i = 0; i < verts.length; i++) {

        // gravitational force
        var force = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, verts[i]);
        var len = force.length();
        force.normalize().multiplyScalar(
            options.mass / (Math.pow(len, options.exponent)));

        // regularization force (like gravity for now)
        // var forceReg = new THREE.Vector3(0, 0, 0).subVectors(loc_og[i], verts[i]);
        // var lenReg = forceReg.length();
        // forceReg.normalize().multiplyScalar(
        //     options.decay / Math.pow(lenReg, 2.0)
        // );

        // update dynamics
        acc[i].add(force);
        // if (options.decay > 0 && lenReg > 0.01) {
        //     acc[i].add(forceReg);
        // }
        vel[i].add(acc[i]);
        if (vel[i].length() > len) {
            loc[i].add(len);
            vel[i].multiplyScalar(0.0);
        } else {
            loc[i].add(vel[i]);
        }

        // doesn't get holes as easily this way
        // loc[i].add(vel[i]);

        // scale position between current location and original location
        loc[i].set(
            options.decay * loc[i].x + (1.0 - options.decay) * loc_og[i].x,
            options.decay * loc[i].y + (1.0 - options.decay) * loc_og[i].y,
            options.decay * loc[i].z + (1.0 - options.decay) * loc_og[i].z
        );
        vel[i].multiplyScalar(options.decay);
        if (options.useController && (frameCount === 0)) {
            loc[i].set(loc_og[i].x, loc_og[i].y, loc_og[i].z);
            vel[i].multiplyScalar(0.0);
        }

        verts[i].set(loc[i].x, loc[i].y, loc[i].z);
        acc[i].multiplyScalar(0.0); // clear out acceleration

        // set color based on velocity
        var speed = vel[i].length();
        var speedScaled = speed / (maxLen * 1.2);
        if (speedScaled < 0.5) {
            // move color from red to yellow
            cols[i].setHSL(speedScaled * 0.32, 1, 0.5);
        } else {
            // move color from yellow to white
            cols[i].setHSL(0.16, 1, speedScaled);
        }
        if (speed > maxLenNew) {maxLenNew = speed}
    }
    maxLen = 0.95 * maxLen + 0.05 * maxLenNew;
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.geometry.colorsNeedUpdate = true;
}

function resetParticles() {
    for (var i = 0; i < PARTICLE_COUNT; i++) {
        // randomly initialize position
        if (INIT_SHAPE === 'box') {
            var z = 2.0 * Math.random() * RADIUS - RADIUS;
            var x = 2.0 * Math.random() * RADIUS - RADIUS;
            var y = 2.0 * Math.random() * RADIUS - RADIUS;
        } else if (INIT_SHAPE === 'sphere') {
            var phi = Math.random() * Math.PI;
            var theta = Math.random() * 2.0 * Math.PI;
            var z = RADIUS * Math.cos(phi);
            var x = RADIUS * Math.sin(phi) * Math.cos(theta);
            var y = RADIUS * Math.sin(phi) * Math.sin(theta);
        }
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
    options.mass = MASS;
    options.exponent = EXPONENT;
    options.speed = SPEED;
    options.useController = USE_CONTROLLER;
    options.reset = function() {resetParticles()};
    options.decay = 1.0;

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
    gui.add(options, 'mass', 0.0, 1.0);
    gui.add(options, 'exponent', 0.1, 5.0);
    gui.add(options, 'speed', 0.0, 5.0);
    gui.add(options, 'reset');
    // gui.add(options, 'decay', 0.0, 1.0);
    gui.add(options, 'useController').onChange(function() {
        if (options.useController) {
            frameCount = 0.0;
        } else {
            options.decay = 1.0;
        }
    });

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