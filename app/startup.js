const Reader = require('./input/Reader')
const TerrainService = require('./service/TerrainService')
const RoverService = require("./service/RoverService")
const FeedbackService = require("./service/FeedbackService")
const MovementService = require("./service/MovementService")


const ReaderInstance = new Reader();
const TerrainServiceInstance = new TerrainService(ReaderInstance);
const FeedbackServiceInstance = new FeedbackService();
const RoverServiceInstance = new RoverService(ReaderInstance);
const MovementServiceInstance = new MovementService(ReaderInstance);

let terrain = {};
let roverList = [];


const prepareTerrain = () => {
    TerrainServiceInstance.read().then((terrainResponse) => {
        terrain = terrainResponse;
        prepareRovers();

    }).catch(err => {
        console.log(err)
        prepareTerrain();
    });

};

const prepareRovers = () => {
    RoverServiceInstance.createRovers().then((roverlistResponse) => {
        roverList = roverlistResponse;
        launchRovers();

    }).catch(err => {
        console.log(err)
        prepareRovers();
    })
};

const launchRovers = () => {
    RoverServiceInstance.launchRovers(roverList, terrain)
        .then((launchedRoversResponse) => {
            roverList = launchedRoversResponse;

            nextAction();

        }).catch(err => {
            console.log(err);
            launchRovers();
        })

};

let nextAction = () => {
    const label = "\nNext Action:\n1 - Move a rover\n2 - View rovers location\n3 - Quit\n";

    ReaderInstance.read(label).then(response => {
        switch (response) {
            case '1':
                MovementServiceInstance.moveRover(roverList, terrain)
                    .then(updatedRoverList => {
                        roverList = updatedRoverList;
                        nextAction();

                    }).catch(err => {
                        console.log(err);
                        nextAction();
                    });
                break

            case '2':
                FeedbackServiceInstance.printLocationFeedback(roverList);
                nextAction();
                break

            case '3':
                exit();

            default:
                console.log("Invalid option, try again");
                nextAction();
                break;
        }

    }).catch(err => {
        console.log(err);
    })
}

let exit = () => {
    console.log("### NASA Rover initiative completed shutdown successfuly! ###")
    process.exit(0);
}

prepareTerrain();