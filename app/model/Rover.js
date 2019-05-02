class Rover {
    constructor(index) {
        this.name = "Rover" + index;
        this.coordinate = {
            posX: 0,
            posY: 0,
            direction: 'N'
        };
    }

}

module.exports = Rover;