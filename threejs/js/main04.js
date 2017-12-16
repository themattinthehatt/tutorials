// Global scene object
var scene;
// Global camera object
var camera;
// Global mesh object of the triangle
var pyramidMesh;
// Global mesh object of the square
var cubeMesh;

var renderer;

// Initialize the scene
initializeScene();
// Animate the scene (map the 3D world to the 2D scene)
animateScene();

/**
 * Initialize the scene.
 */
function initializeScene(){
    // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
    // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
    // antialiasing by default.
    // The approach of multiple renderers is quite nice, because your scene can also be
    // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
    // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
    // difference.
    renderer = new THREE.WebGLRenderer({antialias:true});
    // Set the background color of the renderer to black, with full opacity
    renderer.setClearColor(0x000000, 1);
    // Get the size of the inner window (content area) to create a full size renderer
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    // Set the renderers size to the content areas size
    renderer.setSize(canvasWidth, canvasHeight);
    // Get the DIV element from the HTML document by its ID and append the renderers DOM
    // object to it
    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    // Create the scene, in which all objects are stored (e. g. camera, lights,
    // geometries, ...)
    scene = new THREE.Scene();
    // Now that we have a scene, we want to look into it. Therefore we need a camera.
    // Three.js offers three camera types:
    //  - PerspectiveCamera (perspective projection)
    //  - OrthographicCamera (parallel projection)
    //  - CombinedCamera (allows to switch between perspective / parallel projection
    //    during runtime)
    // In this example we create a perspective camera. Parameters for the perspective
    // camera are ...
    // ... field of view (FOV),
    // ... aspect ratio (usually set to the quotient of canvas width to canvas height)
    // ... near and
    // ... far.
    // Near and far define the clipping planes of the view frustum. Three.js provides an
    // example (http://mrdoob.github.com/three.js/examples/
    // -> canvas_camera_orthographic2.html), which allows to play around with these
    // parameters.
    // The camera is moved 10 units towards the z axis to allow looking to the center of
    // the scene.
    // After definition, the camera has to be added to the scene.
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    // To create a pyramid, we use THREE.CylinderGeometry. By its five parameters, we are
    // able to create the geometry of the pyramid (subtype of a cylinder).
    // Parameter 1 'radiusTop': Controls the radius of the upper end of the cylinder. If we
    //                          set to to '0', we have a cone.
    // Parameter 2 'radiusBottom': Controls the radius of the lower end.
    // Parameter 3 'height': Sets the height of the cylinder.
    // Parameter 4 'segments': Number of segments, forming the cylindrical shell. To create
    //                         a pyramid, we choose '4'.
    // Parameter 5 'openEnded': Allows to have open ends ('true') or closed ends ('false')
    //                          of the cylindern. Since the pyramid shall have a bottom
    //                          face, we set it to 'false'.
    var pyramidGeometry = new THREE.CylinderGeometry(0, 1.5, 1.5, 4, false);

    // Coloring the faces with vertex colors is a bit tricky, but allows us to see how to
    // loop through the faces and check whether they have three or four vertices.
    // With a simple 'for'-loop we run through all faces, which are accessed by their index.
    // The 'instanceof' operator gives the possibility to check, whether the current face is
    // a THREE.Face4 or THREE.Face3. Depending on its object type, we set three or four
    // vertex colors. For THREE.Face4 we switch the colors of vertex 1 and 2 for every
    // second face because we want the lower vertices having the same colors as the
    // neighbour face. Vertex 0 and 3 are the upper vertices, which are always red.
    // If WebGL isn't supported and the canvas renderer is used, it ignores the vertex
    // colors. They are only supported by the WebGL renderer (current release of
    // Three.js: 49).
    for (var i = 0; i < pyramidGeometry.faces.length; i++){
        if (pyramidGeometry.faces[i] instanceof THREE.Face4) {
            pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
            if ( (i%2) == 0) {
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
                pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
            } else {
                pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x00FF00);
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x0000FF);
            }
            pyramidGeometry.faces[i].vertexColors[3] = new THREE.Color(0xFF0000);
        } else {
            if ( (i%2) == 0) {
                pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
            } else {
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0xFF0000);
                pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0x00FF00);
            }
            pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
        }
    }
    var pyramidMaterial = new THREE.MeshBasicMaterial({
        vertexColors:THREE.VertexColors,
        side:THREE.DoubleSide
    });
    pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramidMesh.position.set(-1.5, 0.0, 4.0);
    scene.add(pyramidMesh);


    var cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    var cubeMaterials = [
        new THREE.MeshBasicMaterial({color:0xFF0000}),
        new THREE.MeshBasicMaterial({color:0x00FF00}),
        new THREE.MeshBasicMaterial({color:0x0000FF}),
        new THREE.MeshBasicMaterial({color:0xFF0000}),
        new THREE.MeshBasicMaterial({color:0x00FF00}),
        new THREE.MeshBasicMaterial({color:0x0000FF})
    ];
    var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
    cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(1.5, 0.0, 4.0);
    scene.add(cubeMesh);
}

/**
 * Animate the scene and call rendering.
 */
function animateScene(){
    // At first, we increase the y rotation of the triangle mesh and decrease the x
    // rotation of the square mesh.

    // Increase the y rotation of the triangle
    pyramidMesh.rotation.y += 0.01;
    // Decrease the x rotation of the square
    cubeMesh.rotation.x -= 0.05;
    // Define the function, which is called by the browser supported timer loop. If the
    // browser tab is not visible, the animation is paused. So 'animateScene()' is called
    // in a browser controlled loop.
    requestAnimationFrame(animateScene);
    // Map the 3D scene down to the 2D screen (render the frame)
    renderScene();
}

/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
function renderScene(){
    renderer.render(scene, camera);
}