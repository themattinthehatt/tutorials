// x and y rotation
var xRotation = 0.0;
var yRotation = 0.0;
// Rotation speed around x and y axis
var xSpeed = 0.0;
var ySpeed = 0.0;
// Translation along the z axis
var zTranslation = 0.0;
// The x and y speed is controlled by the cursor keys.
// The translation on the z axis by 'Page up / down'.
// 'crateTexture' is the texture object. We set it global, to modify it's attributes
// later on.

// 'textureFilter' will have three states (0, 1 or 2), controlling the current texture
// filtering (nearest, linear or mipmapped).
// The next two objects hold two different kinds of light: Ambient and directional light.
// 'enableLights' is the flag, which is switched by the key 'f'.
// Texture and flag for current texture filter
var filter = [ THREE.NearestFilter,
    THREE.LinearFilter,
    THREE.NearestMipMapNearestFilter,
    THREE.LinearMipMapLinearFilter ];
var filterType = ["Nearest",
    "Linear",
    "NearestMipMapNearest",
    "LinearMipMapLinear"];

// Global mesh object of the cube; need to access some of the properties of
// the mesh in our key handlers
var squareMesh;
var num = 32;
var star = new Array(num);
var spin = 0;

var gui;
var options = setupDataGUI();

// allocate the scene object, and set the camera position
var scene = new GFX.Scene({
    cameraPos: [0, 0, 20],
    axesHeight: 10,
    controls: false,
    displayStats: false
});

var directionalLight = scene.directionalLights[0];
var ambientLight = scene.ambientLights[0];
var intensity = 1;

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){

    // load texture
    var texture = new THREE.ImageUtils.loadTexture("images/waves-01.jpg");

    for (var i = 0; i < num; i++) {
        // add texture-mapped cube
        var squareGeometry = new THREE.Geometry();
        squareGeometry.vertices.push(new THREE.Vector3(-1, -1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(1, -1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(-1, 1, 0));
        squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
        squareGeometry.faces.push(new THREE.Face3(0, 2, 3));
        squareGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)
        ]);

        squareGeometry.faceVertexUvs[0].push([
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 1.0),
            new THREE.Vector2(0.0, 1.0)
        ]);
        var squareMaterial = new THREE.MeshBasicMaterial({
            map: texture,                // texture to use
            transparent: true,           // needed even if opacity < 1
            combine: THREE.MixOperation, // mix foreground and background
            blending: THREE.AdditiveBlending,
            color: 0xFFFFFF
        });
        // var squareMaterial = new THREE.MeshBasicMaterial({
        //     map: texture,                // texture to use
        //     transparent: true,           // needed even if opacity < 1
        //     combine: THREE.MixOperation, // mix foreground and background
        //     opacity: 0.7
        // });
        squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.position.set(0.0, 0.0, 0.0);
        scene.add(squareMesh);

        star[i] = new Object();
        star[i].angle = 0.0;
        star[i].dist = (i / num) * 5.0;
        star[i].r = Math.random();
        star[i].g = Math.random();
        star[i].b = Math.random();
        star[i].mesh = squareMesh;

    }

    // Add a listener for 'keydown' events. By this listener, all key events will be
    // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
    // It will report only the visible characters like 'a', but not the function keys
    // like 'cursor up'.
    document.addEventListener('keydown', onDocumentKeyDown, false);

}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){


    // Now loop through the stars and update their positions, spin and color
    for(var i = 0; i < num; i++) {
        spin += Math.PI * 2 / num;
        if (spin > (Math.PI*2))
            spin = 0;
        // spin = 0;

        // star[i].angle += i / num;
        star[i].dist  -= 0.01;
        if(star[i].dist < 0.0) {
            star[i].dist += 5.0;

            // note that the rgb color values must be in the range of 0..1 or the Color
            // object will just clamp them to 1, i.e. white
            star[i].r    = Math.random();
            star[i].g    = Math.random();
            star[i].b    = Math.random();
        }

        // we want to translate the star out to the right distance and the rotate it
        // around the z-axis so we set the mesh's matrix to that translated value
        // then rotate a second matrix and concatenate it onto the mesh's matrix.
        star[i].mesh.matrix.setPosition(new THREE.Vector3(star[i].dist, 0, 0));
        var mr = new THREE.Matrix4();
        mr.makeRotationZ(spin);
        star[i].mesh.applyMatrix(mr);

        // then change the color of the mesh
        star[i].mesh.material.color.setRGB(star[i].r, star[i].g, star[i].b);
    }

    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);

    // Map the 3D scene down to the 2D screen (render the frame)
    scene.renderScene();
}

/**
 * This function is called, when a key is pushed down.
 */
function onDocumentKeyDown(event) {
    var key = event.key;
    key = key.toLowerCase();

    if (key === 'f') {            // 'F' - Toggle through the texture filters
        updateFilter();
    } else if (key === 'l') {       // 'L' - Toggle light
        intensity = intensity > 0 ? 0 : 1;
        //directionalLight.intensity = ambientLight.intensity = intensity;
        directionalLight.intensity = intensity;
    } else if (key === 'arrowup') {       // Cursor up
        xSpeed -= 0.005;
    } else if (key === 'arrowdown') {       // Cursor down
        xSpeed += 0.005;
    } else if (key === 'arrowleft') {       // Cursor left
        ySpeed -= 0.005;
    } else if (key === 'arrowright') {       // Cursor right
        ySpeed += 0.005;
    } else if (key === 'w') {
        zTranslation -= 0.2;
    } else if (key === 's') {       // Page down
        zTranslation += 0.2;
    }

    event.stopPropagation();
}

function updateFilter() {
    cubeMesh.material.map.minFilter = filter[options.nFilter];
    cubeMesh.material.map.magFilter = filter[options.nFilter % 2];
    cubeMesh.material.map.needsUpdate = true;
}

function setupDataGUI() {

    var options = [];
    options.rotating = false;
    options.nFilter = 0;
    options.textureFilter = filterType[options.nFilter];

    gui = new dat.GUI();

    gui.add(options, 'rotating').onChange(function() {
        //
        // if (options.rotating === false) {
        //     // xRotation = 0;
        //     // yRotation = 0;
        //     xSpeed = 0;
        //     ySpeed = 0;
        // }
    });

    gui.add(options, "textureFilter",
        [filterType[0], filterType[1], filterType[2], filterType[3]]).onChange(function() {

        options.nFilter = filterType.indexOf(options.textureFilter);
        updateFilter();
    });

    return options
}