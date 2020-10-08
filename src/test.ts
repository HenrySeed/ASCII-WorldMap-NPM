import { drawASCIIMap } from "./world"

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
