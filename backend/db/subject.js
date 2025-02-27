class Subject {
    #dbExec

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(name, minGrade, maxGrade) {
        const query = "INSERT INTO subjects (name, min_grade, max_grade) VALUES (?, ?, ?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [name, minGrade, maxGrade], 
                message: {"error":"Error occured while creating subject", "success":"Subject created successfully"},
                frontendMessageCode: {"error":9,"success": 10},
                fileOrigin: "subject.js", 
                methodOrigin: "create"
            }
        )

        return response
    }

    async update(id, name) {
        const query = "UPDATE subjects SET name = ? WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [name, id], 
                message: {"error":"Error occured while updating subject", "success":"Subject updated successfully"},
                frontendMessageCode: {"error":11,"success": 12},
                fileOrigin: "subject.js", 
                methodOrigin: "update"
            }
        )

        return response
    }

    async delete(id) {
        const query = "DELETE FROM subjects WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while deleting subject", "success":"Subject deleted successfully"},
                frontendMessageCode: {"error":13,"success": 14},
                fileOrigin: "subject.js", 
                methodOrigin: "delete"
            }
        )

        return response
    }

    async getDataToPerformanceChart() {
        const query = "SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name"
        const response = await this.#dbExec.get(
            {
                query: query, 
                message: {"error":"Error occured while getting data to performance chart", "success":"Get data to performance chart executed successfully"},
                fileOrigin: "subject.js", 
                methodOrigin: "getDataToPerformanceChart"
            }
        )

        return response
    }
}

module.exports = Subject