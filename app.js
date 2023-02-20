require('events').EventEmitter.defaultMaxListeners = 15;

const url = require("url");
const fs = require("fs")
const path = require("path");
const robot = require('robotjs');

const si = require('systeminformation');


const { app, BrowserWindow, globalShortcut, dialog } = require('electron');

app._maxListeners = 100;

let mainWindow = null; // Default MainWindow is Empty
const gotTheLock = app.requestSingleInstanceLock(); // prevent with duplicate window
const { machineIdSync } = require('node-machine-id')

function options(type, title, message) {
    const options = {
        type: type,
        buttons: ["ok"],
        defaultId: 0,
        title: title,
        message: message,
    };
    return options;
}

function home() {
    mainWindow = new BrowserWindow(setting(false));
    mainWindow.maximize()
    // mainWindow.openDevTools(true);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "app", 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.setAlwaysOnTop(false);
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    globalShortcut.register('e', () => {
        mainWindow.webContents.send("test_process", { "status": true })
    })

    globalShortcut.register('Shift+Return', () => {
        mainWindow.webContents.send("test_gamecoin_credit", { "status": true })
    })

}

const currentHW = robot.screen.capture()

function setting(f) {
    const height = currentHW.height * 0.75
    const width = currentHW.width * 0.75
    return {
        // height: height,
        // width: width,
        center: true,
        resizable: false,
        alwaysOnTop: false,
        frame: f ? f : false,
        autoHideMenuBar: true,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    }
}

function openMainWindow() {
    fs.readFile(process.env.APPDATA + "/vrfun/temp.config", "utf-8", (err, token) => {
        if (err) {
            dialog.showMessageBox(
                new BrowserWindow({
                    show: false,
                    alwaysOnTop: true
                }), options("info", "Message", "Please Make Sure Your Software Is Activate. 👀"), (response) => {
                    if (!response) {
                        app.quit()
                    }
                });
            setTimeout(() => {
                app.quit()
            }, 3000)
        } else {
            si.system().then(data => {
                const $id = data.uuid + data.serial
                const $token = token.trim()
                let mid = $token.split("#")
                if (mid instanceof Array && mid.length > 1 && $id.toUpperCase() === mid[1] && mid[0] == "A15F646F4CF8C4A34D63A5407668FD56") {
                    home()
                } else {
                    dialog.showMessageBox(
                        new BrowserWindow({
                            show: false,
                            alwaysOnTop: true
                        }), options("info", "Message", "Please Make Sure Your Software Is Activate. 👀"), (response) => {
                            if (!response) {
                                app.quit()
                            }
                        });
                    setTimeout(() => {
                        app.quit()
                    }, 3000)
                }
            })
        }
    })
}

if (!gotTheLock) {
    app.quit();
} else {
    app.on("ready", openMainWindow);
    app.on('activate', function () {
        if (mainWindow === null) {
            openMainWindow()
        }
    })
    app.on("before-quit", () => {
        globalShortcut.unregister("e");
    })
    app.on('window-all-closed', () => {
        app.quit()
    })
}