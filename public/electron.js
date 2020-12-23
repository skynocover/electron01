// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, Menu, shell, Tray } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

let appIcon = null; // inTray

const iconName = process.platform === 'win32' ? 'icon/list.png' : 'icon/list.png';
const iconPath = path.join(__dirname, iconName);
const inTray = () => {
  if (!appIcon) {
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => {
          mainWindow.show();
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);
    appIcon.setToolTip('To do list');
    appIcon.setContextMenu(contextMenu);
  }
};

// 彈窗
ipc.handle('ask_delete', async (event) => {
  const options = {
    type: 'info',
    title: 'Information',
    message: '確定要刪除所選擇的工作項目嗎',
    buttons: ['Yes', 'No'],
  };
  let obj = await dialog.showMessageBox(options);
  return obj.response;
});

// const globalShortcut = electron.globalShortcut;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'App Menu Demo',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            const options = {
              type: 'info',
              title: 'Application Menu Demo',
              buttons: ['Ok'],
              message:
                'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.',
            };
            electron.dialog.showMessageBox(focusedWindow, options, function () {});
          }
        },
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+Q',
        role: 'close',
      },
      {
        type: 'separator',
      },
      {
        label: 'Reopen Window',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: function () {
          app.emit('activate');
        },
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function () {
          shell.openExternal('https://github.com/skynocover/electron01');
        },
      },
      {
        label: 'CloudFlare',
        click: function () {
          shell.openExternal('https://dash.cloudflare.com/c7f34060fc7e1530d72fcdafe6995359/workers/view/todolist');
        },
      },
    ],
  },
];

const createWindow = () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // for webpack
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  globalShortcut.register('CommandOrControl+R', function () {
    console.log('CommandOrControl+R is pressed');
    mainWindow.reload();
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  inTray();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors'); // fix cors

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (appIcon) appIcon.destroy();
  appIcon = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
  inTray();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
