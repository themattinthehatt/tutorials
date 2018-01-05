
var SEGMENTS = 8;
var BASE_RADIUS = 0.1;
var DELTA_RADIUS = 0.025;
var RESTITUTION = 0.75;
var BARREL_LENGTH = 0.5;

var BALL = {};

// clock.start();

BALL.BeachBall = function(parameters) {

    this.loc = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.gravity = new THREE.Vector3(0, 0, -0.002);
    this.mesh = null;

    GFX.setParameters(this, parameters);

    this.radius = BASE_RADIUS + DELTA_RADIUS * Math.random();

    var geometry = new THREE.SphereGeometry(this.radius, SEGMENTS, SEGMENTS);
    var material = new THREE.MeshLambertMaterial({transparent: true});
    material.color.setRGB(Math.random(), Math.random(), Math.random());

    this.mesh = new THREE.Mesh(geometry, material);
    this.restitution = RESTITUTION;
};

BALL.BeachBall.prototype.update = function() {
    this.loc.add(this.vel);
    this.vel.add(this.gravity);
    this.mesh.position.set(this.loc.x, this.loc.y, this.loc.z);
};

var CANNON = {};

CANNON.Cannon = function(parameters) {

    // parameter defaults
    this.deltaT = 0.0;
    this.lastT = 0.0;
    this.mesh = null;
    this.magazine = [];
    this.active = [];
    this.xLimit = 0;
    this.yLimit = 0;
    this.scene = null;
    this.gravity = new THREE.Vector3(0, 0, -0.002);

    // update parameters with constructor arguments
    GFX.setParameters(this, parameters);

    // create the cannon
    var geometry = new THREE.CylinderGeometry(
        BASE_RADIUS * 2.0,
        BASE_RADIUS * 3.0,
        BARREL_LENGTH,
        32, 1, true
    );
    var material = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        specular: 0x009900,
        shininess: 30,
        side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotateX(Math.PI / 2.0);
    this.mesh.position.set(0, 0, BARREL_LENGTH / 2.0);
    // this.mesh.rotateY = Math.PI / 2.0;
    // this.scene.add(this.mesh);

};

CANNON.Cannon.prototype.update = function() {
    var now = clock.getElapsedTime();
    if ((now - this.lastT) < this.deltaT)
        return;
    this.lastT = now;

    var newBall;
    if (this.magazine.length > 0) {
        newBall = this.magazine.pop();
    } else {
        newBall = new BALL.BeachBall({gravity: this.gravity});
        this.scene.add(newBall.mesh);
    }
    // fire the cannon!
    this.initTrajectory(newBall);
    this.active.push(newBall);
};

CANNON.Cannon.prototype.updateBalls = function() {
    for (var i = this.active.length-1; i >= 0; i--) {
        var ball = this.active[i];

        // check to see if ball is transparent
        if (ball.mesh.material.opacity <= 0) {
            this.active.splice(i, 1);
            this.magazine.push(ball);
        } else {
            // move ball
            ball.update();

            // bounce ball or let fall
            if (ball.loc.z < ball.radius) {
                if (Math.abs(ball.loc.x) <= this.xLimit &&
                    Math.abs(ball.loc.y) <= this.yLimit) {
                    // ball is still in bounds; bounce
                    ball.vel.z = -ball.vel.z * ball.restitution;
                    ball.loc.z = ball.radius;
                } else {
                    // ball out of bounds; let fall and make transparent
                    ball.mesh.material.opacity -= 0.025;
                }
            }
        }
    }
};

CANNON.Cannon.prototype.initTrajectory = function(ball) {
    var MUZZLE_VELOCITY = 0.125;
    var MIN_RHO = 55.0 * Math.PI / 180;
    var DELTA_RHO = 30.0 * Math.PI / 180.0;

    var rho = MIN_RHO + DELTA_RHO * Math.random();
    var velZ = Math.sin(rho) * MUZZLE_VELOCITY;
    var velH = Math.cos(rho) * MUZZLE_VELOCITY;

    var theta = Math.PI * 2.0 * Math.random();
    var velX = Math.cos(theta) * velH;
    var velY = Math.sin(theta) * velH;

    ball.vel.set(velX, velY, velZ);
    ball.loc.set(0, 0, ball.radius);

    // make mesh visible
    ball.mesh.material.opacity = 1.0;
};
