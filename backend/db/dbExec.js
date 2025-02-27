const Response = require("./response")

class dbExec {
    #dbConnection

    constructor(dbConnection) {
        this.#dbConnection = dbConnection
    }

    exec(
        {
            query, 
            values = [], 
            message = {"error":"Error occured while executing query","success":"Query executed successfully"}, 
            frontendMessageCode = {"error":0,"success": 1}, 
            fileOrigin = "dbExec.js", 
            methodOrigin = "exec"
        }
    ){
        return new Promise((resolve, reject) => {
            this.#dbConnection.run(query, values, function (err) {
                if (err) return reject(new Response(false, message.error , frontendMessageCode.error, fileOrigin, methodOrigin, err, this.lastID, this.changes))
                resolve(new Response(true, message.success, frontendMessageCode.success , fileOrigin, methodOrigin, null, this.lastID, this.changes))
            })
        })
    }

    get(
        {
            query,
            values = [],
            message = {"error":"Error occured while getting query","success":"Get executed successfully"}, 
            frontendMessageCode = {"error":0,"success": 1}, 
            fileOrigin = "dbExec.js", 
            methodOrigin = "get"
        }
    ){
        return new Promise((resolve, reject) => {
            this.#dbConnection.all(query, values, function (err, row) {
                if (err) return reject(new Response(false, message.error, frontendMessageCode.error, fileOrigin, methodOrigin, err, this.lastID, this.changes))
                resolve(new Response(true, message.success, frontendMessageCode.success , fileOrigin, methodOrigin, row, this.lastID, this.changes))
            })
        })
    }
}

module.exports = dbExec