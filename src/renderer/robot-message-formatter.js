export class RobotMessageFormatter {
    constructor() {}

    format(robotModel) {
        let args = [];
        for (let i = 0; i < robotModel.length; i++) {
            args.push(
                {
                    type: "f",
                    value: robotModel[i][0]
                },
                {
                    type: "f",
                    value: robotModel[i][1]
                }
            );
        }

        return {
            address: "/joints",
            args: args
        }
    }
}
