const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("node:path");
const UDPManager = require("./main/udp-manager.js");
const AndreOSC = require("./main/andre-osc.js");

let udp = new UDPManager();
let andre = new AndreOSC();

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

        andre.send(message);
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
