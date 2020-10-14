import { drawMap } from "../src"

describe("Tests Overlay", () => {
    test("1", () => {
        const map = drawMap([], {}, {startHour: 0, endHour: 24, char: "`"}).split("\n");
        // console.log(map.join("\n"))
        // checks the overlay is roght
        expect(map[0][5]).toEqual("`") // top left
        expect(map[22][69]).toEqual("`") // bottom right
        expect(map[13][69]).toEqual("`") // middle righ
        
    })
})

describe("Tests style", () => {
    test("1", () => {
        const config = {
            border: true,
            margin: 2,
            padding: 2
        }
        const map = drawMap([], config).split("\n");
        // console.log(map.join("\n"))
        // checks the padding is right
        expect(map[0][5]).toEqual(undefined)
        expect(map[1][5]).toEqual("-")
        expect(map[3][2]).toEqual("|")
        expect(map[1][2]).toEqual("+")
        
    })
    test("1", () => {
       
        const map = drawMap([],).split("\n");
        // console.log(map.join("\n"))

        // checks the padding is right
        expect(map[0][0]).toEqual(" ")
        expect(map[22][69]).toEqual(" ")
        expect(map[13][0]).toEqual(" ")
        expect(map[13][69]).toEqual(" ")
        
    })
})