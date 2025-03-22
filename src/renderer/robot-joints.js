import { LPF } from './lpf.js';

const FRAME_RATE = 50;
const LAG_TIME = 1.0;

const JOINT_LIMITS = [
    {
        x: {
            min: -2.97,
            max: 0.23
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -2.51,
            max: 0.67
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -2.06,
            max: 1.14
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -1.6,
            max: 1.6
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -1.14,
            max: 2.06
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -0.67,
            max: 2.51
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    },
    {
        x: {
            min: -0.23,
            max: 2.97
        },
        y: {
            min: 0.0,
            max: 3.05
        }
    }
];

let STICK_LENGTHS_METERS = [
    1.3,
    1.3
];

// Map two body parts to two robot joints
let STICKS = [
    [1, 5],
    [2, 4]
];

let FREE_JOINTS = [0, 3, 6];

function limitJoint(jointAxisValue, jointLimit) {
    if (jointAxisValue < jointLimit.min) {
        jointAxisValue = jointLimit.max;
    } else if (jointAxisValue > jointLimit.max) {
        jointAxisValue = jointLimit.max;
    }

    return jointAxisValue;
}

export class RobotJoints {
    constructor(homePositions, scaling, mappings) {
        /*
            [
                [0.2, 0.7],
                [0.0, 0.92]
            ]
        */
        this.model = [];
        this.homePositions = homePositions;
        this.scaling = scaling;

        /*
            [
                "nose",
                "left elbow",
                "left knee"
                ...
                "right foot"
            ]
        */
        this.mappings = mappings;
        this.initDefaultModel();
        this.initFilters();
    }

    initDefaultModel() {
        // Initialize all keypoints
        for (let i = 0; i < this.homePositions.length; i++) {
            this.model[i] = this.homePositions[i];
        }
    }

    initFilters() {
        this.filters = [];

        for (let i = 0; i < this.model.length; i++) {
            this.filters[i] = {
                x: new LPF(LAG_TIME, FRAME_RATE, this.model[i][0]),
                y: new LPF(LAG_TIME, FRAME_RATE, this.model[i][1])
            };
        }
    }

    bodyToJointX(keypointX, jointLimit) {
        let jointX = (keypointX + this.scaling.offsetX) *
            this.scaling.scaleX;

        return limitJoint(jointX, jointLimit);
    }

    bodyToJointY(keypointY, jointLimit) {
        let jointY = (this.scaling.offsetY - keypointY) *
            this.scaling.scaleY;

        return limitJoint(jointY, jointLimit);
    }

    bodyToJointTransform(keypoint, jointIndex) {
        if (!keypoint) {
            return this.sendToHomePosition(jointIndex);
        }

        let robotX = this.bodyToJointX(keypoint.x,
            JOINT_LIMITS[jointIndex].x);
        let robotY = this.bodyToJointY(keypoint.y,
            JOINT_LIMITS[jointIndex].y);

        return [robotX, robotY];
    }

    sendToHomePosition(jointIndex) {
        let homePosition = this.homePositions[jointIndex];
        return [homePosition[0], homePosition[1]];
    }

    handleFreeJoint(keypoint, jointIndex) {
        this.model[jointIndex] = this.bodyToJointTransform(keypoint,
            jointIndex);
    }

    keypointForJointIdx(keypointsModel, jointIdx) {
        let keypointName = this.mappings[jointIdx];
        let keypoint = keypointsModel[keypointName];

        return keypoint;
    }

    filterModel() {
        // Low pass filter the model.
        for (let i = 0; i < this.filters.length; i++) {
            let filterPair = this.filters[i];
            let filterX = filterPair.x;
            let filterY = filterPair.y;

            this.model[i][0] = filterX.smooth(this.model[i][0]);
            this.model[i][1] = filterY.smooth(this.model[i][1]);
        }
    }

    update(keypointsModel) {
        for (let jointIdx of FREE_JOINTS) {
            let keypoint = this.keypointForJointIdx(keypointsModel, jointIdx);
            this.handleFreeJoint(keypoint, jointIdx);
        }

        for (let stickIdx = 0; stickIdx < STICKS.length; stickIdx++) {
            let stick = STICKS[stickIdx];
            let joint1Index = stick[0];
            let joint2Index = stick[1];

            let keypoint1 = this.keypointForJointIdx(keypointsModel,
                joint1Index);
            let keypoint2 = this.keypointForJointIdx(keypointsModel,
                joint2Index);

            let joint1 = this.bodyToJointTransform(keypoint1, joint1Index);
            let joint2 = this.bodyToJointTransform(keypoint2, joint2Index);

            let stickLength = STICK_LENGTHS_METERS[stickIdx];
            let magnitude = this.magnitude(joint1, joint2);

            // Always constrain stick points to the length of the object
            // that is attaching them.
            let transformedStick = this.pointsToStickTransform(joint1, joint2,
                stickLength);
            this.model[joint1Index] = transformedStick[0];
            this.model[joint2Index] = transformedStick[1];

            // Only constrain the two points if the distance between points
            // is further away than the length of what's attaching them.
            // if (magnitude > stickLength) {
            //     let transformedStick = this.pointsToStickTransform(joint1, joint2,
            //         stickLength);
            //     this.model[joint1Index] = transformedStick[0];
            //     this.model[joint2Index] = transformedStick[1];
            // } else {
            //     this.handleFreeJoint(keypoint1, joint1Index);
            //     this.handleFreeJoint(keypoint2, joint2Index);
            // }
        }

        this.filterModel();
    }

    midpoint(point1, point2) {
        return [
            (point1[0] + point2[0]) / 2,
            (point1[1] + point2[1]) / 2
        ];
    }

    magnitude(point1, point2) {
        let dx = point2[0] - point1[0];
        let dy = point2[1] - point1[1];
        let magnitude = Math.sqrt(dx * dx + dy * dy);

        return magnitude;
    }

    unitVector(point1, point2) {
        let dx = point2[0] - point1[0];
        let dy = point2[1] - point1[1];
        let magnitude = Math.sqrt(dx * dx + dy * dy);

        return [dx / magnitude, dy / magnitude];
    }

    pointsToStickTransform(point1, point2, stickLength) {
        let midpoint = this.midpoint(point1, point2);
        let unitVector = this.unitVector(point1, point2);
        let halfStickLength = stickLength / 2.0;

        let aX = midpoint[0] - halfStickLength * unitVector[0];
        let aY = midpoint[1] - halfStickLength * unitVector[1];
        let bX = midpoint[0] + halfStickLength * unitVector[0];
        let bY = midpoint[1] + halfStickLength * unitVector[1];

        return [
            [
                aX,
                aY
            ],
            [
                bX,
                bY
            ]
        ];
    }
};
