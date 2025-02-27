class Text {
    #dbExec 

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(subjectId, title, text, date) {
        const query = "INSERT INTO texts (subjects_id, title, text, date) VALUES (?, ?, ?, ?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [subjectId, title, text, date], 
                message: {"error":"Error occured while creating text", "success":"Text created successfully"},
                frontendMessageCode: {"error":31,"success": 32},
                fileOrigin: "text.js", 
                methodOrigin: "create"
            }
        )

        return response
    }

    async update(id, subjectId, title, text) {
        const query = "UPDATE texts SET subjects_id = ?, title = ?, text = ? WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [subjectId, title, text, id], 
                message: {"error":"Error occured while updating text", "success":"Text updated successfully"},
                frontendMessageCode: {"error":33,"success": 34},
                fileOrigin: "text.js", 
                methodOrigin: "update"
            }
        )

        return response
    }

    async search(input) {
        const query = "SELECT texts.id, texts.title, texts.text, texts.date, subjects.name AS subject_name FROM texts LEFT JOIN subjects ON texts.subjects_id = subjects.id WHERE texts.title LIKE ? OR texts.text LIKE ? OR texts.date LIKE ? OR subjects.name LIKE ?"
        const response = await this.#dbExec.get(
            {
                query: query, 
                values: [`%${input}%`, `%${input}%`, `%${input}%`, `%${input}%`], 
                message: {"error":"Error occured while searching text", "success":"Text searched successfully"},
                fileOrigin: "text.js", 
                methodOrigin: "search"
            }
        )

        return response
    }

    async delete(id) {
        const query = "DELETE FROM texts WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while deleting text", "success":"Text deleted successfully"},
                frontendMessageCode: {"error":35,"success": 36},
                fileOrigin: "text.js", 
                methodOrigin: "delete"
            }
        )

        return response
    }

    async getDataToTextSubjectChart() {
        const query = "SELECT COALESCE(s.name, 'Nenhuma') AS subject_name, COUNT(t.id) AS text_count FROM texts t LEFT JOIN subjects s ON t.subjects_id = s.id GROUP BY subject_name"
        const response = await this.#dbExec.get(
            {
                query: query, 
                message: {"error":"Error occured while getting data to text subject chart", "success":"Get data to text subject chart executed successfully"},
                fileOrigin: "text.js", 
                methodOrigin: "getDataToTextSubjectChart"
            }
        )

        return response
    }

    async getDataToTetDistributionOverTimeChart() {
        const query = "SELECT date, COUNT(id) AS text_count FROM texts GROUP BY date ORDER BY date"
        const response = await this.#dbExec.get(
            {
                query: query, 
                message: {"error":"Error occured while getting data to tet distribution over time chart", "success":"Get data to tet distribution over time chart executed successfully"},
                fileOrigin: "text.js", 
                methodOrigin: "getDataToTetDistributionOverTimeChart"
            }
        )

        return response
    }
}

module.exports = Text