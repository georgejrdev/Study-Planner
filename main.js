const { app, BrowserWindow, Menu, ipcMain } = require("electron")
const path = require("path")

const program = require("./backend/defaultValues")
const globalDB = require("./backend/db/global")
const taskDB = require("./backend/db/task")
const textDB = require("./backend/db/text")
const gradeDB = require("./backend/db/grade")
const absenceDB = require("./backend/db/absence")
const subjectDB = require("./backend/db/subject")
const updater = require("./update")

let mainWindow

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })

    //Menu.setApplicationMenu(null)
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
    return await globalDB.findAll(tableName)
})

ipcMain.handle("find-by", async (_, tableName, condition) => {
    return await globalDB.findBy(tableName, condition)
})

ipcMain.handle("find-query", async (_, query) => {
    return await globalDB.findQuery(query)
})

ipcMain.handle("create-task", async (_, ...args) => {
    return await taskDB.createTask(...args)
})

ipcMain.handle("update-task", async (_, ...args) => {
    return await taskDB.updateTask(...args)
})

ipcMain.handle("check-task", async (_, id, checked) => {
    return await taskDB.checkTask(id, checked)
})

ipcMain.handle("delete-task", async (_, id) => {
    return await taskDB.deleteTask(id)
})

ipcMain.handle("create-text", async (_, ...args) => {
    return await textDB.createText(...args)
})

ipcMain.handle("update-text", async (_, ...args) => {
    return await textDB.updateText(...args)
})

ipcMain.handle("delete-text", async (_, id) => {
    return await textDB.deleteText(id)
})

ipcMain.handle("search", async (_, ...args) => {
    return await textDB.search(...args)
})

ipcMain.handle("create-subject", async (_, ...args) => {
    return subjectDB.createSubject(...args)
})

ipcMain.handle("update-subject", async (_, ...args) => {
    return subjectDB.updateSubject(...args)
})

ipcMain.handle("delete-subject", async (_, id) => {
    return subjectDB.deleteSubject(id)
})

ipcMain.handle("create-grade", async (_, ...args) => {
    return gradeDB.createGrade(...args)
})

ipcMain.handle("update-grade", async (_, ...args) => {
    return gradeDB.updateGrade(...args)
})

ipcMain.handle("delete-grade", async (_, id) => {
    return gradeDB.deleteGrade(id)
})

ipcMain.handle("create-absence", async (_, ...args) => {
    return await absenceDB.createAbsence(...args)
})

ipcMain.handle("delete-absence", async (_, date) => {
    return await absenceDB.deleteAbsence(date)
})