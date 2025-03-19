export class KeypointSynthesizer {
    constructor () {}

    midpointBetwenValues(a, b) {
        return (a + b) / 2;
    }

    midpointBetweenKeypoints(keypointA, keypointB) {
         let togo = {
            x: this.midpointBetwenValues(keypointA.x, keypointB.x),
            y: this.midpointBetwenValues(keypointA.y, keypointB.y)
         };

         return togo;
    }

    synthesizeKeypoints(keypointsModel) {
        // TODO: Move this out into a declarative structure
        // so that we can define other types of keypoint synthesis.
        let shoulderLeft = keypointsModel["shoulder left"];
        let shoulderRight = keypointsModel["shoulder right"];
        if (shoulderLeft && shoulderRight) {
            keypointsModel["neck"] = this.midpointBetweenKeypoints(
                shoulderLeft, shoulderRight);
        }

        let hipLeft = keypointsModel["hip left"];
        let hipRight = keypointsModel["hip right"];
        if (hipLeft && hipRight) {
            keypointsModel["pelvis"] = this.midpointBetweenKeypoints(
                hipLeft, hipRight);
        }
    }
}
