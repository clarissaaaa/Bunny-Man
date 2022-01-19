var canvas = document.getElementById("render");
var engine = new BABYLON.Engine(canvas, true);

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        // Do not add a loading screen if there is already one
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "Bunny Man is loading...";
    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: black;
        position:relative;
        color: white;
        font-size:50px;
        text-align:center;
        vertical-align: center;
        top: 50%;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("scene is now loaded");
}

// var textScreenTime = 8;
// var isTextStillOnScreen = false;
// for (let y = 0; y < textScreenTime; y++){
//     isTextStillOnScreen = true;
//     document.getElementById('textTimer').innerHTML = "Looks like someone is here..."+ textScreenTime;
//     if (y >= textScreenTime)
//     {
//        document.getElementById('textTimer').innerHTML = "";                  
//        isTextStillOnScreen = false;
//     }
// }   

var createScene = function() {
    engine.enableOfflineSupport = false;
    engine.displayLoadingUI();
    
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
    camera.fov = 0.8;
    camera.attachControl(canvas, true);

    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    // Light Do Later
    var cameraSpotlight = new BABYLON.SpotLight("CameraSpotLight", new BABYLON.Vector3(0.01, 0.01, 0.01), new BABYLON.Vector3(.1, .1, .1), 1, 100, scene);
    cameraSpotlight.setDirectionToTarget(BABYLON.Vector3.Zero());
    cameraSpotlight.intensity = 2;
    cameraSpotlight.range = 70;

    var directionalLight = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, -1, 0), scene); 
    directionalLight.intensity = 0.2; // above this intensity just make it super bright but if you cant see anything just up this

    // Flashlight 
    scene.onBeforeRenderObservable.add(()=>{
        cameraSpotlight.position = camera.position;
        cameraSpotlight.setDirectionToTarget(camera.getFrontPosition(1))
    })

    // Wall so player don't fall off
    var wallBack = BABYLON.MeshBuilder.CreateBox("BackBox", {width: 100, height: 20});
    wallBack.position = new BABYLON.Vector3(0, 0, -40);
    wallBack.checkCollisions = true;
    wallBack.isVisible = false;

    var wallLeft = BABYLON.MeshBuilder.CreateBox("LeftBox", {width: 400, height: 20});
    wallLeft.position = new BABYLON.Vector3(-40, 0, 0);
    wallLeft.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
    wallLeft.checkCollisions = true;
    wallLeft.isVisible = false;

    var wallFront = BABYLON.MeshBuilder.CreateBox("FrontBox", {width: 100, height: 20});
    wallFront.position = new BABYLON.Vector3(0, 0, 160);
    wallFront.checkCollisions = true;
    wallFront.isVisible = false;

    var wallRight = BABYLON.MeshBuilder.CreateBox("RightBox", {width: 400, height: 20});
    wallRight.position = new BABYLON.Vector3(40, 0, 0);
    wallRight.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
    wallRight.checkCollisions = true;
    wallRight.isVisible = false;


    // Ground
    var grassMaterial = new BABYLON.StandardMaterial("bawl", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture("textbawl", 1000, scene);
    grassMaterial.ambientTexture = grassTexture;

    var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 1000, height: 1000, subdivisions: 4}, scene);
    ground.checkCollisions = true;
    ground.receiveShadows = true;
    ground.material = grassMaterial;
    
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

    // Fire
    var Fire = BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {
        for(const sys of set.systems) {
            sys.minScaleX = .3;
            sys.maxScaleX = .3;
            sys.minScaleY = .3;
            sys.maxScaleY = .4;
            sys.minEmitBox = new BABYLON.Vector3  (0, 0, 0);
            sys.maxEmitBox = new BABYLON.Vector3  (0, 0, 0);
        }

        set.start(new BABYLON.Vector3(2, 1, 10));
    });

    // Sound effects Havent find a way to know if audio is playing
    var backgroundMusic = new BABYLON.Sound("music", "./Audio/BackgroundNight.mp3", scene, soundReady, {loop:true, volume: 0.5});
    var noWay = new BABYLON.Sound("music", "./Audio/refusal_2_sean.wav", scene, {volume: 0.3});
    var Scream = new BABYLON.Sound("music", "./Audio/shouting_4_sean.wav", scene, {volume: 0.1});

    // How to call the sound effects
    function soundReady() {
        backgroundMusic.play();
    }

    var audioIsPlaying = false;
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // var endingBox = BABYLON.MeshBuilder.CreateBox("endingBox", {width: 40, height: 20});
    // endingBox.position = new BABYLON.Vector3(0, 0, 150);
    // endingBox.checkCollisions = true;

    

    // Load all model below
    const campFire = BABYLON.SceneLoader.ImportMeshAsync("", "./Model/campFire/", "campFire.obj", scene).then ((result) => {          
        var campFire = result.meshes[0];
        campFire.position = new BABYLON.Vector3(2, 0, 10);

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
        
        // For text
        campFire.checkCollisions = true;

        // camera.onCollide = function(x) {
        //     if(x == campFire) {
        //         noWay.play()
        //     }
        // }                    
    });

    const PoliceCar = BABYLON.SceneLoader.ImportMeshAsync("", "./Model/Car/", "PoliceCar.obj", scene).then ((result) => {          
        for(let i = 0; i < result.meshes.length; i++){
            var policeCar = result.meshes[i];
            policeCar.rotation.y += 0.8;
            policeCar.position = new BABYLON.Vector3(10, 0, -25);   
            policeCar.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);           
        }          
    });

    const Bridge = BABYLON.SceneLoader.ImportMeshAsync("", "./Model/Bridge/", "bridge.obj", scene).then ((result) => {    
        //console.log(result);
        for(let i = 0; i < result.meshes.length; i++){
            var bridge = result.meshes[i];
            bridge.position = new BABYLON.Vector3(0, 0, 150);
            bridge.scaling = new BABYLON.Vector3(1, 1, 1);
            bridge.checkCollisions = true;
        }

        // add creepy light
        var bridgeLight = new BABYLON.PointLight("bridgeLight", new BABYLON.Vector3(0, 6, 0), scene);
        bridgeLight.parent = bridge;
        bridgeLight.range = 30;
        bridgeLight.diffuse = new BABYLON.Color3(1, 0, 0);
        bridgeLight.specular = new BABYLON.Color3(1, 0, 0);
    });

    const hangedRabbit = BABYLON.SceneLoader.ImportMesh("", "./Model/Hunged rabbit/", "ded.obj", scene, 
        function(newMeshes) {
            var meshes = [];
            newMeshes.forEach(function (mesh) {
                if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)){
                    console.log("problems with: " + mesh.name);
                } else {
                    meshes.push(mesh);
                }
            })

        var dedRabbit = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        dedRabbit.scaling = new BABYLON.Vector3(.5, .5, .5);
        dedRabbit.position = new BABYLON.Vector3(0, 2, 150);    
        dedRabbit.checkCollisions = true;
        camera.onCollide = function(x) {
            if(x == dedRabbit) {
                console.log("suppose to work");
                Scream.play();
                window.location.href = "index.html";
            }
        }                    
    });
    
    // This is clump of trees so need to import many to look like a forest :v

    // Right side of forest
    for (let i = 0; i < 10; i++){
        BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
        function(newMeshes) {
            var meshes = [];
            newMeshes.forEach(function (mesh) {
                if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)){
                    console.log("problems with: " + mesh.name);
                } else {
                    meshes.push(mesh);
                }
            })

            var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);            
            forest.receiveShadows = true;
            forest.position = new BABYLON.Vector3(10 * (i + 1), 0, 20 + i);
        })
    }

    // Left side of forest
    for (let i = 0; i < 10; i++){
        BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
        function(newMeshes) {
            var meshes = [];
            newMeshes.forEach(function (mesh) {
                if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)){
                    console.log("problems with: " + mesh.name);
                } else {
                    meshes.push(mesh);
                }
            })

            var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);            
            forest.receiveShadows = true;
            forest.position = new BABYLON.Vector3(-20 - (10 * i), 0, 20 + i);
        })
    }

    const forestPath = 7;
    for (let i = 0; i < forestPath; i++){
        BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
        function(newMeshes) {
            var meshes = [];
            newMeshes.forEach(function (mesh) {
                if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)){
                    console.log("problems with: " + mesh.name);
                } else {
                    meshes.push(mesh);
                }
            })

            var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);            
            forest.receiveShadows = true;
            forest.position = new BABYLON.Vector3(10, 0, 20 * (i + 1));
        })
    }

    for (let i = 0; i < forestPath; i++){
        BABYLON.SceneLoader.ImportMesh("", "./Model/Tree/", "clumpOfTrees.glb", scene, 
        function(newMeshes) {
            var meshes = [];
            newMeshes.forEach(function (mesh) {
                if (!mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)){
                    console.log("problems with: " + mesh.name);
                } else {
                    meshes.push(mesh);
                }
            })

            var forest = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);            
            forest.receiveShadows = true;
            forest.position = new BABYLON.Vector3(-20, 0, 20 * (i + 1));
            engine.hideLoadingUI(); // Since this will be the last model loaded it should hide the UI 
        })
    }

    // Do skybox
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
    //console.log(camera.inputs);

    // Making WASD for movement
    scene.onBeforeRenderObservable.add(() => {
        camera.inputs.attached.keyboard.keysUp[0] = 87;
        camera.inputs.attached.keyboard.keysLeft[0] = 65;
        camera.inputs.attached.keyboard.keysRight[0] = 68;
        camera.inputs.attached.keyboard.keysDown[0] = 83;

    });    
    
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