import { WorldMap } from "./world";

const coords = [
    // { lon: -180, lat: -85, label: "Top-Left", icon: "#" },
    // { lon: 0, lat: -85, label: "Top-Center", icon: "#" },
    // { lon: 180, lat: -85, label: "Top-Right", icon: "#" },
    // { lon: -180, lat: 85, label: "Bottom-Left" , icon: "#"},
    // { lon: 0, lat: 85, label: "Bottom-Center", icon: "#" },
    // { lon: 180, lat: 85, label: "Bottom-Right", icon: "#" },
    { lon: -0.192098, lat: 51.610002, label: "London", icon: "#" },
    { lon: -434.715499, lat: 39.768173, label: "New York", icon: "#" },
    { lon: 47.278309, lat: -19.510083, label: "Madagascar" , icon: "#"},
    { lon: 138.037324, lat: -34.996693, label: "Melbourne", icon: "#" },
    { lon: 14.320245, lat: 47.486404, label: "Vienna", icon: "#" },
    { lon: 139.691711, lat: 35.689487, label: "Tokyo", icon: "#" },
    { lon: -123.110419, lat: 49.240186, label: "Vancouver", icon: "#" },
    { lon: -118.441495, lat: 33.929047, label: "LA", icon: "#" },
    { lon: 172.63623, lat: -43.532055, label: "CHCH", icon: "#" },
];

const colors = new Map<string, string>([
	["magenta", "\x1b[35m"],
	["yellow", "\x1b[93m"],
	["red", "\x1b[31m"],
	["orange", "\x1b[33m"],
	["normal", "\x1b[39m"],
	["grey", "\x1b[37m"],
	["green", "\x1b[32m"],
	["blue", "\x1b[34m"],
	["cyan", "\x1b[36m"],
])

const map = new WorldMap();

coords.forEach((coord, index) => {
    const color = colors.get("red")
    coord.icon = `${color}#${colors.get("normal")}`
    map.addMarker(coord);
})

console.log(map.drawMapAndMarkers());
