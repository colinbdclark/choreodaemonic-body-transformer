import { KeypointCanvas } from "./keypoint-canvas.js";
import { KeypointTable } from "./keypoint-table.js";
import { KeypointSynthesizer } from "./keypoint-synthesizer.js";
import { History } from "./keypoint-history.js";
import { RobotpointSelector } from "./robotpoint-selector.js";


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

//plan from Sunday, March 16th 
// let selectedKeypoints = []; // names or ids of selected keypoints
// let selectedBody = []; // array of selected keypoints and their x, y values and drop selectedKeypoint if NaN 
// let history = []; // array of selectedBody 

let keypointCanvas = new KeypointCanvas(document.getElementById("poseCanvas"));
let keypointTable = new KeypointTable(KEYPOINT_NAMES);
let synthesizer = new KeypointSynthesizer();

let history = new History();
let robotpointSelector = new RobotpointSelector(KEYPOINT_NAMES);

let isSelected = false;

document.getElementById("selectedCheck").addEventListener("change", (event) => {
    isSelected = event.target.checked;
});


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
    
    // always show all keypoints in table (state of the world)
    keypointTable.render(keypoints);

    // if we have checked the box to do the selected Robot points, render only those in canvas and history
    // otherwise render all keypoints 
    if(isSelected){
        // Get selected Robot points
        let selectedRobotpoints = robotpointSelector.getSelectedKeypoints(keypoints);

        keypointCanvas.render(selectedRobotpoints);
        history.addKeypoints(selectedRobotpoints);
    }
    else{
        // TODO: Reduce cost of multiple loops by transforming
        // and rendering each keypoint within a single loop.
        // Edit: when added select points UI, moved rendering table out of if
        keypointCanvas.render(keypoints);
        history.addKeypoints(keypoints);
    }

});
