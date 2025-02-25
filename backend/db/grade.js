function createGrade(db, subjectId, grade, origin) {
    let query = "INSERT INTO grades (subjects_id, grade, origin) VALUES (?, ?, ?)"
    const values = [subjectId, grade, origin]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function updateGrade(db, id, grade, origin) {
    let query = "UPDATE grades SET grade = ?, origin = ? WHERE id = ?"
    const values = [grade, origin, id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

function deleteGrade(db, id) {
    let query = "DELETE FROM grades WHERE id = ?"
    const values = [id]

    db.run(query, values, function(err) {
        if (err) {
            return [err, null]
        }
    })

    return [null, true]
}

module.exports = {
    createGrade,
    updateGrade,
    deleteGrade
}