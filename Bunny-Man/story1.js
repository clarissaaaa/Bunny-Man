import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('canvas')})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera)

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)


// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true;
// controls.campingFactor = 0.25;
// controls.enableZoom = true;


const loader = new GLTFLoader()
loader.load( './images/photo1/scene.gltf', function ( gltf ) {
    const photo = gltf.scene.children[0]
    photo.scale.set(0.1,0.1,0.1)
    photo.position.z = -5
    photo.position.x = 1.5
    photo.position.y = 0
    photo.rotation.z = .5
    photo.rotation.x = 0
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

loader.load( './images/camera/scene.gltf', function ( gltf ) {
  const photo = gltf.scene.children[0]
  photo.scale.set(0.007,0.007,0.007)
  photo.position.z = 3
  photo.position.x = 2.5
  photo.position.y = 0
  photo.rotation.z = -0.5
  photo.rotation.x = 21
  photo.rotation.y = 3
scene.add( gltf.scene );
}, undefined, function ( error ) {
console.error( error );
} );

loader.load( './images/photo2/scene.gltf', function ( gltf ) {
    const photo = gltf.scene.children[0]
    photo.scale.set(0.04,0.04,0.04)
    photo.position.z = 3.5
    photo.position.x = 1
    photo.position.y = -0.5
    photo.rotation.z = 1
    photo.rotation.x = 0
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

loader.load( './images/bunny/scene.gltf', function ( gltf ) {
  const photo = gltf.scene.children[0]
  photo.scale.set(0.001,0.001,0.001)
  photo.position.z = 8
  photo.position.x = 1.5
  photo.position.y = -0.5
  photo.rotation.z = 20
  photo.rotation.x = 5
  photo.rotation.y = 6
scene.add( gltf.scene );
}, undefined, function ( error ) {
console.error( error );
} );

loader.load( './images/bunny/scene.gltf', function ( gltf ) {
  const photo = gltf.scene.children[0]
  photo.scale.set(0.001,0.001,0.001)
  photo.position.z = 8
  photo.position.x = 1.5
  photo.position.y = -0.5
  photo.rotation.z = 20
  photo.rotation.x = 5
  photo.rotation.y = 6
scene.add( gltf.scene );
}, undefined, function ( error ) {
console.error( error );
} );

loader.load( './images/photo3/scene.gltf', function ( gltf ) {
  const photo = gltf.scene.children[0]
  photo.scale.set(0.1,0.1,0.1)
  photo.position.z = 9
  photo.position.x = -4.5
  photo.position.y = -1.5
  photo.rotation.z = 1
  photo.rotation.x = 6
  photo.rotation.y = 1
scene.add( gltf.scene );
}, undefined, function ( error ) {
console.error( error );
} );

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  }

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
    requestAnimationFrame(animate)
    //controls.update();
    renderer.render (scene, camera)
}

animate()