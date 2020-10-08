import WebMercatorViewport from "@math.gl/web-mercator";

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

type Marker = { x: number; y: number; label: string, icon: string };

export class WorldMap {
    map_lines: string[];
    markers: Marker[];
    border: boolean;
    viewport: WebMercatorViewport;

    constructor(border: boolean = false) {
        this.map_lines = map.split("\n");
        this.markers = [];
        this.border = border;
        this.viewport = new WebMercatorViewport({
            width: 75,
            height: 23,
            longitude: 0,
            latitude: 0,
            zoom: 0,
        });
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
		const pixels = this.viewport.project([lon, lat], { topLeft: true });
        const normalX = (pixels[0] + 219) / (293 + 219);
        const normalY = (pixels[1] + 244) / (266 + 244);

		const [width, height] = [70, 45];
		const realX = normalX * width - 3
		const realY = normalY * height - 9

        return {
            x: Math.floor(realX),
            y: Math.floor(realY)
        };
    }

    /**
     * Returns the [rows, cols] height and width of the given map
     * @returns {{ width: number; height: number }}
     * @memberof WorldMap
     */
    getDimensions(): { width: number; height: number } {
        const widths: number[] = this.map_lines.map(
            (val) => val.replace(/\n/g, "").length
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
    addMarker(data: { lon: number; lat: number; label: string, icon: string }): void {
        const { lon: lon, lat: lat, label: label, icon: icon } = data;
        const { x: markerX, y: markerY } = this.getXYfromLonLat(lon, lat);
        console.log(
            `Converting ${label} lon,lat to x,y\n{lon: ${lon}, lat: ${lat}}\n{x: ${markerX}, y: ${markerY}}\n`
        );
        this.markers.push({ x: markerX, y: markerY, label: label, icon: icon });
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
            this.markers.map((val) => [`${val.x}:${val.y}`, val.icon])
        );
        const margin = this.border ? 1 : 0;
		console.log(markerMap)

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
