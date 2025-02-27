class Task {
    #dbExec

    constructor(dbExec) {
        this.#dbExec = dbExec
    }

    async create(date, text, urgency, impact) {
        const priorityLevel = this.#getPriorityLevel(urgency, impact)
        const query = "INSERT INTO tasks (date, text, priority_level, urgency, impact, checked) VALUES (?, ?, ?, ?, ?, ?)"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [date, text, priorityLevel, urgency, impact, false], 
                message: {"error":"Error occured while creating task", "success":"Task created successfully"},
                frontendMessageCode: {"error":21,"success": 22},
                fileOrigin: "task.js", 
                methodOrigin: "create"
            }
        )

        return response
    }

    async update(id, date, text, urgency, impact, checked) {
        const priorityLevel = this.#getPriorityLevel(urgency, impact)
        const query = "UPDATE tasks SET date = ?, text = ?, priority_level = ?, urgency = ?, impact = ?, checked = ? WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [date, text, priorityLevel, urgency, impact, checked, id], 
                message: {"error":"Error occured while updating task", "success":"Task updated successfully"},
                frontendMessageCode: {"error":23,"success": 24},
                fileOrigin: "task.js", 
                methodOrigin: "update"
            }
        )

        return response
    }

    async delete(id) {
        const query = "DELETE FROM tasks WHERE id = ?"
        const response = await this.#dbExec.exec(
            {
                query: query, 
                values: [id], 
                message: {"error":"Error occured while deleting task", "success":"Task deleted successfully"},
                frontendMessageCode: {"error":25,"success": 26},
                fileOrigin: "task.js", 
                methodOrigin: "delete"
            }
        )   

        return response
    }

    async getDataToPriorityChart() {
        const query = "SELECT priority_level, COUNT(*) AS task_count FROM tasks WHERE checked = 0 GROUP BY priority_level"
        const response = await this.#dbExec.get(
            {
                query: query, 
                message: {"error":"Error occured while getting data to priority chart", "success":"Get data to priority chart executed successfully"},
                fileOrigin: "task.js", 
                methodOrigin: "getDataToPriorityChart"
            }
        )

        return response
    }

    #getPriorityLevel(urgency, impact) {
        urgency = urgency.toUpperCase()
        impact = impact.toUpperCase()
        
        const levels = {
            "HIGH_HIGH": 0, "HIGH_MEDIUM": 1, "HIGH_LOW": 2,
            "MEDIUM_HIGH": 3, "MEDIUM_MEDIUM": 4, "MEDIUM_LOW": 5,
            "LOW_HIGH": 6, "LOW_MEDIUM": 7, "LOW_LOW": 8
        }
    
        return levels[`${urgency}_${impact}`] !== undefined ? levels[`${urgency}_${impact}`] : 8
    }
}

module.exports = Task