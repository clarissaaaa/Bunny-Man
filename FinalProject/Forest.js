var canvas = document.getElementById("render");
var engine = new BABYLON.Engine(canvas, true);
var createScene = function() {
    engine.enableOfflineSupport = false;
    
    const scene = new BABYLON.Scene(engine);

    Ammo().then(() => {
        scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.AmmoJSPlugin());
    });

    // Gravity
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    // Camera
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -20), scene);
    camera.speed = 0.3;
    camera.minZ = 0;
    camera.attachControl(canvas, true);

    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // Light Do Later
    var cameraSpotlight = new BABYLON.SpotLight("CameraSpotLight", new BABYLON.Vector3(0.01, 0.01, 0.01), new BABYLON.Vector3(.1, .1, .1), 1, 100, scene);
    cameraSpotlight.setDirectionToTarget(BABYLON.Vector3.Zero());
    cameraSpotlight.intensity = 2;
    cameraSpotlight.range = 200;

    var directionalLight = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, 20, -30), scene); // Find out how this work first and then 
    directionalLight.intensity = 0.4;

    scene.onBeforeRenderObservable.add(()=>{
        cameraSpotlight.position = camera.position;
        cameraSpotlight.setDirectionToTarget(camera.getFrontPosition(1))
    })

    // Wall so player don't fall off
    var wallLeft = BABYLON.MeshBuilder.CreateBox("LeftBox", {width: 20, height: 20});
    wallLeft.position = new BABYLON.Vector3(0, 0, 5);
    wallLeft.rotation.y = 25;
    wallLeft.checkCollisions = true;

    // Ground
    var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 80, height: 80, subdivisions: 4}, scene);
    ground.checkCollisions = true;
    ground.receiveShadows = true;
        
    // Set up new rendering pipeline
    var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene);

    // Tone mapping
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    scene.imageProcessingConfiguration.exposure = 1;

    // Bloom
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 1;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;

    // Fire!
    var Fire = BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {
        for(const sys of set.systems) {
            sys.minScaleX = .3;
            sys.maxScaleX = .3;
            sys.minScaleY = .3;
            sys.maxScaleY = .4;
            sys.minEmitBox = new BABYLON.Vector3  (0, 0, 0);
            sys.maxEmitBox = new BABYLON.Vector3  (0, 0, 0);
        }

        set.start(new BABYLON.Vector3(0, 1, 10));
    });

    // Load all model below

    const campFire = BABYLON.SceneLoader.ImportMeshAsync("", "./Model/campFire/", "campFire.obj", scene).then ((result) => {          
        var campFire = result.meshes[0];
        campFire.position = new BABYLON.Vector3(0, 0, 10);

        var campfireLight = new BABYLON.PointLight("campfireLight", new BABYLON.Vector3(0, 4, 0), scene);
        campfireLight.parent = campFire;
        campfireLight.range = 7;
        campfireLight.diffuse = new BABYLON.Color3(1, 0.2, 0);
        campfireLight.specular = new BABYLON.Color3(0, 0, 0);
        
        // For the MTL
        var wonderfulMtl = new BABYLON.StandardMaterial("yeah", scene);
        wonderfulMtl.diffuseTexture = new BABYLON.Texture("./Model/campFire/campBaseColor.png", scene);

        // Yes
        campFire.material = wonderfulMtl;                    
    });
    
    // This is clump of trees so need to import many to look like a forest :v

    // This is going to be right side of the forest
    const forestRight1 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(10, 0, 20);
    })

    const forestRight2 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(20, 0, 18);
    })

    const forestRight3 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(30, 0, 22);
    })

    // This is going to be left side of the forest
    const forestLeft1 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(-20, 0, 20);
    })

    const forestLeft2 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(-30, 0, 18);
    })

    const forestLeft3 = BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
    function(newMeshes) {
        var meshes = [];
        newMeshes.forEach(function (mesh) {
            if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)) {
                console.log("problems with: " + mesh.name);
            } else {
                meshes.push(mesh);
            }
        });

        var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        forest.checkCollisions = true;
        forest.position = new BABYLON.Vector3(-40, 0, 22);
    })

    // Do skybox here
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Model/Skybox/DarkishSpace/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

    // For reference

    // px = Left
    // nx = Right
    // py = Top
    // ny = Bottom
    // pz = Back
    // nz = Front

    // Controlls
    
    // For player pointerlock
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    // scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("textures/environment.env", scene);

    return scene;
}
var scene = createScene();
engine.runRenderLoop(function() {
    scene.render();
});
window.addEventListener("resize", function() {
    engine.resize();
});