const expect = require('chai').expect;

const TerrainService = require('../app/service/TerrainService');

const getTerrainService = (limits) => {
    const reader = class Reader {
        constructor(limits) {
            this.limits = limits;
        }
        read(label) {
            return new Promise((resolve, reject) => {
                if (label == "Terrain coordinates separated by space: ") {
                    resolve(this.limits);
                } else {
                    return reject()
                }
            })
        }
    }

    return new TerrainService(new reader(limits));
};

describe('TerrainService unit tests', () => {
    it('Validate terrain creation', function(done){
        const terrainService = getTerrainService("12 12");
        const expectedTerrain = {"maxPositionX": "12", "maxPositionY": "12"};

        terrainService.read().then(responseTerrain => {
            expect(responseTerrain).to.deep.equal(expectedTerrain);
            done();
        });
    });

    it('Validate incorrect number of instructions', function(done){
        const terrainService = getTerrainService("12");
        const expectedMessage = "\nInvalid input: 12\nInform two numbers separated by space to delimitate the terrain X/Y limits\n"

        terrainService.read().then().catch(errorMessage => {
            expect(errorMessage).to.equal(expectedMessage);
            done();
        })
    });

    it('Validate size is not a number', function(done){
        const terrainService = getTerrainService("12 D");
        const expectedMessage = "\nInvalid Terrein size. Only number allowed\n";

        terrainService.read().then().catch(errorMessage => {
            expect(errorMessage).to.equal(expectedMessage);
            done();
        })
    });

});