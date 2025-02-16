function showMessage(message, type) {
    const messageElement = document.createElement("div")
    const messageText = document.createElement("p")

    messageElement.className = type
    messageText.innerText = message
    messageElement.appendChild(messageText)
    document.body.appendChild(messageElement)

    setTimeout(() => {
        messageElement.remove()

        if (type === "success") {
            window.location.reload()
        }

    }, 1000)
}


// Tasks
async function handlerCreateTask(){
    const text = document.getElementById('form-create-task-text').value
    const date = document.getElementById('form-create-task-date').value
    const urgencyInput = Number(document.getElementById('form-create-task-urgency').value)
    const impactInput = Number(document.getElementById('form-create-task-impact').value)

    if ((text == "") || (date == "") || (urgencyInput === 0) || (impactInput === 0)){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const options = {1: "HIGH", 2: "MEDIUM", 3: "LOW"}

    const urgency = options[urgencyInput]
    const impact = options[impactInput]

    const res = await window.api.tasks.createTask(date, text, urgency, impact)

    if (res[0] === null) {
        showMessage("Tarefa criada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao criar a tarefa", "error")
    }
}

async function handlerShowEditTask(id, index){
    if (index) {
        window.location.href = `./pages/action/edit-task.html?id=${id}`
    } else {
        window.location.href = `./action/edit-task.html?id=${id}`
    }
}

async function handlerDeleteTask(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    await window.api.tasks.removeTask(id)
    window.history.back()
}

async function handlerUpdateTask(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    const text = document.getElementById("task-text").value
    const date = document.getElementById("task-date").value
    const urgencyInput = Number(document.getElementById("form-create-task-urgency").value)
    const impactInput = Number(document.getElementById("form-create-task-impact").value)
    const completed = document.getElementById("task-completed").checked

    if ((completed === null) || (text == "") || (date == "") || (urgencyInput === 0) || (impactInput === 0)){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const options = {1: "HIGH", 2: "MEDIUM", 3: "LOW"}

    const urgency = options[urgencyInput]
    const impact = options[impactInput]

    const res = await window.api.tasks.updateTask(id, date, text, urgency, impact, completed)

    if (res[0] === null) {
        showMessage("Tarefa atualizada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao atualizar a tarefa", "error")
    }
}


// Grades
async function handlerCreateSubject(){
    const name = document.getElementById('form-create-subject-name').value
    const min_grade = Number(document.getElementById('form-create-subject-min-grade').value)
    const max_grade = Number(document.getElementById('form-create-subject-max-grade').value)

    if ((name == "") || (min_grade === 0) || (max_grade === 0)){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const res = await window.api.grades.createSubject(name, min_grade, max_grade)

    if (res[0] === null) {
        showMessage("Disciplina criada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao criar a disciplina", "error")
    }
}

async function handlerViewSubject(id){
    window.location.href = `./action/edit-subject.html?id=${id}`
}

async function handlerRegisterGrade(){
    const subjectId = Number(document.getElementById('form-register-grade-subject').value)
    const grade = Number(document.getElementById('form-register-grade-grade').value)
    const origin = document.getElementById('form-register-grade-origin').value

    if ((subjectId === 0) || (grade === 0) || (origin == "")){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const res = await window.api.grades.registerGrade(subjectId, grade, origin)

    if (res[0] === null) {
        showMessage("Nota registrada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao registrar a nota", "error")
    }
}

async function handlerDeleteGrade(id){
    const res = await window.api.grades.removeGrade(id)

    if (res[0] === null) {
        showMessage("Nota deletada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao deletar a nota", "error")
    }
}

async function handlerUpdateGrade(id){
    const origin = document.getElementById(`grade-origin-${id}`).value
    const grade = Number(document.getElementById(`grade-value-${id}`).value)

    if ((origin == "") || (grade === null) || (origin === null)){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const res = await window.api.grades.updateGrade(id, grade, origin)

    if (res[0] === null) {
        showMessage("Nota atualizada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao atualizar a nota", "error")
    }
}

async function handlerUpdateSubject(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    const name = document.getElementById("subject-name").value

    if (name == "") {
        showMessage("Preencha todos os campos", "error")
        return
    }

    const res = await window.api.grades.updateSubjectName(id, name)

    if (res[0] === null) {
        showMessage("Nome da disciplina atualizada com sucesso!", "success")
    } else {
        showMessage("Ocorreu um erro ao atualizar o nome da disciplina", "error")
    }
}


// Texts
async function handlerViewText(id){
    window.location.href = `./action/new-text.html?id=${id}`
}

async function renderAllTexts(){
    const textListDiv = document.getElementById("text-list-content")

    const res = await window.api.global.findQuery("SELECT texts.id, texts.title, texts.text, texts.date, subjects.name AS subject_name FROM texts LEFT JOIN subjects ON texts.subjects_id = subjects.id")

    if (res[0] === null) {
        const texts = res[1]
        let number = 0

        texts.forEach(text => {
            const textDiv = document.createElement("div")
            textDiv.classList.add("item")
            textDiv.classList.add("text-list-item")
            textDiv.setAttribute("onclick", `handlerViewText(${text.id})`)

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
            textDate.innerText = formatarDataBR(text.date)

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

function clearTextList(){
    const items = document.getElementsByClassName("text-list-item")

    while (items.length > 0) {
        items[0].remove()
    }
}

function formatarDataBR(dataSQLite) {
    const [year, month, day] = dataSQLite.split("-")
    return `${day}/${month}/${year}`
}

async function handlerFindText(){
    const search = document.getElementById("text-list-name").value

    if (search == "" || search == null) {
        clearTextList()
        renderAllTexts()       
        return
    }

    const res = await window.api.texts.fullTextSearch(search)

    if (res[0] === null) {
        clearTextList()
        const textListDiv = document.getElementById("text-list-content")
        const texts = res[1]
        let number = 0

        texts.forEach(text => {
            const textDiv = document.createElement("div")
            textDiv.classList.add("item")
            textDiv.classList.add("text-list-item")
            textDiv.setAttribute("onclick", `handlerViewText(${text.id})`)

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
            textDate.innerText = formatarDataBR(text.date)

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

async function handlerCreateNewText(){

    const defaultSubject = null
    const defaultTitle = "Untitled"
    const defaultContent = ""
    const date = new Date().toISOString().slice(0, 10)

    const res = await window.api.texts.createText(defaultSubject, defaultTitle, defaultContent, date)

    if (res[0] === null) {
        let lastId = await window.api.global.findQuery("SELECT id FROM texts ORDER BY id DESC LIMIT 1")
        lastId = lastId[1][0].id
        window.location.href = `./action/new-text.html?id=${lastId}`
    } else {
        showMessage("Ocorreu um erro ao criar o texto", "error")
    }
}

async function handlerUpdateText(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    const title = document.getElementById("file-name").value
    const content = document.getElementById("textarea-content").value
    const subjectId = (Number(document.getElementById("subject").value) === -1 ) ? null : Number(document.getElementById("subject").value)
    await window.api.texts.updateText(id, subjectId, title, content)
}

async function handlerDeleteText(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    await window.api.texts.removeText(id)
    window.history.back()
}

function changeVisibleConfirmDeleteText(){
    const confirmDelete = document.getElementById("confirm-delete")
    const visibility = (confirmDelete.style.display == "flex") ? "none" : "flex"
    confirmDelete.style.display = visibility
}


// Absences
let absenceDate = ""

async function handlerShowAbsenceMenu(create, date){
    if (!create){
        const res = await window.api.absences.removeAbsence(date)
        
        if (res[0] === null) {
            showMessage("Falta removida com sucesso!", "success")
        } else {
            showMessage("Ocorreu um erro ao remover a falta", "error")
        }
        return
    } else {
        document.getElementById("confirm-absence").style.display = "flex"
        absenceDate = date
    }
}

function hideConfirmAbsence(){
    document.getElementById("confirm-absence").style.display = "none"
}

async function handlerRegisterAbsence(){
    const date = absenceDate
    const reason = document.getElementById("absence-reason-select").value

    if (reason == "" || reason == null || reason == 0 || date == "" || date == null){
        showMessage("Preencha todos os campos", "error")
        return
    }

    const res = await window.api.absences.registerAbsence(date, reason)

    if (res[0] === null) {
        showMessage("Falta registrada com sucesso!", "success")
        absenceDate = ""

    } else {
        showMessage("Ocorreu um erro ao registrar a falta", "error")
    }
}

async function handlerDeleteSubject(){
    const parameters = new URLSearchParams(window.location.search)
    const id = Number(parameters.get("id"))
    await window.api.grades.removeSubject(id)
    window.history.back()
}