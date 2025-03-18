export class KeypointCanvas {
    constructor(container) {
        this.container = container;
        this.ctx = container.getContext("2d");
    }

    jointLabel(keypointName, robotJoint) {
        let xStr = robotJoint[0].toFixed(3);
        let yStr = robotJoint[1].toFixed(3);

        return `${keypointName} (${xStr}, ${yStr})`
    }

    render(robotJoints) {
        let width = this.container.width;
        let height = this.container.height;
        this.ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < robotJoints.model.length; i++) {
            let robotJoint = robotJoints.model[i];
            const canvasX = robotJoint[0] * width;
            const canvasY = robotJoint[1] * height;

            // Draw keypoint circle
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.fillStyle = "gray";
            this.ctx.font = "14px Arial";

            // Offset text slightly
            let keypointName = robotJoints.mappings[i];
            let jointLabel = this.jointLabel(keypointName, robotJoint);
            this.ctx.fillText(jointLabel, canvasX + 8, canvasY - 8);
        }
    }
}
