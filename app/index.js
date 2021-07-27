const Module = require("module");
const { join, dirname } = require("path");

const electron = require("electron");
const { ipcMain, BrowserWindow, Tray, nativeImage, Menu } = require("electron");
const electronPath = require.resolve("electron");

const guildedPath = join(dirname(require.main.filename), "..", "app.asar");
const guildedPackage = require(join(guildedPath, "package.json"));

class MeGuildedWindow extends BrowserWindow {
  constructor(opts) {
    let OGPreload;
    if (opts.webContents) {
      // console.log("this fired");
    } else if (opts.webPreferences && opts.webPreferences.nodeIntegration) {
      // Splash Screen
      // console.log("No I fired!");
    } else if (opts.webPreferences && opts.webPreferences.preload) {
      OGPreload = opts.webPreferences.preload;

      if (opts.webPreferences.nativeWindowOpen) {
        opts.webPreferences.preload = join(__dirname, "preload.js");
      }
    } else {
      // opts.webPreferences.preload = join(__dirname, "./preload.js");
    }

    // opts.transparent = true;

    let win = new BrowserWindow(opts);
    let originalurl = win.loadURL.bind(win);

    // Object.defineProperty(win, 'loadURL', {
    // 	get: ()
    // })

    win.on("close", (e) => {
      // e.preventDefault();
      // console.log(win.id);

      if (win.id == 2) {
        e.preventDefault();
        win.hide();
      }
    });

    // win.on("closed", (e) => {
    //   e.preventDefault();
    //   console.log("test");
    // });

    // win.on("close", (e) => {
    //   if (winnum == 2) {
    //     e.preventDefault();
    //     win.minimize();
    //     return;
    //   }
    // });

    win.webContents.meguildedPreload = OGPreload;
    return win;
  }

  static loadUrl(origLoadURL, URL, options) {
    return origLoadURL(URL, options);
  }
}

require.main.filename = join(guildedPath, "main.js");

ipcMain.on(
  "MEGUILDED_GET_PRELOAD",
  (e) => (e.returnValue = e.sender.meguildedPreload)
);

ipcMain.on("GUILDED_WINDOW_CLOSE", (e) => {
  BrowserWindow.fromWebContents(e.sender).quit();
});

let patched = false;

const appSetUserModelId = electron.app.setAppUserModelId;

function setAppUserModelId(...args) {
  appSetUserModelId.apply(this, args);
  if (!patched) {
    patched = true;
  }
}

electron.app.setAppUserModelId = setAppUserModelId;

const eExports = new Proxy(electron, {
  get(target, prop) {
    switch (prop) {
      case "BrowserWindow": {
        // mywindow = MeGuildedWindow;
        return MeGuildedWindow;
      }
      default:
        return target[prop];
    }
  },
});

if (process.platform == "linux") {
  // let tray;
  let appIcon;

  electron.app.whenReady().then(() => {
    appIcon = new Tray(join(__dirname, "assets", "gg.png"));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show Guilded",
        id: "showGuilded",
        click: function () {
          // const win =
          //   MeGuildedWindow.getAllWindows()[
          //     MeGuildedWindow.getAllWindows().length - 2
          //   ]; // Dunno why this is the case that there are 3 but monkaGiga
          const win = MeGuildedWindow.fromId(2);
          win.show();
        },
      },
      {
        label: "Close Guilded",
        id: "closeGuilded",
        click: function () {
          electron.app.exit();
        },
      },
    ]);

    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu);
    appIcon.setTitle("Guilded");
  });
}

delete require.cache[electronPath].exports;
require.cache[electronPath].exports = eExports;

electron.app.setAppPath(guildedPath);
// electron.app.setPreloadPath(join("..", "app", "preload"));
electron.app.name = "Guilded";
electron.app.setVersion(guildedPackage.version);

Module._load(join(guildedPath, guildedPackage.main), null, true);
