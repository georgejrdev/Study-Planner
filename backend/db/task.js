const db = require('./connection')

function getPriorityLevel(urgency, impact) {
    urgency = urgency.toUpperCase()
    impact = impact.toUpperCase()
    
    const levels = {
        "HIGH_HIGH": 0, "HIGH_MEDIUM": 1, "HIGH_LOW": 2,
        "MEDIUM_HIGH": 3, "MEDIUM_MEDIUM": 4, "MEDIUM_LOW": 5,
        "LOW_HIGH": 6, "LOW_MEDIUM": 7, "LOW_LOW": 8
    }

    return levels[`${urgency}_${impact}`] !== undefined ? levels[`${urgency}_${impact}`] : 8
}

function createTask(date, text, urgency, impact) {
    return new Promise((resolve, reject) => {
        const priorityLevel = getPriorityLevel(urgency, impact)
        
        let query = "INSERT INTO tasks (date, text, priority_level, urgency, impact, checked) VALUES (?, ?, ?, ?, ?, ?)"
        const values = [date, text, priorityLevel, urgency, impact, false]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

function updateTask(id, date, text, urgency, impact, checked) {
    return new Promise((resolve, reject) => {
        const priorityLevel = getPriorityLevel(urgency, impact)
        
        let query = "UPDATE tasks SET date = ?, text = ?, priority_level = ?, urgency = ?, impact = ?, checked = ? WHERE id = ?"
        const values = [date, text, priorityLevel, urgency, impact, checked, id]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

function checkTask(id, checked) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE tasks SET checked = ? WHERE id = ?"
        const values = [checked, id]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

function deleteTask(id) {
    return new Promise((resolve, reject) => {
        let query = "DELETE FROM tasks WHERE id = ?"
        const values = [id]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

module.exports = { 
    createTask, 
    updateTask, 
    checkTask, 
    deleteTask 
}