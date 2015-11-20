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
App.utils = {
    events: {
        onWindowResize: function () {
            App.utils.types.webgl.controls.handleResize();
            App.utils.events.staticResize();

        },
        staticResize: function () {
            var webglObj = App.utils.types.webgl, imgWidth = App.utils.interfaces.SW(), imgHeight = App.utils.interfaces.SH(), left = imgWidth * 0.066, bottom = imgHeight * 0.05
            //$('#fond img').css('width', imgWidth );
            //$('#THREEJS').css('padding-top', top );
            imgWidth = imgWidth - (2 * left);
            imgHeight = imgHeight - (bottom);
            $('#THREEJS canvas').css('width', imgWidth);
            $('#THREEJS canvas').css('height', imgHeight);
            webglObj.renderer.setSize(imgWidth, imgHeight);
            webglObj.camera.aspect = imgWidth / imgHeight;
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
        onMouseUp: function () {
            if (App.utils.types.webgl._2dConsist) {
                App.utils.types.webgl._2dConsist.canMove = false;
                document.getElementById("THREEJS").style.cursor = "auto";
            }
        },
        onDoubleClick: function () {
            var webglObj = App.utils.types.webgl;
            if (webglObj._2dConsist) {
                webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -45);
                webglObj.camera.position.z = -15;
                /* var listOb = webglObj.listObjOfScene,pl=webglObj._2dConsist.position;
                 for(var i =0;i<listOb.length;i++){
                 listOb[i].tipsObject.position.set(pl.x,pl.y,pl.z);
                 }*/
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
        parent: null,
        cameraDistance: 20,
        iAnimate: 0,
        frame: 0,
        autoRotate: true,
        mouse: {},
        accessPoint: [],
        _2dPlateSize: {x: 44.8, y: 21.3},
        webgl: {
            scene: null,
            _dimension: '3D',
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
            /* var loader = new THREE.ColladaLoader();
             loader.options.convertUpAxis = true;
             loader.load( 'assets/model/PALAS3D_0.dae', function ( collada ) {
             dae = collada.scene;
             dae.traverse( function ( child ) {
             if ( child instanceof THREE.SkinnedMesh ) {
             child.position.set(0,0,0);
             }
             } );
             dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
             dae.updateMatrix();
             webglObj.scene.add(dae);
             this.init();
             this.animate();
             } );*/
            this.init();
            this.animate();
        },//start app
        init: function () {
            var webglObj = App.utils.types.webgl;

            var cube = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 9), new THREE.MeshBasicMaterial(0xff00ff));
            var helper = new THREE.BoxHelper(cube);

            var camera = webglObj.camera = new THREE.PerspectiveCamera(40, (window.innerWidth / window.innerHeight), 0.01, 1000);
            camera.position.set(20, 20, 20);
            webglObj.scene.add(webglObj.camera);
            webglObj.container = document.getElementById('THREEJS');

            // lights
            webglObj.light = new THREE.DirectionalLight(0x4444cc, 2);
            webglObj.light.intensity = 0;
            webglObj.light.position.set(10, 10, 10).normalize();
            //light.shadowCameraVisible = true;

            //webglObj.light.shadowDarkness = 0;
            //webglObj.light.castShadow = false;
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
            //renderer.shadowMapType = THREE.PCFSoftShadowMap;
            //webglObj.renderer.shadowMapEnabled = false;
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
            //webglObj.cubeHelper.visible=false;
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

            //gui
            App.guiObj.init();

            //events
            window.addEventListener('resize', App.utils.events.onWindowResize, false);
            renderer.domElement.addEventListener('mousemove', App.utils.events.onMouseMove, false);
            renderer.domElement.addEventListener('mousedown', App.utils.events.onMouseDown, false);
            renderer.domElement.addEventListener('dblclick', App.utils.events.onDoubleClick, false);
            document.getElementById('THREEJS').addEventListener('mouseup', App.utils.events.onMouseUp, false);


            this.render();
        },//init webgl objects
        // Create particle group and emitter
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
                if (type.autoRotate && !webglObj.cameraFixed) {
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
                            webglObj.camera.position.z -= lastObj.circle2D.radious2d>6?-0.3:0.07;
                        }
                        /*    var  lifeDistance = Math.getDistBtwTwoPoints(webglObj._2dConsist.position, camerPos)
                         if (lifeDistance > 10) {
                         if (App.utils.types.cameraDistance-- > (2 * obj.radiousObj)) {
                         webglObj.camera.position.z -= 0.5;
                         }
                         } else {
                         if (App.utils.types.cameraDistance-- > (2.5 * obj.radiousObj)) {
                         webglObj.camera.position.z -= 0.1;
                         }
                         }*/
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
                canvasHeight: parameters.hasOwnProperty("canvasHeight") ? parameters["canvasHeight"] : false
            }
            var addText = App.utils.interfaces.addTexture;
            var old = addText(obj);
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
            context.strokeStyle = "rgba(0, 0, 0, 1)";
            context.lineJoin = "round";
            if (obj.isRoundCorner) {
                App.rebuild2D.roundRect(context, rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar, 6, true);
            } else {
                context.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
                context.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - mPar, rectHeight - mPar);
            }

            context.strokeStyle = "rgba(255, 255, 255, 1)";
            context.lineWidth = canvasWidth ? borderThickness / 2 : borderThickness;
            context.fillStyle = "rgba(0, 0, 0, 1.0)";
            context.fillText(message, borderThickness + shift.x, fontsize + borderThickness + shift.y);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
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
                    if (verticiesArray[i] instanceof Array) {
                        points.push(new THREE.Vector3(verticiesArray[i][0], verticiesArray[i][1], verticiesArray[i][2]));
                    } else {
                        points.push(new THREE.Vector3(verticiesArray[i]['x'], verticiesArray[i]['y'], verticiesArray[i]['z']));
                    }
                }

                var geometry = new THREE.ConvexGeometry(points);
                return geometry;
            }
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
            curObj.object2D.rotation.z += x+y+z;
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
            var curObjAct = App.utils.interfaces.getObjByName(name);
            if (curObjAct) {
                curObjAct.visible = val;
                curObjAct.object2D.visible = val;
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
                var curObjAct = name.name ? name : App.utils.interfaces.getObjByName(name);
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
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    //if (!curObjAct.dimensn) {
                    curObjAct.sphere.visible = val;
                    curObjAct.circle2D.visible = val;
                    //} else {
                    //    curObjAct.circle2D.visible = val;
                    //}
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
            }
        },//sphere behavior
        shape: {
            toggleVisible: function (name, val) {
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.visible = val;
                    curObjAct.shape2D.visible = val;
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
                var curObjAct = App.utils.interfaces.getObjByName(name);
                if (curObjAct) {
                    curObjAct.shape.material.opacity = val;
                    curObjAct.shape2D.material.opacity = val;
                }
            }//opacity for shape
        }//shape behavior
    }//app methods
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


THREE.Mesh.prototype.building = function (arr, flag, objOfScene, flag1) {
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
        var tubeMaterial;// = currentObject.material;
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
            var truba = flag ? lastObj.helpers.getLineByPoint(vBegn, vEnd) : objOfScene.helpers.getTubeByPoint(vBegn, vEnd, false, flag);
            if (!truba.visible) {
                if (!flag) {
                    truba.geometry = App.utils.interfaces.tubeLineGeometry(vBegn, vBegn, flag);
                    truba.visible = true;
                }
                curPoint.truba = truba;
                tubeMaterial = truba.material;
                //var copy =arr.concat([]);
                //arr = objOfScene.category == 'object2D'?[]:arr;
                var timerH = flag ? flag : Math.getRandomArbitrary(20, 50);
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
                            if (!arr.length && currentObject.isFirst && objOfScene._2dPnts.length > 3) {
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
                    ne.building(arr, flag, objOfScene);
                } else {
                    var enPpos = new THREE.Vector3(
                        (vEnd.x - vBegn.x) * ((curPoint.keyP) / curPoint.countOfPoints) + vBegn.x,
                        (vEnd.y - vBegn.y) * ((curPoint.keyP) / curPoint.countOfPoints) + vBegn.y,
                        (vEnd.z - vBegn.z) * ((curPoint.keyP++) / curPoint.countOfPoints) + vBegn.z
                    );
                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, enPpos, flag);
                    if (flag) {
                        tube = new THREE.Line(tubeGeometry, tubeMaterial);
                        objOfScene.add(tube);
                    } else {
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

/**
 * Objects creation
 */
App.rebuildNodes = function (numer) {
    /**
     * Variables and objects initialising
     */
    var objectsForConnect = [], objOfScene,
        number = App.utils.types.inputNumber,
        webglObj = App.utils.types.webgl,
        sendData = {angleTooltips: [], squareTooltips: []},
        isBig=true;
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
    /*-----------2d-----------*/
    var _2d = objOfScene.object2D = new THREE.Object3D();
    _2d.category = 'object2D';
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
    _2dTbs.updateMatrixWorld();
    _2d.add(_2dTbs);

    //square
    var _2dSq = _2d.square2D = new THREE.Object3D();
    _2dSq.category = 'square2D';
    _2dSq.visible = false;
    _2dSq.updateMatrixWorld();
    _2d.add(_2dSq);
    objOfScene.object2D.genSquare = {};

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
            var isbig = number.toString().length > 3, littleR = isbig ? 0.08 : 0.1;
            aveageNum = Math.average(number), radiusOfMainSphere = Math.sphereRadius(number, aveageNum);

            for (var i = 0; i < resArr.length; i++) {
                objOfScene.listOf2dCord.push(resArr[i][0] + '' + resArr[i][1] + '' + resArr[i][2])
            }
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
                    fontsize: 17,
                    borderThickness: 1,
                    canvasWidth: 3,
                    canvasHeight: 40,
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
                if(isBig) {
                    var stepEps = 0.05,
                        circle = new THREE.Mesh(new THREE.RingGeometry(littleR + 0.01, littleR, 32), new THREE.MeshBasicMaterial({
                            color: 0x9012e8, side: THREE.DoubleSide
                        }));
                    circle.category = 'point';
                    var sprite = objOfScene.Sprite.clone();
                    sprite.scale.multiplyScalar(2.5);
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
                sprite.position.set(cur.x, cur.y + (stepEps * 5), cur.z + stepEps);
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
                _2dCord = objOfScene.listOf2dCord.concat([]);
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
                    objOfScene.tubesArray.push(objOfScene.tube);
                    objOfScene.add(objOfScene.tube);
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(vBegn);
                    geometry.vertices.push(vEnd);
                    var line = new THREE.Line(geometry, mat);
                    line.updateMatrixWorld();

                    //line.visible = false;
                    if (!inner) {
                        objOfScene.tube.inner = inner = true;
                    } else if (lastObj == key) {
                        lastObj = false;
                        objOfScene.tube.inner = inner = true;
                    }

                    line.tube = objOfScene.tube;
                    line.id_tub = id_tub++;
                    objOfScene.linsArray.push(line);
                    objOfScene.add(line);
                });
            }
            if(isBig) {
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
            var last2dObj = _2dCord.length - 2/*, isComplex = objOfScene.listOf2dCord.length > 3*/;
            while (_2dCord.length) {
                var cur = _2dCord.shift(), inner = false;
                $.each(_2dCord, function (key, nextObject) {
                    var next = nextObject,
                        vBegn = new THREE.Vector3(cur.x, cur.y, cur.z),
                        vEnd = new THREE.Vector3(next.x, next.y, next.z);

                    var tubeGeometry = App.utils.interfaces.tubeLineGeometry(vBegn, vEnd, false, 0.03);
                    var line = new THREE.Mesh(tubeGeometry, mat);// new THREE.Line(geometry, mat);
                    line.updateMatrixWorld();
                    line.vBegn = vBegn;//geometry.vertices[0].clone();
                    line.vEnd = vEnd;//geometry.vertices[1].clone();
                    if (!inner) {
                        line.inner = inner = true;
                    } else if (last2dObj == key) {
                        last2dObj = false;
                        line.inner = true;
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
        },
        drawCircle: function (number) {
            var circleCenter = aveageNum ? aveageNum : Math.average(number),
                radius = radiusOfMainSphere ? radiusOfMainSphere : Math.sphereRadius(number, circleCenter),
                sphereCenter = App.utils.types.sphereCenter,
                geometrySphere = new THREE.SphereGeometry(radius, 32, 32),
                materialSphere = new THREE.MeshNormalMaterial({
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
            objOfScene.radiousObj = radius;
            objOfScene.sphere = new THREE.Mesh(geometrySphere, materialSphere);
            objOfScene.sphere.renderOrder = 2;
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
                color: 0x9012e8, side: THREE.DoubleSide, wireframe: true
            });
            objOfScene.circle2D = new THREE.Mesh(new THREE.TorusGeometry(radious2d , 0.01, 30,200), matr);
            objOfScene.circle2D.radious2d = radious2d;
            objOfScene.circle2D.updateMatrixWorld();
            objOfScene.circle2D.visible = vis;
            objOfScene.object2D.add(objOfScene.circle2D);
            objOfScene.circle2D.position.set(pos2d.x, pos2d.y, pos2d.z);
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
                if(isBig) {
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
                this.drawSquareByPoints(objectsForConnect);
                this.drawAngles(objectsForConnect);
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
            /**add tooltip**/
            var curP, newFig;
            for (var i = 0; i < objOfScene.polygonsAr.length; i++) {
                curP = objOfScene.polygonsAr[i];
                for (var j = 0; j < curP.length; j++) {
                    newFig = this.drawAngles(curP[j]);
                    if (newFig) {
                        this.drawSquareByPoints(newFig)
                    }
                    else {
                        this.drawSquareByPoints(curP[j]);
                    }

                }
            }

            //console.log(objOfScene.polygonsAr[1][0]);

            /*drop intersect sphere-points */
            this.finalSettings(objOfScene);

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
                return newArr[index]
            } else {
                return false;
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
            var objEf, factor = radiusOfMainSphere / 50, sphere = new THREE.SphereGeometry(radiusOfMainSphere + 1, 36, 36), scale = 0.0;
            switch (App.utils.types.animaEffect) {
                case 'building':
                    objEf = {ef: 1};
                    var objectsForConnect = [], points2D = [];
                    objOfScene.pointsArray.concat([]);
                    for (var l = 0; l < objOfScene.pointsArray.length; l++) {
                        if (objOfScene.pointsArray[l].category == 'points') {
                            objectsForConnect.push(objOfScene.pointsArray[l])
                            objOfScene.pointsArray[l].visible = false;
                            objOfScene.pointsArray[l].tooltip.visible = false;
                        }
                    }
                    for (var i = 0; i < objOfScene.tubesArray.length; i++) {
                        objOfScene.tubesArray[i].visible = false;
                        objOfScene.tubesArray[i].material.opacity = 1;
                    }

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
            App.utils.types.webgl.listObjOfScene.push(objOfScene);

            objOfScene.isHuge = isBig = number.toString().length == 3;
            this.drawPoints(resArr, number);
            this.drawConnections(objectsForConnect);
            this.drawCircle(number);
            this.drawShape(resArr, number);

            if (webglObj._dimension) {
                App.utils.types.webgl.camera.lookAt(objOfScene.sphere.position);
                App.utils.types.webgl.camera.position.set(20, 20, 20);
                App.utils.types.cameraDistance = 20;
                //App.utils.interfaces.changeDimension(false);
                //this.effects.disableMaterials();
            } else {
                var cir = {}, speed = 90;
                cir.x = objOfScene.circle2D.position.x,
                    cir.y = objOfScene.circle2D.position.y;
                var step = {x: ( -cir.x) / speed, y: ( -cir.y) / speed};
                webglObj._2dConsist.bgnPath = 0;
                webglObj._2dConsist.endPath = speed;
                webglObj._2dConsist.steps = step;
                //App.utils.interfaces.setView('2D');
                webglObj._2dConsist.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -45);
                webglObj.camera.position.z = -15;
            }
            if (isBig) {
                App.utils.types.frame = 0;
                var loaded = false;
                if ((  loaded = App.remote.data)) {
                    //draw angles and squares
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
                    this.finalSettings(objOfScene);
                    App.utils.types.loaded = l;
                } else {
                    this.getIntersectPoints(d);
                }
                this.startEffect(objOfScene);

         //final settings for 2d
                var c = objOfScene.circle2D.position,
                    _2dOb = App.rebuild2D,
                    scale = (1 + _2dOb.dftAngleSq2DObj.scale + _2dOb.dftAngleSq2DObj.delt * (_2dOb.lstCrtdPl - 1));
                _2dSq.position.set(c.x, c.y, 0.1);
                _2dSq.rotation.set(2.52, 2.36, 0);//parallel to XY -0.6,2.36,0
                _2dSq.scale.multiplyScalar(scale);//1.85
            }



        }//start drawing
    };

    objOfScene.helpers.init(App.utils.types.listOfPoints, objectsForConnect, inputNumber, newObh);
    //objOfScene.castShadow = true;
    //objOfScene.receiveShadow = true;
    //objOfScene.tipsObject.castShadow = true;
    //objOfScene.tipsObject.receiveShadow = true;

};//settings for objects

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

App.rebuild2D = {
    dftClrs: {
        point: "rgba(255,255, 255, 1)",
        back: "#0a014c"
    },
    dftAngleSq2DObj: {scale: 0.22, delt: 0.3, r: {x: 2.53, y: 2.36}},
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
        /*  var point =['506','605','650','560','065','056'] ,startPos={};
         ctx.fillStyle = "#E20E00";
         ctx.beginPath();
         for(var i=0;i<point.length;i++){
         for(var j=0;j<_system.length;j++){
         if(point[i] == _system[j].name){
         if(!startPos.y){
         startPos.x =_system[j].pos.x;
         startPos.y =_system[j].pos.y;
         ctx.moveTo( startPos.x,startPos.y);
         }else{
         ctx.lineTo(_system[j].pos.x,_system[j].pos.y);
         }
         break;
         }
         }
         }
         ctx.lineTo(startPos.x,startPos.y);
         ctx.stroke();*/
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

        var appObj = App.utils.types, webglObj = appObj.webgl, _system = webglObj._system, scale_html = 100, objSystmPstn = [],
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
            if(cur.isHuge) {
                var pointes = cur.object2D.point2D.children,
                    tubes = {l: [], m: cur.object2D.tube2D.children[0].material},
                    m = cur.helpers, key = 0;
                //tubes.l.concat(cur.object2D.tube2D.children);
                cur.listOf2dCord = _2dOb.get2DCoordinat(cur.listOfPointes);
                tubes.l = cur.listOf2dCord.concat([]);

                //reset the points
                //console.log(pointes,cur.listOf2dCord[0]);
                for (var pnts = 0; pnts < pointes.length; pnts += 2) {
                    m.draw2DPnts(pointes[pnts + 1], pointes[pnts], cur.listOf2dCord[key++]);
                    //key++;
                }
                if (cur.listOf2dCord.length > 1) {
                    //reste the tubes
                    cur.object2D.remove(cur.object2D.tube2D);
                    var curVis = cur.object2D.tube2D.visible ? true : false, tbChlds = cur.object2D.tube2D.children;
                    var vis = {v1: tbChlds[0].visible, v2: tbChlds[2].visible};
                    cur.object2D.tube2D = new THREE.Object3D();
                    cur.object2D.add(cur.object2D.tube2D);
                    //cur.object2D.tube2D.visible=curVis;

                    m.draw2DConnections(tubes.l, tubes.m, cur.object2D.tube2D, vis);

                    //reset circle
                    cur.object2D.remove(cur.circle2D);
                    m.draw2DCircle(cur, cur.circle2D.material, cur.circle2D.visible);

                    //reset figure
                    cur.object2D.remove(cur.shape2D);
                    m.draw2DShape(cur, [cur.shape2D.material]);

                    //reset corners
                    var c = cur.circle2D.position,
                        l = cur.object2D.corner2DIn,
                        lc = cur.object2D.corner2D,
                        s = cur.object2D.square2D,
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


                    cur.object2D.remove(l);
                    var lastV = l.visible;
                    l = cur.object2D.corner2DIn = new THREE.Object3D();
                    l.visible = lastV;
                    cur.object2D.add(l);
                    l.position.set(c.x, c.y, 0.1);
                    l.rotation.set(calc.r.x, calc.r.y, 0);
                    for (var la = 0; la < corner2DInL.length; la++) {
                        l.add(corner2DInL[la]);
                    }


                    //reset squares
                    cur.object2D.genSquare.position.set(c.x, c.y, 0.1);
                    lastV = s.visible;
                    cur.object2D.remove(s);
                    s = cur.object2D.square2D = new THREE.Object3D();
                    s.visible = lastV;
                    cur.object2D.add(s);
                    s.position.set(c.x, c.y, 0.1);
                    s.rotation.set(calc.r.x, calc.r.y, 0);
                    for (var ls = 0; ls < sq2DInL.length; ls++) {
                        s.add(sq2DInL[ls]);
                    }


                    var scale = (1 + calc.scale + calc.delt * (lineSpace - 1));
                    l.scale.multiplyScalar(scale);
                    s.scale.multiplyScalar(scale);

                }
                webglObj._2dConsist.add(cur.object2D);
            }
        }
    }
}

App.guiObj = {
    numberField: null,//input number
    item: [],//input settings for obj
    listOgAngles: null,//list of angles
    listOfSquares: null,//list of angles
    btn: null,//buttons
    name: null,//names
    maxNumber: 999,
    gui: null,//GUI obj
    animateSpeedOfObj: [],
    digitN: false,
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
        effects: false,
        dimensn: false,
        number: 0,
        coords: '',
        generate: function () {
            var gui = App.guiObj,fldrs=gui.folders;
            for(var folder in fldrs ){
                if(folder != 'menuFolder' && fldrs[folder]){
                    fldrs[folder].close();
                }
            }
            App.remote.getByName(App.numberWorker.generate(App.guiObj.name), function () {
                App.rebuildNodes(App.guiObj.name);
                if (!App.guiObj.isSceneNotEmpty) {
                    App.guiObj.isSceneNotEmpty = true;
                    App.guiObj.addLastFolders();
                }
                App.guiObj.interfaces.addEditInfo(inputNumber);
                //console.log( new Date()-start);
            });
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
        pointCubesVisible: false,
        cubesVisible: false,
        mainCubeColor: 0xffffff,
        littleCubesColor: 0x0c27f7,
        listTexture: [],
        getScreen: function () {
            var strMime = "image/jpeg";
            var imgData = App.utils.types.webgl.renderer.domElement.toDataURL(strMime);
            App.utils.interfaces.saveFile(imgData.replace(strMime, "image/octet-stream"), "point.jpg");
        },
        showListOfAn: false,
        axis: false,
        shadows: false,
        autoRotate: true,
        backDisplay: false
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
        this.gui = window.innerWidth < 800 ? new dat.GUI({width: 299}) : new dat.GUI({width: 255});
        this.gui.open();
        this.folders.menuFolder = this.gui.addFolder('Menu');
        this.folders.menuFolder.add(App.guiObj.generateParameters, 'getScreen').name('ScreenShot');
        this.folders.menuFolder.add(App.guiObj.generateParameters, 'backDisplay').name('Background').onChange(function (val) {
            App.utils.types.webgl._background = val;
            if (val) {
                if (App.utils.types.webgl._dimension)App.utils.types.webgl.renderer.setClearColor(0x000000, 0);
                $('#fond').fadeOut(1);
                $('#play').fadeIn(1);
                $('.container_').css('background', 'none');
            } else {
                App.utils.types.webgl.renderer.setClearColor(0x0a014c, 1);
                $('#fond').fadeIn(1);
                $('#play').fadeOut(1);
                $('.container_').css('background', '#0a014c');

            }
        });
        this.folders.menuFolder.add(App.guiObj.generateParameters, 'axis').name('Show Axis').onChange(function (val) {
            App.utils.types.webgl.axis.visible = val
        });
        /* this.folders.menuFolder.add(App.guiObj.generateParameters, 'shadows').name('Shadows').onChange(function (val) {
         var webglObj = App.utils.types.webgl;
         webglObj.renderer.shadowMapEnabled = val;
         webglObj.light.shadowDarkness = val ? 1 : 0;
         webglObj.light.castShadow = val;
         webglObj.light.intensity = val ? 6 : 0;
         });*/
        App.utils.types.autoR = this.folders.menuFolder.add(App.guiObj.generateParameters, 'autoRotate').name('Auto Rotate').onChange(function (val) {
            App.utils.types.autoRotate = val;
        });
        this.folders.menuFolder.add(App.guiObj.generateParameters, 'showListOfAn').name('Show List of Keys').onChange(function (val) {
            App.guiObj.folders.keysFolder.__ul.hidden = !val;
        });
        this.folders.menuFolder.open();
        this.folders.keysFolder = this.folders.menuFolder.addFolder('List of the Keys');
        this.folders.generationFolder = this.folders.menuFolder.addFolder('Generation');
        this.folders.generalSet = this.folders.menuFolder.addFolder('General Settings');

        this.interfaces.addGenerationFold();
        this.interfaces.generalSetFolders(this.folders.generalSet, App.guiObj.generateParameters);
        //var str = new Date();
        this.interfaces.keysFolderGenerate(this.folders.keysFolder);
        this.folders.keysFolder.__ul.hidden = true;
        //console.log(new Date()-str);

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
                generateParameters = App.guiObj.generateParameters;
            generationFolder.add(generateParameters, 'effects', ['building', 'centeringSphere', 'centeringTriangle', 'shaders']).onChange(function (val) {
                App.utils.types.animaEffect = val;
            });
            /*  generationFolder.add(generateParameters, 'dimensn', ['3D', '2D']).name('Dimensions').onChange(function (val) {
             var webglObj = App.utils.types.webgl;
             if (val == '2D') {
             webglObj.dimensn = true;
             } else {
             webglObj.dimensn = false;
             }
             });*/
            this.addDigitNumber();
            numberField = generationFolder.add(generateParameters, 'number').min(100).max(999).step(1).name('Enter Coordinates:')
                .onChange(function (val) {
                    App.guiObj.interfaces.inputingNumber(val);
                });


        },
        inputingNumber: function (number) {
            var listOfPoints = App.utils.types.listOfPoints;
            var generationFolder = App.guiObj.folders.generationFolder,
                btn = App.guiObj.btn,
                coord = App.guiObj.folders.coord,
                item = App.guiObj.item,
                generateParameters = App.guiObj.generateParameters;
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
                    generateParameters.coords[i] = []
                    generateParameters.coords = listOfPoints[i][0] + ',' + listOfPoints[i][1] + ',' + listOfPoints[i][2];
                    item[i] = coord.add(generateParameters, 'coords').name('Coordinate ' + i);
                }
                    App.guiObj.btn=btn = generationFolder.add(generateParameters, 'generate');
                    btn.name('Create!');
            } else {
                alert('Please, input a three-digit number.')
            }
        },
        clearGenerationFolder: function (generationFolder, item, btn) {
            var listOfPoints = App.utils.types.listOfPoints;
            for (var i = 0; i < listOfPoints.length; i++) {
                if (item[i]) {
                    item[i].domElement.remove();
                    generationFolder.remove(item[i])
                }
            }
            if (listOfPoints && btn){
                generationFolder.remove(btn);
                App.guiObj.btn=false;
            }
        },
        addEditInfo: function (number) {
            var editParameters = {
                visible: true,
                opacity: 0,
                figure: {
                    displayNumbers: true,
                    displayPoints: true,
                    displayLines: true,
                    displayInnerLines: true,
                    displayCircle: true,
                    fillFigure: true,
                    squareShow: false,
                    scale2D: 1.0,
                    bla: -0.6,
                    bla1: 2.36,
                    twoDimensions: App.utils.types.webgl.dimensn,
                    agleShow: false
                },
                colorNumbers: "#9012e8",
                colorTubes: "#ffffff",
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
            lastCheck.addEl(nam, true, lastCheck.square);


            /*folder events*/
            $(curFigure.domElement).bind('click',function(){
            var gui = App.guiObj,fldrs=gui.folders,flag =true;
               for(var folder in fldrs ){
                  if(flag){
                      flag = false;
                  }else{
                      fldrs[folder].close();
                  }

               }
                for(var editFl in fldrs.editFolder.__folders){
                    fldrs.editFolder.__folders[editFl].close();
                }
                fldrs.editFolder.open();
               curFigure.open();
            });

            /*   curFigure.add(editParameters.figure, 'bla',-0.6).min(-10.01).max(10.01).step(0.01).name(' R_x').onChange(function (val) {
             App.utils.types.webgl.listObjOfScene[0].object2D.corner2DIn.rotation.x =val;
             });
             curFigure.add(editParameters.figure, 'bla1',2.36).min(-10.01).max(10.01).step(0.01).name(' R_y').onChange(function (val) {
             App.utils.types.webgl.listObjOfScene[0].object2D.corner2DIn.rotation.y =val;
             });*/

            curFigure.add(editParameters.figure, 'displayPoints').name('Display Points').onChange(function (val) {
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, false, {
                    types: lastCheck.point,
                    category: 'point'
                });
                App.utils.interfaces.pointsArray.toggleVisible(nam, val);
                lastCheck.addEl(nam, val, lastCheck.point);
            });
            curFigure.add(editParameters.figure, 'agleShow').name('Display Angles').onChange(function (val) {
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, false, {
                    types: lastCheck.angle,
                    category: 'angle'
                });
                lastCheck.addEl(nam, val, lastCheck.angle);
            });
            curFigure.add(editParameters.figure, 'squareShow').name('Display Squares').onChange(function (val) {
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, false, {
                    types: lastCheck.square,
                    category: 'square'
                });
                lastCheck.addEl(nam, val, lastCheck.square);
            });
            curFigure.add(editParameters.figure, 'displayLines').name('Display Inner Lines').onChange(function (val) {
                var curObjAct = App.utils.interfaces.tubesArray.toggleVisible(nam, val);
                if (curObjAct && curObjAct.listOfPointes.length > 3) App.utils.interfaces.tipsArray.resetTipsVis(curObjAct, ['square', 'angle'])
            });
            curFigure.add(editParameters.figure, 'displayInnerLines').name('Display Outer Lines').onChange(function (val) {
                App.utils.interfaces.tubesArray.toggleVisible(nam, val, true);
            });
            curFigure.add(editParameters.figure, 'displayCircle').name('Display Sphere').onChange(function (val) {
                App.utils.interfaces.sphere.toggleVisible(nam, val);
            });
            curFigure.add(editParameters.figure, 'fillFigure').name('Display Figure').onChange(function (val) {
                App.utils.interfaces.shape.toggleVisible(nam, val);
            });

            /*curFigure.add(editParameters.figure, 'twoDimensions').name('2d Dimension').onChange(function (val) {
             App.utils.interfaces.changeDimension(nam, val);
             });*/
            curFigure.add(editParameters, 'visible').name('Global Visible').onChange(function (val) {
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, true, {
                    types: lastCheck.point,
                    category: 'point'
                });
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, true, {
                    types: lastCheck.angle,
                    category: 'angle'
                });
                App.utils.interfaces.tipsArray.tooltipVisible(nam, val, true, {
                    types: lastCheck.square,
                    category: 'square'
                });
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
            if (number.toString().length == 3)this.addFigureInfo(nam);
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
            generalSet.add(generateParameters, 'cubesVisible').name('Cubes Visible').onChange(function (val) {
                App.rebuildCubes.setVisibleForChild(val, 'littleCube');
            });
            generalSet.add(generateParameters, 'pointCubesVisible').name('Point Label Visible').onChange(function (val) {
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
        general2DSetFolders: function (generalSet) {
            var par = {
                backColor: "#0a014c",
                listTexture: [],
                scale2D: 1,
                pointDim: App.rebuild2D.lstCrtdPl,
                pointColor: "rgba(255, 255, 255, 1)"
            };
            generalSet.addColor(par, 'backColor').name('Back 2D Color').onChange(function (clr) {
                var webglObj = App.utils.types.webgl;
                webglObj.lastBavkColor = clr;
                webglObj._plate.material.color.setHex(('0x' + clr.substr(1)));
                webglObj.renderer.setClearColor(clr, 1);
            });
            generalSet.addColor(par, 'pointColor').name('Point 2D Color').onChange(function (clr) {
                var appObj = App.utils.types, webglObj = appObj.webgl, _systemSize = appObj._2dPlateSize, scale_html = 100;
                webglObj._2dTexture = App.rebuild2D.getTexture({
                    width: _systemSize.x * scale_html,
                    height: _systemSize.y * scale_html
                }, {back: webglObj.lastBavkColor, point: clr});
                var texture = new THREE.Texture(webglObj._2dTexture);
                texture.needsUpdate = true;
                texture.minFilter = THREE.LinearFilter;
                var mat = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
                webglObj._plate.material = mat;

            });
            generalSet.add(par, 'listTexture', ['NONE', 'mountain', 'siege', 'starfield', 'misty', 'tidepool']).name('Background').onChange(function (val) {
                App.rebuildSkyBox.changeBackground(val);
            });
            generalSet.add(par, 'pointDim').min(1).max(5).step(1).name('Points distance').onChange(function (val) {
                if (val != App.rebuild2D.lstCrtdPl) {
                    App.rebuild2D.lstCrtdPl = val;
                    App.rebuild2D.buildPlate(val);
                    App.rebuild2D.rebuildFigures(val);
                }
            });
            //generalSet.add(par, 'scale2D').min(0).max(2).step(0.01).name('Scale 2D').onChange(function (val) {
            //    App.utils.types.webgl._2dConsist.scale.multiplyScalar(val);
            //});
            $(".hue-field").width(10);
        },
        addDigitNumber: function () {
            var generationFolder = App.guiObj.folders.generationFolder,
                numberField = App.guiObj.numberField,
                maxNumber = App.guiObj.maxNumber,
                generateParameters = App.guiObj.generateParameters;
            App.guiObj.digitN = generationFolder.add(generateParameters, 'moreThan3').name('> 3-digit number').onChange(function (flag) {
                generationFolder.__controllers.slice(generationFolder.__controllers.indexOf(numberField), 1);
                $('.cr.number.has-slider').eq(0).remove();
                generateParameters.number = 0;
                flag ? maxNumber = 99999 : maxNumber = 999;
                App.guiObj.maxNumber = maxNumber;
                numberField = generationFolder.add(generateParameters, 'number').min(100).max(maxNumber).step(1).name('Enter Coordinates:')
                    .onChange(function (val) {
                        App.guiObj.interfaces.inputingNumber(val);
                    });
            });

        },
        clearFolder: function (folder) {
            for (var i = 0; i < folder.length; i++) {

            }
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
            }, curVal, angles, isListOfKeysLoaded = false//App.remote.listOfKeys?true:false;
            var listOfGenerateObj = isListOfKeysLoaded ? App.remote.listOfKeys : App.guiObj.keys.getListOfFigures(100, 999),
                sebdDt = [];
            for (var i = 0; i < listOfGenerateObj.length; i++) {
                var key = listOfGenerateObj[i].key;
                curKeyF.size = listOfGenerateObj[i].size;
                if (isListOfKeysLoaded) {
                    angles = listOfGenerateObj[i].angleses;
                    curKeyF.square = listOfGenerateObj[i].square;
                    curKeyF.sum = listOfGenerateObj[i].sum;
                } else {
                    curVal = Math.figureDataByPoints(listOfGenerateObj[i].val);
                    angles = curVal.angle;
                    curKeyF.square = curVal.square.toString();
                    curKeyF.sum = curVal.sum.toString();
                    sebdDt.push(
                        {
                            square: curKeyF.square,
                            sum: curKeyF.sum,
                            size: curKeyF.size,
                            angleses: {val: angles[0], length: angles.length},
                            key: listOfGenerateObj[i].key
                        }
                    );
                }
                var keyFld = keysFolder.addFolder('Figure ' + key);
                var angl = keyFld.addFolder('Corner\'s');
                for (var j = 0; j < angles.length; j++) {
                    if (isListOfKeysLoaded) {
                        curKeyF.angles.angle = angles['val'] + '\xB0';
                    } else {
                        curKeyF.angles.angle = angles[j] + '\xB0';
                    }
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
                    var lis = listOfGenerateObj[figure].val;
                    if (isListOfKeysLoaded) {
                        lis = App.numberWorker.generate(key);
                    }
                    App.utils.types.listOfPoints = lis;
                    App.guiObj.name = inputNumber = key;
                    App.rebuildNodes(key);
                    App.guiObj.interfaces.addEditInfo(key);
                });
            }
            if (!isListOfKeysLoaded) {
                //App.remote.add(sebdDt, 'listOfKeys');
            }
        },
        addFigureInfo: function (name) {
            var anglesFolder = App.guiObj.folders.anglesFolder.addFolder(name), figureSet = null, figData = {
                    square: null,
                    gs: 0,
                    subGs: 0,
                    angle: null,
                    triangleSquare: null
                },
                types = App.utils.types, listOfPoints = types.listOfPoints, lastObjAd = types.webgl.listObjOfScene[types.webgl.listObjOfScene.length - 1],
                isNeedR = (lastObjAd.listOfPointes.length > 3), isloaded = types.loaded ? true : false;
            if (listOfPoints) {
                figureSet = isloaded ? types.loaded : Math.figureDataByPoints(listOfPoints, lastObjAd.listOf2dCord);
                figData.square = figureSet.square.toString();

                /*add and create main square */
                var sq = figData.square.toString();
                var sprite = App.utils.interfaces.createSprite(sq.substr(0, sq.indexOf(".") + 2) + 'mm\xB2', {
                    fontsize: 14,
                    borderThickness: 1,
                    canvasWidth: 2,
                    canvasHeight: 45,
                    shift: {x: 8.5, y: 11},
                    backColor: "rgba(0, 200, 0, 1)"
                });
                var objC = lastObjAd.circle2D.position;
                sprite.position.set(objC.x, objC.y, objC.z + 0.1);
                sprite.category = 'square';
                sprite.visible = false;
                lastObjAd.object2D.add(sprite);
                lastObjAd.object2D.genSquare = sprite;
                if (isNeedR) {
                    var mainSquare = sprite.clone();
                    mainSquare.position.set(lastObjAd.sphere.position.x, lastObjAd.sphere.position.y, lastObjAd.sphere.position.z);
                    lastObjAd.genSquare = mainSquare;
                    lastObjAd.tipsObject.add(mainSquare);
                }


                /* add some  calculate**/
                figData.gs = figureSet.someGS.genGS;
                anglesFolder.add(figData, 'gs').name('General Summ').__input.disabled = true;

                anglesFolder.add(figData, 'square').name('General Square').__input.disabled = true;
                var triangleSq = anglesFolder.addFolder('Square SubFigures');
                var angles = anglesFolder.addFolder('Angles');
                var mainAngles = angles.addFolder('Main Angles');
                var gs = anglesFolder.addFolder('Sub General Summ');

                for (var i = 0; i < App.guiObj.listOfSquares.length; i++) {
                    figData.triangleSquare = App.guiObj.listOfSquares[i];
                    triangleSq.add(figData, 'triangleSquare').name('Sub Figure ' + i).__input.disabled = true;
                }

                //add and create main angles
                for (var i = 0; i < figureSet.angle.length; i++) {
                    figData.angle = isloaded ? figureSet.angle[i].text_f : figureSet.angle[i] + '\xB0';
                    mainAngles.add(figData, 'angle').name('Angle ' + i).__input.disabled = true;
                    if (!isloaded) {
                        figureSet.anglePos[i].z += 0.1;
                        lastObjAd.helpers.createSpriteForObj({
                            text_f: figData.angle + '',
                            text_s: figureSet.angle[i] + '.0000000\xB0',
                            position: {_2d: figureSet.anglePos[i], _3d: figureSet.angle3DPos[i]},
                            category: 'angle',
                            backColor: "rgba(255, 255, 0, 1)",
                            canvasHeight: 39,
                            fontsize: 12,
                            shift: {x: 8.5, y: 11},
                            id2D: true
                        });
                    }
                }

                /*settings for angle 2d positions*/
                var c = lastObjAd.circle2D.position,
                    l = lastObjAd.object2D.corner2DIn,
                    lc = lastObjAd.object2D.corner2D,
                    _2dOb = App.rebuild2D, calc = _2dOb.dftAngleSq2DObj,
                    scale = (1 + _2dOb.dftAngleSq2DObj.scale + _2dOb.dftAngleSq2DObj.delt * (_2dOb.lstCrtdPl - 1));
                l.position.set(c.x, c.y, 0.1);
                l.rotation.set(calc.r.x, calc.r.y, 0);//parallel to XY -0.6,2.36,0
                l.scale.multiplyScalar(scale);

                lc.position.set(c.x, c.y, 0.1);
                var objPos = lc.position;
                for (var i = 0; i < lc.children.length; i++) {
                    var curMeshPoj = lc.children[i], pos = curMeshPoj.position;
                    curMeshPoj.position.set(pos.x - objPos.x, pos.y - objPos.y, pos.z - objPos.z);
                }


                //save to file
                if (!isloaded && lastObjAd.listOfPointes.length > 3) {
                    lastObjAd.sendData.squareTooltips.push({square: sq});
                    lastObjAd.sendData.someGS = figureSet.someGS;
                    App.remote.add(lastObjAd.sendData, 'objOfScene');
                }

                //add angles
                for (var i = 0; i < App.guiObj.listOgAngles.length; i++) {
                    figData.angle = App.guiObj.listOgAngles[i];
                    angles.add(figData, 'angle').name('Angle ' + i).__input.disabled = true;
                }

                //add subGS
                for (var i = 0; i < figureSet.someGS.listOfGS.length; i++) {
                    var cur = figureSet.someGS.listOfGS[i];
                    figData.subGs = cur.sum;
                    gs.add(figData, 'subGs').name('SL ' + cur.name).__input.disabled = true;
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
        },
        changeStructure: function (dimension) {
            var nameF = 'General Settings',
                gui =App.guiObj,
                fold = gui.folders,
                genFold =fold.menuFolder;
            if (genFold) {
                genFold.__folders[nameF].__ul.remove();
                delete  genFold.__folders[nameF];
            }
            fold.generalSet = fold.menuFolder.addFolder(nameF);
            if (dimension) {
                gui.interfaces.generalSetFolders(fold.generalSet, gui.generateParameters);
                fold.generationFolder.remove(gui.digitN);
                this.addDigitNumber();
            } else {
            if(gui.maxNumber.toString().length>3){
                gui.digitN.__checkbox.click();
            }
                gui.interfaces.general2DSetFolders(fold.generalSet);
                fold.generationFolder.remove(gui.digitN);
            }

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
        var webglObj = App.utils.types.webgl,
            listObj = webglObj.listObjOfScene,
            lastObj = listObj[listObj.length - 1];
        webglObj.controls.reset();
        //App.utils.interfaces.setView(val.currentTarget.value);
        if (val.currentTarget.value == '3D') {
            var back = {op: 1, clr: 0x0a014c};
            //if (webglObj._background)back = {op: 0, clr: 0x000000};
            webglObj.renderer.setClearColor(back.clr, back.op);
            webglObj._dimension = '3D';
            webglObj.camera.position.set(20, 20, 20);
            webglObj.controls.rotateSpeed = 10.0;
            webglObj.controls.panSpeed = 0.8;
            webglObj.controls.minDistance = 0;
            webglObj.controls.maxDistance = 300;
            webglObj.cameraFixed = false;
            if (listObj.length > 0) {
                //lastObj.visible = true;
                var lstObj = lastObj.sphere.position;
                webglObj.camera.lookAt(lstObj);
                webglObj.controls.target.set(lstObj.x, lstObj.y, lstObj.z);
            } else {
                webglObj.camera.lookAt(webglObj._dftControl);
                webglObj.controls.target.set(webglObj._dftControl.x, webglObj._dftControl.y, webglObj._dftControl.z);
            }
            webglObj._2dConsist.visible = false;
        } else {

            webglObj.renderer.setClearColor(webglObj.lastBavkColor, 1);
            var cur2d = webglObj._2dConsist.position;
            webglObj._dimension = false;
            webglObj.camera.position.set(webglObj._dftControl.x, webglObj._dftControl.y, -15);
            webglObj.camera.lookAt(cur2d);
            webglObj.controls.target.set(cur2d.x, cur2d.y, cur2d.z);
            webglObj.controls.rotateSpeed = 0.0;
            webglObj.controls.panSpeed = 0.0;
            webglObj.controls.minDistance = 5//App.rebuild2D.lstCrtdPl < 4 ? 5 : 10;
            webglObj.controls.maxDistance = 40//App.rebuild2D.lstCrtdPl < 4 ? 40 : 50;
            webglObj.cameraFixed = true;
            webglObj._2dConsist.visible = true;
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
        App.guiObj.interfaces.changeStructure(val.currentTarget.value == '3D');
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
