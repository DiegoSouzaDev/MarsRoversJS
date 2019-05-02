const assert = require('assert');
const expect = require('chai').expect;
const MovementService = require('../app/service/MovementService');
const Reader = require('../app/input/Reader');

const MovementServiceInstance = new MovementService(new Reader);

describe('Nasa Rover Initiavive test', () => {

    describe('MovemenService Test', () => {
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

    });
});