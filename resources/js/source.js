"use strict";

window.onload = function() {

    let settings = getDefaultGridSettings();
    updateSettingsModal(settings);

    let canvas = document.getElementById("canvas");
    let app = new PIXI.Application({ width: settings.screenW, height: settings.screenH, transparent: true, preserveDrawingBuffer:true, view: canvas });

    const viewport = initializeViewport(app, settings);

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").submit(function(){
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#noiseSettingsModal").submit(function(){
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#redraw").click(function(){
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    window.onresize = function() {
        let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
        let height = window.innerHeight - 100;
        app.renderer.resize(width, height);
    };
};

function loadGrid(app, viewport, settings) {
    let Hex = Honeycomb.extendHex({ size: settings.hexSize,  orientation: settings.hexOrientation });
    let Grid = Honeycomb.defineGrid(Hex);
    let elevation = heightMap(settings);
    let gridColor = 0x000000;

    // render hex grid
    let gr = Grid.rectangle({ width: settings.hexColums, height: settings.hexRows });
    gr.forEach((hex, index) => {
        let graphics = new PIXI.Graphics();
        let coords = hex.cartesian();
        if (elevation[coords.x][coords.y] < -1.0) {
            if (settings.hideGrid) gridColor = 0xB0E0E6;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0xB0E0E6);
        }
        else if (elevation[coords.x][coords.y] < -0.2) {
            if (settings.hideGrid) gridColor = 0x8FBC8F;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x8FBC8F);
        }
        else if (elevation[coords.x][coords.y] < 0.2) {
            if (settings.hideGrid) gridColor = 0x2E8B57;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x2E8B57);
        }
        else if (elevation[coords.x][coords.y] < 0.4) {
            if (settings.hideGrid) gridColor = 0x895543;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x895543);
        }
        else if (elevation[coords.x][coords.y] < 0.6) {
            if (settings.hideGrid) gridColor = 0x8A4533;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x8A4533);
        }
        else if (elevation[coords.x][coords.y] < 0.75) {
            if (settings.hideGrid) gridColor = 0x8B3503;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x8B3503);
        }
        else if (elevation[coords.x][coords.y] < 0.90) {
            if (settings.hideGrid) gridColor = 0x8B4513;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0x8B4513);
        }
        else {
            if (settings.hideGrid) gridColor = 0xDCDCDC;
            graphics.lineStyle(settings.lineThickness, gridColor);
            graphics.beginFill(0xDCDCDC);
        }

        const point = hex.toPoint();
        // add the hex's position to each of its corner points
        const corners = hex.corners().map(corner => corner.add(point));
        // separate the first from the other corners
        const [firstCorner, ...otherCorners] = corners;

        // move the "pen" to the first corner
        graphics.moveTo(firstCorner.x, firstCorner.y);
        // draw lines to the other corners
        otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
        // finish at the first corner
        graphics.lineTo(firstCorner.x, firstCorner.y);

        graphics.endFill();

        viewport.addChild(graphics);
    });

    if (settings.hideCoords === true) return;

    gr.forEach(hex => {
        const point = hex.toPoint();
        const centerPosition = hex.center().add(point);
        const coordinates = hex.coordinates();

        let fontSize = 12;
        if (settings.hexSize < 15) fontSize = settings.hexSize / 1.5;

        let text = new PIXI.Text(coordinates.x + ','+ coordinates.y,{fontFamily : 'Arial', fontSize: fontSize, fill : 0x000000, align : 'center'});

        text.x = centerPosition.x;
        text.y = centerPosition.y;
        text.anchor.set(0.5);

        viewport.addChild(text);
    });
}

function applySettings(app, viewport) {

    let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
    let height = window.innerHeight - 100;

    let settings = {};
    settings.screenW = width;
    settings.screenH = height - 100;
    settings.hexSize = parseInt($('#hexSize').val()) || 36;
    settings.hexOrientation = $('#hexOrientation').val() || 'flat';
    settings.hexColums = parseInt($('#hexColums').val()) || (width - 100) / 54;
    settings.hexRows = parseInt($('#hexRows').val()) || (height - 100) / 72;
    settings.lineThickness = parseInt($('#lineThickness').val()) || 2;
    settings.lineColor = 0x999999;
    settings.hideCoords = $('#hideCoords').is(":checked");
    settings.hideGrid = $('#hideGrid').is(":checked");

    viewport = initializeViewport(app, settings);

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").modal("hide");
    $("#noiseSettingsModal").modal("hide");
}

function downloadCanvasAsPng() {
    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng('hexGrid.png');
}

function heightMap(settings) {
    let seed = generateId();
    if ($('#setSeed').is(":checked")) seed = $('#seed').val();
    else $('#seed').val(seed);
    const simplex = new SimplexNoise(seed);
    let elevation = [[]];
    let freq = 0.8;
    for (let x = 0; x < settings.hexColums; x++) {
        elevation[x] = [];
        for (let y = 0; y < settings.hexRows; y++) {
            let nx = x / settings.hexColums;
            let ny = y / settings.hexRows;

            //elevation[x][y] = simplex.noise2D(freq * nx, freq * ny);
            elevation[x][y] = simplex.noise2D(freq*nx, freq*ny) + 0.5 * simplex.noise2D(4*freq*nx, 4*freq*ny)+0.25 * simplex.noise2D(8*freq*nx, 8*freq*ny) + 0.125 * simplex.noise2D(16*freq*nx, 16*freq*ny);
        }
    }

    return elevation;
}

function getDefaultGridSettings() {

    let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
    let height = window.innerHeight - 100;
    let colums = ( Math.ceil( width / 15 ) > 75) ? 75 : Math.ceil( width / 15 );
    let rows = ( Math.ceil( height / ( 10 * 1.731 ) ) > 30) ? 30 : Math.ceil( height / ( 10 * 1.731 ) );

    return {
        screenW: width,
        screenH: height,
        hexSize: 10,
        hexOrientation: 'flat',
        hexColums: colums, // x
        hexRows:  rows, // y
        lineThickness: 1,
        lineColor: 0x999999,
        hideCoords: true,
        hideGrid: false
    }
}

function updateSettingsModal(settings) {
    $('#hexSize').val(settings.hexSize);
    $('#hexOrientation').val(settings.hexOrientation);
    $('#hexColums').val(settings.hexColums);
    $('#hexRows').val(settings.hexRows);
    $('#lineThickness').val(settings.lineThickness);
    $('#hideCoords').prop('checked', settings.hideCoords);
    $('#hideGrid').prop('checked', settings.hideGrid);
}

function initializeViewport(app, settings) {

    let worldWidth = settings.hexColums * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    let worldHeight = settings.hexRows * (settings.hexSize * 1.731) + (settings.hexSize * 1.731 / 2);
    if (settings.hexOrientation === 'pointy') {
        worldWidth = settings.hexColums * (settings.hexSize * 1.731) + (settings.hexSize * 1.731 / 2);
        worldHeight = settings.hexRows * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    }

    const viewport = new Viewport.Viewport({
        screenWidth: app.view.offsetWidth,
        screenHeight: app.view.offsetHeight,
        worldWidth: worldWidth,
        worldHeight: worldHeight,

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    app.stage.addChild(viewport);

    viewport
        .drag()
        .wheel()
        .bounce();

    return viewport;
}

function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId (len) {
    let arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('')
}