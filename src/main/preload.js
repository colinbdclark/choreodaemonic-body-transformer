const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("osc", {
    send: (message, ip, port) => ipcRenderer.invoke(
        "send", poses, ip, port),
    onMessage: (callback) => ipcRenderer.on("osc-message",callback)
});
