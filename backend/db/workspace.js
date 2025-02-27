const Response = require("./response")

class Workspace {
    #dbExec

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(name) {
        const query = "INSERT INTO workspaces (name) VALUES (?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [name], 
                message: {"error":"Error occured while creating workspace", "success":"Workspace created successfully"},
                frontendMessageCode: {"error":2,"success": 3},
                fileOrigin: "workspace.js", 
                methodOrigin: "create"
            }
        )

        await this.change(response.lastID)

        return response
    }

    async change(id) {
        const query = "UPDATE current_workspace SET workspace_id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while changing workspace", "success":"Workspace changed successfully"},
                frontendMessageCode: {"error":6,"success": 7},
                fileOrigin: "workspace.js", 
                methodOrigin: "change"
            }
        )

        return response
    }

    async delete(id){
        const rows = await this.#dbExec.get(
            {
                query: "SELECT * FROM workspaces",
                message: {"error":"Error occured while getting workspaces", "success":"Get workspaces executed successfully"},
                fileOrigin: "workspace.js", 
                methodOrigin: "delete"
            }
        )

        if (rows.data.length === 1) {
            return new Response(false, "You need to have at least one workspace", 8 , "workspace.js", "delete", null, null, null)
        }

        const query = "DELETE FROM workspaces WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while deleting workspace", "success":"Workspace deleted successfully"},
                frontendMessageCode: {"error":4,"success": 5},
                fileOrigin: "workspace.js", 
                methodOrigin: "delete"
            }
        )

        const lastId = await this.#dbExec.get(
            {
                query: "SELECT id FROM workspaces ORDER BY id DESC LIMIT 1",
                message: {"error":"Error occured while getting last id", "success":"Get last id executed successfully"},
                fileOrigin: "workspace.js", 
                methodOrigin: "delete"
            }
        )
        await this.change(lastId.data[0].id)

        return response
    }
}

module.exports = Workspace