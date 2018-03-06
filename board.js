var scene, camera, controls, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container, materials = [], color;
var floor, fan, isBlowing = false;
var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = { 'x': 0, 'y': 0 }; dist = 0;
var group = null;

function init() {

    group = new THREE.Group();
    scene = new THREE.Scene();
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 70;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.z = 800;
    camera.position.y = -300;

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

    floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1300, 600), 
        new THREE.MeshBasicMaterial({ color: 0x000000 }));
    group.add(floor);
    group.rotation.x = -Math.PI / 5;
}

function animateFrame() {

    render();
    ////requestAnimationFrame(animateFrame);
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

    camera.position.x += (mousePos.x - camera.position.x) * 0.05;
    camera.position.y += (mousePos.y - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    scene.add(group)

    if (controls) controls.update();
    renderer.render(scene, camera);
}

function addBoxGeometry() {

    let colorCode = 0xffffff;
    let cubeDepth = 300;
    let width = 80;
    let topX = -580;
    let topY = 220;
    let data = [[60, 50, 100],
    [60, 50, 180],
    [60, 50, 220],
    [60, 50, 260]];

    var fontColor = { r: 255, g: 255, b: 0, a: 1.0 };

    data.forEach((box) => {

        var geometry = new THREE.BoxGeometry(box[0], box[1], box[2]);
        var material = new THREE.MeshBasicMaterial({ color: colorCode });
        //var material = new THREE.MeshLambertMaterial({color: 0xffffffff});
        var cube = new THREE.Mesh(geometry, material);

        cube.position.x = topX;
        cube.position.y = topY;

        group.add(cube);

        var spritey = makeTextSprite('20', 0x00000);
        spritey.position.x = topX + 40;
        spritey.position.y = topY - 40;
        spritey.position.z = 30;
        group.add(spritey);

        topX += 100;
    });

    var light = new THREE.PointLight(0xffffffff);
    light.position.set(-150, 100, 500);
    scene.add(light);
}

function getRandom(min, max) {

    return Math.round(Math.random() * (max - min) + min);
}

function makeTextSprite(message, fontColor, materialColor) {

    var fontface = "poppins";
    var fontsize = 80;
    var borderThickness = 2;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var backgroundColor = {
        r: 255,
        g: 255,
        b: 255,
        a: 0.0
    };

    context.font = "bold " + fontsize + "px " + fontface;

    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle = "#0e3b84";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        color: materialColor != undefined ? materialColor : 0xffffff,
    });

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 50, 1.0);
    return sprite;
}


init();
createFloor();
addBoxGeometry();
animateFrame();
