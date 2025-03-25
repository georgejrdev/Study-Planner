const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    program: {
        getVersion: () => ipcRenderer.invoke("get-version"),
        // isNewRelease: () => ipcRenderer.invoke("is-new-release"),
        // update: () => ipcRenderer.invoke("update"),
    },
    db: {
        global: {
            find: (workspaceScope, query, values) => ipcRenderer.invoke("global-find", workspaceScope, query, values),
        },
        workspace: {
            create: (name) => ipcRenderer.invoke("workspace-create", name),
            change: (id) => ipcRenderer.invoke("workspace-change", id),
            delete: (id) => ipcRenderer.invoke("workspace-delete", id),
        },
        subject: {
            create: (name, minGrade, maxGrade) => ipcRenderer.invoke("subject-create", name, minGrade, maxGrade),
            update: (id, name) => ipcRenderer.invoke("subject-update", id, name),
            delete: (id) => ipcRenderer.invoke("subject-delete", id),
            getDataToPerformanceChart: () => ipcRenderer.invoke("subject-get-data-to-performance-chart"),
        },
        task: {
            create: (date, text, urgency, impact) => ipcRenderer.invoke("task-create", date, text, urgency, impact),
            update: (id, date, text, urgency, impact, checked) => ipcRenderer.invoke("task-update", id, date, text, urgency, impact, checked),
            delete: (id) => ipcRenderer.invoke("task-delete", id),
            getDataToPriorityChart: () => ipcRenderer.invoke("task-get-data-to-priority-chart"),
        },
        absence: {
            create: (date, reason) => ipcRenderer.invoke("absence-create", date, reason),
            delete: (date) => ipcRenderer.invoke("absence-delete", date),
            getDataToAbsenceReasonChart: () => ipcRenderer.invoke("absence-get-data-to-absence-reason-chart"),
        },
        grade: {
            create: (subjectId, grade, origin) => ipcRenderer.invoke("grade-create", subjectId, grade, origin),
            update: (id, grade, origin) => ipcRenderer.invoke("grade-update", id, grade, origin),
            delete: (id) => ipcRenderer.invoke("grade-delete", id),
            getDataToGradeChart: () => ipcRenderer.invoke("grade-get-data-to-grade-chart"),
        },
        text: {
            create: (subjectId, title, text, date) => ipcRenderer.invoke("text-create", subjectId, title, text, date),
            update: (id, subjectId, title, text) => ipcRenderer.invoke("text-update", id, subjectId, title, text),
            search: (input) => ipcRenderer.invoke("text-search", input),
            delete: (id) => ipcRenderer.invoke("text-delete", id),
            getDataToTextSubjectChart: () => ipcRenderer.invoke("text-get-data-to-text-subject-chart"),
            getDataToTetDistributionOverTimeChart: () => ipcRenderer.invoke("text-get-data-to-tet-distribution-over-time-chart"),
        }
    }
})