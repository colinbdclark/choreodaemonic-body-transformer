const LOG0_001 = -6.907755278982137;

export class LPF {
    constructor(time, sampleRate, initialValue) {
        this.time = time;
        this.sampleRate = sampleRate;
        this.coeff = this.calculateCoefficient();
        this.previous = initialValue !== undefined ? initialValue : 0.0;
    }

    calculateCoefficient() {
        return Math.exp(LOG0_001 / (this.time * this.sampleRate));
    }

    smooth(current) {
        let smoothed = current + this.coeff * (this.previous - current);
        this.previous = smoothed;

        return smoothed;
    }
};
