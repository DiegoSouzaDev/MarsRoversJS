const Rover = require("../model/Rover");

class RoverService {
    constructor(reader) {
        this.reader = reader;
    }

    createRovers() {
        return new Promise(async (resolve, reject) => {
            let roverList = [];

            try {
                const amount = await this.reader.read("how many Rovers: ");

                if (isNaN(amount)) {
                    return reject("\nInvalid Rover amount. Only number allowed\n");

                }

                for (var index = 0; index < amount; index++) {
                    roverList.push(new Rover(index))
                    console.log(`${index} - Rover${index} created`);
                }
                resolve(roverList);

            } catch (error) {
                return reject("\nError reading rover quantity. Try again\n");

            };

        });
    }

    launchRovers(roverList, terrain) {
        return new Promise(async (resolve, reject) => {
            for (let indexer = 0; indexer < roverList.length; indexer++) {
                try {
                    const rover = roverList[indexer];

                    const inputCoord = await this.reader.read(`\nInform the landing coordinates for ${rover.name} separated by space (ex: 1 3 N)\n`);
                    const coordPieces = await this.validateRoverLandingCoordinate(inputCoord, terrain);

                    rover.coordinate.posX = coordPieces[0];
                    rover.coordinate.posY = coordPieces[1];
                    rover.coordinate.direction = coordPieces[2];

                } catch (error) {
                    return reject(error);
                }
            }

            resolve(roverList);
        });
    }

    async validateRoverLandingCoordinate(inputCoord, terrain) {
        return new Promise(async (resolve, reject) => {
            try {
                const validDirection = "NEWS";
                const coordPieces = await this.reader.splitLine(inputCoord);
                const posX = coordPieces[0];
                const posY = coordPieces[1];
                const direction = coordPieces[2].toUpperCase();

                if (posX > terrain.maxPositionX || posY > terrain.maxPositionY) {
                    return reject(`\nInvalid landing coordinate. valid range: X:${terrain.maxPositionX} | Y:${terrain.maxPositionY}`);
                }

                if (direction == "" || !validDirection.includes(direction)) {
                    return reject("\nInvalid rover direction, try again from the beginning\n");
                }

                coordPieces[2] = direction;
                resolve(coordPieces);

            } catch (err) {
                return reject(err);
            }
        });
    };

}

module.exports = RoverService;