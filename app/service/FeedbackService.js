class FeedbackService {
    constructor() {

    };

    printLocationFeedback(roverList) {
        console.log("\n######### ROVER CURRENT LOCATION ############");
        for (let indexer = 0; indexer < roverList.length; indexer++) {
            const rover = roverList[indexer];
            console.log(`${indexer} - ${rover.name}: \nX:${rover.coordinate.posX} \nY:${rover.coordinate.posY} \nDirection: ${rover.coordinate.direction}`);
            console.log("________________________\n")
        }
        console.log("#############################################\n");
    }
}
module.exports = FeedbackService;