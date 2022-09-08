import * as three from "./build/three.module.js"
import Stats from './jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from './jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './jsm/lights/RectAreaLightUniformsLib.js';


const pi = Math.PI;
var scene = new three.Scene();
RectAreaLightUniformsLib.init();
var camera = new three.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);


var renderer = new three.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xcccccc);
renderer.setSize( window.innerWidth,window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

var blockGeo = new three.BoxGeometry(4,4,4);
var sphereGeo = new three.SphereGeometry(4,20,20);
var material = new three.MeshStandardMaterial({color: 0xffffff,wireframe: false,roughness:0});

var block = new three.Mesh(blockGeo,material);
var sphere = new three.Mesh(sphereGeo,material);
sphere.position.set(5,4,-10);
block.position.y = 2
block.castShadow = true;
sphere.castShadow = true;


scene.add(block);
scene.add(sphere);




var axes = new three.AxesHelper(20);
scene.add(axes);

var groundGrometry = new three.PlaneGeometry(60,20);
var groundMeterial = new three.MeshStandardMaterial({color:0x123456,roughness:0.01});
var ground = new three.Mesh(groundGrometry,groundMeterial);
ground.rotation.x = -0.5 *pi;
ground.receiveShadow = true;
ground.position.set(15,0,0);


scene.add(ground);
var spotlight = new three.SpotLight(0xffffff,0.01);
spotlight.position.set(40,60,-10);
spotlight.castShadow = true;
spotlight.shadow.mapSize = new three.Vector2(1024,1024);
spotlight.shadow.camera.far = 130;
spotlight.shadow.camera.near = 40;
scene.add(spotlight);

var areaLightRed = new three.RectAreaLight(0xff0000,5,4,10);
areaLightRed.position.set(-5,5,5);

var areaLightBlue = new three.RectAreaLight(0x0000ff,5,4,10);
areaLightBlue.position.set(5,5,5);

scene.add(areaLightRed);
scene.add(areaLightBlue);
scene.add(new RectAreaLightHelper(areaLightRed))
scene.add(new RectAreaLightHelper(areaLightBlue))

//var planLightIndicatorGeo = new three.PlaneGeometry(4,10);
//var planeMaterial = new three.MeshStandardMaterial({color:0x66ccff,specular:0x66ccff,shininess:200});
//var lightIndicator = new three.Mesh(planLightIndicatorGeo,planeMaterial);
//scene.add(lightIndicator);
//lightIndicator.position.set(-5,10,0);




camera.position.set(-30,40,30);
camera.lookAt(scene.position);

function initStats() {

	var stats = new Stats();

	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.getElementById("Stats-output").appendChild(stats.domElement);

	return stats;
}
var stats = initStats();
var gui = new GUI();

var guicontrols = {
	rotationSpeed: 0.01,
	isRotating: false,
	toggleMove: function(){this.isRotating = !this.isRotating}
}
gui.add(guicontrols, 'rotationSpeed', 0, 0.5);
gui.add(guicontrols, 'toggleMove');

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

scene.fog = new three.FogExp2(0xffffff,0.01)

function animate() {
	stats.update();
	requestAnimationFrame( animate );
	if(guicontrols.isRotating){
		block.rotation.y += guicontrols.rotationSpeed;
	}
	renderer.render( scene, camera );


}

animate();