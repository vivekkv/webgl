var globe,
    globeCount = 0;

function createGlobe() {

    var newData = [];
    globeCount++;

    $("#globe canvas").remove();
    newData = data.slice();

    globe = new ENCOM.Globe(window.innerWidth, window.innerHeight, {
        font: "poppins",
        data: newData, // copy the data array
        tiles: grid.tiles,
        baseColor: "#ed0b0b",
        markerColor: "blue",
        pinColor: "#c43838",
        satelliteColor: "blue",
        waveColor: "red",
        introLinesColor: "red"
        // scale: 10,
        // dayLength: 1000 * 1,
        // introLinesDuration: 100,
        // maxPins: 10,
        // maxMarkers: 1,
        // viewAngle: 100
    });

    $("#globe").append(globe.domElement);
    globe.init(start);
}

function onWindowResize() {
    globe.camera.aspect = window.innerWidth / window.innerHeight;
    globe.camera.updateProjectionMatrix();
    globe.renderer.setSize(window.innerWidth, window.innerHeight);

}

function projectionToLatLng(width, height, x, y) {

    return {
        lat: 90 - 180 * (y / height),
        lon: 360 * (x / width) - 180,
    };

}

function animate() {

    if (globe) {
        globe.tick();
    }

    lastTickTime = Date.now();

    requestAnimationFrame(animate);
}

function start() {

    if (globeCount == 1) {

        animate();

        // /* add pins at random locations */
        // setInterval(function () {
        //     if (!globe) {
        //         return;
        //     }

        //     var lat = Math.random() * 180 - 90,
        //         lon = Math.random() * 360 - 180,
        //         name = "Test " + Math.floor(Math.random() * 100);

        //     globe.addPin(lat, lon, name);

        // }, 5000);
    }
}


$(function () {

    var open = false;

    if (!Detector.webgl) {

        Detector.addGetWebGLMessage({ parent: document.getElementById("container") });
        return;
    }

    window.addEventListener('resize', onWindowResize, false);
    createGlobe();
});
