if (document.getElementById("version-number") != null){
    handleGetVersion()
}

if (document.getElementById("main-tasks") != null) {
    renderTasks()
    renderPriorityPieChart()
}

if (document.getElementById("main-grades") != null) {
    renderSubjects()
    renderGradeChart()
    renderPerformancePieChart()
}

if (document.getElementById("main-home") != null) {
    renderDailyTasks()
    renderAbsences()
    renderAbsenceReasonPieChart()
    renderGradeChart()
}

if (document.getElementById("main-texts") != null) {
    renderAllTexts()
    renderTextSubjectPieChart()
    renderTextDistributionOverTime()
}

if (document.getElementById("main-edit-subject") != null) {
    renderEditSubject()
}

if (document.getElementById("main-edit-task") != null) {
    renderEditTask()
}

function formateDateToBR(dataSQLite) {
    const [year, month, day] = dataSQLite.split("-")
    return `${day}/${month}/${year}`
}

async function handleGetVersion(){
    const version = await window.api.program.getVersion()
    document.getElementById("version-number").innerText = `v${version}`
}

async function renderTasks(){
    const taskListDiv = document.getElementById("task-list-content")

    const res = await window.api.db.global.findAll("tasks")

    if (res[0] === null) {
        const tasks = res[1]

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
            taskDate.innerText = formateDateToBR(task.date)

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

async function renderSubjects(){
    const gradeListDiv = document.getElementById("grade-list-content")
    
    const resSubjects = await window.api.db.global.findQuery("SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name ORDER BY s.id")
    if (resSubjects[0] === null) {
        const subjects = resSubjects[1]
        let number = 0
        
        subjects.forEach(subject => {
            const subjectDiv = document.createElement("div")
            subjectDiv.classList.add("item")
            subjectDiv.classList.add("grade-list-item")
            subjectDiv.setAttribute("onclick", `handleEditSubject(${subject.id})`)    

            if (number == 0) {
                subjectDiv.classList.add("even")
                number = 1
            } else {
                subjectDiv.classList.add("odd")
                number = 0
            }

            const subjectName = document.createElement("p")
            subjectName.classList.add("grade-list-item-name")
            subjectName.innerText = subject.name

            const subjectGrade = document.createElement("p")
            subjectGrade.classList.add("grade-list-item-grade")
            subjectGrade.innerText = `${subject.total_grades} / ${subject.max_grade}`

            if (subject.total_grades >= subject.max_grade) {
                subjectGrade.classList.add("high-grade")
            } else if (subject.total_grades < subject.min_grade) {
                subjectGrade.classList.add("low-grade") 
            } else {
                 subjectGrade.classList.add("medium-grade")
            }

            subjectDiv.appendChild(subjectName)
            subjectDiv.appendChild(subjectGrade)
            gradeListDiv.appendChild(subjectDiv)

            const selectSubjects = document.getElementById("form-register-grade-subject")

            const option = document.createElement("option")
            option.value = subject.id
            option.innerText = subject.name

            selectSubjects.appendChild(option)
        })
    }
}

async function renderDailyTasks(){

    const currentDate = new Date()
    const formatedCurrentDate = currentDate.toLocaleDateString('sv-SE', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    const dailyTasksDiv = document.getElementById("tasks-content")

    const res = await window.api.db.global.findBy("tasks", `date = '${formatedCurrentDate}'`)

    if (res[0] === null) {
        const tasks = res[1]

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
            taskDate.innerText = formateDateToBR(task.date)

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

async function renderAllTexts(){
    const textListDiv = document.getElementById("text-list-content")

    const res = await window.api.db.global.findQuery("SELECT texts.id, texts.title, texts.text, texts.date, subjects.name AS subject_name FROM texts LEFT JOIN subjects ON texts.subjects_id = subjects.id")

    if (res[0] === null) {
        const texts = res[1]
        let number = 0

        texts.forEach(text => {
            const textDiv = document.createElement("div")
            textDiv.classList.add("item")
            textDiv.classList.add("text-list-item")
            textDiv.setAttribute("onclick", `viewText(${text.id})`)

            if (number == 0) {
                textDiv.classList.add("even")
                number = 1
            } else {
                textDiv.classList.add("odd")
                number = 0
            }

            const textName = document.createElement("p")
            textName.classList.add("text-list-item-title")
            textName.innerText = text.title

            const textDate = document.createElement("p")
            textDate.classList.add("text-list-item-date")
            textDate.innerText = formateDateToBR(text.date)

            const textSubject = document.createElement("p")
            textSubject.classList.add("text-list-item-subject")
            textSubject.innerText = text.subject_name

            textDiv.appendChild(textName)
            textDiv.appendChild(textDate)
            textDiv.appendChild(textSubject)
            textListDiv.appendChild(textDiv)
        })
    }
}

function getCurrentMonthDays() {
    let days = []
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1

    let totalDays = new Date(year, month, 0).getDate()

    for (let day = 1; day <= totalDays; day++) {
        let date = new Date(year, month - 1, day)
        let formattedDate = date.toISOString().split("T")[0] 
        days.push(formattedDate)
    }

    let initDay = new Date(year, month - 1, 1).getDay()

    return { initDay, days }
}

async function renderAbsences(){
    const absencesDiv = document.getElementById("absences-content")

    const res = await window.api.db.global.findAll("absences")

    if (res[0] === null) {
        const absences = res[1]
        const { initDay, days } = getCurrentMonthDays()

        for (let i = 0; i < initDay; i++) {
            const emptyDay = document.createElement("div")
            emptyDay.classList.add("absence-day")
            emptyDay.classList.add("empty-day")
            absencesDiv.appendChild(emptyDay)
        }

        let dayNumber = 1

        days.forEach(day => {
            const dayDiv = document.createElement("div")
            dayDiv.classList.add("absence-day")

            const dayText = document.createElement("p")
            dayText.classList.add("absence-day-text")
            dayText.innerText = dayNumber
            dayNumber++
            
            let create = true

            for (let i = 0; i < absences.length; i++) {
                const absence = absences[i]
                if (absence.date == day) {
                    dayDiv.classList.add("absence-day-checked")
                    create = false
                    break
                }
            } 

            dayDiv.setAttribute("onclick", `handleAbsence(${create},'${day}')`)
            dayDiv.appendChild(dayText)

            absencesDiv.appendChild(dayDiv)
        })

        const absenceNumber = document.createElement("p")
        absenceNumber.classList.add("absence-number")
        absenceNumber.innerText = `Faltas totais: ${absences.length}`
        absencesDiv.appendChild(absenceNumber)
    }
}

async function renderAbsenceReasonPieChart(){
    const absenceReasonCanvas = document.getElementById("absence-reason-content-canvas")

    const res = await window.api.db.global.findQuery("SELECT reason, COUNT(*) AS quantity FROM absences GROUP BY reason")

    if (res[0] === null) {
        const reasons = res[1]

        const labels = reasons.map(item => item.reason) 
        const data = reasons.map(item => item.quantity)  

        new Chart(absenceReasonCanvas, {
            type: 'pie',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Quantidade de Ausências',   
                    data: data,  
                    backgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"],
                    hoverBackgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"]                    
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const percentage = tooltipItem.raw / data.reduce((a, b) => a + b, 0) * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} ausências (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

async function renderGradeChart(){
    const gradeCanvas = document.getElementById("grade-content-canvas")

    const res = await window.api.db.global.findQuery("SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name ORDER BY s.id DESC LIMIT 3")

    if (res[0] === null) {
        const grades = res[1]

        const labels = grades.map(item => item.name) 
        const totalGrades = grades.map(item => item.total_grades)  
        const minGrades = grades.map(item => item.min_grade)
        const maxGrades = grades.map(item => item.max_grade)

        const barColors = grades.map(item => {
            if (item.total_grades >= item.max_grade) {
                return '#4CAF50' 
            } else if (item.total_grades < item.min_grade) {
                return '#f44336'
            } else {
                return '#2196F3'
            }
        })

        new Chart(gradeCanvas, {
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total de Notas',
                    data: totalGrades,
                    backgroundColor: barColors, 
                    borderColor: '#000',
                    borderWidth: 1,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y', 
                scales: {
                    x: {
                        beginAtZero: true,
                        max: Math.max(...maxGrades), 
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const percentage = tooltipItem.raw / maxGrades[tooltipItem.dataIndex] * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        })
    }
}

async function renderPerformancePieChart() {
    const performanceCanvas = document.getElementById("performance-content-canvas")

    const res = await window.api.db.global.findQuery(` SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name `)

    if (res[0] === null) {
        const grades = res[1]
        let belowMin = 0
        let atMin = 0
        let atMax = 0

        grades.forEach(item => {
            if (item.total_grades < item.min_grade) {
                belowMin++
            } else if (item.total_grades >= item.max_grade) {
                atMax++
            } else {
                atMin++
            }
        })

        const performanceData = {
            labels: [
                `Abaixo da Mínima (${belowMin})`,
                `Acima da Mínima (${atMin})`,
                `Nota Máxima (${atMax})`
            ],
            datasets: [{
                data: [belowMin, atMin, atMax],
                backgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d"],
                hoverBackgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d"],
            }]
        }

        new Chart(performanceCanvas, {
            type: 'pie',
            data: performanceData,
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalSubjects = grades.length
                                const percentage = (tooltipItem.raw / totalSubjects) * 100
                                return `${tooltipItem.label} (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        })
    }
}

async function renderPriorityPieChart() {
    const priorityCanvas = document.getElementById("priority-content-canvas")

    const res = await window.api.db.global.findQuery("SELECT priority_level, COUNT(*) AS task_count FROM tasks WHERE checked = 0 GROUP BY priority_level")

    if (res[0] === null) {
        const taskCounts = res[1]

        const labels = taskCounts.map(item => `Prioridade ${item.priority_level}`) 
        const data = taskCounts.map(item => item.task_count)  
        const colors = ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"]

        new Chart(priorityCanvas, {
            type: 'pie',
            data: {
                labels: labels, 
                datasets: [{
                    data: data,  
                    backgroundColor: colors.slice(0, data.length), 
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalTasks = data.reduce((a, b) => a + b, 0)
                                const percentage = tooltipItem.raw / totalTasks * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} tarefas (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

async function renderTextSubjectPieChart() {
    const textSubjectQuantityCanvas = document.getElementById("text-subject-quantity-content-canvas")

    const res = await window.api.db.global.findQuery(` SELECT COALESCE(s.name, 'Nenhuma') AS subject_name, COUNT(t.id) AS text_count FROM texts t LEFT JOIN subjects s ON t.subjects_id = s.id GROUP BY subject_name `)

    if (res[0] === null) {
        const subjectCounts = res[1]

        const labels = subjectCounts.map(item => item.subject_name)
        const data = subjectCounts.map(item => item.text_count)
        
        const colors = [
            "#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1", 
            "#fc77f7", "#f8f7f9", "#d6bbf2", "#ff6e6e", "#9e5ff7", "#fe875f", "#7d5a5f", "#9f8773", 
            "#f7c553", "#f593b3", "#f59d65", "#72b1b5", "#c5e6f4", "#7cd8c5", "#ff99bb", "#80cbff", 
            "#f9a7c4", "#6b6db3", "#ff4e6a", "#7dffae", "#dbfae4", "#ffdd9e"
        ]

        new Chart(textSubjectQuantityCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalTexts = data.reduce((a, b) => a + b, 0)
                                const percentage = tooltipItem.raw / totalTexts * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} textos (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

async function renderTextDistributionOverTime() {
    const textDistributionCanvas = document.getElementById("text-distribution-canvas")

    const res = await window.api.db.global.findQuery("SELECT date, COUNT(id) AS text_count FROM texts GROUP BY date ORDER BY date")

    if (res[0] === null) {
        const data = res[1]

        const labels = data.map(item => item.date) 
        const textCounts = data.map(item => item.text_count) 

        new Chart(textDistributionCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade de Textos',
                    data: textCounts,
                    borderColor: '#4CAF50',
                    fill: false,
                    borderWidth: 2,
                    pointBackgroundColor: '#4CAF50',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Quantidade',
                            font: {
                                size: 12,
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Textos: ${tooltipItem.raw}`
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        })
    }
}

async function renderEditSubject(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    const resSubject = await window.api.db.global.findBy("subjects", `id = ${id}`)
    const resGrades = await window.api.db.global.findBy("grades", `subjects_id = ${id}`)

    if ((resSubject[0] === null) && (resGrades[0] === null)) {
        const subject = resSubject[1][0]
        const grades = resGrades[1]

        const gradeContent = document.getElementById("grade-content")

        document.getElementById("subject-name").value = subject.name

        let number = 0

        grades.forEach(grade => {
            const gradeDiv = document.createElement("div")
            gradeDiv.classList.add("grade-list-item")

            if (number == 0) {
                gradeDiv.classList.add("even")
                number = 1
            } else {
                gradeDiv.classList.add("odd")
                number = 0
            }

            const gradeOrigin = document.createElement("input")
            gradeOrigin.classList.add("form-input")
            gradeOrigin.classList.add("grade-list-item-name")
            gradeOrigin.id = `grade-origin-${grade.id}`
            gradeOrigin.type = "text"
            gradeOrigin.value = grade.origin
            
            const gradeValue = document.createElement("input")
            gradeOrigin.classList.add("form-input")
            gradeValue.classList.add("grade-list-item-value")
            gradeValue.id = `grade-value-${grade.id}`
            gradeValue.type = "number"
            gradeValue.value = grade.grade

            const gradeUpdate = document.createElement("input")
            gradeUpdate.classList.add("grade-list-item-update")
            gradeUpdate.type = "button"
            gradeUpdate.value = "✔️"
            gradeUpdate.setAttribute("onclick", `handleUpdateGrade(${grade.id})`)

            const gradeDelete = document.createElement("input")
            gradeDelete.classList.add("grade-list-item-delete")
            gradeDelete.type = "button"
            gradeDelete.value = "🗑️"
            gradeDelete.setAttribute("onclick", `handleDeleteGrade(${grade.id})`)

            gradeDiv.appendChild(gradeValue)
            gradeDiv.appendChild(gradeOrigin)
            gradeDiv.appendChild(gradeUpdate)
            gradeDiv.appendChild(gradeDelete)
            gradeContent.appendChild(gradeDiv)
        })
    }
}

async function renderEditTask(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))

    const resTask = await window.api.db.global.findBy("tasks", `id = ${id}`)

    if (resTask[0] === null) {
        const task = resTask[1][0]

        document.getElementById("task-text").value = task.text
        document.getElementById("task-date").value = task.date
        const urgency = task.urgency
        const impact = task.impact 
        document.getElementById(`urgency-${urgency.toLowerCase()}`).selected = true
        document.getElementById(`impact-${impact.toLowerCase()}`).selected = true
        document.getElementById("task-completed").checked = task.checked
    }
}