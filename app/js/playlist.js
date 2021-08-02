$(document).ready(() => {
    const { ipcRenderer, remote } = require("electron");
    const { BrowserWindow, powerMonitor } = require('electron').remote;

    let fileslist = { "9D": [], "5D": [] };
    let count = 0;

    const utilites = {
        closingcurntwindow: function(e) {
            e.preventDefault();
            remote.getCurrentWindow().close();
        },
        selector: function(args) {
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
        getelement: function(args) {
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
        uniqid: function() {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length - 1;
            for (let i = 0; i < 4; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        element: function(file, count) {

            return `<tr align="center" id=${file.id}>
	     				<td>${count}</td>
	     				<td align="left">${file.name.toUpperCase()}</td>
	     				<td>${file.type.toUpperCase()}</td>
	     				<td><button data-id=${file.id} class="removeitem" style="background: red;color: #fff">remove</button></td>
	     			</tr>`;
        },

        message: function(args) {
            return `<tr align="center">
	     				<td colspan="5"><b>${args}</b></td>
	     			</tr>`;
        },
        updateCookie: function() {
            let status = false;
            $.each(datatable.tab(), (i, v) => {
                if (datatable.myfiles()[v].length > 0) {
                    status = true;
                    return false;
                }
            });
            if (status) {
                localStorage.setItem('file', JSON.stringify(datatable.myfiles()));
            }
        },
        getCookie: function() {
            return localStorage.getItem('file');
        },
        onloadwindow: function() {
            let fileitem = JSON.parse(this.getCookie());
            let filecount = 0;



            if (fileitem != null) {
                $.each(fileitem, (idx, values) => {
                    if (values.length > 0) {
                        $.each(values, (i, val) => {
                            fileslist[idx].push(val);
                            $.each(val, (i, v) => {
                                // if (idx == "vr1") {
                                // console.log(idx)
                                try {
                                    this.getelement(idx).append(this.element(v, ++filecount));
                                } catch (e) {
                                    console.log("DOM ELEMENT NOT FOUND");
                                }
                                // }
                            });
                        })
                    } else {
                        this.getelement(idx).append(this.message("No PlayList Yet"));
                    }
                });
                dom.total.html(filecount);
            } else {
                $.each(datatable.tab(), (idx, val) => {
                    // console.log(val)
                    this.getelement(val).append(this.message("No PlayList Yet"));
                });
            }
        }
    };

    const datatable = {
        type: function() {
            return [
                { "video/avi": "video" },
                { "application/x-msdownload": "exe" }
            ];
        },
        tab: function() {
            return ["9D", "5D"];
        },
        table: function(path, name) {
            let value = "";
            $.each(this.tab(), (idx, val) => {
                if (path.search(val) > -1) {
                    value = val;
                } else if (name == val) {
                    value = val;
                }
            });

            return value;
        },
        choosecatagory: function(e) {
            let visible = e.target.dataset.enable;
            let disable = e.target.dataset.disable;
            let listing = e.target.innerText.toUpperCase();

            $(e.target).css({
                "background": "#fff",
            });
            $(`div[data-enable=${disable}]`).css({
                "background": "#B3E5FF",
            })
            utilites.getelement(listing).html("");

            utilites.getelement(visible).removeClass("d-none");

            utilites.getelement(disable).addClass("d-none");

            let filecount = 0;
            if (fileslist[listing].length > 0) {
                $.each(fileslist[listing], (i, v) => {
                    $.each(v, (idx, val) => {
                        try {
                            utilites.getelement(listing).append(utilites.element(val, ++filecount));
                        } catch (e) {
                            console.log("DOM ELEMENT NOT FOUND");
                        }
                    });
                });
            } else {
                utilites.getelement(listing).append(utilites.message("No PlayList Yet"));
            }
        },
        checkfiletype: function(file) {
            let filetype = this.type();
            $.each(filetype, (idx, val) => {
                $.each(val, (idx, vl) => {
                    if (file.file.type === idx) {
                        file.file['newtype'] = vl;
                        file.file['catagory'] = file.table;
                        this.createlst(file.file);
                    }
                })
            });
        },
        createlst: function(file) {
            let grupfileinfo = {};
            let id__ = utilites.uniqid();

            let filename = file.name.replace(/\.[^.]*$/g, "");
            let path = file.path.replace(`${file.name}`, "");
            let img = `${path}${filename}.bmp`;


            let finalfileinfo = {
                "id": id__,
                "name": filename,
                "path": path,
                "img": img,
                "file": file.path,
                "type": file.newtype,
            };
            if (utilites.getelement(file.catagory).find("tr").find("td").length === 1) {
                utilites.getelement(file.catagory).html("");
            }
            let len = utilites.getelement(file.catagory).find("tr").length;
            count = len > 0 ? len : count;

            let list = this.myfiles()[file.catagory];
            let status = true;

            $.each(list, (i, v) => {
                $.each(v, (idx, val) => {
                    if (val.name == finalfileinfo.name) {
                        status = false;
                        return status;
                    } else {
                        status = true;
                    }
                });
            });

            if (status) {
                try {
                    utilites.getelement(file.catagory).append(utilites.element(finalfileinfo, ++count));
                } catch (e) {
                    console.log("DOM ELEMENT NOT FOUND");
                }
                grupfileinfo[id__] = finalfileinfo;
                fileslist[file.catagory].push(grupfileinfo);
            } else {
                alert(`${finalfileinfo.name.toUpperCase()} Already Exist In ${file.catagory}`);
            }


        },
        myfiles: function() {
            return fileslist;
        },
        removeRows: function(e) {
            console.log(e)
        },
        addFiles: function(e) {

            e.preventDefault();
            let info = datatable.sendFiles(e);
            let table = info.table;
            $.each(info.files, (idx, val) => {
                datatable.checkfiletype({ file: val, table: table });
            });
            dom.total.html(count);
        },
        sendFiles: function(e) {
            let files = e.target.files;
            let path = files[0].webkitRelativePath;
            let tbkey = e.target.dataset.var ? e.target.dataset.var : "9D";
            let table = this.table(path, tbkey);
            return {
                "table": table,
                "files": files,
            };
        },
    };

    const dom = {
        datatable: utilites.getelement("addfile"),
        close: utilites.getelement("close"),
        total: utilites.getelement("count"),
        vr: utilites.getelement(['vr']),
        remove: utilites.getelement(["removeitem"]),
        update: utilites.getelement("updatefiles"),
        extraadd: utilites.getelement(["extra_add"]),
    }

    dom.close.on("click", utilites.closingcurntwindow);

    dom.datatable.on("change", datatable.addFiles);
    dom.extraadd.on("change", datatable.addFiles);

    dom.update.on("click", utilites.updateCookie);

    utilites.onloadwindow();

    utilites.getelement("5D-container").addClass("d-none");
    $('div[data-enable="9D-container"]').css({
        "background": "#fff",
    });

    $(document).on("click", ".removeitem", function(e) {
        let _id = $(this).data("id")
        $(`#${_id}`).remove()
        $getitems = JSON.parse(utilites.getCookie());
        $.each($getitems, (idx, val) => {
            if (val.length > 0) {
                $.each(val, (id, value) => {
                    console.log(value[_id])
                    delete value[_id]
                })
            }
        })
        fileslist = $getitems

        if ($("div#9D-container").find("table tbody tr").length < 1) {
            utilites.getelement("9D").append(utilites.message("No PlayList Yet"));
        } else if ($("div#5d-container").find("table tbody tr").length < 1) {
            utilites.getelement("5D").append(utilites.message("No PlayList Yet"));
        }

    });

    // dom.vr.on("click", datatable.choosecatagory);
});