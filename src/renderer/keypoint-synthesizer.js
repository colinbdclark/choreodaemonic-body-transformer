export class KeypointSynthesizer {
    constructor () {}

    isValidKeypoint(keypoint) {
        if (!keypoint) {
            return false;
        }

        if (isNaN(keypoint.x) || isNaN(keypoint.y)) {
            return false;
        }

        return true;
    }

    midpointBetwenValues(a, b) {
        return (a + b) / 2;
    }

    midpointBetweenKeypoints(keypointA, keypointB) {
        if (!this.isValidKeypoint(keypointA) ||
            !this.isValidKeypoint(keypointB)) {
            // At least one of the keypoints wasn't detected,
            // so we can't determine a midpoint.
            return {
                x: NaN,
                y: NaN
            };
         }

         let togo = {
            x: this.midpointBetwenValues(keypointA.x, keypointB.x),
            y: this.midpointBetwenValues(keypointA.y, keypointB.y)
         };

         return togo;
    }

    synthesizeKeypoints(keypoints) {
        // TODO: Move this out into a declarative structure
        // so that we can define other types of keypoint synthesis.
        let neck = this.midpointBetweenKeypoints(keypoints[5],
            keypoints[6]);
        neck.id = "neck";

        let pelvis = this.midpointBetweenKeypoints(keypoints[11],
            keypoints[12]);
        pelvis.id = "pelvis";

        let synthesizedKeypoints = [neck, pelvis];

        return synthesizedKeypoints;
    }
}
