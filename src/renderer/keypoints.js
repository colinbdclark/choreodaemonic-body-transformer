export class Keypoints {
    constructor(keypointNames) {
        /*
            {
                "nose": {
                    x: 0.2,
                    y: 0.7
                },

                "left elbow": {
                    x: 0.0,
                    y: 0.92
                }
            }
         */
        this.model = {};
        this.keypointNames = keypointNames;
    }

    isValidKeypoint(x, y) {
        if (isNaN(x) || isNaN(y)) {
            return false;
        }

        return true;
    }

    update(poseMessage) {
        for (let i = 0; i < poseMessage.args.length; i++) {
            let keypointCoordinates = poseMessage.args[i];
            let keypointName = this.keypointNames[i];
            let x = 1.0 - keypointCoordinates[0].value;
            let y = keypointCoordinates[1].value;
            let keypoint = {
                x: x,
                y: y
            };

            if (this.isValidKeypoint(x, y)) {
                this.model[keypointName] = {
                    x: x,
                    y: y
                }
            }
        }
    }
}
