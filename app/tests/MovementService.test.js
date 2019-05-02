const MovimentService = require('../service/MovementService');

const test = turnLeftTest('Testing turn to left with a giving coordinate', () =>{
    let givenCoordinate = {"posX":1, "posY": 1, "direction": "N"};
    let coordinate = {"posX":1, "posY": 1, "direction": "W"};
    expect(turnLeft(givenCoordinate)).toBe(coordinate);

});