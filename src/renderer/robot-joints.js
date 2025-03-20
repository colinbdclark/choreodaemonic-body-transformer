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
    }

    initDefaultModel() {
        // Initialize all keypoints
        for (let i = 0; i < this.homePositions.length; i++) {
            this.model[i] = this.homePositions[i];
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

    update(keypointsModel) {
        for (let i = 0; i < this.mappings.length; i++) {
            let keypointName = this.mappings[i];
            let keypoint = keypointsModel[keypointName];

            if (keypoint) {
                // Scale from frame coordinates to robot stage coordinates,
                // and apply joint limits.
                let robotX = this.bodyToJointX(keypoint.x, JOINT_LIMITS[i].x);
                let robotY = this.bodyToJointY(keypoint.y, JOINT_LIMITS[i].y);
                this.model[i] = [robotX, robotY];
            } else {
                let homePosition = this.homePositions[i];
                this.model[i] = [homePosition[0], homePosition[1]];
            }
        }
    }
};
