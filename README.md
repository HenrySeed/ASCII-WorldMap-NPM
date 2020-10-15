# ASCII-WorldMap

Want to show where your team mates are around the world? But think Google's API is just way too practical? 

Just use ASCII!

You can add markers to the map, or just return the map plain. There are added options for a border, padding and margins, just like css.


# Basic Usage
See a demo on [RunKit](https://runkit.com/embed/hqjjrh6tig6l)

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

## drawMap( markers: object, config: object, timeZoneOverlay )

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
| margin (optional) | number  | Number of spaces outside border. Is halved for vertical space  |
| border (optional) | boolean  | Toggles border |
| padding (optional) |  number | Number of spaces inside border. Is halved for vertical space |


### timeZoneOverlay (optional)
This overlays a pattern of the given char covering a time range. Each longitude is given an estimated UTC offset and the localTme is tested to be withing the given range (startTime -> endTime).

| attribute | type | description |
| --- | --- | --- |
| startHour | number  | Points with estimated time after this appear with overlay eg: 7:01 counts as after 7:00 (is overlayed) |
| endHour | number  | Points with estimated time before this appear with overlay eg: 6:59 counts as before 7:00 (is overlayed) |
| char |  string | char used for overlay. Recommended: "`" |
| coverMap |  boolean | By default the map only replaces empty spaces in the map with an overlay (so the overlay is transparent and you can still see the map). This makes the overlay cover the map totally (excluding markers) |
| testHour (optional) |  number | For testing purposes you can force the hour to be static at a given UTC. Not recommended outside of testing |

#### Usage
See a demo on [RunKit](https://runkit.com/embed/9cn97wjnhh0w)

```javascript
import { drawMap } from "ascii-worldmap"

console.log(drawMap([], {}, {startHour: 7, endHour: 17, char: "`"}));
```

#### Output

```
``````````.`_..::__:  ,-"-"._       |]       ,     _,.__    ``````````
``_.___`_`_<_>`!(._`.`-.    /        _._     `_ ,_/  '  '-._.---.-.__`
.{`````"`"``-==,',._\{  \  / {) _   / _ ">_,-' `            `````/-/_`
\_.:--.````````._`)`^-. "'     / ( [_/(                     ``__,/-'``
'"'````\````````"`   _\        -_,--'                  )    `/.`(|````
```````|`````````` ,'         _)_.\\._<> {}              _,'`/``'`````
````````.`````````/          [_/_'` `"(                <'}  )`````````
````````\\````.-.`)          /   `-'"..' `:._          _)  '``````````
``````````\``(```(          /         `:\  > \  ,-^.  /' '  ``````````
````````````._,```""        |           \`'   \|   ?_)  {\  ``````````
```````````````=.---.       `._._       ,'     "`  |' ,- '. ``````````
````````````````|`   `-._        |     /          `:`<_|=--._`````````
````````````````(`       >       .     | ,          `=.__.`-'\````````
``````````````````.     /        |     |{|              ,-.,\`````.```
``````````````````|   ,'          \   / `'            ,"    `\````````
``````````````````|  /             |_'                |  __ `/````````
``````````````````| |                                 '-'  `-'```\.```
``````````````````|/                                        "````/````
``````````````````\.                                        ````'`````
``````````````````                                          ``````````
`````````````````` ,/           ______._.--._ _..---.---------.```````
__,-----"-..?----_/ )\    . ,-'"             "              ````(__--/
``````````````````  /__/\/                                  ``````````
```
