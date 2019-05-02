class MovementService {
    constructor(reader) {
        this.reader = reader;
        this.validInstructions = "LRM";
    }

    moveRover(roverList, terrain) {
        return new Promise(async (resolve, reject) => {
            let roverNumber;
            let instructionLine;

            try {
                roverNumber = await this.reader.read("Type the rover (by number) that you want to move: ");
                
                if (isNaN(roverNumber)) {
                    return reject(`${roverNumber} is not a number.\n`);
                }
                if ((roverNumber > roverList.length -1)) {
                    return reject(`there is no Rover${roverNumber} on the roverList. Consult your rovers and trt again\n`);
                }

                instructionLine = await this.reader.read("Type the movement instructions (L, R or M. Ex:LMMRM): ");
                
            } catch (error) {
                return reject(`Error reading instructions: ${error}`);

            }

            const instructionSet = instructionLine.trim().toUpperCase();

            let errorMessage = await this.validateReceivedInstructions(instructionSet);

            if (errorMessage) {
                return reject(errorMessage);
            }

            let currentCoordinate = Object.assign({}, roverList[roverNumber].coordinate);

            for (let i = 0; i < instructionSet.length; i++) {
                let instruction = instructionSet[i];
                switch (instruction) {
                    case 'M':
                        if (!this.isValidMovement(currentCoordinate, terrain)) {
                            return reject("Invalid movement, you can't move outside of the terrain")
                        };

                        currentCoordinate = this.moveForward(currentCoordinate);
                        break;

                    case 'L':
                        currentCoordinate.direction = this.turnLeft(currentCoordinate);
                        break;

                    case 'R':
                        currentCoordinate.direction = this.turnRight(currentCoordinate);
                        break;
                }
            }

            roverList[roverNumber].coordinate = currentCoordinate;
            console.log("Rover moved successfuly");

            resolve(roverList);
        });
    }

    async validateReceivedInstructions(instructionSet) {
        for (let i = 0; i < instructionSet.length; i++) {
            if (!this.validInstructions.includes(instructionSet[i])) {
                return `${instructionSet[i]} is not a valid instruction`;
            }
        }
        return
    }

    isValidMovement(currentCoordinate, terrain) {
        let isValid;
        switch (currentCoordinate.direction) {
            case 'N':
                isValid = currentCoordinate.posY + 1 <= terrain.maxPositionY;
                break;
            case 'S':
                isValid = currentCoordinate.posY - 1 >= 0;
                break;
            case 'E':
                isValid = currentCoordinate.posX + 1 <= terrain.maxPositionX;
                break;
            case 'W':
                isValid = currentCoordinate.posX - 1 >= 0;
                break;
            default:
                isValid = false;
                break;
        }
        return isValid;
    }

    moveForward(currentCoordinate) {
        switch (currentCoordinate.direction) {
            case 'N':
                currentCoordinate.posY++;
                break;
            case 'E':
                currentCoordinate.posX++;
                break;
            case 'S':
                currentCoordinate.posY--;
                break;
            case 'W':
                currentCoordinate.posX--;
                break;
        }
        return currentCoordinate;
    }

    turnLeft(currentCoordinate) {
        let pointTo;
        switch (currentCoordinate.direction) {
            case 'N':
                pointTo = 'W';
                break;
            case 'W':
                pointTo = 'S';
                break;
            case 'S':
                pointTo = 'E';
                break;
            case 'E':
                pointTo = 'N';
                break;
        }
        return pointTo;
    }

    turnRight(currentCoordinate) {
        let pointTo;
        switch (currentCoordinate.direction) {
            case 'N':
                pointTo = 'E';
                break;
            case 'E':
                pointTo = 'S';
                break;
            case 'S':
                pointTo = 'W';
                break;
            case 'W':
                pointTo = 'N';
                break;
        }
        return pointTo;
    }


}
module.exports = MovementService;