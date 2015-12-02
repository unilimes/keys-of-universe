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
            var gui = App.guiObj, fldrs = gui.folders;
            for (var folder in fldrs) {
                if (folder != 'menuFolder' && fldrs[folder]) {
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
        genLstOfKs: function () {

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
        listEffects: [],
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

        this.folders.menuFolder.add(this.generateParameters, 'showListOfAn').name('Show List of Keys').onChange(function (val) {
            var g = App.guiObj;
            if (!g.isListOfKeysAreGenereted) {
                g.isListOfKeysAreGenereted = true;
                g.interfaces.keysFolderGenerate(g.folders.keysFolder);
            }
            g.folders.keysFolder.__ul.hidden = !val;
        });
        this.folders.menuFolder.open();
        this.folders.keysFolder = this.folders.menuFolder.addFolder('List of the Keys');
        this.folders.generationFolder = this.folders.menuFolder.addFolder('Generation');
        this.folders.generalSet = this.folders.menuFolder.addFolder('General Settings');

        this.interfaces.addGenerationFold();
        this.interfaces.generalSetFolders(this.folders.generalSet, App.guiObj.generateParameters);
        //var str = new Date();
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
            generationFolder.add(generateParameters, 'listEffects', ['fill', 'scaling', 'flashing']).name('Click Effects').onChange(function (val) {//'hBlur', 'edgeShader', 'focusShader','firework','fireBall'
                App.utils.types.currentCluckEffect = val;
                App.utils.interfaces.resetTooltipInfo();
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
                App.guiObj.btn = btn = generationFolder.add(generateParameters, 'generate');
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
            if (listOfPoints && btn) {
                generationFolder.remove(btn);
                App.guiObj.btn = false;
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
                    cIVis: false,
                    gsVis: false,
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
            var webglObj = App.utils.types.webgl, listObjOfScene = webglObj.listObjOfScene,
                objs = listObjOfScene[listObjOfScene.length - 1],
                nam = objs.name;
            var curFigure = App.guiObj.folders.editFolder.addFolder(nam);
            curFigure.id = nam;
            objs.curFigure = curFigure;
            lastCheck.addEl(nam, true, lastCheck.point);
            lastCheck.addEl(nam, true, lastCheck.angle);
            lastCheck.addEl(nam, true, lastCheck.square);


            /*folder events*/
            $(curFigure.domElement).bind('click', function () {
                var gui = App.guiObj, fldrs = gui.folders, flag = true;
                for (var folder in fldrs) {
                    if (flag) {
                        flag = false;
                    } else if (fldrs[folder]) {
                        fldrs[folder].close();
                    }

                }
                for (var editFl in fldrs.editFolder.__folders) {
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

            if (!webglObj._dimension) {
                this.add2dInfo(curFigure, editParameters, objs);
            }
            this.addRevolModeData(nam);
            if (number.toString().length == 3)this.addFigureInfo(nam);
            $(".hue-field").width(10); // костыль, чтоб не съезжала палитра addColor
        },
        add2dInfo: function (curFigure, editParameters, obj) {
            obj.listOfDtG = [];
            var c1 = curFigure.add(editParameters.figure, 'gsVis').name('Display GS').onChange(function (val) {
                App.utils.interfaces.gs.toggleVisible(obj, val);
            });
            var c2 = curFigure.add(editParameters.figure, 'cIVis').name('Display Circle Info').onChange(function (val) {
                App.utils.interfaces.sphere.infoVis(obj, val);
            });
            obj.listOfDtG.push(c1);
            obj.listOfDtG.push(c2);
        },
        clear2dInfo: function (arr) {
            var editFolder = App.guiObj.folders.editFolder;
            editFolder.remove(arr[0]);
            editFolder.remove(arr[1]);
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
                App.utils.interfaces.resetTooltipInfo();
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
            var anglesFolder = App.guiObj.folders.anglesFolder.addFolder(name),
                figureSet = null, figData = {
                    square: null,
                    gs: 0,
                    subGs: 0,
                    angle: null,
                    triangleSquare: null
                },
                types = App.utils.types, listOfPoints = types.listOfPoints,
                lastObjAd = types.webgl.listObjOfScene[types.webgl.listObjOfScene.length - 1],
                isNeedR = (lastObjAd.listOfPointes.length > 3), isloaded = types.loaded ? true : false,
                _2dObj = lastObjAd.object2D;
            if (listOfPoints && listOfPoints.length > 2) {
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
                _2dObj.add(sprite);
                _2dObj.genSquare = sprite;
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
                    l = _2dObj.corner2DIn,
                    lc = _2dObj.corner2D,
                    _2dOb = App.rebuild2D, calc = _2dOb.dftAngleSq2DObj,
                    scale = (1 + _2dOb.dftAngleSq2DObj.scale + _2dOb.dftAngleSq2DObj.delt * (_2dOb.lstCrtdPl - 1));
                l.position.set(c.x, c.y, 0.1);
                l.rotation.set(calc.r.x, calc.r.y, 0);//parallel to XY -0.6,2.36,0
                l.scale.multiplyScalar(scale + 0.1);

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

                //add and draw subGS
                var listOfP = [];
                for (var i = 0; i < figureSet.someGS.listOfGS.length; i++) {
                    var cur = figureSet.someGS.listOfGS[i];
                    figData.subGs = cur.sum;
                    gs.add(figData, 'subGs').name('SL ' + cur.name).__input.disabled = true;
                }
                lastObjAd.helpers.draw2DSL(figureSet.someGS.listOfGS, false, lastObjAd.object2D.genSumm);
                lastObjAd.helpers.draw2DSL(false, {val: figureSet.someGS.genGS, pst: c}, lastObjAd.object2D.genSumm);
                lastObjAd.gS = {genGS: figureSet.someGS.genGS, listOfGS: figureSet.someGS.listOfGS};
                var _gs = _2dObj.genSumm,
                    _gsChilds = _gs.children,
                    _gsPstn = _gs.position;
                _gs.position.set(c.x, c.y, 0.1);
                for (var ks = 0; ks < _gsChilds.length; ks++) {
                    var curObjP = _gsChilds[ks].position;
                    _gsChilds[ks].position.set(curObjP.x - _gsPstn.x, curObjP.y - _gsPstn.y, curObjP.z - _gsPstn.z);
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
                gui = App.guiObj,
                fold = gui.folders,
                genFold = fold.menuFolder,
                obs = App.utils.types.webgl.listObjOfScene;
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
                if (gui.maxNumber.toString().length > 3) {
                    gui.digitN.__checkbox.click();
                }
                gui.interfaces.general2DSetFolders(fold.generalSet);
                fold.generationFolder.remove(gui.digitN);
            }

            for (var i = 0; i < obs.length; i++) {
                if (dimension) {
                    gui.interfaces.clear2dInfo(obs[i].listOfDtG);
                } else {
                    var lst = obs[i].last2dInf;
                    gui.interfaces.add2dInfo(obs[i].curFigure, {figure: {gsVis: lst.gsVis, cIVis: lst.cIVis}}, obs[i]);
                }
            }

        }

    }//settings for objects

};//settings for gui controll