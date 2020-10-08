import { drawASCIIMap } from "../src"

describe("Tests padding", () => {
    test("1", () => {
        const config = {
            border: true,
            margin: 2,
            padding: 2
        }
        const map = drawASCIIMap([], config).split("\n");

        console.log(map)

        // checks the padding is right
        expect(map[0][5]).toEqual(undefined)
        expect(map[1][5]).toEqual("-")
        expect(map[3][2]).toEqual("|")
        expect(map[1][2]).toEqual("+")
        
    })
})