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

function registerGrade(subjectId, grade, origin) {
    let query = "INSERT INTO grades (subjects_id, grade, origin) VALUES (?, ?, ?)"
    const values = [subjectId, grade, origin]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function updateGrade(id, grade, origin) {
    let query = "UPDATE grades SET grade = ?, origin = ? WHERE id = ?"
    const values = [grade, origin, id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function removeGrade(id) {
    let query = "DELETE FROM grades WHERE id = ?"
    const values = [id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function updateSubjectName(id, name) {
    let query = "UPDATE subjects SET name = ? WHERE id = ?"
    const values = [name, id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function removeSubject(id) {
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
    registerGrade,
    updateGrade,
    removeGrade,
    updateSubjectName,
    removeSubject
}