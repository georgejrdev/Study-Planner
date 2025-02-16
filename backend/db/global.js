const db = require('./connection');

function findAll(tableName) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName}`;
        db.all(query, (err, rows) => {
            if (err) return reject([err, null]);
            resolve([null, rows]);
        });
    });
}

function findBy(tableName, condition) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${tableName} WHERE ${condition}`;
        db.all(query, (err, rows) => {
            if (err) return reject([err, null]);
            resolve([null, rows]);
        });
    });
}

function findQuery(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) return reject([err, null]);
            resolve([null, rows]);
        });
    });
}

module.exports = { findAll, findBy, findQuery };