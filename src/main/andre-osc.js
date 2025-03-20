const osc = require("osc");

// FIXME: This class should be refactored to manage multiple OSC
// clients.
class AndreOSC {
    constructor() {
        let isReady = false;

        this.udpPort = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort: 7401,
            remoteAddress: "192.168.0.234",
            remotePort: 7400
        });

        let self = this;
        this.udpPort.on("ready", () => {
            self.isReady = true;
            isReady = true;
        });

        this.udpPort.on("error", (e) => {
            console.log("Error sending OSC to Andre: " + e);
        });

        this.udpPort.open();
    }

    send(message) {
        if (this.isReady) {
            this.udpPort.send(message);
        }
    }
};

module.exports = AndreOSC;
