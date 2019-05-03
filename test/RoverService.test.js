const assert = require('assert');
const expect = require('chai').expect;

const RoverService = require('../app/service/RoverService');

const getRoverService = (amount, instruction) => {
    const reader = class Reader {
        constructor(amount, instruction) {
            this.amount = amount;
            this.instruction = instruction;
        }
        read(label) {
            return new Promise((resolve, reject) => {
                if (label == "how many Rovers: ") {
                    resolve(this.amount);
                }
                if (label == "\nInform the landing coordinates for Rover0 separated by space (ex: 1 3 N)\n") {
                    resolve(this.instruction);
                }
            });
        }
        splitLine(inputLine) {
            return new Promise((resolve, reject) => {
                if (inputLine == "5 5 n") {
                    return resolve(["5", "5", "n"]);
                }
                if (inputLine == "12 12 s") {
                    return resolve(["12", "12", "s"]);
                }
                if (inputLine == "0 0 W") {
                    return resolve(["0", "0", "W"]);
                }
                if (inputLine == "13 12 s") {
                    return resolve(["13", "12", "s"]);
                }
                if (inputLine == "0 -1 s") {
                    return resolve(["0", "-1", "s"]);
                }
                if (inputLine == "0 0 X") {
                    return resolve(["0", "0", "X"]);
                }

                return reject("Not Mapped to mock");

            });
        }
    }
    return new RoverService(new reader(amount, instruction));

};

describe('Nasa Rover Initiavive test', () => {
    describe('MovemenService Test', () => {
        it('Validate valid landing coordinate', function (done) {
            const inputCoord = "5 5 n";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedCoord = ["5", "5", "N"];

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then(coordinate => {
                expect(coordinate).to.deep.equal(expectedCoord);
                done();
            });

        })

        it('Validate lowest valid landing coordinate', function (done) {
            const inputCoord = "0 0 W";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedCoord = ["0", "0", "W"];

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then(coordinate => {
                expect(coordinate).to.deep.equal(expectedCoord);
                done();
            });

        })

        it('Validate highest valid landing coordinate', function (done) {
            const inputCoord = "12 12 s";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedCoord = ["12", "12", "S"];

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then(coordinate => {
                expect(coordinate).to.deep.equal(expectedCoord);
                done();
            });

        })

        it('Validate landing outside of maximum coordinate', function (done) {
            const inputCoord = "13 12 s";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedMessage = "\nInvalid landing coordinate. valid range: X:12 | Y:12";

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then()
                .catch(errorMessage => {
                    expect(errorMessage).to.deep.equal(expectedMessage);
                    done();
                });

        })

        it('Validate landing outside of minimum coordinate', function (done) {
            const inputCoord = "0 -1 s";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedMessage = "\nInvalid landing coordinate. valid range: X:12 | Y:12";

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then()
                .catch(errorMessage => {
                    expect(errorMessage).to.deep.equal(expectedMessage);
                    done();
                });

        })

        it('Validate direction', function (done) {
            const inputCoord = "0 0 X";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const expectedMessage = "\nInvalid rover direction, try again from the beginning\n";

            roverService.validateRoverLandingCoordinate(inputCoord, terrain).then()
                .catch(errorMessage => {
                    expect(errorMessage).to.deep.equal(expectedMessage);
                    done();
                });

        })

        it('Validate launch rover', function (done) {
            const inputCoord = "5 5 n";
            const roverService = getRoverService(1, inputCoord);
            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };
            const roverList = [{ "name": "Rover0", coordinate: { "posX": "0", "posY": "0", "direction": "N" } }];
            const expectedRoverList = [{ "name": "Rover0", coordinate: { "posX": "5", "posY": "5", "direction": "N" } }];

            roverService.launchRovers(roverList, terrain).then(responseRoverList => {
                expect(responseRoverList).to.deep.equal(expectedRoverList);
                done();
            });
        })


        it('Create rover', function (done) {
            const inputCoord = "5 5 n";
            const roverService = getRoverService(1, inputCoord);
            const expectedRoverList = [{ "name": "Rover0", coordinate: { "posX": 0, "posY": 0, "direction": "N" } }];

            roverService.createRovers().then(responseRoverList => {
                console.log(responseRoverList);
                expect(responseRoverList).to.deep.equal(expectedRoverList);
                done();
            });
        })
        it('Create invalid amount of rovers', function (done) {
            const inputCoord = "5 5 n";
            const roverService = getRoverService("D", inputCoord);
            const expectedMessage = "\nInvalid Rover amount. Only number allowed\n";

            roverService.createRovers().then()
                .catch(response => {
                    expect(response).to.equal(expectedMessage);
                });
        })



    });
});