App.rebuild2D = {
    dftClrs: {
        point: "rgba(255,255, 255, 1)",
        back: "#0a014c"
    },
    dftAngleSq2DObj: {scale: 0.22, delt: 0.3, r: {x: 2.525, y: 2.357}},
    lstCrtdPl: 3,
    buildPlate: function (lineSpace) {
        var appObj = App.utils.types,
            webglObj = appObj.webgl,
            _systemSize, par,
            scale_html = 100;

        var lckLineSpace = lineSpace ? lineSpace : App.rebuild2D.lstCrtdPl;
        var delta = {x: 7.6, y: 4, stepI: 44, stepJ: 5, rowShift: 29, lS: lckLineSpace - 1},
            dftPar = {
                x: 29.6, y: 13.3,
                stepI: 146,
                rowShift: 107,
                stepJ: 20
            },
            deltaZ = -45//lckLineSpace < 4 ? -45 : -185;
        _systemSize = {x: dftPar.x + delta.lS * delta.x, y: dftPar.y + delta.lS * delta.y};
        par = {
            rows: _systemSize.y * 100,
            stepI: dftPar.stepI + delta.lS * delta.stepI,
            rowShift: dftPar.rowShift + delta.lS * delta.rowShift,
            stepJ: dftPar.stepJ + delta.lS * delta.stepJ
        };
        App.rebuild2D.curPar = par;

        /*  switch(lineSpace) {
         case 1:
         {
         _systemSize = {x: 29.6, y: 14.6};
         deltaZ =-45;
         par={ rows : _systemSize.y*100,  stepI : 156, rowShift:107,stepJ : 20};
         break;
         }
         case 2:
         {
         deltaZ =-45;
         _systemSize = {x: 37.2, y: 17.3};
         par={ rows : _systemSize.y*100,   stepI : 190, rowShift:136,stepJ : 25};
         break;
         }
         case 3:
         {
         deltaZ =-45;
         _systemSize = {x: 44.8, y: 21.3};
         par={ rows : _systemSize.y*100, stepI : 234, rowShift:165,stepJ : 30};
         break;
         }
         case 4:
         {
         deltaZ =-50;
         _systemSize={x: 52.4,y: 25.3};
         par={ rows : _systemSize.y*100,  stepI : 278, rowShift:194,stepJ : 35};
         break;
         }
         case 5:
         {
         deltaZ =-55;
         _systemSize={x: 60.9,y: 29.1};
         par={ rows : _systemSize.y*100,  stepI : 322, rowShift:233,stepJ : 40};
         break;
         }
         }*/

        appObj._2dPlateSize = _systemSize;

        webglObj._2dTexture = App.rebuild2D.getTexture({
            par: par,
            width: _systemSize.x * scale_html,
            height: _systemSize.y * scale_html
        });
        var texture = new THREE.Texture(webglObj._2dTexture);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var mat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        webglObj._plate = new THREE.Mesh(new THREE.PlaneGeometry(_systemSize.x, _systemSize.y, 32), mat);
        webglObj._plate.updateMatrixWorld();
        if (webglObj._2dConsist) {
            webglObj.scene.remove(webglObj._2dConsist);
        }
        webglObj._2dConsist = new THREE.Object3D();
        webglObj._2dConsist.updateMatrixWorld();
        webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, deltaZ);
        webglObj._2dConsist.add(webglObj._plate);
        webglObj.scene.add(webglObj._2dConsist);
        webglObj._2dConsist.visible = lineSpace ? true : false;
    },
    getTexture: function (size, color) {
        var canvas = document.createElement('canvas'),
            fontSize = 10,
            par = size.par ? size.par : App.rebuild2D.curPar;
        var list = document.getElementById("test");
        if (list.childNodes[0]) list.removeChild(list.childNodes[0]);
        list.appendChild(canvas);
        canvas.width = size.width;
        canvas.height = size.height;
        //$(canvas).css('background-color', 'rgba(232, 232, 232, 1.0)');
        var ctx = canvas.getContext('2d');
        //ctx.fillStyle = "rgba(10, 1, 76, 1)";
        App.rebuild2D.dftClrs = color ? color : App.rebuild2D.dftClrs;
        ctx.fillStyle = App.rebuild2D.dftClrs.back;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + "px Verdana";
        ctx.fillStyle = App.rebuild2D.dftClrs.point;
        var _system = [];
        var rows = par.rows,
            stepI = par.stepI,
            stepJ = par.stepJ,
            rowShift = par.rowShift,
            rowWidth = 1000,
            curJ = 0, el = 0;
        for (var i = fontSize; i < rows; i += stepI) {
            for (var j = curJ; j < (stepJ / 10) * (rowWidth) + curJ; j += stepJ) {
                var apendStr = '';
                if (i == fontSize) {
                    if (el.toString().length == 1) {
                        apendStr = '00';
                    } else if (el.toString().length == 2) {
                        apendStr = '0';
                    }
                }
                var value = apendStr + (el++);
                //ctx.fillStyle = "rgba(255, 255, 255, 1)";
                //ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                //App.rebuild2D.roundRect(ctx, j-1, i-15,31, 17,10,true);
                //ctx.fillRect(j-1, i-10,23, 11);
                //ctx.fillStyle = color ? color.point : "rgba(255, 255, 255, 1)";
                ctx.fillText(value, j, i);
                _system.push({name: value, pos: {x: j, y: i}});
            }
            curJ += rowShift;
        }
        App.utils.types.webgl._system = _system;
        return canvas;
    },
    addFigure: function (points) {
        var pointes = points.concat([]);
        for (var i = 0; i < pointes.length; i++) {
            pointes[i] = pointes[i][0] + '' + pointes[i][1] + '' + pointes[i][2];
        }

        var webglObj = App.utils.types.webgl, canvas = webglObj._2dTexture, _system = webglObj._system, startPos = {};
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = "rgba(112, 240, 17, 1)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (var i = 0; i < pointes.length; i++) {
            for (var j = 0; j < _system.length; j++) {
                if (pointes[i] == _system[j].name) {
                    if (!startPos.y) {
                        startPos.x = _system[j].pos.x;
                        startPos.y = _system[j].pos.y;
                        ctx.moveTo(startPos.x, startPos.y);
                    } else {
                        ctx.lineTo(_system[j].pos.x, _system[j].pos.y);
                    }
                    break;
                }
            }
        }
        ctx.lineTo(startPos.x, startPos.y);
        ctx.stroke();
        webglObj._2dTexture = canvas;
        var texture = new THREE.Texture(webglObj._2dTexture);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var mat = metal = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        //var spriteMaterial = new THREE.SpriteMaterial({
        //    map: texture, useScreenCoordinates: false, rotation: 0
        //});
        webglObj._plate.material = mat;
    },
    roundRect: function (ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
    },
    get2DCoordinat: function (arr) {

        var appObj = App.utils.types, webglObj = appObj.webgl, _system = webglObj._system,
            scale_html = 100, objSystmPstn = [], objSystmPstnGS = [],
            plateS = appObj._2dPlateSize;
        var absP = {x: plateS.x / 2, y: plateS.y / 2}, scale_sys = 100;//there is (0,0) of new system of coordinates

        for (var k = 0; k < arr.length; k++) {
            for (var j = 0; j < _system.length; j++) {
                if (arr[k] == _system[j].name) {
                    var coor = {z: 0.005};
                    coor.x = (_system[j].pos.x / scale_sys) - absP.x + 0.1;
                    coor.y = absP.y - (_system[j].pos.y / scale_sys) + 0.05;
                    objSystmPstn.push(coor);
                    break;
                }
            }
        }
        return objSystmPstn;
    },
    rebuildFigures: function (lineSpace) {
        var webglObj = App.utils.types.webgl, listOfFig = webglObj.listObjOfScene, _2dOb = App.rebuild2D, calc = _2dOb.dftAngleSq2DObj;
        for (var i = 0; i < listOfFig.length; i++) {
            var cur = listOfFig[i];
            if (cur.isHuge) {
                var __obj2D = cur.object2D, pointes = __obj2D.point2D.children,
                    tubes = {l: [], m: __obj2D.tube2D.children[0].material},
                    m = cur.helpers, key = 0;
                cur.listOf2dCord = _2dOb.get2DCoordinat(cur.listOfPointes);
                tubes.l = cur.listOf2dCord.concat([]);

                //reset the points
                for (var pnts = 0; pnts < pointes.length; pnts += 2) {
                    m.draw2DPnts(pointes[pnts + 1], pointes[pnts], cur.listOf2dCord[key++]);
                }
                if (cur.listOf2dCord.length > 1) {
                    //reste the tubes
                    __obj2D.remove(__obj2D.tube2D);
                    var curVis = __obj2D.tube2D.visible ? true : false, tbChlds = __obj2D.tube2D.children;
                    var vis = {v1: tbChlds[0].visible, v2: tbChlds[2].visible};
                    __obj2D.tube2D = new THREE.Object3D();
                    __obj2D.tube2D.position.z = 28;
                    __obj2D.add(__obj2D.tube2D);

                    m.draw2DConnections(tubes.l, tubes.m, __obj2D.tube2D, vis);

                    //reset circle and circle info
                    var lstCIV = __obj2D.circleInfo.visible ? true : false;
                    __obj2D.remove(cur.circle2D);
                    __obj2D.remove(__obj2D.circleInfo);
                    var _2dCI = __obj2D.circleInfo = new THREE.Object3D();
                    _2dCI.category = 'circleInfo';
                    _2dCI.visible = lstCIV;
                    _2dCI.updateMatrixWorld();
                    __obj2D.add(_2dCI);
                    m.draw2DCircle(cur, cur.circle2D.material, cur.circle2D.visible);

                    //reset figure
                    __obj2D.remove(cur.shape2D);
                    m.draw2DShape(cur, [cur.shape2D.material]);

                    //reset corners
                    var c = cur.circle2D.position,
                        l = __obj2D.corner2DIn,
                        lc = __obj2D.corner2D,
                        s = __obj2D.square2D,
                        corner2DInL = l.children.concat([]),
                        sq2DInL = s.children.concat([]);


                    lc.position.set(c.x, c.y, 0.1);
                    //new poition for lc children
                    var lcChldsPstn = cur.listOf2dCord,
                        cur2D,
                        prev2D = lcChldsPstn[0],
                        lccKey = 0,
                        lsPstn = lc.position,
                        arrLast2D = lcChldsPstn[lcChldsPstn.length - 1];
                    for (var lcc = 1; lcc < lcChldsPstn.length && lcc + 1 < lcChldsPstn.length; lcc++) {
                        cur2D = lcChldsPstn[lcc];
                        var curPstn = Math.getPositionForValueOfCorner(lcChldsPstn[lcc + 1], cur2D, prev2D, false);
                        lc.children[lccKey++].position.set(curPstn.x - lsPstn.x, curPstn.y - lsPstn.y, lsPstn.z);
                        prev2D = lcChldsPstn[lcc];
                    }
                    var curPstn = (Math.getPositionForValueOfCorner(lcChldsPstn[0], arrLast2D, lcChldsPstn[lcChldsPstn.length - 2], false));
                    lc.children[lccKey++].position.set(curPstn.x - lsPstn.x, curPstn.y - lsPstn.y, lsPstn.z);
                    curPstn = (Math.getPositionForValueOfCorner(arrLast2D, lcChldsPstn[0], lcChldsPstn[1], false));
                    lc.children[lccKey++].position.set(curPstn.x - lsPstn.x, curPstn.y - lsPstn.y, lsPstn.z);


                    __obj2D.remove(l);
                    var lastV = l.visible;
                    l = __obj2D.corner2DIn = new THREE.Object3D();
                    l.visible = lastV;
                    __obj2D.add(l);
                    l.position.set(c.x, c.y, 0.1);
                    l.rotation.set(calc.r.x, calc.r.y, 0);
                    for (var la = 0; la < corner2DInL.length; la++) {
                        l.add(corner2DInL[la]);
                    }


                    //reset squares
                    __obj2D.genSquare.position.set(c.x, c.y, 0.1);
                    lastV = s.visible;
                    __obj2D.remove(s);
                    s = __obj2D.square2D = new THREE.Object3D();
                    s.visible = lastV;
                    __obj2D.add(s);
                    s.position.set(c.x, c.y, 0.1);
                    s.rotation.set(calc.r.x, calc.r.y, 0);
                    for (var ls = 0; ls < sq2DInL.length; ls++) {
                        s.add(sq2DInL[ls]);
                    }


                    var scale = (1 + calc.scale + calc.delt * (lineSpace - 1));
                    l.scale.multiplyScalar(scale + 0.1);
                    s.scale.multiplyScalar(scale + 0.004);

                    //redraw general summ
                    var lstVsGS = __obj2D.genSumm.visible ? true : false;
                    __obj2D.remove(__obj2D.genSumm);
                    __obj2D.genSumm = new THREE.Object3D();
                    __obj2D.genSumm.visible = lstVsGS;
                    __obj2D.add(__obj2D.genSumm);
                    cur.helpers.draw2DSL(cur.gS.listOfGS, false, cur.object2D.genSumm);
                    cur.helpers.draw2DSL(false, {val: cur.gS.genGS, pst: c}, cur.object2D.genSumm);
                    var _gs = __obj2D.genSumm,
                        _gsChilds = _gs.children,
                        _gsPstn = _gs.position;

                    _gs.position.set(c.x, c.y, 0.1);
                    _2dCI.position.set(c.x, c.y, 0.01);

                    for (var ks = 0; ks < _gsChilds.length; ks++) {
                        var curObjP = _gsChilds[ks].position;
                        _gsChilds[ks].position.set(curObjP.x - _gsPstn.x, curObjP.y - _gsPstn.y, curObjP.z - _gsPstn.z);
                    }

                    //reset subfigures
                    var copy_smmplFgr = {
                        c: __obj2D.smmplFgr.children.concat([]),
                        ch: __obj2D.smmplFgr.childs.concat([])
                    };
                    __obj2D.remove(__obj2D.smmplFgr);
                    var _2dSmFgr = __obj2D.smmplFgr = new THREE.Object3D();
                    _2dSmFgr.category = 'smmplFgr';
                    _2dSmFgr.childs = [];
                    _2dSmFgr.updateMatrixWorld();
                    __obj2D.add(_2dSmFgr);
                    for (var sFI = 0; sFI < copy_smmplFgr.c.length; sFI++) {
                        _2dSmFgr.add(copy_smmplFgr.c[sFI]);
                        _2dSmFgr.childs.push(copy_smmplFgr.ch[sFI]);
                    }
                    _2dSmFgr.position.set(c.x, c.y, 0.01);
                    _2dSmFgr.rotation.set(calc.r.x, calc.r.y, 0);
                    _2dSmFgr.scale.multiplyScalar(scale + 0.9);

                }
                webglObj._2dConsist.add(__obj2D);
            }
        }
    }
}