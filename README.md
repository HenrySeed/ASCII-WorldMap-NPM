# ASCII-WorldMap

# Usage

```javascript
import { drawASCIIMap } from "./world"

// you can ignore the icon and label fields, logo defaults to "#", label is unused
const markers = [
    { lon: -0.192098, lat: 51.610002, label: "London", icon: "\x1b[31m#\x1b[39m" },
    { lon: -118.441495, lat: 33.929047, label: "LA", icon: "\x1b[31m#\x1b[39m" },
    { lon: 172.63623, lat: -43.532055, label: "CHCH", icon: "\x1b[31m#\x1b[39m" }
];

const config = {
    border: true,
    margin: 2,
    padding: 2
}

console.log(drawASCIIMap(markers, config));
```

![Screenshot](https://i.imgur.com/w2mGsbL.png)

# Docs

## drawASCIIMap( markers: object, config: object )

### markers
| attribute | type | description |
| --- | --- | -- |
| lon | number  |  Longitude |
| lat | number  | Latitude |
| label |  string | Label (Currently unsused) |
| icon (optionsl) |  string | Icon used when drawing to the map Defaults to "#" |

### config
| attribute | type | description |
| --- | --- | --- |
| border (optional) | boolean  | Toggles border |
| margin (optional) | number  | Number of spaces outside border. Is halved for vertical space  |
| padding (optional) |  number | Number of spaces inside border. Is halved for vertical space |




