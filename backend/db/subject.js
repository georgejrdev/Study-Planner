const db = require('./connection') 

function createSubject(name, minGrade, maxGrade) {
    let query = "INSERT INTO subjects (name, min_grade, max_grade) VALUES (?, ?, ?)"
    const values = [name, minGrade, maxGrade]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function updateSubject(id, name) {
    let query = "UPDATE subjects SET name = ? WHERE id = ?"
    const values = [name, id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function deleteSubject(id) {
    let query = "DELETE FROM subjects WHERE id = ?"
    const values = [id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

module.exports = {
    createSubject, 
    updateSubject, 
    deleteSubject
}