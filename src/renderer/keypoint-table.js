export class KeypointTable {
    constructor() {
        this.xRow = document.getElementById("x");
        this.yRow = document.getElementById("y");
        this.zRow = document.getElementById("z");
    }

    cellForValue(value) {
        let valueString = isNaN(value) ? "----" : value.toFixed(2);
        return "<td>" + valueString + "</td>"
    }

    render(keypoints) {
        let xChildren = "";
        let yChildren = "";
        let zChildren = "";

        for (let i = 0; i < keypoints.length; i++) {
            let keypoint = keypoints[i];

            xChildren += this.cellForValue(keypoint.x);
            yChildren += this.cellForValue(keypoint.y);
            zChildren += this.cellForValue(keypoint.z);
        }

        this.xRow.innerHTML = xChildren;
        this.xRow.innerHTML = yChildren;
        this.zRow.innerHTML = zChildren;
    }
}
