App.rebuildNodes = function (numer) {
    /**
     * Variables and objects initialising
     */
    var objectsForConnect = [], objOfScene,
        number = App.utils.types.inputNumber,
        webglObj = App.utils.types.webgl,
        sendData = {angleTooltips: [], squareTooltips: [], figures: []},
        isBig = true;
    App.guiObj.listOgAngles = [];
    App.guiObj.listOfSquares = [];
    number = numer;
    objOfScene = new THREE.Object3D();
    objOfScene.isVis = true;
    objOfScene.sendData = sendData;
    objOfScene.angleOute = new THREE.Object3D();
    objOfScene.angleOute.visible = false;
    objOfScene.rotateRad = {
        x: 0,
        y: 0,
        z: 0
    };
    objOfScene.radiousObj = 0;
    objOfScene.pointsArray = [];
    objOfScene.pointsArray2d = [];
    objOfScene.particleGroups = [];
    objOfScene.tipsArray = [];
    objOfScene.linesArray = [];
    objOfScene.tubesArray = [];
    objOfScene.linsArray = [];
    objOfScene.lins2DArray = [];
    objOfScene.dimensn = App.utils.types.webgl.dimensn;
    objOfScene.isAlreadySetNewGlobalPos = false;
    objOfScene.isAnimateObject = true;
    objOfScene.polygonsAr = [];
    objOfScene.frame = 0;
    objOfScene.last2dInf = {gsVis: false, cIVis: false};
    var objName = 'Figure ' + number, newObh = [],
        aveageNum, radiusOfMainSphere;
    sendData.name = objName + '';
    var exist = App.guiObj.figure.isExist(objName);
    if (exist) {
        var k = 0;
        while (k++ < exist.key) {
            objName += '*';
        }
    } else {
        App.guiObj.figure.name.push({nam: objName, key: 0});
    }
    objOfScene.name = objName;
    //objOfScene.visible=false;
    objOfScene.tipsObject = new THREE.Object3D();
    objOfScene.tipsObject.add(objOfScene.angleOute);
    objOfScene.tipsObject.parentNam = objName;

    var figuresOnSimpleObj = objOfScene.smmplFgr = new THREE.Object3D();
    figuresOnSimpleObj.category = 'smmplFgr';
    figuresOnSimpleObj.childs = [];
    objOfScene.add(figuresOnSimpleObj);


    /*-----------2d-----------*/
    var _2d = objOfScene.object2D = new THREE.Object3D();
    _2d.category = 'object2D';
    _2d.name = objName;
    //corner
    var _2dCrn = _2d.corner2D = new THREE.Object3D();
    _2dCrn.visible = false;
    _2dCrn.category = 'corner2D';
    _2dCrn.updateMatrixWorld();
    _2d.add(_2dCrn);

    var _2dCrnIn = _2d.corner2DIn = new THREE.Object3D();
    _2dCrnIn.visible = false;
    _2dCrnIn.category = 'corner2DIn';
    _2dCrnIn.updateMatrixWorld();
    _2d.add(_2dCrnIn);

    //points
    var _2dPnts = _2d.point2D = new THREE.Object3D();
    _2dPnts.category = 'point2D';
    _2dPnts.updateMatrixWorld();
    _2d.add(_2dPnts);

    //tubes
    var _2dTbs = _2d.tube2D = new THREE.Object3D();
    _2dTbs.category = 'tube2D';
    _2dTbs.name = objName;
    _2dTbs.updateMatrixWorld();
    _2d.add(_2dTbs);

    //square
    var _2dSq = _2d.square2D = new THREE.Object3D();
    _2dSq.category = 'square2D';
    _2dSq.visible = false;
    _2dSq.updateMatrixWorld();
    _2d.add(_2dSq);
    objOfScene.object2D.genSquare = {};

    //general summ
    var _2dGS = _2d.genSumm = new THREE.Object3D();
    _2dGS.category = 'gs';
    _2dGS.visible = false;
    _2dGS.updateMatrixWorld();
    _2d.add(_2dGS);

    //2d circle info
    var _2dCI = _2d.circleInfo = new THREE.Object3D();
    _2dCI.category = 'circleInfo';
    _2dCI.visible = false;
    _2dCI.updateMatrixWorld();
    _2d.add(_2dCI);


    var _2dSmFgr = _2d.smmplFgr = new THREE.Object3D();
    _2dSmFgr.category = 'smmplFgr';
    _2dSmFgr.childs = [];
    _2dSmFgr.updateMatrixWorld();
    _2d.add(_2dSmFgr);

    webglObj._2dConsist.add(_2d);
    objOfScene.listOf2dCord = [];
    webglObj.scene.add(objOfScene);
    webglObj.scene2.add(objOfScene.tipsObject);
    /**
     * creation SubObjects and Methods for main object
     */
    objOfScene.helpers = {
        listTriangles: [],//list of faces
        intersectPoint: [],//list of point intersect, unic
        intersectPoints: [],//list of point intersect, unic
        intersectPointsR: [],//list of point intersect, unic
        accessPoints: [],//list of point intersect, unic
        accessPoint: [],//list of point wich can build a face
        accessRemotePoint: [],//list of point wich can build a face
        drawPoints: function (resArr, number) {
            var isbig = number.toString().length > 3, littleR = isbig ? 0.08 : 0.1,
                pointsStr = "", sumP = 0;
            aveageNum = Math.average(number), radiusOfMainSphere = Math.sphereRadius(number, aveageNum);

            for (var i = 0; i < resArr.length; i++) {
                var cord = resArr[i][0] + '' + resArr[i][1] + '' + resArr[i][2];
                objOfScene.listOf2dCord.push(cord);
                pointsStr += cord + ', ';
                sumP += parseInt(cord);
            }
            pointsStr = pointsStr.substr(0, pointsStr.length - 1);
            objOfScene.pointsInfo = {str: pointsStr, sum: sumP};
            _2dPnts.pointsInfo = objOfScene.pointsInfo;

            objOfScene.listOf2dCord = App.rebuild2D.get2DCoordinat(objOfScene.listOf2dCord);

            $.each(resArr, function (key, node) {
                var geometry = new THREE.SphereGeometry(littleR, 32, 32);
                var material = isbig ? new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: 0x9012e8,
                    side: THREE.DoubleSide
                }) : new THREE.MeshNormalMaterial();
                //    material = new THREE.MeshBasicMaterial({wireframe: true, color: 0x9012e8,side:THREE.DoubleSide});
                geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
                objOfScene.Sprite = App.utils.interfaces.createSprite(node[0] + '' + node[1] + '' + node[2], {
                    fontsize: 27,
                    borderThickness: 1,
                    canvasWidth: 4,
                    canvasHeight: 52,
                    shift: {x: 1.5, y: 9},
                    backColor: "rgba(255, 255, 255, 1)",
                    isRoundCorner: true
                });
                objOfScene.Sprite.category = 'point';
                objOfScene.pointSphere = new THREE.Mesh(geometry, material);
                objOfScene.pointSphere.position.set(node[0], node[1], node[2]);
                objOfScene.pointSphere.tooltip = objOfScene.Sprite;
                objOfScene.Sprite.position.copy(objOfScene.pointSphere.position);
                objOfScene.Sprite.position.y = objOfScene.Sprite.position.y + 0.27;
                objOfScene.pointsArray.push(objOfScene.pointSphere);
                objOfScene.tipsArray.push(objOfScene.Sprite);
                objOfScene.tipsObject.add(objOfScene.Sprite);
                objOfScene.add(objOfScene.pointSphere);
                objectsForConnect.push(objOfScene.pointSphere);
                if (isBig) {
                    var stepEps = 0.05,
                        circle = new THREE.Mesh(new THREE.TorusGeometry(littleR, 0.01, 30, 200), new THREE.MeshBasicMaterial({
                            color: 0x9012e8, side: THREE.DoubleSide
                        }));
                    circle.category = 'point';
                    var sprite = objOfScene.Sprite.clone();
                    sprite.scale.multiplyScalar(1.5);
                    circle.tooltip = sprite;
                    circle.dimensnP = circle;
                    objOfScene.object2D.point2D.add(sprite);
                    objOfScene.object2D.point2D.add(circle);
                    objOfScene.pointSphere.dimensnP = circle;
                    objOfScene.helpers.draw2DPnts(circle, sprite, objOfScene.listOf2dCord[key]);
                }


            });
        },// draw points on screen
        draw2DPnts: function (circle, sprite, list) {
            var stepEps = 0.05;
            //    circle = new THREE.Mesh(new THREE.RingGeometry(littleR + 0.01, littleR, 32), new THREE.MeshBasicMaterial({
            //        color: 0x9012e8, side: THREE.DoubleSide
            //    }));
            //circle.category = 'point';
            //var sprite = objOfScene.Sprite.clone();
            //sprite.scale.multiplyScalar(2.5);
            //circle.tooltip = sprite;
            //circle.dimensnP = circle;
            //objOfScene.object2D.point2D.add(sprite);
            //objOfScene.object2D.point2D.add(circle);
            //objOfScene.pointSphere.dimensnP = circle;
            var cur = list;
            if (cur) {
                circle.position.set(cur.x, cur.y, cur.z);
                sprite.position.set(cur.x, cur.y + (stepEps * 5), 29);
                //console.log(sprite);
            }
            circle.updateMatrixWorld();
            sprite.updateMatrixWorld();
        },
        drawConnections: function (objectsForConnect) {
            /*while(objectsForConnect.length){
             var currentObject = objectsForConnect.shift();
             $.each(objectsForConnect, function(key, nextObject){
             //drawLine(currentObject, nextObject, objOfScene);
             var material = new THREE.LineBasicMaterial({color: 0xffff00});
             var geometry = new THREE.Geometry();
             geometry.vertices.push(new THREE.Vector3(currentObject.position.x, currentObject.position.y, currentObject.position.z));
             geometry.vertices.push(new THREE.Vector3(nextObject.position.x, nextObject.position.y, nextObject.position.z));
             objOfScene.cutLine = new THREE.Line( geometry, material );
             objOfScene.linesArray.push(objOfScene.cutLine);
             objOfScene.add(objOfScene.cutLine);
             });
             }
             objOfScene.linesArray.toggleVisible = function (name) {
             var curObjAct = getObjByName(name);
             if (curObjAct) {
             for (var i = 0; i < curObjAct.linesArray.length; i++) {
             curObjAct.cutLine = curObjAct.linesArray[i];
             curObjAct.cutLine.visible ? curObjAct.cutLine.visible = false : curObjAct.cutLine.visible = true;
             }
             }
             };
             objOfScene.linesArray.changeColor = function (clr, name) {
             var curObjAct = getObjByName(name);
             if (curObjAct) {
             for (var i = 0; i < curObjAct.linesArray.length; i++) {
             curObjAct.cutLine = curObjAct.linesArray[i];
             curObjAct.cutLine.material.color.setHex('0x' + clr);
             }
             }
             };*/
            var id_tub = 0,
                lastObj = objectsForConnect.length - 2,
                mat = new THREE.MeshBasicMaterial({
                    color: 0xffffff, side: THREE.DoubleSide
                }),
                tubeMaterial = new THREE.MeshNormalMaterial(),
                _2dCord = objOfScene.listOf2dCord.concat([]),
                innerTubes = [], outerTubes = [], isLittle = _2dCord.length == 3;
            while (objectsForConnect.length) {
                var currentObject = objectsForConnect.shift(), inner = false;
                newObh.push(currentObject);
                $.each(objectsForConnect, function (key, nextObject) {

                    var vBegn = currentObject.position//new THREE.Vector3(currentObject.position.x, currentObject.position.y, currentObject.position.z);
                    var vEnd = nextObject.position//new THREE.Vector3(nextObject.position.x, nextObject.position.y, nextObject.position.z);
                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd);
                    objOfScene.tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                    objOfScene.tube.id_tub = id_tub;
                    objOfScene.tube.category = 'tube';
                    objOfScene.tube.line = {vBegn: vBegn, vEnd: vEnd};
                    objOfScene.tube.vBegn = vBegn;
                    objOfScene.tube.vEnd = vEnd;
                    objOfScene.tubesArray.push(objOfScene.tube);
                    objOfScene.add(objOfScene.tube);
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(vBegn);
                    geometry.vertices.push(vEnd);
                    var line = new THREE.Line(geometry, mat);
                    line.updateMatrixWorld();

                    //line.visible = false;
                    if (isLittle) {
                        innerTubes.push(objOfScene.tube);
                    }
                    if (!inner || lastObj == key) {
                        objOfScene.tube.inner = inner = true;
                        if (lastObj == key)lastObj = false;
                    } else {
                        innerTubes.push(objOfScene.tube);
                    }

                    line.tube = objOfScene.tube;
                    line.id_tub = id_tub++;
                    objOfScene.linsArray.push(line);
                    objOfScene.add(line);
                });
            }
            for (var tb = 0; tb < innerTubes.length; tb++) {
                innerTubes[tb].innerTubes = innerTubes;
            }
            if (isBig) {
                this.draw2DConnections(_2dCord, mat, objOfScene.object2D.tube2D);
            }
            //for 2d
            //var str = objOfScene.listOf2dCord[objOfScene.listOf2dCord.length - 1],
            //    mat = new THREE.LineBasicMaterial({
            //        color: 0x0000ff, side: THREE.DoubleSide
            //    });

            /* for (var i = 0; i < objOfScene.listOf2dCord.length; i++) {
             var cur = objOfScene.listOf2dCord[i];
             var geometry = new THREE.Geometry();
             geometry.vertices.push(new THREE.Vector3(str.x, str.y, str.z));
             geometry.vertices.push(new THREE.Vector3(cur.x, cur.y, cur.z));
             var line = new THREE.Line(geometry, mat);
             line.updateMatrixWorld();
             line.vBegn = geometry.vertices[0].clone();
             line.vEnd = geometry.vertices[1].clone();
             objOfScene.object2D.tube2D.add(line);
             str = cur;
             }*/
        },// draw tubes on screen
        draw2DConnections: function (_2dCord, mat, obj, vis) {
            var last2dObj = _2dCord.length - 2,
                innerTubes = [], isLittle = _2dCord.length == 3;
            while (_2dCord.length) {
                var cur = _2dCord.shift(), inner = false;
                $.each(_2dCord, function (key, nextObject) {
                    var next = nextObject,
                        vBegn = new THREE.Vector3(cur.x, cur.y, cur.z),
                        vEnd = new THREE.Vector3(next.x, next.y, next.z);

                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd, false, 0.03);
                    var line = new THREE.Mesh(tubeGeometry, mat);// new THREE.Line(geometry, mat);
                    line.updateMatrixWorld();
                    line.category = 'tube';
                    line.vBegn = vBegn;//geometry.vertices[0].clone();
                    line.vEnd = vEnd;//geometry.vertices[1].clone();
                    if (isLittle) {
                        innerTubes.push(line);
                    }
                    if (!inner) {
                        line.inner = inner = true;
                    } else if (last2dObj == key) {
                        last2dObj = false;
                        line.inner = true;
                    } else {
                        innerTubes.push(line);
                    }
                    if (vis) {
                        if (line.inner) {
                            line.visible = vis.v1;
                        } else {
                            line.visible = vis.v2;
                        }
                    }
                    obj.add(line);
                })
            }
            for (var tb = 0; tb < innerTubes.length; tb++) {
                innerTubes[tb].innerTubes = innerTubes;
            }
        },
        drawCircle: function (number) {
            var circleCenter = aveageNum ? aveageNum : Math.average(number),
                radius = radiusOfMainSphere ? radiusOfMainSphere : Math.sphereRadius(number, circleCenter),
                sphereCenter = App.utils.types.sphereCenter,
                geometrySphere = new THREE.SphereGeometry(radius, 32 + radius, 32 + radius),
                materialSphere = new THREE.MeshNormalMaterial({
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.FrontSide
                });
            objOfScene.radiousObj = radius;
            objOfScene.sphere = new THREE.Mesh(geometrySphere, materialSphere);
            objOfScene.sphere.rd = radius;
            objOfScene.sphere.renderOrder = 2;
            objOfScene.sphere.category = 'circle';
            objOfScene.add(objOfScene.sphere);

            if (!isBig) {
                objOfScene.sphere.position.set(sphereCenter.c_xy, sphereCenter.c_xy, sphereCenter.c_z);
                //objOfScene.circle2D.position.set(sphereCenter.c_xy, sphereCenter.c_xy, sphereCenter.c_z);
            } else {
                objOfScene.sphere.position.set(circleCenter, circleCenter, circleCenter);
                //objOfScene.circle2D.position.set(circleCenter, circleCenter, circleCenter);
                this.draw2DCircle(objOfScene, false, true);
            }


        },// draw sphere on screen
        draw2DCircle: function (objOfScene, mat, vis) {

            var pos2d = Math.get2DFigureCenter(objOfScene.listOf2dCord);
            pos2d.z = objOfScene.listOf2dCord[0].z;
            var radious2d = Math.getDistBtwTwoPoints(pos2d, objOfScene.listOf2dCord[0]);
            var matr = mat ? mat : new THREE.MeshBasicMaterial({
                color: 0x9012e8, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0.3
            });
            objOfScene.circle2D = new THREE.Mesh(new THREE.TorusGeometry(radious2d, 0.01, 30, 200), matr);
            objOfScene.circle2D.radious2d = radious2d;
            objOfScene.circle2D.rd = radious2d;
            objOfScene.circle2D.updateMatrixWorld();
            objOfScene.circle2D.visible = vis;
            objOfScene.circle2D.category = 'circle';
            objOfScene.object2D.add(objOfScene.circle2D);
            objOfScene.object2D.sphere = (objOfScene.circle2D);
            objOfScene.circle2D.position.set(pos2d.x, pos2d.y, pos2d.z);

            /****---cirfcle info**/
            var matrl = new THREE.MeshBasicMaterial({
                    color: 0x00ff00, side: THREE.DoubleSide
                }),
                _2dCI = objOfScene.object2D.circleInfo;
            //circle
            _2dCI.circle = new THREE.Mesh(new THREE.TorusGeometry(radious2d + 0.05, 0.03, 30, 200), matrl);
            _2dCI.add(_2dCI.circle);

            //radious
            var scal = radious2d > 4 ? (Math.round(radious2d / 2)) : (Math.round(radious2d * 1.8)),
                crtSpr = App.utils.interfaces.createSprite,
                scl = Math.round(radious2d * 10),
                deltSc = radious2d > 3 ? 0 : 0.1,
                setSpt = {
                    fontsize: radious2d > 3 ? radious2d + 27 : scl - scl * deltSc,
                    borderThickness: 1,
                    isBorder: true,
                    canvasHeight: 145,//radious2d>3?65+radious2d*2:45,
                    canvasWidth: radious2d > 3 ? 8 : 5,
                    shift: {x: 8.5, y: 11},
                    strokeColor: "rgba(0, 255, 0, 1)",
                    backColor: "rgba(0, 0, 0, 0.0)"
                },
                vBegn = new THREE.Vector3(),
                x = 0 + Math.cos(90 * (Math.PI / 180)) * radious2d,
                y = 0 + Math.sin(90 * (Math.PI / 180)) * radious2d,
                vEnd = new THREE.Vector3(x, y, 0.1),
                tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd, false, 0.03);
            scal = 1.5;

            _2dCI.tube = new THREE.Mesh(tubeGeometry, matrl);
            _2dCI.add(_2dCI.tube);
            _2dCI.rTltp = crtSpr('R = ' + (radious2d.toFixed(2)), setSpt);

            if (radious2d < 3) {
                _2dCI.rTltp.position.set(0.4, 0.1, 0.1);
            } else {
                _2dCI.rTltp.position.set(0.8, 0.8, 0.1);
            }

            _2dCI.rTltp.scale.multiplyScalar(scal);
            _2dCI.add(_2dCI.rTltp);
            var circleSurface = (Math.PI * Math.pow(radious2d, 2)).toFixed(2),
                tooltipS = createTooltip({
                    msg: 'Circle Surphase = ' + circleSurface,
                    fontsize: setSpt.fontsize,
                    x: radious2d,
                    delta: radious2d > 10 ? 10 : 100
                });
            if (radious2d < 3) {
                tooltipS.position.set(0.2, -0.4, 0.1);

            } else {
                tooltipS.position.set(0.4, -0.8, 0.1);
            }

            if (radious2d < 2) {
                tooltipS.scale.multiplyScalar(1.15 * scal);
            } else {
                var del = 0.0;
                for (var i = 0; i < radious2d; i++) {
                    del += 0.1;
                }
                var s = (1.8 + del) * scal;
                tooltipS.scale.multiplyScalar(s);
            }
            _2dCI.sTltp = tooltipS;
            _2dCI.add(tooltipS);

            //perimete
            var delta = 2 * radious2d
            setSpt.textCircle = {x: delta, rad: delta}
            setSpt.canvasWidth = 5;
            _2dCI.dTltp = crtSpr('D = ' + ((2 * Math.PI * radious2d).toFixed(2)), setSpt);
            _2dCI.dTltp.scale.set(setSpt.textCircle.x, setSpt.textCircle.x, 1);
            _2dCI.dTltp.position.z = 0.1;
            _2dCI.add(_2dCI.dTltp);


            function createTooltip(par) {
                var can = document.createElement('canvas'),
                    ctx = can.getContext('2d'),
                    fd = par,
                    fc = {x: fd.x * fd.delta};
                can.width = fd.fontsize * (fd.msg.length / 2);
                can.height = fd.fontsize + 5;
                ctx.font = "bold " + fd.fontsize + "px Arial";
                ctx.fillStyle = "rgba(0, 255, 0, 1)";
                ctx.fillText(fd.msg, 0, fd.fontsize);
                var texture = new THREE.Texture(can);
                texture.needsUpdate = true;
                texture.minFilter = THREE.LinearFilter;
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture, rotation: 0,
                    transparent: true, opacity: 1.0
                });
                var sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(1, can.height / can.width, 1);
                //console.log(fd.msg.length);
                //document.getElementById('test').appendChild(can);
                return sprite;
            }

        },
        draw2DSL: function (arr, gs, _2dGS) {
            var mat = new THREE.MeshBasicMaterial({
                color: 0x00ff00, side: THREE.DoubleSide
            });

            if (gs) {
                var tooltp = addTooltip({backColor: "rgba(255, 255, 255, 1.0)", isRound: true, val: 'GS=' + gs.val});
                tooltp.position.set(gs.pst.x, gs.pst.y - 0.1, 0.1);
                tooltp.category = 'tooltipGS';
                tooltp.scale.multiplyScalar(3);
                _2dGS.add(tooltp);
            } else {
                for (var i = 0; i < arr.length; i++) {
                    var curObj = arr[i], fv = curObj.name.split('...'),
                        endT = false;
                    if (fv.length == 2) {
                        for (var kl = 0; kl < fv.length; kl++) {
                            if (fv[kl].length == 1) {
                                fv[kl] = '00' + fv[kl];
                            } else if (fv[kl].length == 2) {
                                fv[kl] = '0' + fv[kl];
                            }
                        }
                        //get 2d coordiantes
                        var crd = App.rebuild2D.get2DCoordinat(fv);
                        //draw line
                        var vBegn = new THREE.Vector3(crd[0]['x'], crd[0]['y'], crd[0]['z']),
                            vEnd = new THREE.Vector3(crd[1]['x'], crd[1]['y'], crd[1]['z']),
                            endT = vEnd;
                        var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd, false, 0.03);
                        var line = new THREE.Mesh(tubeGeometry, mat);
                        line.position.y = -0.05;
                        line.updateMatrixWorld();
                        line.vBegn = vBegn;
                        line.vEnd = vEnd;
                        line.category = 'line';
                        _2dGS.add(line);

                    }
                    //draw tooltip
                    var tooltp = addTooltip({backColor: "rgba(0, 0, 0, 0.0)", val: "SL" + i + '=' + curObj.sum});
                    if (!endT) {
                        endT = App.rebuild2D.get2DCoordinat([curObj.name])[0];
                    }
                    tooltp.position.set(endT.x + 0.5, endT.y - 0.1, 0.1);
                    tooltp.category = 'tooltip';
                    tooltp.scale.multiplyScalar(2);
                    _2dGS.add(tooltp);

                }
            }
            function addTooltip(obj) {
                var st = obj.val.toString().length >= 4 ? 6 : 5;
                return App.utils.interfaces.createSprite(obj.val, {
                    fontsize: 17,
                    borderThickness: 1,
                    isBorder: true,
                    canvasHeight: 45,
                    canvasWidth: st,
                    shift: {x: 8.5, y: 11},
                    strokeColor: "rgba(0, 255, 0, 1)",
                    isRoundCorner: obj.isRound,
                    backColor: obj.backColor
                });
            }
        },
        drawShape: function (resArr, num) {
            if (resArr.length > 1) {
                var geometry = App.utils.interfaces.createMultipointPolygon(resArr, num);
                var material = new THREE.MeshBasicMaterial({
                    color: 0x9012e8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0
                });
                var materials = [material];
                objOfScene.shapeObj = THREE.SceneUtils.createMultiMaterialObject(new THREE.ConvexGeometry(geometry.vertices), materials);
                //objOfScene.shapeObj.castShadow = true;
                //objOfScene.shapeObj.receiveShadow = false;
                objOfScene.shape = objOfScene.shapeObj.children[0];
                //console.log(objOfScene.shape);
                objOfScene.add(objOfScene.shapeObj);

                //2d
                if (isBig) {
                    this.draw2DShape(objOfScene, materials);
                }
            }
        },// draw shape on screen
        draw2DShape: function (objOfScene, materials) {
            var geometry = App.utils.interfaces.createMultipointPolygon(objOfScene.listOf2dCord, 3);
            objOfScene.shapeObj2d = THREE.SceneUtils.createMultiMaterialObject(new THREE.ConvexGeometry(geometry.vertices), materials);
            objOfScene.shape2D = objOfScene.shapeObj2d.children[0];
            //console.log('test',objOfScene.shape2D);
            objOfScene.object2D.add(objOfScene.shape2D);
        },
        drawCorners: function (objectsForConnect) {
            var rayCast = new THREE.Raycaster(), currentObject, j = 0, curd = [];
            if (objectsForConnect.length == 3) {
                this.createAngle(objectsForConnect[0].position, objectsForConnect[1].position, objectsForConnect[2].position);
                this.createAngle(objectsForConnect[0].position, objectsForConnect[2].position, objectsForConnect[1].position);
                this.createAngle(objectsForConnect[2].position, objectsForConnect[1].position, objectsForConnect[0].position);
                return;
            } else if (objectsForConnect.length < 3) {
                return;
            }
            objectsForConnect.push(objectsForConnect[0]);
            while (j < objectsForConnect.length) {
                currentObject = objectsForConnect[j++];
                var interObj, interObj_third, curd = [], targetPos;
                for (var i = 0; i < objectsForConnect.length; i++) {
                    if (objectsForConnect[i] !== currentObject) {
                        curd.push(objectsForConnect[i].position);
                    }
                }
                var maxLengthCount = curd.length;
                for (var i = 0; i < maxLengthCount; i++) {
                    var direction = new THREE.Vector3().subVectors(curd[i], currentObject.position);
                    rayCast.set(currentObject.position, direction.clone().normalize());
                    interObj = rayCast.intersectObjects(objOfScene.tubesArray, true);
                    for (var n = 0; n < interObj.length; n++) {
                        var point = interObj[n].point, inX = point.x.toFixed(2), inY = point.y.toFixed(2), inZ = point.z.toFixed(2),
                            interPoints = new THREE.Vector3(parseFloat(inX), parseFloat(inY), parseFloat(inZ)),
                            inX = Math.round(inX), inY = Math.round(inY), inZ = Math.round(inZ),
                            interPoint = inX + '' + inY + '' + inZ;
                        if (curd[i].x == inX && curd[i].y == inY && curd[i].z == inZ) {
                            if (j < objectsForConnect.length && (objectsForConnect[j].position != curd[i])) {
                                var point = [];
                                point.push(objectsForConnect[j].position);
                                point.push(currentObject.position);
                                point.push(curd[i]);
                                if (!this.checkAccesessRemotePoint(point)) {
                                    this.createAngle(objectsForConnect[j].position, currentObject.position, curd[i]);
                                    this.accessRemotePoint.push(point);
                                } else {
                                    //console.log('f');

                                }

                            }
                        } else if (this.checkIntersectPoint(interPoint)) {
                            if (this.checkAccesessIntersectPoint(interPoint, currentObject.position, interObj[n].object)) {
                                this.createAngle(interObj[n], currentObject, false);
                            }

                        } else {
                            this.intersectPoint.push(interPoint);
                            //this.intersectPoints.push(interPoints);
                            this.accessPoint.push({key: curd[i], value: interPoint, point: interPoints});
                            this.createAngle(interObj[n], currentObject, false);
                        }

                    }
                }

            }
            //console.log(this.accessRemotePoint);
        },// draw corners on screen
        getIntersectPoints: function (objectsForConnect) {
            /**if figure has only 3 points**/
            if (objectsForConnect.length == 3) {
                var sq = this.drawSquareByPoints(objectsForConnect);
                var angles = this.drawAngles(objectsForConnect);
                this.buildFigure(objectsForConnect, sq, angles.angles);
                this.finalSettings(objOfScene);
                return;
            } else if (objectsForConnect.length == 1) {
                return;
            }
            var rayCast = new THREE.Raycaster(), currentObject, j = 0, curd = [], newAr = [], curA;
            //objectsForConnect.push(objectsForConnect[0]);
            for (var i = 0; i < objectsForConnect.length; i++) {
                newAr.push(objectsForConnect[i].position.x + '.0;' + objectsForConnect[i].position.y + '.0;' + objectsForConnect[i].position.z + '.0');
            }

            /* get only intersects points btwn lines*/
            while (j < objectsForConnect.length) {
                curA = newAr[j];
                currentObject = objectsForConnect[j++];
                var interObj, interObj_third, curd = [], targetPos;
                for (var i = 0; i < objectsForConnect.length; i++) {
                    targetPos = objectsForConnect[i].position;
                    if (targetPos !== currentObject.position) {
                        curd.push(targetPos);
                    }
                }
                var maxLengthCount = curd.length;
                for (var i = 0; i < maxLengthCount; i++) {
                    var tubeId = this.getTubeByPoint(currentObject.position, curd[i], true);
                    var direction = new THREE.Vector3().subVectors(curd[i], currentObject.position);
                    rayCast.set(currentObject.position, direction.clone().normalize());
                    interObj = rayCast.intersectObjects(objOfScene.linsArray, true);
                    for (var n = 0; n < interObj.length; n++) {
                        var point = interObj[n].point, _inX = point.x.toFixed(1), _inY = point.y.toFixed(1), _inZ = point.z.toFixed(1),
                            _inX = _inX > 0 ? _inX : (_inX * (-1)) + '.0', _inY = _inY > 0 ? _inY : (_inY * (-1)) + '.0', _inZ = _inZ > 0 ? _inZ : (_inZ * (-1)) + '.0';
                        var interPoints = _inX + ';' + _inY + ';' + _inZ,
                            inX = Math.round(_inX), inY = Math.round(_inY), inZ = Math.round(_inZ),
                            interPoint = inX + '' + inY + '' + inZ;
                        var tubes = [];
                        tubes.push(tubeId);
                        tubes.push(interObj[n].object.tube);
                        if ((curd[i].x == inX && curd[i].y == inY && curd[i].z == inZ) || curA == interPoints) {

                        } else if (this.checkIntersectPoint1(interPoints, tubes, point)) {

                        }

                    }
                }

            }

            /* build  a sphere with center in intersect points */
            var mainPoin = objOfScene.pointsArray.concat([]), cur, pointRadious;
            if (radiusOfMainSphere < 1.41422) {
                pointRadious = 0.12;
            }/* else if (radiusOfMainSphere < 6.1643) {
             pointRadious = 0.1;
             } */ else {
                pointRadious = 0.1;
            }

            for (var i = 0; i < this.intersectPointsR.length; i++) {
                var cur = this.intersectPointsR[i].origin;
                var geometry = new THREE.SphereGeometry(pointRadious, 64, 64),
                    material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
                geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
                var sphere = new THREE.Mesh(geometry, material);
                sphere.position.x = (parseFloat(cur.x));
                sphere.position.y = (parseFloat(cur.y));
                sphere.position.z = (parseFloat(cur.z));
                sphere.category = 'point';
                sphere.isDropable = true;
                sphere.updateMatrixWorld();
                objOfScene.pointsArray.push(sphere);
                this.intersectPointsR[i].pointObj = sphere;
                objOfScene.tipsObject.add(sphere);
            }

            /* add main outer's points */
            for (var i = 0; i < mainPoin.length; i++) {
                mainPoin[i].updateMatrixWorld();
                this.intersectPointsR.push({
                    origin: mainPoin[i].position,
                    point: mainPoin[i].position,
                    pointObj: mainPoin[i]
                })
            }
            var s = this.intersectPointsR, d = rayCast, c = objOfScene;
            this.getAvialablePoints(s, d, c);
        },
        getTubeByPoint: function (point1, point2, flag, dimns) {
            var tubes1 = [], tubes2 = [];
            for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                var curTub = objOfScene.tubesArray[i].line;
                if (flag) {
                    if (
                        ((curTub.vBegn == point1) ||
                        (curTub.vEnd == point1)) &&
                        ((curTub.vBegn == point2) ||
                        (curTub.vEnd == point2))
                    ) {
                        if (dimns) {
                            return objOfScene.linsArray[i];
                        }
                        return objOfScene.tubesArray[i];
                    }
                }
                else if (
                    ((curTub.vBegn.x == point1.x && curTub.vBegn.y == point1.y && curTub.vBegn.z == point1.z) ||
                    (curTub.vEnd.x == point1.x && curTub.vEnd.y == point1.y && curTub.vEnd.z == point1.z)) &&
                    ((curTub.vBegn.x == point2.x && curTub.vBegn.y == point2.y && curTub.vBegn.z == point2.z) ||
                    (curTub.vEnd.x == point2.x && curTub.vEnd.y == point2.y && curTub.vEnd.z == point2.z))
                ) {
                    if (dimns) {
                        return objOfScene.linsArray[i];
                    }
                    return objOfScene.tubesArray[i];
                }
            }
        },
        getLineByPoint: function (point1, point2) {
            var lines = objOfScene.object2D.tube2D.children;
            //console.log(lines,point1,point2);
            for (var i = 0; i < lines.length; i++) {
                var curTub = lines[i];
                if (((curTub.vBegn.x == point1.x && curTub.vBegn.y == point1.y && curTub.vBegn.z == point1.z) ||
                    (curTub.vEnd.x == point1.x && curTub.vEnd.y == point1.y && curTub.vEnd.z == point1.z)) &&
                    ((curTub.vBegn.x == point2.x && curTub.vBegn.y == point2.y && curTub.vBegn.z == point2.z) ||
                    (curTub.vEnd.x == point2.x && curTub.vEnd.y == point2.y && curTub.vEnd.z == point2.z))) {
                    return lines[i];
                }
            }
            return false;

        },
        getAvialablePoints: function (points, rayCast, objOfScene) {
            var direction, interObj;
            var shapes = [], figure = {}, lastTub = [], array = objOfScene.tubesArray.concat([]), id_point = objOfScene.tubesArray.length;
            //array.concat(objOfScene.linsArray);
            /**cancat points and tubes**/
            for (var i = 0; i < objOfScene.pointsArray.length; i++) {
                objOfScene.pointsArray[i].id_point = id_point++;
                array.push(objOfScene.pointsArray[i]);
            }
            /** get all aviable point**/
            var d = true;
            var mat = new THREE.MeshBasicMaterial({
                color: 0x76FF03,
                side: THREE.DoubleSide
            });
            var rad = true, l = 0//1
            for (var i = 0; i < points.length; i++) {
                var curPoint = points[i], figure = {};
                figure.objF = [];
                figure.curPoint = curPoint;
                var tubes = curPoint.tubes;
                if (tubes) {
                    if ((curPoint.origin.x == aveageNum && curPoint.origin.z == aveageNum && curPoint.origin.y == aveageNum)) {
                        //console.log('test3');
                    } else {
                        //if (i == l)console.log(curPoint);
                        array.splice(curPoint.pointObj.id_point, 1);

                        for (var j = 0; j < points.length; j++) {
                            if ((curPoint.value != points[j].value )) {

                                var tubesR = points[j].tubes;
                                if (tubesR) {

                                    array.splice(tubesR[0].id_tub, 1);
                                    array.splice(tubesR[1].id_tub, 1);
                                }
                                direction = new THREE.Vector3().subVectors(points[j].pointObj.position, curPoint.pointObj.position);
                                rayCast.set(curPoint.pointObj.position, direction.clone().normalize());
                                interObj = rayCast.intersectObjects(array, true);

                                if (interObj[0]) {
                                    /* if (i == l) {
                                     //var x=points[j].point.x-curPoint.point.x;
                                     //var y=points[j].point.y-curPoint.point.y;
                                     //var z=points[j].point.z-curPoint.point.z;
                                     var length = interObj[0].distance;//Math.sqrt(x*x+y*y+z*z);
                                     App.utils.types.webgl.scene.add(new THREE.ArrowHelper(direction.clone().normalize(), curPoint.pointObj.position, length, 0xf67f00));
                                     }*/
                                    if (interObj[0].object == points[j].pointObj) {
                                        figure.objF.push(points[j]);
                                        /* if (i == l) {
                                         points[j].pointObj.material = mat;
                                         }*/
                                    }
                                }
                                if (tubesR) {
                                    array.splice(tubesR[1].id_tub, 0, tubesR[1]);
                                    array.splice(tubesR[0].id_tub, 0, tubesR[0]);
                                }
                            }

                        }

                        array.splice(curPoint.pointObj.id_point, 0, curPoint.pointObj);
                        shapes.push(figure);
                    }
                }
            }
            /**sorting**/
            for (var i = 0; i < shapes.length; i++) {
                for (var j = 0; j < shapes[i].objF.length; j++) {
                    shapes[i].objF[j].cornerR = Math.getCornerBtwTwoPoints(shapes[i].curPoint.pointObj.position, shapes[i].objF[j].pointObj.position);
                }
                shapes[i].objF.sort(function (a, b) {
                    return a.cornerR - b.cornerR
                });
                this.buildSubFigure(shapes[i]);
            }
            /**add tooltip and build figures**/
            var curP, newFig;
            for (var i = 0; i < objOfScene.polygonsAr.length; i++) {
                curP = objOfScene.polygonsAr[i];
                for (var j = 0; j < curP.length; j++) {
                    newFig = this.drawAngles(curP[j]);
                    var f = newFig.pnts ? newFig.pnts : curP[j];
                    var sq = this.drawSquareByPoints(f)
                    //    ,per= 0,prev=f[f.length-1].position;
                    //for(var js=0;js< f.length;js++){
                    //    var curPst = f[js].position;
                    //    per +=Math.getDistBtwTwoPoints(prev,curPst);
                    //    prev =curPst;
                    //}

                    this.buildFigure(f, sq, newFig.angles);
                }
            }
            /*drop intersect sphere-points */
            this.finalSettings(objOfScene);

        },
        buildFigure: function (arr, square, angles, perimeter) {
            var pnts = arr, val = angles, pr = perimeter;
            if (arr[0] instanceof THREE.Mesh) {
                pnts = [], pr = 0;
                var prev = arr[arr.length - 1].position;
                for (var i = 0; i < arr.length; i++) {
                    var cur = arr[i].position,
                        nPnts = {x: cur.x, y: cur.y, z: cur.z};
                    pr += Math.getDistBtwTwoPoints(prev, cur);
                    prev = cur;
                    pnts.push(nPnts);
                }
                val = '';
                for (var iA = 0; iA < angles.length; iA++) {
                    var c = angles[iA];
                    for (var iC = 0; iC < c.length; iC++) {
                        val += c[iC].angle + '\xB0,';
                    }
                }
                pr = pr.toFixed(2);
                val = val.substr(0, val.length - 1);
                sendData.figures.push({pnts: pnts, sq: square, cr: val, pr: pr});

            }


            var geometry = App.utils.interfaces.createMultipointPolygon(pnts, 3);
            var material = new THREE.MeshBasicMaterial({
                color: 0x1F2AB5,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2
            });
            var materials = [material],
                shapeObj = THREE.SceneUtils.createMultiMaterialObject(new THREE.ConvexGeometry(geometry.vertices), materials),
                shape = shapeObj.children[0];
            shapeObj.visible = false;
            shape.category = 'subFigure';
            shape.dataInfo = {sq: square, angls: val, pr: pr};

            figuresOnSimpleObj.add(shapeObj);
            figuresOnSimpleObj.childs.push(shape);

            var shapeObj2D = shapeObj.clone(),
                shape2D = shapeObj2D.children[0];
            shapeObj2D.visible = false;
            shape2D.category = 'subFigure';
            shape2D.dataInfo = shape.dataInfo;
            //var ps = shape2D.position,dst = Math.getDistBtwTwoPoints(new THREE.Vector3(),ps);
            //shape2D.position.set(ps.x-dst,ps.y-dst,ps.z-dst);

            _2dSmFgr.add(shapeObj2D);
            _2dSmFgr.childs.push(shape2D);

        },
        finalSettings: function (objOfScene) {
            var curChild, listOfPoints = [];
            for (var i = 0; i < objOfScene.pointsArray.length; i++) {
                if (objOfScene.pointsArray[i].isDropable) {
                    objOfScene.tipsObject.remove(objOfScene.pointsArray[i]);
                } else {
                    listOfPoints.push({
                        pos: objOfScene.pointsArray[i].position,
                        dimensnP: objOfScene.pointsArray[i].dimensnP,
                        tooltip: objOfScene.pointsArray[i].tooltip
                    });
                    objOfScene.remove(objOfScene.pointsArray[i]);
                }

            }
            objOfScene.pointsArray = [];
            for (var i = 0; i < listOfPoints.length; i++) {
                //objOfScene.pointsArray.shift();
                var pointO = listOfPoints[i];
                var geometry = new THREE.SphereGeometry(0.07, 16, 9);
                var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0x9012e8, side: THREE.DoubleSide});
                geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
                objOfScene.pointSphere = new THREE.Mesh(geometry, material);
                objOfScene.pointSphere.category = 'points';
                objOfScene.pointSphere.tooltip = pointO.tooltip;
                objOfScene.pointSphere.dimensnP = pointO.dimensnP;
                objOfScene.pointSphere.position.set(pointO.pos.x, pointO.pos.y, pointO.pos.z);
                objOfScene.pointsArray.push(objOfScene.pointSphere);
                objOfScene.add(objOfScene.pointSphere);
                objectsForConnect.push(objOfScene.pointSphere);
            }

            for (var i = 0; i < objOfScene.linsArray.length; i++) {
                objOfScene.remove(objOfScene.linsArray[i]);
            }

        },
        drawAngles: function (arr) {
            var corneresOfObj = [], newArr, index = 0, correctSumAngle, eps = 2;
            if (arr.length == 3) {
                corneresOfObj.push(this.createAngle(arr[arr.length - 1].position, arr[1].position, arr[0].position));
                corneresOfObj.push(this.createAngle(arr[0].position, arr[arr.length - 1].position, arr[arr.length - 2].position));
                for (var i = 0; i < arr.length && i + 2 < arr.length; i++) {
                    corneresOfObj.push(this.createAngle(arr[i].position, arr[i + 1].position, arr[i + 2].position));
                }
            } else {
                newArr = this.perm(arr);
                for (var k = 0; k < newArr.length; k++) {
                    index = k;
                    var arrs = newArr[k];
                    var curAngle = arrs[arrs.length - 1].position;
                    for (var i = 0; i < arrs.length && i + 1 < arrs.length; i++) {
                        corneresOfObj.push(this.createAngle(curAngle, arrs[i + 1].position, arrs[i].position));
                        curAngle = arrs[i].position;
                    }
                    corneresOfObj.push(this.createAngle(curAngle, arrs[0].position, arrs[arrs.length - 1].position));
                    var sumAngle = 0;
                    for (var i = 0; i < corneresOfObj.length; i++) {
                        sumAngle += corneresOfObj[i][0].angle;
                    }
                    correctSumAngle = 180 * (arrs.length - 2);
                    if (sumAngle > (correctSumAngle - eps) && sumAngle < (correctSumAngle + eps)) {
                        break;
                    } else {
                        corneresOfObj = [];
                    }

                }

            }

            this.addAngleTooltip(corneresOfObj);

            if (newArr) {
                return {pnts: newArr[index], angles: corneresOfObj};
            } else {
                return {pnts: false, angles: corneresOfObj};
            }
        },
        perm: function (arr) {
            if (arr.length > 1) {
                var beg = arr[0];
                var arr1 = this.perm(arr.slice(1));
                var arr2 = [];
                var l = arr1[0].length;
                for (var i = 0; i < arr1.length; i++)
                    for (var j = 0; j <= l; j++)
                        arr2.push(arr1[i].slice(0, j).concat(beg, arr1[i].slice(j)));
                return arr2;
            } else return [arr];
        },
        buildSubFigure: function (figure) {
            var polygons = [], polygon = [], firstEl, lastAdEl, tubs, curFT = figure.curPoint.tubes, strtCrPo = true;

            for (var i = 0; i < figure.objF.length; i++) {
                tubs = figure.objF[i].tubes;
                if (tubs) {
                    if ((tubs[0] == curFT[0] || tubs[1] == curFT[0] ||
                        tubs[0] == curFT[1] || tubs[1] == curFT[1])) {
                        if (strtCrPo) {
                            polygon.push(figure.objF[i].pointObj);
                            figure.objF.push(figure.objF[i]);
                            strtCrPo = false;
                        } else {
                            if (lastAdEl) polygon.push(lastAdEl);
                            polygon.push(figure.objF[i].pointObj);
                            polygons.push(polygon);
                            polygon = [];
                            lastAdEl = figure.objF[i].pointObj;
                        }
                    } else if (strtCrPo) {
                        figure.objF.push(figure.objF[i]);
                    } else {
                        polygon.push(figure.objF[i].pointObj);
                    }
                } else {
                    if (strtCrPo) {
                        polygon.push(figure.objF[i].pointObj);
                        figure.objF.push(figure.objF[i]);
                        strtCrPo = false;
                    } else {
                        if (lastAdEl) polygon.push(lastAdEl);
                        polygon.push(figure.objF[i].pointObj);
                        polygons.push(polygon);
                        polygon = [];
                        lastAdEl = figure.objF[i].pointObj;
                    }
                }
            }

            for (var i = 0; i < polygons.length; i++) {
                //polygons[i].splice(0, 0, figure.curPoint.pointObj);
                polygons[i].push(figure.curPoint.pointObj);
            }

            this.filterPolygons(polygons);
        },
        filterPolygons: function (polygons) {
            var curPolygon, curPolygonCash, countP = 1, sumAngle, curPoint;
            for (var i = 0; i < polygons.length; i++) {
                curPolygon = polygons[i];
                if (curPolygon) {
                    var check = true;
                    if (check && curPolygon.length > 5 || i > 4) {
                        //console.log('test2')
                        polygons.splice(i--, 1);
                    } else if (check) {
                        for (var j = 0; j < objOfScene.polygonsAr.length; j++) {
                            curPolygonCash = objOfScene.polygonsAr[j];
                            for (var d = 0; d < curPolygonCash.length; d++) {
                                var curO = curPolygonCash[d];
                                if (curO) {
                                    countP = 0, sumAngle = 0, curPoint = curO[curO.length - 1];
                                    for (var kl = 0; kl < curO.length; kl++) {
                                        for (var kd = 0; kd < curPolygon.length; kd++) {
                                            if (curPolygon[kd].id == curO[kl].id) {
                                                ++countP;
                                                break;
                                            }
                                        }
                                    }
                                    if (countP == curPolygon.length) {
                                        polygons.splice(i--, 1);
                                        //console.log('test__')
                                    }
                                    else if (countP > 2) {
                                        if (curPolygon.length > curO.length) {
                                            //console.log('test1');
                                            curPolygonCash.splice(d--, 1)
                                        } else {
                                            //console.log('test ***',curO.length)
                                            polygons.splice(i--, 1);
                                        }
                                    } else if (curPolygon.length > 2) {
                                        if (Math.getSquareByPoints(curPolygon[0].position, curPolygon[1].position, curPolygon[2].position) == 0) {
                                            polygons.splice(i--, 1);
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
            objOfScene.polygonsAr.push(polygons);

        },
        drawSquareByPoints: function (arr) {
            var square = 0, pos;
            if (arr.length == 3) {
                square = Math.getSquareByPoints(arr[0].position, arr[1].position, arr[2].position)
            } else {
                for (var i = 1; i < arr.length && i + 1 < arr.length; i++) {
                    square += Math.getSquareByPoints(arr[0].position, arr[i].position, arr[i + 1].position);
                }
            }
            square = square.toFixed(2);
            pos = Math.getPositionForValueOfCorner(arr[0].position, arr[1].position, arr[2].position, null, true);
            this.createSquareForObj({square: square, pos: pos});
            return square;
        },
        createPolygon: function (strtCrPo, polygon, polygons, lastAdEl, figure) {
            if (!strtCrPo.strt) {
                polygon.push(figure);
                strtCrPo.strt = true;
            } else {
                if (lastAdEl.l) polygon.push(lastAdEl.l);
                polygon.push(figure);
                polygons.push(polygon);
                polygon = [];
                lastAdEl.l = figure;
            }
        },
        enableTubes: function (obj, val) {
            var cur;
            for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                cur = objOfScene.tubesArray[i];
                if (cur.id == obj[0] || cur.id == obj[1]) {
                    cur.visible = val;
                }
            }
        },
        createAngle: function createAngle(interObj, currentObject, endPoint) {
            var angle, positionAngle, corners = [], square = {};
            if (endPoint) {
                angle = Math.getCornerBtwTwoVercorsAndIntrsctinPnt(interObj, currentObject, endPoint);
                positionAngle = Math.getPositionForValueOfCorner(currentObject, endPoint, interObj, false);
                corners.push({angle: parseFloat(angle), position: positionAngle, origin: angle});
            } else {
                angle = Math.getCornerBtwTwoVercorsAndIntrsctinPnt(interObj.object.line.vBegn, currentObject.position, interObj.point);
                positionAngle = Math.getPositionForValueOfCorner(currentObject.position, interObj.point, interObj.object.line.vBegn, false);
                corners.push({angle: parseFloat(angle), position: positionAngle, origin: angle});
                angle = Math.getCornerBtwTwoVercorsAndIntrsctinPnt(interObj.object.line.vEnd, currentObject.position, interObj.point);
                positionAngle = Math.getPositionForValueOfCorner(currentObject.position, interObj.point, interObj.object.line.vEnd, false);
                corners.push({angle: parseFloat(angle), position: positionAngle, origin: angle});
            }
            return this.checkCorrectAnge(corners);
            //console.log(Corner);


        },// get angle
        addAngleTooltip: function (arr) {
            var Corner;
            for (var ui = 0; ui < arr.length; ui++) {
                Corner = arr[ui];
                for (var u = 0; u < Corner.length; u++) {
                    var checkAngle = Math.round(Corner[u].origin);
                    if (checkAngle == 0 || checkAngle == 180 || Corner[u].origin.toString() == 'NaN') {

                    } else {
                        var angleOr = Corner[u].origin + '', separ = angleOr.indexOf(".");
                        angleOr = angleOr.length > 2 ? angleOr.substr(0, separ + 8) + '\xB0' : angleOr.substr(0, separ + 8) + '\xB0 ';
                        App.guiObj.listOgAngles.push(angleOr);
                        this.createSpriteForObj({
                            text_f: Corner[u].angle + '\xB0',
                            text_s: angleOr,
                            position: Corner[u].position,
                            category: 'angle',
                            backColor: "rgba(255, 255, 0, 1)",
                            canvasHeight: 39,
                            fontsize: 12,
                            shift: {x: 8.5, y: 11}
                        });
                    }
                }
            }
        },
        createSquareForObj: function (obj) {
            var square = obj.square, pos = obj.pos;
            App.guiObj.listOfSquares.push(square + 'mm\xB2');

            var sprite = App.utils.interfaces.createSprite(square + 'mm\xB2', {
                fontsize: 14,
                borderThickness: 1,
                canvasWidth: 2,
                canvasHeight: 45,
                shift: {x: 8.5, y: 11},
                backColor: "rgba(0, 200, 0, 1)"
            });
            sprite.position.x = pos.x;
            sprite.position.y = pos.y;
            sprite.position.z = pos.z;
            sprite.category = 'square';
            sprite.visible = false;
            objOfScene.tipsArray.push(sprite);
            objOfScene.tipsObject.add(sprite);

            //2d
            var copy = sprite.clone(), trans = objOfScene.sphere.position;
            copy.visible = true;
            copy.category = square;
            copy.position.z -= trans.z;
            copy.position.x -= trans.x;
            copy.position.y -= trans.y;
            _2dSq.add(copy);

            sendData.squareTooltips.push(obj);
        },
        createSpriteForObj: function (obj) {
            objOfScene.Sprite = App.utils.interfaces.createSprite(obj.text_f, {
                fontsize: obj.fontsize,
                borderThickness: 1,
                canvasWidth: 2,
                canvasHeight: obj.canvasHeight,
                shift: obj.shift,
                backColor: obj.backColor
            }, obj.text_s);
            objOfScene.Sprite.category = obj.category;
            objOfScene.Sprite.visible = obj.id2D ? true : false;
            if (obj.id2D) {
                objOfScene.Sprite.position.set(obj.position._2d.x, obj.position._2d.y, obj.position._2d.z);
                objOfScene.object2D.corner2D.add(objOfScene.Sprite);
                if (objOfScene.listOfPointes.length > 3) {
                    var copy = objOfScene.Sprite.clone();
                    copy.category = obj.category;
                    copy.textHover = objOfScene.Sprite.textHover;
                    copy.position.set(obj.position._3d.x, obj.position._3d.y, obj.position._3d.z);
                    objOfScene.angleOute.add(copy);
                }
            } else {
                objOfScene.Sprite.position.set(obj.position.x, obj.position.y, obj.position.z);
                objOfScene.tipsArray.push(objOfScene.Sprite);
                objOfScene.tipsObject.add(objOfScene.Sprite);
                //if(objOfScene.listOfPointes.length > 3) {
                var copy = objOfScene.Sprite.clone(), trans = objOfScene.sphere.position;
                copy.visible = true;
                copy.category = obj.category;
                copy.textHover = objOfScene.Sprite.textHover;
                copy.position.z -= trans.z;
                copy.position.x -= trans.x;
                copy.position.y -= trans.y;
                _2dCrnIn.add(copy);
                //}
            }
            delete obj.shift;
            delete obj.backColor;
            delete obj.canvasHeight;
            delete obj.fontsize;
            sendData.angleTooltips.push(obj);
        },
        checkAccesessIntersectPoint: function (point, acsesPoin, tubes) {
            for (var i = 0; i < this.accessPoint.length; i++) {
                if (this.accessPoint[i].value == point) {
                    return this.accessPoint[i].key == acsesPoin;
                }
            }
        },// save intersect point
        checkAccesessRemotePoint: function (points) {
            var access = 0, curObj;
            for (var i = 0; i < this.accessRemotePoint.length; i++) {
                curObj = this.accessRemotePoint[i];
                for (var j = 0; j < points.length; j++) {
                    for (var ij = 0; ij < curObj.length; ij++) {
                        if (curObj[ij] == points[j]) {
                            ++access;
                            break;
                        }
                    }
                }
            }
            return (access == points.length);
        },// save intersect point
        checkIntersectPoint: function (point) {
            for (var i = 0; i < this.intersectPoint.length; i++) {
                if (this.intersectPoint[i] == point) {
                    return true;
                }
            }
        },// is intersect point access
        checkIntersectPoints: function (point) {
            var p = {}
            p.x = Math.round(point.x);
            p.y = Math.round(point.y);
            p.z = Math.round(point.z);
            for (var i = 0; i < this.intersectPoints.length; i++) {
                var cur = this.intersectPoints[i], c = {};
                c.x = Math.round(cur.x);
                c.y = Math.round(cur.y);
                c.z = Math.round(cur.z);
                if (c == p) {
                    return true;
                }
            }
        },// is intersect point access
        checkAccesessIntersectPoint1: function (point, acsesPoin, tubes) {
            for (var i = 0; i < this.accessPoints.length; i++) {
                if (this.accessPoints[i].value == point) {
                    return this.accessPoints[i].key == acsesPoin;
                }
            }
        },// save intersect point
        checkIntersectPoint1: function (point, tubes, origin) {
            var intRs;
            for (var i = 0; i < this.intersectPointsR.length; i++) {
                intRs = this.intersectPointsR[i]
                if (intRs.value == point || (intRs.tubes[0] == tubes[0] && intRs.tubes[1] == tubes[1]) || (intRs.tubes[1] == tubes[0] && intRs.tubes[0] == tubes[1])
                    || tubes[0] == tubes[1] || (tubes[0].line.vBegn == tubes[1].line.vBegn || tubes[0].line.vBegn == tubes[1].line.vEnd ||
                    tubes[0].line.vEnd == tubes[1].line.vBegn || tubes[0].line.vEnd == tubes[1].line.vEnd)) {
                    return true;
                }
            }

            this.intersectPointsR.push({
                value: point,
                tubes: tubes,
                origin: origin
            });
        },// is intersect point access
        setCurrentObj: function (point) {
            for (var i = 0; i < this.listTriangles.length; i++) {
                if (point == this.listTriangles[i].point) {
                    this.listTriangles[i].value += 1;
                    return;
                }
            }
            this.listTriangles.push({point: point, value: 0});
        },// save face
        checkCorrectAnge: function (angles) {
            var newAngle = [], angleSum = 0;
            for (var i = 0; i < angles.length; i++) {
                var angleP = Math.round(angles[i].angle);
                angleSum += angleP;
                newAngle.push({angle: angleP, position: angles[i].position, origin: angles[i].angle});
            }
            if (2 * (angleSum) == 360 || angles.length == 1) {
                return newAngle;
            } else {
                angles[0].angle = Math.floor(angles[0].angle);
                angles[1].angle = Math.floor(angles[1].angle);
                return angles;
            }
        },//correct round angle
        startEffect: function (objOfScene) {
            var utils = App.utils, types = utils.types, objEf, factor = radiusOfMainSphere / 50, sphere = new THREE.SphereGeometry(radiusOfMainSphere + 1, 36, 36), scale = 0.0;
            switch (types.animaEffect) {
                case 'building':
                {
                    objEf = {ef: 1};
                    var objectsForConnect = [], points2D = [];
                    objOfScene.pointsArray.concat([]);
                    objectsForConnect = utils.interfaces.disableElementsOfFigue(objOfScene);
                    //2d
                    var list2DPnt = objOfScene.object2D.point2D.children,
                        list2DTbe = objOfScene.object2D.tube2D.children,
                        centrPstn = objOfScene.circle2D.position;

                    for (var i = 0; i < list2DPnt.length; i++) {
                        var curMS = list2DPnt[i];
                        if (curMS.category == 'point') {
                            curMS.tooltip.visible = curMS.visible = false;
                            curMS.isFirst = true;
                            curMS.angleByCntr = Math.getCornerBtwTwoPoints(curMS.position, centrPstn);
                            points2D.push(curMS);
                        }

                    }
                    //sort by angle by center
                    points2D.sort(function (a, b) {
                        return a.angleByCntr > b.angleByCntr
                    });
                    //get thre all distance btw points
                    var dis = 0, deltaSc = 10, dst,
                        speed2D = 130 / Math.floor(objOfScene.circle2D.radious2d * deltaSc);
                    speed2D = speed2D < deltaSc ? speed2D * deltaSc : speed2D;
                    for (var i = 0; i < points2D.length; i++) {
                        if (i + 1 < points2D.length) {
                            points2D[i].dst = Math.round(Math.getDistBtwTwoPoints(points2D[i].position, points2D[i + 1].position) * deltaSc);
                        } else {
                            points2D[i].dst = Math.round(Math.getDistBtwTwoPoints(points2D[i].position, points2D[0].position) * deltaSc);
                        }
                        dis += points2D[i].dst;
                        points2D[i].dst -= i;
                    }
                    for (var i = 0; i < list2DTbe.length; i++) {
                        list2DTbe[i].visible = false;
                    }

                    objOfScene.object2D._2dPnts = points2D.concat([]);
                    var firstEl = objectsForConnect.shift(), first2D = points2D.shift();//points2D[0];
                    points2D.push(first2D);
                    firstEl.building(objectsForConnect, false, objOfScene);
                    first2D.building(points2D, speed2D, objOfScene.object2D);
                    objOfScene.circle2D.visible = false;
                    var bgnAngle = ((first2D.angleByCntr) * 180 / Math.PI),
                        _2dRad = objOfScene.circle2D.radious2d,
                        _2dPos = objOfScene.circle2D.position,
                        countOfPnts = objOfScene.listOfPointes.length - 1;
                    objOfScene.circle2D.buildCircle(_2dPos, _2dRad, bgnAngle, 360 / dis, speed2D);
                    break;
                }
                case 'centeringSphere':
                    objEf = this.effects.centering(sphere);
                    objEf.ef = 2;
                    break;
                case 'centeringTriangle':
                    objEf = this.effects.centering(new THREE.BoxGeometry(2 * radiusOfMainSphere, 2 * radiusOfMainSphere, 2 * radiusOfMainSphere));
                    objEf.ef = 3;
                    break;
                case 'shaders':
                    objEf = this.effects.scaling(sphere);
                    objEf.scale.x = objEf.scale.y = objEf.scale.z = 0.1;
                    objEf.ef = 4;
                    break;
            }
            var timeStop = ((new Date().getTime()) + 5000), fadeIn = setInterval(function () {
                if (timeStop < new Date().getTime()) {
                    clearInterval(fadeIn);
                    if (objEf) {
                        App.utils.types.webgl.scene.remove(objEf);
                        objOfScene.visible = true;
                    }
                } else {
                    for (var i = 0; i < objOfScene.children.length; i++) {
                        if (objOfScene.children[i].material) {
                            objOfScene.children[i].material.opacity += 0.01;
                        }
                    }
                    for (var i = 0; i < objOfScene.tipsObject.children.length; i++) {
                        if (objOfScene.tipsObject.children[i].material)
                            objOfScene.tipsObject.children[i].material.opacity += 0.015;
                    }

                    if (objEf.ef == 3) {
                        objEf.position.x -= factor;
                        objEf.position.y -= factor;
                        objEf.position.z -= factor;
                    } else if (objEf.ef == 2) {
                        objEf.scale.x -= 0.02;
                        objEf.scale.y -= 0.02;
                        objEf.scale.z -= 0.02;
                    } else if (objEf.ef == 4) {
                        objOfScene.visible = false;
                        scale += factor / 9;
                        objEf.scale.x = objEf.scale.y = objEf.scale.z = scale;
                    }

                }
            }, 100);

        },
        effects: {
            centering: function (geometry) {
                var material = new THREE.MeshBasicMaterial({color: 0x0a014c, transparent: true, opacity: 1});
                return this.crtObj(geometry, material);
            },
            scaling: function (geometry) {
                var material = new THREE.ShaderMaterial({

                    uniforms: {
                        time: {type: "f", value: (App.utils.types.frame).toFixed(1)},
                        resolution: {type: "v2", value: new THREE.Vector2()}
                    },
                    attributes: {
                        vertexOpacity: {type: 'f', value: []},
                        displacement: {type: "f", value: []},
                        fNumber: {type: "f", value: []},
                        fNormal: {type: "v3", value: [], boundTo: 'faces'}
                    },
                    vertexShader: document.getElementById('vertexShader').textContent,
                    fragmentShader: document.getElementById('fragmentShader').textContent

                });
                var verts = geometry.vertices;
                for (var v = 0; v < verts.length; v++) {

                    var _tmp;
                    if (v % (Math.round(Math.random() * Math.cos(v)) + 1) == 0) {
                        _tmp = Math.random() * 0.16;
                    } else {
                        _tmp = -(Math.random() * 0.16);
                    }

                    material.attributes.displacement.value.push(_tmp);

                }
                for (var n = 0; n < geometry.faceVertexUvs[0].length; n++) {
                    material.attributes.fNormal.value.push(geometry.faces[n].normal);
                    material.attributes.fNumber.value.push((n).toFixed(1));
                }
                return this.crtObj(geometry, material);
            },
            crtObj: function (geo, material) {
                var obj = new THREE.Mesh(geo, material);
                obj.position.set(objOfScene.sphere.position.x, objOfScene.sphere.position.y, objOfScene.sphere.position.z);
                App.utils.types.webgl.scene.add(obj);
                return obj;
            },
            building: function () {
                var objectsForConnect = newObh.concat([]), listOfTubes = [], mainT = 0, subT = 0, countOfPoints = 20;
                for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                    objOfScene.tubesArray[i].visible = false;
                    objOfScene.tubesArray[i].material.opacity = 1;
                }
                while (mainT < objectsForConnect.length) {
                    setTimeout(function () {
                        var currentObject = objectsForConnect.shift();
                        $.each(objectsForConnect, function (key, nextObject) {
                            var tubeMaterial = new THREE.MeshNormalMaterial({
                                //transparent: true,
                                //opacity: 0.0,
                                side: THREE.DoubleSide
                            }), keyP = 0;
                            var vBegn = currentObject.position;
                            var vEnd = nextObject.position;
                            var tube;
                            var intCon = setInterval(function () {
                                //var delta=((keyP++)*dist);
                                objOfScene.remove(tube);
                                if (keyP > countOfPoints) {
                                    //objOfScene.remove(tube);
                                    tube = objOfScene.helpers.getTubeByPoint(vBegn, vEnd);
                                    if (tube) {
                                        tube.visible = true;
                                    }
                                    //listOfTubes.push(tube);
                                    clearInterval(intCon);
                                } else {
                                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, (new THREE.Vector3(
                                        (vEnd.x - vBegn.x) * ((keyP) / countOfPoints) + vBegn.x,
                                        (vEnd.y - vBegn.y) * ((keyP) / countOfPoints) + vBegn.y,
                                        (vEnd.z - vBegn.z) * ((keyP++) / countOfPoints) + vBegn.z
                                    )));
                                    tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                                    objOfScene.add(tube);
                                }
                            }, 100 * (keyP + 1));
                        });
                    }, (countOfPoints * 100 * (mainT++)))
                }
                //reset();
                function reset() {
                    setTimeout(function () {
                        for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                            objOfScene.tubesArray[i].visible = true;
                            objOfScene.tubesArray[i].material.opacity = 1;
                        }
                        for (var i = 0; i < listOfTubes.length; i++) {
                            objOfScene.remove(listOfTubes[i]);
                        }
                        if (listOfTubes.length < objOfScene.tubesArray.length)reset();
                    }, countOfPoints * 100 * (++mainT));
                }
            },
            disableMaterials: function () {
                for (var i = 0; i < objOfScene.pointsArray.length; i++) {
                    if (objOfScene.pointsArray[i].tooltip)objOfScene.pointsArray[i].tooltip.material.opacity = 0.0;
                }
                for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                    objOfScene.tubesArray[i].material = new THREE.MeshNormalMaterial({
                        transparent: true,
                        opacity: 0.1,
                        side: THREE.DoubleSide
                    });
                }
                objOfScene.sphere.material.opacity = 0.0;
            }
        },
        init: function (resArr, objectsForConnect, number, d) {
            //save poiintes for 2d
            var pointes = resArr.concat([]);
            for (var i = 0; i < pointes.length; i++) {
                pointes[i] = pointes[i][0] + '' + pointes[i][1] + '' + pointes[i][2];
            }
            objOfScene.listOfPointes = pointes;
            objOfScene.updateMatrixWorld();
            objOfScene.isHuge = isBig = number.toString().length == 3;

            App.utils.types.webgl.listObjOfScene.push(objOfScene);
            this.drawPoints(resArr, number);
            this.drawConnections(objectsForConnect);
            this.drawCircle(number);
            this.drawShape(resArr, number);

            if (webglObj._dimension) {
                webglObj.camera.lookAt(objOfScene.sphere.position);
                webglObj.camera.position.set(20, 20, 20);
                App.utils.types.cameraDistance = 20;
            } else {
                var cir = {}, speed = 90;
                cir.x = objOfScene.circle2D.position.x,
                    cir.y = objOfScene.circle2D.position.y;
                var step = {x: ( -cir.x) / speed, y: ( -cir.y) / speed};
                webglObj._2dConsist.bgnPath = 0;
                webglObj._2dConsist.endPath = speed;
                webglObj._2dConsist.steps = step;
                webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -45);
                webglObj.camera.position.z = -15;

                App.utils.events.staticResize();
            }
            if (isBig) {
                App.utils.types.frame = 0;
                App.utils.types.autoRotate = true;
                var loaded = false;
                if ((  loaded = App.remote.data)) {
                    //draw angles and squares and subfigures
                    var l = {
                        square: loaded.squareTooltips.pop().square,
                        angle: [],
                        someGS: loaded.someGS
                    };
                    for (var i = 0; i < loaded.angleTooltips.length; i++) {
                        var cur = loaded.angleTooltips[i];
                        cur.shift = {x: 8.5, y: 11};
                        cur.backColor = "rgba(255, 255, 0, 1)";
                        cur.canvasHeight = 39;
                        cur.fontsize = 12;
                        this.createSpriteForObj(cur);
                        if (cur.id2D) {
                            l.angle.push(cur);
                        } else {
                            App.guiObj.listOgAngles.push(cur.text_s);
                        }
                    }
                    for (var i = 0; i < loaded.squareTooltips.length; i++) {
                        this.createSquareForObj(loaded.squareTooltips[i]);
                    }
                    for (var i = 0; i < loaded.figures.length; i++) {
                        var curFg = loaded.figures[i];
                        this.buildFigure(curFg.pnts, curFg.sq, curFg.cr, curFg.pr);
                    }
                    this.finalSettings(objOfScene);
                    App.utils.types.loaded = l;
                } else {
                    this.getIntersectPoints(d);
                }

                this.startEffect(objOfScene);

                //final settings for 2d
                var c = objOfScene.circle2D.position,
                    r = App.utils.types.rotateTo2D,
                    _2dOb = App.rebuild2D,
                    scale = (1 + _2dOb.dftAngleSq2DObj.scale + _2dOb.dftAngleSq2DObj.delt * (_2dOb.lstCrtdPl - 1));
                _2dSq.position.set(c.x, c.y, 0.1);
                _2dSq.rotation.set(r.x, r.y, 0);//parallel to XY -0.6,2.36,0
                _2dSq.scale.multiplyScalar(scale + 0.04);//1.85

                _2dSmFgr.position.set(c.x, c.y, 0);
                _2dSmFgr.rotation.set(r.x, r.y, 0);
                _2dSmFgr.scale.multiplyScalar(scale + 0.09);

                //translate all childs to correct position
                _2dCI.position.set(c.x, c.y, 0);

                //make tubes closer to camera than subfigures for adopted click
                objOfScene.object2D.tube2D.position.z = 28;
            }


        }//start drawing
    };
    App.utils.interfaces.resetTooltipInfo();
    objOfScene.helpers.init(App.utils.types.listOfPoints, objectsForConnect, inputNumber, newObh);
    //objOfScene.castShadow = true;
    //objOfScene.receiveShadow = true;
    //objOfScene.tipsObject.castShadow = true;
    //objOfScene.tipsObject.receiveShadow = true;

};//settings for objects