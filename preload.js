const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'api', {
    sendToMain: (channel, data) => {
        let validateChannels = ['cloudSave', 'cloudLoad']
        if (validateChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receiveFromMain: (channel, func) => {
        let validateChannels = ['cloudSaveReturn', 'cloudLoadReturn']
        if (validateChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    }
}
);