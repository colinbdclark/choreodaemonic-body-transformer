export class History {
    constructor() {
        this.history = [];
        this.maxLength = 10;
    }

    addKeypoints(keypoints) {
        // Filter out keypoints with NaN values and create position records

        const validKeypoints = [];
        keypoints.forEach(kp => { if (!isNaN(kp.x) && !isNaN(kp.y)) {
            validKeypoints.push({
                id: kp.id,
                x: kp.x,
                y: kp.y,
                timestamp: Date.now(),
        }); 
    }

            // if (!isNaN(kp.x) && !isNaN(kp.y)) {
            // validKeypoints.push({
            //     id: kp.id,
            //     x: kp.x,
            //     y: kp.y,
            //     timestamp: Date.now(),
            //     count: 0
            // });
            // } else {
            //     if(this.handleDrops(kp)){
            //         validKeypoints.push(this.handleDrops(kp));
            //     }
            // }
        });

        // Add new keypoints to the beginning of the array
        this.history.unshift(validKeypoints);

        // Keep only the last maxLength entries
        if (this.history.length > this.maxLength) {
            this.history = this.history.slice(0, this.maxLength);
        }

        // Add debug console log
        console.log('Number of keypoints added:', validKeypoints.length);
        console.log('Valid keypoints added:', validKeypoints);

    }

    // handleDrops(droppedKeypoint) {

    //     //added a count to see how many times the keypoint is dropped
    //     //if the keypoint is dropped 5 times, it will be removed from the history
    //     //if the keypoint is dropped less than 5 times, it will be guessed based on the last known position
    //     let count = this.history[0][droppedKeypoint.id].count += 1;

    //     if (count < 5) {
    //         const historyLength = this.history.length;
    //         if (historyLength > 0) {
    //             const lastKeypoints = this.history[0];
    //             const lastKeypoint = lastKeypoints.find(kp => kp.id === droppedKeypoint.id);

    //             // guessed point is just holding on last point for now
    //             if (lastKeypoint) {
    //                 const guessedKeypoint = {
    //                     id: droppedKeypoint.id,
    //                     x: lastKeypoint.x,
    //                     y: lastKeypoint.y,
    //                     timestamp: Date.now(),
    //                     count: count
    //                 };
    //                 console.log('Guessed keypoint:', guessedKeypoint.id);
    //                 return guessedKeypoint;
    //             }
    //         }
    //     }
    //     return;
    // }

    getHistory() {
        return this.history;
    }

    getCurrent() {
        return this.history.length > 0 ? this.history[0] : [];
    }

    clear() {
        this.history = [];
    }
}