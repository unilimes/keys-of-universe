App.utils = {
    events: {
        onWindowResize: function () {
            App.utils.types.webgl.controls.handleResize();
            App.utils.events.staticResize();

        },
        staticResize: function () {
            var webglObj = App.utils.types.webgl,
                imgWidth = App.utils.interfaces.SW(),
                imgHeight = App.utils.interfaces.SH(),
                left = imgWidth * 0.066,
                bottom = imgHeight * 0.05,
                infoHeight = $('#infoTubes div').height();
            //$('#fond img').css('width', imgWidth );
            //$('#THREEJS').css('padding-top', top );
            imgWidth = Math.floor(imgWidth - (2 * left));
            imgHeight = Math.floor(imgHeight - (bottom));
            $('#THREEJS canvas').css('width', imgWidth).css('height', imgHeight);
            $('#infoFig').css('top', imgHeight - 35
            ).css('left', (window.innerWidth - (imgWidth + 0)) / 2
                //).css('width', imgWidth
            ).css('height', $('#infoTubes div').height());
            webglObj.renderer.setSize(imgWidth, imgHeight);
            if (webglObj._dimension) {
                webglObj.camera.aspect = imgWidth / imgHeight;
            } else {
                //webglObj.camera.zoom = 0.1;
                //App.utils.interfaces.zoomOrphCmr(1, 1.001);
                var delta = webglObj.deltaWhheel;
                webglObj.camera.left = -imgWidth / delta;
                webglObj.camera.right = imgWidth / delta;
                webglObj.camera.top = imgHeight / delta;
                webglObj.camera.bottom = -imgHeight / delta;
            }

            webglObj.camera.updateProjectionMatrix();
            //$('#THREEJS canvas').css('left', left );

        },
        onMouseMove: function (event) {
            event.preventDefault();

            var webglObj = App.utils.types.webgl, projector = webglObj.raycaster,
                mouseVector = webglObj.mouseVector, listObjOfScene = webglObj.listObjOfScene,
                lastHoverAngle = webglObj.lastHoverAngle, previousPos = {x: mouseVector.x + 0, y: mouseVector.y + 0};
            if (lastHoverAngle) {
                lastHoverAngle.material.map = lastHoverAngle.textHover.in;
            }
            var canvas = $('#THREEJS canvas')[0], canvasW = $('#THREEJS canvas').width(), canvasH = $('#THREEJS canvas').height();
            mouseVector.x = ( (event.clientX - canvas.offsetLeft + 1) / canvasW) * 2 - 1;
            mouseVector.y = -( (event.clientY - canvas.offsetTop) / canvasH) * 2 + 1;
            projector.setFromCamera(mouseVector, webglObj.camera);
            if (listObjOfScene.length > 0) {
                var angles = [];
                if (webglObj._dimension) {
                    for (var i = 0; i < listObjOfScene.length; i++) {
                        if (listObjOfScene[i].isVis) {
                            angles = angles.concat(listObjOfScene[i].tipsArray);
                        } else {
                            angles = angles.concat(listObjOfScene[i].angleOute.children);
                        }

                    }
                } else {
                    for (var i = 0; i < listObjOfScene.length; i++) {
                        if (listObjOfScene[i].isVis) {
                            angles = angles.concat(listObjOfScene[i].object2D.corner2DIn.children);
                        } else {
                            angles = angles.concat(listObjOfScene[i].object2D.corner2D.children);
                        }
                    }
                }
                var intersect = projector.intersectObjects(angles)[0];
                if (intersect && intersect.object && intersect.object.category == 'angle') {
                    intersect.object.material.map = intersect.object.textHover.out;
                    App.utils.types.webgl.lastHoverAngle = intersect.object;
                }
            }
            if (webglObj._2dConsist && webglObj._2dConsist.canMove) {
                var stepX = mouseVector.x + 1.3, stepY = mouseVector.y + 1.3;
                //if (previousPos.x < mouseVector.x)stepX *= (-1)
                //if (previousPos.y < mouseVector.y)stepY *= (-1)
                var xCh = previousPos.x != mouseVector.x, yCh = previousPos.y != mouseVector.y;
                //if (xCh) webglObj._2dConsist.position.x += stepX;
                //if (yCh )webglObj._2dConsist.position.y += stepY;
                //webglObj._2dConsist.position.x = stepX;
                //webglObj._2dConsist.position.y = stepY;
                var intersects = projector.intersectObject(webglObj._plate);


                if (intersects.length > 0) {
                    offset.z = 0;
                    var pos = intersects[0].point.sub(offset)
                    if ((pos.x > -25 && pos.x < 35) && (pos.y > -6 && pos.y < 15)) {
                        webglObj._2dConsist.position.copy(pos);
                    }
                }

            }
            App.utils.types.webgl.mouseVector = mouseVector;

        },
        onMouseDown: function (event) {
            event.preventDefault();
            var webglObj = App.utils.types.webgl, projector = webglObj.raycaster,
                mouseVector = webglObj.mouseVector, listObjOfScene = webglObj.listObjOfScene,
                lastHoverAngle = webglObj.lastHoverAngle;
            if (!webglObj._dimension) {
                var canvas = $('#THREEJS canvas')[0], canvasW = $('#THREEJS canvas').width(), canvasH = $('#THREEJS canvas').height();
                mouseVector.x = ( (event.clientX - canvas.offsetLeft + 1) / canvasW) * 2 - 1;
                mouseVector.y = -( (event.clientY - canvas.offsetTop) / canvasH) * 2 + 1;
                projector.setFromCamera(mouseVector, webglObj.camera);
                var data = [webglObj._plate];
                var intersect = projector.intersectObjects(data)[0];
                if (intersect && intersect.object) {
                    offset.copy(intersect.point).sub(webglObj._2dConsist.position);
                    webglObj._2dConsist.canMove = true;
                    webglObj._2dConsist.intersect = intersect;
                    document.getElementById("THREEJS").style.cursor = "all-scroll";
                }
            }
        },
        onMouseUp: function (event) {
            var utils = App.utils, types = utils.types,
                webglObj = types.webgl,
                canvas = $('#THREEJS canvas')[0],
                canvasW = $('#THREEJS canvas').width(),
                canvasH = $('#THREEJS canvas').height(),
                projector = webglObj.raycaster,
                mouseVector = webglObj.mouseVector,
                listObjOfScene = webglObj.listObjOfScene,
                lstIntrs = webglObj.lstIntrs,
                isFlasg = types.currentCluckEffect == 'flashing',
                dmS = webglObj._dimension;

            if (webglObj._2dConsist) {
                webglObj._2dConsist.canMove = false;
                document.getElementById("THREEJS").style.cursor = "auto";
            }
            var shift = webglObj._dimension ? {x: 5, y: 2} : {x: 3, y: 2};
            mouseVector.x = ( (event.clientX - canvas.offsetLeft - shift.x ) / canvasW) * 2 - 1;
            mouseVector.y = -( (event.clientY - canvas.offsetTop - shift.x) / canvasH) * 2 + 1;
            projector.setFromCamera(mouseVector, webglObj.camera);

            App.utils.interfaces.resetTooltipInfo();

            if (listObjOfScene.length > 0) {
                var objIntr = [];

                //objects for intersect
                for (var i = 0; i < listObjOfScene.length; i++) {
                    var curFg = listObjOfScene[i], curChils = [];
                    if (curFg.visible) {
                        if (webglObj._dimension) {
                            if (curFg.sphere.visible) {
                                objIntr.push(curFg.sphere);
                            } else {
                                for (var sd = 0; sd < curFg.smmplFgr.childs.length; sd++) {
                                    objIntr.push(curFg.smmplFgr.childs[sd]);
                                }
                                for (var sd = 0; sd < curFg.tubesArray.length; sd++) {
                                    objIntr.push(curFg.tubesArray[sd]);
                                }
                            }

                            for (var pI = 0; pI < curFg.pointsArray.length; pI++) {
                                objIntr.push(curFg.pointsArray[pI]);
                            }
                        } else {
                            objIntr.push(curFg.circle2D);
                            //objIntr.concat(curFg.object2D.tube2D.children);
                            for (var sd = 0; sd < curFg.object2D.tube2D.children.length; sd++) {
                                objIntr.push(curFg.object2D.tube2D.children[sd]);
                            }
                            for (var sd = 0; sd < curFg.object2D.smmplFgr.childs.length; sd++) {
                                objIntr.push(curFg.object2D.smmplFgr.childs[sd]);
                            }
                            var points2D = curFg.object2D.point2D.children;
                            for (var sd = 0; sd < points2D.length; sd++) {
                                if (points2D[sd].category == "point")objIntr.push(points2D[sd]);
                            }

                        }
                    }
                }

                projector.linePrecision = 5;
                var intersect = projector.intersectObjects(objIntr)[0],
                    val1, val2, val3, val4, parent,
                    eff = utils.interfaces.effects;
                projector.linePrecision = 1;

                if (intersect && intersect.object) {
                    var cat = intersect.object.category,
                        pMaterial = new THREE.PointsMaterial({
                            color: 0xFAFFC1,
                            size: 0.3,
                            map: types.textures[0],
                            blending: THREE.AdditiveBlending,
                            depthTest: false,
                            opacity: 1,
                            transparent: true
                        }),
                        particlesGeo = new THREE.Geometry(),
                        pSystem = new THREE.Points(particlesGeo, pMaterial);
                    pSystem.visible = false;

                    //type of object intersexted
                    if (cat == 'tube') {
                        var innerTubes = [],
                            inner = intersect.object.inner,
                            tubesArray = webglObj._dimension ? intersect.object.parent.tubesArray : intersect.object.parent.children,
                            isFigLittle = tubesArray.length == 3,
                            tubesType = false;
                        if (isFigLittle) {
                            tubesType = 'InOut';
                        } else {
                            if (inner) {
                                tubesType = 'OUTER';
                            } else {
                                tubesType = 'INNER';
                            }
                        }
                        for (var itb = 0; itb < tubesArray.length; itb++) {
                            if (tubesArray[itb].inner == inner)innerTubes.push(tubesArray[itb]);
                        }
                        var innerTxt = isFigLittle || inner ? 'Outer ' : 'Inner ',
                            summ = 0, isAlreadyLight = lstIntrs;

                        for (var s = 0; s < innerTubes.length; s++) {
                            var p1 = innerTubes[s].vBegn, p2 = innerTubes[s].vEnd;
                            var curS = Math.getDistBtwTwoPoints(p1, p2), countOfPoints = curS / 0.05;
                            summ += curS;
                            for (var pnts = 0; pnts < countOfPoints; pnts++) {
                                var enPpos = new THREE.Vector3(
                                    (p2.x - p1.x) * ((pnts) / countOfPoints) + p1.x,
                                    (p2.y - p1.y) * ((pnts) / countOfPoints) + p1.y,
                                    (p2.z - p1.z) * ((pnts) / countOfPoints) + p1.z
                                );
                                particlesGeo.vertices.push(enPpos);
                            }
                            particlesGeo.vertices.push(p1);
                            particlesGeo.vertices.push(p2);
                        }
                        pMaterial.size = webglObj._dimension ? 0.4 : 2;


                        if (isFlasg) {
                            pMaterial.opacity = 0.2;
                            if (webglObj._dimension) {
                                lstIntrs = App.utils.types.webgl.lstIntrs = innerTubes[0].parent;
                            } else {
                                lstIntrs = App.utils.types.webgl.lstIntrs = innerTubes[0].parent.parent;
                            }

                        } else {
                            lstIntrs = App.utils.types.webgl.lstIntrs = innerTubes[0].parent;
                        }
                        lstIntrs.add(pSystem);
                        lstIntrs.typesC = types.currentCluckEffect;
                        lstIntrs.pSystem = pSystem;
                        lstIntrs.tubesType = tubesType;
                        val1 = innerTxt + "&nbsp<span class=\"badge\">" + innerTubes.length + "</span>";
                        val2 = 'Summ of length tubes   ' + "&nbsp<span class=\"badge\">" + summ.toFixed(2) + ' mm' + "</span>";
                        val3 = 'Figure name ' + "&nbsp<span class=\"badge\">" + intersect.object.parent.name + "</span>",
                            val4 = 'Tubes';

                        eff(types.currentCluckEffect, {
                            objOfScene: intersect.object.parent,
                            rad: webglObj._dimension ? 0.01 : 0.03,
                            tubesType: tubesType
                        });
                    }
                    else if (cat == 'circle') {
                        var spher = intersect.object;
                        val1 = 'V = ' + "&nbsp<span class=\"badge\">" + (4 / 3 * Math.PI * Math.pow(spher.rd, 3)).toFixed(2) + ' mm\xB3' + "</span>";
                        val2 = 'S = ' + "&nbsp<span class=\"badge\">" + (4 * Math.PI * Math.pow(spher.rd, 2)).toFixed(2) + ' mm\xB2' + "</span>";
                        val3 = 'Figure name ' + "&nbsp<span class=\"badge\">" + intersect.object.parent.name + "</span>", val4 = 'Circle';

                        pMaterial.size = spher.rd * 5.5;
                        particlesGeo.vertices.push(spher.position.clone());

                        lstIntrs = App.utils.types.webgl.lstIntrs = spher.parent;
                        lstIntrs.typesC = spher.category;
                        lstIntrs.add(pSystem);
                        lstIntrs.pSystem = pSystem;
                        eff('fillTransper', {obj: spher, sys: pSystem, type: 'UP'});
                    }
                    else if (cat == 'subFigure') {
                        var subFigure = intersect.object, inf = subFigure.dataInfo;
                        subFigure.parent.visible = true;
                        lstIntrs = App.utils.types.webgl.lstIntrs = subFigure;
                        lstIntrs.typesC = subFigure.category;
                        val1 = "Square = " + "&nbsp<span class=\"badge\">" + inf.sq + ' mm\xB2' + "</span>",
                            val2 = "Angles :" + "&nbsp<span class=\"badge\">" + inf.angls + "</span>",
                            val3 = 'Perimeter = ' + "&nbsp<span class=\"badge\">" + inf.pr + ' mm' + "</span>",
                            val4 = 'Sub Figure';
                        eff('fillTransper', {obj: subFigure, type: 'UP'});
                    }
                    else if (cat == "points" || cat == "point") {

                        var point = intersect.object,
                            pointsOb = dmS ? point.parent.pointsArray : point.parent.children;
                        lstIntrs = App.utils.types.webgl.lstIntrs = point.parent;
                        lstIntrs.typesC = 'points';

                        pMaterial.size = 0.9;

                        if (!dmS) {
                            var copyP = [];
                            for (var s = 0; s < pointsOb.length; s++) {
                                if (pointsOb[s].category == 'point') {
                                    copyP.push(pointsOb[s]);
                                    particlesGeo.vertices.push(pointsOb[s].position);
                                }
                            }
                            pointsOb = copyP;
                        } else {
                            for (var s = 0; s < pointsOb.length; s++) {
                                particlesGeo.vertices.push(pointsOb[s].position);

                            }

                        }

                        lstIntrs.pSystem = pSystem;
                        lstIntrs.add(pSystem);
                        var figName = dmS ? lstIntrs.name : lstIntrs.parent.name;
                        val1 = 'Numbers : ' + "&nbsp<span class=\"badge\">" + lstIntrs.pointsInfo.str + "</span>";
                        val2 = 'Summ = ' + "&nbsp<span class=\"badge\">" + lstIntrs.pointsInfo.sum + "</span>";
                        val3 = 'Figure name ' + "&nbsp<span class=\"badge\">" + figName + "</span>", val4 = 'Points';

                        eff('scalingPoints', {obj: pointsOb, type: 'UP'});
                    }

                    if (val1) {
                        $('#info').css('display', 'block');
                        $('#info1').html(val1);
                        $('#info2').html(val2);
                        $('#info3').html(val3);
                        $('#info4').text(val4);
                    }
                    //if (types.currentCluckEffect == 'hBlur') {
                    //    setTimeout(function () {
                    //        utils.interfaces.effects(types.currentCluckEffect, {enabled: false});
                    //    }, 500);
                    //}
                }

            }

        },
        onDoubleClick: function () {
            var webglObj = App.utils.types.webgl;
            if (webglObj._2dConsist && !webglObj._dimension) {
                webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -45);
                //webglObj.camera.position.z = -15;
                var delta = App.utils.types.webgl.deltaWhheel = 55,
                    imgWidth = $('#THREEJS canvas').width(),
                    imgHeight = $('#THREEJS canvas').height();
                ;
                webglObj.camera.left = -imgWidth / delta;
                webglObj.camera.right = imgWidth / delta;
                webglObj.camera.top = imgHeight / delta;
                webglObj.camera.bottom = -imgHeight / delta;
                webglObj.camera.updateProjectionMatrix();
                /* var listOb = webglObj.listObjOfScene,pl=webglObj._2dConsist.position;
                 for(var i =0;i<listOb.length;i++){
                 listOb[i].tipsObject.position.set(pl.x,pl.y,pl.z);
                 }*/
            }
        },
        onWheel: function (e) {

            e = e || window.event;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            e.stopPropagation();
            var webglObj = App.utils.types.webgl, delta = 0;

            if (e.wheelDelta) { // WebKit / Opera / Explorer 9
                delta = e.wheelDelta / 40;
            } else if (e.detail) { // Firefox
                delta = -e.detail / 3;
            }

            if (!webglObj._dimension) {
                var fd = 55,
                    max = 8 * (3) + fd,
                    min = -8 * (3) + fd, d = 0,
                    zoom = 0.02;
                if ((webglObj.deltaWhheel > min) && (webglObj.deltaWhheel < max)) {
                    d += delta;
                } else {
                    if (webglObj.deltaWhheel >= max) {
                        if (delta < 0) {
                            d += delta;
                        }
                    } else if (webglObj.deltaWhheel <= min) {
                        if (delta > 0) {
                            d += delta;
                        }
                    }
                }
                if (d) {
                    App.utils.interfaces.zoomOrphCmr(d, zoom);
                    App.utils.types.webgl.deltaWhheel += d;
                }
            }


        }
    },//app events
    types: {
        inputNumber: null,//input value if GUI
        backgroundContainer: {id: "play", play: true},//input value if GUI
        number: null,//input value if not GUI
        radiusOfMainSphere: null,//radious of last added sphere object
        sphereCenter: {},//center of last added sphere object
        listOfPoints: [],//points of last added  object
        maxNumber: 999,//limit input number if not GUI
        animateSpeedOfObj: [],
        defaultPointColor: '009687',
        urlImg: 'assets/img/',
        animaEffect: 'building',
        currentCluckEffect: 'fill',
        parent: null,
        cameraDistance: 20,
        iAnimate: 0,
        frame: 0,
        autoRotate: true,
        mouse: {},
        accessPoint: [],
        textures: [],
        _2dPlateSize: {x: 44.8, y: 21.3},
        rotateTo2D: {x: 2.525, y: 2.357},
        webgl: {
            scene: null,
            _dimension: '3D',
            deltaWhheel: 55,
            lastWheel: 0,
            lastBavkColor: '#0a014c',
            _dftControl: new THREE.Vector3(4.5, 4.5, 4.5),
            scene2: null,
            skyBox: null,
            cubeHelper: null,
            objOfScene: null,
            container: null,
            raycaster: null,
            projector: null,
            mouseVector: null,
            dimensn: false,
            cameraFixed: false,
            camera: null, controls: null, renderer: null,
            listObjOfScene: [],
            intersectPoint: []
        }//webgl objects
    },//app types of objects
    interfaces: {
        zoomOrphCmr: function (delta, zoom) {
            var webglObj = App.utils.types.webgl,
                width = webglObj.camera.right / zoom;
            var height = webglObj.camera.top / zoom;

            zoom -= delta * 0.001;

            webglObj.camera.left = -zoom * width;
            webglObj.camera.right = zoom * width;
            webglObj.camera.top = zoom * height;
            webglObj.camera.bottom = -zoom * height;

            webglObj.camera.updateProjectionMatrix();

        },
        SH: function () {
            return $('#THREEJS').height();
        },
        SW: function () {
            return $('#THREEJS').width();
            ;
        },
        changeDimension: function (name, flag, obj) {
            var listObj = name ? App.utils.interfaces.getObjByName(name) : obj;
            if (listObj) {
                var point2DVis = listObj.object2D.point2D.visible ? true : false, lastV = listObj.pointsArray[0].visible ? true : false;
                App.utils.interfaces.tipsArray.tooltipVisible(listObj, point2DVis, false, {
                    types: lastCheck.point,
                    category: 'point'
                });
                App.utils.interfaces.pointsArray.toggleVisible(listObj, point2DVis);
                lastCheck.addEl(listObj.name, point2DVis, lastCheck.point);
                listObj.object2D.point2D.visible = lastV;

                /* trube enable**/
                var tybeV = listObj.tubesArray[0].visible ? true : false, linsV = listObj.object2D.tube2D.visible;
                App.utils.interfaces.tubesArray.toggleVisible(listObj, linsV);
                listObj.object2D.tube2D.visible = tybeV;

                /* trube enable**/
                if (listObj.listOfPointes.length > 3) {
                    var lastVisibleOf2dCorn = listObj.tipsObject.corner2D.visible/*?true:false*/,
                        lastVPfSq = listObj.tipsObject.genSquare.visible, lastSV, lastAV;
                    for (var j = 0; j < listObj.tipsArray.length; j++) {//square angle
                        var curObj = listObj.tipsArray[j];
                        if (curObj.category == 'angle') {
                            lastSV = curObj.visible;
                            curObj.visible = lastVisibleOf2dCorn// false;//curObj.visible?false:true;
                        } else if (curObj.category == 'square') {
                            lastAV = curObj.visible;
                            curObj.visible = lastVPfSq//false;//curObj.visible?false:true;
                        }
                    }
                    //console.log( listObj.tipsObject.corner2D);
                    listObj.tipsObject.corner2D.visible = lastSV//true//listObj.tipsObject.corner2D.visible?false:true;
                    listObj.tipsObject.genSquare.visible = lastAV//true //listObj.tipsObject.genSquare.visible?false:true;
                }
                /* sphere enable**/
                var lastV = listObj.sphere.visible;
                listObj.sphere.visible = listObj.circle2D.visible;
                listObj.circle2D.visible = lastV;
                var lastV = listObj.shape.visible;
                listObj.shape.visible = listObj.shape2D.visible;
                listObj.shape2D.visible = lastV;
            }
        },
        backControls: function (back) {
            $('#' + back.id).css('box-shadow', '0 0 0 rgba(0,0,0,1)');
            var vid = document.getElementById("myVideo"), src = "pause.png";
            if (back.play) {
                vid.pause();
                back.play = false;
            } else {
                src = 'play.png';
                vid.play();
                back.play = true;
            }
            App.utils.types.backgroundContainer.play = back.play;
            $('#im').attr("src", App.utils.types.urlImg + src);
        },
        saveFile: function (strData, filename) {
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link);
        },//make and save a screen
        Run: function () {
            var webglObj = App.utils.types.webgl;
            webglObj.scene = new THREE.Scene();
            webglObj.scene2 = new THREE.Scene();
            webglObj.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
            webglObj.scene2.fog = new THREE.FogExp2(0xCCCCFF, 0.002);
            //load model
            this.init();
            this.animate();
        },//start app
        init: function () {
            var typrs = App.utils.types, webglObj = typrs.webgl;

            var cube = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 9), new THREE.MeshBasicMaterial(0xff00ff));
            var helper = new THREE.BoxHelper(cube);

            webglObj.orpgCamera = new THREE.OrthographicCamera(1, 1, 1, 1, 1, 100);
            var camera = webglObj.camera = webglObj.perspectCamera = new THREE.PerspectiveCamera(40, (window.innerWidth / window.innerHeight), 0.01, 1000);
            camera.position.set(20, 20, 20);
            webglObj.scene.add(webglObj.camera);
            webglObj.container = document.getElementById('THREEJS');

            //load textures
            typrs.textures.push(THREE.ImageUtils.loadTexture(
                "assets/img/particleA.png"
            ));

            // lights
            webglObj.light = new THREE.DirectionalLight(0x4444cc, 2);
            webglObj.light.intensity = 0;
            webglObj.light.position.set(10, 10, 10).normalize();
            webglObj.light.intensity = 1;

            webglObj.scene.add(webglObj.light);
            webglObj.axis = new THREE.AxisHelper(10, 10, 10);
            webglObj.axis.visible = false;
            webglObj.scene.add(webglObj.axis);

            var renderer = webglObj.renderer = new THREE.WebGLRenderer({
                antialias: true,
                preserveDrawingBuffer: true,
                alpha: true
            });
            renderer.autoClear = false;
            renderer.setClearColor(0x0a014c, 1);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.clear();

            // cube
            webglObj.cubeHelper = new THREE.Object3D();
            webglObj.cubeHelper.position.set(0, 0, 0);
            helper.material.color.set(0xffffff);
            helper.category = 'mainCube';
            webglObj.cubeHelper.position.set(4.5, 4.5, 4.5);
            webglObj.cubeHelper.add(helper);
            cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
            App.rebuildCubes.add(webglObj.cubeHelper, cube);
            webglObj.scene.add(webglObj.cubeHelper);
            webglObj.container.appendChild(renderer.domElement);

            var controls = webglObj.controls = new THREE.TrackballControls(camera, renderer.domElement);
            controls.rotateSpeed = 10.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [65, 83, 68];     // ?
            controls.minDistance = 0;
            controls.maxDistance = 300;
            controls.target.set(webglObj._dftControl.x, webglObj._dftControl.y, webglObj._dftControl.z);

            webglObj.raycaster = new THREE.Raycaster();
            webglObj.mouseVector = new THREE.Vector3();

            //skybox
            App.rebuildSkyBox.add();

            //shaders
            /*var hBlur = typrs.hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
             hBlur.enabled = false;
             hBlur.uniforms.h.value = (1 / window.innerHeight)/0.5;
             var focusShader = typrs.focusShader = new THREE.ShaderPass(THREE.FocusShader);
             focusShader.enabled = false;
             focusShader.uniforms.screenWidth.value = window.innerWidth;
             focusShader.uniforms.screenHeight.value = window.innerHeight;
             focusShader.uniforms.waveFactor.value = 0.0044;
             focusShader.uniforms.sampleDistance.value = 2;
             var edgeAspect = 1024,
             edgeShader = typrs.edgeShader = new THREE.ShaderPass(THREE.EdgeShader);
             edgeShader.enabled = false;
             edgeShader.uniforms.aspect.value = new THREE.Vector2(edgeAspect, edgeAspect);

             var renderPass = webglObj.renderPass = new THREE.RenderPass(webglObj.scene, webglObj.camera);
             var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
             effectCopy.renderToScreen = true;
             var composer = webglObj.composer = new THREE.EffectComposer(renderer);
             composer.addPass(renderPass);
             composer.addPass(hBlur);
             composer.addPass(focusShader);
             composer.addPass(edgeShader);
             //composer.addPass(tri);
             composer.addPass(effectCopy);*/

            //gui
            App.guiObj.init();

            //events
            window.addEventListener('resize', App.utils.events.onWindowResize, false);
            renderer.domElement.addEventListener('mousemove', App.utils.events.onMouseMove, false);
            renderer.domElement.addEventListener('mousedown', App.utils.events.onMouseDown, false);
            renderer.domElement.addEventListener('dblclick', App.utils.events.onDoubleClick, false);
            webglObj.container.addEventListener('mouseup', App.utils.events.onMouseUp, false);

            this.render();
        },//init webgl objects
        // Create particle group and emitter
        setOnWhhel: function (remove) {
            var elem = App.utils.types.webgl.renderer.domElement,
                wheel = App.utils.events.onWheel;
            if (elem.addEventListener) {
                if ('onwheel' in document) {
                    // IE9+, FF17+, Ch31+
                    if (remove) {
                        elem.removeEventListener("wheel", wheel)
                    } else {
                        elem.addEventListener("wheel", wheel);
                    }

                } else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    if (remove) {
                        elem.removeEventListener("mousewheel", wheel)
                    } else {
                        elem.addEventListener("mousewheel", wheel);
                    }
                } else {
                    // Firefox < 17
                    if (remove) {
                        elem.removeEventListener("MozMousePixelScroll", wheel)
                    } else {
                        elem.addEventListener("MozMousePixelScroll", wheel);
                    }
                }
            } else { // IE8-
                if (remove) {
                    elem.attachEvent("onmousewheel", wheel)
                } else {
                    elem.detachEvent("onmousewheel", wheel);
                }
            }
        },
        initParticles: function (point) {
            particleGroup = new SPE.Group({
                texture: THREE.ImageUtils.loadTexture('assets/img/bullet.png'),
                maxAge: 2
            });

            emitter = new SPE.Emitter({
                type: 'sphere',

                position: new THREE.Vector3(point.x, point.y, point.z),

                radius: 2,
                speed: 2,

                colorStart: new THREE.Color('white'),
                colorStartSpread: new THREE.Vector3(point.x, point.y, point.z),
                colorEnd: new THREE.Color('white'),
                sizeStart: 0.1,
                sizeEnd: 2,

                opacityStart: 0,
                opacityMiddle: 1,
                opacityEnd: 0,

                particleCount: 10000,
                angleAlignVelocity: 1
            });

            particleGroup.addEmitter(emitter);
            return particleGroup;

        },
        render: function () {

            var type = App.utils.types, webglObj = type.webgl,
                lastObj = webglObj.listObjOfScene[webglObj.listObjOfScene.length - 1];

            if (lastObj) {
                var camerPos = webglObj.camera.position, /*distCam = Math.sqrt(camerPos.x * camerPos.x + camerPos.y * camerPos.y + camerPos.z * camerPos.z),*/
                    obj = webglObj.listObjOfScene[webglObj.listObjOfScene.length - 1], sphere = obj.sphere,
                    lifeDistance = Math.getDistBtwTwoPoints(sphere.position, camerPos);
                if (type.autoRotate && !webglObj.cameraFixed && webglObj._dimension) {
                    type.iAnimate += 0.005;
                    if (lifeDistance > 10) {
                        if (App.utils.types.cameraDistance > (2 * obj.radiousObj)) {
                            App.utils.types.cameraDistance -= 0.1;
                            //console.log( Math.getDistBtwTwoPoints(sphere.position,camerPos),type.cameraDistance);
                        }
                    } else {
                        if (App.utils.types.cameraDistance > (2.5 * obj.radiousObj)) {
                            App.utils.types.cameraDistance -= 0.1;

                        }
                    }
                    //console.log( Math.getDistBtwTwoPoints(obj,camerPos));
                    webglObj.camera.position.z = sphere.position.z + type.cameraDistance * Math.sin(type.iAnimate);
                    webglObj.camera.position.x = sphere.position.x + type.cameraDistance * Math.cos(type.iAnimate);
                    webglObj.camera.position.y = type.cameraDistance;
                    //webglObj.camera.fov *= (type.iAnimate);
                } else if (!webglObj._dimension) {
                    if (webglObj._2dConsist.bgnPath < webglObj._2dConsist.endPath--) {
                        var step = webglObj._2dConsist.steps;
                        webglObj._2dConsist.position.x += step.x;
                        webglObj._2dConsist.position.y += step.y;
                        if (webglObj._2dConsist.endPath > 50) {
                            //webglObj.camera.position.z -= lastObj.circle2D.radious2d > 6 ? -0.3 : 0.07;
                            App.utils.interfaces.zoomOrphCmr(lastObj.circle2D.radious2d > 6 ? -1 : 1, 0.1);
                        }
                    }

                }

                //points fade in
                if (type.frame < 3) {
                    type.frame += 0.01;
                    for (var i = 0; i < lastObj.pointsArray.length; i++) {
                        var un = lastObj.pointsArray[i].material.uniforms;
                        if (un)un.time.value = (type.frame);
                    }
                }
            }

            webglObj.camera.updateMatrixWorld();
            webglObj.renderer.clear();
            webglObj.renderer.render(webglObj.scene, webglObj.camera);
            //webglObj.composer.render(webglObj.scene, webglObj.camera);
            webglObj.renderer.clearDepth();
            webglObj.renderer.render(webglObj.scene2, webglObj.camera);

        },
        removeObj: function (name) {
            var webglObj = App.utils.types.webgl, curObj;
            for (var i = 0; i < webglObj.listObjOfScene.length; i++) {
                curObj = webglObj.listObjOfScene[i];
                if (curObj.name == name) {
                    webglObj.scene2.remove(curObj.tipsObject);
                    webglObj.scene.remove(curObj);
                    webglObj._2dConsist.remove(curObj.object2D);
                    webglObj.listObjOfScene.splice(i, 1);
                }
            }
        },//drop obj by name
        getObjByName: function (name) {
            var listObjOfScene = App.utils.types.webgl.listObjOfScene;
            for (var i = 0; i < listObjOfScene.length; i++) {
                if (listObjOfScene[i].name == name) return listObjOfScene[i];
            }
        },//get obj by name
        animate: function () {
            var utils = App.utils;
            requestAnimationFrame(App.utils.interfaces.animate);
            utils.types.webgl.controls.update();
            utils.interfaces.render();
        },//refresh screen every 1 ms
        createSprite: function (msg, parameters, nMsg) {
            parameters = parameters ? parameters : {};
            var obj = {
                msg: " " + msg + " ",
                fontface: parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial black",
                fontsize: parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 12,
                borderThickness: parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 12.5,
                canvasWidth: parameters.hasOwnProperty("canvasWidth") ? parameters["canvasWidth"] : false,
                backColor: parameters.hasOwnProperty("backColor") ? parameters["backColor"] : "rgba(255, 255, 0, 1)",
                shift: parameters.hasOwnProperty("shift") ? parameters["shift"] : {x: 0, y: 0},
                isRoundCorner: parameters["isRoundCorner"],
                canvasHeight: parameters.hasOwnProperty("canvasHeight") ? parameters["canvasHeight"] : false,
                isBorder: parameters.hasOwnProperty("isBorder") ? parameters["isBorder"] : false,
                strokeColor: parameters.hasOwnProperty("strokeColor") ? parameters["strokeColor"] : false
            }
            var addText = App.utils.interfaces.addTexture;
            var old = {};
            if (parameters.textCircle) {
                var can = document.createElement('canvas'),
                    ctx = can.getContext('2d'),
                    fd = parameters.textCircle,
                    daltaZ = 100,//fd.x>20?10:100,
                    fc = {x: fd.x * daltaZ, rad: (fd.rad * daltaZ - fd.rad * daltaZ * 0.6)};
                can.width = can.height = fc.x;
                ctx.font = "bold " + obj.fontsize + "px Arial";
                ctx.fillStyle = "rgba(0, 255, 0, 1)";
                ctx.fillTextCircle(msg, fc.x / 2, fc.x / 2, fc.rad, -Math.PI / 3);
                old.texture = new THREE.Texture(can);
                old.texture.needsUpdate = true;
                old.texture.minFilter = THREE.LinearFilter;
                old.scale_width = 1;
                //document.getElementById('test').appendChild(can);
                //console.log(fd,fc);
            } else {
                old = addText(obj);
            }

            //old.texture.renderOrder = 1;
            var spriteMaterial = new THREE.SpriteMaterial({
                map: old.texture, /* useScreenCoordinates: false,*/ rotation: 0,
                transparent: true, opacity: 1.0
            });

            //if(sprite){
            //    sprite = sprite.clone();
            //    sprite.material = spriteMaterial;
            //}else{
            var sprite = new THREE.Sprite(spriteMaterial);
            //}
            if (nMsg) {
                sprite.textHover = {};
                sprite.textHover.in = old.texture;
                obj.msg = nMsg;
                obj.fontsize = 18;
                obj.canvasHeight = 47;
                obj.canvasWidth = 1.9;
                obj.backColor = "rgba(255, 0, 0, 1)";
                sprite.textHover.out = addText(obj).texture;
                sprite.textHover.out.renderOrder = 0;
            }
            if (msg && msg == '_') {
                spriteMaterial.transparent = true;
                //spriteMaterial.opacity = 0;
            }
            var sc = obj.isBorder ? {x: 1, y: 1} : {x: 0.336, y: 0.2};
            sprite.scale.set(old.scale_width, sc.x, sc.y);
            return sprite;
        },//add tables for point and cornere
        addTexture: function (obj) {
            var canvas = document.createElement('canvas'),
                scale_width,
                msg = obj.msg,
                message = " " + msg + " ",
                borderThickness = obj.borderThickness,
                canvasWidth = obj.canvasWidth,
                canvasHeight = obj.canvasHeight,
                fontsize = obj.fontsize,
                fontface = obj.fontface,
                context = canvas.getContext('2d'),
                texture = new THREE.Texture(canvas),
                numOfLetters = canvasWidth ? canvasWidth : msg.length,
                rectX = 6,
                rectY = 6,
                rectWidth = canvas.width,
                rectHeight = canvas.height,
                cornerRadius = 15,
                mPar = 25,
                shift = obj.shift;

            switch (numOfLetters) {
                case 1.9:
                    rectWidth = canvas.width = msg.length > 2 ? msg.length * 14 : msg.length * 18;
                    scale_width = 0.49;
                    break;
                case 2:
                    rectWidth = canvas.width = msg.length > 2 ? msg.length * 11 : msg.length * 18;
                    scale_width = 0.49;
                    break;
                case 3:
                    rectWidth = canvas.width = 60;
                    scale_width = 0.45;
                    break;
                case 4:
                    scale_width = 0.56;
                    rectWidth = canvas.width = 91;
                    break;
                case 5:
                    scale_width = 0.65;
                    rectWidth = canvas.width = 133;
                    break;
                case 6:
                    scale_width = 0.65;
                    rectWidth = canvas.width = 121;
                    break;
                case 7:
                    scale_width = 0.65;
                    rectWidth = canvas.width = 158;
                    break;
                case 8:
                    scale_width = 1;
                    rectWidth = canvas.width = 7 * fontsize//msg.length>15?(10 * fontsize +10*msg.length):10 * fontsize ;
                    break;
                default:
                    scale_width = 0.56;
                    rectWidth = canvas.width = (31 * numOfLetters);
            }
            rectHeight = canvas.height = canvasHeight ? canvasHeight : 60;
            context.font = "Bold " + fontsize + "px " + fontface;
            context.fillStyle = obj.backColor ? obj.backColor : "rgba(255, 255, 255, 1)";
            context.strokeStyle = "rgba(0, 0, 0, 1)";
            context.lineJoin = "round";
            if (obj.isRoundCorner) {
                App.rebuild2D.roundRect(context, rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar, 6, true);
            } else {
                if (!obj.isBorder) {
                    context.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
                }
                context.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
            }

            context.strokeStyle = obj.strokeColor ? obj.strokeColor : "rgba(255, 255, 255, 1)";
            context.lineWidth = canvasWidth ? borderThickness / 2 : borderThickness;
            context.fillStyle = obj.strokeColor ? obj.strokeColor : "rgba(0, 0, 0, 1.0)";
            context.fillText(message, borderThickness + shift.x, fontsize + borderThickness + shift.y);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            return {texture: texture, scale_width: scale_width};

        },
        createMultipointPolygon: function (verticiesArray, num) {
            var geometry;
            if (num > 3) {
                geometry = new THREE.Geometry();
                for (var i = 0; i < verticiesArray.length; i++) {
                    var _V = verticiesArray[i];
                    geometry.vertices.push(new THREE.Vector3(_V[0], _V[1], _V[2]));
                    for (var n = 0; n < verticiesArray.length; n++) {
                        if (n > 0 && n != i) {
                            geometry.faces.push(new THREE.Face3(i, n - 1, n));
                        }
                    }
                }

                geometry.computeBoundingSphere();
            } else {
                var points = [];
                for (var i = 0; i < verticiesArray.length; i++) {
                    var curPs = verticiesArray[i];
                    if (curPs instanceof Array) {
                        points.push(new THREE.Vector3(curPs[0], curPs[1], curPs[2]));
                    } else {
                        points.push(new THREE.Vector3(parseFloat(curPs['x']), parseFloat(curPs['y']), parseFloat(curPs['z'])));
                    }
                }
                geometry = new THREE.ConvexGeometry(points);
            }
            return geometry;
        },//create figure by all points of obj
        tubeLineGeometry: function (point1, point2, flag, radious) {
            var geometry = false;
            if (flag) {
                geometry = new THREE.Geometry();
                geometry.vertices.push(point1);
                geometry.vertices.push(point2);
            } else {
                var spline = new THREE.CatmullRomCurve3([point1, point2]);
                var rad = radious ? radious : 0.01;
                geometry = new THREE.TubeGeometry(spline, 1, rad, 10); // segment,radius,radiusSegments
            }
            return geometry;
        },//create tubes for obj
        animateObj: function (name) {
            var curObjSpeed = App.guiObj.interfaces.getCurObjSpeed(name),
                curObj = this.getObjByName(name),
                timeRotate = curObjSpeed.duration * 10, speed = 900,
                isRotateByAngle = curObjSpeed.rotate == 'degree';
            if (!curObj.isAlreadySetNewGlobalPos)this.translateAllChildrenBySphereCenter(curObj);
            if (curObjSpeed) {
                curObjSpeed.curFigSet.close();
                if (isRotateByAngle)curObjSpeed.curFigSet.__ul.hidden = true;
                setTimeout(function () {
                    var tibeBegi = (new Date().getTime()) + (curObjSpeed.duration * 1000);
                    var startCurObjAn = setInterval(function () {
                        var xRotate = isRotateByAngle ? (Math.PI / (180 / curObjSpeed.x)) / timeRotate : (curObjSpeed.x ) / speed,
                            yRotate = isRotateByAngle ? (Math.PI / (180 / curObjSpeed.y)) / timeRotate : (curObjSpeed.y ) / speed,
                            zRotate = isRotateByAngle ? (Math.PI / (180 / curObjSpeed.z)) / timeRotate : (curObjSpeed.z) / speed;
                        App.utils.interfaces.rotateObj(curObj, xRotate, yRotate, zRotate);
                        if (tibeBegi < new Date().getTime()) {
                            if (isRotateByAngle) {
                                App.utils.interfaces.setFinalDegreeRotate(curObj, curObjSpeed);
                                curObjSpeed.curFigSet.__ul.hidden = false;
                            }
                            clearInterval(startCurObjAn);
                        }
                    }, 100)
                }, curObjSpeed.time * 1000);
            }
        },//animate obj of app
        translateAllChildrenBySphereCenter: function (obj) {
            obj.isAlreadySetNewGlobalPos = true;
            var spherePos = obj.sphere.position, sphere2dPo = obj.circle2D.position;
            obj.position.set(spherePos.x, spherePos.y, spherePos.z);
            obj.object2D.position.set(sphere2dPo.x, sphere2dPo.y, sphere2dPo.z);
            var objPos = obj.position, obj2DP = obj.object2D.position;
            /*for all chides*/
            for (var i = 0; i < obj.children.length; i++) {
                //if(obj.children[i].category != 'tube'){
                var curMeshPoj = obj.children[i].position;
                obj.children[i].position.set(curMeshPoj.x - objPos.x, curMeshPoj.y - objPos.y, curMeshPoj.z - objPos.z);
                obj.children[i].updateMatrixWorld();
                //}
            }
            for (var i = 0; i < obj.object2D.children.length; i++) {
                //if(obj.children[i].category != 'tube'){
                var curMeshPoj = obj.object2D.children[i].position;
                obj.object2D.children[i].position.set(curMeshPoj.x - obj2DP.x, curMeshPoj.y - obj2DP.y, curMeshPoj.z - obj2DP.z);
                //}
            }
            /*for 2d tubes*/
            /*  for (var i = 0; i < obj.linsArray.length; i++) {
             var curMeshPoj = obj.linsArray[i].position;
             obj.linsArray[i].position.set(curMeshPoj.x + objPos.x, curMeshPoj.y + objPos.y, curMeshPoj.z + objPos.z);
             }*/
            /*for sprite*/
            var childScene2 = App.utils.types.webgl.scene2.children;
            for (var i = 0; i < childScene2.length; i++) {
                if (childScene2[i].parentNam && childScene2[i].parentNam == obj.name) {
                    childScene2[i].position.set(objPos.x, objPos.y, objPos.z);
                    childScene2[i].updateMatrixWorld();
                    for (var n = 0; n < childScene2[i].children.length; n++) {
                        var curPoj = childScene2[i].children[n].position;
                        childScene2[i].children[n].position.set(curPoj.x - objPos.x, curPoj.y - objPos.x, curPoj.z - objPos.x);
                        childScene2[i].children[n].updateMatrixWorld();
                    }
                }
            }
        },//set rotation center for all children of obj
        rotateObj: function (curObj, x, y, z) {
            curObj.rotation.x += x;
            curObj.rotation.y += y;
            curObj.rotation.z += z;
            curObj.object2D.rotation.z += x + y + z;
            //curObj.object2D.rotation.y += y;
            //curObj.object2D.rotation.z +=z;
            curObj.tipsObject.rotation.x += x;
            curObj.tipsObject.rotation.y += y;
            curObj.tipsObject.rotation.z += z;
        },//rotate ob by x,y,z
        setFinalDegreeRotate: function (curObj, curObjSpeed) {
            curObj.rotateRad.x += (Math.PI / (180 / curObjSpeed.x)) ,
                curObj.rotateRad.y += (Math.PI / (180 / curObjSpeed.y)) ,
                curObj.rotateRad.z += (Math.PI / (180 / curObjSpeed.z));
            curObj.rotation.x = curObj.rotateRad.x;
            curObj.rotation.y = curObj.rotateRad.y;
            curObj.rotation.z = curObj.rotateRad.z;

            //curObj.object2D.rotation.z = x+y+z;
            //curObj.object2D.rotation.y = curObj.rotateRad.y;

            curObj.tipsObject.rotation.x = curObj.rotateRad.x;
            curObj.tipsObject.rotation.y = curObj.rotateRad.y;
            curObj.tipsObject.rotation.z = curObj.rotateRad.z;
        },//if rotation is with degree, save last degree
        appendHtmlToolBar: function () {
            // --- EDIT-MENU ---
            var $row = $('<div class="row clickableTab"></div>');
            var $eyeIcon = $('<div class="col-sm-2" style="height: 21px"><img src="../assets/img/realistic_eye.png" class="eyeIcon"></div>').click(function () {
                objOfScene.helpers.toggleVisible();
                $(this).find('img').toggle();
            });
            var for_href = '#' + number;
            var $fNameDiv = $('<div data-toggle="collapse" class="col-sm-8 collapsed" href="' + for_href + '">' + objOfScene.name + '</div>');
            var $glyphicon = $('<span class="glyphicon glyphicon-chevron-down col-sm-2" data-toggle="collapse" href="' + for_href + '">');
            $row.append($eyeIcon);
            $row.append($fNameDiv);
            $row.append($glyphicon);
            $('#figures').append($row);

            // edit listObjOfScene inner
            var $collapseFigureParams = $('<div class="row collapse" id="' + number + '" class="panel-collapse collapse">' + '</div>');
            var $displayNumbers = $('<div class="row"><div class="col-sm-10">' + 'Display Numbers' + '</div>' + '</div>');
            var $displayLines = $('<div class="row"><div class="col-sm-10">' + 'Display Lines' + '</div>' + '</div>');
            var $displayCircle = $('<div class="row"><div class="col-sm-10">' + 'Display Circle' + '</div></div>');
            var $fillFigure = $('<div class="row"><div class="col-sm-10">' + 'Fill the figure' + '</div></div>');
            var $numbers = $('<div class="row"><div class="col-sm-6">' + 'Numbers' + '</div></div>');
            var $lines = $('<div class="row"><div class="col-sm-6">' + 'Lines' + '</div></div>');
            var $circle = $('<div class="row"><div class="col-sm-6">' + 'Circle' + '</div></div>');
            var $fill = $('<div class="row"><div class="col-sm-6">' + 'Fill' + '</div></div>');

            var $eyeIconForNumbers = $('<div class="col-sm-2" style="height: 21px"><img src="../assets/img/realistic_eye.png" class="eyeIcon"></div>').click(function () {
                objOfScene.pointsArray.toggleVisible();
                $(this).find('img').toggle();
            });
            var $eyeIconForLines = $('<div class="col-sm-2" style="height: 21px"><img src="../assets/img/realistic_eye.png" class="eyeIcon"></div>').click(function () {
                objOfScene.tubesArray.toggleVisible();
                $(this).find('img').toggle();
            });
            var $eyeIconForCircle = $('<div class="col-sm-2" style="height: 21px"><img src="../assets/img/realistic_eye.png" class="eyeIcon"></div>').click(function () {
                objOfScene.sphere.toggleVisible();
                $(this).find('img').toggle();
            });
            var $eyeIconForShape = $('<div class="col-sm-2" style="height: 21px"><img src="../assets/img/realistic_eye.png" class="eyeIcon"></div>').click(function () {
                objOfScene.shape.toggleVisible();
                $(this).find('img').toggle();
            });

            var $colorNumbers = $('<div class="col-sm-6"><input class="color" style="width: 100%" onchange="defaultPointColor=this.color.toString();"></div>').change(function () {
                objOfScene.pointsArray.changeColor(defaultPointColor);
            });
            var $colorLines = $('<div class="col-sm-6"><input class="color" style="width: 100%" onchange="defaultPointColor=this.color.toString();"></div>').change(function () {
                objOfScene.tubesArray.changeColor(defaultPointColor);
            });
            var $colorCircle = $('<div class="col-sm-6"><input class="color" style="width: 100%" onchange="defaultPointColor=this.color.toString();"></div>').change(function () {
                objOfScene.sphere.changeColor(defaultPointColor);
            });
            var $colorFill = $('<div class="col-sm-6"><input class="color" style="width: 100%" onchange="defaultPointColor=this.color.toString();"></div>').change(function () {
                objOfScene.shape.changeColor(defaultPointColor);
            });

            $displayNumbers.append($eyeIconForNumbers);
            $collapseFigureParams.append($displayNumbers);
            $('#figures').append($collapseFigureParams);
            $displayLines.append($eyeIconForLines);
            $collapseFigureParams.append($displayLines);
            $('#figures').append($collapseFigureParams);
            $displayCircle.append($eyeIconForCircle);
            $collapseFigureParams.append($displayCircle);
            $('#figures').append($collapseFigureParams);
            $fillFigure.append($eyeIconForShape);
            $collapseFigureParams.append($fillFigure);
            $('#figures').append($collapseFigureParams);

            $numbers.append($colorNumbers);
            $collapseFigureParams.append($numbers);
            $('#figures').append($collapseFigureParams);
            $lines.append($colorLines);
            $collapseFigureParams.append($lines);
            $('#figures').append($collapseFigureParams);
            $circle.append($colorCircle);
            $collapseFigureParams.append($circle);
            $('#figures').append($collapseFigureParams);
            $fill.append($colorFill);
            $collapseFigureParams.append($fill);
            $('#figures').append($collapseFigureParams);

            jscolor.bind(); // for changeColor
        },//create controls
        drawLine: function (source, destination, fHolder) {
            var material = new THREE.LineBasicMaterial({
                color: 0xffff00
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(source.position.x, source.position.y, source.position.z));
            geometry.vertices.push(new THREE.Vector3(destination.position.x, destination.position.y, destination.position.z));
            var line = new THREE.Line(geometry, material);
            fHolder.add(line);
        },//create connection btw two point
        toggleVisible: function (name, val) {
            var intrf = App.utils.interfaces, curObjAct = intrf.getObjByName(name);
            if (curObjAct) {
                curObjAct.visible = val;
                curObjAct.object2D.visible = val;
                intrf.resetTooltipInfo();
            } else {
                alert('sorry');
            }
        },//visibility of  obj
        setView: function (type, flag) {
            var appObj = App.utils.types, webglObj = appObj.webgl, listOb = webglObj.listObjOfScene, _systemSize = appObj._2dPlateSize;
            for (var i = 0; i < listOb.length; i++) {
                if (type == '2D') {
                    var tip = listOb[i].tipsObject.position, cur = listOb[i].position, pl = webglObj._2dConsist.position;
                    listOb[i].oldPosit = new THREE.Vector3(cur.x + 0, cur.y + 0, cur.z + 0);
                    listOb[i].rotation.set(Math.PI / 4, -Math.PI / 4, 0);

                    var absP = {x: _systemSize.x / 2, y: _systemSize.y / 2}, scale_sys = 100;//there is (0,0) of new system of coordinates
                    if (!listOb[i].is2dCalc) {
                        var objPnts = listOb[i].listOfPointes, _system = webglObj._system, objSystmPstn = [];
                        for (var k = 0; k < objPnts.length; k++) {
                            for (var j = 0; j < _system.length; j++) {
                                if (objPnts[k] == _system[j].name) {
                                    objSystmPstn.push(_system[j].pos);
                                    break;
                                }
                            }
                        }
                        listOb[i].is2dCalc = Math.get2DFigureCenter(objSystmPstn);
                        listOb[i].is2dCalc.x = (listOb[i].is2dCalc.x / scale_sys) - absP.x;
                        listOb[i].is2dCalc.y = -(listOb[i].is2dCalc.y / scale_sys) + absP.y;
                    }
                    listOb[i].position.set(listOb[i].is2dCalc.x, listOb[i].is2dCalc.y, 0);
                    listOb[i].tipsObject.updateMatrixWorld();
                    listOb[i].tipsObject.position.set(0, 0, 0);
                    //listOb[i].tipsObject.corner2D.position.set(0, 0, 0);
                    //console.log(listOb[i].tipsObject,listOb[i].tipsObject.corner2D);
                    webglObj.scene.remove(listOb[i]);
                    webglObj.scene2.remove(listOb[i].tipsObject);
                    listOb[i].add(listOb[i].tipsObject);
                    webglObj._2dConsist.add(listOb[i]);
                } else {
                    if (listOb[i].oldPosit) {
                        var last = listOb[i].oldPosit;
                        listOb[i].position.set(last.x, last.y, last.z);
                        listOb[i].tipsObject.position.set(last.x, last.y, last.z);
                    }
                    listOb[i].rotation.set(0, 0, 0)
                    listOb[i].tipsObject.rotation.set(0, 0, 0)
                    listOb[i].remove(listOb[i].tipsObject);
                    webglObj._2dConsist.remove(listOb[i]);
                    webglObj.scene.add(listOb[i]);
                    webglObj.scene2.add(listOb[i].tipsObject);
                }
                App.utils.interfaces.changeDimension(false, type == '2D', listOb[i]);
            }

        },
        resetTooltipInfo: function () {
            var ut = App.utils,
                webglObj = ut.types.webgl,
                lstIntrs = webglObj.lstIntrs;
            if (lstIntrs) {
                //light
                if (lstIntrs.anObj) {
                    lstIntrs.remove(lstIntrs.anObj);
                    lstIntrs.anObj = false;
                }

                switch (lstIntrs.typesC) {
                    case 'circle':
                    {
                        lstIntrs.remove(lstIntrs.pSystem);
                        ut.interfaces.effects('fillTransper', {obj: lstIntrs.sphere, type: 'DOWN'});
                        break;
                    }
                    case 'subFigure':
                    {
                        ut.interfaces.effects('fillTransper', {obj: lstIntrs, type: 'DOWN', vis: true});
                        break;
                    }
                    case 'flashing':
                    {
                        ut.interfaces.effects('flashing', {type: 'DOWN'});
                        break;
                    }
                    case 'scaling':
                    {
                        var delta = 0.01 * 6;
                        ut.interfaces.effects('scaling', {
                            type: 'DOWN',
                            rad: (webglObj._dimension ? (delta) : (0.03 + delta))
                        });
                        break;
                    }
                    case 'points':
                    {
                        var pointsOb = lstIntrs.pointsArray;
                        lstIntrs.remove(lstIntrs.pSystem);
                        if (!webglObj._dimension) {
                            lstIntrs.parent.remove(lstIntrs.pSystem);
                            var copyP = [], pointsOb = lstIntrs.children;
                            for (var s = 0; s < pointsOb.length; s++) {
                                if (pointsOb[s].category == 'point') {
                                    copyP.push(pointsOb[s]);
                                }
                            }
                            pointsOb = copyP;
                        }
                        ut.interfaces.effects('scalingPoints', {obj: pointsOb, type: 'DOWN'});
                        break;
                    }
                    default  :
                    {
                        lstIntrs.remove(lstIntrs.pSystem);
                    }
                }
                $('#info').css('display', 'none');
                App.utils.types.webgl.lstIntrs = false;
            }


        },
        disableElementsOfFigue: function (objOfScene, flag) {
            var objectsForConnect = [], vis = flag ? true : false;
            for (var l = 0; l < objOfScene.pointsArray.length; l++) {
                if (objOfScene.pointsArray[l].category == 'points') {
                    objectsForConnect.push(objOfScene.pointsArray[l])
                    objOfScene.pointsArray[l].visible = vis;
                    objOfScene.pointsArray[l].tooltip.visible = vis;
                }
            }
            for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                objOfScene.tubesArray[i].visible = vis;
                objOfScene.tubesArray[i].material.opacity = 1;
                objOfScene.tubesArray[i].isBuild = !vis;
            }
            return objectsForConnect;
        },
        get2dPoints: function (arr) {
            var points = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].category == "point")points.push(arr[i]);
            }
            return points;
        },
        effects: function (type, par) {
            var ut = App.utils,
                typrs = ut.types,
                intr = ut.interfaces,
                eff = intr.effectTypes;

            switch (type) {
                case 'focusShader':
                {
                    typrs.focusShader.enabled = par.enabled;
                    break;
                }
                case 'hBlur':
                {
                    typrs.hBlur.enabled = par.enabled;
                    break;
                }
                case 'edgeShader':
                {
                    typrs.edgeShader.enabled = par.enabled;
                    break;
                }
                case 'fill':
                {
                    var objectsForConnect = typrs.webgl._dimension ? intr.disableElementsOfFigue(par.objOfScene, true) : intr.get2dPoints(par.objOfScene.parent.point2D.children),
                        len = objectsForConnect.length + 0;

                    for (var i = 0; i < objectsForConnect.length; i++) {
                        objectsForConnect[i].isDrawed = false;
                    }

                    var firstElem = objectsForConnect.shift();
                    if (par.tubesType == "INNER") {
                        objectsForConnect.push(objectsForConnect[0]);
                    }
                    var animatObj = par.objOfScene.anObj = new THREE.Object3D();
                    par.objOfScene.add(animatObj);
                    firstElem.building(objectsForConnect, false, animatObj, false, 1, par.tubesType);
                    break;
                }
                case 'scaling':
                {
                    eff.scaling(par);
                    break;
                }
                case 'flashing':
                {
                    eff.flashing(par);
                    break;
                }
                case 'scalingPoints':
                {
                    eff.scalingPoints(par);
                    break;
                }
                case 'fillTransper':
                {
                    eff.fillTransper(par);
                    break;
                }
            }

        },
        effectTypes: {
            scaling: function (par) {
                var type = par.type,
                    webgl = App.utils.types.webgl,
                    tubes = webgl._dimension ? webgl.lstIntrs.tubesArray : webgl.lstIntrs.children,
                    lastT = webgl.lstIntrs.tubesType,
                    rad = par.rad,
                    d = 0,
                    delta = 0.01,
                    tubeLine = App.utils.interfaces.tubeLineGeometry;
                if (type == "DOWN") {
                    delta *= -1;
                }
                var sc = setInterval(function () {
                    if (d++ > 5) {
                        clearInterval(sc);
                    } else {
                        for (var y = 0; y < tubes.length; y++) {
                            if (tubes[y].vBegn) {
                                if ((tubes[y].inner && lastT == "OUTER") ||
                                    (!tubes[y].inner && lastT == "INNER") ||
                                    (lastT == "InOut")
                                ) {
                                    tubes[y].geometry = tubeLine(tubes[y].vBegn, tubes[y].vEnd, false, rad);
                                }
                            }
                        }
                        rad += delta;
                    }
                }, 20);
            },
            scalingPoints: function (par) {
                var bgn = 5,
                    end = 0,
                    delta = 1.1,
                    down = (par.type == "DOWN"),
                    sc = down ? 1 / delta : delta,
                    obj = par.obj;
                var scaling = setInterval(function () {
                    if (end++ >= bgn) {
                        var parent = obj[0].parent;
                        parent.pSystem.visible = true;
                        parent.pSystem.updateMatrixWorld();
                        clearInterval(scaling);
                    } else {
                        for (var i = 0; i < obj.length; i++) {
                            obj[i].scale.multiplyScalar(sc);
                        }
                    }
                }, 50);
            },
            fillTransper: function (par) {
                var type = par.type,
                    obj = par.obj,
                    sys = par.sys,
                    vis = par.vis,
                    delta = 0.05, step = 0;
                if (type == 'DOWN') {
                    delta *= -1;
                }
                var end = 10, fill = setInterval(function () {
                    if (step++ > end) {
                        if (sys)sys.visible = true;
                        if (vis)obj.parent.visible = false;
                        clearInterval(fill);
                    } else {
                        obj.material.opacity += delta;
                    }

                }, 20);
            },
            flashing: function (par) {
                var type = par.type,
                    delta = 0.05,
                    ut = App.utils,
                    lstIntrs = ut.types.webgl.lstIntrs,
                    down = type == 'DOWN';
                if (down) {
                    delta *= -1;
                }
                var s = lstIntrs.pSystem;
                if (s) {
                    s.visible = true;
                    var end = 0;
                    var flash = setInterval(function () {
                        if (end++ > 20) {
                            if (down)lstIntrs.remove(s);
                            clearInterval(flash);
                        } else {
                            s.material.opacity += delta;
                        }

                    }, 30);
                }
            }
        },
        tipsArray: {
            tooltipVisible: function (name, val, objCal, lastEl) {
                var curObjAct = name.name ? name : App.utils.interfaces.getObjByName(name), webglObj = App.utils.types.webgl;
                if (curObjAct) {
                    if ((objCal && lastCheck.getEl(name, lastEl.types)) || ( curObjAct.visible )) {
                        //if(webglObj._dimension /*|| lastEl.category =='point'*/) {
                        switch (lastEl.category) {
                            case 'square':
                            {
                                if (curObjAct.isVis) {
                                    changeVis();
                                    curObjAct.object2D.square2D.visible = val;
                                } else {
                                    curObjAct.genSquare.visible = val;
                                    curObjAct.object2D.genSquare.visible = val;
                                }

                                break;
                            }
                            case 'angle':
                            {
                                if (curObjAct.isVis) {
                                    changeVis();
                                    curObjAct.object2D.corner2DIn.visible = val;
                                } else {
                                    curObjAct.angleOute.visible = val;
                                    curObjAct.object2D.corner2D.visible = val;
                                }

                                break;
                            }
                            case 'point':
                            {
                                changeVis();
                                curObjAct.object2D.point2D.visible = val;
                                break;
                            }
                        }

                    }
                    function changeVis() {
                        for (var i = 0; i < curObjAct.tipsArray.length; i++) {
                            if (curObjAct.tipsArray[i].category == lastEl.category) {
                                curObjAct.tipsArray[i].visible = val;
                            }
                        }
                    }
                }
            }, resetTipsVis: function (name, category) {
                var curObjAct = name.name ? name : App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    var lasrAng = {inner: curObjAct.angleOute.visible ? true : false},
                        lasrSq = {inner: curObjAct.genSquare.visible ? true : false};
                    for (var i = 0; i < curObjAct.tipsArray.length; i++) {
                        var cur = curObjAct.tipsArray[i];
                        if (category[0] == cur.category) {
                            lasrSq.out = cur.visible ? true : false;
                            cur.visible = lasrSq.inner;
                        } else if (category[1] == cur.category) {
                            lasrAng.out = cur.visible ? true : false;
                            cur.visible = lasrAng.inner;
                        }

                    }
                    curObjAct.angleOute.visible = lasrAng.out;
                    curObjAct.genSquare.visible = lasrSq.out;

                    //-------2d
                    //angle
                    curObjAct.object2D.corner2DIn.visible = lasrAng.inner;
                    curObjAct.object2D.corner2D.visible = lasrAng.out;
                    //square
                    curObjAct.object2D.square2D.visible = lasrSq.inner;
                    curObjAct.object2D.genSquare.visible = lasrSq.out;

                }
            }
        },//tables  behavior
        pointsArray: {
            toggleVisible: function (name, val) {
                var curObjAct = name.name ? name : App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.pointsArray.length; i++) {
                        curObjAct.pointsArray[i].visible = val;
                    }
                }
            },//visible
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    var mat = new THREE.MeshLambertMaterial({
                        wireframe: true,
                        color: 0xFFEB3B
                    });
                    mat.color.setHex('0x' + clr);
                    for (var i = 0; i < curObjAct.pointsArray.length; i++) {
                        curObjAct.pointsArray[i].material = mat;
                        curObjAct.pointsArray[i].dimensnP.material = mat;
                    }
                }
            }//change color
        },//points behavior
        tubesArray: {
            toggleVisible: function (name, val, INNER) {
                var intrf = App.utils.interfaces, curObjAct = name.name ? name : intrf.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.tubesArray.length; i++) {
                        if (INNER) {
                            if (curObjAct.tubesArray[i].inner) {
                                curObjAct.tubesArray[i].visible = val;
                                //curObjAct.object2D.tube2D.visible = val;
                            }
                        } else if (!curObjAct.tubesArray[i].inner) {
                            curObjAct.isVis = val;
                            curObjAct.tubesArray[i].visible = val;
                            //curObjAct.object2D.tube2D.visible = val;
                        }

                    }

                    //for 2d
                    var cur = curObjAct.object2D.tube2D.children;
                    for (var i = 0; i < cur.length; i++) {
                        if (INNER) {
                            if (cur[i].inner) {
                                cur[i].visible = val;
                            }
                        } else if (!cur[i].inner) {
                            cur[i].visible = val;
                        }
                    }
                    intrf.resetTooltipInfo();
                }
                return curObjAct;
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    var mat = new THREE.MeshLambertMaterial({color: 0xFFF176});
                    mat.color.setHex('0x' + clr);
                    for (var i = 0; i < curObjAct.tubesArray.length; i++) {
                        curObjAct.tubesArray[i].material = mat;
                    }
                    var mat = new THREE.MeshBasicMaterial({color: 0xFFF176});
                    mat.color.setHex('0x' + clr);
                    var cur = curObjAct.object2D.tube2D.children;
                    for (var i = 0; i < cur.length; i++) {
                        cur[i].material = mat;
                    }
                }
            }
        },//tubes behavior
        sphere: {
            toggleVisible: function (name, val) {
                var intrf = App.utils.interfaces, curObjAct = intrf.getObjByName(name);
                if (curObjAct) {
                    curObjAct.sphere.visible = val;
                    curObjAct.circle2D.visible = val;
                    intrf.resetTooltipInfo();
                }
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    //if (!curObjAct.dimensn) {
                    curObjAct.sphere.material = new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.2
                    });
                    curObjAct.sphere.material.color.setHex('0x' + clr);
                    curObjAct.circle2D.material = new THREE.MeshBasicMaterial({
                        color: 0x76FF03,
                        side: THREE.DoubleSide
                    });
                    curObjAct.circle2D.material.color.setHex('0x' + clr);
                    //} else {
                    //    curObjAct.circle2D.material = new THREE.MeshLambertMaterial({
                    //        wireframe: true,
                    //        color: 0xFFEB3B
                    //    });
                    //    curObjAct.circle2D.material.color.setHex('0x' + clr);
                    //}
                }
            },
            infoVis: function (obj, val) {
                var curObjAct = obj.name ? obj : App.utils.interfaces.getObjByName(obj);
                if (curObjAct) {
                    curObjAct.object2D.circleInfo.visible = curObjAct.last2dInf.cIVis = val;
                }
            }
        },
        shape: {
            toggleVisible: function (name, val) {
                var intrf = App.utils.interfaces, curObjAct = intrf.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.visible = val;
                    curObjAct.shape2D.visible = val;
                    intrf.resetTooltipInfo();
                }
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    /*   curObjAct.shape.material = new THREE.MeshBasicMaterial({
                     color: 0x76FF03,
                     side: THREE.DoubleSide,
                     transparent: true,
                     opacity: 0.2
                     });*/
                    curObjAct.shape.material.color.setHex('0x' + clr);
                    curObjAct.shape2D.material = curObjAct.shape.material;
                }
            },
            changeOpacity: function (val, name) {
                var intrf = App.utils.interfaces, curObjAct = intrf.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.material.opacity = val;
                    curObjAct.shape2D.material.opacity = val;
                    intrf.resetTooltipInfo();
                }
            }//opacity for shape
        },//shape behavior
        gs: {
            toggleVisible: function (obj, val) {
                var curObjAct = obj.name ? obj : App.utils.interfaces.getObjByName(obj);
                if (curObjAct) {
                    curObjAct.object2D.genSumm.visible = curObjAct.last2dInf.gsVis = val;
                } else {
                    alert('sorry');
                }
            }
        }
    }//app methods
};