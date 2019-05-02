const Terrain = require("../model/Terrain");

class TerrainService {
    constructor(reader) {
        this.reader = reader;

    }

    read() {
        return new Promise(async (resolve, reject) => {
            try {
                const input = await this.reader.read("Terrain coordinates separated by space: ");
                const terrainEdges = input.split(" ");

                if (terrainEdges.length != 2) {
                    return reject(`\nInvalid input: ${input}\nInform two numbers separated by space to delimitate the terrain X/Y limits\n`);
                }

                if (isNaN(terrainEdges[0]) || isNaN(terrainEdges[1])) {
                    return reject("\nInvalid Terrein size. Only number allowed\n");
                }

                resolve(new Terrain(terrainEdges[0], terrainEdges[1]));

            } catch (error) {
                return reject("Error readding terrain size");

            }
        });
    }
}

module.exports = TerrainService;
