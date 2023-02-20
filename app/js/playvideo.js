$(document).ready(() => {
    const { remote } = require("electron");
    const execSync = require('child_process').execSync;
    let file = JSON.parse(localStorage.getItem("fileevent"));

    let setting_ = JSON.parse(localStorage.getItem("setting"));

    const playvideo = {
        openMediaPlayer: function (url) {
            execSync('@echo off', { encoding: 'utf-8' });
            execSync(`"${setting_.folder}" "${typeof url === "object" ? url.target.dataset.url : url}"`, { encoding: 'utf-8' });
            execSync('exit', { encoding: 'utf-8' });
        },

        fileExecuteExe: function (url) {
            execSync('@echo off', { encoding: 'utf-8' });
            execSync(`start /b "" "${url}"`, { encoding: 'utf-8' });
            execSync('exit', { encoding: 'utf-8' });
        }
    }
    // function closeWindow(player,time){
    //     let mili = time*60000
    //     console.log(mili)
    //     setTimeout(() => {
    //         try{execSync('@echo off', { encoding: 'utf-8' });
    //         execSync("C:\/Windows\/System32\/taskkill.exe /im "+player+" /f" , { encoding: 'utf-8' });
    //         execSync('pause', { encoding: 'utf-8' });
    //         openwindow.playvideo.name.close()}catch(e){
    //             let fileevent = JSON.parse(localStorage.getItem("fileevent"))
    //             let filename = fileevent.name

    //             execSync('@echo off', { encoding: 'utf-8' });
    //             execSync("C:\/Windows\/System32\/taskkill.exe /im "+filename+".exe /f" , { encoding: 'utf-8' });
    //             execSync('pause', { encoding: 'utf-8' });
    //             openwindow.playvideo.name.close()
    //         }
    //     },mili)
    //     return false;
    // }
    // Test COmment
    if (file.event && file.player != "") {
        $("title").html(file.event.split("/").slice(-1).join())
        console.log($('title'))
        playvideo.openMediaPlayer(file.event)
        remote.getCurrentWindow().close()
    } else if (file.event && file.player == "") {

        playvideo.fileExecuteExe(file.event)
        remote.getCurrentWindow().close()
    }
    else {
        throw new TypeError("File not Found")
    }

    // function closeWindow(player,time){
    //     let mili = time*60000
    //     console.log(mili)
    //     setTimeout(() => {
    //         try{execSync('@echo off', { encoding: 'utf-8' });
    //         execSync("C:\/Windows\/System32\/taskkill.exe /im "+player+" /f" , { encoding: 'utf-8' });
    //         execSync('pause', { encoding: 'utf-8' });
    //         openwindow.playvideo.name.close()}catch(e){
    //             let fileevent = JSON.parse(localStorage.getItem("fileevent"))
    //             let filename = fileevent.name

    //             execSync('@echo off', { encoding: 'utf-8' });
    //             execSync("C:\/Windows\/System32\/taskkill.exe /im "+filename+".exe /f" , { encoding: 'utf-8' });
    //             execSync('pause', { encoding: 'utf-8' });
    //             openwindow.playvideo.name.close()
    //         }
    //     },mili)
    //     return false;
    // }

    // $(document).keypress(function(event){
    //     if (String.fromCharCode(event.which).toUpperCase() == "E") {
    //         let setting_ = JSON.parse(localStorage.getItem("setting")); 
    //         closeWindow(setting_.myplayer, 0);
    //     }
    // });
});