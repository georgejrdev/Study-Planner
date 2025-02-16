const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'studyplanner.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");

    db.run(`CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        min_grade REAL NOT NULL,
        max_grade REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grade REAL NOT NULL,
        origin TEXT NOT NULL,
        subjects_id INTEGER NOT NULL,
        FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS absences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        reason TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS texts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        date DATE NOT NULL,
        subjects_id INTEGER,
        FOREIGN KEY (subjects_id) REFERENCES subjects (id) ON DELETE SET NULL ON UPDATE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        text TEXT NOT NULL,
        priority_level INTEGER NOT NULL,
        urgency TEXT NOT NULL,
        impact TEXT NOT NULL,
        checked BOOLEAN NOT NULL
    )`);
    
    console.log("Database connected!");
});

module.exports = db;