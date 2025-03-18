import { KeypointCanvas } from "./keypoint-canvas.js";
import { KeypointTable } from "./keypoint-table.js";
import { KeypointSynthesizer } from "./keypoint-synthesizer.js";
import { Keypoints } from "./keypoints.js";
import { RobotJoints } from "./robot-joints.js"
import { RobotMessageFormatter } from "./robot-message-formatter.js";
import { History } from "./keypoint-history.js";
import { MappingsView } from "./mappings-view.js";

let RECIPIENT = {
    ip: "127.0.0.1",
    port: "7600"
};

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

let TEMPORARY_HOME_POSITIONS = [
    [0.0, 0.2],
    [0.0, 0.4],
    [0.0, 0.6],
    [0.4, 0.5],
    [0.4, 0.5],
    [0.2, 0.8],
    [0.2, 0.8]
];

let TEMPORARY_FRAME_TO_ROBOT = {
    scaleX: 6,
    offsetX: -0.5,
    scaleY: 10,
    offset: -1.0
};

let mappingsView = new MappingsView(KEYPOINT_NAMES);
mappingsView.render();

let keypoints = new Keypoints(KEYPOINT_NAMES);
let robotJoints = new RobotJoints(TEMPORARY_HOME_POSITIONS,
    TEMPORARY_FRAME_TO_ROBOT, mappingsView.model);
let robotOSCFormatter = new RobotMessageFormatter();
let keypointCanvas = new KeypointCanvas(document.getElementById("poseCanvas"));
let keypointTable = new KeypointTable(KEYPOINT_NAMES);
let synthesizer = new KeypointSynthesizer();

let history = new History();


function handlePoseMessage(poseMessage, mappingsView) {
    // Update state.
    keypoints.update(poseMessage);
    synthesizer.synthesizeKeypoints(keypoints.model);

    // Update the robot model according to the UI.
    robotJoints.update(keypoints.model);

    // Send joints to the robot.
    let robotMessage = robotOSCFormatter.format(robotJoints.model);
    osc.send(robotMessage, RECIPIENT.ip, RECIPIENT.port);

    // Render the user interface.
    keypointCanvas.render(robotJoints);
    keypointTable.render(keypoints.model);

    // // if we have checked the box to do the selected Robot points, render only those in canvas and history
    // // otherwise render all keypoints
    // if(isSelected){
    //     // Get selected Robot points

    //     history.addKeypoints(selectedRobotpoints);
    // }
    // else{
    //     // TODO: Reduce cost of multiple loops by transforming
    //     // and rendering each keypoint within a single loop.
    //     // Edit: when added select points UI, moved rendering table out of if
    //     history.addKeypoints(keypoints);
    // }
};

osc.onBundle((event, bundle) => {
    // Only read the first pose.
    let poseMessage = bundle.packets[0];
    if (poseMessage) {
        handlePoseMessage(poseMessage, mappingsView);
    }
});
