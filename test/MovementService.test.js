const expect = require('chai').expect;

const MovementService = require('../app/service/MovementService');

const getMovementService = (roverIndex, instruction) => {
    const reader = class Reader {
        constructor(roverIndex, instruction) {
            this.roverIndex = roverIndex;
            this.instruction = instruction;
        }
        read(label) {
            return new Promise((resolve, reject) => {
                if (label == "Type the rover (by number) that you want to move: ") {
                    resolve(this.roverIndex);
                }
                if (label == "Type the movement instructions (L, R or M. Ex:LMMRM): ") {
                    resolve(this.instruction);
                }
            })
        }
    }
    return new MovementService(new reader(roverIndex, instruction));

};


describe('Nasa Rover Initiavive test', () => {

    describe('MovemenService Test', () => {

        it('Validate Move Rover', function (done) {
            const movementService = getMovementService(0, "LMRMMR");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 5, "posY": 5, "direction": 'N' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const expectedReturnedList = [{ "name": "Rover0", coordinate: { "posX": 4, "posY": 7, "direction": 'E' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
                expect(resultList).to.deep.equal(expectedReturnedList);
                done();
            });
        });

        it('Validate Move Rover with invalid instruction', function (done) {
            const movementService = getMovementService(0, "LMXM");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 5, "posY": 5, "direction": 'N' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
            }).catch(errorMessage => {
                expect(errorMessage).to.equal("X is not a valid instruction");
                done();
            });
        });

        it('Validate Move Rover trying to move outside of the terrain', function (done) {
            const movementService = getMovementService(0, "MLM");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 0, "posY": 0, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
            }).catch(errorMessage => {
                expect(errorMessage).to.equal("Invalid movement, you can't move outside of the terrain");
                done();
            });
        });

        it('Validate Move Rover passing a letter in the rover number', function (done) {
            const movementService = getMovementService("X", "LMLM");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 5, "posY": 5, "direction": 'N' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
            }).catch(errorMessage => {
                expect(errorMessage).to.equal("X is not a number.\n");
                done();
            });
        });

        it('Validate Move Rover passing an invalid rover number', function (done) {
            const movementService = getMovementService(3, "LMLM");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 5, "posY": 5, "direction": 'N' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
            }).catch(errorMessage => {
                expect(errorMessage).to.equal("there is no Rover3 on the roverList. Consult your rovers and trt again\n");
                done();
            });
        });


        it('Validate Turn Left', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const newDirection = "W";

            const returnedDirect = movementService.turnLeft(givenCoordinate);
            expect(returnedDirect).to.equal(newDirection);
        });


        it('Validate Turn Right', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const newDirection = "E";

            const returnedDirect = movementService.turnRight(givenCoordinate);
            expect(returnedDirect).to.equal(newDirection);
        });

        it('Validate Move Forward to North', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const expectedCoordinate = { "posX": 1, "posY": 2, "direction": "N" };

            const returnedCoordinate = movementService.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
        });

        it('Validate Move Forward to South', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "S" };
            const expectedCoordinate = { "posX": 1, "posY": 0, "direction": "S" };

            const returnedCoordinate = movementService.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
        });

        it('Validate Move Forward to West', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "W" };
            const expectedCoordinate = { "posX": 0, "posY": 1, "direction": "W" };

            const returnedCoordinate = movementService.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
        });

        it('Validate Move Forward to East', function () {
            const movementService = getMovementService(0, "LMLMM");
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "E" };
            const expectedCoordinate = { "posX": 2, "posY": 1, "direction": "W" };

            const returnedCoordinate = movementService.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
        });

        it('Validate Received instructions', function (done) {
            const instructionSet = "LMRRM";
            const movementService = getMovementService(0, instructionSet);

            movementService.validateReceivedInstructions(instructionSet).then(validationReturn => {
                expect(validationReturn).to.equal(undefined);
                done();
            });
        });

        it('Validate invalid instructions received', function (done) {
            const instructionSet = "LMXRM";
            const errorMessage = "X is not a valid instruction";
            const movementService = getMovementService(0, instructionSet);

            movementService.validateReceivedInstructions(instructionSet).then(result => {
                expect(result).to.equal(errorMessage);
                done();
            });
        });
    });
});