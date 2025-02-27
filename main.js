const { app, BrowserWindow, Menu, ipcMain } = require("electron")
const path = require("path")

const program = require("./backend/defaultValues")
const updater = require("./update")

// const run = require("./backend/tests/test")
// run()

const Start = require("./backend/db/start")
const Global = require("./backend/db/global")
const Workspace = require("./backend/db/workspace")
const Subject = require("./backend/db/subject")
const Task = require("./backend/db/task")
const Absence = require("./backend/db/absence")
const Grade = require("./backend/db/grade")
const Text = require("./backend/db/text")

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

    //Menu.setApplicationMenu(null)
    mainWindow.loadFile("./view/index.html")
})

async function init() {
    const initStart = new Start()
    await initStart.initProgram()
}

init()

ipcMain.handle("get-version", () => {
    return program.getVersion()
})

ipcMain.handle("is-new-release", async () => {
    return await updater.isNewRelease()
})

ipcMain.handle("update", async () => {
    return await updater.update()
})

ipcMain.handle("global-find", async (_, workspaceScope, query, values) => {
    let globalInstance = new Global()
    const response = await globalInstance.find(workspaceScope, query, values)

    globalInstance = null

    return response.toJSON()
})

ipcMain.handle("workspace-create", async (_, name) => {
    let start = new Start()
    let dbExec = start.getInstanceControllerDb()
    let workspaceInstance = new Workspace(dbExec)
    const response = await workspaceInstance.create(name)

    workspaceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("workspace-change", async (_, id) => {
    let start = new Start()
    let dbExec = start.getInstanceControllerDb()
    let workspaceInstance = new Workspace(dbExec)
    const response = await workspaceInstance.change(id)

    workspaceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("workspace-delete", async (_, id) => {
    let start = new Start()
    let dbExec = start.getInstanceControllerDb()
    let workspaceInstance = new Workspace(dbExec)
    const response = await workspaceInstance.delete(id)

    workspaceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("subject-create", async (_, name, minGrade, maxGrade) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let subjectInstance = new Subject(dbExec)
    const response = await subjectInstance.create(name, minGrade, maxGrade)

    subjectInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("subject-update", async (_, id, name) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let subjectInstance = new Subject(dbExec)
    const response = await subjectInstance.update(id, name)

    subjectInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("subject-delete", async (_, id) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let subjectInstance = new Subject(dbExec)
    const response = await subjectInstance.delete(id)

    subjectInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("subject-get-data-to-performance-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let subjectInstance = new Subject(dbExec)
    const response = await subjectInstance.getDataToPerformanceChart()

    subjectInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("task-create", async (_, date, text, urgency, impact) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let taskInstance = new Task(dbExec)
    const response = await taskInstance.create(date, text, urgency, impact)

    taskInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("task-update", async (_, id, date, text, urgency, impact, checked) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let taskInstance = new Task(dbExec)
    const response = await taskInstance.update(id, date, text, urgency, impact, checked)

    taskInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("task-delete", async (_, id) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let taskInstance = new Task(dbExec)
    const response = await taskInstance.delete(id)

    taskInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("task-get-data-to-priority-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let taskInstance = new Task(dbExec)
    const response = await taskInstance.getDataToPriorityChart()

    taskInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("absence-create", async (_, date, reason) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let absenceInstance = new Absence(dbExec)
    const response = await absenceInstance.create(date, reason)

    absenceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("absence-delete", async (_, date) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let absenceInstance = new Absence(dbExec)
    const response = await absenceInstance.delete(date)

    absenceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("absence-get-data-to-absence-reason-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let absenceInstance = new Absence(dbExec)
    const response = await absenceInstance.getDataToAbsenceReasonChart()

    absenceInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("grade-create", async (_, subjectId, grade, origin) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let gradeInstance = new Grade(dbExec)
    const response = await gradeInstance.create(subjectId, grade, origin)

    gradeInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("grade-update", async (_, id, grade, origin) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let gradeInstance = new Grade(dbExec)
    const response = await gradeInstance.update(id, grade, origin)

    gradeInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("grade-delete", async (_, id) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let gradeInstance = new Grade(dbExec)
    const response = await gradeInstance.delete(id)

    gradeInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("grade-get-data-to-grade-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let gradeInstance = new Grade(dbExec)
    const response = await gradeInstance.getDataToGradeChart()

    gradeInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-create", async (_, subjectId, title, text, date) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.create(subjectId, title, text, date)

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-update", async (_, id, subjectId, title, text) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.update(id, subjectId, title, text)

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-search", async (_, input) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.search(input)

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-delete", async (_, id) => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.delete(id)

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-get-data-to-text-subject-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.getDataToTextSubjectChart()

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})

ipcMain.handle("text-get-data-to-tet-distribution-over-time-chart", async () => {
    let start = new Start()
    let dbExec = await start.getInstanceWorkspaceDb()
    let textInstance = new Text(dbExec)
    const response = await textInstance.getDataToTetDistributionOverTimeChart()

    textInstance = null
    dbExec = null
    start = null

    return response.toJSON()
})