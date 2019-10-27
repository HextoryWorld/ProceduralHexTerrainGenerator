"use strict";

window.onload = function() {

    //adapt sizes to the screen size
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

    loadGrid(app, settings);

    $("#gridSettingsModal").submit(function(){
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });
};

function loadGrid(app, settings) {
    let graphics = new PIXI.Graphics();
    let Hex = Honeycomb.extendHex({ size: settings.hexSize,  orientation: settings.hexOrientation });
    //let Hex = Honeycomb.extendHex({ size: {width: 72, height: 72},  orientation: settings.hexOrientation });
    let Grid = Honeycomb.defineGrid(Hex);

    // set a line style of 1px wide and color #999
    graphics.lineStyle(settings.lineThickness, settings.lineColor);

    // render hex grid
    let gr = Grid.rectangle({ width: settings.hexColums, height: settings.hexRows });
    gr.forEach(hex => {
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

        app.stage.addChild(graphics);

        const centerPosition = hex.center().add(point);
        const coordinates = hex.coordinates();

        if (settings.hideCoords === false) {
            let fontSize = 12;
            if (settings.hexSize < 15) fontSize = settings.hexSize / 1.5;
            let text = new PIXI.Text(coordinates.x + ','+ coordinates.y,{fontFamily : 'Arial', fontSize: fontSize, fill : 0x6699CC, align : 'center'});
            text.x = centerPosition.x;
            text.y = centerPosition.y;
            text.anchor.set(0.5);

            app.stage.addChild(text);
        }
    });
}

function applySettings(app) {
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

    loadGrid(app, settings);
    $("#gridSettingsModal").modal("hide");
}

function downloadCanvasAsPng() {
    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng('hexGrid.png');
}