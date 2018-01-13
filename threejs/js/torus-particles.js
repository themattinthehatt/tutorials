/**
 * torus-particles is a gravitational particle simulation. A point mass that 
 * moves around a torus knot provides the gravitational force that drives the 
 * dynamics of the particles, which do *not* interact with each other. An 
 * additional spring force acts to bring each particle back to its initial 
 * position
 * 
 * Good parameter settings:
 * p = 3; q = 2; mass = 0.1; exponent = 0.2; speed = 0.92
 * p = 3; q = 2; mass = 0.1; exponent = 0.2; speed = 0.01
 * p = 3; q = 2; mass = 0.62; exponent = 0.57; speed = 0.54
 */

// user parameters - gravitational force
var SHOW_TORUS = false;     // display torus knot that center of mass follows
var P_INIT = 3.0;           // parameter 1 for torus knot
var Q_INIT = 2.0;           // parameter 2 for torus knot
var MASS = 0.1;             // gravitational mass
var EXPONENT = 0.1;         // exponent on gravitational-like force law
var SPEED = 0.92;           // speed that mass travels around torus knot

// user parameters - spring force
var DAMP_VEL_PARAM = 0.0;   // coefficient of speed damping for spring force
var DAMP_POS_PARAM = 0.0;   // spring coefficient

// user parameters - particles
var NUM_PARTICLES = 100000; // number of particles to simulate
var CYCLE_COLOR = true;     // base color of particles cycles through huespace
var BASE_HUE = 0.0;         // base hue of particles

// user parameters - dynamics controller
var USE_CONTROLLER = true;  // periodically return particles to initial pos
var FREE_FRAMES = 400;      // number of frames without spring force
var RESET_FRAMES = 300;     // number of frames with spring force

// set up user parameters in gui
var gui;
var options = setupDatGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-150, 0, 0],
    controls: true,
    displayStats: true
});

// declare global variables

// particle dynamics info
var particleSystem;         // particle mesh
var pos_og = [];            // initial position
var pos = [];               // particle positions
var vel = [];               // particle velocities
var acc = [];               // particle accelerations
var color = [];             // particle colors
var maxLen = 5.0;           // parameter for dynamic control of particle colors

// gravity info
var gravCenter;             // location of center of gravity

// torus knot parameters
var RADIUS = 20.0;          // radius of torus
var radius = 2.0;           // radius of torus segments
var torusKnot;              // torus knot mesh
var mult = 1.0;             // change radius of torus trajectory relative to
                            // TorusKnotGeometry (0.5 for correspondence)
log = true;
// for dynamics controller
var frameCount = 0;         // keep track of frames

// keep track of time
var clock;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
updateScene();

function initializeDemo(){
    // control degree of motion in particles
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

    // clear particle info
    pos_og = [];    // initial position
    pos = [];       // particle positions
    vel = [];       // particle velocities
    acc = [];       // particle accelerations
    color = [];     // particle colors

    // allocate a plain geometry that will hold all of the vertices which are
    // the 'particles'
    var particles = new THREE.Geometry();
    // create the vertices and add them to the particle's geometry
    var phi, theta, x, y, z;
    for (var i = 0; i < options.numParticles; i++) {

        // random initial position on the surface of a sphere
        phi = Math.random() * Math.PI;
        theta = Math.random() * 2.0 * Math.PI;
        z = RADIUS * Math.cos(phi);
        x = RADIUS * Math.sin(phi) * Math.cos(theta);
        y = RADIUS * Math.sin(phi) * Math.sin(theta);

        // add vertices to particle system
        var particle = new THREE.Vector3(x, y, z);
        particles.vertices.push(particle);
        var col = new THREE.Color(0, 0, 0);
        color.push(col.setHSL(0, 1, 0));

        // keep track of particle info
        pos_og.push(new THREE.Vector3(x, y, z));
        pos.push(new THREE.Vector3(x, y, z));
        vel.push(new THREE.Vector3(0, 0, 0));
        acc.push(new THREE.Vector3(0, 0, 0));
    }
    particles.colors = color;

    // create particle system mesh
    var particleMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.4,
        transparent: true,
        sizeAttenuation: false
    });
    particleSystem = new THREE.Points(particles, particleMaterial);
    return particleSystem;
}

function updateScene() {

    // update center of gravity
    updateGravity();

    // subject particles to gravitational and spring forces
    updateParticles();

    // Define the function which is called by the browser supported timer loop
    requestAnimationFrame(updateScene);

    // map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}

function updateGravity() {

    var p = options.p;
    var q = options.q;
    var r;

    var phi = options.speed * clock.getElapsedTime();

    r = 2.0 + Math.cos(q * phi);

    // center of gravity moves along torus knot
    gravCenter.x = mult * RADIUS * r * Math.cos(p * phi);
    gravCenter.y = mult * RADIUS * r * Math.sin(p * phi);
    gravCenter.z = mult * RADIUS * Math.sin(q * phi);

}

function updateParticles() {

    // update parameters based on controller
    updateController();

    /*
     * UPDATE PARTICLE DYNAMICS
     */

    // for dynamic updates to color
    var temp = 0.0;
    var maxLenNew = 0.0;
    var hueTrans = 0.16;
    var baseHue = options.baseHue;
    if (options.cycleColor) {
        baseHue = 0.5 + 0.5 * Math.cos(0.05 * clock.getElapsedTime());
    }
    // var maxDisp = -100;

    // define vertices and colors for easy access
    var verts = particleSystem.geometry.vertices;
    var cols = particleSystem.geometry.colors;

    // loop through particles and update
    for (var i = 0; i < verts.length; i++) {

        // calculate gravitational force
        var force = new THREE.Vector3(0, 0, 0).subVectors(gravCenter, verts[i]);
        var len = force.length();
        force.normalize().multiplyScalar(
            options.mass / (Math.pow(len, options.exponent)));

        // clean up any particles that pass through center of gravity
        // if (len < 0.05) {
        //     force.set(0.0, 0.0, 0.0);
        // }
        //     console.log('Infs');

        // if (isNaN(force.x) || isNaN(force.y) || isNaN(force.z)) {
        //     console.log('NaNs!');
        // }
        // if ((!isFinite(force.x)) || (!isFinite(force.y)) || (!isFinite(force.z))) {
        //     console.log('Infs!');
        // }

        // calculate damped spring force
        // acc += -p1*velocity - k*displacement
        var forceReg = new THREE.Vector3(0, 0, 0).subVectors(pos_og[i], verts[i]);
        // if (frameCount === (options.freeFrames + options.resetFrames)) {
        //     maxDisp = Math.max(maxDisp, forceReg.length());
        // }
        // forceReg.multiplyScalar(options.dampPos);
        // forceReg.addScaledVector(vel[i], -1.0 * options.dampVel);

        if ((isNaN(forceReg.x) || isNaN(forceReg.y) || isNaN(forceReg.z)) && log) {
            console.log('forceReg NaNs!');
            console.log(pos_og[i]);
            console.log(verts[i]);
            forceReg.set(0.0, 0.0, 0.0);
            log = false;
        }
        // if ((!isFinite(forceReg.x)) || (!isFinite(forceReg.y)) || (!isFinite(forceReg.z))) {
        //     console.log('forceReg Infs!');
        //     forceReg.set(0.0, 0.0, 0.0);
        // }

        // update dynamics
        acc[i].add(force);
        // acc[i].add(forceReg);
        vel[i].add(acc[i]);
        if (vel[i].length() > len) {
            pos[i].add(len);
            vel[i].multiplyScalar(0.0);
        } else {
            pos[i].add(vel[i]);
        }

        // if (isNaN(acc[i].x) || isNaN(acc[i].y) || isNaN(acc[i].z)) {
        //     console.log('acceleration NaNs!');
        // }
        // if ((!isFinite(acc[i].x)) || (!isFinite(acc[i].y)) || (!isFinite(acc[i].z))) {
        //     console.log('acceleration Infs!');
        // }

        // actually update vertices in mesh
        verts[i].set(pos[i].x, pos[i].y, pos[i].z);

        // clear out acceleration
        acc[i].multiplyScalar(0.0);

        // set color based on velocity
        var speed = vel[i].length();
        var speedScaled = speed / (maxLen * 1.2);
        if (speedScaled < 0.5) {
            // move color from red to yellow
            temp = baseHue + speedScaled * 2.0 * hueTrans;
            cols[i].setHSL(temp - Math.floor(temp), 1, 0.5);
        } else {
            // move color from yellow to white
            temp = baseHue + hueTrans;
            cols[i].setHSL(temp - Math.floor(temp), 1, speedScaled);
        }
        if (speed > maxLenNew) {
            maxLenNew = speed
        }
    }
    // update velocity ceiling
    maxLen = 0.99 * maxLen + 0.01 * maxLenNew;

    // update particle system info on gpu
    particleSystem.geometry.verticesNeedUpdate = true;
    particleSystem.geometry.colorsNeedUpdate = true;

    // if (frameCount === (options.freeFrames + options.resetFrames)) {
    //     console.log(maxDisp);
    // }
}

function resetParticles() {
    var phi, theta, x, y, z;
    for (var i = 0; i < options.numParticles; i++) {
        // random initial position on the surface of a sphere
        phi = Math.random() * Math.PI;
        theta = Math.random() * 2.0 * Math.PI;
        z = RADIUS * Math.cos(phi);
        x = RADIUS * Math.sin(phi) * Math.cos(theta);
        y = RADIUS * Math.sin(phi) * Math.sin(theta);

        // reset particle position/velocity/acceleration
        particleSystem.geometry.vertices[i].set(x, y, z);
        pos[i].set(x, y, z);
        vel[i].multiplyScalar(0.0);
        acc[i].multiplyScalar(0.0);
    }
    // update particle system info on gpu
    particleSystem.geometry.verticesNeedUpdate = true;
}

function updateController() {
    if (options.useController) {
        if (frameCount > options.freeFrames) {
            // return particles to initial locations

            // increase velocity damping
            options.dampVel = 0.5 * Math.pow(
                (frameCount - options.freeFrames) / options.resetFrames, 8);
            // increase spring constant
            options.dampPos = 0.05 * Math.pow(
                (frameCount - options.freeFrames) / (1.5 * options.resetFrames), 2);
            // decrease gravitational mass
            options.mass = MASS *
                (frameCount - options.freeFrames) / options.resetFrames
        }
        if (frameCount === (options.freeFrames + options.resetFrames)) {
            resetController();
        } else {
            frameCount += 1;
        }
    }
}

function resetController() {
    frameCount = 0;
    options.dampPos = 0.0;
    options.dampVel = 0.0;
    options.mass = MASS;
    maxLen = 5.0;
}

function setupDatGUI() {

    var options = [];

    // initialize gui object
    gui = new dat.GUI();


    /*
     * add gravitational force options to gui
     */
    var f1 = gui.addFolder('Gravity parameters');

    // show torus radio button
    options.torus = SHOW_TORUS;
    f1.add(options, 'torus').onChange(function() {
       if (options.torus) {
           addTorusKnot();
       } else {
           removeTorusKnot();
       }
    });

    // p parameter for torus list
    var pList = [1, 2, 3, 4, 5];
    options.p = P_INIT;
    f1.add(options, 'p', pList).onChange(function() {
        if (options.torus) {
            removeTorusKnot();
            addTorusKnot();
        }
    });

    // q parameter for torus list
    var qList = [1, 2, 3, 4, 5];
    options.q = Q_INIT;
    f1.add(options, 'q', qList).onChange(function() {
        if (options.torus) {
            removeTorusKnot();
            addTorusKnot();
        }
    });

    // gravitational mass slider
    options.mass = MASS;
    f1.add(options, 'mass', 0.0, 1.0);

    // gravitational force exponent slider
    options.exponent = EXPONENT;
    f1.add(options, 'exponent', 0.1, 2.0);

    // speed of center of mass slider
    options.speed = SPEED;
    f1.add(options, 'speed', 0.0, 5.0);


    /*
     * add spring force options to gui
     */
    var f2 = gui.addFolder('Spring parameters');

    // coefficient of damping on velocity term slider
    options.dampVel = DAMP_VEL_PARAM;
    f2.add(options, 'dampVel', 0.0, 1.0);

    // spring constant slider
    options.dampPos = DAMP_POS_PARAM;
    f2.add(options, 'dampPos', 0.0, 0.01);


    /*
     * add particle options to gui
     */
    var f3 = gui.addFolder('Particle parameters');

    // change number of particles text field
    options.numParticles = NUM_PARTICLES;
    f3.add(options, 'numParticles').onChange(function() {
        // make sure input is a reasonable integer
        options.numParticles = Math.round(options.numParticles);
        if (options.numParticles > 200000) {
            options.numParticles = 200000;
        } else if (options.numParticles < 1) {
            options.numParticles = 1;
        }
        // remove old particle system
        scene.remove(particleSystem);

        // create new particle system
        particleSystem = createParticleSystem();

        // add new particle system to scene
        scene.add(particleSystem);

        // reset controller
        resetController();
    });

    // cycle through base colors of particles radio button
    options.cycleColor = CYCLE_COLOR;
    f3.add(options, 'cycleColor');

    // change base color with color controller
    options.baseHue = BASE_HUE; // hue
    options.colorInit = {h: 360 * BASE_HUE, s: 1.0, v: 1.0}; // actual color
    f3.addColor(options, 'colorInit').onChange(function() {
        options.baseHue = options.colorInit.h / 360.0;
    });


    /*
     * add controller options to gui
     */
    var f4 = gui.addFolder('Controller parameters');

    // controller radio button
    options.useController = USE_CONTROLLER;
    f4.add(options, 'useController').onChange(function() {
        if (options.useController) {
            frameCount = 0.0;
        } else {
            options.decay = 1.0;
        }
    });

    // change number of free frames in text field
    options.freeFrames = FREE_FRAMES;
    f4.add(options, 'freeFrames').onChange(function() {
        // make sure input is a reasonable integer
        options.freeFrames = Math.round(options.freeFrames);
        if (options.freeFrames > 1000000) {
            options.freeFrames = 1000000;
        } else if (options.freeFrames < 0) {
            options.freeFrames = 0;
        }
        resetController();
    });

    // change number of regularization frames in text field
    options.resetFrames = RESET_FRAMES;
    f4.add(options, 'resetFrames').onChange(function() {
        // make sure input is a reasonable integer
        options.resetFrames = Math.round(options.resetFrames);
        if (options.resetFrames > 1000000) {
            options.resetFrames = 1000000;
        } else if (options.resetFrames < 0) {
            options.resetFrames = 0;
        }
        resetController();
    });


    /*
     * add reset button
     */
    options.reset = function() {
        resetParticles();
        resetController();
    };
    gui.add(options, 'reset');

    return options;
}

function addTorusKnot() {
    var geometry = new THREE.TorusKnotGeometry(
        RADIUS, radius, 256, 8, options.p, options.q);
    var material = new THREE.MeshPhongMaterial({
        color: 0x333333,
        side: THREE.DoubleSide
    });
    torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
}

function removeTorusKnot() {
    scene.remove(torusKnot);
}
