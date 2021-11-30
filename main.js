import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { PointerLockControls } from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
scene.background = new THREE.Color(0xffffff);
renderer.setSize(innerWidth, innerHeight);

cam.position.z = 5;
cam.position.y = 7;

document.body.appendChild(renderer.domElement);
var directionalLight = new THREE.DirectionalLight({color:0xFFFFFF, intensity: 100});
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

let grid = new THREE.GridHelper(100, 20, 0x0a0a0a, 0x0a0a);
grid.position.set(0, -0.5, 0);
scene.add(grid);

let controls = new PointerLockControls(cam, renderer.domElement);
let clock = new THREE.Clock();

const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function() {
    controls.lock();
})

controls.addEventListener('lock', function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
})

controls.addEventListener('unlock', function() {
    instructions.style.display = "block";
    blocker.style.display = "";
})

let keyboard = [];

addEventListener("keydown", (e) => {
    keyboard[e.key] = true;
});

addEventListener("keyup", (e) => {
    keyboard[e.key] = false;
});

function processKeyboard() {
    var speed = 0.2;
    if (keyboard['w']){
        controls.moveForward(speed);
    }
    if (keyboard['s']){
        controls.moveForward(-speed);
    }
    if(keyboard['a']){
        controls.moveRight(-speed);
    }
    if(keyboard['d']){
        controls.moveRight(speed);
    }
}

function drawScene() {
    renderer.render(scene, cam);
    processKeyboard();
    requestAnimationFrame(drawScene);
}

drawScene();