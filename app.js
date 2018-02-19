var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera(45, (window.innerWidth / window.innerHeight), 1, 1000);
camera.position.set( 0, 0, 100 );
camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

var geometry = new THREE.Geometry();
var material = new THREE.LineBasicMaterial( {
	color: 0xfff,
	linewidth: 100,
	linecap: 'round', 
	linejoin:  'round' 
} );

geometry.vertices.push(new THREE.Vector3(-90, 40, 0));
geometry.vertices.push(new THREE.Vector3(-55, 40, 0));
geometry.vertices.push(new THREE.Vector3(-55, -35, 0));
geometry.vertices.push(new THREE.Vector3(-90, -35, 0));
geometry.vertices.push(new THREE.Vector3(-90, 40, 0));
var line = new THREE.Line( geometry, material );




//scene.add(text);
scene.add(line);
renderer.render(scene, camera);