class Absence {
    #dbExec

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(date, reason) {
        const query = "INSERT INTO absences (date, reason) VALUES (?, ?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [date, reason], 
                message: {"error":"Error occured while creating absence", "success":"Absence created successfully"},
                frontendMessageCode: {"error":27,"success": 28},
                fileOrigin: "absence.js", 
                methodOrigin: "create"
            }
        )

        return response
    }

    async delete(date) {
        const query = "DELETE FROM absences WHERE date = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [date], 
                message: {"error":"Error occured while deleting absence", "success":"Absence deleted successfully"},
                frontendMessageCode: {"error":29,"success": 30},
                fileOrigin: "absence.js", 
                methodOrigin: "delete"
            }
        )

        return response
    }

    async getDataToAbsenceReasonChart() {
        const query = "SELECT reason, COUNT(*) AS quantity FROM absences GROUP BY reason"
        const response = await this.#dbExec.get(
            {
                query: query,
                message: {"error":"Error occured while getting query", "success":"Get executed successfully"},
                fileOrigin: "absence.js", 
                methodOrigin: "getDataToAbsenceReasonChart"
            }
        )

        return response
    }
}

module.exports = Absence