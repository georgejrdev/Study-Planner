const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const { app } = require("electron")
const fs = require("fs")

const dbExec = require("./dbExec")

class Start {

    constructor() {}

    async initProgram() {
        this.#deleteUnusedDbFiles()

        const dbControllerExec = this.getInstanceControllerDb()
        
        await dbControllerExec.exec(
            {
                query: ` 
                    CREATE TABLE IF NOT EXISTS workspaces (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    )`,
                message: {"error":"Error occured while creating workspaces table", "success":"Workspaces table created successfully"},
                fileOrigin: "start.js", 
                methodOrigin: "initProgram"
            }
        )

        await dbControllerExec.exec(
            {
                query: `
                    CREATE TABLE IF NOT EXISTS current_workspace (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        workspace_id INTEGER NOT NULL,
                        FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
                    )`,
                message: {"error":"Error occured while creating current_workspace table", "success":"Current_workspace table created successfully"},
                fileOrigin: "start.js", 
                methodOrigin: "initProgram"
            }
        )

        const workspaceCount = await dbControllerExec.get(
            {
                query: "SELECT * FROM workspaces",
                message: {"error":"Error occured while getting workspaces", "success":"Get workspaces executed successfully"},
                fileOrigin: "start.js", 
                methodOrigin: "initProgram"
            }
        )
        
        if (workspaceCount.data.length === 0) {
            await dbControllerExec.exec(
                {
                    query: "INSERT INTO workspaces (name) VALUES (?)", 
                    values: ["Default"],
                    message: {"error":"Error occured while creating default workspace", "success":"Default workspace created successfully"},
                    fileOrigin: "start.js", 
                    methodOrigin: "initProgram"
                }
            )
        }
        
        const currentWorkspaceCount = await dbControllerExec.get(
            {
                query: "SELECT * FROM current_workspace",
                message: {"error":"Error occured while getting current_workspace", "success":"Get current_workspace executed successfully"},
                fileOrigin: "start.js", 
                methodOrigin: "initProgram"
            }
        )
        const newWorkspaceCount = await dbControllerExec.get(
            {
                query: "SELECT * FROM workspaces",
                message: {"error":"Error occured while getting workspaces", "success":"Get workspaces executed successfully"},
                fileOrigin: "start.js", 
                methodOrigin: "initProgram"
            }
        )
        
        if (currentWorkspaceCount.data.length === 0 && newWorkspaceCount.data.length > 0) {
            const lastID = await dbControllerExec.get(
                {
                    query: "SELECT id FROM workspaces ORDER BY id DESC LIMIT 1",
                    message: {"error":"Error occured while getting last id", "success":"Get last id executed successfully"},
                    fileOrigin: "start.js", 
                    methodOrigin: "initProgram"
                }
            )
            await dbControllerExec.exec(
                {
                    query: "INSERT INTO current_workspace (workspace_id) VALUES (?)",
                    values: [lastID.data[0].id],
                    message: {"error":"Error occured while creating current_workspace", "success":"Current_workspace created successfully"},
                    fileOrigin: "start.js", 
                    methodOrigin: "initProgram"
                }
            )
        }
    }

    getInstanceControllerDb() {
        const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db")
        const dbControllerConnection = new sqlite3.Database(dbControllerPath, (err) => {
            if (err) console.error("Error on init controller DB", err)
        })

        return new dbExec(dbControllerConnection)
    }

    async getInstanceWorkspaceDb() {
        try {
            const dbControllerExec = this.getInstanceControllerDb()
            const query = "SELECT w.name FROM current_workspace cw JOIN workspaces w ON cw.workspace_id = w.id ORDER BY cw.id DESC LIMIT 1"

            const response = await dbControllerExec.get(
                {
                    query: query,
                    message: {"error":"Error occured while getting current workspace", "success":"Get current workspace executed successfully"},
                    fileOrigin: "start.js", 
                    methodOrigin: "getInstanceWorkspaceDb"
                }
            )
            if (response.status === false) return null

            const workspaceName = response.data[0].name
            const workspaceDbPath = path.join(app.getPath("userData"), `${workspaceName}.db`)
            const workspaceDbConnection = new sqlite3.Database(workspaceDbPath, (err) => {
                if (err) console.error("Error on init workspace DB", err)
            })

            await this.#createDefaultWorkspaceTableStructure(workspaceDbConnection)

            return new dbExec(workspaceDbConnection)

        } catch (err) {
            console.error("Error in getInstanceWorkspaceDb:", err)
            return null
        }
    }

    async #createDefaultWorkspaceTableStructure(dbConnection){
        dbConnection.serialize(() => {
            dbConnection.run("PRAGMA foreign_keys = ON;")
        
            dbConnection.run(`CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                min_grade REAL NOT NULL,
                max_grade REAL NOT NULL
            );`)
        
            dbConnection.run(`CREATE TABLE IF NOT EXISTS grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                grade REAL NOT NULL,
                origin TEXT NOT NULL,
                subjects_id INTEGER NOT NULL,
                FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE CASCADE ON UPDATE CASCADE
            );`)
        
            dbConnection.run(`CREATE TABLE IF NOT EXISTS absences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                reason TEXT NOT NULL
            );`)
        
            dbConnection.run(`CREATE TABLE IF NOT EXISTS texts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                date DATE NOT NULL,
                subjects_id INTEGER,
                FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE SET NULL ON UPDATE CASCADE
            );`)
        
            dbConnection.run(`CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                text TEXT NOT NULL,
                priority_level INTEGER NOT NULL,
                urgency TEXT NOT NULL,
                impact TEXT NOT NULL,
                checked BOOLEAN NOT NULL
            );`)
        })
    }

    async #deleteUnusedDbFiles() {
        try {
            const files = await this.#getAllDBFiles()

            
            for (const file of files) {
                if (file !== "study-planner-controller"){
                    const dbControllerExec = this.getInstanceControllerDb()
                    const response = await dbControllerExec.get(
                        {
                            query: "SELECT * FROM workspaces WHERE name = ?", 
                            values:[file],
                            message: {"error":"Error occured while getting workspaces", "success":"Get workspaces executed successfully"},
                            fileOrigin: "start.js", 
                            methodOrigin: "deleteUnusedDbFiles"
                        }
                    )                    
                    
                    if (!response.data || response.data.length === 0) {
                        const filePath = path.join(app.getPath("userData"), `${file}.db`)

                        if (fs.existsSync(filePath)) {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error(`Error deleting file ${file}.db:`, err)
                                } else {
                                    console.log(`File deleted: ${file}.db`)
                                }
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error on dropUnusedDBFiles:', error)
        }
    }

    #getAllDBFiles() {
        return new Promise((resolve, reject) => {
            const folder = path.join(app.getPath("userData"))

            fs.readdir(folder, (err, files) => {
                if (err) {
                    console.error('Error on getAllDBFiles', err)
                    return reject(null)
                }

                const nameWithoutExtension = files
                    .filter(file => path.extname(file) === '.db') 
                    .map(file => path.basename(file, '.db'))

                resolve(nameWithoutExtension)
            })
        })
    }
}

module.exports = Start