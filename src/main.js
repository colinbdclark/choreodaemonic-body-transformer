const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("node:path");
const UDPManager = require("./main/udp-manager.js");

let udp = new UDPManager();

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
    });

    udp.listener.on("message", (message) => {
        mainWindow.webContents.send("osc-message", message);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
