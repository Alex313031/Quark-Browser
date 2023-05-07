const { Menu, BrowserWindow } = require('electron');

const setupMenu = (browser) => {
  const isMac = process.platform === 'darwin'

  const tab = () => browser.getFocusedWindow().getFocusedTab()
  const tabWc = () => tab().webContents
  const gpuWindow = () => new BrowserWindow({ width: 1024, height: 768 });

  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          nonNativeMacOSRole: true,
          click: () => tabWc().reload(),
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+CmdOrCtrl+R',
          nonNativeMacOSRole: true,
          click: () => tabWc().reloadIgnoringCache(),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          nonNativeMacOSRole: true,
          click: () => tabWc().toggleDevTools(),
        },
        {
          label: 'Open chrome://gpu',
          accelerator: 'Alt+G',
          nonNativeMacOSRole: true,
          click: () => gpuWindow().loadURL('chrome://gpu'),
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = {
  setupMenu,
}
