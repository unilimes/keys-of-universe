var timeTest = function (call, p1, p2, p3, p4) {
    var start = new Date();
    call(p1, p2);
    console.log(new Date() - start);
}

/* check spriteCreator  = 230 millisecondes**/
/*new timeTest(function () {
    for (var i = 0; i < 1000; i++) {
        App.utils.interfaces.createSprite(400, {fontsize: 27});
    }
});*/

/*check cubes creator = 521-710 milliseconds*/
new timeTest(function () {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000})),
        helper = new THREE.Object3D();
    App.rebuildCubes.add(helper, cube);
});