const Start = require("./start")

class Global {
    constructor() {}

    async find(workspaceScope, query, values = []) {
        let start = new Start()
        let db

        if (workspaceScope === true) {
            db = await start.getInstanceWorkspaceDb()
        } else {
            db = start.getInstanceControllerDb()
        }

        const response = await db.get(
            {
                query: query,
                values: values,
                message: {"error":"Error occured while getting query", "success":"Get executed successfully"},
                fileOrigin: "global.js", 
                methodOrigin: "find"
            }
        )

        start = null
        db = null

        return response
    }
}

module.exports = Global