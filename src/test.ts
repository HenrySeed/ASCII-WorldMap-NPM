import { WorldMap } from "./world";

const coords = [
    { lon: -165.789416, lat: 85, label: "Top-Left" },
    { lon: 187.206533, lat: 85, label: "Top-Right" },
    { lon: 0, lat: 85, label: "Center" }
    // { lon: 0.106923, lat: 51.369208, label: "London" },
    // { lon: -434.715499, lat: 39.768173, label: "New ork" },
    // { lon: -313.850023, lat: -18.259349, label: "Madagascar" },
    // { lon: -222.565312, lat: -34.520136, label: "Melbourne" },
    // { lon: 16.373819, lat: 48.208176, label: "Vienna" },
    // { lon: 172.63623, lat: -43.532055, label: "CHCH" }
    // { lon: 139.691711, lat: 35.689487, label: "Tokyo" },
    // { lon: -118.441495, lat: 33.929047, label: "LA" },
    // { lon: -123.110419, lat: 49.240186, label: "Vancouver" }
];

const map = new WorldMap();

for (const coord of coords) {
    map.addMarker(coord);
}

console.log(map.drawMapAndMarkers());
// console.log("Map");
