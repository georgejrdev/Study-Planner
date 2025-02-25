const { app, BrowserWindow, Menu, ipcMain } = require("electron")
const path = require("path")

const _ = require("./backend/db/init")
const program = require("./backend/defaultValues")
const globalDB = require("./backend/db/global")
const taskDB = require("./backend/db/task")
const textDB = require("./backend/db/text")
const gradeDB = require("./backend/db/grade")
const absenceDB = require("./backend/db/absence")
const subjectDB = require("./backend/db/subject")
const workspaceDB = require("./backend/db/workspaces")
const updater = require("./update")

let mainWindow

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: process.platform === 'win32' 
            ? path.join(__dirname, 'assets', 'icon.ico') 
            : path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })

    Menu.setApplicationMenu(null)
    mainWindow.loadFile("./view/index.html")
})

ipcMain.handle("get-version", () => {
    return program.getVersion()
})

ipcMain.handle("is-new-release", async () => {
    return await updater.isNewRelease()
})

ipcMain.handle("update", async () => {
    return await updater.update()
})

ipcMain.handle("find-all", async (_, tableName) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await globalDB.findAll(db, tableName)
})

ipcMain.handle("find-by", async (_, tableName, condition) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await globalDB.findBy(db, tableName, condition)
})

ipcMain.handle("find-query", async (_, query) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await globalDB.findQuery(db, query)
})

ipcMain.handle("create-task", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await taskDB.createTask(...args)
})

ipcMain.handle("update-task", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await taskDB.updateTask(...args)
})

ipcMain.handle("check-task", async (_, id, checked) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await taskDB.checkTask(db, id, checked)
})

ipcMain.handle("delete-task", async (_, id) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await taskDB.deleteTask(db, id)
})

ipcMain.handle("create-text", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await textDB.createText(...args)
})

ipcMain.handle("update-text", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await textDB.updateText(...args)
})

ipcMain.handle("delete-text", async (_, id) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await textDB.deleteText(db, id)
})

ipcMain.handle("search", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await textDB.search(...args)
})

ipcMain.handle("create-subject", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return subjectDB.createSubject(...args)
})

ipcMain.handle("update-subject", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return subjectDB.updateSubject(...args)
})

ipcMain.handle("delete-subject", async (_, id) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return subjectDB.deleteSubject(db, id)
})

ipcMain.handle("create-grade", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return gradeDB.createGrade(...args)
})

ipcMain.handle("update-grade", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return gradeDB.updateGrade(...args)
})

ipcMain.handle("delete-grade", async (_, id) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return gradeDB.deleteGrade(db, id)
})

ipcMain.handle("create-absence", async (_, ...args) => {
    const db = await globalDB.getWorkspaceDBInstace()
    args.unshift(db)
    return await absenceDB.createAbsence(...args)
})

ipcMain.handle("delete-absence", async (_, date) => {
    const db = await globalDB.getWorkspaceDBInstace()
    return await absenceDB.deleteAbsence(db, date)
})

ipcMain.handle("create-workspace", async (_, name) => {
    return await workspaceDB.createWorkspace(name)
})

ipcMain.handle("change-current-workspace", async (_, id) => {
    return await workspaceDB.changeCurrentWorkspace(id)
})

ipcMain.handle("find-workspaces" , async (_, table) => {
    return await workspaceDB.find(table)
})

ipcMain.handle("delete-workspace", async (_, id) => {
    return await workspaceDB.deleteWorkspace(id)
})