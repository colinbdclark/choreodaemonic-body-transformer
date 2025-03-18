export class RobotpointSelector {
    constructor(keypointNames) {
        this.keypointNames = keypointNames;
        this.selectedIds = new Array(7).fill(null);
        this.selectors = document.querySelectorAll('.robotpoint-select');
        this.initializeSelectors();
    }

    initializeSelectors() {
        this.selectors.forEach((select, index) => {
            // Clear existing options
            select.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a keypoint';
            select.appendChild(defaultOption);
            
            // Add keypoint options
            this.keypointNames.forEach((name, id) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = `${id}: ${name}`;
                select.appendChild(option);
            });

            // Add change listener
            select.addEventListener('change', (event) => {
                this.selectedIds[index] = event.target.value !== '' ? 
                    parseInt(event.target.value) : null;
            });
        });
    }

    getSelectedKeypoints(currentKeypoints) {
        // Filter only selected keypoints
        return this.selectedIds
            .filter(id => id !== null)
            .map(id => {
                const keypoint = currentKeypoints.find(kp => kp.id === this.keypointNames[id]);
                return keypoint ? {
                    id: keypoint.id,
                    x: keypoint.x,
                    y: keypoint.y
                } : null;
            });
    }
}