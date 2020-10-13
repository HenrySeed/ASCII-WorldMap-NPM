# ASCII-WorldMap

Want to show where your team mates are around the world? But think Google's API is just way too practical? 

Just use ASCII!

You can add markers to the map, or just return the map plain. There are added options for a border, padding and margins, just like css.


# Usage

```javascript
import { drawMap } from "ascii-worldmap"

// you can ignore the icon and label fields, logo defaults to "#", label is unused
const markers = [
    { label: "London", lon: -0.192098, lat: 51.610002, icon: "\x1b[31m#\x1b[39m" },
    { label: "LA", lon: -118.441495, lat: 33.929047, icon: "\x1b[31m#\x1b[39m" },
    { label: "CHCH", lon: 172.63623, lat: -43.532055, icon: "\x1b[31m#\x1b[39m" }
];

const config = {
    border: true,
    margin: 2,
    padding: 2
}

console.log(drawMap(markers, config));
```

![Screenshot](https://i.imgur.com/w2mGsbL.png)

# Docs

## drawMap( markers: object, config: object )

### markers (optional)
| attribute | type | description |
| --- | --- | -- |
| lon | number  |  Longitude |
| lat | number  | Latitude |
| label |  string | Label (Currently unsused) |
| icon (optionsl) |  string | Icon used when drawing to the map Defaults to "#" |

### config (optional)
| attribute | type | description |
| --- | --- | --- |
| border (optional) | boolean  | Toggles border |
| margin (optional) | number  | Number of spaces outside border. Is halved for vertical space  |
| padding (optional) |  number | Number of spaces inside border. Is halved for vertical space |




