import { drawMap } from "../src"

describe("Tests Overlay", () => {
    test("Tests total overlay", () => {
        const map = drawMap([], {}, {startHour: 0, endHour: 24, char: "`"}).split("\n");
        console.log(map.join("\n"))
        // checks the overlay is roght
        expect(map[0][5]).toEqual("`") // top left
        expect(map[22][69]).toEqual("`") // bottom right
        expect(map[13][69]).toEqual("`") // middle righ
        
    })
    
    test("Tests total coverAll overlay", () => {
        const map = drawMap([], {}, {startHour: 0, endHour: 24, char: "`", coverMap: true}).split("\n");
        console.log(map.join("\n"))

        const mapChars = Array.from(map.join("").replace("\n", ""))
        expect(mapChars.find(val => val !== "`")).toEqual(undefined)
    })

    test("Tests overlay from AUS => Brazil at 21UTC", () => {
        const map = drawMap([], {}, {startHour: 7, endHour: 17, char: "`", testHour: 21}).split("\n");
        console.log(map.join("\n"))
        // checks the overlay is roght
        expect(map[19][17]).toEqual("`") // panama
        expect(map[19][18]).toEqual(" ") // east of pananma

        expect(map[19][60]).toEqual("`") // melbourne
        expect(map[19][59]).toEqual(" ") // west of melbourne
        
    })

    test("Tests dateline", () => {
        const map = drawMap([], {}, {startHour: 7, endHour: 17, char: "`", showDateLine: true, testHour: 21}).split("\n");
        console.log(map.join("\n"))
        // checks the overlay is roght
        expect(map[19][17]).toEqual("`") // panama
        expect(map[19][18]).toEqual(" ") // east of pananma

        expect(map[19][60]).toEqual("`") // melbourne
        expect(map[19][59]).toEqual(" ") // west of melbourne
        
    })
})

describe("Tests style", () => {
    test("Tests margin: 2 ,padding: 2, border: true", () => {
        const config = {
            border: true,
            margin: 2,
            padding: 2
        }
        const map = drawMap([], config).split("\n");
        console.log(map.join("\n"))
        // checks the padding is right
        expect(map[0][5]).toEqual(undefined)
        expect(map[1][5]).toEqual("-")
        expect(map[3][2]).toEqual("|")
        expect(map[1][2]).toEqual("+")
        
    })
    test("Tests no style", () => {
       
        const map = drawMap().split("\n");
        console.log(map.join("\n"))

        // checks the padding is right
        expect(map[0][0]).toEqual(" ")
        expect(map[22][69]).toEqual(" ")
        expect(map[13][0]).toEqual(" ")
        expect(map[13][69]).toEqual(" ")
        
    })
})