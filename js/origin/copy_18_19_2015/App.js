/**
 * Initialising  global variables
 */
var App = App || {};
var lastCheck = {
    point: [],
    angle: [],
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
App.utils = {
    events: {
        onWindowResize: function () {
            var webglObj = App.utils.types.webgl;
            webglObj.camera.aspect = window.innerWidth / window.innerHeight;
            webglObj.camera.updateProjectionMatrix();
            webglObj.renderer.setSize(window.innerWidth, window.innerHeight);
            webglObj.controls.handleResize();
            App.utils.interfaces.render();

        },
        onMouseMove: function (event) {
            event.preventDefault();
            var webglObj = App.utils.types.webgl, projector = webglObj.raycaster,
                mouseVector = webglObj.mouseVector,listObjOfScene=webglObj.listObjOfScene,
                lastHoverAngle = webglObj.lastHoverAngle,canvas =$('#THREEJS canvas');
            if (lastHoverAngle) {
                lastHoverAngle.material.map = lastHoverAngle.textHover.in;
            }
            mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouseVector.y = -( event.clientY / window.innerHeight ) * 2 + 1;
            projector.setFromCamera(mouseVector, webglObj.camera);
            if (listObjOfScene.length > 0) {
                var angles=[];
                for(var i=0;i<listObjOfScene.length;i++){
                    angles = angles.concat(listObjOfScene[i].tipsArray);
                }
                var intersect =projector.intersectObjects(angles)[0];
                if (intersect && intersect.object && intersect.object.category == 'angle') {
                    intersect.object.material.map = intersect.object.textHover.out;
                    App.utils.types.webgl.lastHoverAngle = intersect.object;
                }
            }
            App.utils.types.webgl.mouseVector = mouseVector;

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
        parent: null,
        mouse: {},
        accessPoint: [],
        webgl: {
            scene: null,
            scene2: null,
            skyBox: null,
            cubeHelper: null,
            objOfScene: null,
            container: null,
            raycaster: null,
            projector: null,
            mouseVector: null,
            camera: null, controls: null, renderer: null,
            listObjOfScene: [],
            intersectPoint: []
        }//webgl objects
    },//app types of objects
    interfaces: {
        backControls: function (back) {
            $('#' + back.id).css('box-shadow', '0 0 0 rgba(0,0,0,1)');
            var vid = document.getElementById("myVideo"), src = "img/pause.png";
            if (back.play) {
                vid.pause();
                back.play = false;
            } else {
                src = 'img/play.png';
                vid.play();
                back.play = true;
            }
            App.utils.types.backgroundContainer.play = back.play;
            $('#im').attr("src", src);
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
            this.init();
            this.animate();
        },//start app
        init: function () {
            var webglObj = App.utils.types.webgl;

            var light = new THREE.DirectionalLight(0xffffff);
            var cube = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 9), new THREE.MeshBasicMaterial(0xff00ff));
            var helper = new THREE.BoxHelper(cube);

            var camera = webglObj.camera = new THREE.PerspectiveCamera(40, (window.innerWidth / window.innerHeight), 0.01, 1000);
            camera.position.set(14, 14, 14);
            webglObj.container = document.getElementById('THREEJS');

            // lights
            light.position.set(10, 10, 10);
            webglObj.scene.add(light);

            var renderer = webglObj.renderer = new THREE.WebGLRenderer({
                antialias: true,
                preserveDrawingBuffer: true,
                alpha: true
            });
            renderer.autoClear = false;
            //renderer.setClearColor(webglObj.scene.fog.color);
            //renderer.setClearColor(webglObj.scene2.fog.color);
            renderer.setClearColor(0x000000, 1);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            // cube
            webglObj.cubeHelper = new THREE.Object3D();
            webglObj.cubeHelper.position.set(0, 0, 0);
            helper.material.color.set(0xff0000);
            helper.category = 'mainCube';
            webglObj.cubeHelper.position.set(4.5, 4.5, 4.5);
            webglObj.cubeHelper.add(helper);
            cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
            //App.rebuildCubes.add(webglObj.cubeHelper, cube);
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

            webglObj.raycaster = new THREE.Raycaster();
            //webglObj.projector = new THREE.Projector();
            webglObj.mouseVector = new THREE.Vector3();
            //skybox
            //App.rebuildSkyBox.add();
            //gui
            App.guiObj.init();

            //events
            window.addEventListener('resize', App.utils.events.onWindowResize, false);
            renderer.domElement.addEventListener('mousemove', App.utils.events.onMouseMove, false);
            this.render();
        },//init webgl objects
        render: function () {
            var webglObj =  App.utils.types.webgl;

            webglObj.camera.lookAt(webglObj.scene.position);
            webglObj.camera.updateMatrixWorld();
            webglObj.renderer.clear();
            webglObj.renderer.render(webglObj.scene, webglObj.camera);
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
                canvasHeight: parameters.hasOwnProperty("canvasHeight") ? parameters["canvasHeight"] : false
            }
            var addText=App.utils.interfaces.addTexture;
            var old = addText(obj);
            var spriteMaterial = new THREE.SpriteMaterial({map: old.texture, useScreenCoordinates: false, rotation: 0}),
                sprite = new THREE.Sprite(spriteMaterial);
            if (nMsg) {
                sprite.textHover = {};
                sprite.textHover.in = old.texture;
                obj.msg = nMsg;
                obj.fontsize = 18;
                obj.canvasHeight = 47;
                obj.canvasWidth = 1.9;
                obj.backColor ="rgba(255, 0, 0, 1)";
                sprite.textHover.out = addText(obj).texture;
                sprite.textHover.out.renderOrder = -1;
            }
            if (msg && msg == '_') {
                spriteMaterial.transparent = true;
                spriteMaterial.opacity = 0;
            }
            sprite.scale.set(old.scale_width, 0.336, 0.2);
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
                shift = canvasWidth ? {x: 9.5, y: 11} : {x: 0, y: 0};

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
                    rectWidth = canvas.width = 96;
                    scale_width = 0.45;
                    break;
                case 4:
                    scale_width = 0.56;
                    rectWidth = canvas.width = 121;
                    break;
                case 5:
                    scale_width = 0.65;
                    rectWidth = canvas.width = 121;
                    break;
                case 6:
                    scale_width = 0.65;
                    rectWidth = canvas.width = 140;
                    break;
                default:
                    scale_width = 0.56;
                    rectWidth = canvas.width = (30 * numOfLetters);
            }
            rectHeight = canvas.height = canvasHeight ? canvasHeight : 60;
            context.font = "Bold " + fontsize + "px " + fontface;
            context.fillStyle = canvasWidth ? obj.backColor : "rgba(255, 255, 255, 1)";
            context.lineJoin = "round";
            context.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
            context.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
            context.strokeStyle = "rgba(255, 255, 255, 1)";
            context.lineWidth = canvasWidth ? borderThickness / 2 : borderThickness;
            context.fillStyle = "rgba(0, 0, 0, 1.0)";
            context.fillText(message, borderThickness + shift.x, fontsize + borderThickness + shift.y);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.renderOrder = 0;
            return {texture: texture, scale_width: scale_width};

        },
        createMultipointPolygon: function (verticiesArray, num) {
            if (num > 3) {
                var geometry = new THREE.Geometry();
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
                return geometry;
            } else {
                var points = [];
                for (var i = 0; i < verticiesArray.length; i++) {
                    points.push(new THREE.Vector3(verticiesArray[i][0], verticiesArray[i][1], verticiesArray[i][2]));
                }
                var geometry = new THREE.ConvexGeometry(points);
                return geometry;
            }
        },//create figure by all points of obj
        tubeLineGeometry: function (point1, point2) {
            var spline = new THREE.SplineCurve3([point1, point2]);
            var geometry = new THREE.TubeGeometry(spline, 1, 0.02, 36); // segment,radius,radiusSegments
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
            var spherePos = obj.sphere.position;
            obj.position.set(spherePos.x, spherePos.y, spherePos.z);
            var objPos = obj.position;
            for (var i = 0; i < obj.children.length; i++) {
                var curMeshPoj = obj.children[i].position;
                obj.children[i].position.set(curMeshPoj.x - objPos.x, curMeshPoj.y - objPos.y, curMeshPoj.z - objPos.z);
            }
            var childScene2 = App.utils.types.webgl.scene2.children;
            for (var i = 0; i < childScene2.length; i++) {
                if (childScene2[i].parentNam && childScene2[i].parentNam == obj.name) {
                    childScene2[i].position.set(objPos.x, objPos.y, objPos.z);
                    for (var n = 0; n < childScene2[i].children.length; n++) {
                        var curPoj = childScene2[i].children[n].position;
                        childScene2[i].children[n].position.set(curPoj.x - objPos.x, curPoj.y - objPos.x, curPoj.z - objPos.x);
                    }
                }
            }
        },//set rotation center for all children of obj
        rotateObj: function (curObj, x, y, z) {
            curObj.rotation.x += x;
            curObj.rotation.y += y;
            curObj.rotation.z += z;
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
            var curObjAct = App.utils.interfaces.getObjByName(name);
            if (curObjAct) {
                curObjAct.visible = val;
            } else {
                alert('sorry');
            }
        },//visibility of  obj
        tipsArray: {
            toggleVisible: function (name, val, objCal) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    if ((objCal && lastCheck.getEl(name, lastCheck.point)) || ( curObjAct.visible )) {
                        for (var i = 0; i < curObjAct.tipsArray.length; i++) {
                            if (curObjAct.tipsArray[i].category == 'point') {
                                curObjAct.tipsArray[i].visible = val;
                            }
                        }
                    }
                }
            },//visibility for points of obj
            angleVisible: function (name, val, objCal) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    if ((objCal && lastCheck.getEl(name, lastCheck.angle)) || ( curObjAct.visible )) {
                        for (var i = 0; i < curObjAct.tipsArray.length; i++) {
                            if (curObjAct.tipsArray[i].category == 'angle') {
                                curObjAct.tipsArray[i].visible = val;
                            }
                        }
                    }
                }
            }//visibility for angle of obj
        },//tables  behavior
        pointsArray: {
            toggleVisible: function (name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.pointsArray.length; i++) {
                        curObjAct.pointSphere = curObjAct.pointsArray[i];
                        curObjAct.pointSphere.visible ? curObjAct.pointSphere.visible = false : curObjAct.pointSphere.visible = true;
                    }
                }
            },//visible
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.pointsArray.length; i++) {
                        curObjAct.pointSphere = curObjAct.pointsArray[i];
                        curObjAct.pointSphere.material = new THREE.MeshLambertMaterial({color: 0xFFEB3B});
                        curObjAct.pointSphere.material.color.setHex('0x' + clr);
                    }
                }
            }//change color
        },//points behavior
        tubesArray: {
            toggleVisible: function (name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.tubesArray.length; i++) {
                        curObjAct.cutLine = curObjAct.tubesArray[i];
                        curObjAct.cutLine.visible ? curObjAct.cutLine.visible = false : curObjAct.cutLine.visible = true;
                    }
                }
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    for (var i = 0; i < curObjAct.tubesArray.length; i++) {
                        curObjAct.cutLine = curObjAct.tubesArray[i];
                        curObjAct.cutLine.material = new THREE.MeshLambertMaterial({color: 0xFFF176});
                        curObjAct.cutLine.material.color.setHex('0x' + clr);
                    }
                }
            }
        },//tubes behavior
        sphere: {
            toggleVisible: function (name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.sphere.visible ? curObjAct.sphere.visible = false : curObjAct.sphere.visible = true;
                }
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.sphere.material = new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.2
                    });
                    curObjAct.sphere.material.color.setHex('0x' + clr);
                }
            }
        },//sphere behavior
        shape: {
            toggleVisible: function (name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.visible ? curObjAct.shape.visible = false : curObjAct.shape.visible = true;
                }
            },
            changeColor: function (clr, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.material = new THREE.MeshBasicMaterial({
                        color: 0x76FF03,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.2
                    });
                    curObjAct.shape.material.color.setHex('0x' + clr);
                }
            },
            changeOpacity: function (val, name) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.material.opacity = val;
                }
            }//opacity for shape
        }//shape behavior
    }//app methods
};

/**
 * Objects creation
 */
App.rebuildNodes = function (numer) {
    /**
     * Variables and objects initialising
     */
    var objectsForConnect = [], objOfScene, number = App.utils.types.inputNumber, webglObj = App.utils.types.webgl;
    App.guiObj.listOgAngles = [];
    number = numer;
    objOfScene = new THREE.Object3D();
    objOfScene.rotateRad = {
        x: 0,
        y: 0,
        z: 0
    };
    objOfScene.pointsArray = [];
    objOfScene.tipsArray = [];
    objOfScene.linesArray = [];
    objOfScene.tubesArray = [];
    objOfScene.isAlreadySetNewGlobalPos = false;
    objOfScene.isAnimateObject = true;
    var objName = 'Figure ' + number, newObh = [],
        aveageNum, radiusOfMainSphere;
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
    objOfScene.tipsObject = new THREE.Object3D();
    objOfScene.tipsObject.parentNam = objName;
    webglObj.scene.add(objOfScene);
    webglObj.scene2.add(objOfScene.tipsObject);
    /**
     * creation SubObjects and Methods for main object
     */
    objOfScene.helpers = {
        listTriangles: [],//list of faces
        intersectPoint: [],//list of point intersect, unic
        accessPoint: [],//list of point wich can build a face
        drawPoints: function (resArr, number) {
            aveageNum = Math.average(number), radiusOfMainSphere = Math.sphereRadius(number, aveageNum);
            $.each(resArr, function (key, node) {
                var geometry = new THREE.SphereGeometry(0.08, 32, 32),
                    material = new THREE.MeshNormalMaterial();
                geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
                objOfScene.Sprite = App.utils.interfaces.createSprite(node[0] + '' + node[1] + '' + node[2], {fontsize: 27});
                objOfScene.Sprite.category = 'point';
                objOfScene.pointSphere = new THREE.Mesh(geometry, material);
                objOfScene.pointSphere.position.set(node[0], node[1], node[2]);
                objOfScene.Sprite.position.copy(objOfScene.pointSphere.position);
                objOfScene.Sprite.position.y = objOfScene.Sprite.position.y + 0.27;
                objOfScene.pointsArray.push(objOfScene.pointSphere);
                objOfScene.tipsArray.push(objOfScene.Sprite);
                objOfScene.tipsObject.add(objOfScene.Sprite);
                objOfScene.add(objOfScene.pointSphere);
                objectsForConnect.push(objOfScene.pointSphere);
            });
        },// draw points on screen
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

            while (objectsForConnect.length) {
                var currentObject = objectsForConnect.shift();
                newObh.push(currentObject);
                $.each(objectsForConnect, function (key, nextObject) {
                    var tubeMaterial = new THREE.MeshNormalMaterial();
                    var vBegn = new THREE.Vector3(currentObject.position.x, currentObject.position.y, currentObject.position.z);
                    var vEnd = new THREE.Vector3(nextObject.position.x, nextObject.position.y, nextObject.position.z);
                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd);
                    objOfScene.tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                    objOfScene.tube.line = {vBegn: vBegn, vEnd: vEnd};
                    objOfScene.tubesArray.push(objOfScene.tube);
                    objOfScene.add(objOfScene.tube);
                });

            }

        },// draw tubes on screen
        drawCircle: function (number) {
            var circleCenter = aveageNum ? aveageNum : Math.average(number),
                radius = radiusOfMainSphere ? radiusOfMainSphere : Math.sphereRadius(number, circleCenter),
                sphereCenter = App.utils.types.sphereCenter,
                geometrySphere = new THREE.SphereGeometry(radius, 32, 32),
                materialSphere = new THREE.MeshNormalMaterial({transparent: true, opacity: 0.2});

            objOfScene.sphere = new THREE.Mesh(geometrySphere, materialSphere);
            objOfScene.sphere.renderOrder = 2;
            objOfScene.add(objOfScene.sphere);
            if (number.toString().length > 3) {
                objOfScene.sphere.position.set(sphereCenter.c_xy, sphereCenter.c_xy, sphereCenter.c_z);
            }
            else {
                objOfScene.sphere.position.set(circleCenter, circleCenter, circleCenter);
            }
        },// draw sphere on screen
        drawShape: function (resArr, num) {
            var geometry = App.utils.interfaces.createMultipointPolygon(resArr, num);
            var material = new THREE.MeshBasicMaterial({
                color: 0x9012e8,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.05
            });
            objOfScene.shape = new THREE.Mesh(geometry, material);
            objOfScene.shape.castShadow = true;
            objOfScene.shape.receiveShadow = false;
            objOfScene.add(objOfScene.shape);
        },// draw shape on screen
        drawCorners: function (objectsForConnect) {
            var rayCast, currentObject,
                j = 0,
                curd = [];
            objectsForConnect.push(objectsForConnect[0]);
            while (j < objectsForConnect.length) {
                currentObject = objectsForConnect[j++];
                var interObj, curd = [], targetPos;
                $.each(objectsForConnect, function (key, nextObject) {
                    targetPos = nextObject.position;
                    if (nextObject !== currentObject) {
                        curd.push(targetPos);
                    }
                });
                var maxLengthCount = curd.length;
                for (var i = 0; i < maxLengthCount; i++) {
                    rayCast = new THREE.Raycaster();
                    var direction = new THREE.Vector3().subVectors(curd[i], currentObject.position);
                    rayCast.set(currentObject.position, direction.clone().normalize());
                    interObj = rayCast.intersectObjects(objOfScene.tubesArray, true);
                    for (var n = 0; n < interObj.length; n++) {
                        var inX = Math.round(interObj[n].point.x), inY = Math.round(interObj[n].point.y), inZ = Math.round(interObj[n].point.z),
                            interPoint = inX + '' + inY + '' + inZ;
                        if (curd[i].x == inX && curd[i].y == inY && curd[i].z == inZ) {
                            if (j < objectsForConnect.length && (objectsForConnect[j].position != curd[i])) {
                                this.createAngle(objectsForConnect[j].position, currentObject.position, curd[i]);
                            }
                        } else if (this.checkIntersectPoint(interPoint)) {
                            if (this.checkAccesessIntersectPoint(interPoint, currentObject.position)) {
                                this.createAngle(interObj[n], currentObject, false);
                            }
                        } else {
                            this.intersectPoint.push(interPoint);
                            this.accessPoint.push({key: curd[i], value: interPoint});
                            this.createAngle(interObj[n], currentObject, false);
                        }

                    }

                }

            }
            this.intersectPoint = this.accessPoint = [];
        },// draw corners on screen
        createAngle: function createAngle(interObj, currentObject, endPoint) {
            var angle, positionAngle, corners = [];
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
            var Corner = this.checkCorrectAnge(corners);
            for (var u = 0; u < Corner.length; u++) {
                var angleOr = Corner[u].origin.toString(),separ =angleOr.indexOf(".");
                angleOr = angleOr.substr(0,separ+8) + '\xB0';
                App.guiObj.listOgAngles.push(angleOr);
                objOfScene.Sprite = App.utils.interfaces.createSprite(Corner[u].angle + '\xB0', {
                    fontsize: 12,
                    borderThickness: 1,
                    canvasWidth: 2,
                    canvasHeight: 39
                },angleOr);
                //objOfScene.Sprite.textHover = {in: Corner[u].angle, out: Corner[u].origin};
                objOfScene.Sprite.position.set(Corner[u].position.x, Corner[u].position.y, Corner[u].position.z);
                objOfScene.Sprite.category = 'angle';
                objOfScene.tipsArray.push(objOfScene.Sprite);
                objOfScene.tipsObject.add(objOfScene.Sprite);
            }

        },// get angle
        checkAccesessIntersectPoint: function (point, acsesPoin) {
            for (var i = 0; i < this.accessPoint.length; i++) {
                if (this.accessPoint[i].value == point) {
                    return this.accessPoint[i].key == acsesPoin;
                }
            }
        },// save intersect point
        checkIntersectPoint: function (point) {
            for (var i = 0; i < this.intersectPoint.length; i++) {
                if (this.intersectPoint[i] == point) {
                    return true;
                }
            }
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
        init: function (resArr, objectsForConnect, number, d) {
            this.drawPoints(resArr, number);
            this.drawConnections(objectsForConnect);
            this.drawCircle(number);
            this.drawShape(resArr, number);
            if (number.toString().length < 5)
                this.drawCorners(d);
        }//start drawing
    };

    objOfScene.helpers.init(App.utils.types.listOfPoints, objectsForConnect, inputNumber, newObh);
    App.utils.types.webgl.listObjOfScene.push(objOfScene);
};//settings for objects

App.rebuildCubes = {
    changeColorLittleCubes: function (val) {
        var cubeHelper = App.utils.types.webgl.cubeHelper, curObj;
        for (var i = 0; i < cubeHelper.children.length; i++) {
            curObj = cubeHelper.children[i];
            if (curObj.category && curObj.category == 'littleCube') {
                curObj.children[0].material.color.set(val);
            }
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
        for (var i = 0; i < cubeHelper.children.length; i++) {
            curObj = cubeHelper.children[i];
            if (curObj.category && curObj.category == childName) {
                curObj.visible = val;
            }
        }
    },//change visibility for all little cubbes
    add: function (cubeHelper, cube) {
        var spriteCreator = App.utils.interfaces.createSprite;
        for (var i = -4; i < 6; i++) {
            var littleCubeX = cube.clone();
            var helperX = new THREE.BoxHelper(littleCubeX);
            helperX.material.color.set(0x0000ff);
            var objX = new THREE.Object3D();
            objX.category = 'littleCube';
            objX.add(helperX);
            objX.position.set(i, 0, 0);
            var spriteX = spriteCreator((i + 4) + '' + 0 + '' + 0, {fontsize: 27});
            spriteX.position.set(i - 0.5, 0, 0);
            spriteX.category = 'cubeLabel';
            cubeHelper.add(spriteX);
            if (i < 5) {
                cubeHelper.add(objX);
            }
            for (var j = -4; j < 6; j++) {
                var littleCubeY = cube.clone();
                var helperY = new THREE.BoxHelper(littleCubeY);
                helperY.material.color.set(0x0000ff);
                var objY = new THREE.Object3D();
                objY.category = 'littleCube';
                objY.add(helperY);
                objY.position.set(i, j, 0);
                if (i < 5 && j < 5) {
                    cubeHelper.add(objY);
                }
                var spriteY = spriteCreator((i + 4) + '' + (j + 4) + '' + 0, {fontsize: 27});
                spriteY.position.set(i - 0.5, j - 0.5, 0);
                spriteY.category = 'cubeLabel';
                cubeHelper.add(spriteY);
                for (var n = -4; n < 6; n++) {
                    var littleCubeZ = cube.clone();
                    var helperZ = new THREE.BoxHelper(littleCubeZ);
                    helperZ.material.color.set(0x0000ff);
                    var objZ = new THREE.Object3D();
                    objZ.category = 'littleCube';
                    objZ.add(helperZ);
                    objZ.position.set(i, j, n);
                    if (i < 5 && j < 5 && n < 5) {
                        cubeHelper.add(objZ);
                    }
                    var spriteZ = spriteCreator((i + 4) + '' + (j + 4) + '' + (n + 4), {fontsize: 27});
                    spriteZ.position.set(i - 0.5, j - 0.5, n - 0.5);
                    spriteZ.category = 'cubeLabel';
                    cubeHelper.add(spriteZ);
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
                imagePrefix = ['img/dawnmountain-xpos.png', 'img/dawnmountain-xneg.png', 'img/dawnmountain-ypos.png',
                    'img/dawnmountain-yneg.png', 'img/dawnmountain-zpos.png', 'img/dawnmountain-zneg.png'];
                break;
            case 'siege':
                imagePrefix = ['img/siege_ft.png', 'img/siege_bk.png', 'img/siege_up.png',
                    'img/siege_dn.png', 'img/siege_rt.png', 'img/siege_lf.png'];
                break;
            case 'starfield':
                imagePrefix = ['img/starfield_ft.png', 'img/starfield_bk.png', 'img/starfield_up.png',
                    'img/starfield_dn.png', 'img/starfield_rt.png', 'img/starfield_lf.png'];
                break;
            case 'misty':
                imagePrefix = ['img/misty_ft.png', 'img/misty_bk.png', 'img/misty_up.png',
                    'img/misty_dn.png', 'img/misty_rt.png', 'img/misty_lf.png'];
                break;
            case 'tidepool':
                imagePrefix = ['img/tidepool_ft.png', 'img/tidepool_bk.png', 'img/tidepool_up.png',
                    'img/tidepool_dn.png', 'img/tidepool_rt.png', 'img/tidepool_lf.png'];
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
                map: THREE.ImageUtils.loadTexture(imagePrefix[i]),
                side: THREE.BackSide
            });
            materialArray.push(matr);
        }
        skyBox.material = new THREE.MeshFaceMaterial(materialArray);
    },//add background
    add: function () {
        var imagePrefix = ['img/dawnmountain-xpos.png', 'img/dawnmountain-xneg.png', 'img/dawnmountain-ypos.png',
                'img/dawnmountain-yneg.png', 'img/dawnmountain-zpos.png', 'img/dawnmountain-zneg.png'], materialArray = [],
            skyGeometry = new THREE.BoxGeometry(500, 500, 500), skyBox;
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imagePrefix[i]),
                side: THREE.BackSide
            }));
        skyBox = new THREE.Mesh(skyGeometry, imagePrefix);
        skyBox.visible = false;
        App.utils.types.webgl.scene.add(skyBox);
        App.utils.types.webgl.skyBox = skyBox;
    }//add background
};//settings for background

App.guiObj = {
    numberField: null,//input number
    item: [],//input settings for obj
    listOgAngles: null,//list of angles
    btn: null,//buttons
    name: null,//names
    maxNumber: null,
    gui: null,//GUI obj
    animateSpeedOfObj: [],
    folders: {
        menuFolder: null,
        generationFolder: null,
        editFolder: null,
        keysFolder: null,
        anglesFolder: null,
        revoModeFolder: null,
        figureAnimateSet: null,
        generalAnimateSet: null,
        coord: null,
        generalSet: null
    },//folders
    generateParameters: {
        moreThan3: false,
        number: 0,
        coords: '',
        generate: function () {
            App.rebuildNodes(App.guiObj.name);
            if (!App.guiObj.isSceneNotEmpty) {
                App.guiObj.isSceneNotEmpty = true;
                App.guiObj.addLastFolders();
            }
            App.guiObj.interfaces.addEditInfo(inputNumber);
        },
        startAnimation: function () {
            var areAnyObjToAnimate = false, listOfObj = App.utils.types.webgl.listObjOfScene;
            for (var i = 0; i < listOfObj.length; i++) {
                if (listOfObj[i].isAnimateObject) {
                    areAnyObjToAnimate = true;
                    App.utils.interfaces.animateObj(listOfObj[i].name);
                }
            }
            if (!areAnyObjToAnimate) {
                alert('you do not have any object to animate')
            }

        },
        generalSet: {
            duration: 180,
            lastDuratValue: 180
        },
        maxGenereDurtn: 180,
        cubeVisible: true,
        mainCubeColor: 0xfc0094,
        littleCubesColor: 0x0c27f7,
        listTexture: [],
        getScreen: function () {
            var strMime = "image/jpeg";
            var imgData = App.utils.types.webgl.renderer.domElement.toDataURL(strMime);
            App.utils.interfaces.saveFile(imgData.replace(strMime, "image/octet-stream"), "point.jpg");
        }
    },//folders fields
    figure: {
        name: [],
        isExist: function (nam) {
            for (var i = 0; i < this.name.length; i++) {
                if (this.name[i].nam == nam) {
                    this.name[i].key += 1;
                    return this.name[i];
                }
            }
        }
    },//obj settings
    keys: {
        listValues: [],
        listKeys: [],
        getListOfFigures: function (min, max) {
            var arr, unic = this.getUnigueFigure(min, max);
            for (var i = 0; i < unic.length; i++) {
                arr = App.numberWorker.generate(unic[i], true);
                this.listValues.push({key: unic[i], val: arr.arr, size: arr.sum});
            }
            return this.listValues;
        },
        getUnigueFigure: function (min, max) {
            var nums = [];
            for (var i = min; i < max; i++) {
                var fromNumsToArray = ((i.toString()).split(''));
                fromNumsToArray.sort(function (a, b) {
                    if (a < b) {
                        return 1;
                    }
                    if (a > b) {
                        return -1;
                    }
                    if (a == b) {
                        return 0;
                    }
                });
                var nextNum = '';
                for (var n = 0; n < fromNumsToArray.length; n++) {
                    var nextChar = ( fromNumsToArray[n] == 0) ? '0' : fromNumsToArray[n];
                    nextNum += nextChar;
                }
                nextNum = parseInt(nextNum);
                var foundIn = false;
                for (var z = 0; z < nums.length; z++) {
                    if (nums[z] == nextNum) {
                        foundIn = true;
                    }
                }
                if (!foundIn) {
                    nums.push(nextNum);
                }
            }
            return nums;
        },
        contains: function (where, what) {
            var cuWC, curWF
            for (var j = 0; j < where.length; j++) {
                for (var i = 0; i < what.length; i++) {
                    cuWC = where[j].val[i];
                    curWF = what[i];
                    if (cuWC && ((cuWC[0] + '' + cuWC[1] + '' + cuWC[2]) == (curWF[0] + '' + curWF[1] + '' + curWF[2]))) return true;
                }
            }
            return false;
        },
        getSumValOfArr: function (arr) {
            var sm = 0;
            for (var i = 0; i < arr.length; i++) {
                sm += parseInt(arr[i][0] + '' + arr[i][1] + '' + arr[i][2]);
            }
            return sm;
        }
    },
    init: function () {
        this.gui = window.innerWidth < 800 ? new dat.GUI({width: 290}) : new dat.GUI({width: 255});
        this.gui.open();
        this.folders.menuFolder = this.gui.addFolder('Menu');
        this.folders.menuFolder.add(App.guiObj.generateParameters, 'getScreen').name('ScreenShot');
        this.folders.menuFolder.open();
        this.folders.generationFolder = this.folders.menuFolder.addFolder('Generation');
        this.folders.keysFolder = this.folders.menuFolder.addFolder('List of the Keys');
        this.folders.generalSet = this.folders.menuFolder.addFolder('General Settings');

        this.interfaces.addGenerationFold();
        this.interfaces.generalSetFolders(this.folders.generalSet, App.guiObj.generateParameters);
        //this.interfaces.keysFolderGenerate(this.folders.keysFolder);

        $(".hue-field").width(10);
        $("select").css('color', 'black');
    },//drawing GUI
    addLastFolders: function () {
        var generalAnimateSet = this.folders.generalAnimateSet,
            revoModeFolder = this.folders.revoModeFolder, generateParameters = this.generateParameters;
        this.folders.editFolder = this.folders.menuFolder.addFolder('Edit');
        this.folders.anglesFolder = this.folders.menuFolder.addFolder('Angles and Surfaces');
        revoModeFolder = this.folders.revoModeFolder = this.folders.menuFolder.addFolder('Revolution Mode');
        this.folders.figureAnimateSet = this.folders.revoModeFolder.addFolder('Figure Settings');
        generalAnimateSet = this.folders.generalAnimateSet = this.folders.revoModeFolder.addFolder('General Settings');
        generalAnimateSet.add(generateParameters.generalSet, 'duration').min(0).max(180).step(1).onChange(function (val) {
            generateParameters.generalSet.lastDuratValue = val;
            App.guiObj.interfaces.setMaxTimeForAnimationFigures(val);
        });

        revoModeFolder.add(generateParameters, 'startAnimation').name('Begin');
    },
    interfaces: {
        addGenerationFold: function () {
            var generationFolder = App.guiObj.folders.generationFolder,
                numberField = App.guiObj.numberField,
                maxNumber = App.guiObj.maxNumber,
                btn = App.guiObj.btn,
                coord = App.guiObj.folders.coord,
                item = App.guiObj.item,
                generateParameters = App.guiObj.generateParameters;

            generationFolder.add(generateParameters, 'moreThan3').name('> 3-digit number').onChange(function (flag) {
                var listOfPoints = App.utils.types.listOfPoints;
                flag ? maxNumber = 99999 : maxNumber = 999;
                generationFolder.__controllers.slice(generationFolder.__controllers.indexOf(numberField), 1);
                $('.cr.number.has-slider').eq(0).remove();
                generateParameters.number = 0;
                if (listOfPoints) App.guiObj.interfaces.clearGenerationFolder(generationFolder, item, btn);
                numberField = generationFolder.add(generateParameters, 'number', 100)
                    .max(maxNumber).step(1).name('Enter Coordinates:').onChange(function (number) {
                        if (!App.guiObj.isGeneratePointAvialaable) {
                            App.guiObj.isGeneratePointAvialaable = true;
                            coord = App.guiObj.folders.coord = App.guiObj.folders.generationFolder.addFolder('Coordinates');
                        }
                        App.guiObj.name = number;
                        if (!isNaN(number)) {
                            if (listOfPoints) App.guiObj.interfaces.clearGenerationFolder(generationFolder, item, btn);
                            inputNumber = number;
                            App.utils.types.listOfPoints = listOfPoints = App.numberWorker.generate(inputNumber);
                            for (var i = 0; i < listOfPoints.length; i++) {
                                generateParameters.coords = listOfPoints[i][0] + ',' + listOfPoints[i][1] + ',' + listOfPoints[i][2];
                                item[i] = coord.add(generateParameters, 'coords').name('Coordinate ' + i);
                            }
                            btn = generationFolder.add(generateParameters, 'generate');
                            btn.name('Create!');
                        } else {
                            alert('Please, input a number.')
                        }
                    });

            });

            numberField = generationFolder.add(generateParameters, 'number', 100).max(999).step(1).name('Enter Coordinates:')
                .onChange(function (number) {
                    var listOfPoints = App.utils.types.listOfPoints;
                    if (!App.guiObj.isGeneratePointAvialaable) {
                        App.guiObj.isGeneratePointAvialaable = true;
                        coord = App.guiObj.folders.coord = App.guiObj.folders.generationFolder.addFolder('Coordinates');
                    }
                    App.guiObj.name = number;
                    if (!isNaN(number)) {
                        if (listOfPoints) App.guiObj.interfaces.clearGenerationFolder(generationFolder, item, btn);
                        inputNumber = number//(name.toString().length > 3) ? Math.round(name) : number;
                        App.utils.types.listOfPoints = listOfPoints = App.numberWorker.generate(inputNumber);
                        for (var i = 0; i < listOfPoints.length; i++) {
                            generateParameters.coords[i] = []
                            generateParameters.coords = listOfPoints[i][0] + ',' + listOfPoints[i][1] + ',' + listOfPoints[i][2];
                            item[i] = coord.add(generateParameters, 'coords').name('Coordinate ' + i);
                        }
                        btn = generationFolder.add(generateParameters, 'generate');
                        btn.name('Create!');
                    } else {
                        alert('Please, input a three-digit number.')
                    }
                });


        },
        clearGenerationFolder: function (generationFolder, item, btn) {
            var listOfPoints = App.utils.types.listOfPoints;
            for (var i = 0; i < listOfPoints.length; i++) {
                if (item[i]) {
                    item[i].domElement.remove();
                    generationFolder.remove(item[i])
                }
            }
            if (listOfPoints && btn)generationFolder.remove(btn)
        },
        addEditInfo: function (number) {
            var editParameters = {
                visible: true,
                opacity: 5,
                figure: {
                    displayNumbers: true,
                    displayPoints: true,
                    displayLines: true,
                    displayCircle: true,
                    fillFigure: true,
                    agleShow: true
                },
                colorNumbers: "#9012e8",
                colorTubes: "#22a6cf",
                colorCircle: "#22a6cf",
                colorFill: "#22a6cf",
                remove: function () {
                }
            };
            var listObjOfScene = App.utils.types.webgl.listObjOfScene, nam = listObjOfScene[listObjOfScene.length - 1].name;
            var curFigure = App.guiObj.folders.editFolder.addFolder(nam);
            curFigure.id = nam;
            lastCheck.addEl(nam, true, lastCheck.point);
            lastCheck.addEl(nam, true, lastCheck.angle);
            curFigure.add(editParameters.figure, 'displayPoints').name('Display Points').onChange(function (val) {
                App.utils.interfaces.tipsArray.toggleVisible(nam, val);
                App.utils.interfaces.pointsArray.toggleVisible(nam);
                lastCheck.addEl(nam, val, lastCheck.point);
            });
            curFigure.add(editParameters.figure, 'agleShow').name('Display Angles').onChange(function (val) {
                App.utils.interfaces.tipsArray.angleVisible(nam, val);
                lastCheck.addEl(nam, val, lastCheck.angle);
            });
            curFigure.add(editParameters.figure, 'displayLines').name('Display Lines').onChange(function () {
                App.utils.interfaces.tubesArray.toggleVisible(nam);
            });
            curFigure.add(editParameters.figure, 'displayCircle').name('Display Sphere').onChange(function () {
                App.utils.interfaces.sphere.toggleVisible(nam);
            });
            curFigure.add(editParameters.figure, 'fillFigure').name('Display Figure').onChange(function () {
                App.utils.interfaces.shape.toggleVisible(nam);
            });
            curFigure.add(editParameters, 'visible').name('Global Visible').onChange(function (val) {
                App.utils.interfaces.tipsArray.toggleVisible(nam, val, true);
                App.utils.interfaces.tipsArray.angleVisible(nam, val, true);
                App.utils.interfaces.toggleVisible(nam, val);
            });
            curFigure.addColor(editParameters, 'colorNumbers').name('Color Numbers').onChange(function (clr) {
                App.utils.interfaces.pointsArray.changeColor(clr.substr(1), nam);
            });
            curFigure.addColor(editParameters, 'colorCircle').name('Color Sphere').onChange(function (clr) {
                App.utils.interfaces.sphere.changeColor(clr.substr(1), nam);
            });
            curFigure.addColor(editParameters, 'colorTubes').name('Color Tubes').onChange(function (clr) {
                App.utils.interfaces.tubesArray.changeColor(clr.substr(1), nam);
            });
            curFigure.addColor(editParameters, 'colorFill').name('Color Figure').onChange(function (clr) {
                App.utils.interfaces.shape.changeColor(clr.substr(1), nam);
            });
            curFigure.add(editParameters, 'opacity').min(0).max(100).step(10).name('Fill Transparency').onChange(function (val) {
                App.utils.interfaces.shape.changeOpacity(val / 100, nam);
            });
            curFigure.add(editParameters, 'remove').name('Drop ' + nam).onChange(function () {
                App.utils.interfaces.removeObj(nam);
                App.guiObj.interfaces.removeFigure(nam);
            });
            this.addRevolModeData(nam);
            this.addFigureInfo(nam);
            $(".hue-field").width(10); // костыль, чтоб не съезжала палитра addColor
        },
        addRevolModeData: function (nameFigure) {
            var revolModelSet = {
                figureSet: {
                    startT: 0,
                    durationAn: 0,
                    x: 0,
                    y: 0,
                    z: 0
                },
                timeFigureBegn: 0,
                curStrtDurtnAnmt: [],
                rotate: []
            };
            var curFigureSet;

            curFigureSet = App.guiObj.folders.figureAnimateSet.addFolder(nameFigure);

            curFigureSet.add(revolModelSet, 'rotate', ['degree', 'step']).name('Rotate by').onChange(function (value) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['rotate'] = value;
            });
            curFigureSet.add(revolModelSet.figureSet, 'x').min(-720).max(720).step(1).name('X').onChange(function (val) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['x'] = val;
            });
            curFigureSet.add(revolModelSet.figureSet, 'y').min(-720).max(720).step(1).name('Y').onChange(function (val) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['y'] = val;
            });
            curFigureSet.add(revolModelSet.figureSet, 'z').min(-720).max(720).step(1).name('Z').onChange(function (val) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['z'] = val;
            });
            $("select").css('color', 'black');
            this.addFigureAnimSet(curFigureSet, nameFigure, revolModelSet);

        },
        addFigureAnimSet: function (curFigureSet, nameFigure) {
            var revolModelSet = {
                    figureSet: {
                        startT: 0,
                        durationAn: 0,
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    timeFigureBegn: 0,
                    curStrtDurtnAnmt: []
                },
                generateParameters = App.guiObj.generateParameters;

            var startAn, durAn,
                startAn = curFigureSet.add(revolModelSet.figureSet, 'startT').min(0)
                    .max(generateParameters.generalSet.lastDuratValue).step(1).name('Start Animation');
            startAn.onChange(function (val) {
                var curObjSet = App.guiObj.interfaces.getCurObjSpeed(nameFigure);
                curObjSet['time'] = val;
                App.guiObj.interfaces.addNewDuration(generateParameters.generalSet.lastDuratValue - val, curObjSet, nameFigure);
            });

            durAn = curFigureSet.add(revolModelSet.figureSet, 'durationAn').min(0)
                .max(generateParameters.generalSet.lastDuratValue).step(1).name('Animate Duration');
            durAn.onChange(function (val) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['duration'] = val;
            });
            this.addOrSetAnmtSpeeObj(nameFigure, startAn, durAn, curFigureSet);

        },
        addNewDuration: function (maxVal, objFol, nameFigure) {
            objFol.durAn.domElement.remove();
            objFol.curFigSet.remove(objFol.durAn);
            var figureSet = {
                durationAn: 0
            }
            var newDur = objFol.curFigSet.add(figureSet, 'durationAn').min(0)
                .max(maxVal).step(1).name('Animate Duration');
            newDur.onChange(function (val) {
                App.guiObj.interfaces.getCurObjSpeed(nameFigure)['duration'] = val;
            });
            this.addOrSetAnmtSpeeObj(nameFigure, null, newDur, objFol);
        },
        addOrSetAnmtSpeeObj: function (nameFigure, startAn, durAn, curFigureSet) {
            var animateSpeedOfObj = App.guiObj.animateSpeedOfObj;
            for (var i = 0; i < animateSpeedOfObj.length; i++) {
                if (animateSpeedOfObj[i].name == nameFigure) {
                    if (startAn)animateSpeedOfObj[i].startAn = startAn;
                    if (durAn)animateSpeedOfObj[i].durAn = durAn;
                    return;
                }
            }
            animateSpeedOfObj.push({
                name: nameFigure, x: 0, y: 0, z: 0, time: 0, duration: 0,
                startAn: startAn, durAn: durAn, curFigSet: curFigureSet, rotate: 'degree'
            });
        },
        setMaxTimeForAnimationFigures: function (value) {
            var animateSpeedOfObj = App.guiObj.animateSpeedOfObj;
            for (var i = 0; i < animateSpeedOfObj.length; i++) {
                var curStrAn = animateSpeedOfObj[i];
                curStrAn.startAn.domElement.remove();
                curStrAn.durAn.domElement.remove();
                curStrAn.curFigSet.remove(curStrAn.startAn);
                curStrAn.curFigSet.remove(curStrAn.durAn);
                this.addFigureAnimSet(curStrAn.curFigSet, curStrAn.name);
            }
        },
        getCurObjSpeed: function (name) {
            var animateSpeedOfObj = App.guiObj.animateSpeedOfObj;
            for (var i = 0; i < animateSpeedOfObj.length; i++) {
                if (animateSpeedOfObj[i].name == name) return animateSpeedOfObj[i];
            }
        },
        generalSetFolders: function (generalSet, generateParameters) {
            generalSet.add(generateParameters, 'cubeVisible').name('Main Visible').onChange(function (val) {
                App.utils.types.webgl.cubeHelper.visible = val;
            });
            generalSet.add(generateParameters, 'cubeVisible').name('Cube Visible').onChange(function (val) {
                App.utils.types.webgl.cubeHelper.getObjectByProperty('category', 'mainCube').visible = val;
            });
            generalSet.add(generateParameters, 'cubeVisible').name('Cubes Visible').onChange(function (val) {
                App.rebuildCubes.setVisibleForChild(val, 'littleCube');
            });
            generalSet.add(generateParameters, 'cubeVisible').name('Point Label Visible').onChange(function (val) {
                App.rebuildCubes.setVisibleForChild(val, 'cubeLabel');
            });
            generalSet.addColor(generateParameters, 'mainCubeColor').name('Main Cube Color').onChange(function (val) {
                App.rebuildCubes.changeColorMainCube(val);
            });
            generalSet.addColor(generateParameters, 'littleCubesColor').name('Color for cubes').onChange(function (val) {
                App.rebuildCubes.changeColorLittleCubes(val);
            });
            generalSet.add(generateParameters, 'listTexture', ['NONE', 'mountain', 'siege', 'starfield', 'misty', 'tidepool']).name('Background').onChange(function (val) {
                App.rebuildSkyBox.changeBackground(val);
            });
        },
        keysFolderGenerate: function (keysFolder) {
            var curKeyF = {
                square: 0,
                sum: 0,
                size: 0,
                addFigure: function () {
                },
                angles: {
                    angle: 0,
                    name: ''
                }
            }, curVal, angles;
            var listOfGenerateObj = App.guiObj.keys.getListOfFigures(100, 999);
            for (var i = 0; i < listOfGenerateObj.length; i++) {
                var key = listOfGenerateObj[i].key;
                curKeyF.size = listOfGenerateObj[i].size.toString();
                curVal = Math.figureDataByPoints(listOfGenerateObj[i].val);
                angles = curVal.angle;
                var keyFld = keysFolder.addFolder('Figure ' + key);
                curKeyF.square = curVal.square.toString();
                curKeyF.sum = curVal.sum.toString();
                var angl = keyFld.addFolder('Corner\'s');
                for (var j = 0; j < angles.length; j++) {
                    curKeyF.angles.angle = angles[j] + '\xB0';
                    angl.add(curKeyF.angles, 'angle').name('Angle ' + j).__input.disabled = true;
                }
                keyFld.add(curKeyF, 'square').name('Square').__input.disabled = true;
                keyFld.add(curKeyF, 'sum').name('Sum').__input.disabled = true;
                keyFld.add(curKeyF, 'size').name('Size').__input.disabled = true;
                keyFld.add(curKeyF, 'addFigure').name('Add this Figure ' + i).onChange(function () {
                    if (!App.guiObj.isSceneNotEmpty) {
                        App.guiObj.isSceneNotEmpty = true;
                        App.guiObj.addLastFolders();
                    }
                    var nameF = this.__li.textContent;
                    var figure = parseInt(nameF.substr(15));
                    var key = listOfGenerateObj[figure].key
                    App.utils.types.listOfPoints = listOfGenerateObj[figure].val;
                    App.guiObj.name = inputNumber = key;
                    App.rebuildNodes(key);
                    App.guiObj.interfaces.addEditInfo(key);
                });
            }
        },
        addFigureInfo: function (name) {
            var anglesFolder = App.guiObj.folders.anglesFolder.addFolder(name), figureSet = null, figData = {
                square: null,
                angle: null,
                triangleSquare: null
            }, listOfPoints = App.utils.types.listOfPoints;
            if (listOfPoints) {
                figureSet = Math.figureDataByPoints(listOfPoints);
                figData.square = figureSet.square.toString();
                anglesFolder.add(figData, 'square').name('General Square').__input.disabled = true;
                var triangleSq = anglesFolder.addFolder('Square SubFigures')
                var angles = anglesFolder.addFolder('Angles')
                var mainAngles = angles.addFolder('Main Angles')
                //for (var i = 0; i < figureSet.squareFigs.length; i++) {
                //    figData.triangleSquare = figureSet.squareFigs[i].toString();
                //    triangleSq.add(figData, 'triangleSquare').name('Sub Figure ' + i).__input.disabled = true;
                //}

                for (var i = 0; i < figureSet.angle.length; i++) {
                    figData.angle = figureSet.angle[i] + '\xB0';
                    mainAngles.add(figData, 'angle').name('Angle ' + i).__input.disabled = true;
                }
                if (figureSet.angle.length == 3) {
                    App.guiObj.listOgAngles.pop();
                }
                for (var i = 0; i < App.guiObj.listOgAngles.length; i++) {
                    figData.angle = App.guiObj.listOgAngles[i];
                    angles.add(figData, 'angle').name('Angle ' + i).__input.disabled = true;
                }
            }
        },
        removeFigure: function (name) {
            var editFolder = App.guiObj.folders.editFolder;
            var anglesFolder = App.guiObj.folders.anglesFolder;
            var figureAnimateSet = App.guiObj.folders.figureAnimateSet;
            editFolder.__folders[name].__ul.remove();
            anglesFolder.__folders[name].__ul.remove();
            figureAnimateSet.__folders[name].__ul.remove();
            editFolder.close();
            anglesFolder.close();
            figureAnimateSet.close();
        }
    }//settings for objects

};//settings for gui controll

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
                console.log(x + '' + y + '' + z);
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

        newAr.pop();
        return newAr;
    }

};//work with input number

/**
 * Math calculation
 */
Math.figureDataByPoints = function (arr) {
    var squareFig = 0, squareFigs = [], sumPoints = 0, angles = [], cur, arrLast = arr[arr.length - 1], prev = arr[0];
    if (arr.length > 2) {
        for (var i = 1; i < arr.length && i + 1 < arr.length; i++) {
            cur = arr[i];
            squareFigs.push(this.getSquareByPoints(arr[0], cur, arr[i + 1]));
            squareFig += squareFigs[squareFigs.length - 1];
            angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(prev, arr[i + 1], cur, false, true)));
            prev = arr[i];
        }
//    sumPoints += arrLast[0] + arrLast[1] + arrLast[2];
        angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(arr[arr.length - 2], arr[0], arrLast, false, true)));
        angles.push(this.round(Math.getCornerBtwTwoVercorsAndIntrsctinPnt(arr[1], arrLast, arr[0], false, true)));
    } else {
        angles.push(0);
    }
    sumPoints += arr[0][0] + arr[0][1] + arr[0][2];
    return {squareFigs: squareFigs, square: squareFig, sum: sumPoints, angle: angles};
};//return squares of all figures, square of main figure,sum of points, angles
Math.getSquareByPoints = function (p1, p2, p3) {
    var perimeter, a, b, c, x, y, z;
    x = p1[0] - p2[0];
    y = p1[1] - p2[1];
    z = p1[2] - p2[2];
    a = this.sqrt(x * x + y * y + z * z);
    x = p1[0] - p3[0];
    y = p1[1] - p3[1];
    z = p1[2] - p3[2];
    b = this.sqrt(x * x + y * y + z * z);
    x = p2[0] - p3[0];
    y = p2[1] - p3[1];
    z = p2[2] - p3[2];
    c = this.sqrt(x * x + y * y + z * z);
    perimeter = (a + b + c) / 2;
    return this.sqrt(perimeter * (perimeter - a) * (perimeter - b) * (perimeter - c));
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
Math.getPositionForValueOfCorner = function (point1, intersectPoint, point2, endInterPoint) {
    var i = 0, vector1 = this.getAverageValueOfHighForTriangle(point1, point2);
    var returnVect = this.getAverageValueOfHighForTriangle(vector1, intersectPoint);
    while (i++ < 3) {
        returnVect = this.getAverageValueOfHighForTriangle(returnVect, intersectPoint);
    }
    if (endInterPoint) {
        returnVect = this.getAverageValueOfHighForTriangle(returnVect, intersectPoint);
    }
    return returnVect;
}//get position for tables
Math.getAverageValueOfHighForTriangle = function (vector1, intersectPoint) {
    var returnVect = {};
    returnVect.x = (vector1.x + intersectPoint.x) / 2;
    returnVect.y = (vector1.y + intersectPoint.y) / 2
    returnVect.z = (vector1.z + intersectPoint.z) / 2;
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
    App.utils.types.webgl.controls.target.set(av, av, av);
    return av;
};
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

/**
 * start app on document ready
 */
$(document).ready(function () {
    var start = new Date();
    App.utils.interfaces.Run();
    /**video background controller**/
    var back = App.utils.types.backgroundContainer;
    $('#' + back.id + ' img').mousedown(function () {
        $('#' + back.id).css('box-shadow', '0 0 10px rgba(0,0,0,0.5)');
    }).mouseup(function () {
        App.utils.interfaces.backControls(back);
    });
    //$('#preloade').fadeOut('slow');
});
