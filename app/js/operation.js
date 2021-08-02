const { remote } = require("electron");
const execSync = require('child_process').execSync;

const { powerMonitor } = remote;
const utilites = {
    close: function () {
        $("#close").on("click", (e) => {
            e.preventDefault();
            remote.app.quit();
        });
    },
    minimize: function () {
        $("#minimize").on("click", (e) => {
            e.preventDefault();
            remote.getCurrentWindow().minimize();
        });
    },
    shutdown: function () {
        $("#shutdown").on("click", (e) => {
            e.preventDefault();
            execSync('@echo off', { encoding: 'utf-8' });
            execSync(`"c:\/Windows\/System32\/shutdown.exe" /s /t 20`, { encoding: 'utf-8' });
            execSync('pause', { encoding: 'utf-8' });
            remote.app.quit();
        });
    },
    setup: function () {
        this.close();
        this.minimize();
        this.shutdown();
    }
}

utilites.setup();
