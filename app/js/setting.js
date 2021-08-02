$(document).ready(() => {
    const { remote } = require("electron");

    var myplayer = "";
    var lastFolder_ = "";
    const utilites = {
        closingcurntwindow: function (e) {
            e.preventDefault();
            remote.getCurrentWindow().close();
        },
        selector: function (args) {
            return {
                "status": true,
                "statement": {
                    "selector": typeof args === "object" ?
                        "." :
                        "#",
                    "name": typeof args === "object" ?
                        args[0] :
                        args,
                }
            }
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
        set: function (data) {
            localStorage.setItem('setting', JSON.stringify(data));
        },
        get: function () {
            return localStorage.getItem('setting');
        }
    }
    // const setting = {
    //     comport: function (port) {
    //         for (let i = 1; i <= 8; i++) {
    //             if (i == 1) {
    //                 port.append(`<option value="com-${i}" selected>COM ${i}</option>`)
    //             } else {
    //                 port.append(`<option value="com-${i}">COM ${i}</option>`)
    //             }
    //         }
    //     },
    //     baudrate: function (baudrate) {
    //         for (let i = 300; i <= 256000; i *= 2) {

    //             if (i == "9600") {
    //                 baudrate.append(`<option value="baudrate-${i}" selected>${i}</option>`)
    //             } else {
    //                 baudrate.append(`<option value="baudrate-${i}">${i}</option>`)
    //             }
    //             if (i == 38400) {
    //                 break
    //             }
    //         }
    //         baudrate.append(`<option value="baudrate-57600">57600</option>`)
    //         baudrate.append(`<option value="baudrate-115200">115200</option>`)
    //         baudrate.append(`<option value="baudrate-230400">230400</option>`)
    //     }
    // }
    const dom = {
        close: utilites.getelement("close"),
        // baudrate: utilites.getelement('baud-rate'),
        // comport: utilites.getelement('com-port'),
        // databit: utilites.getelement('databit'),
        // stopbit: utilites.getelement('stopbit'),
        gameply: utilites.getelement('gameply'),
        updatefiles: utilites.getelement('updatefiles'),
        addfile: utilites.getelement("addfile"),
        myplayer: utilites.getelement("myplayer"),
        folder: utilites.getelement("folder"),
    }
    dom.close.on("click", utilites.closingcurntwindow);
    // setting.comport(dom.comport);
    // setting.baudrate(dom.baudrate);
    dom.updatefiles.on("click", () => {
        // let comport = dom.comport.val();
        // let baudrate = dom.baudrate.val().split("-")[1];
        // let databit = dom.databit.val();
        // let stopbit = dom.stopbit.val();
        let gameply = dom.gameply.val();

        let data = {
            // comport: comport,
            // baudrate: baudrate,
            // databit: databit,
            // stopbit: stopbit,
            gameply: gameply,
            folder: lastFolder_ != "" ? lastFolder_ : dom.folder.val(),
            myplayer: myplayer != "" ? myplayer : dom.myplayer.html(),
        }
        utilites.set(data)
    })

    dom.addfile.on("change", (e) => {
        let file = e.target.files

        if (file[0].type == "application/x-msdownload") {
            lastFolder_ = file[0].path
            myplayer = file[0].name;
            dom.myplayer.html(myplayer)
        } else {
            alert("Invalid File Type");
        }
    })

    let setting_ = JSON.parse(utilites.get());
    $.each(setting_, (k, v) => {
        if (k == "comport" || k == "baudrate") {
        } else if (k == "myplayer") {
            utilites.getelement(k).html(v);
        }
        else {
            // console.log(k,v)
            try {
                utilites.getelement(k).val(v);
            } catch (e) {
                utilites.getelement(k).html(v);
            }
        }
    });
})