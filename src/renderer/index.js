import { KeypointCanvas } from "./keypoint-canvas.js";
import { KeypointTable } from "./keypoint-table.js";
import { KeypointSynthesizer } from "./keypoint-synthesizer.js";

const KEYPOINT_NAMES = [
    "nose",
    "eye left",
    "eye right",
    "ear left",
    "ear right",
    "shoulder left",
    "shoulder right",
    "elbow left",
    "elbow right",
    "wrist left",
    "wrist right",
    "hip left",
    "hip right",
    "knee left",
    "knee right",
    "ankle left",
    "ankle right",
    "inner eye left",
    "outer eye left",
    "inner eye right",
    "outer eye right",
    "mouth left",
    "mouth right",
    "pinky left",
    "pinky right",
    "index left",
    "index right",
    "thumb left",
    "thumb right",
    "heel left",
    "heel right",
    "foot left",
    "foot right",
    "neck",
    "pelvis"
];

let keypointCanvas = new KeypointCanvas(document.getElementById("poseCanvas"));
let keypointTable = new KeypointTable(KEYPOINT_NAMES);
let synthesizer = new KeypointSynthesizer();

osc.onBundle((event, bundle) => {
    // Only read the first pose.
    let poseMessage = bundle.packets[0];
    let keypoints = [];

    for (let i = 0; i < poseMessage.args.length; i++) {
        let keypoint = poseMessage.args[i];

        keypoints.push({
            id: KEYPOINT_NAMES[i],
            x: keypoint[0].value,
            y: keypoint[1].value,
            z: keypoint[2].value
        });
    }

    let synthesizedKeypoints = synthesizer.synthesizeKeypoints(keypoints);
    keypoints.push(...synthesizedKeypoints);

    // TODO: Reduce cost of multiple loops by transforming
    // and rendering each keypoint within a single loop.
    keypointCanvas.render(keypoints);
    keypointTable.render(keypoints);
});
