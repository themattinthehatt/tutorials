
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

// global vars
var gui;
var quadTexture;
var quadric;
var quadGeometry;
var quadMaterial;
var materialType = 0; // texture, paint or wire
var quadType = 0;

// setup gui
setupDatGUI();

// Initialize the demo
initializeDemo();

// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the demo.
 */
function initializeDemo(){
    // load texture
    quadTexture = new THREE.ImageUtils.loadTexture("images/sierra_in_snow.jpg");
    // choose material
    quadMaterial = makeMaterial(materialType);
    quadric = makeQuad(0);
}

function makeMaterial(matType) {
    materialType = matType;
    var quadMat;
    if (materialType === 0) {
        quadMat = new THREE.MeshPhongMaterial({
            map: quadTexture,
            side: THREE.DoubleSide
        })
    } else if (materialType === 1) {
        quadMat = new THREE.MeshBasicMaterial({
            wireframe: true
        })
    } else {
        quadMat = new THREE.MeshLambertMaterial({
            color: '#00abb1'
        })
    }
    return quadMat;
}

function makeQuad(qType) {
    quadType = qType;
    scene.remove(quadric);

    switch(quadType) {
        case 0:
            quadGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
            break;
        case 1:
            quadGeometry = new THREE.CircleGeometry(2.0, 32);
            break;
        case 2:
            quadGeometry = new THREE.CylinderGeometry(2.0, 2.0, 5, 32);
            break;
        case 3:
            quadGeometry = new THREE.DodecahedronGeometry(2.0);
            break;
        case 4:
            quadGeometry = new THREE.IcosahedronGeometry(2.0);
            break;
        case 5:
            quadGeometry = new THREE.CylinderGeometry(0.0, 2.0, 5, 64);
            break;
        case 6:
            quadGeometry = new THREE.OctahedronGeometry(2.0, 2.0, 2.0);
            break;
        case 7:
            quadGeometry = new THREE.RingGeometry(0.5, 2.0, 32);
            break;
        case 8:
            quadGeometry = new THREE.SphereGeometry(2.0, 32, 32);
            break;
        case 9:
            quadGeometry = new THREE.TetrahedronGeometry(2.0);
            break;
        case 10:
            quadGeometry = new THREE.TorusGeometry(2.0, 0.3, 16, 100);
            break;
        case 11:
            quadGeometry = new THREE.TorusKnotGeometry(2.0, 0.5, 100, 16);
            break;
    }
    quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
    scene.add(quadMesh);
    return quadMesh;
}

/**
 * Specify parameters and user interface
 */
function setupDatGUI() {
    var quadList = [
        'Box',
        'Circle',
        'Cylinder',
        'Dodecahedron',
        'Icosahedron',
        'Cone',
        'Octahedron',
        'Ring',
        'Sphere',
        'Tetrahedron',
        'Torus',
        'TorusKnot'
    ];
    var materialList = ['Texture', 'Wireframe', 'Color'];
    var options = [];

    options.quadType = 0;
    options.materialType = 0;
    options.material = materialList[0];
    options.quad = quadList[0];

    gui = new dat.GUI();

    gui.add(options, 'material', materialList).onChange(function() {
       materialType = materialList.indexOf(options.material);
       quadMaterial = makeMaterial(materialType);
       quadric = makeQuad(quadType);
    });
    gui.add(options, 'quad', quadList).onChange(function() {
        quadType = quadList.indexOf(options.quad);
        quadric = makeQuad(quadType);
    });
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
