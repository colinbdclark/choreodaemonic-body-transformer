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

    update(xMessage, yMessage) {
        // Read MovementOSC's “Bundled Message Per Axis” format
        for (let i = 0; i < xMessage.args.length; i++) {
            let messageX = xMessage.args[i].value;
            let messageY = yMessage.args[i].value;
            let keypointName = this.keypointNames[i];
            if (this.isValidKeypoint(messageX, messageY)) {
                this.model[keypointName] = {
                    x: 1 - messageX,
                    y: messageY
                }
            }
        }
    }
}
