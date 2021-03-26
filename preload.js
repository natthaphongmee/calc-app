const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    'api', {
    sendToMain: (channel, data) => {
        let validateChannels = ['cloudSave', 'cloudLoad', 'localSave', 'localLoad']
        if (validateChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receiveFromMain: (channel, func) => {
        let validateChannels = ['cloudSaveReturn', 'cloudLoadReturn', 'localSaveReturn', 'localLoadReturn']
        if (validateChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    }
}
);