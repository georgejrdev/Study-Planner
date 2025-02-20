const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

const program = require("./backend/defaultValues")
const globalDB = require("./backend/db/global");
const taskDB = require("./backend/db/task");
const textDB = require("./backend/db/text");
const gradeDB = require("./backend/db/grade");
const absenceDB = require("./backend/db/absence");

let mainWindow;

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
    });

    Menu.setApplicationMenu(null);
    mainWindow.loadFile("./view/index.html");
});

ipcMain.handle("get-version", () => {
    return program.getVersion();
})

ipcMain.handle("find-all", async (_, tableName) => {
    return await globalDB.findAll(tableName);
});

ipcMain.handle("find-by", async (_, tableName, condition) => {
    return await globalDB.findBy(tableName, condition);
});

ipcMain.handle("find-query", async (_, query) => {
    return await globalDB.findQuery(query);
});

ipcMain.handle("create-task", async (_, ...args) => {
    return await taskDB.createTask(...args);
});

ipcMain.handle("mark-task-checked", async (_, id, checked) => {
    return await taskDB.markTaskAsChecked(id, checked);
});

ipcMain.handle("update-task", async (_, ...args) => {
    return await taskDB.updateTask(...args);
});

ipcMain.handle("remove-task", async (_, id) => {
    return await taskDB.removeTask(id);
});

ipcMain.handle("create-text", async (_, ...args) => {
    return await textDB.createText(...args);
});

ipcMain.handle("update-text", async (_, ...args) => {
    return await textDB.updateText(...args);
});

ipcMain.handle("remove-text", async (_, id) => {
    return await textDB.removeText(id);
});

ipcMain.handle("full-text-search", async (_, ...args) => {
    return await textDB.fullTextSearch(...args);
});

ipcMain.handle("create-subject", async (_, ...args) => {
    return await gradeDB.createSubject(...args);
});

ipcMain.handle("update-subject-name", async (_, ...args) => {
    return await gradeDB.updateSubjectName(...args);
});

ipcMain.handle("remove-subject", async (_, id) => {
    return await gradeDB.removeSubject(id);
});

ipcMain.handle("register-grade", async (_, ...args) => {
    return await gradeDB.registerGrade(...args);
});

ipcMain.handle("remove-grade", async (_, id) => {
    return await gradeDB.removeGrade(id);
});

ipcMain.handle("update-grade", async (_, ...args) => {
    return await gradeDB.updateGrade(...args);
});

ipcMain.handle("register-absence", async (_, ...args) => {
    return await absenceDB.registerAbsence(...args);
});

ipcMain.handle("remove-absence", async (_, date) => {
    return await absenceDB.removeAbsence(date);
});