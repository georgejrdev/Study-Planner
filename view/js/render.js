import * as chart from "./charts.js"
import * as utils from "./utils.js"
import * as workspace from "./modules/render/renderWorkspace.js"
import * as task from "./modules/render/renderTask.js"
import * as subjectAndGrade from "./modules/render/renderSubjectAndGrade.js"
import * as text from "./modules/render/renderText.js"
import * as absence from "./modules/render/renderAbsence.js"

if (document.getElementById("version-number") != null){
    utils.handleGetVersion()
}

if (document.getElementById("workspace-selector") != null) {
    workspace.renderWorkspaces()
}

if (document.getElementById("main-tasks") != null) {
    task.renderTasks()
    chart.renderPriorityChart()
}

if (document.getElementById("main-grades") != null) {
    subjectAndGrade.renderSubjects()
    chart.renderGradeChart()
    chart.renderPerformanceChart()
}

if (document.getElementById("main-home") != null) {
    absence.renderAbsences()
    task.renderDailyTasks()
    chart.renderAbsenceReasonChart()
    chart.renderGradeChart()
    utils.handleIsNewRelease()
}

if (document.getElementById("main-texts") != null) {
    text.renderAllTexts()
    chart.renderTextSubjectChart()
    chart.renderTextDistributionOverTime()
}

if (document.getElementById("main-edit-subject") != null) {
    subjectAndGrade.renderEditSubject()
}

if (document.getElementById("main-edit-task") != null) {
    task.renderEditTask()
}