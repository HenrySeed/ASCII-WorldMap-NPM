import { lngLatToMeters, metersToPixels } from "global-mercator";

/**
 * Returns the inverse of a number in a range eg:
 *  reverseNumRange(1, 0, 10) => 9
 * @param {number} num
 * @param {number} minNum
 * @param {number} maxNum
 * @returns {number}
 */
function inverseNumInRange(
    num: number,
    minNum: number,
    maxNum: number
): number {
    return maxNum + minNum - num;
}

const map = `
        . _..::__:  ,-"-"._       |]       ,     _,.__              
_.___ _ _<_>\`!(._\`.\`-.    /        _._     \`_ ,_/  '  '-._.---.-.__ 
.{     " " \`-==,',._\\{  \\  / {)     / _ ">_,-' \`                 /-/_ 
\\_.:--.       \`._ )\`^-. "'      , [_/(                       __,/-'  
'"'    \\        "    _L       |-_,--'                  )     /. (|    
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
                    /__/\\/                                          
`;

type Marker = { x: number; y: number; label: string };

export class WorldMap {
    map_lines: string[];
    markers: Marker[];
    border: boolean;

    constructor(border: boolean = false) {
        this.map_lines = map.split("\n");
        this.markers = [];
        this.border = border;
    }

    /**
     * Takes a Lat, Lon pair and return the Mercador projection X, Y suitable for this map
            It ignores the very top and bottom of the map due to them being arctic regions and empty
            Lat range:
     * @param {*} self
     * @param {*} lat
     * @param {*} lon
     * @memberof WorldMap
     */
    getXYfromLonLat(lon: number, lat: number): { x: number; y: number } {
        const meters = lngLatToMeters([lon, lat]);
        const pixels = metersToPixels(meters);

        // // we standardise the coords in the given ranges here, so it becomes a percentage
        // const xRange = { min: -20037508.34, max: 20037508.34 };
        // const yRange = { min: -20048966.1, max: 20048966.1 };
        // const x_percent = (x - xRange.min) / (xRange.max - xRange.min);
        // const y_percent = (y - yRange.min) / (yRange.max - yRange.min);

        // // we then take that percentage and apply it to the map width or height
        // const mapCols = 69;
        // const mapRows = 41;
        // const mapX = Math.floor(x_percent * mapCols);
        // let mapY = Math.floor(y_percent * mapRows);

        // // we have to reverse the y
        // mapY = inverseNumInRange(mapY, 0, mapRows);

        // // Anything above or below our
        // const topMargin = 10;
        // const bottomMargin = 10;
        // if (mapY - topMargin < 0 || mapY > mapRows - bottomMargin) {
        //     throw Error(
        //         `The Lat, Lon (${lon}, ${lat}) was above or below our margins`
        //     );
        // }
        // return { x: mapX, y: mapY - topMargin };
        return { x: Math.floor(pixels[0]) - 7, y: Math.floor(pixels[1]) - 197 };
    }

    /**
     * Returns the [rows, cols] height and width of the given map
     * @returns {{ width: number; height: number }}
     * @memberof WorldMap
     */
    getDimensions(): { width: number; height: number } {
        const widths: number[] = this.map_lines.map(
            val => val.replace(/\n/g, "").length
        );
        return { width: Math.max(...widths), height: this.map_lines.length };
    }

    /**
     * Resets the Markers
     * @memberof WorldMap
     */
    clearMarkers(): void {
        this.markers = [];
    }

    /**
     * Adds a new Marker
     * @param {*} x
     * @param {*} y
     * @param {*} char
     * @memberof WorldMap
     */
    addMarker(data: { lon: number; lat: number; label: string }): void {
        const { lon: lon, lat: lat, label: label } = data;
        const { x: markerX, y: markerY } = this.getXYfromLonLat(lon, lat);
        console.log(
            `Converting ${label} lon,lat to x,y\n{lon: ${lon}, lat: ${lat}}\n{x: ${markerX}, y: ${markerY}}\n`
        );
        this.markers.push({ x: markerX, y: markerY, label: label });
    }

    /**
     * Loads the map from the txt file and returns the string with newLines
     * @returns {string}
     * @memberof WorldMap
     */
    getRawMapString(): string {
        if (this.border) {
            const { height: rows, width: cols } = this.getDimensions();

            let out = "+" + "-".repeat(cols) + "+\n";
            for (const line of this.map_lines) {
                out += "|" + line.replace(/\n/g, "") + "|\n";
            }
            out += "+" + "-".repeat(cols) + "+";

            return out;
        } else {
            return this.map_lines.join("\n");
        }
    }

    /**
     * Combines the map str with the given markers and returns i t
     * @returns
     * @memberof WorldMap
     */
    drawMapAndMarkers(): string {
        const map_str = this.getRawMapString().split("\n");
        const markerMap = new Map(
            this.markers.map(val => [`${val.x}:${val.y}`, "#"])
        );
        const margin = this.border ? 1 : 0;

        let _ret: string[] = [];

        map_str.forEach((row, index) => {
            let newLine = "";
            Array.from(row).forEach((col, colIndex) => {
                const markerKey = `${colIndex - margin}:${index - margin}`;
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
}
