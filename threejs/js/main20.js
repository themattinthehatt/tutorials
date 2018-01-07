
var gui;
var options = setupDatGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [-20, 0, 0],
    axesHeight: 0,
    controls: true,
    displayStats: true
});

var box;
var texture;
var boxMaterial;
// var map;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){

    // // create a buffer with data
    // var width = 4;
    // var height = 4;
    // var size = width * height;

    // // for alpha maps
    // var data = new Uint8Array(size);
    // for (var i = 0; i < size; i ++) {
    //     if (i < width) {
    //         // top row
    //         data[i] = 0;
    //     } else if (i >= size - width) {
    //         // bottom row
    //         data[i] = 0;
    //     } else if ((i % width === 0) || (i % width === (width - 1))) {
    //         // sides
    //         data[i] = 0;
    //     } else {
    //         // center; make transparent
    //         data[i] = 255;
    //     }
    // }
    // // use the buffer to create a DataTexture
    // var map = new THREE.DataTexture(data, width, height, THREE.AlphaFormat,
    //     THREE.UnsignedByteType);
    // var boxMaterial = new THREE.MeshPhongMaterial({
    //     side: THREE.DoubleSide,
    //     alphaMap: map,
    //     color: 0xff0000,
    //     transparent: true
    // });

    // // for rgb maps
    // var data = new Uint8Array(3 * size);
    // var border = 255;
    // var center = 0;
    // for (var i = 0; i < size; i ++) {
    //     var stride = i * 3;
    //     if (i < width) {
    //         // top row
    //         data[stride]     = border;
    //         data[stride + 1] = border;
    //         data[stride + 2] = border;
    //     } else if (i >= size - width) {
    //         // bottom row
    //         data[stride]     = border;
    //         data[stride + 1] = border;
    //         data[stride + 2] = border;
    //     } else if ((i % width === 0) || (i % width === (width - 1))) {
    //         // sides
    //         data[stride]     = border;
    //         data[stride + 1] = border;
    //         data[stride + 2] = border;
    //     } else {
    //         // center
    //         data[stride]     = center;
    //         data[stride + 1] = center;
    //         data[stride + 2] = center;
    //     }
    // }
    // // use the buffer to create a DataTexture
    // var map = new THREE.DataTexture(data, width, height, THREE.RGBFormat,
    //     THREE.UnsignedByteType);
    // var boxMaterial = new THREE.MeshPhongMaterial({
    //     side: THREE.DoubleSide,
    //     map: map
    // });

    // // for rgba maps
    // var data = new Uint8Array(4 * size);
    // var border = 255;
    // var center = 0;
    // for (var i = 0; i < size; i ++) {
    //     var stride = i * 4;
    //     data[stride] = 255;
    //     data[stride + 1] = 0;
    //     data[stride + 2] = 0;
    //     if (i < width) {
    //         // top row
    //         data[stride + 3] = border;
    //     } else if (i >= size - width) {
    //         // bottom row
    //         data[stride + 3] = border;
    //     } else if ((i % width === 0) || (i % width === (width - 1))) {
    //         // sides
    //         data[stride + 3] = border;
    //     } else {
    //         // center; make transparent
    //         data[stride + 3] = center;
    //     }
    // }
    // // console.log(data);
    // // use the buffer to create a DataTexture
    // var map = new THREE.DataTexture(data, width, height, THREE.RGBAFormat,
    //     THREE.UnsignedByteType);
    // var boxMaterial = new THREE.MeshPhongMaterial({
    //     side: THREE.DoubleSide,
    //     map: map,
    //     transparent: true
    // });

    buildTexture();

    boxMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture
    });

    // create a wire-frame box mesh for visual reference
    var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 0, 0);
    scene.add(box);

}

function buildTexture() {

    // create a buffer with data
    var width = options.size;
    var height = options.size;
    var size = width * height;

    // for rgb maps
    var data = new Uint8Array(3 * size);
    var border = 255;
    var center = 0;
    for (var i = 0; i < size; i ++) {
        var stride = i * 3;
        if (i < width) {
            // top row
            data[stride]     = border;
            data[stride + 1] = border;
            data[stride + 2] = border;
        } else if (i >= size - width) {
            // bottom row
            data[stride]     = border;
            data[stride + 1] = border;
            data[stride + 2] = border;
        } else if ((i % width === 0) || (i % width === (width - 1))) {
            // sides
            data[stride]     = border;
            data[stride + 1] = border;
            data[stride + 2] = border;
        } else {
            // center
            data[stride]     = center;
            data[stride + 1] = center;
            data[stride + 2] = center;
        }
    }
    // use the buffer to create a DataTexture
    texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat,
        THREE.UnsignedByteType);

    // this is crucial; not sure why this isn't built into THREE.DataTexture;
    // thanks to https://codepen.io/SereznoKot/pen/vNjJWd
    texture.needsUpdate = true;

    console.log('texture updated; new size = %s', options.size)

}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){

    // Define the function, which is called by the browser supported timer loop.
    // If the browser tab is not visible, the animation is paused. So
    // 'animateScene()' is called in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}

function setupDatGUI() {

    var options = [];

    var texSize = [4, 8, 16, 32, 64, 128];
    options.size = 64;

    gui = new dat.GUI();

    gui.add(options, 'size', texSize).onChange(function() {
        buildTexture();
        boxMaterial.map = texture;
        // boxMaterial.needsUpdate = true;
    });

    return options;
}