import { KeypointCanvas } from "./keypoint-canvas.js";
import { KeypointTable } from "./keypoint-table.js";
import { KeypointSynthesizer } from "./keypoint-synthesizer.js";
import { Keypoints } from "./keypoints.js";
import { RobotJoints } from "./robot-joints.js"
import { RobotMessageFormatter } from "./robot-message-formatter.js";
import { MappingsView } from "./mappings-view.js";
import { TextField } from "./text-field.js";
import { PlayButton } from "./play-button.js";

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

let HOME_POSITIONS = [
    [-1.37, 0.0],
    [-0.70, 0.0],
    [-0.60, 0.0],
    [0.0, 0.0],
    [0.60, 0.0],
    [0.70, 0.0],
    [1.37, 0.0]
];

let FRAME_TO_ROBOT = {
    scaleX: 2,
    offsetX: -0.5,
    scaleY: 2.0,
    offsetY: 1.0
};

let mappingsView = new MappingsView(KEYPOINT_NAMES);
mappingsView.render();

let keypoints = new Keypoints(KEYPOINT_NAMES);
let robotJoints = new RobotJoints(HOME_POSITIONS,
    FRAME_TO_ROBOT, mappingsView.model);
let robotOSCFormatter = new RobotMessageFormatter();
let keypointCanvas = new KeypointCanvas(
    document.getElementById("poseCanvas"), FRAME_TO_ROBOT);
let keypointTable = new KeypointTable(KEYPOINT_NAMES);
let synthesizer = new KeypointSynthesizer();
let addressField = new TextField(document.getElementById("address"));
let portField = new TextField(document.getElementById("port"));
let playButton = new PlayButton(document.getElementById("playButton"), true);

function handlePoseMessage(xMessage, yMessage, mappingsView) {
    // Update keypoint and generate synthetic keypoints.
    keypoints.update(xMessage, yMessage);
    synthesizer.synthesizeKeypoints(keypoints.model);

    // Update the robot model according to the UI.
    robotJoints.update(keypoints.model);

    // Send joints to the robot and UI canvas if not paused.
    let robotMessage = robotOSCFormatter.format(robotJoints.model);

    if (playButton.isPlaying){
        osc.send(robotMessage, addressField.value, Number(portField.value));
        keypointCanvas.render(robotJoints);
    }

    keypointTable.render(keypoints.model);
};

osc.onBundle((event, bundle) => {
    // Only read x and y from the first pose, if there is one.
    if (bundle.packets.length < 2) {
        return;
    }

    let xMessage = bundle.packets[0];
    let yMessage = bundle.packets[1];
    handlePoseMessage(xMessage, yMessage, mappingsView);
});
