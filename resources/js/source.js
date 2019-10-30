"use strict";

window.onload = function() {

    //Default Grid Settings
    let settings = {
        screenW: window.innerWidth - 100,
        screenH: window.innerHeight - 100,
        hexSize: 36,
        hexOrientation: 'flat',
        hexColums: Math.ceil((window.innerWidth - 100) / 54), // x
        hexRows:  Math.ceil((window.innerHeight - 100) / (36*1.731)), // y
        lineThickness: 2,
        lineColor: 0x999999,
        hideCoords: false
    };

    $('#hexSize').val(settings.hexSize);
    $('#hexOrientation').val(settings.hexOrientation);
    $('#hexColums').val(settings.hexColums);
    $('#hexRows').val(settings.hexRows);
    $('#lineThickness').val(settings.lineThickness);

    let canvas = document.getElementById("canvas");
    let app = new PIXI.Application({ width: settings.screenW, height: settings.screenH, transparent: true, preserveDrawingBuffer:true, view: canvas });

    // create viewport
    const viewport = new Viewport.Viewport({
        screenWidth: app.view.offsetWidth,
        screenHeight: app.view.offsetHeight,
        worldWidth: settings.hexColums * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2),
        worldHeight: settings.hexRows * (settings.hexSize * 1.731) + (settings.hexSize * 1.731 / 2),

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    app.stage.addChild(viewport);

    // activate plugins
    viewport
        .drag()
        .bounce();

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").submit(function(){
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
};

function loadGrid(app, viewport, settings) {
    let graphics = new PIXI.Graphics();
    let Hex = Honeycomb.extendHex({ size: settings.hexSize,  orientation: settings.hexOrientation });
    //let Hex = Honeycomb.extendHex({ size: {width: 72, height: 72},  orientation: settings.hexOrientation });
    let Grid = Honeycomb.defineGrid(Hex);
    let elevation = heightMap(settings);

    // set a line style of 1px wide and color #999
    //graphics.lineStyle(settings.lineThickness, settings.lineColor);

    // render hex grid
    let gr = Grid.rectangle({ width: settings.hexColums, height: settings.hexRows });
    gr.forEach((hex, index) => {

        let coords = hex.cartesian();
        if (elevation[coords.x][coords.y] < -1.0) {
            graphics.lineStyle(settings.lineThickness, 0xB0E0E6);
            graphics.beginFill(0xB0E0E6);
        }
        else if (elevation[coords.x][coords.y] < -0.2) {
            graphics.lineStyle(settings.lineThickness, 0x8FBC8F);
            graphics.beginFill(0x8FBC8F);
        }
        else if (elevation[coords.x][coords.y] < 0.2) {
            graphics.lineStyle(settings.lineThickness, 0x2E8B57);
            graphics.beginFill(0x2E8B57);
        }
        else if (elevation[coords.x][coords.y] < 0.4) {
            graphics.lineStyle(settings.lineThickness, 0x895543);
            graphics.beginFill(0x895543);
        }
        else if (elevation[coords.x][coords.y] < 0.6) {
            graphics.lineStyle(settings.lineThickness, 0x8A4533);
            graphics.beginFill(0x8A4533);
        }
        else if (elevation[coords.x][coords.y] < 0.75) {
            graphics.lineStyle(settings.lineThickness, 0x8B3503);
            graphics.beginFill(0x8B3503);
        }
        else if (elevation[coords.x][coords.y] < 0.90) {
            graphics.lineStyle(settings.lineThickness, 0x8B4513);
            graphics.beginFill(0x8B4513);
        }
        else {
            graphics.lineStyle(settings.lineThickness, 0xDCDCDC);
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

        if (index % 2 === 0) {
          graphics.endFill();
        }

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
    let settings = {};
    settings.screenW = window.innerWidth - 100;
    settings.screenH = window.innerHeight - 100;
    settings.hexSize = parseInt($('#hexSize').val()) || 36;
    settings.hexOrientation = $('#hexOrientation').val() || 'flat';
    settings.hexColums = parseInt($('#hexColums').val()) || (window.innerWidth - 100) / 54;
    settings.hexRows = parseInt($('#hexRows').val()) || (window.innerHeight - 100) / 72;
    settings.lineThickness = parseInt($('#lineThickness').val()) || 2;
    settings.lineColor = 0x999999;
    settings.hideCoords = $('#hideCoords').is(":checked");

    let worldWidth = settings.hexColums * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    let worldHeight = settings.hexRows * (settings.hexSize * 1.731) + (settings.hexSize * 1.731 / 2);
    if (settings.hexOrientation === 'pointy') {
        worldWidth = settings.hexColums * (settings.hexSize * 1.731) + (settings.hexSize * 1.731 / 2);
        worldHeight = settings.hexRows * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    }

    // create viewport
    viewport = new Viewport.Viewport({
        screenWidth: app.view.offsetWidth,
        screenHeight: app.view.offsetHeight,
        worldWidth: worldWidth,
        worldHeight: worldHeight,

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    app.stage.addChild(viewport);

    // activate plugins
    viewport
        .drag()
        .bounce();

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").modal("hide");
}

function downloadCanvasAsPng() {
    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng('hexGrid.png');
}

function heightMap(settings) {
    const simplex = new SimplexNoise();
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