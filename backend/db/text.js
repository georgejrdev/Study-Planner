function createText(db, subject_id, title, text, date) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO texts (subjects_id, title, text, date) VALUES (?, ?, ?, ?)"
        const values = [subject_id, title, text, date]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

function updateText(db, id, subject_id, title, text) {
    return new Promise((resolve, reject) => {
        let query = "UPDATE texts SET subjects_id = ?, title = ?, text = ? WHERE id = ?"
        const values = [subject_id, title, text, id]

        db.run(query, values, function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

function search(db, input){
    return new Promise((resolve, reject) => {
        let query = "SELECT texts.id, texts.title, texts.text, texts.date, subjects.name AS subject_name FROM texts LEFT JOIN subjects ON texts.subjects_id = subjects.id WHERE texts.title LIKE ? OR texts.text LIKE ? OR texts.date LIKE ? OR subjects.name LIKE ?"
        const values = [`%${input}%`, `%${input}%`, `%${input}%`, `%${input}%`]
        
        db.all(query, values, function (err, rows) {
            if (err) return reject([err, null])
            resolve([null, rows])
        })
    })
}

function deleteText(db, id) {
    return new Promise((resolve, reject) => {
        let query = "DELETE FROM texts WHERE id = ?"
        
        db.run(query, [id], function (err) {
            if (err) return reject([err, null])
            resolve([null, true])
        })
    })
}

module.exports = { 
    createText, 
    updateText, 
    search,
    deleteText
}