const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const { app } = require("electron")
const { initDB } = require("./init")

function findAll(db, tableName) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName}`
        
        db.all(query, (err, rows) => {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}

function findBy(db, tableName, condition) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName} WHERE ${condition}`
        
        db.all(query, (err, rows) => {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}

function findQuery(db, query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}

async function createDefaultStructure(db) {
    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON;");
    
        db.run(`CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            min_grade REAL NOT NULL,
            max_grade REAL NOT NULL
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade REAL NOT NULL,
            origin TEXT NOT NULL,
            subjects_id INTEGER NOT NULL,
            FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE CASCADE ON UPDATE CASCADE
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS absences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            reason TEXT NOT NULL
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS texts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            date DATE NOT NULL,
            subjects_id INTEGER,
            FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE SET NULL ON UPDATE CASCADE
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            text TEXT NOT NULL,
            priority_level INTEGER NOT NULL,
            urgency TEXT NOT NULL,
            impact TEXT NOT NULL,
            checked BOOLEAN NOT NULL
        )`);
    });
}

async function getWorkspaceDBInstace() {
    initDB()

    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const dbController = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    const workspaceObject = await findQuery(dbController, "SELECT w.name FROM current_workspace cw JOIN workspaces w ON cw.workspace_id = w.id ORDER BY cw.id DESC LIMIT 1;")
    const workspaceName = workspaceObject[1][0].name

    const workspaceDB = new sqlite3.Database(path.join(app.getPath("userData"), `${workspaceName}.db`))
    await createDefaultStructure(workspaceDB)
    console.log("LOAD WORKSPACE DB: " + workspaceName)
    return workspaceDB
}

module.exports = { 
    findAll, 
    findBy,
    findQuery,
    createDefaultStructure,
    getWorkspaceDBInstace
}