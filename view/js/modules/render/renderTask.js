import * as utils from "../../utils.js"

export async function renderTasks(){
    const taskListDiv = document.getElementById("task-list-content")

    const response = await window.api.db.global.find(true, "SELECT * FROM tasks")

    if (response.status === true) {
        const tasks = response.data

        let number = 0

        tasks.forEach(task => {
            const taskDiv = document.createElement("div")
            taskDiv.classList.add("item")
            taskDiv.classList.add("task-list-item")
            taskDiv.setAttribute("onclick", `handleShowTask(${task.id}, ${false})`)

            if (number == 0) {
                taskDiv.classList.add("even")
                number = 1
            } else {
                taskDiv.classList.add("odd")
                number = 0
            }

            const taskText = document.createElement("p")
            taskText.classList.add("task-list-item-text")
            taskText.innerText = task.text

            const taskDate = document.createElement("p")
            taskDate.classList.add("task-list-item-date")
            taskDate.innerText = utils.formateDateToBrazilianFormat(task.date)

            if (task.checked) {
                taskText.classList.add("checked-task")
                taskDate.classList.add("checked-task")
            }

            taskDiv.appendChild(taskText)
            taskDiv.appendChild(taskDate)

            taskListDiv.appendChild(taskDiv)
        })
    }
}

export async function renderDailyTasks(){

    const currentDate = new Date()
    const formatedCurrentDate = currentDate.toLocaleDateString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    const dailyTasksDiv = document.getElementById("tasks-content")

    const response = await window.api.db.global.find(true, "SELECT * FROM tasks WHERE date = ?", [formatedCurrentDate])

    if (response.status === true) {
        const tasks = response.data

        let number = 0

        tasks.forEach(task => {
            const taskDiv = document.createElement("div")
            taskDiv.classList.add("item")
            taskDiv.classList.add("task-list-item")
            taskDiv.setAttribute("onclick", `handleShowTask(${task.id}, ${true})`)

            if (number == 0) {
                taskDiv.classList.add("even")
                number = 1
            } else {
                taskDiv.classList.add("odd")
                number = 0
            }

            const taskText = document.createElement("p")
            taskText.classList.add("task-list-item-text")
            taskText.innerText = task.text

            const taskDate = document.createElement("p")
            taskDate.classList.add("task-list-item-date")
            taskDate.innerText = utils.formateDateToBrazilianFormat(task.date)

            if (task.checked) {
                taskText.classList.add("checked-task")
                taskDate.classList.add("checked-task")
            }

            taskDiv.appendChild(taskText)
            taskDiv.appendChild(taskDate)

            dailyTasksDiv.appendChild(taskDiv)
        })
    }
}

export async function renderEditTask(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))

    const response = await window.api.db.global.find(true, "SELECT * FROM tasks WHERE id = ?", [id])

    if (response.status === true) {
        const task = response.data[0]

        document.getElementById("task-text").value = task.text
        document.getElementById("task-date").value = task.date
        const urgency = task.urgency
        const impact = task.impact 
        document.getElementById(`urgency-${urgency.toLowerCase()}`).selected = true
        document.getElementById(`impact-${impact.toLowerCase()}`).selected = true
        document.getElementById("task-completed").checked = task.checked
    }
}