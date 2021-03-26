const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fetch = require('node-fetch')
const fs = require('fs')

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    })

    // open devtools when start app.
    win.webContents.openDevTools()

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('cloudSave', async (event, arg) => {
    event.preventDefault()

    const response = await fetch('https://e0hp5h1ach.execute-api.ap-southeast-1.amazonaws.com/dev/calc/save', {
        method: 'PUT',
        body: arg,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const jsonData = await response.json()
    const { status } = response
    let responseObj = {
        'status': status,
        'data': jsonData
    }
    win.webContents.send('cloudSaveReturn', responseObj)
})

ipcMain.on('cloudLoad', async (event, arg) => {
    event.preventDefault()

    const response = await fetch('https://e0hp5h1ach.execute-api.ap-southeast-1.amazonaws.com/dev/calc/get')
    const jsonData = await response.json()
    const { status } = response
    let responseObj = {
        'status': status,
        'data': jsonData
    }
    win.webContents.send('cloudLoadReturn', responseObj)
})

ipcMain.on('localSave', async (event, arg) => {
    event.preventDefault()

    dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: path.join(app.getAppPath(), 'sample'),
        filters: [{ name: 'Json File', extensions: ['json'] }],
        properties: []
    }).then(file => {
        if (!file.canceled) {
            fs.writeFile(file.filePath.toString(),
                arg, function (err) {
                    if (err) throw err;
                    win.webContents.send('localSaveReturn', 'File save successfully!')
                });
        }
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('localLoad', async (event, arg) => {
    event.preventDefault()

    dialog.showOpenDialog({
        title: 'Upload File',
        filters: [{ name: 'Json File', extensions: ['json'] }],
        properties: ['openFile']
    }).then(file => {
        if (!file.canceled) {
            fs.readFile(file.filePaths[0], (err, data) => {
                if (err) throw err
                win.webContents.send('localLoadReturn', JSON.parse(data))
            })
        }
    }).catch(err => {
        console.log(err)
    })
})