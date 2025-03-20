export class RobotMessageFormatter {
    constructor() {}

    format(robotModel) {
        let args = [];

        for (let i = 0; i < robotModel.length; i++) {
            // Flatten x/y pairs into a single array of args.
            args.push({
                type: "f",
                value: robotModel[i][0]
            });

            args.push({
                type: "f",
                value: robotModel[i][1]
            });
        }

        return {
            address: "/joints",
            args: args
        }
    }
}
