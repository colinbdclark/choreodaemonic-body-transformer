export class History {
    constructor() {
        this.startPoints = [
            [0.0, 0.2],
            [0.0, 0.4],
            [0.0, 0.6],
            [-0.4, 0.5],
            [0.4, 0.5],
            [-0.2, 0.8],
            [0.2, 0.8]
        ];
        this.history = Array(10).fill(this.startPoints);
        this.maxLength = 10;
    }

    addKeypoints(robotPoints){
        
    }




    // // old version using keypoints with id, x, y 
    // addKeypoints(keypoints) {
    //     // Filter out keypoints with NaN values and create position records

    //     const validKeypoints = [];
    //     // old version that pushes only when both x and y are valid
    //     // keypoints.forEach(kp => { if (!isNaN(kp.x) && !isNaN(kp.y)) {
    //     //     validKeypoints.push({
    //     //         id: kp.id,
    //     //         x: kp.x,
    //     //         y: kp.y,
    //     //        // timestamp: Date.now(),
    //     // }); 
    //     // }

    //     // new version that pushes either new x and y or if NaN startpoint x and y 
    //     keypoints.forEach(kp => { 
    //         if (!isNaN(kp.x) && !isNaN(kp.y)) {
    //             validKeypoints.push({
    //                         id: kp.id,
    //                         x: kp.x,
    //                         y: kp.y}); 
    //         } else {
    //             validKeypoints.push(this.handleDrops(kp));
    //         }
    //     });

    //     // Add new keypoints to the beginning of the array
    //     this.history.unshift(validKeypoints);

    //     // Keep only the last maxLength entries
    //     if (this.history.length > this.maxLength) {
    //         this.history = this.history.slice(0, this.maxLength);
    //     }

    //     // Add debug console log
    //     console.log('Number of keypoints added:', validKeypoints.length);
    //     console.log('Valid keypoints added:', validKeypoints);

    // }
// old that pushes last valid x and y values
    // handleDrops(droppedKeypoint) {

    //     const lastKeypoints = this.history[0];
    //     const lastKeypoint = lastKeypoints.find(kp => kp.id === droppedKeypoint.id);

    //     // guessed point is just holding on last point for now
    //     if (lastKeypoint) {
    //         const guessedKeypoint = {
    //             id: droppedKeypoint.id,
    //             x: lastKeypoint.x,
    //             y: lastKeypoint.y,
    //         };
    //         console.log('Guessed keypoint:', guessedKeypoint.id);
    //         return guessedKeypoint;
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