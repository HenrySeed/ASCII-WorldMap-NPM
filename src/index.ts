/**
 *     _   ___  ___ ___ ___  __      __       _    _   __  __
 *    /_\ / __|/ __|_ _|_ _| \ \    / /__ _ _| |__| | |  \/  |__ _ _ __
 *   / _ \\__ \ (__ | | | |   \ \/\/ / _ \ '_| / _` | | |\/| / _` | '_ \
 *  /_/ \_\___/\___|___|___|   \_/\_/\___/_| |_\__,_| |_|  |_\__,_| .__/
 *                                                               |_|
 *  Author: Henry Seed (henry.nz)
 *  Date: 8th October 2020
 *  Github: https://github.com/HenrySeed/ASCII-WorldMap-Node
 *
 *  A simple single-function modukle to draw a Mercator Projection ASCII world map.
 *  You can add markers with custom Icons.
 *  It includes a style config for altering the maps border, margin and padding CSS-style
 *
 */

import WebMercatorViewport from "@math.gl/web-mercator";

const mapString = `          . _..::__:  ,-"-"._       |]       ,     _,.__                      
  _.___ _ _<_>\`!(._\`.\`-.    /        _._     \`_ ,_/  '  '-._.---.-.__   
.{     " " \`-==,',._\\{  \\  / {) _   / _ ">_,-' \`                 /-/_    
\\_.:--.       \`._ )\`^-. "'     / ( [_/(                       __,/-'       
'"'    \\        "    _\\        -_,--'                  )     /. (|         
       |           ,'         _)_.\\\\._<> {}              _,' /  '         
       \`.         /          [_/_'\` \`"(                <'}  )            
        \\\\    .-. )          /   \`-'"..' \`:._          _)  '            
 \`        \\  (  \`(          /         \`:\\  > \\  ,-^.  /' '             
           \`._,   ""        |           \\\`'   \\|   ?_)  {\\             
              \`=.---.       \`._._       ,'     "\`  |' ,- '.              
                |    \`-._        |     /          \`:\`<_|=--._             
                (        >       .     | ,          \`=.__.\`-'\\             
                 \`.     /        |     |{|              ,-.,\\     .        
                  |   ,'          \\   / \`'            ,"     \\            
                  |  /             |_'                |  __  /                
                  | |                                 '-'  \`-'   \\.         
                  |/                                        "    /            
                  \\.                                            '           
                                                                             
                   ,/           ______._.--._ _..---.---------.              
__,-----"-..?----_/ )\\    . ,-'"             "                  (__--/    
                    /__/\\/                                               `;

export type ASCIIMapStyle = {
    margin: number;
    border: boolean;
    padding: number;
};

export type ASCIIMapMarker = {
    x: number;
    y: number;
    label: string;
    icon: string;
};

export type ASCIIMapTimeOverlay = {
    startHour: number;
    endHour: number;
    char: string;
    showDateLine?: boolean;
    coverMap?: boolean;
    testHour?: number;
};

/**
 * Combines the map str with the given markers and returns it
 * @export
 * @param {ASCIIMapLonLat[]} markersIn
 * @param {ASCIIMapStyle} configIn
 * @return {*}  {string}
 */
export function drawMap(
    markers: { lon: number; lat: number; label?: string; icon?: string }[] = [],
    config: { margin?: number; border?: boolean; padding?: number } = {},
    timeOverlay?: ASCIIMapTimeOverlay
): string {
    // sets up config and viewport
    const configFull: ASCIIMapStyle = {
        margin: config.margin !== undefined ? config.margin : 0,
        border: config.border !== undefined ? config.border : false,
        padding: config.padding !== undefined ? config.padding : 0,
    };
    const viewport: WebMercatorViewport = new WebMercatorViewport({
        width: 75,
        height: 23,
        longitude: 0,
        latitude: 0,
        zoom: 0,
    });
    const mapLines = mapString.split("\n").map((line) => line.slice(0, 70));

    // generate the mapOverlay
    const overlay = generateOverlay(timeOverlay);

    // Apply the border and padding to the map
    const map_str = getMapWithStyle(
        mapLines,
        configFull,
        overlay,
        timeOverlay?.coverMap
    ).split("\n");
    // Convert each marker from latLon for X,Y
    const markersXY: ASCIIMapMarker[] = markers.map((val) =>
        getXYfromLonLat(val, viewport)
    );
    // Store markers as a map so we can quickly check if a given character has a marker
    const markerMap = new Map(
        markersXY.map((val) => [`${val.x}:${val.y}`, val.icon])
    );

    // Render the map, replacing any markers with their icon
    const { border: border, margin: margin, padding: padding } = configFull;
    let _ret: string[] = [];
    map_str.forEach((row, index) => {
        // Calculate the total padding so we know how much to remove
        const ySpace =
            (border ? 1 : 0) + Math.floor(padding / 2) + Math.floor(margin / 2);
        const xSpace = (border ? 1 : 0) + padding + margin;

        // Render each line column by column
        let newLine = "";
        Array.from(row).forEach((col, colIndex) => {
            const markerKey = `${colIndex - xSpace}:${index - ySpace}`;
            if (markerMap.get(markerKey)) {
                newLine += markerMap.get(markerKey);
            } else {
                newLine += col;
            }
        });

        _ret.push(newLine);
    });

    return _ret.join("\n");
}

function generateOverlay(timeOverlay?: ASCIIMapTimeOverlay): string[] {
    if (!timeOverlay) {
        return Array(25).fill(Array(80).fill(" ").slice(0));
    }
    const { startHour, endHour, char, testHour } = timeOverlay;
    const offsets = [...Array(24).keys()].map((val) => val - 11);
    const date = new Date();

    const UTCHour = testHour ? testHour : date.getUTCHours();

    const overlay = [];
    for (let x = 0; x < 75; x += 1) {
        const thisOffset = offsets[Math.floor(x / 3)];
        const thisHour = (UTCHour + thisOffset + 1 + 24) % 24;
        const isCenterline = x % 3 === 0;

        if (thisHour >= startHour && thisHour < endHour) {
            overlay.push(char);
        } else if (timeOverlay.showDateLine && thisHour === 0 && isCenterline) {
            overlay.push("|");
        } else {
            overlay.push(" ");
        }
    }
    return Array(25).fill(overlay.slice(0));
}

/**
 * Takes a Lat, Lon pair and return the Mercador projection X, Y suitable for this map
 * It ignores the very top and bottom of the map due to them being arctic regions and empty
 * @param {ASCIIMapLonLat} lonlat
 * @param {WebMercatorViewport} viewport
 * @return {*}  {ASCIIMapMarker}
 */
function getXYfromLonLat(
    lonlat: { lon: number; lat: number; label?: string; icon?: string },
    viewport: WebMercatorViewport
): ASCIIMapMarker {
    // Use the WebMercator projection
    const pixels = viewport.project([lonlat.lon, lonlat.lat], {
        topLeft: true,
    });
    // Normalise the X, Y in their min -> max space
    const normalX = (pixels[0] + 219) / (293 + 219);
    const normalY = (pixels[1] + 244) / (266 + 244);

    // Stretch them to match the ASCII map
    const [width, height] = [70, 42];
    const realX = normalX * width - 3;
    const realY = normalY * height - 9;

    return {
        x: Math.floor(realX),
        y: Math.floor(realY),
        label: lonlat.label ? lonlat.label : "#",
        icon: lonlat.icon,
    };
}

/**
 * Applies the given margin, padding and borders from the config to the map and returns it
 * @param {string[]} mapLines
 * @param {ASCIIMapStyle} config
 * @return {*}  {string}
 */
function getMapWithStyle(
    mapLines: string[],
    config: ASCIIMapStyle,
    overlay: string[],
    overlayCoverMap?: boolean
): string {
    const { margin: margin, border: border, padding: padding } = config;
    const cols = 70;

    // define different spacings as strings so we can insert them directly
    const xMargin = " ".repeat(margin);
    const yMargin = "\n".repeat(Math.floor(margin / 2));
    const xBorder = border ? "|" : "";
    const yBorder = border ? "-" : "";
    const xPadding = " ".repeat(padding);
    let yPadding = `\n`.repeat(Math.floor(padding / 2));
    // if there is a border, the yPadding must include it
    if (border) {
        yPadding = `${xMargin}${xBorder}${" ".repeat(
            cols + padding * 2
        )}${xBorder}${xMargin}\n`.repeat(Math.floor(padding / 2));
    }

    // for each line of the map, add the appropriate paddings
    let out = yMargin;
    if (border) {
        out += `${xMargin}+${yBorder.repeat(cols + padding * 2)}+${xMargin}\n`;
    }
    out += yPadding;
    for (const [lineIndex, line] of Array.from(mapLines.entries())) {
        const lineWithOverlay = [];
        for (const [colIndex, char] of line.split("").entries()) {
            if (overlayCoverMap || char === " ") {
                lineWithOverlay.push(overlay[lineIndex][colIndex]);
            } else {
                lineWithOverlay.push(char);
            }
        }

        out += `${xMargin}${xBorder}${xPadding}${lineWithOverlay
            .join("")
            .replace(/\n/g, "")}${xPadding}${xBorder}${xMargin}\n`;
    }
    out += yPadding;
    if (border) {
        out += `${xMargin}+${yBorder.repeat(cols + padding * 2)}+${xMargin}`;
    }
    out += yMargin;

    return out;
}
