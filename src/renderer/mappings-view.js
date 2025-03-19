const NUM_JOINTS = 7;
const UNSELECTED = "";

export class MappingsView {
    constructor(keypointNames) {
        this.keypointNames = keypointNames;
        this.model = Array(NUM_JOINTS);
        this.model.fill(UNSELECTED);
        this.optionValues = [UNSELECTED].concat(keypointNames);
        this.render();
    }

    bindSelectListener(select, jointIdx) {
        select.onchange = (event) => {
            let keypointName = event.target.value;
            this.model[jointIdx] = keypointName;
        };
    }

    renderOptions(select) {
        let optionsHTMLStr = "";

        this.optionValues.forEach((optionValue) => {
            optionsHTMLStr += `<option value="${optionValue}">${optionValue}</option>`;
        });

        select.innerHTML = optionsHTMLStr;
    }

    render() {
        let selects = document.querySelectorAll(".robotpoint-select");
        selects.forEach((select, jointIdx) => {
            this.bindSelectListener(select, jointIdx);
            this.renderOptions(select);
        });
    }
};
