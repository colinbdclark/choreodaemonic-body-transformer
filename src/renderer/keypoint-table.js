const NO_KEYPOINT = {
    x: NaN,
    y: NaN
};

export class KeypointTable {
    constructor(keypointNames) {
        this.xRow = document.getElementById("x");
        this.yRow = document.getElementById("y");
        this.keypointNames = keypointNames;
        this.renderHeader();
    }

    renderHeader() {
        let headerRow = document.querySelector("thead tr");
        let headerCellsString = "";

        this.keypointNames.forEach((keypointName) => {
            headerCellsString += `<th>${keypointName}</th>`
        });

        headerRow.innerHTML = headerCellsString;
    }

    cellForValue(value) {
        let valueString = isNaN(value) ? "----" : value.toFixed(2);
        return "<td>" + valueString + "</td>"
    }

    render(keypointsModel) {
        let xChildren = "";
        let yChildren = "";

        for (let i = 0; i < this.keypointNames.length; i++) {
            let keypointName = this.keypointNames[i];
            let keypoint = keypointsModel[keypointName];
            if (!keypoint) {
                keypoint = NO_KEYPOINT
            }

            xChildren += this.cellForValue(keypoint.x);
            yChildren += this.cellForValue(keypoint.y);
        }

        this.xRow.innerHTML = xChildren;
        this.yRow.innerHTML = yChildren;
    }
}
