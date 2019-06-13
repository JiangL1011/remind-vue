'use strict'

import {app, BrowserWindow, Tray, Menu} from 'electron'

const path = require('path')
const envPath = require('../config/environment')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 获取窗口关闭事件
  mainWindow.on('close', function (e) {
    if (!app.isQuiting) {
      e.preventDefault()
      mainWindow.hide()
      tray.displayBalloon({
        title: 'To-D0 powered by JL',
        content: '程序已最小化到系统托盘！',
        icon: path.join(envPath, 'static/icons/lufi.jpg')
      })
      return false
    }
  })

  // 设置系统托盘
  tray = new Tray(path.join(envPath, 'static/icons/lufi.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {label: '打开窗口', type: 'normal', click: () => mainWindow.show()},
    {
      label: '退出程序',
      type: 'normal',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setToolTip('To-D0 powered by JL')
  tray.setContextMenu(contextMenu)
  tray.on('double-click', function () {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
