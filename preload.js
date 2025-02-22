const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    program: {
        getVersion: () => ipcRenderer.invoke("get-version"),
        isNewRelease: () => ipcRenderer.invoke("is-new-release"),
        update: () => ipcRenderer.invoke("update"),
    },
    db: {
        global: {
            findAll: (table) => ipcRenderer.invoke("find-all", table),
            findBy: (table, condition) => ipcRenderer.invoke("find-by", table, condition),
            findQuery: (query) => ipcRenderer.invoke("find-query", query),
        },
        task: {
            createTask: (date, text, urgency, impact) => ipcRenderer.invoke("create-task", date, text, urgency, impact),
            checkTask: (id, checked) => ipcRenderer.invoke("check-task", id, checked),
            updateTask: (id, date, text, urgency, impact, checked) => ipcRenderer.invoke("update-task", id, date, text, urgency, impact, checked),
            deleteTask: (id) => ipcRenderer.invoke("delete-task", id),
        },
        text: {
            createText: (subject_id, title, text, date) => ipcRenderer.invoke("create-text", subject_id, title, text, date),
            updateText: (id, subject_id, title, text) => ipcRenderer.invoke("update-text", id, subject_id, title, text),
            deleteText: (id) => ipcRenderer.invoke("delete-text", id),
            search: (input) => ipcRenderer.invoke("search", input),
        },
        subject: {
            createSubject: (name, minGrade, maxGrade) => ipcRenderer.invoke("create-subject", name, minGrade, maxGrade),
            updateSubject: (id, name) => ipcRenderer.invoke("update-subject", id, name),
            deleteSubject: (id) => ipcRenderer.invoke("delete-subject", id),
        },
        grade: {
            createGrade: (subjectId, grade, origin) => ipcRenderer.invoke("create-grade", subjectId, grade, origin),
            updateGrade: (id, grade, origin) => ipcRenderer.invoke("update-grade", id, grade, origin),
            deleteGrade: (id) => ipcRenderer.invoke("delete-grade", id),
        },
        absence: {
            createAbsence: (date, reason) => ipcRenderer.invoke("create-absence", date, reason),
            deleteAbsence: (date) => ipcRenderer.invoke("delete-absence", date),
        }
    }
})