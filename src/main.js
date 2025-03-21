const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("node:path");
const UDPManager = require("./main/udp-manager.js");
const OSCFriends = require("./main/osc-friends.js");

let RECIPIENTS = [
    {
        // Andre
        address: "192.168.0.198",
        port: 7400
    },
    {
        // Carlos
        address: "192.168.0.165",
        port: 1235
    }
];

let udp = new UDPManager();
let friends = new OSCFriends(RECIPIENTS);

const createWindow = () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "main/preload.js")
        }
    });

    win.setBackgroundColor("#000000");
    win.loadFile("src/renderer/index.html");
    win.maximize();

    return win;
}

app.whenReady().then(() => {
    let mainWindow = createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createWindow();
        }
    });

    ipcMain.handle("send", async (event, message, ip, port) => {
        udp.sender.send(message, ip, port);

        friends.send(message);
    });

    udp.listener.on("bundle", (message) => {
        mainWindow.webContents.send("osc-bundle", message);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
