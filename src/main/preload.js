const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("osc", {
    send: (message, ip, port) => ipcRenderer.invoke(
        "send", message, ip, port),
    onBundle: (callback) => ipcRenderer.on("osc-bundle", callback)
});
