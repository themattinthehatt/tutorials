/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

// Dict of key states
keyStates = {};
// Only pay attention to standard ASCII keys
for (var i = 32; i < 128; i++) {
    var c = String.fromCharCode(i);
    // console.log('key ' + i + ': ' + c);
    keyStates[c] = false;
}
keyStates['arrowright'] = false;
keyStates['arrowleft'] = false;
keyStates['arrowup'] = false;
keyStates['arrowdown'] = false;

THREE.OrbitControls = function(object, domElement) {

    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;

    // API

    this.enabled = true;

    this.center = new THREE.Vector3();

    this.userZoom = true;
    this.userZoomSpeed = 1.0;

    this.userRotate = true;
    this.userRotateSpeed = 1.0;

    this.userPan = true;
    this.userPanSpeed = 0.1;

    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    this.minDistance = 0;
    this.maxDistance = Infinity;

    // internals
    this.EPS = 0.000001;
    this.PIXELS_PER_ROUND = 1800;

    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();

    this.zoomStart = new THREE.Vector2();
    this.zoomEnd = new THREE.Vector2();
    this.zoomDelta = new THREE.Vector2();

    this.phiDelta = 0;
    this.thetaDelta = 0;
    this.scale = 1;

    this.lastPosition = new THREE.Vector3();

    // events
    // window.addEventListener('keydown', onKeyDown, false);
    // window.addEventListener('keyup', onKeyUp, false);

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

};

// subclass event dispatcher
THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);

THREE.OrbitControls.prototype.pan = function ( distance ) {

    distance.transformDirection( this.object.matrix );
    distance.multiplyScalar( this.userPanSpeed );

    this.object.position.add( distance );
    this.center.add( distance );

};

THREE.OrbitControls.prototype.update = function () {

    this.handleKeys();

    // var position = this.object.position;
    // var offset = position.clone().sub( this.center );
    //
    // position.copy( this.center ).add( offset );
    //
    // this.object.lookAt( this.center );
    //
    // if ( this.lastPosition.distanceTo( this.object.position ) > 0 ) {
    //
    //     this.dispatchEvent( this.changeEvent );
    //
    //     this.lastPosition.copy( this.object.position );
    //
    // }

};


THREE.OrbitControls.prototype.handleKeys = function() {
    // move right
    if (keyStates['arrowright']) {
        this.pan(new THREE.Vector3(this.userPanSpeed, 0, 0 ));
    }
    // move left
    if (keyStates['arrowleft']) {
        this.pan(new THREE.Vector3(-this.userPanSpeed, 0, 0 ));
    }
    // move up
    if (keyStates['arrowup']) {
        this.pan(new THREE.Vector3(0, this.userPanSpeed, 0 ));
    }
    // move down
    if (keyStates['arrowdown']) {
        this.pan(new THREE.Vector3(0, -this.userPanSpeed, 0 ));
    }

    // S - move down
    if (keyStates['s']) {
        // camera.translateY(-cameraMoveSpeed());
    }

    // W - move up
    if (keyStates['w']) {
        // camera.translateY(cameraMoveSpeed());
    }
};

onKeyDown = function(event) {
    var key = event.key.toLowerCase();
    if (key in keyStates) {
        keyStates[key] = true;
    }
};

onKeyUp = function(event) {
    var key = event.key.toLowerCase();
    if (key in keyStates) {
        keyStates[key] = false;
    }
};