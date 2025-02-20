const db = require('./connection')

async function createAbsence(date, reason) {
    try {
        await new Promise((resolve, reject) => {
            let query = "INSERT INTO absences (date, reason) VALUES (?, ?)"
            
            db.run(query, [date, reason], function (err) {
                if (err) return reject([err, null])
                resolve([null, true])
            })
        })

        return [null, true]
    } catch (error) {
        return error
    }
}

async function deleteAbsence(date) {
    try {
        await new Promise((resolve, reject) => {
            let query = "DELETE FROM absences WHERE date = ?"
            
            db.run(query, [date], function (err) {
                if (err) return reject([err, null])
                resolve([null, true])
            })
        })

        return [null, true]
    } catch (error) {
        return error
    }
}

module.exports = {
    createAbsence,
    deleteAbsence
}