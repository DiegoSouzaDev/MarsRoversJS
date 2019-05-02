const readline = require('readline');

class Reader {
    constructor() {
        this.readerCallback;
        this.lineReader = readline.createInterface(
            process.stdin,
            process.stdout
        );
    }

    read(label) {
        return new Promise((resolve, reject) => {
            this.lineReader.question(label, answer => {
                if (!answer) {
                    reject("Answer not found");
                }
                resolve(answer);
            });
        });
    }

    splitLine(line) {
        return new Promise((resolve, reject) => {
            try {
                resolve(line.split(" "));

            } catch (error) {
                reject(`Error parsing command line: ${error}`);
        
            }
        });
    }

    close() {
        this.lineReader.close();
    }

}

module.exports = Reader; 