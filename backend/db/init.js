const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require('fs');
const { app } = require("electron");

function findBy(db, tableName, condition) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName} WHERE ${condition}`
        
        db.all(query, (err, rows) => {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}

async function initDB() {
    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const dbController = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    dropUnusedDBFiles(dbController);

    await runQuery(dbController, `
        CREATE TABLE IF NOT EXISTS workspaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
    `);

    await runQuery(dbController, `
        CREATE TABLE IF NOT EXISTS current_workspace (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY(workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);

    try {
        const workspaceCount = await getQuantityLinesOfTable(dbController, "workspaces");
        if (workspaceCount === 0) {
            await runQuery(dbController, `INSERT INTO workspaces (name) VALUES ("Default");`);
        }

        const currentWorkspaceCount = await getQuantityLinesOfTable(dbController, "current_workspace");
        const newWorkspaceCount = await getQuantityLinesOfTable(dbController, "workspaces");
        if ((currentWorkspaceCount === 0) && (newWorkspaceCount > 0)) {
            const workspaceLastId = await getLastInsertedId(dbController, "workspaces");
            if (workspaceLastId !== null) {
                await runQuery(dbController, `INSERT INTO current_workspace (workspace_id) VALUES (${workspaceLastId});`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function getQuantityLinesOfTable(db, table) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS count FROM ${table}`, (err, row) => {
            if (err) return reject(err);
            resolve(row.count);
        });
    });
}

function runQuery(db, query) {
    return new Promise((resolve, reject) => {
        db.run(query, function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

function runSelect(db, query) {
    return new Promise((resolve, reject) => {
        db.get(query, (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

function getLastInsertedId(db, table) {
    return runSelect(db, `SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`)
        .then(row => row ? row.id : null);
}

function getAllDBFiles() {
    return new Promise((resolve, reject) => {
        const folder = path.join(app.getPath("userData"));

        fs.readdir(folder, (err, files) => {
            if (err) {
                console.error('Error on getAllDBFiles', err);
                return reject(err);
            }

            const nameWithoutExtension = files
                .filter(file => path.extname(file) === '.db') 
                .map(file => path.basename(file, '.db'));

            resolve(nameWithoutExtension);
        });
    });
}

async function dropUnusedDBFiles(db) {
    try {
        const files = await getAllDBFiles();

        for (const file of files) {
            if (file !== "study-planner-controller"){
                const [_, rows] = await findBy(db, "workspaces", `name = '${file}'`);
                
                if (rows.length === 0) {
                    const filePath = path.join(app.getPath("userData"), `${file}.db`);
                    
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${file}.db:`, err);
                        } else {
                            console.log(`File deleted: ${file}.db`);
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error on dropUnusedDBFiles:', error);
    }
}

initDB()

module.exports = {
    initDB,
    getLastInsertedId
}