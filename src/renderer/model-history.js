export class History {
    constructor(maxLength = 1) {
        this.maxLength = Math.max(1, maxLength); // Ensure minimum length of 1
        this.history = [];
    }

    // Add new model data to history
    push(model) {
        this.history.push(model);

        // Remove oldest entries if exceeding maxLength
        while (this.history.length > this.maxLength) {
            this.history.shift();
        }
    }

    // Get the most recent model data
    getCurrentState() {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }

    // Get the entire history array
    getHistory() {
        return [...this.history]; // Return a copy to prevent direct modification
    }

    // Clear the history
    clear() {
        this.history = [];
    }

    // Get the length of current history
    getLength() {
        return this.history.length;
    }
}