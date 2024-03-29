# HTML5 Procedural Hexagon Terrain Generator

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/JoseManuelPerezSevilla/ProceduralHexTerrainGenerator/blob/master/LICENSE)

A basic and customizable procedural hexagon terrain generator made in Javascript.

### Demo

You can see the generator working at the [Demo Page](https://hextoryworld.github.io/ProceduralHexTerrainGenerator/).

Also, you can play with a more visual appealing [Tiled version](https://hextoryworld.github.io/TiledProceduralHexTerrainGenerator/) of this terrain generator.

![HTML5 Procedural Hexagon Terrain Generator](https://hextoryworld.github.io/ProceduralHexTerrainGenerator/resources/img/HexGrid.png)

### HexGrid Settings

-  Edge size
-  Orientation (flat, pointy)
-  Number of hexes (columns,rows)
-  Show / hide coordinates
-  Show / hide grid border
-  Line Thickness
-  Contour Interval
    -  Terrain Archetype
       -  Deep Water
       -  Shallow Water
       -  Flat
       -  Hill
       -  Mountain
       -  Mountain Impassable

### Elevation Noise
-  Seed
-  Frequency
-  Redistribution
-  Octaves
-  Islands

### Moisture Noise
-  Seed
-  Frequency
-  Redistribution
-  Octaves
-  No draw moisture

### Biomes
-  Water
-  Flat
    -  Desert
    -  Grassland
    -  Forest
-  Hill
    -  Desert
    -  Grassland
    -  Mixed Forest
    -  Needleleaf Forest
-  Mountain
    -  Desert
    -  Shrubland
    -  Alpine Forest
-  Mountain Impassable
    - Snow

### Map Seed
Copy to save the map setings and restore.

### Viewport

-  Drag
-  Wheel Zoom
-  Bounce
-  Hex Info on click: Coordinates, elevation, moisture, terrain and biome.

### Export as PNG
Actually you can export the terrain generated to png.

### Libraries

-  [Honeycomb](https://github.com/flauwekeul/honeycomb) v3.1.0
-  [PixiJS](http://www.pixijs.com/) v5.1.5
    -  [pixi-viewport](https://github.com/davidfig/pixi-viewport) v4.3.3
-  [reimg](https://github.com/gillyb/reimg)
-  [Bootstrap](https://getbootstrap.com/) v4.3.1
   -  [jQuery](https://jquery.com/) v3.3.1
   -  [Popper.js](https://popper.js.org/) v1.14.7
-  [simplex-noise.js](https://github.com/jwagner/simplex-noise.js) v2.4.0

### Reference

- [Tutorial de generación de mapas aleatorios con Python y OpenSimplex](https://robologs.net/2018/04/09/tutorial-de-generacion-de-mapas-aleatorios-con-python-y-opensimplex/)
- [Making maps with noise functions](https://www.redblobgames.com/maps/terrain-from-noise/)
- [Here Dragon Abound](https://heredragonsabound.blogspot.com/)
- [mewo2.com Generating fantasy maps](http://mewo2.com/notes/terrain/)
