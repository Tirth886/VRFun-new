$(document).ready(async () => {
    const { ipcRenderer } = require("electron");
    const { BrowserWindow, powerMonitor, dialog } = require('electron').remote;

    const path = require('path');
    const fs = require('fs');
    const url = require('url');
    const os = require('os')
    const robot = require('robotjs')
    const serialPort = require('serialport')

    const dataSerial = await serialPort.SerialPort.list()
    let PorocessList = dataSerial.filter(e => e.vendorId !== undefined && e.productId !== undefined)
    let isKeyboardListen = false;
    if (PorocessList.length > 0) {
        isKeyboardListen = true;
    }

    const execSync = require('child_process').execSync;

    let setting_ = JSON.parse(localStorage.getItem("setting"));
    let totalCoinSet = 0;
    if (typeof setting_.coinset !== "undefined") {
        totalCoinSet = setting_.coinset;
    }


    function optionsDialog(type, title, message) {
        const options = {
            type: type,
            buttons: ["ok"],
            defaultId: 0,
            title: title,
            message: message,
        };
        return options;
    }

    function closeWindow(player, time, timeout = '') {
        let mili = time * 60000
        if (timeout != "") {
            clearTimeout(timeout)
        }
        return setTimeout(() => {
            try {
                execSync('@echo off', { encoding: 'utf-8' });
                execSync("C:\/Windows\/System32\/taskkill.exe /im " + player + " /f", { encoding: 'utf-8' });
                execSync('pause', { encoding: 'utf-8' });
                openwindow.playvideo.name.close()
            } catch (e) {
                let fileevent = JSON.parse(localStorage.getItem("fileevent"))
                let filename = fileevent.name
                if (filename != "undefined") {
                    try {
                        execSync('@echo off', { encoding: 'utf-8' });
                        execSync(`C:\/Windows\/System32\/taskkill.exe /im "${filename}.exe" /f`, { encoding: 'utf-8' });
                        execSync('pause', { encoding: 'utf-8' });
                        openwindow.playvideo.name.close()
                    } catch (e) {
                        execSync('@echo off', { encoding: 'utf-8' });
                        execSync(`C:\/Windows\/System32\/taskkill.exe /im "${filename}.exe" /t`, { encoding: 'utf-8' });
                        execSync('pause', { encoding: 'utf-8' });
                        openwindow.playvideo.name.close()
                    }
                }
            }
        }, mili);
    }

    var combinationKeyPress = [];

    function gameCreditCoins(enterCoin, totalCredited) {

        if (!isKeyboardListen) return false;

        let coin = parseInt(enterCoin.text().trim())
        coin += 1
        if (coin === parseInt(totalCoinSet)) {
            console.log(enterCoin)
            enterCoin.html(0)
            let creditCoin = parseInt(totalCredited.text().trim())
            creditCoin += 1;
            if (creditCoin < 10) {
                totalCredited.html("0" + creditCoin)
            } else {
                totalCredited.html(creditCoin)
            }
        } else {
            enterCoin.html(coin)
        }
    }
    const utilites = {
        selector: function (args) {
            return {
                "status": true,
                "statement": {
                    "selector": typeof args === "object" ?
                        "." : "#",
                    "name": typeof args === "object" ?
                        args[0] : args,
                }
            }
        },
        openMediaPlayer: function (url) {
            execSync('@echo off', { encoding: 'utf-8' });
            execSync(`"c:\/Program Files (x86)\/Stereoscopic Player\/StereoPlayer.exe" "${typeof url === "object" ? url.target.dataset.url : url}"`, { encoding: 'utf-8' });
            execSync('exit', { encoding: 'utf-8' });
        },
        games_show: function (cat) {
            let parse = JSON.parse(this.getCookie());
            if (parse != null) {
                let list = parse[cat].length > 0 ? parse[cat] : null;
                if (list != null) {
                    $.each(list, (i, val) => {
                        $.each(val, (key, file) => {
                            this.getelement(cat).append(utilites.element(file));
                        })
                    });
                }
            }
        },
        choosecatagory: function (e) {
            let visible = e.target.dataset.enable;
            let disable = e.target.dataset.disable;
            let listing = e.target.innerText;

            $(e.target).css({
                "background": "#fff",
            });
            $(`div[data-enable=${disable}]`).css({
                "background": "#B3E5FF",
            })

            utilites.getelement(listing).html("");
            utilites.getelement(visible).removeClass("d-none");
            utilites.getelement(disable).addClass("d-none");

            utilites.games_show(listing);
        },
        getelement: function (args) {
            let statement = this.selector(args);
            if (statement.status) {
                try {
                    let dom = $(`${statement.statement.selector}${statement.statement.name}`);
                    return dom.length > 0 ? dom : "Invalid selector";
                } catch (e) {
                    console.log(e);
                }
            }
        },
        getCookie: function () {
            return localStorage.getItem('file');
        },
        setCookie: function (args) {
            localStorage.setItem('execute', JSON.stringify({ url: args }));
        },
        element: function (args) {
            return `<div class="list-games game-list-setting" data-name="${args.name}" data-url="${args.file}" >
                    <img src="${args.img}" data-url="${args.file}" height="130px" width="130px" altr="${args.name}" style="z-index:-1;">
                    <span style="z-index:-1;" data-url="${args.file}"></span>    
                    </div>`;
        },
        message: function (args) {
            // return `<div class="list-games" data-url="">
            //                ${args}
            //        </div>`;
            return ``
        }
    };

    const openwindow = {
        playlist: {
            name: null,
            height: 570,
            width: 590,
            file_name: "playlist.html"
        },
        setting: {
            name: null,
            height: 440,
            width: 390,
            file_name: "setting.html"
        },
        playvideo: {
            name: null,
            height: 1,
            width: 1,
            visible: true,
            file_name: "playvideo.html"
        },
    };

    const window_ = {
        setting: function (args) {
            return {
                height: args.height,
                width: args.width,
                center: true,
                maximizable: false,
                minimizable: false,
                resizable: true,
                alwaysOnTop: false,
                frame: false,
                transparent: args.visible ? args.visible : false,
                webPreferences: { nodeIntegration: true }
            }
        },
        pathurl: function (args) {
            return {
                pathname: path.join(__dirname, "views", `${args.file_name}`),
                protocol: 'file:',
                slashes: true,
            }
        },
    };

    const window_option = {
        cretingenviroment: function (args) {
            args.name = new BrowserWindow(window_.setting({ height: args.height, width: args.width, visible: args.visible }));
            args.name.loadURL(url.format(window_.pathurl({ file_name: `${args.file_name}` })));
            args.name.removeMenu();
            // args.name.openDevTools();
        },
        playlist: function (args) {
            this.cretingenviroment(args.playlist);
        },
        setting: function (args) {
            this.cretingenviroment(args.setting);
        },
        playvideo: function (args) {
            this.cretingenviroment(args.playvideo);
        },
    };
    if (utilites.getCookie() != null) {
        $.each(JSON.parse(utilites.getCookie()), (i, v) => {
            if (i == "9D") {
                if (v.length > 0) {
                    $.each(v, (id, val) => {
                        $.each(val, (idx, value) => {
                            utilites.getelement(i).append(utilites.element(value));
                        });
                    });
                } else {
                    utilites.getelement(i).append(utilites.message("Add Games From PlayList"));
                }
            } else {
                return false;
            }
        });
    } else {
        $("#9D").append(utilites.message("Add Games From PlayList"));
        $("#5D").append(utilites.message("Add Games From PlayList"));
    }
    const dom = {
        playlist: utilites.getelement("playlistwindow"),
        setting: utilites.getelement("settingwindow"),
        vr: utilites.getelement(['vr']),
        play: utilites.getelement("play-video"),
        stop: utilites.getelement("stop-video"),
        pass: utilites.getelement("pass"),
        enterCoin: utilites.getelement("enterCoin"),
        totalCoinSet: utilites.getelement("totalCoinSet"),
        totalCredited: utilites.getelement("totalCredited"),
        // btnn     : utilites.getelement("login"),
        // lgnb     : utilites.getelement("loginblock"),
        game: utilites.getelement("games")
        // list     : utilites.getelement(["list-games"])
    }

    dom.totalCoinSet.html(totalCoinSet)

    dom.playlist.on("click", (e) => {
        e.preventDefault();
        window_option.playlist(openwindow);
    });
    dom.setting.on("click", (e) => {
        e.preventDefault();
        window_option.setting(openwindow);
    });
    // utilites.getelement("vr2-container").addClass("d-none");

    $('div[data-enable="9D"]').css({
        "background": "#fff",
    });

    // dom.vr.on("click", utilites.choosecatagory);

    $(document).on("click", ".list-games", function (e) {
        let setting_ = JSON.parse(localStorage.getItem("setting"));

        let url = $(this).data("url");
        let name = $(this).data("name");

        $(document).find("div.single-click").removeClass("single-click")
        $(this).addClass("single-click")
        $($(this).find("img")[0]).css({
            "z-index": "1"
        })

        if (url.indexOf(".exe") >= 0) {
            localStorage.setItem("fileevent", JSON.stringify({ "event": url, "name": name, "player": "" }))
        } else {
            localStorage.setItem("fileevent", JSON.stringify({ "event": url, "player": setting_.myplayer }))

        }
    });
    var TIMEOUT = '';
    dom.play.on("click", (e) => {
        e.preventDefault();
        let totalCreditedSet = parseInt(dom.totalCredited.text().trim())
        if (totalCreditedSet == 0 && totalCoinSet != 0) {
            // alert("Please Insert Coin.");
            dialog.showMessageBox(
                new BrowserWindow({
                    show: false,
                    alwaysOnTop: true
                }), { ...optionsDialog("error", "", "Please Insert Coins."), detail: " " }, (response) => { });
        } else {

            let file = JSON.parse(localStorage.getItem("fileevent"));
            if (file.event) {
                if (typeof file.event !== "undefined" && file.event.indexOf(".exe") >= 0) {
                    setTimeout(() => {
                        robot.keyTap("enter")
                        setTimeout(() => {
                            robot.keyTap("space")
                        }, 3000)
                    }, 3000)
                }
                if (totalCoinSet != 0) {
                    totalCreditedSet -= 1;
                    dom.totalCredited.html("0" + totalCreditedSet);
                    combinationKeyPress = [];
                }
                $(document).find("div.single-click").length == 1 ? window_option.playvideo(openwindow) : alert("Select Game")
                TIMEOUT = closeWindow(setting_.myplayer, setting_.gameply ? setting_.gameply : 10000);
                ipcRenderer.send("process_", { "process": true })
            }
        }
    })
    dom.stop.on("click", () => {
        let setting_ = JSON.parse(localStorage.getItem("setting"));
        closeWindow(setting_.myplayer, 0, TIMEOUT);
    });



    $(document).keypress(function (event) {
        if (String.fromCharCode(event.which).toUpperCase() == "E") {
            let setting_ = JSON.parse(localStorage.getItem("setting"));
            closeWindow(setting_.myplayer, 0);
        }
    });

    ipcRenderer.on("test_process", (e, a) => {
        let setting_ = JSON.parse(localStorage.getItem("setting"));
        closeWindow(setting_.myplayer, 0, TIMEOUT);
    })

    ipcRenderer.on("test_gamecoin_credit", (e, a) => {
        gameCreditCoins(dom.enterCoin, dom.totalCredited)
    })

    var getRandomIntInclusive = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var setBubble = function (num) {
        var element = document.getElementById("bg");
        var radius = 40;

        function setBubbleParams(bubble, bubbleWrap) {
            var deg = getRandomIntInclusive(0, 360);
            bubbleWrap.style.transform = 'rotate(' + deg + 'deg)';

            var hue = getRandomIntInclusive(0, 360);
            bubble.style.background = "hsl(" + hue + ",80%, 70%)";
            bubble.style.boxShadow = "0px 0px 5px 3px hsl(" + hue + ",80%, 70%)";
            bubble.style.opacity = 0;

            return bubble, bubbleWrap;
        }

        for (i = 0; i < num; i++) {
            var color = Math.floor(Math.random() * 10000);
            var bubble = document.createElement("div");
            var bubbleWrap = document.createElement("div");
            bubble.className = "circle " + "circle" + i;
            bubbleWrap.className = "circleWrap " + "circleWrap" + i;
            element.appendChild(bubbleWrap);
            bubbleWrap.appendChild(bubble);

            setBubbleParams(bubble, bubbleWrap);

            gsap.to(bubble, {
                delay: Math.random() * 4 + 1,
                x: 500,
                width: radius,
                height: radius,
                alpha: 1,
                repeat: -1,
                duration: Math.random() * 4 + 1,
                ease: "slow(0.7, 0.7, false)",

                onRepeat: function (b, w) {
                    setBubbleParams(b, w);


                },
                onRepeatParams: [bubble, bubbleWrap]
            });
        }
    }

    setBubble(getRandomIntInclusive(10, 5));

});