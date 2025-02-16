const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    global: {
        findAll: (table) => ipcRenderer.invoke('find-all', table),
        findBy: (table, condition) => ipcRenderer.invoke('find-by', table, condition),
        findQuery: (query) => ipcRenderer.invoke('find-query', query),
    },
    tasks: {
        createTask: (date, text, urgency, impact) => ipcRenderer.invoke('create-task', date, text, urgency, impact),
        markTaskAsChecked: (id, checked) => ipcRenderer.invoke('mark-task-checked', id, checked),
        updateTask: (id, date, text, urgency, impact, checked) => ipcRenderer.invoke('update-task', id, date, text, urgency, impact, checked),
        removeTask: (id) => ipcRenderer.invoke('remove-task', id),
    },
    texts: {
        createText: (subject_id, title, text, date) => ipcRenderer.invoke('create-text', subject_id, title, text, date),
        updateText: (id, subject_id, title, text) => ipcRenderer.invoke('update-text', id, subject_id, title, text),
        removeText: (id) => ipcRenderer.invoke('remove-text', id),
        fullTextSearch: (input) => ipcRenderer.invoke('full-text-search', input),
    },
    grades: {
        createSubject: (name, minGrade, maxGrade) => ipcRenderer.invoke('create-subject', name, minGrade, maxGrade),
        registerGrade: (subjectId, grade, origin) => ipcRenderer.invoke('register-grade', subjectId, grade, origin),
        removeGrade: (id) => ipcRenderer.invoke('remove-grade', id),
        updateGrade: (id, grade, origin) => ipcRenderer.invoke('update-grade', id, grade, origin),
        updateSubjectName: (id, name) => ipcRenderer.invoke('update-subject-name', id, name),
        removeSubject: (id) => ipcRenderer.invoke('remove-subject', id),
    },
    absences: {
        registerAbsence: (date, reason) => ipcRenderer.invoke('register-absence', date, reason),
        removeAbsence: (date) => ipcRenderer.invoke('remove-absence', date),
    }
});