import { KeypointCanvas } from "./keypoint-canvas.js";
import { KeypointTable } from "./keypoint-table.js";

let keypointCanvas = new KeypointCanvas(document.getElementById("poseCanvas"));
let keypointTable = new KeypointTable()

osc.onBundle((event, bundle) => {
    // Only read the first pose.
    let poseMessage = bundle.packets[0];
    let keypoints = [];

    for (let i = 0; i < poseMessage.args.length; i++) {
        let keypoint = poseMessage.args[i];

        keypoints.push({
            id: i,
            x: keypoint[0].value,
            y: keypoint[1].value,
            z: keypoint[2].value
        });
    }

    // TODO: Reduce cost of multiple loops by transforming
    // and rendering each keypoint within a single loop.
    keypointCanvas.render(keypoints);
    keypointTable.render(keypoints);
});
