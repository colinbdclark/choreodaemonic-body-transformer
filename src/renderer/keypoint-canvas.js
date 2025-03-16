export class KeypointCanvas {
    constructor(container) {
        this.container = container;
        this.ctx = container.getContext("2d");
    }

    keypointLabel(keypoint) {
        let xStr = keypoint.x.toFixed(3);
        let yStr = keypoint.y.toFixed(3);
        let id = keypoint.id;

        return `${id} (${xStr}, ${yStr})`
    }

    render(keypoints) {
        let width = this.container.width;
        let height = this.container.height;

        this.ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < keypoints.length; i++) {
            let keypoint = keypoints[i];
            const canvasX = keypoint.x * width;
            const canvasY = keypoint.y * height;

            // Draw keypoint circle
            this.ctx.beginPath();
            this.ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.closePath();

            // Draw ID label next to the keypoint
            this.ctx.fillStyle = "gray";
            this.ctx.font = "14px Arial";
            // Offset text slightly
            this.ctx.fillText(this.keypointLabel(keypoint),
                canvasX + 8, canvasY - 8);
        }
    }
}
