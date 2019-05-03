const assert = require('assert');
const expect = require('chai').expect;
const Reader = require('../app/input/Reader');
const MovementService = require('../app/service/MovementService');

const MovementServiceInstance = new MovementService(new Reader);

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
            const movementService = getMovementService(0, "LMMM");

            const roverList = [{ "name": "Rover0", coordinate: { "posX": 5, "posY": 5, "direction": 'N' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const expectedReturnedList = [{ "name": "Rover0", coordinate: { "posX": 4, "posY": 3, "direction": 'S' } }
                , { "name": "Rover1", coordinate: { "posX": 2, "posY": 3, "direction": 'N' } }];

            const terrain = { "maxPositionX": 12, "maxPositionY": 12 };

            movementService.moveRover(roverList, terrain).then(resultList => {
                expect(resultList).to.deep.equal(expectedReturnedList);
            });

            done();
        });

        it('Validate Turn Left', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const newDirection = "W";

            const returnedDirect = MovementServiceInstance.turnLeft(givenCoordinate);
            expect(returnedDirect).to.equal(newDirection);
            done();
        });


        it('Validate Turn Right', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const newDirection = "E";

            const returnedDirect = MovementServiceInstance.turnRight(givenCoordinate);
            expect(returnedDirect).to.equal(newDirection);
            done();
        });

        it('Validate Move Forward to North', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "N" };
            const expectedCoordinate = { "posX": 1, "posY": 2, "direction": "N" };

            const returnedCoordinate = MovementServiceInstance.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
            done();
        });

        it('Validate Move Forward to South', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "S" };
            const expectedCoordinate = { "posX": 1, "posY": 0, "direction": "S" };

            const returnedCoordinate = MovementServiceInstance.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
            done();
        });

        it('Validate Move Forward to West', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "W" };
            const expectedCoordinate = { "posX": 0, "posY": 1, "direction": "W" };

            const returnedCoordinate = MovementServiceInstance.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
            done();
        });

        it('Validate Move Forward to East', function (done) {
            const givenCoordinate = { "posX": 1, "posY": 1, "direction": "E" };
            const expectedCoordinate = { "posX": 2, "posY": 1, "direction": "W" };

            const returnedCoordinate = MovementServiceInstance.moveForward(givenCoordinate);

            expect(returnedCoordinate.posY).to.equal(expectedCoordinate.posY);
            done();
        });

        it('Validate Received instructions', function (done) {
            const instructionSet = "LMRRM";

            MovementServiceInstance.validateReceivedInstructions(instructionSet)
                .then(validationReturn => {
                    expect(validationReturn).to.equal(undefined);

                });

            done();
        });

        it('Validate invalid instructions received', function (done) {
            const instructionSet = "LMXRM";
            const errorMessage = "X is not a valid instruction";

            MovementServiceInstance.validateReceivedInstructions(instructionSet)
                .then(result => {
                    expect(result).to.equal(errorMessage);
                });

            done();
        });


    });
});