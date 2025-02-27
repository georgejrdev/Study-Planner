const Start = require("../db/start")
const Global = require("../db/global")
const Workspace = require("../db/workspace")
const Subject = require("../db/subject")
const Task = require("../db/task")
const Absence = require("../db/absence")
const Grade = require("../db/grade")
const Text = require("../db/text")

async function run() {
    let ok = 0
    let err = 0

    const startInstance = new Start()
    await startInstance.initProgram()
    const dbController = startInstance.getInstanceControllerDb()

    const workspaceInstance = new Workspace(dbController)
    const workspaceCreate1 = await workspaceInstance.create("TestWorkspaceTest"+Math.floor(Math.random() * 1000))
    workspaceCreate1.showLog()
    if (workspaceCreate1.status === true) ok++
    else err++

    const globalInstance = new Global()
    const globalFind = await globalInstance.find(false, "SELECT * FROM workspaces WHERE id = ?", [workspaceCreate1.lastID])
    globalFind.showLog()
    if (globalFind.status === true) ok++
    else err++

    const workspaceCreate2 = await workspaceInstance.create("TestWorkspaceTest"+Math.floor(Math.random() * 1000))
    workspaceCreate2.showLog()
    if (workspaceCreate1.status === true) ok++
    else err++

    const workspaceChange = await workspaceInstance.change(workspaceCreate2.lastID)
    workspaceChange.showLog()
    if (workspaceChange.status === true) ok++
    else err++

    const workspaceDelete1 = await workspaceInstance.delete(workspaceCreate1.lastID)
    workspaceDelete1.showLog()
    if (workspaceDelete1.status === true) ok++
    else err++

    const dbWorkspace = await startInstance.getInstanceWorkspaceDb()

    const subjectInstance = new Subject(dbWorkspace)

    const subjectCreate = await subjectInstance.create("Subject 1", 1, 10)
    subjectCreate.showLog()
    if (subjectCreate.status === true) ok++
    else err++

    const subjectUpdate = await subjectInstance.update(subjectCreate.lastID, "Subject 2")
    subjectUpdate.showLog()
    if (subjectUpdate.status === true) ok++
    else err++

    const subjectPerformanceChart = await subjectInstance.getDataToPerformanceChart()
    subjectPerformanceChart.showLog()
    if (subjectPerformanceChart.status === true) ok++
    else err++

    const taskInstance = new Task(dbWorkspace)

    const taskCreate = await taskInstance.create("2023-01-02", "Task 1", "LOW", "LOW")
    taskCreate.showLog()
    if (taskCreate.status === true) ok++
    else err++

    const taskUpdate = await taskInstance.update(taskCreate.lastID, "2023-01-03", "Task 2", "MEDIUM", "MEDIUM", true)
    taskUpdate.showLog()
    if (taskUpdate.status === true) ok++
    else err++

    const taskPriorityChart = await taskInstance.getDataToPriorityChart()
    taskPriorityChart.showLog()
    if (taskPriorityChart.status === true) ok++
    else err++

    const taskDelete = await taskInstance.delete(taskCreate.lastID)
    taskDelete.showLog()
    if (taskDelete.status === true) ok++
    else err++

    const absenceInstance = new Absence(dbWorkspace)

    const absenceCreate = await absenceInstance.create("2023-01-04", "Yes baby")
    absenceCreate.showLog()
    if (absenceCreate.status === true) ok++
    else err++

    const absenceReasonChart = await absenceInstance.getDataToAbsenceReasonChart()
    absenceReasonChart.showLog()
    if (absenceReasonChart.status === true) ok++
    else err++

    const absenceDelete = await absenceInstance.delete("2023-01-04")
    absenceDelete.showLog()
    if (absenceDelete.status === true) ok++
    else err++

    const gradeInstance = new Grade(dbWorkspace)

    const gradeCreate = await gradeInstance.create(subjectCreate.lastID, 10, "origin")
    gradeCreate.showLog()
    if (gradeCreate.status === true) ok++
    else err++

    const gradeUpdate = await gradeInstance.update(gradeCreate.lastID, 7, "origin2")
    gradeUpdate.showLog()
    if (gradeUpdate.status === true) ok++
    else err++

    const gradeChart = await gradeInstance.getDataToGradeChart()
    gradeChart.showLog()
    if (gradeChart.status === true) ok++
    else err++

    const gradeDelete = await gradeInstance.delete(gradeCreate.lastID)
    gradeDelete.showLog()
    if (gradeDelete.status === true) ok++
    else err++

    const textInstance = new Text(dbWorkspace)

    const textCreate = await textInstance.create(subjectCreate.lastID, "Title 1", "Text 1", "2023-01-05")
    textCreate.showLog()
    if (textCreate.status === true) ok++
    else err++

    const textUpdate = await textInstance.update(textCreate.lastID, subjectCreate.lastID, "Title 2", "Text 2")
    textUpdate.showLog()
    if (textUpdate.status === true) ok++
    else err++

    const textSearch = await textInstance.search("2")
    textSearch.showLog()
    if (textSearch.status === true) ok++
    else err++

    const textTextSubjectChart = await textInstance.getDataToTextSubjectChart()
    textTextSubjectChart.showLog()
    if (textTextSubjectChart.status === true) ok++
    else err++

    const textTextDistributionOverTimeChart = await textInstance.getDataToTetDistributionOverTimeChart()
    textTextDistributionOverTimeChart.showLog()
    if (textTextDistributionOverTimeChart.status === true) ok++
    else err++

    const textDelete = await textInstance.delete(textCreate.lastID)
    textDelete.showLog()
    if (textDelete.status === true) ok++
    else err++

    const subjectDelete = await subjectInstance.delete(subjectCreate.lastID)
    subjectDelete.showLog()
    if (subjectDelete.status === true) ok++
    else err++

    const workspaceDelete2 = await workspaceInstance.delete(workspaceCreate2.lastID)
    workspaceDelete2.showLog()
    if (workspaceDelete2.status === true) ok++
    else err++

    console.log(`

            ++++++++++++++++++++++++++++++++++++++++++
            | OK: ${ok} - ERR: ${err}    
            ++++++++++++++++++++++++++++++++++++++++++    
        
    `)
}

module.exports = run