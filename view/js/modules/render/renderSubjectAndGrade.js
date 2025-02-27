export async function renderSubjects(){
    const gradeListDiv = document.getElementById("grade-list-content")
    
    const response = await window.api.db.global.find(true, "SELECT s.id, s.name, COALESCE(SUM(g.grade), 0) AS total_grades, s.min_grade AS min_grade, s.max_grade AS max_grade FROM subjects s LEFT JOIN grades g ON s.id = g.subjects_id GROUP BY s.id, s.name ORDER BY s.id")

    if (response.status === true) {
        const subjects = response.data
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

export async function renderEditSubject(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))

    const responseSubject = await window.api.db.global.find(true, "SELECT * FROM subjects WHERE id = ?", [id])
    const responseGrades = await window.api.db.global.find(true, "SELECT * FROM grades WHERE subjects_id = ?", [id])

    if (responseSubject.status === true && responseGrades.status === true) {
        const subject = responseSubject.data[0]
        const grades = responseGrades.data

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