const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { app } = require("electron");
const { getLastInsertedId } = require("./init");
const { findQuery } = require("./global");

async function createWorkspace(name) {
    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const db = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    let query = "INSERT INTO workspaces (name) VALUES (?)"
    const values = [name]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    const workspaceLastId = await getLastInsertedId(db, "workspaces");
    const change = changeCurrentWorkspace(workspaceLastId)

    if (change[0] === null) {
        return [change[0], null]
    }


    return [null, true]
}

function changeCurrentWorkspace(id) {
    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const db = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    let query = "UPDATE current_workspace SET workspace_id = ? WHERE id = 1"
    const values = [id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })


    return [null, true]
}

function find(tableName) {
    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const db = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName}`
        
        db.all(query, (err, rows) => {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}


async function deleteWorkspace(id) {
    const dbControllerPath = path.join(app.getPath("userData"), "study-planner-controller.db");
    const db = new sqlite3.Database(dbControllerPath, (err) => {
        if (err) console.error("Error on init DB", err);
    });

    const rows = await findQuery(db, "SELECT * FROM workspaces")
    const totalRows = rows[1].length

    if (totalRows === 1) {
        return ["Você precisa de no mínimo um workspace", null]
    }

    let query = "DELETE FROM workspaces WHERE id = ?"
    const values = [id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    const lastId = await getLastInsertedId(db, "workspaces");
    changeCurrentWorkspace(lastId)


    return [null, true]
}

module.exports = {
    createWorkspace, 
    changeCurrentWorkspace,
    find,
    deleteWorkspace
}