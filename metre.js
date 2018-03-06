var scene, camera, fanGroup, fan;
let fieldOfView = 70;
let nearPlane = 1;
let farPlane = 2000;
let height = window.innerHeight;
let width = window.innerWidth;
let blades = [[[0, 0, 0], [0, 10, 0]]];

function init() {

    group = new THREE.Group();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fieldOfView, (width / height), nearPlane, farPlane);

    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = -90;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.getElementById('metre').appendChild(renderer.domElement);
}

function render() {
    scene.add(group)
    renderer.render(scene, camera);
}

function createFan() {
    fan = new Fan();
    fan.threegroup.position.z = 350;
    fan.threegroup.rotation.z = -300;
    scene.add(fan.threegroup);
}


function animate() {
    render();
    requestAnimationFrame(animate);
    fan.update();
}

function updateFanControls() {

    // var maxRotation = Math.PI * 2;
    // triangle.rotation.z += 0.04;

    // if (triangle.rotation.z >= maxRotation) {
    //     triangle.rotation.z = 0;
    // }
}

function addGeometry() {

    var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 10 });
    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));

    let line = new THREE.Line(geometry, material);
    group.add(line);

    var radius = 10,
        segments = 1000,
        material = new THREE.LineBasicMaterial({ color: 0x0000ff }),
        geometry = new THREE.CircleGeometry(radius, segments);

    // Remove center vertex
    geometry.vertices.shift();
    scene.add(new THREE.Line(geometry, material));
}


Fan = function () {

    this.isBlowing = false;
    this.speed = 0;
    this.acc = 0;

    this.redMat = new THREE.MeshLambertMaterial({
        color: 0xad3525,
        shading: THREE.FlatShading
    });

    this.greyMat = new THREE.MeshLambertMaterial({
        color: 0x653f4c,
        shading: THREE.FlatShading
    });

    this.yellowMat = new THREE.MeshLambertMaterial({
        color: 0xfdd276,
        shading: THREE.FlatShading
    });

    var coreGeom = new THREE.BoxGeometry(10, 10, 20);
    var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
    var propGeom = new THREE.BoxGeometry(10, 30, 2);

    propGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));
    this.core = new THREE.Mesh(coreGeom, this.greyMat);

    var prop1 = new THREE.Mesh(propGeom, this.redMat);
    prop1.position.z = 15;
    
    var prop2 = prop1.clone();
    prop2.rotation.z = Math.PI / 2;
    var prop3 = prop1.clone();
    prop3.rotation.z = Math.PI;
    var prop4 = prop1.clone();
    prop4.rotation.z = -Math.PI / 2;

    this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
    this.sphere.position.z = 15;

    this.propeller = new THREE.Group();
    this.propeller.add(prop1);
    this.propeller.add(prop2);
    this.propeller.add(prop3);
    this.propeller.add(prop4);

    this.threegroup = new THREE.Group();
    this.threegroup.add(this.core);
    this.threegroup.add(this.propeller);
    this.threegroup.add(this.sphere);

    this.threegroup.rotation.x = -Math.PI /3;
}

Fan.prototype.update = function (xTarget, yTarget) {
    this.propeller.rotation.z += 0.1;
}

init();
//  addGeometry();
createFan();
render();
animate();