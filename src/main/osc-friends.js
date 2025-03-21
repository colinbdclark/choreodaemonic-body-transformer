const osc = require("osc");

class OSCFriends {
    constructor(recipients) {
        this.recipients = recipients;
        this.isReady = false;

        this.udpPort = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort: 7401
        });

        let self = this;
        this.udpPort.on("ready", () => {
            self.isReady = true;
        });

        this.udpPort.on("error", (e) => {
            console.log("Error sending OSC: " + e);
        });

        this.udpPort.open();
    }

    send(message) {
        if (this.isReady) {
            for (let recipient of this.recipients) {
                this.udpPort.send(message, recipient.address, recipient.port);
            }
        }
    }
};

module.exports = OSCFriends;
