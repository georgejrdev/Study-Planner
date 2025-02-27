class Grade {
    #dbExec

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(subjectId, grade, origin) {
        const query = "INSERT INTO grades (subjects_id, grade, origin) VALUES (?, ?, ?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [subjectId, grade, origin], 
                message: {"error":"Error occured while creating grade", "success":"Grade created successfully"},
                frontendMessageCode: {"error":15,"success": 16},
                fileOrigin: "grade.js", 
                methodOrigin: "create"
            }
        )

        return response
    }

    async update(id, grade, origin) {
        const query = "UPDATE grades SET grade = ?, origin = ? WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [grade, origin, id], 
                message: {"error":"Error occured while updating grade", "success":"Grade updated successfully"},
                frontendMessageCode: {"error":17,"success": 18},
                fileOrigin: "grade.js", 
                methodOrigin: "update"
            }
        )

        return response
    }

    async delete(id) {
        const query = "DELETE FROM grades WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while deleting grade", "success":"Grade deleted successfully"},
                frontendMessageCode: {"error":19,"success": 20},
                fileOrigin: "grade.js", 
                methodOrigin: "delete"
            }
        )

        return response
    }

    async getDataToGradeChart() {
        const query = "SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name ORDER BY s.id DESC LIMIT 3"
        const response = await this.#dbExec.get(
            {
                query: query, 
                message: {"error":"Error occured while getting data to grade chart", "success":"Get data to grade chart executed successfully"},
                fileOrigin: "grade.js", 
                methodOrigin: "getDataToGradeChart"
            }
        )
        
        return response
    }
}

module.exports = Grade