/**
 * Initialising  global variables
 */

var App = App || {}, offset = new THREE.Vector3(), sprite = false;
var lastCheck = {
    point: [],
    angle: [],
    square: [],
    addEl: function (name, val, lastVal) {
        for (var i = 0; i < lastVal.length; i++) {
            if (lastVal[i].name = name) {
                lastVal[i].value = val;
                return;
            }
        }
        lastVal.push({name: name, value: val});
    },
    getEl: function (name, lastVal) {
        for (var i = 0; i < lastVal.length; i++) {
            if (lastVal[i].name = name) {
                return lastVal[i].value;
            }
        }
    }
};

App.remote = {
    url: "assets/api/router.php",
    data: false,
    add: function (data, type) {
        if (data && data.name && type) {
            var arr = data.name.split(' ');
            data.name = arr[0] + '_' + App.remote.getUniqueName(arr[1]);
            $.ajax({
                url: App.remote.url,
                method: "POST",
                data: {method: 'saveF', type: type, data: data, name: data.name},
                dataType: "html"
            }).done(function (msg) {
                console.log(msg);
            }).fail(function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            });
        } else {
            console.log("nothing to send!!!");
        }

    },
    loadData: function (callBack) {
        //$.getJSON('assets/model/figure.json'
        //).done(function (data) {
        //        App.remote.data = data;
        //    }).fail(function () {
        //        console.log("error load fig data");
        //    }).always(function () {
        $.getJSON('assets/model/listOfKeys.json'
        ).done(function (data) {
                App.remote.listOfKeys = data;
            }).fail(function () {
                console.log("error load listOfKeys data");
            }).always(function () {
                callBack();
            });
        //});
    },
    checkIfAlreadyExist: function (name) {
        var arr = App.remote.data;
        name += "";
        if (name.length == 3 && arr instanceof Array) {
            for (var i = 0; i < arr.length; i++) {
                var curName = arr[i].name;
                if (curName && (curName.match(name[0]) && curName.match(name[1]) && curName.match(name[2]))) {
                    return arr[i];
                }
            }
        }
        return false;
    },
    getByName: function (names, callBack) {
        App.remote.data = App.utils.types.loaded = false;
        if (names && names.length > 3) {
            var fileName = App.remote.getUniqueName(names[0]);
            $.ajax({
                method: "POST",
                url: App.remote.url,
                data: {fileName: fileName, method: "getByName"}
            }).done(function (data) {
                var result = JSON.parse(data);
                if (result['error']) {
                    console.log(result['error']);
                } else {
                    console.log("load data succeses");
                    App.remote.data = JSON.parse((result['data']));
                }
            }).fail(function () {
                alert("error");
            }).always(function () {
                callBack();
            });
        } else {
            callBack();
        }
    },
    getUniqueName: function (str) {
        var newStr = str instanceof Array ? str : [parseInt(str[0]), parseInt(str[1]), parseInt(str[2])];
        for (var i = 0; i < newStr.length && i + 1 < newStr.length; i++) {
            for (var j = i; j < newStr.length; j++) {
                if ((newStr[i]) > (newStr[j])) {
                    var cur = newStr[i];
                    newStr[i] = newStr[j];
                    newStr[j] = cur;
                }
            }
        }
        return newStr[0] + "" + newStr[1] + "" + newStr[2];
    }

}

//prototypes
THREE.Mesh.prototype.building = function (arr, flag, objOfScene, flag1,flag2) {
    this.iter = 0;
    this.drawPoints = /*objOfScene.category == 'object2D' ? 1 : */arr.length;
    this.tooltip.visible = true;
    this.setScaling = 1.2;
    var currentObject = this, lastObj = App.utils.types.webgl.listObjOfScene[App.utils.types.webgl.listObjOfScene.length - 1];

    /**bang*/
    var geometry = new THREE.Geometry();
    geometry.vertices = currentObject.geometry.vertices;
    var materials = new THREE.PointsMaterial({size: 0.001});
    var particles = new THREE.Points(geometry, materials);
    particles.position.set(currentObject.position.x, currentObject.position.y, currentObject.position.z);
    objOfScene.add(particles);
    var bangTime = new Date().getTime() + 300, bang = setInterval(function () {
        if (new Date().getTime() > bangTime) {
            objOfScene.remove(particles);
            if (!flag) {
                currentObject.visible = true;
            } else {
                currentObject.dimensnP.visible = true;
            }
            clearInterval(bang);
        }
        currentObject.setScaling += 0.2;
        particles.scale.set(currentObject.setScaling, currentObject.setScaling, currentObject.setScaling)

    }, 100);

    /**building */
    if (flag && currentObject.isFirst) {
        //if(!arr[arr.length-1].isAn) {
        if (arr[0]) {
            settingsAn(arr[0]);
        } else if (arr[1]) {
            settingsAn(arr[1]);
        }
        //if (arr[arr.length - 2]) {
        //        arr[arr.length - 1].isAn = true;
        //        settingsAn(arr[arr.length - 2]);
        //    }
        //}else{
        //    if (arr[1])settingsAn(arr[1]);
        //}
    } else {

        $.each(arr, function (key, nextObject) {
            if (flag1) {
                if (key > 0) {
                    settingsAn(nextObject);
                }
            } else {
                settingsAn(nextObject);
            }

        });
    }

    function settingsAn(nextObject) {
        var tubeMaterial,
            newMatrl= new THREE.MeshBasicMaterial({color:'#ff0f0f'});// = currentObject.material;
        var pMaterial = new THREE.PointsMaterial({
            color: 0xfff000,
            size: 1.5,
            map: THREE.ImageUtils.loadTexture(
                "assets/img/particleA.png"
            ),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        var particlesGeo = new THREE.Geometry();

        particlesGeo.vertices.push(new THREE.Vector3(0, 0, 0));
        var pSystem = new THREE.Points(particlesGeo, pMaterial);
        pSystem.dynamic = true;
        pSystem.sortParticles = true;
        var vBegn = currentObject.position, tube;
        var vEnd = nextObject.position;
        var ne = nextObject;
        var curPoint = {
            vBegn: vBegn,
            vEnd: vEnd,
            someIt: 0,
            listLength: arr.length,
            keyP: 0,
            countOfPoints: currentObject.dst ? currentObject.dst : 80,
            buildTube: nextObject,
            endTrubeLight: pSystem
        };
        if (vBegn != vEnd) {
            var truba = false;// flag ? lastObj.helpers.getLineByPoint(vBegn, vEnd) : objOfScene.helpers.getTubeByPoint(vBegn, vEnd, false, flag);
            if(flag2){
                truba = objOfScene.parent?objOfScene.parent.helpers.getTubeByPoint(vBegn, vEnd, false, flag):false;
            }else if(flag){
                truba = lastObj.helpers.getLineByPoint(vBegn, vEnd);
            }else{
                truba = objOfScene.helpers.getTubeByPoint(vBegn, vEnd, false, flag);
            }
            if (truba && (!truba.visible ||  !truba.isBuild)) {
                if (!flag) {
                    truba.geometry =flag2?truba.geometry: App.utils.interfaces.tubeLineGeometry(vBegn, vBegn, flag);
                    truba.visible = true;
                }
                curPoint.truba = truba;
                truba.isBuild = true;
                tubeMaterial = flag2?newMatrl:truba.material;
                var timerH = flag ? flag : Math.getRandomArbitrary(20, 50);
                if(flag2)timerH=flag2;
                var intBuild = setInterval(function () {
                    objOfScene.add(curPoint.endTrubeLight);
                    return animateBuilding(curPoint)
                }, timerH);//
            }

            function animateBuilding(curPoint) {
                var vBegn = curPoint.vBegn;
                var vEnd = curPoint.vEnd;
                var endPointLlight = curPoint.endTrubeLight;
                if (flag)  objOfScene.remove(tube);

                if (curPoint.keyP > curPoint.countOfPoints) {
                    objOfScene.remove(endPointLlight);
                    curPoint.truba.visible = true;
                    currentObject.iter++;

                    clearInterval(intBuild);
                    if (currentObject.iter == currentObject.drawPoints || currentObject.isFirst) {
                        var isCurOvj = arr.indexOf(currentObject);
                        if (isCurOvj >= 0 || currentObject.isFirst) {
                            arr.shift();
                            //for 2ld ending animation
                            if(!arr.length){
                                if ( currentObject.isFirst && objOfScene._2dPnts.length > 3) {
                                    var copy2DPnts = objOfScene._2dPnts.concat([]),
                                        firstAn = copy2DPnts.shift();
                                    //copy2DPnts.push(firstAn);
                                    firstAn.isFirst = false;
                                    for (var js = 0; js < copy2DPnts.length; js++) {
                                        copy2DPnts[js].isFirst = false;
                                    }
                                    firstAn.building(copy2DPnts, flag, objOfScene, true);
                                }
                            }
                        }
                        if(currentObject.parent.pSystem){
                            currentObject.parent.pSystem.visible =true;
                        }

                    }
                    if(arr.length ==0 ){
                       var cur = App.utils.interfaces.getObjByName(objOfScene.name);
                        if(cur){
                            cur.sphere.material.opacity = 0.2;

                        }

                    }
                    ne.building(arr, flag, objOfScene,flag1,flag2);
                } else {
                    var enPpos = new THREE.Vector3(
                        (vEnd.x - vBegn.x) * ((curPoint.keyP) / curPoint.countOfPoints) + vBegn.x,
                        (vEnd.y - vBegn.y) * ((curPoint.keyP) / curPoint.countOfPoints) + vBegn.y,
                        (vEnd.z - vBegn.z) * ((curPoint.keyP++) / curPoint.countOfPoints) + vBegn.z
                    );
                    var tubeGeometry = flag1?App.utils.interfaces.tubeLineGeometry(vBegn, enPpos, flag,0.02):App.utils.interfaces.tubeLineGeometry(vBegn, enPpos, flag);
                    if (flag) {
                        tube = new THREE.Line(tubeGeometry, tubeMaterial);
                        objOfScene.add(tube);
                    } else if(flag2) {
                        tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                        objOfScene.add(tube);
                    }else {
                        curPoint.truba.geometry = tubeGeometry;
                    }
                    endPointLlight.position.set(enPpos.x, enPpos.y, enPpos.z);

                }
            }
        }
    }

};

THREE.Mesh.prototype.buildCircle = function (center, radius, bgnAngle, steps, speed) {
    var curObj = this, step = /*radius < 4 ? steps - (steps*0.05):*/steps,
        points = [], drawCount = 0,
        webglObj = App.utils.types.webgl,
        circleLine = new THREE.BufferGeometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            map: THREE.ImageUtils.loadTexture(
                "assets/img/particleA.png"
            ),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        }),
        particlesGeo = new THREE.Geometry(),
        rectMesh,
        timerH = speed;//countOfPnts * 50;
    particlesGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    var pSystem = new THREE.Points(particlesGeo, pMaterial);
    pSystem.dynamic = true;
    pSystem.sortParticles = true;
    //console.log(steps,step,radius);

    /*get points on circle*/
    var bgnAngle = Math.round(bgnAngle),
        _2Arc = false, curAng = bgnAngle + 0, byH = bgnAngle >= 0;
    if (bgnAngle >= 0) {
        curAng = 360 - curAng;
    } else {
        curAng += 180;
    }
    for (var i = curAng; i < (curAng + step + 361); i += step) {
        var x = center.x + Math.cos(i * (Math.PI / 180)) * radius,
            y = center.y + Math.sin(i * (Math.PI / 180)) * radius;
        points.push([x, y, center.z]);
    }
    /*build dunamic geometry**/
    var vertices = new Float32Array(points.length * 3);
    for (var is = 0; is < points.length; is++) {
        vertices[is * 3 + 0] = points[is][0];
        vertices[is * 3 + 1] = points[is][1];
        vertices[is * 3 + 2] = points[is][2];
    }
    circleLine.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    /* create line*/
    rectMesh = new THREE.Line(circleLine, new THREE.LineBasicMaterial());
    rectMesh.material.color = curObj.material.color;
    webglObj._2dConsist.add(rectMesh);
    webglObj._2dConsist.add(pSystem);
    drawCount = 0;
    //console.log(building);
    var timer = setInterval(function () {
        return drawCircle(curObj);

    }, timerH);// Math.getRandomArbitrary(50, 100)

    function drawCircle(curObj) {
        if (drawCount == points.length) {
            webglObj._2dConsist.remove(rectMesh);
            webglObj._2dConsist.remove(pSystem);
            curObj.visible = true;
            //console.warn('This bullshit was added after add animation for 2d circle!!!')
            clearInterval(timer);
        } else {
            circleLine.setDrawRange(0, drawCount + 1);
            pSystem.position.set(points[drawCount][0], points[drawCount][1], points[drawCount][2]);
            drawCount++;
        }
    }


}

CanvasRenderingContext2D.prototype.fillTextCircle = function (text, x, y, radius, startRotation) {

    var delta = 0;
    if(radius<130){
        delta =20;
    }else if(radius>130 && radius<270 ){
        delta =35;
    }else{
        delta =50;
    }
        var numDegreesPerLetter = Math.PI * (delta/radius) / text.length;
    this.save();
    this.translate(x, y);
    this.rotate(startRotation);

    for (var i = 0; i < text.length; i++) {
        this.save();
        this.translate(radius, 0);
//      if (i == 0) {
//          this.fillStyle = 'red';
        this.translate(10, -10);
//          this.fillRect(0,0,4,4);
        this.rotate(1.4)
        this.translate(-10, 10);
//          this.fillStyle = 'black';
//      }

//      this.fillRect(0,0,4,4);
        this.fillText(text[i], 0, 0);
        this.restore();
        this.rotate(numDegreesPerLetter);
    }
    this.restore();
}

/**
 * Objects creation
 */

App.rebuildCubes = {
    changeColorLittleCubes: function (val) {
        var cubeHelper = App.utils.types.webgl.cubeHelper.cubes, curObj;
        for (var i = 0; i < cubeHelper.children.length; i++) {
            cubeHelper.children[i].children[0].material.color.set(val);
        }
    },//change color for all little cubbes
    changeColorMainCube: function (val) {
        var cubeHelper = App.utils.types.webgl.cubeHelper, curObj;
        for (var i = 0; i < cubeHelper.children.length; i++) {
            curObj = cubeHelper.children[i];
            if (curObj.category && curObj.category == 'mainCube') {
                curObj.material.color.set(val);
                return;
            }
        }
    },//change color for main cubbe
    setVisibleForChild: function (val, childName) {
        var cubeHelper = App.utils.types.webgl.cubeHelper, curObj;
        if (childName == 'littleCube') {
            cubeHelper.cubes.visible = val;
        } else if (childName == 'cubeLabel') {
            cubeHelper.spriteCube.visible = val;
        }
    },//change visibility for all little cubbes
    add: function (cubeHelper, cube) {
        var spriteCreator = App.utils.interfaces.createSprite,
            obj = new THREE.Object3D(),
            cubes = obj.clone(),
            spriteCube = obj.clone();

        cubes.category = 'littleCube';
        cubes.visible = false;
        spriteCube.visible = false;
        spriteCube.category = 'cubeLabel';
        cubeHelper.add(cubes);
        cubeHelper.add(spriteCube);
        cubeHelper.cubes = cubes;
        cubeHelper.spriteCube = spriteCube;

        for (var i = -4; i < 6; i++) {
            //var littleCubeX = cube.clone();
            //var helperX = new THREE.BoxHelper(littleCubeX);
            //helperX.material.color.set(0x0000ff);
            //var objX = obj.clone();
            //objX.add(helperX);
            //objX.position.set(i, 0, 0);
            var spriteX = spriteCreator((i + 4) + '' + 0 + '' + 0, {fontsize: 27});
            spriteX.position.set(i - 0.5, 0, 0);
            spriteCube.add(spriteX);
            for (var j = -4; j < 6; j++) {
                var littleCubeY = cube.clone();
                var helperY = new THREE.BoxHelper(littleCubeY);
                helperY.material.color.set(0x0000ff);
                var objY = obj.clone();
                objY.add(helperY);
                objY.position.set(i, j, 0);
                if (i < 5 && j < 5) {
                    cubes.add(objY);
                }
                var spriteY = spriteCreator((i + 4) + '' + (j + 4) + '' + 0, {fontsize: 27});
                spriteY.position.set(i - 0.5, j - 0.5, 0);
                spriteCube.add(spriteY);
                for (var n = -4; n < 6; n++) {
                    var littleCubeZ = cube.clone();
                    var helperZ = new THREE.BoxHelper(littleCubeZ);
                    helperZ.material.color.set(0x0000ff);
                    var objZ = obj.clone();
                    objZ.add(helperZ);
                    objZ.position.set(i, j, n);
                    if (i < 5 && j < 5 && n < 5) {
                        cubes.add(objZ);
                    }
                    var spriteZ = spriteCreator((i + 4) + '' + (j + 4) + '' + (n + 4), {fontsize: 27});
                    spriteZ.position.set(i - 0.5, j - 0.5, n - 0.5);
                    spriteCube.add(spriteZ);
                }
            }
        }
    }//add cubes
};//settings for cubes

App.rebuildSkyBox = {
    changeBackground: function (id) {
        var imagePrefix, skyBox = App.utils.types.webgl.skyBox, playVideoBack = App.utils.types.backgroundContainer;
        skyBox.visible = true;
        switch (id) {
            case 'mountain':
                imagePrefix = ['dawnmountain-xpos.png', 'dawnmountain-xneg.png', 'dawnmountain-ypos.png',
                    'dawnmountain-yneg.png', 'dawnmountain-zpos.png', 'dawnmountain-zneg.png'];
                break;
            case 'siege':
                imagePrefix = ['siege_ft.png', 'siege_bk.png', 'siege_up.png',
                    'siege_dn.png', 'siege_rt.png', 'siege_lf.png'];
                break;
            case 'starfield':
                imagePrefix = ['starfield_ft.png', 'starfield_bk.png', 'starfield_up.png',
                    'starfield_dn.png', 'starfield_rt.png', 'starfield_lf.png'];
                break;
            case 'misty':
                imagePrefix = ['misty_ft.png', 'misty_bk.png', 'misty_up.png',
                    'misty_dn.png', 'misty_rt.png', 'misty_lf.png'];
                break;
            case 'tidepool':
                imagePrefix = ['tidepool_ft.png', 'tidepool_bk.png', 'tidepool_up.png',
                    'tidepool_dn.png', 'tidepool_rt.png', 'tidepool_lf.png'];
                break;
            case 'NONE':
                playVideoBack.play = skyBox.visible = false;
                App.utils.interfaces.backControls(playVideoBack);
                return;
        }
        playVideoBack.play = true;
        App.utils.interfaces.backControls(playVideoBack);
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            var matr = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(App.utils.types.urlImg + imagePrefix[i]),
                side: THREE.BackSide
            });
            materialArray.push(matr);
        }
        skyBox.material = new THREE.MeshFaceMaterial(materialArray);
    },//add background
    add: function () {
        var imagePrefix = ['dawnmountain-xpos.png', 'dawnmountain-xneg.png', 'dawnmountain-ypos.png',
                'dawnmountain-yneg.png', 'dawnmountain-zpos.png', 'dawnmountain-zneg.png'], materialArray = [],
            skyGeometry = new THREE.BoxGeometry(500, 500, 500), skyBox;
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(App.utils.types.urlImg + imagePrefix[i]),
                side: THREE.BackSide
            }));
        skyBox = new THREE.Mesh(skyGeometry, imagePrefix);
        skyBox.visible = false;
        App.utils.types.webgl.scene.add(skyBox);
        App.utils.types.webgl.skyBox = skyBox;
    }//add background
};//settings for background

App.numberWorker = {
    generate: function (number, summa) {
        var arr = this.splitNumToArr(number);
        var permutArray = this.combinations(arr);
        var resultArray = [];
        $('#coords').html('');
        if (number.toString().length > 3) {
            var decimal_part, d;
            for (var i = 0; i < permutArray.length; i++) {
                resultArray[i] = [];
                resultArray[i][0] = permutArray[i][0];
                resultArray[i][1] = permutArray[i][1];
                resultArray[i][2] = permutArray[i][2];
                decimal_part = 0, d = 10;
                for (var j = 3; j < permutArray[i].length; j++) {
                    decimal_part = permutArray[i][j] / d;
                    d *= 10;
                    resultArray[i][2] += decimal_part;
                }
                resultArray[i][2] = this.roundPlus(resultArray[i][2], number.toString().length - 3);
            }
        } else resultArray = permutArray;

        for (var i = 0; i < resultArray.length; i++) {
            $('#coords').append(resultArray[i] + '<br>');
        }

        var used = {}, sum = 0; // deleting identical elems:
        var resultArray = resultArray.filter(function (obj) {
            var use = obj in used;
            if (summa && !use) {
                sum += parseInt(obj[0] + '' + obj[1] + '' + obj[2]);
            }
            return use ? 0 : (used[obj] = 1);
            /*
             var res = !(obj.id in used);
             used[obj.id] = null;
             return res;
             */
        });
//        console.log(sum);
        resultArray = this.sortMasiveOfPoints(resultArray);
        if (summa)return {arr: resultArray, sum: sum};
        return resultArray;
    },
    splitNumToArr: function (number) {
        var arr = [], d = 1;
        for (var i = 0; i < number.toString().length; i++) {
            arr.unshift((number / d | 0) % 10);
            d = d * 10;
        }
        return arr;
    },
    combinations: function (arr) {
        var prev, curr, el, i;
        var len = arr.length;
        curr = [
            [arr[0]]
        ];
        var summ = 0;
        for (i = 1; i < len; i++) {
            el = arr[i];
            prev = curr;
            curr = [];

            prev.forEach(function (item) {
                var num = App.numberWorker.crtNumObj(item, el);
                curr = curr.concat(
                    num
                );
//
                if (num.length > 2) {
//                    console.log(inputNumber,summ);
                    for (var k = 0; k < num.length; k++) {
                        summ += parseInt(num[k][0] + '' + num[k][1] + '' + num[k][2])
                    }
//                    for () {
//
//                    }
//                    var d = parseInt(inputNumber[0] + '' + inputNumber[1] + '' + inputNumber[2]);
//                    console.log(d, inputNumber);

                }
            });
        }
//        console.log(summ);

        return curr;
    },
    crtNumObj: function (arr, el, summa) {
        var i, i_m, item;
        var len = arr.length;
        var res = [], sum = 0;

        for (i = len; i >= 0; i--) {
            var x = arr.slice(0, i),
                y = [el], z = arr.slice(i, i_m);
            res.push(([]).concat(x, y, z));
            if (summa) {
                sum += (x && y && z) ? parseInt(x + '' + y + '' + z) : 0;
                //console.log(x + '' + y + '' + z);
            }
        }
        if (summa) return {res: res, sum: sum};
        return res;
    },
    roundPlus: function (x, n) {
        if (isNaN(x) || isNaN(n)) return false;
        var m = Math.pow(10, n);
        return Math.round(x * m) / m;
    },
    sortMasiveOfPoints: function (arr) {
        var sortMas = arr, newAr = [], f = true, cur;
        for (var j = 0; j < sortMas.length; j++) {

            if (f) {
                f = false;
                cur = sortMas[j];
                newAr.push(cur);
            }

            var someAr = [];
            for (var i = 0; i < sortMas.length; i++) {
                if (cur != sortMas[i] && !isExistObj(sortMas[i])) {
                    someAr.push({
                        dist: Math.sqrt(((sortMas[i][0] - cur[0]) * (sortMas[i][0] - cur[0])) + ((sortMas[i][1] - cur[1]) * (sortMas[i][1] - cur[1])) + ((sortMas[i][2] - cur[2]) * (sortMas[i][2] - cur[2]))),
                        obj: sortMas[i]
                    });
                }
            }
            var minDis = {dist: 100000, obj: 0};
            for (var i = 0; i < someAr.length; i++) {
                if (minDis.dist > someAr[i].dist) {
                    minDis.dist = someAr[i].dist;
                    minDis.obj = someAr[i].obj;
                }
            }
            cur = minDis.obj;
            newAr.push(minDis.obj);
        }
        function isExistObj(el) {
            for (var i = 0; i < newAr.length; i++) {
                if (el == newAr[i]) {
                    return true;
                }
            }
            return false;
        }

        /* for (var j = 1; j < sortMas.length; j++) {
         sortMas[i].corner=Math.getCornerBtwTwoPoints(sortMas[i],sortMas[0]);
         }
         sortMas.sort(function(a,b){
         return a.corner- b.corner;
         })*/
        newAr.pop();
        return newAr;
        //return sortMas;
    }

};//work with input number

/**
 * Math calculation
 */
Math.figureDataByPoints = function (arr, arr2D) {
    var squareFig = 0, squareFigs = [], sumPoints = 0, angles = [], anglesPos = [], angle3DPos = [],
        cur, cur2D, someGS,
        arrLast = arr[arr.length - 1], arrLast2D = arr2D ? arr2D[arr2D.length - 1] : [],
        prev = arr[0], prev2D = arr2D ? arr2D[0] : [];
    if (arr.length > 2) {

        //some calc
        someGS = Math.getIntersectPointsBtwnTwoPoints2D(arr.concat([]));

//get anles, square,position of angles and squares for 2d and 3d
        for (var i = 1; i < arr.length && i + 1 < arr.length; i++) {
            cur = arr[i];
            cur2D = arr2D ? arr2D[i] : [];
            squareFigs.push(this.getSquareByPoints(arr[0], cur, arr[i + 1]));
            squareFig += squareFigs[squareFigs.length - 1];
            var p1 = prev, p2 = arr[i + 1], p3 = cur;
            angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(p1, p2, p3, false, true)));
            angle3DPos.push(Math.getPositionForValueOfCorner(p2, p3, p1, false));
            if (arr2D) anglesPos.push(Math.getPositionForValueOfCorner(arr2D[i + 1], cur2D, prev2D, false));
            prev = arr[i];
            prev2D = arr2D ? arr2D[i] : [];
        }

//    sumPoints += arrLast[0] + arrLast[1] + arrLast[2];
        var p1 = arr[arr.length - 2], p2 = arr[0], p3 = arrLast;
        angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(p1, p2, p3, false, true)));
        angle3DPos.push(Math.getPositionForValueOfCorner(p2, p3, p1, false));
        if (arr2D)anglesPos.push(Math.getPositionForValueOfCorner(arr2D[0], arrLast2D, arr2D[arr2D.length - 2], false));
        var p1 = arr[1], p2 = arrLast, p3 = arr[0];
        angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(p1, p2, p3, false, true)));
        angle3DPos.push(Math.getPositionForValueOfCorner(p2, p3, p1, false));
        if (arr2D)anglesPos.push(Math.getPositionForValueOfCorner(arrLast2D, arr2D[0], arr2D[1], false));
    } else {
        angles.push(0);
    }
    sumPoints += arr[0][0] + arr[0][1] + arr[0][2];

    return {
        squareFigs: squareFigs,
        square: squareFig,
        sum: sumPoints,
        angle: angles,
        anglePos: anglesPos,
        someGS: someGS,
        angle3DPos: angle3DPos
    };
};//return squares of all figures, square of main figure,sum of points, angles

Math.getIntersectPointsBtwnTwoPoints2D = function (arr) {
    var copyArr = arr, points = [], someGS = [], genGS = 0;
    copyArr.push(copyArr[0]);

    for (var ds = 0; ds < copyArr.length - 1; ds++) {
        var cur = copyArr[ds], next = copyArr[ds + 1];
        if (cur[0] == next[0]) {

        } else {
            var rowX = cur[0] - next[0],
                rowY = cur[1] - next[1],
                rowZ = cur[2] - next[2],
                xStep = Math.abs(rowX);

            for (var ld = 1; ld < xStep; ld++) {
                var row = [];
                if (rowX > 0) {
                    row.push(cur[0] - ld);
                    if (rowY > 0) {
                        row.push(cur[1] - ld);
                        chekRow(row, rowZ, cur[2], ld);
                    } else if (rowY < 0) {
                        row.push(cur[1] + ld);
                        chekRow(row, rowZ, cur[2], ld);
                    } else {
                        row.push(cur[1]);
                        chekRow(row, rowZ, cur[2], ld);
                    }
                } else {
                    row.push(cur[0] + ld);
                    if (rowY > 0) {
                        row.push(cur[1] - ld);
                        chekRow(row, rowZ, cur[2], ld);
                    } else if (rowY < 0) {
                        row.push(cur[1] + ld);
                        chekRow(row, rowZ, cur[2], ld);
                    } else {
                        row.push(cur[1]);
                        chekRow(row, rowZ, cur[2], ld);
                    }
                }
                points.push(row);

            }
        }
    }

    function chekRow(arr, row, cur, ld) {
        if (row > 0) {
            arr.push(cur - ld);
        } else if (row < 0) {
            arr.push(cur + ld);
        } else {
            arr.push(cur);
        }
    }

    copyArr.pop();
    for (var isd = 0; isd < points.length; isd++) {
        copyArr.push(points[isd]);
    }

    for (var k = 0; k < copyArr.length; k++) {
        var p1 = copyArr[k], flag = true;
        for (var g = k + 1; g < copyArr.length; g++) {
            if (p1[0] == copyArr[g][0]) {
                p1 = p1[0] + '' + p1[1] + '' + p1[2];
                var p2 = copyArr[g][0] + '' + copyArr[g][1] + '' + copyArr[g][2];
                var calc = Math.getSumOfPointsBtwnTwoPntsIn2D(parseInt(p1), parseInt(p2));
                genGS += parseInt(calc.sum);
                someGS.push(calc);
                copyArr.splice(g, 1);
                flag = false;
                break;
            }
        }
        if (flag) {
            var p1s = p1[0] + '' + p1[1] + '' + p1[2];
            someGS.push({name: p1s, sum: p1s});
            genGS += parseInt(p1s)
        }
    }
    return {listOfGS: someGS, genGS: genGS};
};
Math.getSumOfPointsBtwnTwoPntsIn2D = function (p1, p2) {
    var result = 0, name;
    if (p1 > p2) {
        name = p2 + '...' + p1;
        for (var i = p2; i <= p1; i++) {
            result += i;
        }
    } else {
        name = p1 + '...' + p2;
        for (var i = p1; i <= p2; i++) {
            result += i;
        }
    }

    return {name: name, sum: result};
}
Math.getSquareByPoints = function (p1, p2, p3) {
    var ab = (p1 instanceof Array && p2  instanceof Array),
        ac = (p1 instanceof Array && p3  instanceof Array),
        bc = (p2 instanceof Array && p3  instanceof Array),
        perimeter, a, b, c, x, y, z;
    x = ab ? p1[0] - p2[0] : p1['x'] - p2['x'];
    y = ab ? p1[1] - p2[1] : p1['y'] - p2['y'];
    z = ab ? p1[2] - p2[2] : p1['z'] - p2['z'];
    a = this.sqrt(x * x + y * y + z * z);
    x = ac ? p1[0] - p3[0] : p1['x'] - p3['x'];
    y = ac ? p1[1] - p3[1] : p1['y'] - p3['y'];
    z = ac ? p1[2] - p3[2] : p1['z'] - p3['z'];
    b = this.sqrt(x * x + y * y + z * z);
    x = bc ? p2[0] - p3[0] : p2['x'] - p3['x'];
    y = bc ? p2[1] - p3[1] : p2['y'] - p3['y'];
    z = bc ? p2[2] - p3[2] : p2['z'] - p3['z'];
    c = this.sqrt(x * x + y * y + z * z);
    perimeter = (a + b + c) / 2;
    var aP = perimeter - a, bP = perimeter - b, cP = perimeter - c;
    aP = aP > 0 ? aP : aP * (-1);
    bP = bP > 0 ? bP : bP * (-1);
    cP = cP > 0 ? cP : cP * (-1);
    return this.sqrt(perimeter * (aP) * (bP) * (cP));
};// get square by 3 points
Math.getCornerBtwTwoVercorsAndIntrsctinPnt = function (vector1, vector2, point, endPoint, start) {
    if (endPoint) {
        objOfScene.helpers.listTriangles.push({point1: vector1, point2: vector2, endPoint: endPoint});
    }
    var newFirstVector = !start ? new THREE.Vector3(vector1.x - point.x, vector1.y - point.y, vector1.z - point.z) : new THREE.Vector3(vector1[0] - point[0], vector1[1] - point[1], vector1[2] - point[2]);
    var newSecondVector = !start ? new THREE.Vector3(vector2.x - point.x, vector2.y - point.y, vector2.z - point.z) : new THREE.Vector3(vector2[0] - point[0], vector2[1] - point[1], vector2[2] - point[2]);
    var scaliarMultiplar = newFirstVector.x * newSecondVector.x + newFirstVector.y * newSecondVector.y + newFirstVector.z * newSecondVector.z;
    var firstVectorLength = Math.sqrt(newFirstVector.x * newFirstVector.x + newFirstVector.y * newFirstVector.y + newFirstVector.z * newFirstVector.z);
    var secondVectorLength = Math.sqrt(newSecondVector.x * newSecondVector.x + newSecondVector.y * newSecondVector.y + newSecondVector.z * newSecondVector.z);
    var corner = Math.acos(scaliarMultiplar / (firstVectorLength * secondVectorLength)) * 180 / Math.PI;
    return corner;
}//get corner vy 3 points
Math.getPositionForValueOfCorner = function (point1, intersectPoint, point2, endInterPoint, sqre) {
    var i = 0, vector1 = this.getAverageValueOfHighForTriangle(point1, point2), count = endInterPoint ? 3 : 2;
    var returnVect = this.getAverageValueOfHighForTriangle(vector1, intersectPoint);
    if (sqre) return returnVect;
    while (i++ < count) {
        returnVect = this.getAverageValueOfHighForTriangle(returnVect, intersectPoint);
    }
    /* if (endInterPoint) {
     returnVect = this.getAverageValueOfHighForTriangle(returnVect, intersectPoint);
     }*/
    return returnVect;
}//get position for tables
Math.getAverageValueOfHighForTriangle = function (vector1, intersectPoint) {
    var returnVect = {}, ab = (vector1 instanceof Array ), ba = ( intersectPoint  instanceof Array),
        p1 = ab ? vector1[0] : vector1.x,
        p2 = ab ? vector1[1] : vector1.y,
        p3 = ab ? vector1[2] : vector1.z,
        d1 = ba ? intersectPoint[0] : intersectPoint.x,
        d2 = ba ? intersectPoint[1] : intersectPoint.y,
        d3 = ba ? intersectPoint[2] : intersectPoint.z;
    returnVect.x = (p1 + d1) / 2;
    returnVect.y = (p2 + d2) / 2;
    returnVect.z = (p3 + d3) / 2;
    return returnVect;
}//middle for hight of triangle
Math.average = function (number) {
    var sum = 0, inc = 0;
    while (number > 0) {
        var n = number % 10;
        sum += n;
        number = number / 10 | 0;
        inc++;
    }
    var av = sum / inc;
    if (App.utils.types.webgl._dimension) {
        App.utils.types.webgl.controls.target.set(av, av, av);
    }
    return av;
};
Math.get2DFigureCenter = function (points) {
    var x = 0, y = 0;
    for (var i = 0; i < points.length; i++) {
        x += points[i].x ? points[i].x : points[i][0];
        y += points[i].y ? points[i].y : points[i][0];
    }
    return {x: x / points.length, y: y / points.length};
}
Math.sphereRadius = function (number, circleCenter) {
    var a, b, c = number, sum_xy = 0, sum_z = 0, c_xy, c_z, listOfPoints = App.utils.types.listOfPoints,
        sphereCenter = {};

    if (number.toString().length > 3) {
        var d = Math.pow(10, (number.toString().length - 3));
        number /= d;
        for (var i = 0; i < listOfPoints.length; i++) {
            sum_xy += listOfPoints[i][0];
            sum_z += listOfPoints[i][2];
        }
        sphereCenter.c_xy = c_xy = sum_xy / listOfPoints.length; // average for listOfPoints[i][0] and listOfPoints[i][1]
        sphereCenter.c_z = c_z = sum_z / listOfPoints.length;
        App.utils.types.sphereCenter = sphereCenter;
    }
    c = number % 10;
    b = (number / 10 | 0) % 10;
    a = (number / 100 | 0) % 10;

    if (number.toString().length > 3) {
        return Math.getMaxRadius({c_xy: c_xy, c_z: c_z});
    }
    return Math.sqrt((a - circleCenter) * (a - circleCenter) +
    (b - circleCenter) * (b - circleCenter) +
    (c - circleCenter) * (c - circleCenter));
}//radious by points
Math.getMaxRadius = function (sphereCenter) {
    var curRadius, maxRadius = 0, point, listOfPoints = App.utils.types.listOfPoints;
    for (var i = 0; i < listOfPoints.length; i++) {
        curRadius = Math.sqrt((listOfPoints[i][0] - sphereCenter.c_xy) * (listOfPoints[i][0] - sphereCenter.c_xy) +
        (listOfPoints[i][1] - sphereCenter.c_xy) * (listOfPoints[i][1] - sphereCenter.c_xy) +
        (listOfPoints[i][2] - sphereCenter.c_z) * (listOfPoints[i][2] - sphereCenter.c_z));
        if (curRadius > maxRadius) {
            maxRadius = curRadius;
            point = listOfPoints[i]
        }
    }
    return maxRadius;
}//get max radious
Math.getCornerBtwTwoPoints = function (source, destination) {
    var dX = source instanceof Array && destination instanceof Array;
    var deltaX = dX ? destination[0] - source[0] : destination.x - source.x;
    var deltaY = dX ? destination[1] - source[1] : destination.y - source.y;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
};
Math.getDistBtwTwoPoints = function (source, destination) {
    var dX = source instanceof Array && destination instanceof Array;
    var deltaX = dX ? destination[0] - source[0] : destination.x - source.x;
    var deltaY = dX ? destination[1] - source[1] : destination.y - source.y;
    var deltaZ = dX ? destination[1] - source[1] : destination.z - source.z;

    return this.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
};
Math.cropLineToPoints = function (lineBgn, lineEnd, points) {
    for (var i = 0; i < points; i++) {

    }
};
Math.getRandomArbitrary = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/*when document is ready*/
function isReady() {
    App.utils.interfaces.Run();
    App.rebuild2D.buildPlate();
    /**video background controller**/
    var back = App.utils.types.backgroundContainer;
    $('#' + back.id + ' img').mousedown(function () {
        $('#' + back.id).css('box-shadow', '0 0 10px rgba(0,0,0,0.5)');
    }).mouseup(function () {
        App.utils.interfaces.backControls(back);
    });
    $('input:radio').click(function (val) {
        var types = App.utils.types,webglObj =types.webgl,
            listObj = webglObj.listObjOfScene,
            lastObj = listObj[listObj.length - 1]
            ,is3D = val.currentTarget.value == '3D';
        webglObj._dimension = is3D;
        webglObj.controls.reset();
        App.utils.interfaces.setOnWhhel(true);
        if (is3D) {
            var back = {op: 1, clr: 0x0a014c};
            webglObj.renderer.setClearColor(back.clr, back.op);
            webglObj.camera = webglObj.perspectCamera;
            webglObj.camera.position.set(20, 20, 20);
            /*webglObj.controls.rotateSpeed = 10.0;
            webglObj.controls.panSpeed = 0.8;
            webglObj.controls.minDistance = 0;
            webglObj.controls.maxDistance = 300;
            webglObj.cameraFixed = false;*/
            if (listObj.length > 0) {
                //lastObj.visible = true;
                var lstObj = lastObj.sphere.position;
                webglObj.camera.lookAt(lstObj);
                webglObj.controls.target.set(lstObj.x, lstObj.y, lstObj.z);
            } else {
                webglObj.camera.lookAt(webglObj._dftControl);
                webglObj.controls.target.set(webglObj._dftControl.x, webglObj._dftControl.y, webglObj._dftControl.z);
            }
        } else {
            App.utils.interfaces.setOnWhhel(false);
            webglObj.renderer.setClearColor(webglObj.lastBavkColor, 1);
            webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -45);
            var cur2d = webglObj._2dConsist.position;
            webglObj.camera = webglObj.orpgCamera;
            webglObj.camera.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -15);
            webglObj.camera.lookAt(cur2d);
            /*webglObj.controls.target.set(cur2d.x, cur2d.y, cur2d.z);
            webglObj.controls.rotateSpeed = 0.0;
            webglObj.controls.panSpeed = 0.0;
            webglObj.controls.minDistance = 5//App.rebuild2D.lstCrtdPl < 4 ? 5 : 10;
            webglObj.controls.maxDistance = 40//App.rebuild2D.lstCrtdPl < 4 ? 40 : 50;
            webglObj.cameraFixed = true;*/
            if (listObj.length > 0 && lastObj.isHuge) {
                //lastObj.visible = false;
                var cur = {}, cir = {};
                cur.x = webglObj._dftControl.x,
                    cur.y = webglObj._dftControl.y,
                    cir.x = lastObj.circle2D.position.x,
                    cir.y = lastObj.circle2D.position.y
                //webglObj._2dConsist.bgnPath = {x: webglObj._2dConsist.position.x,y:webglObj._2dConsist.position.y};
                //webglObj._2dConsist.endPath = {x:cur.x- cir.x,y:cur.y- cir.y};
                webglObj._2dConsist.position.x = cur.x - cir.x//cur.x< cir.x?cur.x+ cir.x:cur.x- cir.x;
                webglObj._2dConsist.position.y = cur.y - cir.y//cur.y< cir.y?cur.y- cir.y:cur.y+ cir.y;
            }
        }
        //webglObj.renderPass.camera = webglObj.camera;
        webglObj._2dConsist.visible = !is3D;
        App.guiObj.interfaces.changeStructure(val.currentTarget.value == '3D');
        App.utils.events.staticResize();
        /*  for(var i=0;i<listObj.length;i++){
         App.utils.interfaces.changeDimension(false,false,listObj[i]);
         }*/

    });
    $('#THREEJS canvas').css({position: 'relative', border: '3px solid white'});
    $('#THREEJS canvas').mousedown(function () {
        if (App.utils.types.autoRotate) App.utils.types.autoR.__li.click();
    });

    App.utils.events.staticResize();

}


/**
 * start app on document ready
 */
$(document).ready(function () {
    App.remote.loadData(isReady);
});
