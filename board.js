var scene, camera, controls, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container, materials = [], color;
var floor, fan, isBlowing = false;
var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = { 'x': 0, 'y': 0 }; dist = 0;

function init() {

    scene = new THREE.Scene();
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.z = 800;
    camera.position.y = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    document.addEventListener('mousemove', onDocumentMouseMove, false);

}

function createFloor() {

    floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(900, 500), new THREE.MeshBasicMaterial({ color: 0xebe5e7 }));
    floor.rotation.x = -Math.PI / 3;
    floor.position.y = -50;
    floor.receiveShadow = true;
    scene.add(floor);

    floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(900, 500), new THREE.MeshBasicMaterial({ color: 0xebe5e7 }));
    // floor.rotation.x = -Math.PI / 3;
    floor.position.y = 100;
    floor.receiveShadow = true;
    scene.add(floor);
}

function createFan() {

    fan = new Fan();
    fan.threegroup.position.z = 350;
    scene.add(fan.threegroup);
}

Fan = function () {

    this.isBlowing = false;
    this.speed = 0;
    this.acc = 0;

    this.redMat = new THREE.MeshLambertMaterial({ color: 0xad3525, shading: THREE.FlatShading });
    this.greyMat = new THREE.MeshLambertMaterial({ color: 0x653f4c, shading: THREE.FlatShading });
    this.yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdd276, shading: THREE.FlatShading });

    var coreGeom = new THREE.BoxGeometry(10, 10, 200);
    var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
    var propGeom = new THREE.BoxGeometry(3, 30, 2);

    propGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));
    this.core = new THREE.Mesh(coreGeom, this.greyMat);

    // propellers
    var prop1 = new THREE.Mesh(propGeom, this.redMat);
    prop1.position.z = 15;

    var prop2 = prop1.clone();
    prop2.rotation.z = Math.PI / 2;

    var prop3 = prop1.clone();
    prop3.rotation.z = Math.PI;

    var prop4 = prop1.clone();
    prop4.rotation.z = -Math.PI / 2;

    var prop5 = prop1.clone();
    prop5.rotation.z = 11.8;

    this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
    this.sphere.position.z = 15;

    this.propeller = new THREE.Group();
    this.propeller.add(prop1);
    this.propeller.add(prop2);
    this.propeller.add(prop3);
    this.propeller.add(prop4);
    //this.propeller.add(prop5);

    this.threegroup = new THREE.Group();
    this.threegroup.add(this.core);
    this.threegroup.add(this.propeller);
    this.threegroup.add(this.sphere);

}

Fan.prototype.update = function (xTarget, yTarget) {


    this.threegroup.lookAt(new THREE.Vector3(0, 80, 60));
    this.tPosX = rule3(xTarget, -200, 200, -250, 250);
    this.tPosY = rule3(yTarget, -200, 200, 250, -250);

    this.threegroup.position.x += (this.tPosX - this.threegroup.position.x) / 10;
    this.threegroup.position.y += (this.tPosY - this.threegroup.position.y) / 10;

    this.targetSpeed = (this.isBlowing) ? .3 : .01;

    if (this.isBlowing && this.speed < .5) {

        this.acc += .001;

        this.speed += this.acc;
    }
    else if (!this.isBlowing) {

        this.acc = 0;
        this.speed *= .98;

    }

    this.propeller.rotation.z += this.speed;

}

function loop() {

    render();
    requestAnimationFrame(loop);
    fan.update();
}

function createParticles() {

    var geometry = new THREE.Geometry();

    for (i = 0; i < 100; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;
        geometry.vertices.push(vertex);

    }

    parameters = [
        [[1, 1, 0.5], 5],
        [[0.95, 1, 0.5], 4],
        [[0.90, 1, 0.5], 3],
        [[0.80, 1, 0.5], 1]
    ];

    var time = Date.now() * 0.00005;


    for (i = 0; i < parameters.length; i++) {

        color = parameters[i][0];
        size = parameters[i][1];

        materials[i] = new THREE.PointsMaterial({ size: size });

        color = parameters[i][0];
        h = (360 * (color[0] + time) % 360) / 360;
        materials[i].color.setHSL(0000, 0000, 0000);

        particles = new THREE.Points(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add(particles);
    }
}

function onDocumentMouseMove(event) {

    mousePos.x = event.clientX - windowHalfX;
    mousePos.y = event.clientY - windowHalfY;
}

function render() {

    if (controls) controls.update();
    renderer.render(scene, camera);
}

init();
createFloor();
createFan();
//createParticles();
loop();